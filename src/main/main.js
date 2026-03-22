import { app, BrowserWindow, ipcMain, protocol, net, shell, Menu, Notification } from "electron";
import path from "path";
import { existsSync, readFileSync } from "fs";
import { pathToFileURL } from "url";
import { createRequire } from "module";
import { randomUUID } from "crypto";
import Database from "./database.js";

const isDev = process.argv.includes("--dev");
const appRoot = process.env.KEMPO_APP_ROOT || process.cwd();
const frameworkRoot = path.join(import.meta.dirname, "..", "..");
const appRequire = createRequire(path.join(appRoot, "package.json"));

const pkg = JSON.parse(readFileSync(path.join(appRoot, "package.json"), "utf-8"));
const schemeName = pkg.protocolName || "kempo-app";
const appName = pkg.appName || pkg.name || "Kempo App";
const appIcon = pkg.appIcon ? path.join(appRoot, pkg.appIcon) : undefined;

let db;
const pendingContextItems = new Map();

/*
  Custom Protocol
*/

protocol.registerSchemesAsPrivileged([{
  scheme: schemeName,
  privileges: { standard: true, secure: true, supportFetchAPI: true },
}]);

app.setAsDefaultProtocolClient(schemeName);
if(process.platform === "win32") app.setAppUserModelId(appName);

if(!app.requestSingleInstanceLock()) app.quit();

/*
  Unified Open Events (deep links + file associations)
*/

const getFilePath = argv => argv.slice(1).find(arg => !arg.startsWith("-") && !arg.includes("://"));

app.on("open-url", (event, url) => {
  event.preventDefault();
  app.emit("open-link", url);
});

app.on("open-file", (event, filePath) => {
  event.preventDefault();
  app.emit("open-path", filePath);
});

app.on("second-instance", (event, argv) => {
  const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
  win?.focus();
  const url = argv.find(arg => arg.startsWith(`${schemeName}://`));
  if(url) app.emit("open-link", url);
  const filePath = getFilePath(argv);
  if(filePath) app.emit("open-path", filePath);
});

const resolvePath = pathname => {
  if(pathname.startsWith("/framework/")) return path.join(frameworkRoot, pathname.slice("/framework".length));
  if(pathname.startsWith("/modules/")){
    const modulePath = pathname.slice("/modules/".length);
    const parts = modulePath.split("/");
    const pkgName = parts[0].startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
    const rest = parts.slice(pkgName.split("/").length).join("/");
    const pkgDir = path.dirname(appRequire.resolve(`${pkgName}/package.json`));
    return path.join(pkgDir, rest);
  }
  return path.join(appRoot, pathname);
};

/*
  Window
*/

const createWindow = (hash) => {
  const isMac = process.platform === "darwin";

  const win = new BrowserWindow({
    ...(db.get("settings", "windowBounds") || { width: 1200, height: 800 }),
    minWidth: 600,
    minHeight: 400,
    title: appName,
    icon: appIcon,
    frame: false,
    titleBarStyle: isMac ? "hiddenInset" : "default",
    trafficLightPosition: isMac ? { x: 12, y: 12 } : undefined,
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const hashStr = hash ? `#${hash.replace(/^#/, "")}` : "";
  win.loadURL(`${schemeName}://app/framework/src/renderer/index.html${hashStr}`);

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.on("context-menu", (e, params) => {
    setImmediate(() => {
      const extra = (pendingContextItems.get(win.webContents.id) || []).map(item => ({
        ...item,
        click: () => win.webContents.send("contextmenu:click", item.id),
      }));
      pendingContextItems.delete(win.webContents.id);

      const defaults = [];
      if(params.isEditable) defaults.push({ role: "cut" }, { role: "copy" }, { role: "paste" });
      else if(params.selectionText) defaults.push({ role: "copy" });

      const sep1 = extra.length && defaults.length ? [{ type: "separator" }] : [];
      const sep2 = (extra.length || defaults.length) && isDev ? [{ type: "separator" }] : [];
      const devItems = isDev ? [{ label: "Inspect Element", click: () => win.webContents.inspectElement(params.x, params.y) }] : [];

      const allItems = [...extra, ...sep1, ...defaults, ...sep2, ...devItems];
      if(allItems.length) Menu.buildFromTemplate(allItems).popup({ window: win });
    });
  });

  if(isDev){
    win.webContents.openDevTools();
    win.webContents.on("before-input-event", (e, input) => {
      if(input.type === "keyDown" && input.key === "F12"){
        win.webContents.toggleDevTools();
      }
    });
  }

  const saveBounds = () => {
    if(!win.isMaximized() && !win.isMinimized()){
      db.set("settings", "windowBounds", win.getBounds());
    }
  };
  win.on("resize", saveBounds);
  win.on("move", saveBounds);

  win.on("maximize", () => win.webContents.send("window:maximize-change", true));
  win.on("unmaximize", () => win.webContents.send("window:maximize-change", false));

  return win;
};

app.whenReady().then(async () => {
  db = new Database();

  /*
    Protocol Handler
  */

  protocol.handle(schemeName, async request => {
    try {
      const pathname = decodeURIComponent(new URL(request.url).pathname);
      const res = await net.fetch(pathToFileURL(resolvePath(pathname)).href, { cache: "no-store" });
      const headers = new Headers(res.headers);
      headers.set("Cache-Control", "no-store");
      return new Response(res.body, { status: res.status, headers });
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  });

  /*
    IPC Handlers
  */

  ipcMain.handle("db:get", (e, table, key) => db.get(table, key));
  ipcMain.handle("db:set", (e, table, key, value) => db.set(table, key, value));
  ipcMain.handle("db:delete", (e, table, key) => db.delete(table, key));
  ipcMain.handle("db:has", (e, table, key) => db.has(table, key));
  ipcMain.handle("db:clear", (e, table) => db.clear(table));

  const getWindow = e => BrowserWindow.fromWebContents(e.sender);

  ipcMain.on("window:minimize", e => getWindow(e)?.minimize());
  ipcMain.on("window:maximize", e => {
    const win = getWindow(e);
    if(win?.isMaximized()) win.unmaximize();
    else win?.maximize();
  });
  ipcMain.on("window:close", e => getWindow(e)?.close());
  ipcMain.on("window:new", (e, hash) => createWindow(hash));

  ipcMain.handle("platform", () => ({ darwin: "mac", win32: "win" })[process.platform] ?? process.platform);
  ipcMain.handle("window:isMaximized", e => getWindow(e)?.isMaximized() ?? false);
  ipcMain.handle("app:name", () => appName);
  ipcMain.handle("app:isDev", () => isDev);
  ipcMain.handle("notification:isSupported", () => Notification.isSupported());
  ipcMain.on("window:toggleDevTools", e => getWindow(e)?.webContents.toggleDevTools());

  ipcMain.on("contextmenu:extra-items", (e, items) => { pendingContextItems.set(e.sender.id, items); });

  ipcMain.handle("notification:show", (e, options) => {
    if(!Notification.isSupported()) return null;
    const id = randomUUID();
    const icon = options?.icon ? resolvePath(options.icon) : appIcon;
    const n = new Notification({
      title: String(options?.title ?? appName),
      body: String(options?.body ?? ""),
      icon,
      silent: options?.silent,
      subtitle: options?.subtitle,
      urgency: options?.urgency,
      timeoutType: options?.timeoutType,
    });
    n.on("click", () => e.sender.send("notification:click", id));
    n.on("close", () => e.sender.send("notification:close", id));
    n.on("reply", (event, reply) => e.sender.send("notification:reply", id, reply));
    n.show();
    return id;
  });

  /*
    Backend Hook
  */

  const backendPath = path.join(appRoot, "backend.js");
  if(existsSync(backendPath)){
    try {
      const { default: setup } = await import(pathToFileURL(backendPath).href);
      if(typeof setup === "function") setup({ db, ipc: ipcMain, app, Menu });
    } catch(e) {
      console.error("backend.js:", e);
    }
  }

  // Emit cold-launch open events after backend hook so listeners are registered
  const initialUrl = process.argv.find(arg => arg.startsWith(`${schemeName}://`));
  if(initialUrl) app.emit("open-link", initialUrl);
  const initialFile = getFilePath(process.argv);
  if(initialFile) app.emit("open-path", initialFile);

  createWindow();

  app.on("activate", () => {
    if(BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if(process.platform !== "darwin") app.quit();
});

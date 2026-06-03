import { app, BrowserWindow, ipcMain, protocol, net, shell, Menu, Notification } from "electron";
import path from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";
import fs from "fs/promises";
import { pathToFileURL } from "url";
import { createRequire } from "module";
import { randomUUID } from "crypto";
import Database from "./database.js";
import syncSchemas, { primaryKey } from "./schema.js";
import { getSqlDB, query, sqlDBs } from "./sqlQuery.js";

const isDev = process.argv.includes("--dev");
const appRoot = process.env.KEMPO_APP_ROOT || process.cwd();
const frameworkRoot = path.join(import.meta.dirname, "..", "..");
const appRequire = createRequire(path.join(appRoot, "package.json"));

const pkg = JSON.parse(readFileSync(path.join(appRoot, "package.json"), "utf-8"));
const kempoConfig = pkg["kempo-app"] || {};
const schemeName = kempoConfig.protocolName || "kempo-app";
const appName = kempoConfig.appName || pkg.name || "Kempo App";
const appIcon = kempoConfig.appIcon ? path.join(appRoot, kempoConfig.appIcon) : undefined;
const defaultShell = kempoConfig.shell || "shell.html";
const defaultTitlebar = kempoConfig.titlebar === false ? "false" : kempoConfig.titlebar === true || kempoConfig.titlebar === undefined ? "titlebar.html" : kempoConfig.titlebar;
const defaultPages = kempoConfig.pages || "pages";
const defaultMenuBar = kempoConfig.menuBar === true;

let db;
let schemaMap = {};
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

    let pkgDir;
    try {
      // Try to resolve package.json (this may fail if exports field restricts it)
      pkgDir = path.dirname(appRequire.resolve(`${pkgName}/package.json`));
    } catch {
      // Fallback: look for the module in node_modules
      const searchPaths = appRequire.resolve.paths(pkgName);
      if(searchPaths && searchPaths.length > 0) {
        // searchPaths contains node_modules directories, use the first one
        const nodeModulesDir = searchPaths[0];
        pkgDir = path.join(nodeModulesDir, pkgName);
      } else {
        // Last resort: construct the path assuming it's in node_modules
        pkgDir = path.join(appRoot, 'node_modules', pkgName);
      }
    }

    const resolvedPath = path.join(pkgDir, rest);
    return resolvedPath;
  }
  return path.join(appRoot, pathname);
};

/*
  Window
*/

const createWindow = (options = {}) => {
  if(typeof options === "string") options = { hash: options };
  const { hash, shell: shellFile = defaultShell, titlebar = defaultTitlebar, pages = defaultPages, menuBar = defaultMenuBar } = options;
  const nativeFrame = titlebar === true;
  const isMac = process.platform === "darwin";

  const win = new BrowserWindow({
    ...(db.get("settings", "windowBounds") || { width: 1200, height: 800 }),
    minWidth: 600,
    minHeight: 400,
    title: appName,
    icon: appIcon,
    frame: nativeFrame,
    autoHideMenuBar: nativeFrame && !menuBar,
    titleBarStyle: !nativeFrame && isMac ? "hiddenInset" : "default",
    trafficLightPosition: !nativeFrame && isMac ? { x: 12, y: 12 } : undefined,
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const searchParams = new URLSearchParams({ shell: shellFile, titlebar: nativeFrame ? "false" : titlebar, pages });
  const hashStr = hash ? `#${hash.replace(/^#/, "")}` : "";
  win.loadURL(`${schemeName}://app/framework/src/renderer/index.html?${searchParams}${hashStr}`);

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
      const resolvedPath = resolvePath(pathname);
      const fileUrl = pathToFileURL(resolvedPath).href;
      const res = await net.fetch(fileUrl, { cache: "no-store" });
      const headers = new Headers(res.headers);
      headers.set("Cache-Control", "no-store");
      return new Response(res.body, { status: res.status, headers });
    } catch (err) {
      console.error(`Failed to load ${request.url}:`, err.message);
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

  /*
    SQL Database
  */

  ipcMain.handle("sqlDB:query", (e, dbName, sql) => query(dbName, sql));

  app.on("before-quit", () => {
    for(const instance of sqlDBs.values()) instance.close();
    sqlDBs.clear();
  });

  /*
    Schema CRUD
  */



  const getWindow = e => BrowserWindow.fromWebContents(e.sender);

  ipcMain.on("window:minimize", e => getWindow(e)?.minimize());
  ipcMain.on("window:maximize", e => {
    const win = getWindow(e);
    if(win?.isMaximized()) win.unmaximize();
    else win?.maximize();
  });
  ipcMain.on("window:close", e => getWindow(e)?.close());
  ipcMain.on("window:new", (e, options) => createWindow(options));

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
    File System
  */

  ipcMain.handle("fs:readFile", (e, filePath, encoding) => fs.readFile(filePath, encoding || "utf-8"));
  ipcMain.handle("fs:writeFile", (e, filePath, data, encoding) => fs.writeFile(filePath, data, encoding || "utf-8"));
  ipcMain.handle("fs:appendFile", (e, filePath, data, encoding) => fs.appendFile(filePath, data, encoding || "utf-8"));
  ipcMain.handle("fs:readDir", (e, dirPath) => fs.readdir(dirPath));
  ipcMain.handle("fs:mkdir", (e, dirPath, options) => fs.mkdir(dirPath, options));
  ipcMain.handle("fs:rm", (e, filePath, options) => fs.rm(filePath, options));
  ipcMain.handle("fs:exists", async (e, filePath) => {
    try { await fs.access(filePath); return true; }
    catch { return false; }
  });
  ipcMain.handle("fs:stat", async (e, filePath) => {
    const s = await fs.stat(filePath);
    return {
      size: s.size,
      isFile: s.isFile(),
      isDirectory: s.isDirectory(),
      isSymbolicLink: s.isSymbolicLink(),
      createdAt: s.birthtime.toISOString(),
      modifiedAt: s.mtime.toISOString(),
      accessedAt: s.atime.toISOString(),
    };
  });
  ipcMain.handle("fs:rename", (e, oldPath, newPath) => fs.rename(oldPath, newPath));
  ipcMain.handle("fs:copyFile", (e, src, dest) => fs.copyFile(src, dest));

  /*
    Global API — mirrors renderer api so the same code works in both contexts.
    When adding a new method here, always add an identical one to preload.cjs.
  */

  const platformName = ({ darwin: "mac", win32: "win" })[process.platform] ?? process.platform;

  global.api = {
    jsonDB: (table) => ({
      get: async (key) => db.get(table, key),
      set: async (key, value) => db.set(table, key, value),
      delete: async (key) => db.delete(table, key),
      has: async (key) => db.has(table, key),
      clear: async () => db.clear(table),
    }),
    sqlQuery: async (dbName, sql) => query(dbName, sql),
    window: {
      minimize: () => BrowserWindow.getFocusedWindow()?.minimize(),
      maximize: () => {
        const win = BrowserWindow.getFocusedWindow();
        if(win?.isMaximized()) win.unmaximize();
        else win?.maximize();
      },
      close: () => BrowserWindow.getFocusedWindow()?.close(),
      new: (options) => createWindow(typeof options === "string" ? { hash: options } : options),
      isMaximized: async () => BrowserWindow.getFocusedWindow()?.isMaximized() ?? false,
      onMaximizeChange: () => {},
    },
    getPlatform: async () => platformName,
    getAppName: async () => appName,
    isDev: async () => isDev,
    toggleDevTools: () => BrowserWindow.getFocusedWindow()?.webContents.toggleDevTools(),
    notification: {
      show: async (options) => {
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
        n.show();
        return id;
      },
      isSupported: async () => Notification.isSupported(),
    },
    contextMenu: {
      show: () => {},
      onClick: () => {},
    },
    fs: {
      readFile: (filePath, encoding) => fs.readFile(filePath, encoding || "utf-8"),
      writeFile: (filePath, data, encoding) => fs.writeFile(filePath, data, encoding || "utf-8"),
      appendFile: (filePath, data, encoding) => fs.appendFile(filePath, data, encoding || "utf-8"),
      readDir: dirPath => fs.readdir(dirPath),
      mkdir: (dirPath, options) => fs.mkdir(dirPath, options),
      rm: (filePath, options) => fs.rm(filePath, options),
      exists: async filePath => {
        try { await fs.access(filePath); return true; }
        catch { return false; }
      },
      stat: async filePath => {
        const s = await fs.stat(filePath);
        return {
          size: s.size,
          isFile: s.isFile(),
          isDirectory: s.isDirectory(),
          isSymbolicLink: s.isSymbolicLink(),
          createdAt: s.birthtime.toISOString(),
          modifiedAt: s.mtime.toISOString(),
          accessedAt: s.atime.toISOString(),
        };
      },
      rename: (oldPath, newPath) => fs.rename(oldPath, newPath),
      copyFile: (src, dest) => fs.copyFile(src, dest),
    },
  };

  /*
    Lifecycle Hooks
  */

  const versionFile = path.join(app.getPath("userData"), ".version");
  const currentVersion = pkg.version || "0.0.0";
  const storedVersion = existsSync(versionFile) ? readFileSync(versionFile, "utf-8").trim() : null;
  const hookContext = { ipc: ipcMain, app, Menu };

  if(!storedVersion){
    const initPath = path.join(appRoot, "init.js");
    if(existsSync(initPath)){
      try {
        const { default: init } = await import(pathToFileURL(initPath).href);
        if(typeof init === "function") await init(hookContext);
      } catch(e){
        console.error("init.js:", e);
      }
    }
  } else if(storedVersion !== currentVersion){
    const updatePath = path.join(appRoot, "update.js");
    if(existsSync(updatePath)){
      try {
        const { default: update } = await import(pathToFileURL(updatePath).href);
        if(typeof update === "function") await update({ ...hookContext, from: storedVersion, to: currentVersion });
      } catch(e){
        console.error("update.js:", e);
      }
    }
  }

  writeFileSync(versionFile, currentVersion);

  /*
    Schema Sync
  */

  const schemaDir = path.join(appRoot, "schema");
  if(existsSync(schemaDir)){
    try {
      schemaMap = await syncSchemas(getSqlDB, schemaDir);
    } catch(e){
      console.error("schema sync:", e);
    }
  }

  /*
    Backend Hook
  */

  const backendPath = path.join(appRoot, "backend.js");
  if(existsSync(backendPath)){
    try {
      const { default: setup } = await import(pathToFileURL(backendPath).href);
      if(typeof setup === "function") setup(hookContext);
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

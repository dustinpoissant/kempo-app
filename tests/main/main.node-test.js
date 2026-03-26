import path from "path";
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from "fs";
import os from "os";

/*
  Test utility functions from main.js
  These are extracted and tested independently since main.js
  cannot be imported outside Electron
*/

const frameworkRoot = path.resolve(".");
const appRoot = path.resolve("./example");

const resolvePath = pathname => {
  if(pathname.startsWith("/framework/")) return path.join(frameworkRoot, pathname.slice("/framework".length));
  if(pathname.startsWith("/modules/")){
    const modulePath = pathname.slice("/modules/".length);
    const parts = modulePath.split("/");
    const pkgName = parts[0].startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
    const rest = parts.slice(pkgName.split("/").length).join("/");
    const pkgDir = path.join(appRoot, "node_modules", pkgName);
    return path.join(pkgDir, rest);
  }
  return path.join(appRoot, pathname);
};

const getFilePath = argv => argv.slice(1).find(arg => !arg.startsWith("-") && !arg.includes("://"));

export default {
  /*
    resolvePath
  */

  'resolvePath: /framework/ maps to framework root': ({ pass, fail }) => {
    const result = resolvePath("/framework/src/renderer/index.html");
    const expected = path.join(frameworkRoot, "/src/renderer/index.html");
    if(result === expected) pass();
    else fail(`Expected ${expected}, got ${result}`);
  },

  'resolvePath: /modules/ maps to node_modules': ({ pass, fail }) => {
    const result = resolvePath("/modules/kempo-ui/dist/lit-all.min.js");
    const expected = path.join(appRoot, "node_modules", "kempo-ui", "dist", "lit-all.min.js");
    if(result === expected) pass();
    else fail(`Expected ${expected}, got ${result}`);
  },

  'resolvePath: /modules/ handles scoped packages': ({ pass, fail }) => {
    const result = resolvePath("/modules/@scope/pkg/file.js");
    const expected = path.join(appRoot, "node_modules", "@scope", "pkg", "file.js");
    if(result === expected) pass();
    else fail(`Expected ${expected}, got ${result}`);
  },

  'resolvePath: root paths map to app root': ({ pass, fail }) => {
    const result = resolvePath("/app.html");
    const expected = path.join(appRoot, "app.html");
    if(result === expected) pass();
    else fail(`Expected ${expected}, got ${result}`);
  },

  'resolvePath: nested root paths map correctly': ({ pass, fail }) => {
    const result = resolvePath("/pages/home.html");
    const expected = path.join(appRoot, "pages", "home.html");
    if(result === expected) pass();
    else fail(`Expected ${expected}, got ${result}`);
  },

  /*
    getFilePath
  */

  'getFilePath: returns file path from argv': ({ pass, fail }) => {
    const result = getFilePath(["electron", "myfile.txt"]);
    if(result === "myfile.txt") pass();
    else fail(`Expected "myfile.txt", got ${result}`);
  },

  'getFilePath: skips flags': ({ pass, fail }) => {
    const result = getFilePath(["electron", "--dev", "myfile.txt"]);
    if(result === "myfile.txt") pass();
    else fail(`Expected "myfile.txt", got ${result}`);
  },

  'getFilePath: skips protocol URLs': ({ pass, fail }) => {
    const result = getFilePath(["electron", "kempo-app://open/something", "myfile.txt"]);
    if(result === "myfile.txt") pass();
    else fail(`Expected "myfile.txt", got ${result}`);
  },

  'getFilePath: returns undefined when no file path': ({ pass, fail }) => {
    const result = getFilePath(["electron", "--dev", "--flag"]);
    if(result === undefined) pass();
    else fail(`Expected undefined, got ${result}`);
  },

  'getFilePath: returns undefined for only protocol URLs': ({ pass, fail }) => {
    const result = getFilePath(["electron", "app://link"]);
    if(result === undefined) pass();
    else fail(`Expected undefined, got ${result}`);
  },

  /*
    package.json fields
  */

  'package.json is valid JSON': ({ pass, fail }) => {
    try {
      const pkg = JSON.parse(readFileSync(path.join(frameworkRoot, "package.json"), "utf-8"));
      if(pkg.name && pkg.version) pass();
      else fail("Missing name or version");
    } catch(e) {
      fail(`Invalid JSON: ${e.message}`);
    }
  },

  'package.json has type: module': ({ pass, fail }) => {
    const pkg = JSON.parse(readFileSync(path.join(frameworkRoot, "package.json"), "utf-8"));
    if(pkg.type === "module") pass();
    else fail(`Expected type "module", got "${pkg.type}"`);
  },

  'package.json has main entry point': ({ pass, fail }) => {
    const pkg = JSON.parse(readFileSync(path.join(frameworkRoot, "package.json"), "utf-8"));
    if(pkg.main === "src/main/main.js") pass();
    else fail(`Expected main "src/main/main.js", got "${pkg.main}"`);
  },

  'package.json has bin entries': ({ pass, fail }) => {
    const pkg = JSON.parse(readFileSync(path.join(frameworkRoot, "package.json"), "utf-8"));
    if(pkg.bin && pkg.bin["kempo-app"] && pkg.bin["kempo-interact"]) pass();
    else fail("Missing bin entries");
  },

  /*
    Lifecycle hooks — version detection logic
  */

  'lifecycle: first run detected when no .version file': ({ pass, fail }) => {
    const tmpDir = path.join(os.tmpdir(), `kempo-test-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });
    try {
      const versionFile = path.join(tmpDir, ".version");
      const storedVersion = existsSync(versionFile) ? readFileSync(versionFile, "utf-8").trim() : null;
      if(storedVersion === null) pass();
      else fail(`Expected null, got "${storedVersion}"`);
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  },

  'lifecycle: version written after first run': ({ pass, fail }) => {
    const tmpDir = path.join(os.tmpdir(), `kempo-test-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });
    try {
      const versionFile = path.join(tmpDir, ".version");
      const currentVersion = "1.0.0";
      writeFileSync(versionFile, currentVersion);
      const stored = readFileSync(versionFile, "utf-8").trim();
      if(stored === currentVersion) pass();
      else fail(`Expected "${currentVersion}", got "${stored}"`);
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  },

  'lifecycle: update detected when version changes': ({ pass, fail }) => {
    const tmpDir = path.join(os.tmpdir(), `kempo-test-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });
    try {
      const versionFile = path.join(tmpDir, ".version");
      writeFileSync(versionFile, "1.0.0");
      const currentVersion = "2.0.0";
      const storedVersion = readFileSync(versionFile, "utf-8").trim();
      if(storedVersion !== currentVersion && storedVersion !== null) pass();
      else fail(`Expected version mismatch, stored="${storedVersion}" current="${currentVersion}"`);
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  },

  'lifecycle: no hook when version matches': ({ pass, fail }) => {
    const tmpDir = path.join(os.tmpdir(), `kempo-test-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });
    try {
      const versionFile = path.join(tmpDir, ".version");
      const currentVersion = "1.0.0";
      writeFileSync(versionFile, currentVersion);
      const storedVersion = readFileSync(versionFile, "utf-8").trim();
      const isFirstRun = storedVersion === null;
      const isUpdate = storedVersion !== null && storedVersion !== currentVersion;
      if(!isFirstRun && !isUpdate) pass();
      else fail(`Expected no hook, isFirstRun=${isFirstRun} isUpdate=${isUpdate}`);
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  },

  'lifecycle: version defaults to 0.0.0 when missing': ({ pass, fail }) => {
    const currentVersion = undefined || "0.0.0";
    if(currentVersion === "0.0.0") pass();
    else fail(`Expected "0.0.0", got "${currentVersion}"`);
  },

  /*
    kempoConfig parsing
    Reimplements the config extraction logic from main.js
  */

  'kempoConfig: reads from kempo-app field': ({ pass, fail }) => {
    const pkg = { "kempo-app": { appName: "Test App" } };
    const kempoConfig = pkg["kempo-app"] || {};
    if(kempoConfig.appName === "Test App") pass();
    else fail(`Expected "Test App", got "${kempoConfig.appName}"`);
  },

  'kempoConfig: defaults to empty object when missing': ({ pass, fail }) => {
    const pkg = {};
    const kempoConfig = pkg["kempo-app"] || {};
    if(Object.keys(kempoConfig).length === 0) pass();
    else fail(`Expected empty object, got ${JSON.stringify(kempoConfig)}`);
  },

  'kempoConfig: schemeName defaults to kempo-app': ({ pass, fail }) => {
    const kempoConfig = {};
    const schemeName = kempoConfig.protocolName || "kempo-app";
    if(schemeName === "kempo-app") pass();
    else fail(`Expected "kempo-app", got "${schemeName}"`);
  },

  'kempoConfig: schemeName uses protocolName': ({ pass, fail }) => {
    const kempoConfig = { protocolName: "my-protocol" };
    const schemeName = kempoConfig.protocolName || "kempo-app";
    if(schemeName === "my-protocol") pass();
    else fail(`Expected "my-protocol", got "${schemeName}"`);
  },

  'kempoConfig: appName falls back to pkg.name then default': ({ pass, fail }) => {
    const kempoConfig = {};
    const pkg1 = { name: "my-pkg" };
    const name1 = kempoConfig.appName || pkg1.name || "Kempo App";
    const pkg2 = {};
    const name2 = kempoConfig.appName || pkg2.name || "Kempo App";
    if(name1 === "my-pkg" && name2 === "Kempo App") pass();
    else fail(`Expected "my-pkg"/"Kempo App", got "${name1}"/"${name2}"`);
  },

  'kempoConfig: appName prefers kempo-app field': ({ pass, fail }) => {
    const kempoConfig = { appName: "Custom Name" };
    const pkg = { name: "pkg-name" };
    const appName = kempoConfig.appName || pkg.name || "Kempo App";
    if(appName === "Custom Name") pass();
    else fail(`Expected "Custom Name", got "${appName}"`);
  },

  'kempoConfig: shell defaults to shell.html': ({ pass, fail }) => {
    const kempoConfig = {};
    const defaultShell = kempoConfig.shell || "shell.html";
    if(defaultShell === "shell.html") pass();
    else fail(`Expected "shell.html", got "${defaultShell}"`);
  },

  'kempoConfig: shell uses custom value': ({ pass, fail }) => {
    const kempoConfig = { shell: "editor-shell.html" };
    const defaultShell = kempoConfig.shell || "shell.html";
    if(defaultShell === "editor-shell.html") pass();
    else fail(`Expected "editor-shell.html", got "${defaultShell}"`);
  },

  'kempoConfig: titlebar defaults to titlebar.html': ({ pass, fail }) => {
    const kempoConfig = {};
    const defaultTitlebar = kempoConfig.titlebar === false ? "false" : kempoConfig.titlebar === true || kempoConfig.titlebar === undefined ? "titlebar.html" : kempoConfig.titlebar;
    if(defaultTitlebar === "titlebar.html") pass();
    else fail(`Expected "titlebar.html", got "${defaultTitlebar}"`);
  },

  'kempoConfig: titlebar false becomes string "false"': ({ pass, fail }) => {
    const kempoConfig = { titlebar: false };
    const defaultTitlebar = kempoConfig.titlebar === false ? "false" : kempoConfig.titlebar === true || kempoConfig.titlebar === undefined ? "titlebar.html" : kempoConfig.titlebar;
    if(defaultTitlebar === "false") pass();
    else fail(`Expected "false", got "${defaultTitlebar}"`);
  },

  'kempoConfig: titlebar true becomes titlebar.html': ({ pass, fail }) => {
    const kempoConfig = { titlebar: true };
    const defaultTitlebar = kempoConfig.titlebar === false ? "false" : kempoConfig.titlebar === true || kempoConfig.titlebar === undefined ? "titlebar.html" : kempoConfig.titlebar;
    if(defaultTitlebar === "titlebar.html") pass();
    else fail(`Expected "titlebar.html", got "${defaultTitlebar}"`);
  },

  'kempoConfig: titlebar uses custom string': ({ pass, fail }) => {
    const kempoConfig = { titlebar: "custom-bar.html" };
    const defaultTitlebar = kempoConfig.titlebar === false ? "false" : kempoConfig.titlebar === true || kempoConfig.titlebar === undefined ? "titlebar.html" : kempoConfig.titlebar;
    if(defaultTitlebar === "custom-bar.html") pass();
    else fail(`Expected "custom-bar.html", got "${defaultTitlebar}"`);
  },

  'kempoConfig: pages defaults to pages': ({ pass, fail }) => {
    const kempoConfig = {};
    const defaultPages = kempoConfig.pages || "pages";
    if(defaultPages === "pages") pass();
    else fail(`Expected "pages", got "${defaultPages}"`);
  },

  'kempoConfig: pages uses custom value': ({ pass, fail }) => {
    const kempoConfig = { pages: "views" };
    const defaultPages = kempoConfig.pages || "pages";
    if(defaultPages === "views") pass();
    else fail(`Expected "views", got "${defaultPages}"`);
  },

  /*
    createWindow options parsing
    Reimplements the option destructuring from createWindow
  */

  'createWindow options: string converted to hash object': ({ pass, fail }) => {
    let options = "#/settings";
    if(typeof options === "string") options = { hash: options };
    if(options.hash === "#/settings") pass();
    else fail(`Expected hash "#/settings", got "${options.hash}"`);
  },

  'createWindow options: defaults applied': ({ pass, fail }) => {
    const defaultShell = "shell.html";
    const defaultTitlebar = "titlebar.html";
    const defaultPages = "pages";
    const options = {};
    const { hash, shell = defaultShell, titlebar = defaultTitlebar, pages = defaultPages } = options;
    if(hash === undefined && shell === "shell.html" && titlebar === "titlebar.html" && pages === "pages") pass();
    else fail(`Unexpected defaults: hash=${hash}, shell=${shell}, titlebar=${titlebar}, pages=${pages}`);
  },

  'createWindow options: custom values override defaults': ({ pass, fail }) => {
    const defaultShell = "shell.html";
    const defaultTitlebar = "titlebar.html";
    const defaultPages = "pages";
    const options = { hash: "#/editor", shell: "editor-shell.html", titlebar: false, pages: "views" };
    if(typeof options === "string") options = { hash: options };
    const { hash, shell = defaultShell, titlebar = defaultTitlebar, pages = defaultPages } = options;
    if(hash === "#/editor" && shell === "editor-shell.html" && titlebar === false && pages === "views") pass();
    else fail(`Unexpected values: hash=${hash}, shell=${shell}, titlebar=${titlebar}, pages=${pages}`);
  },

  'createWindow: search params include all config': ({ pass, fail }) => {
    const searchParams = new URLSearchParams({ shell: "shell.html", titlebar: "titlebar.html", pages: "pages" });
    const url = `kempo-app://app/framework/src/renderer/index.html?${searchParams}`;
    if(url.includes("shell=shell.html") && url.includes("titlebar=titlebar.html") && url.includes("pages=pages")) pass();
    else fail(`URL missing params: ${url}`);
  },

  'createWindow: search params with custom values': ({ pass, fail }) => {
    const searchParams = new URLSearchParams({ shell: "editor.html", titlebar: "false", pages: "views" });
    const hashStr = "#/editor";
    const url = `kempo-app://app/framework/src/renderer/index.html?${searchParams}${hashStr}`;
    if(url.includes("shell=editor.html") && url.includes("titlebar=false") && url.includes("pages=views") && url.endsWith("#/editor")) pass();
    else fail(`URL incorrect: ${url}`);
  },

  /*
    createWindow: titlebar → frame / titleBarStyle / searchParams
    Reimplements the nativeFrame logic from createWindow
  */

  'createWindow: titlebar true sets frame true (native OS titlebar)': ({ pass, fail }) => {
    const defaultTitlebar = "titlebar.html";
    const options = { titlebar: true };
    const { titlebar = defaultTitlebar } = options;
    const nativeFrame = titlebar === true;
    if(nativeFrame === true) pass();
    else fail(`Expected nativeFrame true, got ${nativeFrame}`);
  },

  'createWindow: titlebar true passes "false" to renderer searchParams': ({ pass, fail }) => {
    const defaultTitlebar = "titlebar.html";
    const options = { titlebar: true };
    const { titlebar = defaultTitlebar } = options;
    const nativeFrame = titlebar === true;
    const searchParams = new URLSearchParams({ shell: "shell.html", titlebar: nativeFrame ? "false" : titlebar, pages: "pages" });
    if(searchParams.get("titlebar") === "false") pass();
    else fail(`Expected titlebar param "false", got "${searchParams.get("titlebar")}"`);
  },

  'createWindow: titlebar "false" (string) sets frame false (no titlebar)': ({ pass, fail }) => {
    const defaultTitlebar = "titlebar.html";
    const options = { titlebar: "false" };
    const { titlebar = defaultTitlebar } = options;
    const nativeFrame = titlebar === true;
    if(nativeFrame === false) pass();
    else fail(`Expected nativeFrame false for string "false", got ${nativeFrame}`);
  },

  'createWindow: titlebar "false" passes "false" to renderer': ({ pass, fail }) => {
    const defaultTitlebar = "titlebar.html";
    const options = { titlebar: "false" };
    const { titlebar = defaultTitlebar } = options;
    const nativeFrame = titlebar === true;
    const searchParams = new URLSearchParams({ shell: "shell.html", titlebar: nativeFrame ? "false" : titlebar, pages: "pages" });
    if(searchParams.get("titlebar") === "false") pass();
    else fail(`Expected titlebar param "false", got "${searchParams.get("titlebar")}"`);
  },

  'createWindow: titlebar string passes through to renderer': ({ pass, fail }) => {
    const defaultTitlebar = "titlebar.html";
    const options = { titlebar: "custom-bar.html" };
    const { titlebar = defaultTitlebar } = options;
    const nativeFrame = titlebar === true;
    const searchParams = new URLSearchParams({ shell: "shell.html", titlebar: nativeFrame ? "false" : titlebar, pages: "pages" });
    if(nativeFrame === false && searchParams.get("titlebar") === "custom-bar.html") pass();
    else fail(`Expected nativeFrame=false, titlebar param="custom-bar.html", got nativeFrame=${nativeFrame}, param="${searchParams.get("titlebar")}"`);
  },

  'createWindow: default titlebar sets frame false and passes titlebar.html': ({ pass, fail }) => {
    const defaultTitlebar = "titlebar.html";
    const options = {};
    const { titlebar = defaultTitlebar } = options;
    const nativeFrame = titlebar === true;
    const searchParams = new URLSearchParams({ shell: "shell.html", titlebar: nativeFrame ? "false" : titlebar, pages: "pages" });
    if(nativeFrame === false && searchParams.get("titlebar") === "titlebar.html") pass();
    else fail(`Expected nativeFrame=false, titlebar param="titlebar.html", got nativeFrame=${nativeFrame}, param="${searchParams.get("titlebar")}"`);
  },

  'createWindow: titlebar true disables hiddenInset on mac': ({ pass, fail }) => {
    const options = { titlebar: true };
    const { titlebar = "titlebar.html" } = options;
    const nativeFrame = titlebar === true;
    const isMac = true;
    const titleBarStyle = !nativeFrame && isMac ? "hiddenInset" : "default";
    const trafficLightPosition = !nativeFrame && isMac ? { x: 12, y: 12 } : undefined;
    if(titleBarStyle === "default" && trafficLightPosition === undefined) pass();
    else fail(`Expected default/undefined, got ${titleBarStyle}/${JSON.stringify(trafficLightPosition)}`);
  },

  'createWindow: custom titlebar enables hiddenInset on mac': ({ pass, fail }) => {
    const options = {};
    const { titlebar = "titlebar.html" } = options;
    const nativeFrame = titlebar === true;
    const isMac = true;
    const titleBarStyle = !nativeFrame && isMac ? "hiddenInset" : "default";
    const trafficLightPosition = !nativeFrame && isMac ? { x: 12, y: 12 } : undefined;
    if(titleBarStyle === "hiddenInset" && trafficLightPosition?.x === 12) pass();
    else fail(`Expected hiddenInset/{x:12,y:12}, got ${titleBarStyle}/${JSON.stringify(trafficLightPosition)}`);
  },

  'createWindow: non-mac always gets titleBarStyle default': ({ pass, fail }) => {
    const isMac = false;
    for(const tb of [true, "titlebar.html", "false"]){
      const nativeFrame = tb === true;
      const titleBarStyle = !nativeFrame && isMac ? "hiddenInset" : "default";
      if(titleBarStyle !== "default") return fail(`Expected "default" for titlebar=${tb}, got "${titleBarStyle}"`);
    }
    pass();
  },

  /*
    menuBar config
  */

  'kempoConfig: menuBar defaults to false': ({ pass, fail }) => {
    const kempoConfig = {};
    const defaultMenuBar = kempoConfig.menuBar === true;
    if(defaultMenuBar === false) pass();
    else fail(`Expected false, got ${defaultMenuBar}`);
  },

  'kempoConfig: menuBar true sets defaultMenuBar true': ({ pass, fail }) => {
    const kempoConfig = { menuBar: true };
    const defaultMenuBar = kempoConfig.menuBar === true;
    if(defaultMenuBar === true) pass();
    else fail(`Expected true, got ${defaultMenuBar}`);
  },

  'createWindow: menuBar false + titlebar true hides menu bar': ({ pass, fail }) => {
    const defaultMenuBar = false;
    const options = { titlebar: true };
    const { titlebar = "titlebar.html", menuBar = defaultMenuBar } = options;
    const nativeFrame = titlebar === true;
    const autoHideMenuBar = nativeFrame && !menuBar;
    if(autoHideMenuBar === true) pass();
    else fail(`Expected autoHideMenuBar true, got ${autoHideMenuBar}`);
  },

  'createWindow: menuBar true + titlebar true shows menu bar': ({ pass, fail }) => {
    const defaultMenuBar = false;
    const options = { titlebar: true, menuBar: true };
    const { titlebar = "titlebar.html", menuBar = defaultMenuBar } = options;
    const nativeFrame = titlebar === true;
    const autoHideMenuBar = nativeFrame && !menuBar;
    if(autoHideMenuBar === false) pass();
    else fail(`Expected autoHideMenuBar false, got ${autoHideMenuBar}`);
  },

  'createWindow: menuBar irrelevant when not nativeFrame': ({ pass, fail }) => {
    const defaultMenuBar = false;
    const options = { menuBar: true };
    const { titlebar = "titlebar.html", menuBar = defaultMenuBar } = options;
    const nativeFrame = titlebar === true;
    const autoHideMenuBar = nativeFrame && !menuBar;
    if(autoHideMenuBar === false) pass();
    else fail(`Expected autoHideMenuBar false when not nativeFrame, got ${autoHideMenuBar}`);
  },

};

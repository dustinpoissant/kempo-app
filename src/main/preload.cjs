const { contextBridge, ipcRenderer } = require("electron");

// Forward notification events from main process as window CustomEvents
ipcRenderer.on("notification:click", (e, id) => {
  window.dispatchEvent(new CustomEvent("notification:click", { detail: { id } }));
});
ipcRenderer.on("notification:close", (e, id) => {
  window.dispatchEvent(new CustomEvent("notification:close", { detail: { id } }));
});
ipcRenderer.on("notification:reply", (e, id, reply) => {
  window.dispatchEvent(new CustomEvent("notification:reply", { detail: { id, reply } }));
});

const baseAPI = {
  // JSON Database — returns a table proxy: jsonDB("settings").get("key")
  jsonDB: (table) => ({
    get: (key) => ipcRenderer.invoke("db:get", table, key),
    set: async (key, value) => {
      await ipcRenderer.invoke("db:set", table, key, value);
      window.dispatchEvent(new CustomEvent(`jsondb_change:${table}`, { detail: { key, value } }));
    },
    delete: (key) => ipcRenderer.invoke("db:delete", table, key),
    has: (key) => ipcRenderer.invoke("db:has", table, key),
    clear: () => ipcRenderer.invoke("db:clear", table),
  }),

  // SQL — requires better-sqlite3 in consumer project
  // SELECT returns array of rows; anything else returns true; throws on error
  sqlQuery: (dbName, sql) => ipcRenderer.invoke("sqlDB:query", dbName, sql),

  // Window controls
  window: {
    minimize: () => ipcRenderer.send("window:minimize"),
    maximize: () => ipcRenderer.send("window:maximize"),
    close: () => ipcRenderer.send("window:close"),
    new: (options) => ipcRenderer.send("window:new", typeof options === "string" ? { hash: options } : options),
    isMaximized: () => ipcRenderer.invoke("window:isMaximized"),
    onMaximizeChange: (cb) => ipcRenderer.on("window:maximize-change", (e, val) => cb(val)),
  },

  // Platform
  getPlatform: () => ipcRenderer.invoke("platform"),

  // App info
  getAppName: () => ipcRenderer.invoke("app:name"),

  // Dev
  isDev: () => ipcRenderer.invoke("app:isDev"),
  toggleDevTools: () => ipcRenderer.send("window:toggleDevTools"),

  // Notifications
  notification: {
    show: (options) => ipcRenderer.invoke("notification:show", options),
    isSupported: () => ipcRenderer.invoke("notification:isSupported"),
  },

  // Context menu
  contextMenu: {
    show: (items) => ipcRenderer.send("contextmenu:extra-items", items),
    onClick: (cb) => ipcRenderer.on("contextmenu:click", (e, id) => cb(id)),
  },

  // File System
  fs: {
    readFile: (filePath, encoding) => ipcRenderer.invoke("fs:readFile", filePath, encoding),
    writeFile: (filePath, data, encoding) => ipcRenderer.invoke("fs:writeFile", filePath, data, encoding),
    appendFile: (filePath, data, encoding) => ipcRenderer.invoke("fs:appendFile", filePath, data, encoding),
    readDir: (dirPath) => ipcRenderer.invoke("fs:readDir", dirPath),
    mkdir: (dirPath, options) => ipcRenderer.invoke("fs:mkdir", dirPath, options),
    rm: (filePath, options) => ipcRenderer.invoke("fs:rm", filePath, options),
    exists: (filePath) => ipcRenderer.invoke("fs:exists", filePath),
    stat: (filePath) => ipcRenderer.invoke("fs:stat", filePath),
    rename: (oldPath, newPath) => ipcRenderer.invoke("fs:rename", oldPath, newPath),
    copyFile: (src, dest) => ipcRenderer.invoke("fs:copyFile", src, dest),
  },
};

// Expose base API
contextBridge.exposeInMainWorld("api", baseAPI);

// Add custom API handler after exposure using a getter trap
// This allows custom functions from api/*.js to be called
const apiObj = window.api;
const handler = {
  get: (target, prop) => {
    if(prop in target) return target[prop];
    if(typeof prop === "string" && !prop.startsWith("_")){
      return (...args) => ipcRenderer.invoke(`api:${prop}`, ...args).then(result => {
        if(result && result.__error) throw new Error(result.message);
        return result;
      });
    }
    return undefined;
  }
};

// Create a Proxy after exposure for dynamic API routing
Object.defineProperty(window, "api", {
  value: new Proxy(apiObj, handler),
  writable: false,
  configurable: false
});

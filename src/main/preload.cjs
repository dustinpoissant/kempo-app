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
  // params bind into `?` placeholders in sql — always prefer this over baking values into the
  // sql text. SELECT returns array of rows; anything else returns { changes, lastInsertRowid };
  // throws on error.
  sqlQuery: (dbName, sql, params) => ipcRenderer.invoke("sqlDB:query", dbName, sql, params),
  // Runs a batch of { sql, params } statements as one all-or-nothing transaction. Returns an
  // array of per-statement results, same shape sqlQuery() would give for each one.
  sqlTransaction: (dbName, statements) => ipcRenderer.invoke("sqlDB:transaction", dbName, statements),

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

  // Dynamic router for file-based custom api/*.js handlers:
  //   window.api.call("scanImages", ...args)
  // (Renderers can wrap this in a Proxy for window.api.scanImages(...) ergonomics.)
  call: (name, ...args) => ipcRenderer.invoke(`api:${name}`, ...args).then(result => {
    if(result && result.__error) throw new Error(result.message);
    return result;
  }),
};

// Expose the base API (including call()). Note: with contextIsolation the preload's
// window.api is undefined, so we must put everything on baseAPI *before* exposing —
// we can't read it back to wrap it in a Proxy afterward.
contextBridge.exposeInMainWorld("api", baseAPI);

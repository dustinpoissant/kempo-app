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

contextBridge.exposeInMainWorld("api", {
  // Database
  db: {
    get: (key) => ipcRenderer.invoke("db:get", key),
    set: async (key, value) => {
      await ipcRenderer.invoke("db:set", key, value);
      window.dispatchEvent(new CustomEvent("settingchange", { detail: { key, value } }));
    },
    delete: (key) => ipcRenderer.invoke("db:delete", key),
    has: (key) => ipcRenderer.invoke("db:has", key),
    clear: () => ipcRenderer.invoke("db:clear"),
  },

  // Window controls
  window: {
    minimize: () => ipcRenderer.send("window:minimize"),
    maximize: () => ipcRenderer.send("window:maximize"),
    close: () => ipcRenderer.send("window:close"),
    new: (hash) => ipcRenderer.send("window:new", hash),
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
});

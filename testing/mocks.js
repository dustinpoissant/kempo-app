/*
  Mock window.api for browser testing outside Electron.
  Loaded as a classic <script> — sets up window.api before modules run.
  Matches the API surface in src/main/preload.cjs.
*/
(function(){
  const dbStore = {};
  window.__kempoTestDbStore = dbStore;
  window.api = {
    db: {
      get: async key => key === undefined ? {...dbStore} : dbStore[key],
      set: async (key, value) => {
        dbStore[key] = value;
        window.dispatchEvent(new CustomEvent("settingchange", { detail: { key, value } }));
      },
      delete: async key => { delete dbStore[key]; },
      has: async key => key in dbStore,
      clear: async () => { for(const k of Object.keys(dbStore)) delete dbStore[k]; },
    },
    window: {
      minimize: () => {},
      maximize: () => {},
      close: () => {},
      new: () => {},
      isMaximized: async () => false,
      onMaximizeChange: () => {},
    },
    getPlatform: async () => "win",
    getAppName: async () => "Test App",
    isDev: async () => false,
    toggleDevTools: () => {},
    notification: {
      show: async () => {},
      isSupported: async () => true,
    },
    contextMenu: {
      show: () => {},
      onClick: () => {},
    },
  };
})();

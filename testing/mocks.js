/*
  Mock api for browser testing outside Electron.
  Loaded as a classic <script> — sets up window.api before modules run.
  Matches the API surface in src/main/preload.cjs.
*/
(function(){
  const tables = {};
  window.__kempoTestDbStore = tables;
  const getTable = table => {
    if(!tables[table]) tables[table] = {};
    return tables[table];
  };
  window.api = {
    jsonDB: (table) => ({
      get: async (key) => {
        const t = getTable(table);
        return key === undefined ? {...t} : t[key];
      },
      set: async (key, value) => {
        getTable(table)[key] = value;
        window.dispatchEvent(new CustomEvent(`jsondb_change:${table}`, { detail: { key, value } }));
      },
      delete: async (key) => { delete getTable(table)[key]; },
      has: async (key) => key in getTable(table),
      clear: async () => { const t = getTable(table); for(const k of Object.keys(t)) delete t[k]; },
    }),
    sqlQuery: async () => { throw new Error('better-sqlite3 is not available in browser tests'); },
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

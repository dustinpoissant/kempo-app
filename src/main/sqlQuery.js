import { app } from "electron";
import path from "path";
import { createRequire } from "module";

// Same resolution as main.js: process.cwd() is only reliable for dev/start, where
// kempo-app's CLI sets KEMPO_APP_ROOT explicitly. A packaged app's cwd is wherever
// the OS launched the .exe from, not the app directory — app.getAppPath() is the
// one that's always correct there.
const appRoot = process.env.KEMPO_APP_ROOT || (app.isPackaged ? app.getAppPath() : process.cwd());
const appRequire = createRequire(path.join(appRoot, "package.json"));
const sqlDBs = new Map();

export const getSqlDB = name => {
  if(sqlDBs.has(name)) return sqlDBs.get(name);
  let BetterSqlite3;
  try {
    BetterSqlite3 = appRequire("better-sqlite3");
  } catch {
    throw new Error('better-sqlite3 is not installed. Run "npm install better-sqlite3" in your project.');
  }
  const dbPath = path.join(app.getPath("userData"), "db", `${name}.db`);
  const instance = new BetterSqlite3(dbPath);
  instance.pragma("journal_mode = WAL");
  sqlDBs.set(name, instance);
  return instance;
};

// params bind into `?` placeholders in sql — always prefer this over building sql with the
// values already baked in as text. SELECT returns the matched rows; anything else returns
// { changes, lastInsertRowid } so callers can tell what happened (e.g. read back a new row's id).
export const query = (dbName, sql, params = []) => {
  const db = getSqlDB(dbName);
  const stmt = db.prepare(sql);
  if(sql.trim().toUpperCase().startsWith("SELECT")) return stmt.all(...params);
  const info = stmt.run(...params);
  return { changes: info.changes, lastInsertRowid: info.lastInsertRowid };
};

// Runs a batch of { sql, params } statements as one all-or-nothing unit: if any statement
// throws, every statement in the batch is rolled back, not just the one that failed. Returns
// an array of per-statement results, same shape query() would give for each one.
export const transaction = (dbName, statements) => {
  const db = getSqlDB(dbName);
  const run = db.transaction(stmts => stmts.map(({ sql, params = [] }) => {
    const stmt = db.prepare(sql);
    if(sql.trim().toUpperCase().startsWith("SELECT")) return stmt.all(...params);
    const info = stmt.run(...params);
    return { changes: info.changes, lastInsertRowid: info.lastInsertRowid };
  }));
  return run(statements);
};

export { sqlDBs };

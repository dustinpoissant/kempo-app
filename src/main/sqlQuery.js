import { app } from "electron";
import path from "path";
import { createRequire } from "module";

const appRoot = process.env.KEMPO_APP_ROOT || process.cwd();
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

export const query = (dbName, sql) => {
  const db = getSqlDB(dbName);
  if(sql.trim().toUpperCase().startsWith("SELECT")) return db.prepare(sql).all();
  db.prepare(sql).run();
  return true;
};

export { sqlDBs };

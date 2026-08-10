import { readdirSync } from "fs";
import { pathToFileURL } from "url";
import path from "path";

/*
  Type Mapping
*/

const typeMap = {
  text: "TEXT",
  integer: "INTEGER",
  real: "REAL",
  blob: "BLOB",
};

const sqlType = field => typeMap[field.type] || "TEXT";

// isSinglePrimary: true only when this column is the table's ONE AND ONLY primary-key column
// (the common case) — it gets PRIMARY KEY inlined, and AUTOINCREMENT if it's an integer, same
// as SQLite only allows autoincrement on a single-column integer key. A column that's part of
// a *composite* key (see primaryKeys below) is never isSinglePrimary — it's just a plain NOT
// NULL column here, and the key itself is added as a separate table-level constraint instead.
const columnDef = (name, field, isSinglePrimary) => {
  let def = `${name} ${sqlType(field)}`;
  if(isSinglePrimary){
    def += " PRIMARY KEY";
    if(field.type === "integer") def += " AUTOINCREMENT";
    return def;
  }
  if(field.required) def += " NOT NULL";
  if(field.unique) def += " UNIQUE";
  if(field.default !== undefined){
    const val = typeof field.default === "string" ? `'${field.default}'` : field.default;
    def += ` DEFAULT ${val}`;
  }
  return def;
};

// Every column marked `primary: true` — one column is the common case (an inline PRIMARY KEY),
// more than one means a composite key (e.g. a join table keyed by two ids together), added as
// a table-level `PRIMARY KEY (a, b)` constraint instead of on any single column.
const primaryKeys = schema => Object.entries(schema).filter(([, f]) => f.primary).map(([name]) => name);

// Back-compat single-key accessor — the first primary column, or null. Prefer primaryKeys for
// anything that needs to handle composite keys correctly.
const primaryKey = schema => primaryKeys(schema)[0] ?? null;

/*
  Version Tracking
*/

const ensureMetaTable = db => {
  db.exec("CREATE TABLE IF NOT EXISTS _schema (table_name TEXT PRIMARY KEY, version INTEGER NOT NULL)");
};

const getTableVersion = (db, tableName) => {
  const row = db.prepare("SELECT version FROM _schema WHERE table_name = ?").get(tableName);
  return row ? row.version : 0;
};

const setTableVersion = (db, tableName, version) => {
  db.prepare("INSERT OR REPLACE INTO _schema (table_name, version) VALUES (?, ?)").run(tableName, version);
};

/*
  Schema Sync
*/

const syncTable = (db, tableName, schema) => {
  const columns = Object.entries(schema);
  const pks = primaryKeys(schema);
  const existing = db.pragma(`table_info(${tableName})`);

  if(!existing.length){
    let defs;
    if(pks.length === 0){
      defs = ["id INTEGER PRIMARY KEY AUTOINCREMENT", ...columns.map(([name, field]) => columnDef(name, field))];
    } else if(pks.length === 1){
      defs = columns.map(([name, field]) => columnDef(name, field, name === pks[0]));
    } else {
      // Composite key: no single column gets an inline PRIMARY KEY (SQLite only allows that on
      // one column), so it's added as its own table-level constraint instead.
      defs = [...columns.map(([name, field]) => columnDef(name, field, false)), `PRIMARY KEY (${pks.join(", ")})`];
    }
    db.exec(`CREATE TABLE ${tableName} (${defs.join(", ")})`);

    // A lone primary key column already has its own index (that's what PRIMARY KEY means) —
    // an `index: true` on it would just duplicate that. A *composite* key's own index is
    // ordered by all of its columns together though, which doesn't help a lookup on just one
    // of the non-leading columns alone — so those can still ask for their own separate index.
    const soleKey = pks.length === 1 ? pks[0] : null;
    const indexed = columns.filter(([name, field]) => field.index && name !== soleKey);
    for(const [name] of indexed){
      db.exec(`CREATE INDEX idx_${tableName}_${name} ON ${tableName} (${name})`);
    }
    return;
  }

  const existingNames = new Set(existing.map(c => c.name));
  for(const [name, field] of columns){
    if(!existingNames.has(name)){
      db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnDef(name, field)}`);
      if(field.index) db.exec(`CREATE INDEX IF NOT EXISTS idx_${tableName}_${name} ON ${tableName} (${name})`);
    }
  }
};

/*
  Migration
*/

const migrateTable = (db, tableName, columns, version = 1, updates) => {
  ensureMetaTable(db);
  const storedVersion = getTableVersion(db, tableName);
  const existing = db.pragma(`table_info(${tableName})`);

  if(!existing.length){
    syncTable(db, tableName, columns);
  } else if(updates && storedVersion < version){
    for(let v = (storedVersion || 1); v < version; v++){
      const step = updates[v - 1];
      if(typeof step === "function"){
        if(step(db) === true) syncTable(db, tableName, columns);
      } else {
        syncTable(db, tableName, columns);
      }
    }
  } else {
    syncTable(db, tableName, columns);
  }

  if(storedVersion !== version) setTableVersion(db, tableName, version);
};

const loadSchemas = async schemaDir => {
  const schemas = {};
  for(const entry of readdirSync(schemaDir, { withFileTypes: true })){
    if(!entry.isDirectory()) continue;
    const dbName = entry.name;
    const dbDir = path.join(schemaDir, dbName);
    schemas[dbName] = {};
    for(const file of readdirSync(dbDir).filter(f => f.endsWith(".js"))){
      const tableName = path.basename(file, ".js");
      const mod = await import(pathToFileURL(path.join(dbDir, file)).href);
      schemas[dbName][tableName] = {
        columns: mod.default,
        version: mod.version ?? 1,
        updates: mod.updates,
      };
    }
  }
  return schemas;
};

export default async (getSqlDB, schemaDir) => {
  const loaded = await loadSchemas(schemaDir);
  const schemaMap = {};
  for(const [dbName, tables] of Object.entries(loaded)){
    const db = getSqlDB(dbName);
    schemaMap[dbName] = {};
    for(const [tableName, { columns, version, updates }] of Object.entries(tables)){
      migrateTable(db, tableName, columns, version, updates);
      schemaMap[dbName][tableName] = columns;
    }
  }
  return schemaMap;
};

export { syncTable, loadSchemas, columnDef, sqlType, primaryKey, primaryKeys, ensureMetaTable, getTableVersion, setTableVersion, migrateTable };

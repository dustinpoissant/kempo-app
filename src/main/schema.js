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

const columnDef = (name, field, isPrimary) => {
  let def = `${name} ${sqlType(field)}`;
  if(isPrimary){
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

const primaryKey = schema => {
  const entry = Object.entries(schema).find(([, f]) => f.primary);
  return entry ? entry[0] : null;
};

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
  const pk = primaryKey(schema);
  const existing = db.pragma(`table_info(${tableName})`);

  if(!existing.length){
    const defs = pk
      ? columns.map(([name, field]) => columnDef(name, field, name === pk))
      : ["id INTEGER PRIMARY KEY AUTOINCREMENT", ...columns.map(([name, field]) => columnDef(name, field))];
    db.exec(`CREATE TABLE ${tableName} (${defs.join(", ")})`);

    const indexed = columns.filter(([name, field]) => field.index && name !== pk);
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

export { syncTable, loadSchemas, columnDef, sqlType, primaryKey, ensureMetaTable, getTableVersion, setTableVersion, migrateTable };

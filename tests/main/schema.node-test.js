import { syncTable, columnDef, sqlType, primaryKey, ensureMetaTable, getTableVersion, setTableVersion, migrateTable } from "../../src/main/schema.js";
import path from "path";
import { mkdirSync, writeFileSync, rmSync } from "fs";
import os from "os";
import { createRequire } from "module";

/*
  Helpers
*/

const appRequire = createRequire(path.join(path.resolve("./example"), "package.json"));
let BetterSqlite3;
try {
  BetterSqlite3 = appRequire("better-sqlite3");
  new BetterSqlite3(":memory:").close();
} catch {
  BetterSqlite3 = null;
}

const createTestDB = () => {
  if(!BetterSqlite3) return null;
  return new BetterSqlite3(":memory:");
};

const skip = (msg, { pass }) => { pass(`SKIP: ${msg}`); };

export default {
  /*
    sqlType
  */

  'sqlType: text maps to TEXT': ({ pass, fail }) => {
    if(sqlType({ type: "text" }) === "TEXT") pass();
    else fail();
  },

  'sqlType: integer maps to INTEGER': ({ pass, fail }) => {
    if(sqlType({ type: "integer" }) === "INTEGER") pass();
    else fail();
  },

  'sqlType: real maps to REAL': ({ pass, fail }) => {
    if(sqlType({ type: "real" }) === "REAL") pass();
    else fail();
  },

  'sqlType: blob maps to BLOB': ({ pass, fail }) => {
    if(sqlType({ type: "blob" }) === "BLOB") pass();
    else fail();
  },

  'sqlType: unknown defaults to TEXT': ({ pass, fail }) => {
    if(sqlType({ type: "whatever" }) === "TEXT") pass();
    else fail();
  },

  /*
    columnDef
  */

  'columnDef: basic text column': ({ pass, fail }) => {
    const result = columnDef("name", { type: "text" });
    if(result === "name TEXT") pass();
    else fail(`Got: ${result}`);
  },

  'columnDef: required column': ({ pass, fail }) => {
    const result = columnDef("name", { type: "text", required: true });
    if(result === "name TEXT NOT NULL") pass();
    else fail(`Got: ${result}`);
  },

  'columnDef: unique column': ({ pass, fail }) => {
    const result = columnDef("email", { type: "text", unique: true });
    if(result === "email TEXT UNIQUE") pass();
    else fail(`Got: ${result}`);
  },

  'columnDef: default string value': ({ pass, fail }) => {
    const result = columnDef("status", { type: "text", default: "active" });
    if(result === "status TEXT DEFAULT 'active'") pass();
    else fail(`Got: ${result}`);
  },

  'columnDef: default integer value': ({ pass, fail }) => {
    const result = columnDef("age", { type: "integer", default: 0 });
    if(result === "age INTEGER DEFAULT 0") pass();
    else fail(`Got: ${result}`);
  },

  'columnDef: all options combined': ({ pass, fail }) => {
    const result = columnDef("score", { type: "real", required: true, unique: true, default: 0.0 });
    if(result === "score REAL NOT NULL UNIQUE DEFAULT 0") pass();
    else fail(`Got: ${result}`);
  },

  'columnDef: primary integer column': ({ pass, fail }) => {
    const result = columnDef("id", { type: "integer", primary: true }, true);
    if(result === "id INTEGER PRIMARY KEY AUTOINCREMENT") pass();
    else fail(`Got: ${result}`);
  },

  'columnDef: primary text column (no autoincrement)': ({ pass, fail }) => {
    const result = columnDef("slug", { type: "text", primary: true }, true);
    if(result === "slug TEXT PRIMARY KEY") pass();
    else fail(`Got: ${result}`);
  },

  /*
    primaryKey
  */

  'primaryKey: returns column name when defined': ({ pass, fail }) => {
    const result = primaryKey({ email: { type: "text", primary: true }, name: { type: "text" } });
    if(result === "email") pass();
    else fail(`Got: ${result}`);
  },

  'primaryKey: returns null when no primary defined': ({ pass, fail }) => {
    const result = primaryKey({ name: { type: "text" }, email: { type: "text" } });
    if(result === null) pass();
    else fail(`Got: ${result}`);
  },

  /*
    syncTable — requires better-sqlite3
  */

  'syncTable: creates new table with all columns': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "users", {
        name: { type: "text", required: true },
        email: { type: "text" },
      });
      const cols = db.pragma("table_info(users)");
      const names = cols.map(c => c.name);
      if(names.includes("id") && names.includes("name") && names.includes("email") && cols.length === 3) ctx.pass();
      else ctx.fail(`Expected [id, name, email], got ${JSON.stringify(names)}`);
    } finally {
      db.close();
    }
  },

  'syncTable: id is autoincrement primary key': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "users", { name: { type: "text" } });
      const cols = db.pragma("table_info(users)");
      const idCol = cols.find(c => c.name === "id");
      if(idCol && idCol.pk === 1 && idCol.type === "INTEGER") ctx.pass();
      else ctx.fail(`id column: ${JSON.stringify(idCol)}`);
    } finally {
      db.close();
    }
  },

  'syncTable: adds missing columns to existing table': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "users", { name: { type: "text" } });
      syncTable(db, "users", { name: { type: "text" }, email: { type: "text" }, phone: { type: "text" } });
      const cols = db.pragma("table_info(users)");
      const names = cols.map(c => c.name);
      if(names.includes("email") && names.includes("phone") && cols.length === 4) ctx.pass();
      else ctx.fail(`Expected [id, name, email, phone], got ${JSON.stringify(names)}`);
    } finally {
      db.close();
    }
  },

  'syncTable: does not duplicate existing columns': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "users", { name: { type: "text" } });
      syncTable(db, "users", { name: { type: "text" } });
      const cols = db.pragma("table_info(users)");
      if(cols.length === 2) ctx.pass();
      else ctx.fail(`Expected 2 columns, got ${cols.length}`);
    } finally {
      db.close();
    }
  },

  'syncTable: preserves existing data during migration': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "users", { name: { type: "text" } });
      db.prepare("INSERT INTO users (name) VALUES (?)").run("Alice");
      syncTable(db, "users", { name: { type: "text" }, email: { type: "text" } });
      const row = db.prepare("SELECT * FROM users WHERE name = ?").get("Alice");
      if(row && row.name === "Alice" && row.email === null) ctx.pass();
      else ctx.fail(`Row: ${JSON.stringify(row)}`);
    } finally {
      db.close();
    }
  },

  'syncTable: required column applied correctly': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "users", { name: { type: "text", required: true } });
      const cols = db.pragma("table_info(users)");
      const nameCol = cols.find(c => c.name === "name");
      if(nameCol && nameCol.notnull === 1) ctx.pass();
      else ctx.fail(`name column: ${JSON.stringify(nameCol)}`);
    } finally {
      db.close();
    }
  },

  'syncTable: default value applied correctly': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "users", { active: { type: "integer", default: 1 } });
      db.prepare("INSERT INTO users (id) VALUES (NULL)").run();
      const row = db.prepare("SELECT active FROM users").get();
      if(row && row.active === 1) ctx.pass();
      else ctx.fail(`Row: ${JSON.stringify(row)}`);
    } finally {
      db.close();
    }
  },

  'syncTable: multiple tables independent': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "users", { name: { type: "text" } });
      syncTable(db, "posts", { title: { type: "text" }, body: { type: "text" } });
      const userCols = db.pragma("table_info(users)").map(c => c.name);
      const postCols = db.pragma("table_info(posts)").map(c => c.name);
      if(userCols.length === 2 && postCols.length === 3) ctx.pass();
      else ctx.fail(`users: ${JSON.stringify(userCols)}, posts: ${JSON.stringify(postCols)}`);
    } finally {
      db.close();
    }
  },

  'syncTable: custom primary key omits auto id': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "users", {
        email: { type: "text", primary: true },
        name: { type: "text" },
      });
      const cols = db.pragma("table_info(users)");
      const names = cols.map(c => c.name);
      const emailCol = cols.find(c => c.name === "email");
      if(!names.includes("id") && emailCol && emailCol.pk === 1 && cols.length === 2) ctx.pass();
      else ctx.fail(`Cols: ${JSON.stringify(cols)}`);
    } finally {
      db.close();
    }
  },

  'syncTable: custom text PK does not autoincrement': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "settings", {
        key: { type: "text", primary: true },
        value: { type: "text" },
      });
      db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("theme", "dark");
      const row = db.prepare("SELECT * FROM settings WHERE key = ?").get("theme");
      if(row && row.key === "theme" && row.value === "dark") ctx.pass();
      else ctx.fail(`Row: ${JSON.stringify(row)}`);
    } finally {
      db.close();
    }
  },

  'syncTable: custom integer PK uses autoincrement': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "items", {
        item_id: { type: "integer", primary: true },
        name: { type: "text" },
      });
      db.prepare("INSERT INTO items (name) VALUES (?)").run("Widget");
      const row = db.prepare("SELECT * FROM items").get();
      if(row && row.item_id === 1 && row.name === "Widget") ctx.pass();
      else ctx.fail(`Row: ${JSON.stringify(row)}`);
    } finally {
      db.close();
    }
  },

  'syncTable: creates indexes for indexed columns': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "users", {
        name: { type: "text" },
        email: { type: "text", index: true },
      });
      const indexes = db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='users'").all();
      const hasIndex = indexes.some(i => i.name === "idx_users_email");
      if(hasIndex) ctx.pass();
      else ctx.fail(`Indexes: ${JSON.stringify(indexes)}`);
    } finally {
      db.close();
    }
  },

  'syncTable: migration adds index for new indexed column': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "users", { name: { type: "text" } });
      syncTable(db, "users", { name: { type: "text" }, email: { type: "text", index: true } });
      const indexes = db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='users'").all();
      const hasIndex = indexes.some(i => i.name === "idx_users_email");
      if(hasIndex) ctx.pass();
      else ctx.fail(`Indexes: ${JSON.stringify(indexes)}`);
    } finally {
      db.close();
    }
  },

  /*
    CRUD operations via SQL
  */

  'CRUD: create and find record': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "users", { name: { type: "text" }, email: { type: "text" } });
      const result = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)").run("Alice", "alice@test.com");
      const row = db.prepare("SELECT * FROM users WHERE id = ?").get(Number(result.lastInsertRowid));
      if(row && row.name === "Alice" && row.email === "alice@test.com") ctx.pass();
      else ctx.fail(`Row: ${JSON.stringify(row)}`);
    } finally {
      db.close();
    }
  },

  'CRUD: update record': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "users", { name: { type: "text" } });
      db.prepare("INSERT INTO users (name) VALUES (?)").run("Alice");
      db.prepare("UPDATE users SET name = ? WHERE name = ?").run("Bob", "Alice");
      const row = db.prepare("SELECT * FROM users WHERE name = ?").get("Bob");
      if(row && row.name === "Bob") ctx.pass();
      else ctx.fail(`Row: ${JSON.stringify(row)}`);
    } finally {
      db.close();
    }
  },

  'CRUD: delete record': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "users", { name: { type: "text" } });
      db.prepare("INSERT INTO users (name) VALUES (?)").run("Alice");
      db.prepare("DELETE FROM users WHERE name = ?").run("Alice");
      const row = db.prepare("SELECT * FROM users WHERE name = ?").get("Alice");
      if(row === undefined) ctx.pass();
      else ctx.fail(`Expected undefined, got ${JSON.stringify(row)}`);
    } finally {
      db.close();
    }
  },

  /*
    Version Tracking
  */

  'ensureMetaTable: creates _schema table': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      ensureMetaTable(db);
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='_schema'").all();
      if(tables.length === 1) ctx.pass();
      else ctx.fail(`Expected _schema table, got ${JSON.stringify(tables)}`);
    } finally {
      db.close();
    }
  },

  'ensureMetaTable: idempotent': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      ensureMetaTable(db);
      ensureMetaTable(db);
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='_schema'").all();
      if(tables.length === 1) ctx.pass();
      else ctx.fail(`Expected 1 table, got ${tables.length}`);
    } finally {
      db.close();
    }
  },

  'getTableVersion: returns 0 for unknown table': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      ensureMetaTable(db);
      const v = getTableVersion(db, "nonexistent");
      if(v === 0) ctx.pass();
      else ctx.fail(`Expected 0, got ${v}`);
    } finally {
      db.close();
    }
  },

  'setTableVersion: stores and retrieves version': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      ensureMetaTable(db);
      setTableVersion(db, "users", 3);
      const v = getTableVersion(db, "users");
      if(v === 3) ctx.pass();
      else ctx.fail(`Expected 3, got ${v}`);
    } finally {
      db.close();
    }
  },

  'setTableVersion: upserts existing entry': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      ensureMetaTable(db);
      setTableVersion(db, "users", 1);
      setTableVersion(db, "users", 5);
      const v = getTableVersion(db, "users");
      if(v === 5) ctx.pass();
      else ctx.fail(`Expected 5, got ${v}`);
    } finally {
      db.close();
    }
  },

  /*
    migrateTable
  */

  'migrateTable: creates new table and sets version': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      migrateTable(db, "users", { name: { type: "text" } }, 1);
      const cols = db.pragma("table_info(users)");
      const v = getTableVersion(db, "users");
      if(cols.length === 2 && v === 1) ctx.pass();
      else ctx.fail(`cols: ${cols.length}, version: ${v}`);
    } finally {
      db.close();
    }
  },

  'migrateTable: new table jumps to latest version': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      migrateTable(db, "users", { name: { type: "text" }, email: { type: "text" } }, 3, [null, null]);
      const v = getTableVersion(db, "users");
      const cols = db.pragma("table_info(users)");
      if(v === 3 && cols.length === 3) ctx.pass();
      else ctx.fail(`version: ${v}, cols: ${cols.length}`);
    } finally {
      db.close();
    }
  },

  'migrateTable: auto-migrates for null update step': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      migrateTable(db, "users", { name: { type: "text" } }, 1);
      migrateTable(db, "users", { name: { type: "text" }, email: { type: "text" } }, 2, [null]);
      const cols = db.pragma("table_info(users)").map(c => c.name);
      const v = getTableVersion(db, "users");
      if(cols.includes("email") && v === 2) ctx.pass();
      else ctx.fail(`cols: ${JSON.stringify(cols)}, version: ${v}`);
    } finally {
      db.close();
    }
  },

  'migrateTable: runs update function': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      migrateTable(db, "users", { name: { type: "text" } }, 1);
      db.prepare("INSERT INTO users (name) VALUES (?)").run("alice");
      let called = false;
      const fn = (d) => { called = true; d.exec("UPDATE users SET name = UPPER(name)"); };
      migrateTable(db, "users", { name: { type: "text" } }, 2, [fn]);
      const row = db.prepare("SELECT name FROM users").get();
      if(called && row.name === "ALICE") ctx.pass();
      else ctx.fail(`called: ${called}, name: ${row.name}`);
    } finally {
      db.close();
    }
  },

  'migrateTable: function returning true triggers auto-migrate': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      migrateTable(db, "users", { name: { type: "text" } }, 1);
      const fn = () => true;
      migrateTable(db, "users", { name: { type: "text" }, email: { type: "text" } }, 2, [fn]);
      const cols = db.pragma("table_info(users)").map(c => c.name);
      if(cols.includes("email")) ctx.pass();
      else ctx.fail(`cols: ${JSON.stringify(cols)}`);
    } finally {
      db.close();
    }
  },

  'migrateTable: function not returning true skips auto-migrate': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      migrateTable(db, "users", { name: { type: "text" } }, 1);
      const fn = () => {};
      migrateTable(db, "users", { name: { type: "text" }, email: { type: "text" } }, 2, [fn]);
      const cols = db.pragma("table_info(users)").map(c => c.name);
      if(!cols.includes("email")) ctx.pass();
      else ctx.fail(`email should not exist, cols: ${JSON.stringify(cols)}`);
    } finally {
      db.close();
    }
  },

  'migrateTable: runs multiple steps sequentially': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      migrateTable(db, "users", { name: { type: "text" } }, 1);
      db.prepare("INSERT INTO users (name) VALUES (?)").run("alice");
      const order = [];
      const step1 = (d) => { order.push(1); d.exec("UPDATE users SET name = UPPER(name)"); return true; };
      const step2 = (d) => { order.push(2); d.exec("UPDATE users SET name = name || '!'"); };
      migrateTable(db, "users", { name: { type: "text" }, email: { type: "text" } }, 3, [step1, step2]);
      const row = db.prepare("SELECT name FROM users").get();
      const v = getTableVersion(db, "users");
      if(order[0] === 1 && order[1] === 2 && row.name === "ALICE!" && v === 3) ctx.pass();
      else ctx.fail(`order: ${JSON.stringify(order)}, name: ${row.name}, version: ${v}`);
    } finally {
      db.close();
    }
  },

  'migrateTable: skips steps already applied': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      migrateTable(db, "users", { name: { type: "text" } }, 1);
      let step1Calls = 0;
      let step2Calls = 0;
      const step1 = () => { step1Calls++; return true; };
      const step2 = () => { step2Calls++; return true; };
      migrateTable(db, "users", { name: { type: "text" } }, 2, [step1]);
      migrateTable(db, "users", { name: { type: "text" } }, 3, [step1, step2]);
      if(step1Calls === 1 && step2Calls === 1) ctx.pass();
      else ctx.fail(`step1: ${step1Calls}, step2: ${step2Calls}`);
    } finally {
      db.close();
    }
  },

  'migrateTable: backward compat (no version) defaults to v1': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      migrateTable(db, "users", { name: { type: "text" } });
      const cols = db.pragma("table_info(users)");
      const v = getTableVersion(db, "users");
      if(cols.length === 2 && v === 1) ctx.pass();
      else ctx.fail(`cols: ${cols.length}, version: ${v}`);
    } finally {
      db.close();
    }
  },

  'migrateTable: same version just syncs structure': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      migrateTable(db, "users", { name: { type: "text" } }, 2, [null]);
      migrateTable(db, "users", { name: { type: "text" }, email: { type: "text" } }, 2, [null]);
      const cols = db.pragma("table_info(users)").map(c => c.name);
      if(cols.includes("email")) ctx.pass();
      else ctx.fail(`cols: ${JSON.stringify(cols)}`);
    } finally {
      db.close();
    }
  },

  'migrateTable: pre-versioning table treated as v1': (ctx) => {
    const db = createTestDB();
    if(!db) return skip("better-sqlite3 not available", ctx);
    try {
      syncTable(db, "users", { name: { type: "text" } });
      db.prepare("INSERT INTO users (name) VALUES (?)").run("alice");
      let called = false;
      const fn = (d) => { called = true; d.exec("UPDATE users SET name = UPPER(name)"); return true; };
      migrateTable(db, "users", { name: { type: "text" }, email: { type: "text" } }, 2, [fn]);
      const row = db.prepare("SELECT name FROM users").get();
      const cols = db.pragma("table_info(users)").map(c => c.name);
      const v = getTableVersion(db, "users");
      if(called && row.name === "ALICE" && cols.includes("email") && v === 2) ctx.pass();
      else ctx.fail(`called: ${called}, name: ${row.name}, cols: ${JSON.stringify(cols)}, version: ${v}`);
    } finally {
      db.close();
    }
  },
};

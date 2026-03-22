import fs from "fs";
import path from "path";
import os from "os";

let testDir;
let dbDir;

export const beforeEach = async (log) => {
  testDir = fs.mkdtempSync(path.join(os.tmpdir(), "kempo-db-test-"));
  dbDir = path.join(testDir, "db");
  fs.mkdirSync(dbDir, { recursive: true });
};

export const afterEach = async (log) => {
  fs.rmSync(testDir, { recursive: true, force: true });
};

/*
  Helpers — reimplements the Database logic to test file I/O patterns
  since the actual class can't be imported outside Electron
*/

const filePath = table => path.join(dbDir, `${table}.json`);

const load = table => {
  const fp = filePath(table);
  try {
    if(fs.existsSync(fp)) return JSON.parse(fs.readFileSync(fp, "utf-8"));
  } catch {}
  return {};
};

const save = (table, data) => {
  fs.writeFileSync(filePath(table), JSON.stringify(data, null, 2), "utf-8");
};

const dbGet = (table, key) => {
  const data = load(table);
  if(key === undefined) return { ...data };
  return data[key];
};

const dbSet = (table, key, value) => {
  const data = load(table);
  data[key] = value;
  save(table, data);
  return true;
};

const dbDelete = (table, key) => {
  const data = load(table);
  delete data[key];
  save(table, data);
  return true;
};

const dbHas = (table, key) => key in load(table);

const dbClear = (table) => {
  save(table, {});
  return true;
};

export default {
  'get(table) without key returns all data': ({ pass, fail }) => {
    save("test", { a: 1, b: 2 });
    const result = dbGet("test");
    if(result.a === 1 && result.b === 2) pass();
    else fail(`Expected {a:1, b:2}, got ${JSON.stringify(result)}`);
  },

  'get(table) returns a copy, not a reference': ({ pass, fail }) => {
    save("test", { a: 1 });
    const result = dbGet("test");
    result.a = 999;
    const fresh = dbGet("test");
    if(fresh.a === 1) pass();
    else fail("get() returned a reference instead of a copy");
  },

  'get(table, key) returns specific value': ({ pass, fail }) => {
    save("test", { name: "test", count: 42 });
    if(dbGet("test", "name") === "test" && dbGet("test", "count") === 42) pass();
    else fail("get(table, key) did not return expected value");
  },

  'get(table, key) returns undefined for missing key': ({ pass, fail }) => {
    save("test", {});
    if(dbGet("test", "nonexistent") === undefined) pass();
    else fail("Expected undefined for missing key");
  },

  'set(table, key, value) persists data to file': ({ pass, fail }) => {
    dbSet("test", "foo", "bar");
    const raw = JSON.parse(fs.readFileSync(filePath("test"), "utf-8"));
    if(raw.foo === "bar") pass();
    else fail(`Expected foo=bar in file, got ${JSON.stringify(raw)}`);
  },

  'set(table, key, value) returns true': ({ pass, fail }) => {
    const result = dbSet("test", "x", 1);
    if(result === true) pass();
    else fail(`Expected true, got ${result}`);
  },

  'set() handles complex values': ({ pass, fail }) => {
    const complex = { nested: { array: [1, 2, 3], bool: true } };
    dbSet("test", "complex", complex);
    const raw = JSON.parse(fs.readFileSync(filePath("test"), "utf-8"));
    if(JSON.stringify(raw.complex) === JSON.stringify(complex)) pass();
    else fail("Complex value not persisted correctly");
  },

  'delete(table, key) removes the key': ({ pass, fail }) => {
    save("test", { a: 1, b: 2 });
    dbDelete("test", "a");
    const raw = JSON.parse(fs.readFileSync(filePath("test"), "utf-8"));
    if(!("a" in raw) && raw.b === 2) pass();
    else fail(`Expected a to be deleted, got ${JSON.stringify(raw)}`);
  },

  'delete(table, key) returns true': ({ pass, fail }) => {
    save("test", { a: 1 });
    if(dbDelete("test", "a") === true) pass();
    else fail("Expected true");
  },

  'has(table, key) returns true for existing key': ({ pass, fail }) => {
    save("test", { name: "test" });
    if(dbHas("test", "name") === true) pass();
    else fail("Expected true");
  },

  'has(table, key) returns false for missing key': ({ pass, fail }) => {
    save("test", {});
    if(dbHas("test", "missing") === false) pass();
    else fail("Expected false");
  },

  'clear(table) removes all data': ({ pass, fail }) => {
    save("test", { a: 1, b: 2, c: 3 });
    dbClear("test");
    const raw = JSON.parse(fs.readFileSync(filePath("test"), "utf-8"));
    if(Object.keys(raw).length === 0) pass();
    else fail(`Expected empty object, got ${JSON.stringify(raw)}`);
  },

  'get on missing table auto-creates empty object': ({ pass, fail }) => {
    const data = dbGet("nonexistent");
    if(Object.keys(data).length === 0) pass();
    else fail("Expected empty object for missing table");
  },

  'load() handles corrupted JSON': ({ pass, fail }) => {
    fs.writeFileSync(filePath("bad"), "not valid json{{{", "utf-8");
    const data = dbGet("bad");
    if(Object.keys(data).length === 0) pass();
    else fail("Corrupted JSON not handled correctly");
  },

  'data persists between load cycles': ({ pass, fail }) => {
    dbSet("test", "persistent", "value");
    if(dbGet("test", "persistent") === "value") pass();
    else fail("Data did not persist between cycles");
  },

  'separate tables are independent': ({ pass, fail }) => {
    dbSet("tableA", "key", "A");
    dbSet("tableB", "key", "B");
    if(dbGet("tableA", "key") === "A" && dbGet("tableB", "key") === "B") pass();
    else fail("Tables are not independent");
  },

  'each table has its own file': ({ pass, fail }) => {
    dbSet("alpha", "x", 1);
    dbSet("beta", "y", 2);
    const alphaExists = fs.existsSync(filePath("alpha"));
    const betaExists = fs.existsSync(filePath("beta"));
    if(alphaExists && betaExists) pass();
    else fail("Expected separate files for each table");
  },

  'clear one table does not affect another': ({ pass, fail }) => {
    dbSet("keep", "data", "safe");
    dbSet("wipe", "data", "gone");
    dbClear("wipe");
    if(dbGet("keep", "data") === "safe" && dbGet("wipe", "data") === undefined) pass();
    else fail("Clearing one table affected another");
  },

  'JSON output is pretty-printed': ({ pass, fail }) => {
    dbSet("test", "key", "value");
    const raw = fs.readFileSync(filePath("test"), "utf-8");
    if(raw.includes("\n") && raw.includes("  ")) pass();
    else fail("JSON is not pretty-printed");
  },
};

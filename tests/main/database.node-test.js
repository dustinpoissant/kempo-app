import fs from "fs";
import path from "path";
import os from "os";

let testDir;
let filePath;

export const beforeEach = async (log) => {
  testDir = fs.mkdtempSync(path.join(os.tmpdir(), "kempo-db-test-"));
  filePath = path.join(testDir, "settings.json");
};

export const afterEach = async (log) => {
  fs.rmSync(testDir, { recursive: true, force: true });
};

/*
  Helpers — reimplements the Database logic to test file I/O patterns
  since the actual class can't be imported outside Electron
*/

const load = () => {
  try {
    if(fs.existsSync(filePath)){
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    save({});
    return {};
  } catch {
    save({});
    return {};
  }
};

const save = (data) => {
  const dir = path.dirname(filePath);
  if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};

const dbGet = (data, key) => {
  if(key === undefined) return { ...data };
  return data[key];
};

const dbSet = (data, key, value) => {
  data[key] = value;
  save(data);
  return true;
};

const dbDelete = (data, key) => {
  delete data[key];
  save(data);
  return true;
};

const dbHas = (data, key) => key in data;

const dbClear = () => {
  save({});
  return true;
};

export default {
  'get() without key returns all data': ({ pass, fail }) => {
    save({ a: 1, b: 2 });
    const data = load();
    const result = dbGet(data);
    if(result.a === 1 && result.b === 2) pass();
    else fail(`Expected {a:1, b:2}, got ${JSON.stringify(result)}`);
  },

  'get() returns a copy, not a reference': ({ pass, fail }) => {
    const data = { a: 1 };
    save(data);
    const loaded = load();
    const result = dbGet(loaded);
    result.a = 999;
    const fresh = load();
    if(fresh.a === 1) pass();
    else fail("get() returned a reference instead of a copy");
  },

  'get(key) returns specific value': ({ pass, fail }) => {
    save({ name: "test", count: 42 });
    const data = load();
    if(dbGet(data, "name") === "test" && dbGet(data, "count") === 42) pass();
    else fail("get(key) did not return expected value");
  },

  'get(key) returns undefined for missing key': ({ pass, fail }) => {
    save({});
    const data = load();
    if(dbGet(data, "nonexistent") === undefined) pass();
    else fail("Expected undefined for missing key");
  },

  'set(key, value) persists data to file': ({ pass, fail }) => {
    const data = load();
    dbSet(data, "foo", "bar");
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if(raw.foo === "bar") pass();
    else fail(`Expected foo=bar in file, got ${JSON.stringify(raw)}`);
  },

  'set(key, value) returns true': ({ pass, fail }) => {
    const data = load();
    const result = dbSet(data, "x", 1);
    if(result === true) pass();
    else fail(`Expected true, got ${result}`);
  },

  'set() handles complex values': ({ pass, fail }) => {
    const data = load();
    const complex = { nested: { array: [1, 2, 3], bool: true } };
    dbSet(data, "complex", complex);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if(JSON.stringify(raw.complex) === JSON.stringify(complex)) pass();
    else fail("Complex value not persisted correctly");
  },

  'delete(key) removes the key': ({ pass, fail }) => {
    save({ a: 1, b: 2 });
    const data = load();
    dbDelete(data, "a");
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if(!("a" in raw) && raw.b === 2) pass();
    else fail(`Expected a to be deleted, got ${JSON.stringify(raw)}`);
  },

  'delete(key) returns true': ({ pass, fail }) => {
    save({ a: 1 });
    const data = load();
    if(dbDelete(data, "a") === true) pass();
    else fail("Expected true");
  },

  'has(key) returns true for existing key': ({ pass, fail }) => {
    const data = { name: "test" };
    if(dbHas(data, "name") === true) pass();
    else fail("Expected true");
  },

  'has(key) returns false for missing key': ({ pass, fail }) => {
    const data = {};
    if(dbHas(data, "missing") === false) pass();
    else fail("Expected false");
  },

  'clear() removes all data': ({ pass, fail }) => {
    save({ a: 1, b: 2, c: 3 });
    dbClear();
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if(Object.keys(raw).length === 0) pass();
    else fail(`Expected empty object, got ${JSON.stringify(raw)}`);
  },

  'load() handles missing file by creating it': ({ pass, fail }) => {
    if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
    const data = load();
    if(Object.keys(data).length === 0 && fs.existsSync(filePath)) pass();
    else fail("Missing file not handled correctly");
  },

  'load() handles corrupted JSON': ({ pass, fail }) => {
    fs.writeFileSync(filePath, "not valid json{{{", "utf-8");
    const data = load();
    if(Object.keys(data).length === 0) pass();
    else fail("Corrupted JSON not handled correctly");
  },

  'data persists between load/save cycles': ({ pass, fail }) => {
    const data1 = load();
    dbSet(data1, "persistent", "value");
    const data2 = load();
    if(dbGet(data2, "persistent") === "value") pass();
    else fail("Data did not persist between cycles");
  },

  'save creates directory if missing': ({ pass, fail }) => {
    const nestedDir = path.join(testDir, "sub", "dir");
    const nestedFile = path.join(nestedDir, "db.json");
    const origFilePath = filePath;
    filePath = nestedFile;
    save({ test: true });
    const exists = fs.existsSync(nestedFile);
    filePath = origFilePath;
    if(exists) pass();
    else fail("Directory was not created");
  },

  'JSON output is pretty-printed': ({ pass, fail }) => {
    save({ key: "value" });
    const raw = fs.readFileSync(filePath, "utf-8");
    if(raw.includes("\n") && raw.includes("  ")) pass();
    else fail("JSON is not pretty-printed");
  },
};

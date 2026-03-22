import fs from "fs";
import path from "path";
import { app } from "electron";

export default class Database {
  #dir;
  #tables = new Map();

  constructor() {
    this.#dir = path.join(app.getPath("userData"), "db");
    if(!fs.existsSync(this.#dir)) fs.mkdirSync(this.#dir, { recursive: true });
  }

  /*
    Private Methods
  */

  #filePath = table => path.join(this.#dir, `${table}.json`);

  #load(table) {
    if(this.#tables.has(table)) return this.#tables.get(table);
    const fp = this.#filePath(table);
    let data = {};
    try {
      if(fs.existsSync(fp)) data = JSON.parse(fs.readFileSync(fp, "utf-8"));
    } catch {
      data = {};
    }
    this.#tables.set(table, data);
    return data;
  }

  #save(table) {
    fs.writeFileSync(this.#filePath(table), JSON.stringify(this.#tables.get(table) ?? {}, null, 2), "utf-8");
  }

  /*
    Public Methods
  */

  get = (table, key) => {
    const data = this.#load(table);
    if(key === undefined) return { ...data };
    return data[key];
  };

  set = (table, key, value) => {
    const data = this.#load(table);
    data[key] = value;
    this.#save(table);
    return true;
  };

  delete = (table, key) => {
    const data = this.#load(table);
    delete data[key];
    this.#save(table);
    return true;
  };

  has = (table, key) => key in this.#load(table);

  clear = (table) => {
    this.#tables.set(table, {});
    this.#save(table);
    return true;
  };
}

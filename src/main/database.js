import fs from "fs";
import path from "path";
import { app } from "electron";

class Database {
  #filePath;
  #data = {};

  constructor(filename = "settings.json") {
    this.#filePath = path.join(app.getPath("userData"), filename);
    this.#load();
  }

  /*
    Private Methods
  */

  #load() {
    try {
      if(fs.existsSync(this.#filePath)){
        this.#data = JSON.parse(fs.readFileSync(this.#filePath, "utf-8"));
      } else {
        this.#save();
      }
    } catch {
      this.#data = {};
      this.#save();
    }
  }

  #save() {
    const dir = path.dirname(this.#filePath);
    if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.#filePath, JSON.stringify(this.#data, null, 2), "utf-8");
  }

  /*
    Public Methods
  */

  get = (key) => {
    if(key === undefined) return { ...this.#data };
    return this.#data[key];
  };

  set = (key, value) => {
    this.#data[key] = value;
    this.#save();
    return true;
  };

  delete = (key) => {
    delete this.#data[key];
    this.#save();
    return true;
  };

  has = key => key in this.#data;

  clear = () => {
    this.#data = {};
    this.#save();
    return true;
  };
}

export default Database;

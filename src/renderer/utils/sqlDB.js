const escape = v => {
  if(v === null || v === undefined) return 'NULL';
  if(typeof v === 'boolean') return v ? 1 : 0;
  if(typeof v === 'number') return v;
  return `'${String(v).replace(/'/g, "''")}'`;
};

const toWhere = filter => {
  const keys = Object.keys(filter);
  if(!keys.length) return '';
  return 'WHERE ' + keys.map(k => `${k} = ${escape(filter[k])}`).join(' AND ');
};

const toSet = data => Object.keys(data).map(k => `${k} = ${escape(data[k])}`).join(', ');

/*
  Record
*/

class Record {
  #tableName;
  #rowid;
  #query;
  data;

  constructor(tableName, rowid, query, data) {
    this.#tableName = tableName;
    this.#rowid = rowid;
    this.#query = query;
    this.data = { ...data };
  }

  async update(newData) {
    await this.#query(`UPDATE ${this.#tableName} SET ${toSet(newData)} WHERE rowid = ${this.#rowid}`);
    Object.assign(this.data, newData);
  }

  delete() {
    return this.#query(`DELETE FROM ${this.#tableName} WHERE rowid = ${this.#rowid}`);
  }
}

/*
  Table
*/

class Table {
  #name;
  #query;

  constructor(name, query) {
    this.#name = name;
    this.#query = query;
  }

  #record(row) {
    const { rowid, ...data } = row;
    return new Record(this.#name, rowid, this.#query, data);
  }

  async create(data) {
    const keys = Object.keys(data);
    await this.#query(`INSERT INTO ${this.#name} (${keys.join(', ')}) VALUES (${keys.map(k => escape(data[k])).join(', ')})`);
    const rows = await this.#query(`SELECT rowid, * FROM ${this.#name} WHERE rowid = last_insert_rowid()`);
    return this.#record(rows[0]);
  }

  async get(filter = {}) {
    const rows = await this.#query(`SELECT rowid, * FROM ${this.#name} ${toWhere(filter)} ORDER BY rowid ASC LIMIT 1`);
    return rows[0] ? this.#record(rows[0]) : null;
  }

  async getLast(filter = {}) {
    const rows = await this.#query(`SELECT rowid, * FROM ${this.#name} ${toWhere(filter)} ORDER BY rowid DESC LIMIT 1`);
    return rows[0] ? this.#record(rows[0]) : null;
  }

  async getAll(filter = {}) {
    const rows = await this.#query(`SELECT rowid, * FROM ${this.#name} ${toWhere(filter)}`);
    return rows.map(r => this.#record(r));
  }

  update(filter, newData) {
    return this.#query(`UPDATE ${this.#name} SET ${toSet(newData)} WHERE rowid IN (SELECT rowid FROM ${this.#name} ${toWhere(filter)} LIMIT 1)`);
  }

  updateAll(filter, newData) {
    return this.#query(`UPDATE ${this.#name} SET ${toSet(newData)} ${toWhere(filter)}`);
  }

  delete(filter) {
    return this.#query(`DELETE FROM ${this.#name} WHERE rowid IN (SELECT rowid FROM ${this.#name} ${toWhere(filter)} LIMIT 1)`);
  }

  deleteAll(filter) {
    return this.#query(`DELETE FROM ${this.#name} ${toWhere(filter)}`);
  }
}

/*
  DB
*/

let queryFn = null;

const resolveQuery = async () => {
  if(queryFn) return queryFn;
  if(typeof window !== "undefined") {
    queryFn = (dbName, sql) => window.api.sqlQuery(dbName, sql);
  } else {
    const { query } = await import(new URL("../../main/sqlQuery.js", import.meta.url));
    queryFn = query;
  }
  return queryFn;
};

export default class DB {
  #name;

  constructor(name) {
    this.#name = name;
  }

  async query(sql) {
    return (await resolveQuery())(this.#name, sql);
  }

  table(name) {
    return new Table(name, sql => this.query(sql));
  }
}

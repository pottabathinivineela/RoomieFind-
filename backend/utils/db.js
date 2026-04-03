const fs = require("fs");
const path = require("path");
const DATA_DIR = path.join(__dirname, "../data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const fp = (col) => path.join(DATA_DIR, `${col}.json`);
const read = (col) => { try { return JSON.parse(fs.readFileSync(fp(col), "utf8")); } catch { return []; } };
const writeAll = (col, data) => fs.writeFileSync(fp(col), JSON.stringify(data, null, 2));
const findAll = (col) => read(col);
const findOne = (col, fn) => read(col).find(fn) || null;
const findMany = (col, fn) => read(col).filter(fn);
const insert = (col, doc) => { const d = read(col); d.push(doc); writeAll(col, d); return doc; };
const update = (col, fn, upd) => {
  const d = read(col); const i = d.findIndex(fn); if (i === -1) return null;
  d[i] = { ...d[i], ...upd, updatedAt: new Date().toISOString() }; writeAll(col, d); return d[i];
};
const remove = (col, fn) => writeAll(col, read(col).filter((d) => !fn(d)));
module.exports = { findAll, findOne, findMany, insert, update, remove, writeAll };

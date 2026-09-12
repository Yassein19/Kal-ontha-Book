import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../kal_ontha.db');

// Ensure db directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(DB_PATH);

// Run schema initialization
const schemaPath = path.join(__dirname, 'schema.sql');
if (fs.existsSync(schemaPath)) {
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
}

// Database helper functions
export const queryAll = (sql, params = []) => {
  const stmt = db.prepare(sql);
  return stmt.all(...params);
};

export const queryOne = (sql, params = []) => {
  const stmt = db.prepare(sql);
  return stmt.get(...params);
};

export const execute = (sql, params = []) => {
  const stmt = db.prepare(sql);
  return stmt.run(...params);
};

export default {
  db,
  queryAll,
  queryOne,
  execute,
};

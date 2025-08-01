import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
dotenv.config();

const dbPath = process.env.DB_PATH || ':memory:';

export async function getDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

export async function initDb() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT,
      price REAL,
      imageUrl TEXT,
      rating REAL,
      style TEXT,
      isHotDeal INTEGER DEFAULT 0,
      isNew INTEGER DEFAULT 0,
      isBestSeller INTEGER DEFAULT 0
    );
  `);
  return db;
}

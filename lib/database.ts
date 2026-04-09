import DatabaseConstructor, {
  Database as BetterSqlite3Database,
} from "better-sqlite3";
import { join } from "path";
import { mkdirSync, existsSync } from "fs";
import { randomUUID } from "crypto";

export const DATABASES_DIR = join(process.cwd(), "databases");
export const DB_PATH = join(DATABASES_DIR, "database.db");

export function getDatabasePath(databaseName: string): string {
  const base = databaseName
    .replace(/\.db$/i, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  return join(DATABASES_DIR, `${base}.db`);
}

// check db directory exists
if (!existsSync(DATABASES_DIR)) {
  mkdirSync(DATABASES_DIR, { recursive: true });
}

// intialize db
export function initializeDb(): void {
  if (!existsSync(DB_PATH)) {
    const db = new DatabaseConstructor(DB_PATH);

    // Create users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          password TEXT NOT NULL,
          created TEXT NOT NULL DEFAULT (datetime('now')),
          modified TEXT NOT NULL DEFAULT (datetime('now')),
          deleted TEXT
        )
      `);

    // Create users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          category TEXT,
          priority TEXT,
          due_date TEXT,
          created TEXT NOT NULL DEFAULT (datetime('now')),
          modified TEXT NOT NULL DEFAULT (datetime('now')),
          deleted TEXT
        )
      `);

    db.close();
  }
}

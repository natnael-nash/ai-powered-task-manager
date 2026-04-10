import Database from "better-sqlite3";
import { existsSync } from "fs";
import { DB_PATH } from "./database";

export interface Migration {
  version: number;
  name: string;
  up: (db: Database.Database) => void;
  /** Optional. If present, allows rolling back this migration. */
  down?: (db: Database.Database) => void;
}

// create schema_version - all other migrations depend on this
const ensureSchemaVersionTable = (db: Database.Database): void => {
  db.exec(`
      CREATE TABLE IF NOT EXISTS schema_version (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
};

// get the current migration of db and avoid running again
const getCurrentVersion = (db: Database.Database): number => {
  const row = db
    .prepare(`SELECT MAX(version) as version FROM schema_version`)
    .get() as { version: number | null };
  return row?.version ?? 0;
};

const recordMigration = (
  db: Database.Database,
  version: number,
  name: string
): void => {
  db.prepare(`INSERT INTO schema_version (version, name) VALUES (?, ?)`).run(
    version,
    name
  );
};

// list of migrations
export const migrations: Migration[] = [
  {
    version: 1,
    name: "add_columns_description_and_reminder_time_note_to_tasks",
    up(db) {
      const tbl = db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'"
        )
        .get() as { name?: string } | undefined;
      if (!tbl?.name) return;

      const tableInfo = db.prepare("PRAGMA table_info(tasks)").all() as {
        name: string;
      }[];

      const newCols = ["description", "reminder_time", "note"];

      newCols.map((col) => {
        if (!tableInfo.some((c) => c.name === col)) {
          db.exec(`
            ALTER TABLE tasks ADD COLUMN ${col} TEXT 
          `);
        }
      });
      return;
    },
  },

  {
    version: 2,
    name: "add_column_status_to_tasks",
    up(db) {
      const tbl = db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'"
        )
        .get() as { name?: string } | undefined;
      if (!tbl?.name) return;

      const tableInfo = db.prepare("PRAGMA table_info(tasks)").all() as {
        name: string;
      }[];

      if (!tableInfo.some((c) => c.name === "status")) {
        db.exec(`
            ALTER TABLE tasks ADD COLUMN status TEXT 
          `);
      }

      return;
    },
  },
];

export function runMigrations(): { applied: string[]; error?: string } {
  const dbPath = DB_PATH;

  if (!existsSync(dbPath)) {
    return { applied: [], error: `Database not found: ${dbPath}` };
  }

  const db = new Database(dbPath);
  const applied: string[] = [];

  try {
    ensureSchemaVersionTable(db);
    const current = getCurrentVersion(db);
    const pending = migrations.filter((m) => m.version > current);

    for (const m of pending) {
      db.exec("BEGIN");
      try {
        m.up(db);
        recordMigration(db, m.version, m.name);
        db.exec("COMMIT");
        applied.push(`${m.version}: ${m.name}`);
      } catch (err: unknown) {
        db.exec("ROLLBACK");
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(
          `Migration ${m.version} (${m.name}) failed: ${message}`
        );
      }
    }
  } finally {
    db.close();
  }

  return { applied };
}

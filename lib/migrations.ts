import Database from "better-sqlite3";
import { existsSync } from "fs";

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
export const tenantMigrations: Migration[] = [];

export function runMigrations(
  dbPath: string,
  migrations: Migration[]
): { applied: string[]; error?: string } {
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

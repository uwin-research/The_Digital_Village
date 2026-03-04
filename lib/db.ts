import Database from "better-sqlite3";
import path from "path";

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), "golden-shield.db");
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    initSchema(db);
  }
  return db;
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS data (
      session_id TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      PRIMARY KEY (session_id, key)
    );
  `);
}

type DataKey =
  | "auth"
  | "progress"
  | "updates_answer"
  | "suspicious_answer"
  | "quiz_pre"
  | "quiz_post";

export function getData(sessionId: string, key: DataKey): string | null {
  const database = getDb();
  const row = database.prepare("SELECT value FROM data WHERE session_id = ? AND key = ?").get(sessionId, key) as { value: string } | undefined;
  return row?.value ?? null;
}

export function setData(sessionId: string, key: DataKey, value: string): void {
  const database = getDb();
  database.prepare("INSERT OR REPLACE INTO data (session_id, key, value) VALUES (?, ?, ?)").run(sessionId, key, value);
}

export function deleteData(sessionId: string, key: DataKey): void {
  const database = getDb();
  database.prepare("DELETE FROM data WHERE session_id = ? AND key = ?").run(sessionId, key);
}

export function deleteModuleProgress(sessionId: string, moduleSlug: string): void {
  const raw = getData(sessionId, "progress");
  if (!raw) return;
  try {
    const progress = JSON.parse(raw) as Record<string, Record<string, boolean>>;
    if (progress[moduleSlug]) {
      delete progress[moduleSlug];
      setData(sessionId, "progress", JSON.stringify(progress));
    }
  } catch {
    // ignore
  }
}

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

    -- NEW: real accounts table. Separate from "data" above because an
    -- account must exist independent of any one browser session (you
    -- should be able to create an account on one device and sign in on
    -- a completely different one). email is the primary key, so each
    -- email can only be registered once.
    CREATE TABLE IF NOT EXISTS accounts (
      email TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

type DataKey =
  | "auth"
  | "progress"
  | "updates_answer"
  | "suspicious_answer"
  | "profile";

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

// ---------- Accounts ----------

export interface Account {
  email: string;
  passwordHash: string;
  passwordSalt: string;
}

export function getAccount(email: string): Account | null {
  const database = getDb();
  const row = database
    .prepare("SELECT email, password_hash, password_salt FROM accounts WHERE email = ?")
    .get(email) as { email: string; password_hash: string; password_salt: string } | undefined;
  if (!row) return null;
  return { email: row.email, passwordHash: row.password_hash, passwordSalt: row.password_salt };
}

export function createAccount(email: string, passwordHash: string, passwordSalt: string): void {
  const database = getDb();
  database
    .prepare("INSERT INTO accounts (email, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?)")
    .run(email, passwordHash, passwordSalt, new Date().toISOString());
}

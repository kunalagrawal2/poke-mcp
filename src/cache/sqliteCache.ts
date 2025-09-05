import Database from 'better-sqlite3';

export type CacheRow = {
  key: string;          // e.g., "pokemon/charizard"
  json: string;         // raw JSON
  fetched_at: number;   // epoch ms
};

let db: Database.Database | null = null;

export function initCache(dbPath = process.env.POKE_CACHE_PATH || 'poke_cache.sqlite') {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS cache (
      key TEXT PRIMARY KEY,
      json TEXT NOT NULL,
      fetched_at INTEGER NOT NULL
    );
  `);
}

export function getCache(key: string): CacheRow | null {
  if (!db) throw new Error('Cache not initialized');
  const row = db.prepare('SELECT key, json, fetched_at FROM cache WHERE key = ?').get(key) as CacheRow | undefined;
  return row ?? null;
}

export function upsertCache(row: CacheRow) {
  if (!db) throw new Error('Cache not initialized');
  db.prepare(`
    INSERT INTO cache (key, json, fetched_at)
    VALUES (@key, @json, @fetched_at)
    ON CONFLICT(key) DO UPDATE SET
      json = excluded.json,
      fetched_at = excluded.fetched_at
  `).run(row);
}

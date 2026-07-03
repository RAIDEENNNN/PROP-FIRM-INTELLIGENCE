import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
const USE_POSTGRES = Boolean(DATABASE_URL);

const recordCollections = [
  'firms',
  'discountCodes',
  'giveaways',
  'reviews',
  'payoutProofs',
  'ruleChanges',
  'alerts',
  'news',
  'feedback',
  'giveawayEntries',
  'affiliateClicks'
];

let poolPromise;
let writeQueue = Promise.resolve();

export function usingPostgres() {
  return USE_POSTGRES;
}

function normalizeDbShape(db = {}) {
  for (const collection of recordCollections) db[collection] = db[collection] || [];
  db.users = db.users || [];
  db.sessions = db.sessions || [];
  db.profiles = db.profiles || [];
  db.dashboardAccounts = db.dashboardAccounts || [];
  return db;
}

async function getPool() {
  if (!USE_POSTGRES) return null;
  if (!poolPromise) {
    poolPromise = import('pg').then(({ Pool }) => {
      const sslMode = String(process.env.PGSSLMODE || '').toLowerCase();
      const wantsSsl = sslMode !== 'disable' && !DATABASE_URL.includes('sslmode=disable');
      return new Pool({
        connectionString: DATABASE_URL,
        ssl: wantsSsl ? { rejectUnauthorized: false } : false
      });
    }).catch((error) => {
      throw new Error(`Postgres support needs the "pg" package installed. Run npm install, then try again. ${error.message}`);
    });
  }
  return poolPromise;
}

async function readJsonDb() {
  const raw = await readFile(DB_PATH, 'utf8');
  return normalizeDbShape(JSON.parse(raw));
}

async function writeJsonDb(db) {
  await writeFile(DB_PATH, JSON.stringify(normalizeDbShape(db), null, 2));
}

function rowDate(value) {
  return value instanceof Date ? value.toISOString() : value;
}

async function readPostgresDb() {
  const pool = await getPool();
  const client = await pool.connect();
  try {
    const db = normalizeDbShape({});

    const [records, users, sessions, profiles, accounts] = await Promise.all([
      client.query('select collection, data from app_records order by created_at asc'),
      client.query('select id, name, email, password_hash, role, created_at from app_users order by created_at asc'),
      client.query('select id, user_id, token_hash, created_at, expires_at, user_agent from app_sessions order by created_at asc'),
      client.query('select user_id, data from app_profiles order by updated_at asc'),
      client.query('select id, user_id, data from app_dashboard_accounts order by created_at asc')
    ]);

    for (const row of records.rows) {
      if (!db[row.collection]) db[row.collection] = [];
      db[row.collection].push(row.data);
    }

    db.users = users.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role || 'user',
      createdAt: rowDate(row.created_at)
    }));

    db.sessions = sessions.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      tokenHash: row.token_hash,
      createdAt: rowDate(row.created_at),
      expiresAt: rowDate(row.expires_at),
      userAgent: row.user_agent || ''
    }));

    db.profiles = profiles.rows.map((row) => ({ ...(row.data || {}), userId: row.user_id }));
    db.dashboardAccounts = accounts.rows.map((row) => ({ ...(row.data || {}), id: row.data?.id ?? row.id, userId: row.user_id }));

    return normalizeDbShape(db);
  } finally {
    client.release();
  }
}

async function writePostgresDb(db) {
  const pool = await getPool();
  const client = await pool.connect();
  const shaped = normalizeDbShape(db);
  try {
    await client.query('begin');
    await client.query('delete from app_records');
    await client.query('delete from app_dashboard_accounts');
    await client.query('delete from app_profiles');
    await client.query('delete from app_sessions');
    await client.query('delete from app_users');

    for (const collection of recordCollections) {
      for (const item of shaped[collection] || []) {
        const id = String(item.id || `${collection}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
        await client.query(
          'insert into app_records (collection, id, data) values ($1, $2, $3::jsonb)',
          [collection, id, JSON.stringify({ ...item, id })]
        );
      }
    }

    for (const user of shaped.users || []) {
      await client.query(
        'insert into app_users (id, name, email, password_hash, role, created_at) values ($1, $2, $3, $4, $5, $6)',
        [user.id, user.name || 'Trader', String(user.email || '').toLowerCase(), user.passwordHash || user.password_hash || user.password || '', user.role || 'user', user.createdAt || new Date().toISOString()]
      );
    }

    for (const session of shaped.sessions || []) {
      await client.query(
        'insert into app_sessions (id, user_id, token_hash, created_at, expires_at, user_agent) values ($1, $2, $3, $4, $5, $6)',
        [session.id, session.userId || session.user_id, session.tokenHash || session.token_hash, session.createdAt || new Date().toISOString(), session.expiresAt, session.userAgent || session.user_agent || '']
      );
    }

    for (const profile of shaped.profiles || []) {
      const userId = profile.userId || profile.user_id;
      if (!userId) continue;
      await client.query(
        'insert into app_profiles (user_id, data) values ($1, $2::jsonb)',
        [userId, JSON.stringify({ ...profile, userId })]
      );
    }

    for (const account of shaped.dashboardAccounts || []) {
      const userId = account.userId || account.user_id || 'user-demo';
      const id = String(account.id || `account-${Date.now()}-${Math.random().toString(16).slice(2)}`);
      await client.query(
        'insert into app_dashboard_accounts (id, user_id, data) values ($1, $2, $3::jsonb)',
        [id, userId, JSON.stringify({ ...account, id: account.id ?? id, userId })]
      );
    }

    await client.query('commit');
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}

export async function readDb() {
  return USE_POSTGRES ? readPostgresDb() : readJsonDb();
}

export async function writeDb(db) {
  writeQueue = writeQueue.catch(() => {}).then(() => USE_POSTGRES ? writePostgresDb(db) : writeJsonDb(db));
  await writeQueue;
}

export async function migrateJsonToPostgres() {
  if (!USE_POSTGRES) throw new Error('DATABASE_URL is required before migrating to Postgres.');
  const db = await readJsonDb();
  await writePostgresDb(db);
  return db;
}

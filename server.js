import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readDb, writeDb, usingPostgres } from './storage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 48732);
const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = 'fundscope_session';
const SESSION_DAYS = 30;
const ADMIN_EMAILS = String(process.env.ADMIN_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function sendJson(res, status, payload, extraHeaders = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    ...extraHeaders
  });
  res.end(JSON.stringify(payload));
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return {};
  }
}

function withFirmNames(db, rows) {
  return rows.map((row) => ({
    ...row,
    firm: db.firms.find((firm) => firm.id === row.firmId)?.name || 'Unknown firm'
  }));
}

function ensureDbShape(db) {
  db.users = db.users || [];
  db.sessions = db.sessions || [];
  db.profiles = db.profiles || [];
  db.dashboardAccounts = (db.dashboardAccounts || []).map((account) => ({
    userId: account.userId || 'user-demo',
    ...account
  }));
  db.feedback = db.feedback || [];
  db.giveawayEntries = db.giveawayEntries || [];
  db.affiliateClicks = db.affiliateClicks || [];
  db.discountCodes = db.discountCodes || [];
  db.giveaways = db.giveaways || [];
  db.ruleChanges = db.ruleChanges || [];
  db.alerts = db.alerts || [];
  db.news = db.news || [];
  return db;
}

function safeUser(user) {
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, role: adminRole(user) ? 'admin' : 'user', createdAt: user.createdAt };
}

function adminRole(user) {
  if (!user) return false;
  return user.role === 'admin' || ADMIN_EMAILS.includes(String(user.email || '').toLowerCase());
}

function hasAdminConfigured(db) {
  return ADMIN_EMAILS.length > 0 || (db.users || []).some((user) => user.role === 'admin');
}

function defaultProfile(userId) {
  return { userId, experience: 'New', market: 'Forex', budget: 150, riskStyle: 'Balanced', preferredPayout: 'Fast', savedFirmIds: [], alertFirmIds: [] };
}

function getProfile(db, userId) {
  let profile = db.profiles.find((item) => item.userId === userId);
  if (!profile) {
    profile = defaultProfile(userId);
    db.profiles.push(profile);
  }
  return profile;
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${key.toString('hex')}`;
}

async function verifyPassword(user, password) {
  if (!user) return false;
  if (user.passwordHash?.startsWith('scrypt:')) {
    const [, salt, stored] = user.passwordHash.split(':');
    const candidate = await scrypt(password, salt, 64);
    const storedBuffer = Buffer.from(stored, 'hex');
    return storedBuffer.length === candidate.length && timingSafeEqual(storedBuffer, candidate);
  }
  return Boolean(user.password && user.password === password);
}

function tokenHash(token) {
  return createHash('sha256').update(token).digest('hex');
}

function parseCookies(req) {
  return Object.fromEntries(String(req.headers.cookie || '').split(';').map((pair) => {
    const index = pair.indexOf('=');
    if (index < 0) return ['', ''];
    return [pair.slice(0, index).trim(), decodeURIComponent(pair.slice(index + 1).trim())];
  }).filter(([key]) => key));
}

function cookieFlags(req) {
  const host = String(req.headers.host || '');
  const secure = req.headers['x-forwarded-proto'] === 'https' || Boolean(req.socket.encrypted);
  const local = host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('[::1]');
  const secureFlag = secure && !local;
  return `HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_DAYS * 24 * 60 * 60}${secureFlag ? '; Secure' : ''}`;
}

function expiredSession() {
  return `HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

function createSession(db, user, req) {
  const token = randomBytes(32).toString('hex');
  const now = Date.now();
  const session = {
    id: `session-${now}-${randomBytes(4).toString('hex')}`,
    userId: user.id,
    tokenHash: tokenHash(token),
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    userAgent: String(req.headers['user-agent'] || '').slice(0, 220)
  };
  db.sessions = (db.sessions || []).filter((item) => new Date(item.expiresAt).getTime() > now);
  db.sessions.push(session);
  return token;
}

function getSessionUser(req, db) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (!token) return null;
  const now = Date.now();
  const hash = tokenHash(token);
  const session = (db.sessions || []).find((item) => item.tokenHash === hash && new Date(item.expiresAt).getTime() > now);
  if (!session) return null;
  const user = db.users.find((item) => item.id === session.userId);
  return user ? { user, session } : null;
}

function requireUser(req, res, db) {
  const auth = getSessionUser(req, db);
  if (!auth) {
    sendError(res, 401, 'Sign in required');
    return null;
  }
  return auth.user;
}

function requireAdmin(req, res, db) {
  const user = requireUser(req, res, db);
  if (!user) return null;
  if (!adminRole(user)) {
    sendError(res, 403, 'Admin access required');
    return null;
  }
  return user;
}

function publicBootstrap(db) {
  return {
    firms: db.firms,
    discountCodes: withFirmNames(db, db.discountCodes.filter((deal) => deal.status === 'active')),
    giveaways: withFirmNames(db, db.giveaways.filter((giveaway) => giveaway.status === 'open')),
    reviews: db.reviews,
    payoutProofs: db.payoutProofs,
    ruleChanges: withFirmNames(db, db.ruleChanges || []),
    alerts: withFirmNames(db, db.alerts || []),
    news: withFirmNames(db, db.news || [])
  };
}

function scoreFirm(firm, preferences = {}) {
  let score = Number(firm.rating || 0) * 18;
  const budget = Number(preferences.budget || 0);
  const market = String(preferences.market || '').toLowerCase();
  const payout = String(preferences.preferredPayout || '').toLowerCase();
  const risk = String(preferences.riskStyle || '').toLowerCase();

  if (firm.verified) score += 6;
  if (firm.status === 'inactive') score -= 30;
  if (firm.status === 'verify') score -= 8;
  if (budget && Number(firm.fee || 0) <= budget) score += 12;
  if (market && String(firm.best + ' ' + firm.platforms).toLowerCase().includes(market)) score += 10;
  if (payout === 'fast' && /daily|5 days|weekly/i.test(firm.payout)) score += 8;
  if (risk === 'conservative' && /none|varies/i.test(firm.daily)) score += 6;
  if (risk === 'aggressive' && /90|95|100/.test(firm.split)) score += 6;
  return Math.round(score);
}

function recommendFirms(db, preferences = {}) {
  return [...db.firms]
    .map((firm) => ({
      ...firm,
      matchScore: scoreFirm(firm, preferences),
      matchReason: [
        firm.verified ? 'verified listing' : 'listed for review',
        Number(firm.fee || 0) <= Number(preferences.budget || 999999) ? 'fits budget' : 'above budget',
        `${firm.split} split`,
        `${firm.payout} payout`
      ].join(' · ')
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 8);
}

function searchFirms(db, url) {
  const q = String(url.searchParams.get('q') || '').trim().toLowerCase();
  const market = String(url.searchParams.get('market') || '').toLowerCase();
  const status = String(url.searchParams.get('status') || 'all').toLowerCase();
  const maxFee = Number(url.searchParams.get('maxFee') || 0);
  const minRating = Number(url.searchParams.get('minRating') || 0);

  return db.firms
    .filter((firm) => {
      const haystack = [
        firm.name,
        firm.id,
        firm.best,
        firm.platforms,
        firm.website,
        ...(firm.aliases || [])
      ].join(' ').toLowerCase();
      const statusKey = firm.status || (firm.verified ? 'verified' : 'listed');
      return (!q || haystack.includes(q))
        && (!market || haystack.includes(market))
        && (status === 'all' || statusKey === status)
        && (!maxFee || Number(firm.fee || 0) <= maxFee)
        && (!minRating || Number(firm.rating || 0) >= minRating);
    })
    .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
}

function firmSeoHtml(firm) {
  const title = `${firm.name} review, rules, fees and payouts | FundScope`;
  const description = `Compare ${firm.name} challenge fees, profit target, drawdown, payout frequency, platforms, reviews and status on FundScope.`;
  const appShell = path.join(__dirname, 'index.html');
  return readFile(appShell, 'utf8').then((html) => html
    .replace('<title>FundScope  Prop firm intelligence</title>', `<title>${title}</title>`)
    .replace('content="FundScope helps traders compare prop firms, calculate risk, and track funded accounts."', `content="${description}"`)
    .replace('href="styles.css"', 'href="/styles.css"')
    .replace('src="app.js"', 'src="/app.js"')
    .replace('<div id="app"></div>', `<div id="app"></div><script>window.__INITIAL_ROUTE__={route:"profile",firmId:"${firm.id}"};</script>`));
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function numberOr(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function boolish(value) {
  return value === true || value === 'true' || value === 'on' || value === 1 || value === '1';
}

function sanitizeFirm(body = {}) {
  const name = String(body.name || '').trim();
  const id = slugify(body.id || name);
  if (!id || !name) return null;
  const website = String(body.website || '').trim();
  return {
    id,
    name,
    initials: String(body.initials || name.split(/\s+/).map((part) => part[0]).join('').slice(0, 3)).toUpperCase(),
    color: String(body.color || '#285fc2').trim(),
    rating: numberOr(body.rating, 4),
    reviews: Math.max(0, Math.round(numberOr(body.reviews, 0))),
    fee: Math.max(0, Math.round(numberOr(body.fee, 0))),
    target: String(body.target || '8%'),
    daily: String(body.daily || '5%'),
    drawdown: String(body.drawdown || '10%'),
    payout: String(body.payout || '14 days'),
    split: String(body.split || '80%'),
    best: String(body.best || 'General traders'),
    founded: Math.round(numberOr(body.founded, new Date().getFullYear())),
    platforms: String(body.platforms || 'MT4, MT5'),
    website,
    logoUrl: String(body.logoUrl || (website ? `https://www.google.com/s2/favicons?sz=128&domain=${website.replace(/^https?:\/\//, '').split('/')[0]}` : '')),
    affiliateUrl: String(body.affiliateUrl || website || '#'),
    verified: boolish(body.verified),
    status: String(body.status || (boolish(body.verified) ? 'verified' : 'listed')),
    aliases: Array.isArray(body.aliases) ? body.aliases : String(body.aliases || '').split(',').map((item) => item.trim()).filter(Boolean)
  };
}

function sanitizeAdminRecord(collection, body = {}) {
  if (collection === 'discountCodes') {
    const firmId = String(body.firmId || '').trim();
    const code = String(body.code || '').trim();
    if (!firmId || !code) return null;
    return {
      id: String(body.id || `deal-${Date.now()}`),
      firmId,
      code,
      label: String(body.label || `${code} discount`),
      status: String(body.status || 'active'),
      expiresAt: String(body.expiresAt || ''),
      affiliateUrl: String(body.affiliateUrl || '#')
    };
  }
  if (collection === 'news') {
    const title = String(body.title || '').trim();
    if (!title) return null;
    return {
      id: String(body.id || `news-${Date.now()}`),
      firmId: String(body.firmId || 'ftmo'),
      source: String(body.source || 'FundScope'),
      title,
      summary: String(body.summary || ''),
      url: String(body.url || ''),
      publishedAt: String(body.publishedAt || new Date().toISOString()),
      type: String(body.type || 'platform')
    };
  }
  if (collection === 'ruleChanges') {
    const firmId = String(body.firmId || '').trim();
    if (!firmId) return null;
    return {
      id: String(body.id || `rule-${firmId}-${Date.now()}`),
      firmId,
      date: String(body.date || new Date().toISOString().slice(0, 10)),
      category: String(body.category || 'Rules'),
      summary: String(body.summary || ''),
      before: String(body.before || 'Previously unknown'),
      after: String(body.after || 'Updated')
    };
  }
  if (collection === 'alerts') {
    const title = String(body.title || '').trim();
    if (!title) return null;
    return {
      id: String(body.id || `alert-${Date.now()}`),
      firmId: String(body.firmId || 'ftmo'),
      type: String(body.type || 'policy'),
      title,
      message: String(body.message || ''),
      read: boolish(body.read)
    };
  }
  return null;
}

function upsertById(rows, record) {
  const index = rows.findIndex((item) => item.id === record.id);
  if (index >= 0) rows[index] = { ...rows[index], ...record };
  else rows.unshift(record);
  return record;
}

function adminOverview(db) {
  return {
    counts: {
      firms: db.firms.length,
      users: db.users.length,
      activeSessions: db.sessions.filter((session) => new Date(session.expiresAt).getTime() > Date.now()).length,
      discounts: db.discountCodes.length,
      giveaways: db.giveaways.length,
      feedback: db.feedback.length,
      affiliateClicks: db.affiliateClicks.length,
      ruleChanges: db.ruleChanges.length,
      alerts: db.alerts.length,
      news: db.news.length
    },
    firms: db.firms,
    discountCodes: withFirmNames(db, db.discountCodes),
    ruleChanges: withFirmNames(db, db.ruleChanges),
    alerts: withFirmNames(db, db.alerts),
    news: withFirmNames(db, db.news),
    feedback: db.feedback.slice(-20).reverse(),
    giveawayEntries: db.giveawayEntries.slice(-20).reverse(),
    affiliateClicks: db.affiliateClicks.slice(-20).reverse(),
    users: db.users.map(safeUser).slice(-20).reverse()
  };
}

function absoluteBaseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || (req.socket.encrypted ? 'https' : 'http');
  return `${proto}://${req.headers.host}`;
}

function robotsTxt(req) {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /data/',
    `Sitemap: ${absoluteBaseUrl(req)}/sitemap.xml`,
    ''
  ].join('\n');
}

function sitemapXml(req, db) {
  const base = absoluteBaseUrl(req);
  const routes = ['/', '/firms', '/compare', '/news', '/calculators', '/deals', '/privacy', '/terms'];
  const urls = [
    ...routes.map((route) => ({ loc: `${base}${route}`, priority: route === '/' ? '1.0' : '0.7' })),
    ...db.firms.map((firm) => ({ loc: `${base}/firms/${firm.id}`, priority: '0.8' }))
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url.loc}</loc><priority>${url.priority}</priority></url>`).join('\n')}\n</urlset>\n`;
}

async function handleApi(req, res, url) {
  const db = ensureDbShape(await readDb());
  const method = req.method;
  const parts = url.pathname.split('/').filter(Boolean);

  if (method === 'OPTIONS') return sendJson(res, 200, { ok: true });
  if (method === 'GET' && url.pathname === '/api/health') return sendJson(res, 200, { ok: true, service: 'fundscope-api', storage: usingPostgres() ? 'postgres' : 'json' });
  if (method === 'GET' && url.pathname === '/api/bootstrap') return sendJson(res, 200, publicBootstrap(db));
  if (method === 'GET' && url.pathname === '/api/search') return sendJson(res, 200, searchFirms(db, url));
  if (method === 'GET' && url.pathname === '/api/firms') return sendJson(res, 200, db.firms);

  if (method === 'GET' && parts[0] === 'api' && parts[1] === 'firms' && parts[2]) {
    const firm = db.firms.find((item) => item.id === parts[2]);
    if (!firm) return sendError(res, 404, 'Firm not found');
    return sendJson(res, 200, {
      ...firm,
      discountCodes: db.discountCodes.filter((deal) => deal.firmId === firm.id && deal.status === 'active'),
      giveaways: db.giveaways.filter((giveaway) => giveaway.firmId === firm.id && giveaway.status === 'open'),
      reviews: db.reviews.filter((review) => review.firmId === firm.id),
      payoutProofs: db.payoutProofs.filter((proof) => proof.firmId === firm.id),
      ruleChanges: (db.ruleChanges || []).filter((change) => change.firmId === firm.id),
      alerts: (db.alerts || []).filter((alert) => alert.firmId === firm.id)
    });
  }

  if (method === 'GET' && url.pathname === '/api/rule-changes') {
    return sendJson(res, 200, withFirmNames(db, db.ruleChanges || []));
  }

  if (method === 'GET' && url.pathname === '/api/alerts') {
    return sendJson(res, 200, withFirmNames(db, db.alerts || []));
  }

  if (method === 'GET' && url.pathname === '/api/news') {
    return sendJson(res, 200, withFirmNames(db, db.news || []));
  }

  if (method === 'POST' && url.pathname === '/api/recommendations') {
    const body = await parseBody(req);
    return sendJson(res, 200, recommendFirms(db, body.preferences || body));
  }

  if (method === 'POST' && url.pathname === '/api/auth/register') {
    const body = await parseBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const name = String(body.name || 'Trader').trim();
    const password = String(body.password || '').trim();
    if (!email || !password) return sendError(res, 400, 'email and password are required');
    if (password.length < 6) return sendError(res, 400, 'Password must be at least 6 characters');
    if ((db.users || []).some((user) => user.email === email)) return sendError(res, 409, 'User already exists');
    const user = { id: `user-${Date.now()}-${randomBytes(3).toString('hex')}`, name, email, passwordHash: await hashPassword(password), createdAt: new Date().toISOString() };
    db.users.push(user);
    const profile = defaultProfile(user.id);
    db.profiles.push(profile);
    const token = createSession(db, user, req);
    await writeDb(db);
    return sendJson(res, 201, { user: safeUser(user), profile, dashboardAccounts: [] }, { 'Set-Cookie': `${SESSION_COOKIE}=${encodeURIComponent(token)}; ${cookieFlags(req)}` });
  }

  if (method === 'POST' && url.pathname === '/api/auth/login') {
    const body = await parseBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '').trim();
    const user = db.users.find((item) => item.email === email);
    if (!await verifyPassword(user, password)) return sendError(res, 401, 'Invalid email or password');
    if (!user.passwordHash) {
      user.passwordHash = await hashPassword(password);
      delete user.password;
    }
    const profile = getProfile(db, user.id);
    const dashboardAccounts = db.dashboardAccounts.filter((account) => account.userId === user.id);
    const token = createSession(db, user, req);
    await writeDb(db);
    return sendJson(res, 200, { user: safeUser(user), profile, dashboardAccounts }, { 'Set-Cookie': `${SESSION_COOKIE}=${encodeURIComponent(token)}; ${cookieFlags(req)}` });
  }

  if (method === 'GET' && url.pathname === '/api/auth/me') {
    const auth = getSessionUser(req, db);
    if (!auth) return sendError(res, 401, 'Not signed in');
    return sendJson(res, 200, {
      user: safeUser(auth.user),
      profile: getProfile(db, auth.user.id),
      dashboardAccounts: db.dashboardAccounts.filter((account) => account.userId === auth.user.id)
    });
  }

  if (method === 'POST' && url.pathname === '/api/auth/logout') {
    const token = parseCookies(req)[SESSION_COOKIE];
    if (token) {
      const hash = tokenHash(token);
      db.sessions = (db.sessions || []).filter((session) => session.tokenHash !== hash);
      await writeDb(db);
    }
    return sendJson(res, 200, { ok: true }, { 'Set-Cookie': `${SESSION_COOKIE}=; ${expiredSession()}` });
  }

  if (method === 'GET' && url.pathname === '/api/admin/setup-status') {
    return sendJson(res, 200, { adminConfigured: hasAdminConfigured(db) });
  }

  if (method === 'POST' && url.pathname === '/api/admin/setup') {
    if (hasAdminConfigured(db)) return sendError(res, 409, 'Admin is already configured');
    const user = requireUser(req, res, db);
    if (!user) return;
    user.role = 'admin';
    await writeDb(db);
    return sendJson(res, 200, {
      ok: true,
      user: safeUser(user),
      profile: getProfile(db, user.id),
      dashboardAccounts: db.dashboardAccounts.filter((account) => account.userId === user.id)
    });
  }

  if (parts[0] === 'api' && parts[1] === 'admin') {
    const admin = requireAdmin(req, res, db);
    if (!admin) return;

    if (method === 'GET' && parts.length === 2) {
      return sendJson(res, 200, adminOverview(db));
    }

    if (parts[2] === 'firms') {
      if (method === 'POST') {
        const firm = sanitizeFirm(await parseBody(req));
        if (!firm) return sendError(res, 400, 'Firm name is required');
        upsertById(db.firms, firm);
        await writeDb(db);
        return sendJson(res, 201, { ok: true, firm, overview: adminOverview(db) });
      }
      if (method === 'PUT' && parts[3]) {
        const existing = db.firms.find((firm) => firm.id === parts[3]);
        if (!existing) return sendError(res, 404, 'Firm not found');
        const firm = sanitizeFirm({ ...existing, ...(await parseBody(req)), id: existing.id });
        upsertById(db.firms, firm);
        await writeDb(db);
        return sendJson(res, 200, { ok: true, firm, overview: adminOverview(db) });
      }
      if (method === 'DELETE' && parts[3]) {
        db.firms = db.firms.filter((firm) => firm.id !== parts[3]);
        await writeDb(db);
        return sendJson(res, 200, { ok: true, overview: adminOverview(db) });
      }
    }

    const collectionMap = {
      discounts: 'discountCodes',
      'discount-codes': 'discountCodes',
      news: 'news',
      'rule-changes': 'ruleChanges',
      alerts: 'alerts'
    };
    const collection = collectionMap[parts[2]];
    if (collection) {
      if (method === 'POST') {
        const record = sanitizeAdminRecord(collection, await parseBody(req));
        if (!record) return sendError(res, 400, 'Required fields are missing');
        upsertById(db[collection], record);
        await writeDb(db);
        return sendJson(res, 201, { ok: true, record, overview: adminOverview(db) });
      }
      if (method === 'PUT' && parts[3]) {
        const existing = db[collection].find((item) => item.id === parts[3]);
        if (!existing) return sendError(res, 404, 'Record not found');
        const record = sanitizeAdminRecord(collection, { ...existing, ...(await parseBody(req)), id: existing.id });
        upsertById(db[collection], record);
        await writeDb(db);
        return sendJson(res, 200, { ok: true, record, overview: adminOverview(db) });
      }
      if (method === 'DELETE' && parts[3]) {
        db[collection] = db[collection].filter((item) => item.id !== parts[3]);
        await writeDb(db);
        return sendJson(res, 200, { ok: true, overview: adminOverview(db) });
      }
    }

    return sendError(res, 404, 'Admin route not found');
  }

  if (method === 'GET' && parts[0] === 'api' && parts[1] === 'profiles' && parts[2]) {
    const user = requireUser(req, res, db);
    if (!user) return;
    if (parts[2] !== 'me' && parts[2] !== user.id) return sendError(res, 403, 'Forbidden');
    const profile = getProfile(db, user.id);
    return sendJson(res, 200, profile || null);
  }

  if (method === 'PUT' && parts[0] === 'api' && parts[1] === 'profiles' && parts[2]) {
    const user = requireUser(req, res, db);
    if (!user) return;
    if (parts[2] !== 'me' && parts[2] !== user.id) return sendError(res, 403, 'Forbidden');
    const body = await parseBody(req);
    const index = db.profiles.findIndex((item) => item.userId === user.id);
    const profile = { ...(index >= 0 ? db.profiles[index] : defaultProfile(user.id)), ...body, userId: user.id };
    if (index >= 0) db.profiles[index] = profile;
    else db.profiles.push(profile);
    await writeDb(db);
    return sendJson(res, 200, profile);
  }

  if (method === 'POST' && url.pathname === '/api/feedback') {
    const body = await parseBody(req);
    const feedback = {
      id: `feedback-${Date.now()}`,
      name: String(body.name || 'Anonymous'),
      email: String(body.email || ''),
      message: String(body.message || ''),
      createdAt: new Date().toISOString()
    };
    db.feedback = db.feedback || [];
    db.feedback.push(feedback);
    await writeDb(db);
    return sendJson(res, 201, { ok: true, feedback });
  }

  if (method === 'GET' && url.pathname === '/api/discount-codes') {
    return sendJson(res, 200, withFirmNames(db, db.discountCodes.filter((deal) => deal.status === 'active')));
  }

  if (method === 'GET' && url.pathname === '/api/giveaways') {
    return sendJson(res, 200, withFirmNames(db, db.giveaways.filter((giveaway) => giveaway.status === 'open')));
  }

  if (method === 'POST' && url.pathname === '/api/giveaway-entries') {
    const body = await parseBody(req);
    if (!body.giveawayId || !body.email) return sendError(res, 400, 'giveawayId and email are required');
    const giveaway = db.giveaways.find((item) => item.id === body.giveawayId && item.status === 'open');
    if (!giveaway) return sendError(res, 404, 'Open giveaway not found');
    const entry = {
      id: `entry-${Date.now()}`,
      giveawayId: body.giveawayId,
      name: String(body.name || '').trim(),
      email: String(body.email || '').trim().toLowerCase(),
      createdAt: new Date().toISOString()
    };
    db.giveawayEntries.push(entry);
    giveaway.entries += 1;
    await writeDb(db);
    return sendJson(res, 201, { ok: true, entry, giveaway });
  }

  if (method === 'GET' && url.pathname === '/api/dashboard/accounts') {
    const user = requireUser(req, res, db);
    if (!user) return;
    return sendJson(res, 200, db.dashboardAccounts.filter((account) => account.userId === user.id));
  }

  if (method === 'POST' && url.pathname === '/api/dashboard/accounts') {
    const user = requireUser(req, res, db);
    if (!user) return;
    const body = await parseBody(req);
    if (!body.firm || !body.account) return sendError(res, 400, 'firm and account are required');
    const account = {
      id: Date.now(),
      userId: user.id,
      firm: String(body.firm),
      account: String(body.account),
      type: body.type === 'Funded' ? 'Funded' : 'Challenge',
      progress: Number(body.progress || 0),
      target: String(body.target || '$0'),
      current: String(body.current || '$0')
    };
    db.dashboardAccounts.push(account);
    await writeDb(db);
    return sendJson(res, 201, account);
  }

  if (method === 'DELETE' && parts[0] === 'api' && parts[1] === 'dashboard' && parts[2] === 'accounts' && parts[3]) {
    const user = requireUser(req, res, db);
    if (!user) return;
    const id = Number(parts[3]);
    db.dashboardAccounts = db.dashboardAccounts.filter((account) => account.id !== id || account.userId !== user.id);
    await writeDb(db);
    return sendJson(res, 200, { ok: true });
  }

  if (method === 'POST' && url.pathname === '/api/affiliate-clicks') {
    const body = await parseBody(req);
    const firm = db.firms.find((item) => item.id === body.firmId);
    if (!firm) return sendError(res, 404, 'Firm not found');
    const click = {
      id: `click-${Date.now()}`,
      firmId: firm.id,
      dealId: body.dealId || null,
      source: body.source || 'website',
      createdAt: new Date().toISOString()
    };
    db.affiliateClicks.push(click);
    await writeDb(db);
    return sendJson(res, 201, { ok: true, redirectUrl: body.redirectUrl || firm.affiliateUrl, click });
  }

  return sendError(res, 404, 'API route not found');
}

async function serveStatic(req, res, url) {
  const requested = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  if (requested.startsWith('/data/')) return sendError(res, 403, 'Private data files are not public assets');
  const filePath = path.normalize(path.join(__dirname, requested));
  if (!filePath.startsWith(__dirname)) return sendError(res, 403, 'Forbidden');
  const finalPath = existsSync(filePath) ? filePath : path.join(__dirname, 'index.html');
  const ext = path.extname(finalPath);
  try {
    const file = await readFile(finalPath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(file);
  } catch {
    sendError(res, 404, 'File not found');
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
    if (req.method === 'GET' && url.pathname === '/robots.txt') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(robotsTxt(req));
      return;
    }
    if (req.method === 'GET' && url.pathname === '/sitemap.xml') {
      const db = ensureDbShape(await readDb());
      res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
      res.end(sitemapXml(req, db));
      return;
    }
    if (req.method === 'GET' && url.pathname.startsWith('/firms/')) {
      const db = await readDb();
      const firmId = decodeURIComponent(url.pathname.split('/').filter(Boolean)[1] || '');
      if (firmId === 'niara-trader') {
        res.writeHead(301, { Location: '/firms/naira-trader' });
        res.end();
        return;
      }
      const firm = db.firms.find((item) => item.id === firmId);
      if (firm) {
        const html = await firmSeoHtml(firm);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
        return;
      }
    }
    return await serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Server error');
  }
});

server.listen(PORT, () => {
  console.log(`FundScope running at http://localhost:${PORT}`);
});

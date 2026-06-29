import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 48732);
const DB_PATH = path.join(__dirname, 'data', 'db.json');

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

async function readDb() {
  const raw = await readFile(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeDb(db) {
  await writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
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

function publicBootstrap(db) {
  return {
    firms: db.firms,
    discountCodes: withFirmNames(db, db.discountCodes.filter((deal) => deal.status === 'active')),
    giveaways: withFirmNames(db, db.giveaways.filter((giveaway) => giveaway.status === 'open')),
    reviews: db.reviews,
    payoutProofs: db.payoutProofs,
    dashboardAccounts: db.dashboardAccounts,
    ruleChanges: withFirmNames(db, db.ruleChanges || []),
    alerts: withFirmNames(db, db.alerts || []),
    profiles: db.profiles || []
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
    .replace('<div id="app"></div>', `<div id="app"></div><script>window.__INITIAL_ROUTE__={route:"profile",firmId:"${firm.id}"};</script>`));
}

async function handleApi(req, res, url) {
  const db = await readDb();
  const method = req.method;
  const parts = url.pathname.split('/').filter(Boolean);

  if (method === 'OPTIONS') return sendJson(res, 200, { ok: true });
  if (method === 'GET' && url.pathname === '/api/health') return sendJson(res, 200, { ok: true, service: 'fundscope-api' });
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
    if ((db.users || []).some((user) => user.email === email)) return sendError(res, 409, 'User already exists');
    const user = { id: `user-${Date.now()}`, name, email, password, createdAt: new Date().toISOString() };
    db.users = db.users || [];
    db.profiles = db.profiles || [];
    db.users.push(user);
    db.profiles.push({ userId: user.id, experience: 'New', market: 'Forex', budget: 150, riskStyle: 'Balanced', preferredPayout: 'Fast', savedFirmIds: [], alertFirmIds: [] });
    await writeDb(db);
    return sendJson(res, 201, { token: user.id, user: { id: user.id, name: user.name, email: user.email } });
  }

  if (method === 'POST' && url.pathname === '/api/auth/login') {
    const body = await parseBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '').trim();
    const user = (db.users || []).find((item) => item.email === email && item.password === password);
    if (!user) return sendError(res, 401, 'Invalid email or password');
    return sendJson(res, 200, { token: user.id, user: { id: user.id, name: user.name, email: user.email } });
  }

  if (method === 'GET' && parts[0] === 'api' && parts[1] === 'profiles' && parts[2]) {
    const profile = (db.profiles || []).find((item) => item.userId === parts[2]);
    return sendJson(res, 200, profile || null);
  }

  if (method === 'PUT' && parts[0] === 'api' && parts[1] === 'profiles' && parts[2]) {
    const body = await parseBody(req);
    db.profiles = db.profiles || [];
    const index = db.profiles.findIndex((item) => item.userId === parts[2]);
    const profile = { ...(index >= 0 ? db.profiles[index] : { userId: parts[2] }), ...body, userId: parts[2] };
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
    return sendJson(res, 200, db.dashboardAccounts);
  }

  if (method === 'POST' && url.pathname === '/api/dashboard/accounts') {
    const body = await parseBody(req);
    if (!body.firm || !body.account) return sendError(res, 400, 'firm and account are required');
    const account = {
      id: Date.now(),
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
    const id = Number(parts[3]);
    db.dashboardAccounts = db.dashboardAccounts.filter((account) => account.id !== id);
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
    if (req.method === 'GET' && url.pathname.startsWith('/firms/')) {
      const db = await readDb();
      const firmId = decodeURIComponent(url.pathname.split('/').filter(Boolean)[1] || '');
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

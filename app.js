let firms = [
  { id:'apex', name:'Apex Trader Funding', initials:'AT', color:'#174f91', rating:4.7, reviews:2840, fee:167, target:'6%', daily:'None', drawdown:'$2,500', payout:'8 days', split:'100%', best:'Futures traders', founded:2021, platforms:'Rithmic, Tradovate' },
  { id:'fundednext', name:'FundedNext', initials:'FN', color:'#7b55c7', rating:4.6, reviews:9100, fee:549, target:'8%', daily:'5%', drawdown:'10%', payout:'14 days', split:'95%', best:'Flexible challenges', founded:2022, platforms:'MT4, MT5, cTrader' },
  { id:'topstep', name:'Topstep', initials:'TS', color:'#16836c', rating:4.5, reviews:7400, fee:149, target:'6%', daily:'Varies', drawdown:'$2,000', payout:'Daily', split:'100%', best:'Coaching & community', founded:2012, platforms:'TopstepX' },
  { id:'ftmo', name:'FTMO', initials:'FT', color:'#285fc2', rating:4.8, reviews:13200, fee:540, target:'10%', daily:'5%', drawdown:'10%', payout:'14 days', split:'90%', best:'Proven track record', founded:2015, platforms:'MT4, MT5, cTrader' },
  { id:'the5ers', name:'The5ers', initials:'5%', color:'#d86a2d', rating:4.6, reviews:5200, fee:495, target:'8%', daily:'5%', drawdown:'10%', payout:'14 days', split:'100%', best:'Scaling plans', founded:2016, platforms:'MT5' },
  { id:'fundingpips', name:'Funding Pips', initials:'FP', color:'#151e29', rating:4.4, reviews:3600, fee:444, target:'8%', daily:'5%', drawdown:'10%', payout:'5 days', split:'100%', best:'Fast payouts', founded:2022, platforms:'MT5, Match-Trader' }
];

let reviews = [
  {name:'Marcus T.', date:'2 days ago', rating:5, text:'The rules were clear and my first payout arrived exactly when expected. The dashboard could be better, but the overall experience was solid.'},
  {name:'Aisha K.', date:'1 week ago', rating:4, text:'Support responded within a few hours and resolved my account issue. Good conditions for disciplined traders.'},
  {name:'Daniel R.', date:'3 weeks ago', rating:5, text:'I have tried three firms and this has been the most straightforward. No surprises at payout time.'}
];

let discountCodes = [];
let giveaways = [];
let payoutProofs = [];
let ruleChanges = [];
let alerts = [];
let news = [];
let profiles = [];
let adminData = null;
let adminSetupStatus = null;
let currentUser = JSON.parse(localStorage.getItem('fundscope-user') || 'null');
const brand = {
  name: 'FundScope',
  tagline: 'Prop firm intelligence for serious traders',
  email: 'hello@fundscope.app',
  partnerships: 'partners@fundscope.app',
  creator: 'Raiden',
  x: '@fundscope',
  instagram: '@fundscope',
  youtube: 'FundScope'
};
let userProfile = JSON.parse(localStorage.getItem('fundscope-profile') || 'null') || {
  experience:'Intermediate',
  market:'Forex',
  budget:150,
  riskStyle:'Balanced',
  preferredPayout:'Fast',
  savedFirmIds:['ftmo','fundingpips','naira-trader'],
  alertFirmIds:['ftmo','apex','naira-trader']
};

const api = {
  async get(path) {
    const res = await fetch(path, { credentials:'include' });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  async post(path, body) {
    const res = await fetch(path, { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body || {}) });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  async put(path, body) {
    const res = await fetch(path, { method:'PUT', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body || {}) });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  async delete(path) {
    const res = await fetch(path, { method:'DELETE', credentials:'include' });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }
};

const bootRoute = window.__INITIAL_ROUTE__ || {};
const state = { route:bootRoute.route || 'home', selectedFirm:bootRoute.firmId || 'ftmo', calc:'lot', compare:[0,1,3], search:'', menuOpen:false, filters:{ market:'all', status:'all', maxFee:'', minRating:'' }, accounts: JSON.parse(localStorage.getItem('fundscope-accounts') || 'null') || [
  {id:1, firm:'FTMO', account:'$100,000 Challenge', type:'Challenge', progress:64, target:'$10,000', current:'$6,400'},
  {id:2, firm:'Topstep', account:'$50,000 Express', type:'Funded', progress:82, target:'$2,500', current:'$2,050'}
]};

const icon = (name) => ({search:'⌕',compare:'⇄',calc:'∑',dash:'◫',shield:'✓',chart:'↗',review:'★'}[name] || '•');
const brandLogo = () => `<span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7.2" stroke="currentColor" stroke-width="1.6" opacity=".55"/><path d="M14.9 9.1 13 13l-3.9 1.9L11 11l3.9-1.9Z" fill="#ffca5c" stroke="white" stroke-width="1.1" stroke-linejoin="round"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>`;
function routeFromPath() {
  const match = window.location.pathname.match(/^\/firms\/([^/]+)/);
  if (match) {
    state.route = 'profile';
    state.selectedFirm = decodeURIComponent(match[1] === 'niara-trader' ? 'naira-trader' : match[1]);
  }
}
function openFirm(id) {
  state.route = 'profile';
  state.selectedFirm = id;
  state.menuOpen = false;
  history.pushState({ route:'profile', id }, '', `/firms/${id}`);
  window.scrollTo(0,0);
  render();
}
function navigate(route, id) {
  state.route=route;
  state.menuOpen=false;
  if(id) state.selectedFirm=id;
  if(route === 'profile' && id) history.pushState({ route, id }, '', `/firms/${id}`);
  if(route !== 'profile' && window.location.pathname !== '/') history.pushState({ route }, '', '/');
  window.scrollTo(0,0);
  render();
}
function logo(f, cls='firm-logo') {
  const safeName = esc(f.name);
  const initials = esc(f.initials || f.name.split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase());
  const bg = esc(f.color || '#4f46e5');
  const img = f.logoUrl ? `<img src="${esc(f.logoUrl)}" alt="${safeName} logo" loading="lazy" decoding="async" onload="if(this.naturalWidth<6||this.naturalHeight<6){this.hidden=true}else{this.classList.add('logo-loaded')}" onerror="this.hidden=true">` : '';
  return `<div class="${cls}" style="background:${bg}"><span class="logo-initials">${initials}</span>${img}</div>`;
}
function stars(f) { return `<span class="stars">★★★★★ <small>${f.rating} (${f.reviews.toLocaleString()})</small></span>`; }
function toast(msg) { const t=document.querySelector('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2200); }
function firmName(id) { return firms.find(f=>f.id===id)?.name || 'Prop firm'; }
function firmStatus(f) {
  if (f.status === 'inactive') return '<span class="status-badge inactive">Inactive</span>';
  if (f.status === 'verify') return '<span class="status-badge verify">Verify</span>';
  return f.verified ? '<span class="status-badge verified">Verified</span>' : '<span class="status-badge listed">Listed</span>';
}
function activeFirms() { return firms.filter(f => f.status !== 'inactive'); }
function searchableText(f) { return [f.name, f.id, f.best, f.platforms, f.website, ...(f.aliases || [])].join(' ').toLowerCase(); }
function firmStatusKey(f) { return f.status || (f.verified ? 'verified' : 'listed'); }
function searchScore(f, q) {
  if (!q) return Number(f.rating || 0);
  const query = q.toLowerCase().trim();
  const name = f.name.toLowerCase();
  let score = 0;
  if (name === query) score += 100;
  if (name.startsWith(query)) score += 60;
  if (name.includes(query)) score += 35;
  if ((f.aliases || []).some(a => a.toLowerCase().includes(query))) score += 30;
  if (searchableText(f).includes(query)) score += 12;
  return score + Number(f.rating || 0);
}
function filteredFirms() {
  const q = state.search.trim().toLowerCase();
  return firms
    .filter(f => {
      const marketOk = state.filters.market === 'all' || searchableText(f).includes(state.filters.market.toLowerCase());
      const statusOk = state.filters.status === 'all' || firmStatusKey(f) === state.filters.status;
      const feeOk = !state.filters.maxFee || Number(f.fee || 0) <= Number(state.filters.maxFee);
      const ratingOk = !state.filters.minRating || Number(f.rating || 0) >= Number(state.filters.minRating);
      const queryOk = !q || searchableText(f).includes(q);
      return marketOk && statusOk && feeOk && ratingOk && queryOk;
    })
    .sort((a,b)=>searchScore(b,q)-searchScore(a,q));
}
function aiScore(f) {
  let score = Number(f.rating || 0) * 18;
  if (f.verified) score += 6;
  if (f.status === 'inactive') score -= 30;
  if (f.status === 'verify') score -= 8;
  if (Number(f.fee || 0) <= Number(userProfile.budget || 999999)) score += 12;
  if (searchableText(f).includes(String(userProfile.market || '').toLowerCase())) score += 10;
  if (String(userProfile.preferredPayout).toLowerCase() === 'fast' && /daily|5 days|weekly/i.test(f.payout)) score += 8;
  if (String(userProfile.riskStyle).toLowerCase() === 'conservative' && /none|varies/i.test(f.daily)) score += 6;
  if (String(userProfile.riskStyle).toLowerCase() === 'aggressive' && /90|95|100/.test(f.split)) score += 6;
  return Math.max(0, Math.min(99, Math.round(score)));
}
function recommendedFirms() { return [...firms].map(f=>({...f, matchScore:aiScore(f)})).sort((a,b)=>b.matchScore-a.matchScore).slice(0,6); }
function formatMoney(v) { return '$' + Number(v || 0).toLocaleString(); }
function esc(value) { return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch])); }
function parseMoney(text) { return Number(String(text || '').replace(/[^0-9.]/g,'')) || 0; }
function dashboardAnalytics() {
  const target = state.accounts.reduce((sum,a)=>sum+parseMoney(a.target),0);
  const current = state.accounts.reduce((sum,a)=>sum+parseMoney(a.current),0);
  const progress = target ? Math.round((current/target)*100) : 0;
  const drawdownUsed = Math.max(0, target-current);
  return { target, current, progress, drawdownUsed };
}
function profileForUser() {
  if (currentUser) return profiles.find(p=>p.userId===currentUser.id) || userProfile;
  return userProfile;
}
function applyAuthPayload(payload) {
  currentUser = payload?.user || null;
  if (currentUser) localStorage.setItem('fundscope-user', JSON.stringify(currentUser));
  else localStorage.removeItem('fundscope-user');
  if (payload?.profile) {
    userProfile = payload.profile;
    profiles = [payload.profile];
    localStorage.setItem('fundscope-profile', JSON.stringify(userProfile));
  }
  if (Array.isArray(payload?.dashboardAccounts)) {
    state.accounts = payload.dashboardAccounts;
    localStorage.removeItem('fundscope-accounts');
  }
}
async function hydrateAuthSession() {
  try {
    applyAuthPayload(await api.get('/api/auth/me'));
  } catch {
    if (currentUser) {
      state.accounts = [];
      localStorage.removeItem('fundscope-accounts');
    }
    currentUser = null;
    profiles = [];
    localStorage.removeItem('fundscope-user');
  }
}
function applyPublicData(data) {
  firms=data.firms?.length?data.firms:firms;
  reviews=data.reviews?.length?data.reviews:reviews;
  discountCodes=data.discountCodes || [];
  giveaways=data.giveaways || [];
  payoutProofs=data.payoutProofs || [];
  ruleChanges=data.ruleChanges || [];
  alerts=data.alerts || [];
  news=data.news || [];
}
async function refreshPublicData() {
  applyPublicData(await api.get('/api/bootstrap'));
}
async function refreshAdminData() {
  adminData = await api.get('/api/admin');
  return adminData;
}
async function refreshAdminSetupStatus() {
  adminSetupStatus = await api.get('/api/admin/setup-status');
  return adminSetupStatus;
}
function heroSearchMarkup(list=filteredFirms().slice(0,5)) {
  return list.map(f=>`<div class="search-result" data-firm="${f.id}">${logo(f,'mini-logo')}<span><b>${f.name}</b><small>${f.best} · ${f.payout}</small></span>${firmStatus(f)}</div>`).join('');
}
function directoryResultsMarkup(list=filteredFirms()) {
  return list.map(f=>firmCard(f)).join('') || '<div class="card empty">No firms match those filters yet.</div>';
}
function bindFirmClicks(scope=document) {
  scope.querySelectorAll('[data-firm]').forEach(el=>{
    el.onclick=(event)=>{event.preventDefault();openFirm(el.dataset.firm);};
    el.onkeydown=(event)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openFirm(el.dataset.firm);}};
  });
}
function refreshHeroResults() {
  const box=document.querySelector('#hero-results');
  if(!box) return;
  box.innerHTML=heroSearchMarkup(filteredFirms().slice(0,5));
  bindFirmClicks(box);
}
function refreshDirectoryResults() {
  const results=filteredFirms();
  const count=document.querySelector('#directory-count');
  const box=document.querySelector('#directory-results');
  if(count) count.textContent=`${results.length} firms found`;
  if(box){box.innerHTML=directoryResultsMarkup(results);bindFirmClicks(box);}
}
function dealCard(deal) { return `<article class="card deal-card"><div><span class="eyebrow">Discount code</span><h3>${deal.label}</h3><p>${deal.firm || firmName(deal.firmId)} · Expires ${deal.expiresAt}</p></div><div class="code-row"><code>${deal.code}</code><button class="btn btn-sm copy-code" data-code="${deal.code}" data-firm-id="${deal.firmId}" data-deal-id="${deal.id}" data-url="${deal.affiliateUrl}">Copy & track</button></div></article>`; }
function giveawayCard(giveaway) { return `<article class="card giveaway-card"><span class="eyebrow">Giveaway</span><h3>${giveaway.title}</h3><p>${giveaway.firm || firmName(giveaway.firmId)} · ${giveaway.prize}</p><div class="giveaway-meta"><span>${giveaway.entries.toLocaleString()} entries</span><span>Ends ${giveaway.endsAt}</span></div><button class="btn btn-light enter-giveaway" data-giveaway-id="${giveaway.id}">Enter giveaway</button></article>`; }

function nav() {
  const links=[['home','Home'],['directory','Directory'],['compare','Compare'],['match','AI Match'],['news','News'],['calculators','Calculators'],['dashboard','Dashboard']];
  if (currentUser) links.push(['admin','Admin']);
  return `<nav class="nav ${state.menuOpen?'open':''}"><div class="container nav-inner">
    <a class="brand" data-route="home">${brandLogo()} FundScope</a>
    <div class="nav-links">${links.map(([r,l])=>`<a class="nav-link ${state.route===r?'active':''}" data-route="${r}">${l}</a>`).join('')}<a class="nav-link ${state.route==='alerts'?'active':''}" data-route="alerts">Alerts</a><a class="nav-link ${state.route==='creator'?'active':''}" data-route="creator">Creator</a><a class="nav-link ${state.route==='deals'?'active':''}" data-route="deals">Deals</a></div>
    <div class="nav-actions"><button class="btn btn-light btn-sm" data-route="compare">Compare 5</button><button class="btn btn-sm" data-route="dashboard">${currentUser ? currentUser.name.split(' ')[0] : 'Login'}</button></div>
    <button class="mobile-menu" aria-label="${state.menuOpen?'Close menu':'Open menu'}" aria-expanded="${state.menuOpen}">${state.menuOpen?'×':'☰'}</button>
  </div></nav>`;
}

function footer() { return `<footer class="footer"><div class="container"><div class="footer-grid">
  <div><div class="brand" style="color:white">${brandLogo()} ${brand.name}</div><p style="max-width:300px;font-size:13px;line-height:1.6">${brand.tagline}. Independent intelligence for traders making better prop firm decisions.</p><a href="mailto:${brand.email}">${brand.email}</a></div>
  <div><h4>Discover</h4><a data-route="compare">Compare firms</a><a data-route="calculators">Calculators</a><a data-route="directory">Firm rankings</a></div>
  <div><h4>Company</h4><a data-route="creator">About the creator</a><a data-route="how-score">How we score</a><a data-route="editorial">Editorial policy</a><a data-route="contact">Contact</a></div>
  <div><h4>Legal</h4><a data-route="affiliate-disclosure">Affiliate disclosure</a><a data-route="privacy">Privacy</a><a data-route="terms">Terms</a></div>
  </div><div class="footer-bottom">© 2026 ${brand.name}. Trading involves risk. Firm information should be independently verified before purchase.</div></div></footer>`; }

function firmCard(f, featured=false) { return `<article class="card firm-card ${f.status==='inactive'?'muted-card':''}" data-firm="${f.id}" role="link" tabindex="0" aria-label="Open ${f.name} profile">${featured?'<span class="featured-tag">Featured</span>':''}<div class="firm-top">${logo(f)}<div><div class="firm-name">${f.name}</div><div class="firm-meta-line">${stars(f)} ${firmStatus(f)}</div></div></div><div class="firm-stats"><div class="stat"><small>From</small><b>$${f.fee}</b></div><div class="stat"><small>Profit split</small><b>${f.split}</b></div><div class="stat"><small>Payout</small><b>${f.payout}</b></div></div><span class="best-for">Best for: ${f.best}</span></article>`; }

function home() { const heroResults=filteredFirms().slice(0,5); const topPick=recommendedFirms()[0] || firms[0]; return `<main>
  <section class="hero hero-redesign"><div class="container hero-inner"><div><span class="eyebrow">AI-assisted prop firm intelligence</span><h1>Compare every serious prop firm before you buy a challenge.</h1><p class="hero-copy">Search rules, fees, payout terms, drawdown limits, discounts, rule changes, news, verified reviews, and trader-fit scores from one dashboard.</p><form class="search-box advanced-search" id="hero-search"><input aria-label="Search firms" id="search-input" value="${state.search}" placeholder="Search FTMO, Naira, futures, MT5, fast payouts..."/><button class="btn" type="submit">${icon('search')} <span>Search</span></button></form><div class="quick-filters"><button data-quick="forex">Forex</button><button data-quick="futures">Futures</button><button data-quick="crypto">Crypto</button><button data-route="match">Find my best match</button><button data-route="creator">Meet the creator</button></div><div class="feature-pills"><span>AI recommendations</span><span>Live comparison table</span><span>Rule tracker</span><span>Verified reviews</span><span>Prop firm news</span></div><div class="search-results" id="hero-results">${heroSearchMarkup(heroResults)}</div><div class="hero-meta"><span><b>${firms.length}+</b> firms tracked</span><span><b>${alerts.length}</b> policy alerts</span><span><b>${ruleChanges.length}</b> rule changes logged</span></div></div>
  <div class="insight-card hero-dashboard-card"><span class="eyebrow">Best match right now</span><div class="top"><div class="firm-top">${logo(topPick,'mini-logo')}<div><b>${topPick.name}</b><div style="font-size:11px;color:var(--muted)">${topPick.best}</div></div></div><div class="score-ring"><b>${aiScore(topPick)}</b></div></div><div class="signal"><span>Match reason</span><b>${topPick.split} split</b></div><div class="signal"><span>Payout</span><b class="positive">${topPick.payout}</b></div><div class="signal"><span>Fee</span><b>$${topPick.fee}</b></div><div class="signal"><span>Status</span><b>${firmStatus(topPick)}</b></div><button class="btn" style="width:100%;margin-top:14px" data-route="match">Open recommendations</button></div></div></section>
  <div class="trust-strip"><div class="container trust-inner"><div><b>${firms.length}+</b><span>firms monitored</span></div><div><b>${firms.length * 3}+</b><span>plans compared</span></div><div><b>38,400</b><span>trader reviews</span></div><div><b>96%</b><span>rules up to date</span></div></div></div>
  <section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Top rated</span><h2>Featured prop firms</h2><p>High-confidence choices based on rules, reliability and trader feedback.</p></div><a class="link" data-route="compare">Compare all firms →</a></div><div class="grid grid-3">${activeFirms().slice(0,3).map((f,i)=>firmCard(f,i===1)).join('')}</div></div></section>
  <section class="section deals-preview"><div class="container"><div class="section-head"><div><span class="eyebrow">Promos & community</span><h2>Discount codes and giveaways</h2><p>Turn affiliate deals and giveaways into a repeat traffic engine.</p></div><a class="link" data-route="deals">View all deals →</a></div><div class="grid grid-2">${discountCodes.slice(0,2).map(dealCard).join('') || '<div class="card empty">Run through the backend API to load live discount codes.</div>'}${giveaways.slice(0,1).map(giveawayCard).join('')}</div></div></section>
  <section class="section" style="background:white"><div class="container"><div class="section-head"><div><span class="eyebrow">One workspace</span><h2>Trade with the full picture</h2><p>Research, plan and monitor every account from a single place.</p></div></div><div class="grid grid-4">${[['compare','Compare precisely','Put fees, targets and drawdown rules side by side.'],['review','Trust the evidence','Read trader reviews and inspect payout proof.'],['calc','Calculate the risk','Size positions and model drawdown before you trade.'],['dash','Track every account','See challenges, funded accounts and payout progress.']].map(x=>`<div class="feature-card"><div class="icon">${icon(x[0])}</div><h3>${x[1]}</h3><p>${x[2]}</p></div>`).join('')}</div></div></section>
  <section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Worldwide directory</span><h2>Known prop firms globally</h2><p>Includes verified listings, unverified listings, firms to review, and inactive historical names.</p></div></div><div class="grid grid-3">${firms.slice(3).map(f=>firmCard(f)).join('')}</div></div></section>
  </main>`; }

function directory() { const results=filteredFirms(); return `<main><div class="container"><div class="page-head"><span class="eyebrow">Search + filters</span><h1>Prop firm directory</h1><p>Search by firm name, alias, market, platform, payout style, or status. Try “Naira”, “Naija”, “futures”, “crypto”, “MT5”, or “fast payouts”.</p></div><div class="card filter-panel"><div class="form-grid"><div class="form-group"><label>Search anything</label><input class="field" id="directory-search" value="${state.search}" placeholder="Firm, market, platform, country, payout..."></div><div class="form-group"><label>Market</label><select class="field filter-input" data-filter="market"><option value="all">All markets</option>${['Forex','Futures','Crypto','Stocks','MT5','cTrader'].map(x=>`<option ${state.filters.market.toLowerCase()===x.toLowerCase()?'selected':''}>${x}</option>`).join('')}</select></div><div class="form-group"><label>Status</label><select class="field filter-input" data-filter="status"><option value="all">All statuses</option>${['verified','listed','verify','inactive'].map(x=>`<option value="${x}" ${state.filters.status===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="form-group"><label>Max fee</label><input class="field filter-input" data-filter="maxFee" value="${state.filters.maxFee}" type="number" placeholder="150"></div><div class="form-group"><label>Minimum rating</label><input class="field filter-input" data-filter="minRating" value="${state.filters.minRating}" type="number" step=".1" placeholder="4.0"></div><div class="form-group"><label>&nbsp;</label><button class="btn btn-light" id="clear-filters">Clear filters</button></div></div></div><div class="section-head" style="margin-top:28px"><div><h2 id="directory-count">${results.length} firms found</h2><p>Ranked by search relevance and rating.</p></div></div><div class="grid grid-3" id="directory-results">${directoryResultsMarkup(results)}</div></div></main>`; }

function match() { const picks=recommendedFirms(); const p=profileForUser(); return `<main><div class="container"><div class="page-head"><span class="eyebrow">AI-powered recommendations</span><h1>Your best prop firm matches</h1><p>This MVP uses a transparent scoring model based on your profile, budget, preferred market, payout speed, risk style, firm status, fee, split and rating.</p></div><div class="card preferences-card"><h2>Trader profile</h2><div class="form-grid"><div class="form-group"><label>Experience</label><select class="field pref-input" data-pref="experience">${['New','Intermediate','Advanced'].map(x=>`<option ${p.experience===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="form-group"><label>Preferred market</label><select class="field pref-input" data-pref="market">${['Forex','Futures','Crypto','Stocks'].map(x=>`<option ${p.market===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="form-group"><label>Max challenge budget</label><input class="field pref-input" data-pref="budget" type="number" value="${p.budget}"></div><div class="form-group"><label>Risk style</label><select class="field pref-input" data-pref="riskStyle">${['Conservative','Balanced','Aggressive'].map(x=>`<option ${p.riskStyle===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="form-group"><label>Payout preference</label><select class="field pref-input" data-pref="preferredPayout">${['Fast','Flexible','Monthly'].map(x=>`<option ${p.preferredPayout===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="form-group"><label>&nbsp;</label><button class="btn" id="save-preferences">Save preferences</button></div></div></div><div class="grid grid-3" style="margin-top:28px">${picks.map(f=>`<article class="card rec-card" data-firm="${f.id}"><div class="firm-top">${logo(f)}<div><div class="firm-name">${f.name}</div>${firmStatus(f)}</div></div><div class="match-score">${f.matchScore}% match</div><p>${f.best}</p><div class="signal"><span>Fee</span><b>$${f.fee}</b></div><div class="signal"><span>Split</span><b>${f.split}</b></div><div class="signal"><span>Payout</span><b>${f.payout}</b></div><small class="muted">Reason: fits profile, ${f.split} split, ${f.payout} payout.</small></article>`).join('')}</div></div></main>`; }

function compare() { const chosen=state.compare.map(i=>firms[i]).filter(Boolean).slice(0,5); const row=(label,key,format=v=>v)=>`<tr><td>${label}</td>${chosen.map(f=>`<td>${format(f[key],f)}</td>`).join('')}</tr>`; return `<main><div class="container"><div class="page-head"><span class="eyebrow">Compare any five firms</span><h1>Comparison dashboard</h1><p>Build a five-firm shortlist and compare fees, targets, drawdown, payout timing, rule alerts, AI fit, platforms and listing confidence.</p></div><div class="compare-summary">${chosen.map((f,i)=>`<div class="compare-chip">${logo(f,'mini-logo')}<span>${f.name}</span><button class="remove-compare" data-index="${state.compare[i]}">×</button></div>`).join('')}</div><div class="toolbar"><select class="field" id="add-firm"><option>Add a firm to compare...</option>${firms.map((f,i)=>`<option value="${i}">${f.name}${f.status==='inactive'?' (inactive)':f.status==='verify'?' (verify)':''}</option>`).join('')}</select><select class="field"><option>$100k account</option><option>$50k account</option><option>$200k account</option></select></div><div class="grid grid-5 compare-kpis">${chosen.map(f=>`<div class="card kpi-card"><small>${f.name}</small><strong>${aiScore(f)}%</strong><span>AI fit score</span></div>`).join('')}</div><div class="compare-wrap"><table class="compare compare-dashboard"><thead><tr><th>Metric</th>${chosen.map(f=>`<th><div class="firm-top">${logo(f,'mini-logo')}<span>${f.name}<br>${firmStatus(f)}</span></div></th>`).join('')}</tr></thead><tbody>${row('AI match','id',(v,f)=>`${aiScore(f)}%`)}${row('Overall rating','rating',(v,f)=>`${v} <span class="stars">★</span>`)}${row('Challenge fee','fee',v=>`$${v}`)}${row('Profit target','target')}${row('Daily drawdown','daily')}${row('Maximum drawdown','drawdown')}${row('Payout frequency','payout',v=>`<span class="pill">${v}</span>`)}${row('Maximum profit split','split')}${row('Platforms','platforms')}${row('Rule changes','id',(v,f)=>`${ruleChanges.filter(r=>r.firmId===f.id).length} logged`)}${row('Alerts','id',(v,f)=>`${alerts.filter(a=>a.firmId===f.id && !a.read).length} active`)}${row('SEO page','id',(v,f)=>`<a class="btn btn-light btn-sm" href="/firms/${f.id}" target="_blank">Open SEO page</a>`)}${row('Profile','id',(v,f)=>`<button class="btn btn-light btn-sm" data-firm="${f.id}">View firm</button>`)}</tbody></table></div></div></main>`; }

function profile() { const f=firms.find(x=>x.id===state.selectedFirm)||firms[3]; const firmReviews=reviews.filter(r=>!r.firmId||r.firmId===f.id); const firmDeals=discountCodes.filter(d=>d.firmId===f.id); const firmGiveaways=giveaways.filter(g=>g.firmId===f.id); const firmProofs=payoutProofs.filter(p=>p.firmId===f.id); const firmRules=ruleChanges.filter(r=>r.firmId===f.id); const firmNews=news.filter(n=>n.firmId===f.id); return `<main><section class="profile-hero"><div class="container profile-main">${logo(f)}<div><h1>${f.name}</h1><div class="profile-meta">${stars(f)} · Established ${f.founded} ${firmStatus(f)}</div></div><div class="profile-actions"><button class="btn btn-light save-firm">♡ Save</button><button class="btn btn-lime affiliate">Visit ${f.name} ↗</button></div></div></section><div class="container profile-grid"><div><div class="card"><div class="tabs"><a class="tab active">Overview</a><a class="tab">Verified reviews</a><a class="tab">Payout proof</a></div><div class="tab-content"><h2>Trading rules at a glance</h2><div class="rule-grid">${[['Challenge fee',`$${f.fee}`],['Profit target',f.target],['Daily drawdown',f.daily],['Maximum drawdown',f.drawdown],['Payout frequency',f.payout],['Profit split','Up to '+f.split]].map(x=>`<div class="rule"><small>${x[0]}</small><b>${x[1]}</b></div>`).join('')}</div><h2 style="margin-top:30px">Verified user reviews</h2>${firmReviews.map(r=>`<div class="review verified-review"><div class="review-top"><b>${r.name}</b><small>${r.date}</small></div><div class="stars">${'★'.repeat(r.rating)} ${r.verified?'<span class="status-badge verified">Verified</span>':''}</div><p>${r.text}</p><small class="muted">${r.proofType || 'Community review'}</small></div>`).join('') || '<div class="empty">No trader reviews yet.</div>'}<h2 style="margin-top:30px">Historical rule changes</h2>${firmRules.map(r=>`<div class="rule-change"><b>${r.category}</b><p>${r.summary}</p><small>${r.date}: ${r.before} → ${r.after}</small></div>`).join('') || '<div class="empty">No rule changes logged yet.</div>'}</div></div></div><aside><div class="card side-card"><h3>FundScope score</h3><div class="rating-big">${(f.rating*2).toFixed(1)}<small style="font-size:14px;color:var(--muted)"> / 10</small></div><div class="signal"><span>Listing status</span><b>${firmStatus(f)}</b></div><div class="signal"><span>Rule clarity</span><b class="positive">Excellent</b></div><div class="signal"><span>Payout record</span><b class="positive">${firmProofs.length?'Verified':'Pending'}</b></div><div class="signal"><span>AI fit</span><b>${aiScore(f)}%</b></div></div>${firmNews.length?`<div class="card side-card"><h3>Latest news</h3>${firmNews.map(item=>`<div class="proof"><span><b>${item.title}</b><br><small>${item.source}</small></span></div>`).join('')}</div>`:''}${firmDeals.length?`<div class="card side-card"><h3>Active discount</h3>${firmDeals.map(deal=>`<div class="proof"><span><b>${deal.code}</b><br><small>${deal.label}</small></span><button class="btn btn-sm copy-code" data-code="${deal.code}" data-firm-id="${deal.firmId}" data-deal-id="${deal.id}" data-url="${deal.affiliateUrl}">Copy</button></div>`).join('')}</div>`:''}${firmGiveaways.length?`<div class="card side-card"><h3>Giveaway</h3>${firmGiveaways.map(giveaway=>`<div class="proof"><span><b>${giveaway.title}</b><br><small>${giveaway.entries.toLocaleString()} entries</small></span><button class="btn btn-sm btn-light enter-giveaway" data-giveaway-id="${giveaway.id}">Enter</button></div>`).join('')}</div>`:''}<div class="card side-card"><h3>Recent payout proof</h3>${firmProofs.map(x=>`<div class="proof"><span>$${x.amount.toLocaleString()} · ${x.submittedAt}</span><b class="check">✓</b></div>`).join('') || '<div class="empty">No verified payout proof yet.</div>'}<p style="font-size:11px;color:var(--muted)">Proof is community-submitted and manually reviewed.</p></div><div class="card side-card"><h3>Affiliate disclosure</h3><p style="font-size:12px;color:var(--muted);line-height:1.55">We may earn a commission if you purchase through our link. It never affects a firm's score or your price.</p></div></aside></div></main>`; }

function calculators() { const configs={lot:{title:'Lot size calculator',desc:'Calculate a position size that keeps risk within your plan.',fields:[['balance','Account balance ($)',100000],['risk','Risk per trade (%)',1],['stop','Stop loss (pips)',25],['pip','Pip value per lot ($)',10]]},draw:{title:'Drawdown calculator',desc:'See how much capital you can lose before breaching a limit.',fields:[['balance','Starting balance ($)',100000],['current','Current balance ($)',97500],['limit','Maximum drawdown (%)',10]]},profit:{title:'Profit target calculator',desc:'Break a challenge target into practical daily milestones.',fields:[['balance','Account size ($)',100000],['target','Profit target (%)',8],['days','Trading days',20],['currentProfit','Profit already made ($)',1200]]}}; const c=configs[state.calc]; return `<main><div class="container"><div class="page-head"><span class="eyebrow">Risk tools</span><h1>Trader calculators</h1><p>Simple planning tools built around prop firm constraints.</p></div><div class="calc-layout"><div class="calc-menu">${[['lot','Lot size'],['draw','Drawdown'],['profit','Profit target']].map(x=>`<button class="${state.calc===x[0]?'active':''}" data-calc="${x[0]}">${x[1]} calculator</button>`).join('')}</div><div class="card calculator"><h2>${c.title}</h2><p style="color:var(--muted)">${c.desc}</p><form id="calc-form"><div class="form-grid">${c.fields.map(f=>`<div class="form-group"><label for="${f[0]}">${f[1]}</label><input class="field calc-input" type="number" step="any" id="${f[0]}" value="${f[2]}"/></div>`).join('')}</div></form><div class="result-box"><div><small id="result-label">Recommended position size</small><div class="result-value" id="result-value">4.00 lots</div></div><span style="font-size:34px">${state.calc==='lot'?'◎':state.calc==='draw'?'◒':'↗'}</span></div><p id="result-note" style="font-size:12px;color:var(--muted)"></p></div></div></div></main>`; }

function deals() { return `<main><div class="container"><div class="page-head"><span class="eyebrow">Revenue engine</span><h1>Discount codes & giveaways</h1><p>Keep traders coming back with fresh promos, affiliate links and community giveaways.</p></div><div class="grid grid-2" style="margin-bottom:35px">${discountCodes.map(dealCard).join('') || '<div class="card empty">No active discount codes yet.</div>'}</div><div class="section-head"><div><span class="eyebrow">Open now</span><h2>Giveaways</h2><p>Collect leads and reward the community with challenge accounts or vouchers.</p></div></div><div class="grid grid-2">${giveaways.map(giveawayCard).join('') || '<div class="card empty">No open giveaways yet.</div>'}</div></div></main>`; }

function alertsPage() { return `<main><div class="container"><div class="page-head"><span class="eyebrow">Live tracking MVP</span><h1>Rule-change alerts</h1><p>Track policy updates, historical rule changes, and firms that need manual review. In production this becomes a scheduled crawler + human verification queue.</p></div><div class="grid grid-2"><div class="card"><h2>Active alerts</h2>${alerts.map(a=>`<div class="alert-row"><div><b>${a.title}</b><p>${a.message}</p><small>${firmName(a.firmId)} · ${a.type}</small></div>${a.read?'<span class="pill">Read</span>':'<span class="status-badge verify">New</span>'}</div>`).join('') || '<div class="empty">No alerts yet.</div>'}</div><div class="card"><h2>Historical rule changes</h2>${ruleChanges.map(r=>`<div class="rule-change"><div><b>${firmName(r.firmId)}</b> <span class="pill">${r.category}</span></div><p>${r.summary}</p><small>${r.date} · ${r.before} → ${r.after}</small></div>`).join('') || '<div class="empty">No rule history yet.</div>'}</div></div><div class="card" style="margin-top:24px"><h2>Gather user feedback</h2><form id="feedback-form" class="form-grid"><input class="field" name="name" placeholder="Your name"><input class="field" name="email" placeholder="Email"><input class="field" name="message" placeholder="What should we improve?" style="grid-column:1/-1"><button class="btn">Submit feedback</button></form></div></div></main>`; }

function newsPage() { return `<main><div class="container"><div class="page-head"><span class="eyebrow">Live prop firm news</span><h1>Prop firm news feed</h1><p>News, listing updates, rule-watch items, platform changes, and verification notes. This MVP feed is database-backed and ready to connect to RSS/news APIs later.</p></div><div class="grid grid-3">${news.map(item=>`<article class="card news-card"><span class="pill">${item.type}</span><h3>${item.title}</h3><p>${item.summary}</p><div class="news-meta"><span>${item.source}</span><span>${new Date(item.publishedAt).toLocaleDateString()}</span></div><button class="btn btn-light btn-sm" data-firm="${item.firmId}">Open firm</button></article>`).join('') || '<div class="card empty">No news yet.</div>'}</div></div></main>`; }

function creatorPage() { return `<main><section class="creator-hero"><div class="container creator-grid"><div><span class="eyebrow">About the creator</span><h1>Built by ${brand.creator} to make prop firm research honest, fast, and trader-first.</h1><p class="hero-copy">${brand.name} is designed to become the public trust layer for prop firms: comparisons, rule tracking, reviews, payouts, discounts, alerts, and AI recommendations in one place.</p><div class="creator-actions"><button class="btn" data-route="contact">Partnerships</button><button class="btn btn-light" data-route="news">Follow updates</button><a class="btn btn-light" href="mailto:${brand.email}">Email ${brand.creator}</a></div></div><div class="card creator-card"><div class="creator-avatar">R</div><h2>${brand.creator}</h2><p>Founder of ${brand.name}. Building the prop firm intelligence platform traders check before buying a challenge.</p><div class="contact-list"><a href="mailto:${brand.email}">${brand.email}</a><span>X/Twitter: ${brand.x}</span><span>Instagram: ${brand.instagram}</span><span>YouTube: ${brand.youtube}</span></div><div class="creator-stats"><span><b>${firms.length}</b> firms</span><span><b>${ruleChanges.length}</b> rule logs</span><span><b>${alerts.length}</b> alerts</span></div></div></div></section><section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Popularity plan</span><h2>How we make you known</h2><p>Not fake hype — useful public work that traders actually share.</p></div></div><div class="grid grid-4">${[['Daily firm updates','Post rule changes, discounts, payout proof and risk flags every day.'],['Creator notes','Short explainers: “Before you buy this challenge, check these rules.”'],['Public rankings','Weekly best-for lists: Nigerian traders, futures traders, low-budget accounts, fastest payouts.'],['Community proof','Collect verified user reviews and publish correction logs so traders trust the brand.']].map(x=>`<div class="card feature-card"><div class="icon">★</div><h3>${x[0]}</h3><p>${x[1]}</p></div>`).join('')}</div></div></section></main>`; }

function infoPage(kind) {
  const pages = {
    'how-score': ['How we score', 'FundScope scores firms using rule transparency, payout history, challenge cost, drawdown fairness, platform support, trader sentiment, listing status, and recent rule-change risk.', [['Rule clarity','We compare profit targets, daily drawdown, max drawdown, payout rules, news restrictions, copy-trading rules, consistency rules, and scaling terms.'],['Trust signals','Verified payout proof, review volume, firm age, public policies, and unresolved alerts affect confidence.'],['Trader fit','The AI match score is personalized to budget, market, risk style, payout preference, and preferred platforms.']]],
    editorial: ['Editorial policy', 'Our goal is to help traders make better decisions without hiding risk or letting commissions control rankings.', [['Independence','Affiliate relationships never automatically improve a firm score. Paid placements should be clearly labeled.'],['Verification','Unverified listings are marked as Listed or Verify until rules, pricing, payouts, and website status are checked.'],['Updates','Rule changes are logged historically so traders can see what changed instead of only seeing the latest marketing page.']]],
    contact: ['Contact', 'Use this page for partnerships, data corrections, feedback, or listing verification.', [['General email',`<a href="mailto:${brand.email}">${brand.email}</a>`],['Partnerships',`<a href="mailto:${brand.partnerships}">${brand.partnerships}</a> — send firm name, official website, commission terms, approved logo assets, and current rule documents.`],['Corrections','Tell us the firm, field to update, source URL, and date checked.']]],
    'affiliate-disclosure': ['Affiliate disclosure', 'FundScope may earn commissions when users buy challenges through tracked links or discount codes.', [['No ranking guarantee','Affiliate payouts do not guarantee a higher score or recommendation.'],['User price','Commissions should not increase the trader’s purchase price.'],['Labeling','Featured placements, discount codes, and affiliate links should be disclosed clearly.']]],
    privacy: ['Privacy policy', 'FundScope stores account data server-side for signed-in users and uses a secure browser cookie to remember active sessions.', [['Collected data','Name, email, saved preferences, dashboard accounts, giveaway entries, feedback, and affiliate click events.'],['Use of data','Data is used to power recommendations, alerts, dashboards, and product feedback.'],['Production note','Before a major public launch, connect the data layer to managed Postgres/Supabase/RDS and replace this placeholder with a lawyer-reviewed privacy policy.']]],
    terms: ['Terms', 'FundScope is an information and comparison platform, not financial advice.', [['Trading risk','Prop firm trading involves risk. Rules can change and purchases should be independently verified.'],['Accuracy','We aim to keep firm data current, but unverified listings may contain placeholder or review-pending data.'],['Responsibility','Users are responsible for checking official firm websites before buying challenges.']]]
  };
  const p = pages[kind] || pages['how-score'];
  return `<main><div class="container"><div class="page-head"><span class="eyebrow">FundScope</span><h1>${p[0]}</h1><p>${p[1]}</p></div>${kind==='contact'?`<div class="card brand-kit"><img src="/assets/fundscope-logo.svg" alt="FundScope logo"><div><h2>Brand kit</h2><p>${brand.tagline}</p><div class="contact-list"><a href="mailto:${brand.email}">${brand.email}</a><a href="mailto:${brand.partnerships}">${brand.partnerships}</a><span>X/Twitter: ${brand.x}</span><span>Instagram: ${brand.instagram}</span><span>YouTube: ${brand.youtube}</span></div></div></div>`:''}<div class="grid grid-3" style="margin-bottom:70px">${p[2].map(item=>`<div class="card info-card"><h3>${item[0]}</h3><p>${item[1]}</p></div>`).join('')}</div></div></main>`;
}

function adminRows(items=[], collection) {
  const canDelete = ['firms','discount-codes','news','rule-changes','alerts'].includes(collection);
  return items.slice(0,8).map(item=>`<div class="admin-row"><div><b>${esc(item.name || item.title || item.code || item.id)}</b><small>${esc(item.firm || item.email || item.summary || item.message || item.status || item.id)}</small></div>${canDelete?`<button class="btn btn-light btn-sm admin-delete" data-collection="${collection}" data-id="${esc(item.id)}">Delete</button>`:''}</div>`).join('') || '<div class="empty">Nothing here yet.</div>';
}
function adminFormOptions() {
  return firms.map(f=>`<option value="${esc(f.id)}">${esc(f.name)}</option>`).join('');
}
function adminPage() {
  if (!currentUser) return `<main><div class="container"><div class="page-head"><span class="eyebrow">Admin</span><h1>Sign in to manage FundScope</h1><p>Admin tools are protected by server-side sessions.</p></div><div class="card empty">Open Dashboard and sign in first.</div></div></main>`;
  if (currentUser.role !== 'admin') return `<main><div class="container"><div class="page-head"><span class="eyebrow">Admin</span><h1>Admin access required</h1><p>Your account is signed in, but it is not marked as an admin. Add your email to <code>ADMIN_EMAILS</code> on the server, or claim first-admin access if this is a fresh install.</p></div><div class="card">${adminSetupStatus?.adminConfigured===false?`<h2>First admin setup available</h2><p class="muted">No admin exists yet. If this is your deployment, claim admin for <b>${esc(currentUser.email)}</b>.</p><button class="btn" id="claim-admin">Claim admin access</button>`:`<h2>Admin setup</h2><p class="muted">${adminSetupStatus?'An admin already exists. Ask the owner to add your email or role.':'Checking admin setup status...'}</p>`}</div></div></main>`;
  const d = adminData;
  const counts = d?.counts || {};
  return `<main><div class="container"><div class="page-head dash-head"><div><span class="eyebrow">Operator console</span><h1>FundScope admin dashboard</h1><p>Manage prop firms, discount codes, news, rule updates, alerts, feedback, and launch data from one protected workspace.</p></div><button class="btn btn-light" id="refresh-admin">Refresh</button></div>
  ${!d?'<div class="card empty">Loading admin data...</div>':`
  <div class="grid summary-grid admin-kpis">${[['Firms',counts.firms],['Users',counts.users],['Sessions',counts.activeSessions],['Clicks',counts.affiliateClicks],['Feedback',counts.feedback],['Alerts',counts.alerts]].map(x=>`<div class="card summary-card"><small>${x[0]}</small><strong>${x[1] ?? 0}</strong></div>`).join('')}</div>
  <div class="grid grid-2 admin-grid">
    <form class="card admin-form" id="admin-firm-form"><h2>Add or update firm</h2><div class="form-grid"><input class="field" name="id" placeholder="firm-id or leave blank"><input required class="field" name="name" placeholder="Firm name"><input class="field" name="website" placeholder="Website"><input class="field" name="fee" type="number" placeholder="Challenge fee"><input class="field" name="rating" type="number" step="0.1" placeholder="Rating"><input class="field" name="reviews" type="number" placeholder="Reviews"><input class="field" name="target" placeholder="Profit target"><input class="field" name="daily" placeholder="Daily drawdown"><input class="field" name="drawdown" placeholder="Max drawdown"><input class="field" name="payout" placeholder="Payout frequency"><input class="field" name="split" placeholder="Profit split"><input class="field" name="platforms" placeholder="Platforms"><input class="field" name="best" placeholder="Best for" style="grid-column:1/-1"><select class="field" name="status"><option value="listed">Listed</option><option value="verified">Verified</option><option value="verify">Needs verify</option><option value="inactive">Inactive</option></select><label class="check-field"><input type="checkbox" name="verified"> Verified</label></div><button class="btn">Save firm</button></form>
    <form class="card admin-form" id="admin-deal-form"><h2>Add discount code</h2><div class="form-grid"><select class="field" name="firmId">${adminFormOptions()}</select><input required class="field" name="code" placeholder="Code"><input class="field" name="label" placeholder="Label"><input class="field" name="expiresAt" type="date"><input class="field" name="affiliateUrl" placeholder="Affiliate URL"><select class="field" name="status"><option>active</option><option>paused</option><option>expired</option></select></div><button class="btn">Save discount</button></form>
    <form class="card admin-form" id="admin-news-form"><h2>Add firm news</h2><div class="form-grid"><select class="field" name="firmId">${adminFormOptions()}</select><input required class="field" name="title" placeholder="Title"><input class="field" name="source" placeholder="Source"><input class="field" name="type" placeholder="Type"><input class="field" name="url" placeholder="URL" style="grid-column:1/-1"><textarea class="field" name="summary" placeholder="Summary" style="grid-column:1/-1"></textarea></div><button class="btn">Publish news</button></form>
    <form class="card admin-form" id="admin-rule-form"><h2>Log rule change</h2><div class="form-grid"><select class="field" name="firmId">${adminFormOptions()}</select><input class="field" name="category" placeholder="Category"><input class="field" name="before" placeholder="Before"><input class="field" name="after" placeholder="After"><textarea required class="field" name="summary" placeholder="Summary" style="grid-column:1/-1"></textarea></div><button class="btn">Log rule change</button></form>
    <form class="card admin-form" id="admin-alert-form"><h2>Create alert</h2><div class="form-grid"><select class="field" name="firmId">${adminFormOptions()}</select><input class="field" name="type" placeholder="policy"><input required class="field" name="title" placeholder="Alert title" style="grid-column:1/-1"><textarea class="field" name="message" placeholder="Message" style="grid-column:1/-1"></textarea></div><button class="btn">Create alert</button></form>
    <div class="card admin-panel"><h2>Recent feedback</h2>${adminRows(d.feedback,'feedback')}</div>
  </div>
  <div class="grid grid-3 admin-lists" style="margin:24px 0 70px">
    <div class="card"><h2>Firms</h2>${adminRows(d.firms,'firms')}</div>
    <div class="card"><h2>Discount codes</h2>${adminRows(d.discountCodes,'discount-codes')}</div>
    <div class="card"><h2>News</h2>${adminRows(d.news,'news')}</div>
    <div class="card"><h2>Rule changes</h2>${adminRows(d.ruleChanges,'rule-changes')}</div>
    <div class="card"><h2>Alerts</h2>${adminRows(d.alerts,'alerts')}</div>
    <div class="card"><h2>Recent users</h2>${adminRows(d.users,'users')}</div>
  </div>`}</div></main>`;
}

function dashboard() { const funded=state.accounts.filter(a=>a.type==='Funded').length; const a=dashboardAnalytics(); const p=profileForUser(); const saved=(p.savedFirmIds||[]).map(id=>firms.find(f=>f.id===id)).filter(Boolean); const watchedAlerts=alerts.filter(x=>(p.alertFirmIds||[]).includes(x.firmId)); return `<main><div class="container"><div class="page-head dash-head"><div><span class="eyebrow">Personal trader dashboard</span><h1>${currentUser ? `Welcome, ${currentUser.name}` : 'Login or use demo mode'}</h1><p>Saved preferences, saved firms, payout analytics, drawdown analytics, and alerts in one place.</p></div><button class="btn" id="add-account">+ Add account</button></div><div class="grid summary-grid"><div class="card summary-card"><small>Total accounts</small><strong>${state.accounts.length}</strong></div><div class="card summary-card"><small>Progress to payout</small><strong>${a.progress}%</strong></div><div class="card summary-card"><small>Saved firms</small><strong>${saved.length}</strong></div><div class="card summary-card"><small>Watched alerts</small><strong>${watchedAlerts.length}</strong></div></div><div class="grid grid-2"><div class="card auth-card"><h2>${currentUser?'Account':'Authentication'}</h2>${currentUser?`<p>Signed in as <b>${currentUser.email}</b></p><small class="muted">Remembered with a secure HttpOnly session cookie. Your dashboard records are stored server-side under your user ID.</small><br><br><button class="btn btn-light" id="logout">Logout</button>`:`<form id="auth-form" class="form-grid"><input class="field" name="name" placeholder="Name"><input class="field" name="email" value="demo@fundscope.local" placeholder="Email"><input class="field" name="password" value="demo123" placeholder="Password"><select class="field" name="mode"><option value="login">Login</option><option value="register">Register</option></select><button class="btn">Continue</button></form><small class="muted">New accounts are stored server-side. Returning users are remembered with a secure session cookie. Demo login: demo@fundscope.local / demo123</small>`}</div><div class="card"><h2>Saved preferences</h2><div class="profile-prefs"><span>Market: <b>${p.market}</b></span><span>Budget: <b>$${p.budget}</b></span><span>Risk: <b>${p.riskStyle}</b></span><span>Payout: <b>${p.preferredPayout}</b></span></div><button class="btn btn-light" data-route="match">Edit preferences</button></div></div><div class="grid grid-2" style="margin-top:24px"><div class="card"><h2>Saved firms</h2>${saved.map(f=>`<div class="saved-firm" data-firm="${f.id}">${logo(f,'mini-logo')}<span><b>${f.name}</b><small>${f.best}</small></span>${firmStatus(f)}</div>`).join('') || '<div class="empty">No saved firms yet.</div>'}</div><div class="card"><h2>Your alerts</h2>${watchedAlerts.map(item=>`<div class="alert-row"><div><b>${item.title}</b><p>${item.message}</p><small>${firmName(item.firmId)}</small></div>${item.read?'<span class="pill">Read</span>':'<span class="status-badge verify">New</span>'}</div>`).join('') || '<div class="empty">No watched alerts yet.</div>'}</div></div><div class="grid grid-2" style="margin-top:24px"><div class="card"><h2>Payout analytics</h2><div class="result-box"><div><small>Progress across accounts</small><div class="result-value">${a.progress}%</div></div><span>↗</span></div><p class="muted">${formatMoney(a.current)} earned toward ${formatMoney(a.target)} total targets.</p></div><div class="card"><h2>Drawdown analytics</h2><div class="result-box"><div><small>Remaining target gap</small><div class="result-value">${formatMoney(a.drawdownUsed)}</div></div><span>◒</span></div><p class="muted">Use this with firm max drawdown rules before placing risk.</p></div></div><div class="card" style="margin:24px 0 70px"><div class="section-head" style="margin-bottom:5px"><div><h2 style="font-size:23px">Your accounts</h2><p>Challenge and funded account progress</p></div></div>${state.accounts.length?state.accounts.map(a=>`<div class="account-row"><div><b>${a.firm}</b><small style="display:block;color:var(--muted)">${a.account}</small></div><div><span class="pill">${a.type}</span></div><div><small>Current</small><br><b>${a.current}</b></div><div><div style="display:flex;justify-content:space-between;font-size:12px"><span>Target ${a.target}</span><b>${a.progress}%</b></div><div class="progress"><span style="width:${a.progress}%"></span></div></div><button class="close delete-account" data-id="${a.id}" aria-label="Delete account">×</button></div>`).join(''):'<div class="empty">No accounts yet. Add your first challenge to start tracking.</div>'}</div></div></main>`; }

function modal() { return `<div class="modal-backdrop"><form class="modal" id="account-form"><div class="modal-head"><div><h2 style="margin-bottom:4px">Add an account</h2><small style="color:var(--muted)">Track a challenge or funded account</small></div><button type="button" class="close close-modal">×</button></div><div class="form-grid"><div class="form-group"><label>Prop firm</label><input required class="field" name="firm" placeholder="e.g. FTMO"></div><div class="form-group"><label>Account size</label><input required class="field" name="size" placeholder="e.g. $100,000"></div><div class="form-group"><label>Account type</label><select class="field" name="type"><option>Challenge</option><option>Funded</option></select></div><div class="form-group"><label>Profit target ($)</label><input required type="number" class="field" name="target" value="10000"></div></div><button class="btn" style="width:100%">Add to dashboard</button></form></div>`; }
function giveawayModal(giveawayId) { const giveaway=giveaways.find(g=>g.id===giveawayId); return `<div class="modal-backdrop"><form class="modal" id="giveaway-form"><input type="hidden" name="giveawayId" value="${giveawayId}"><div class="modal-head"><div><h2 style="margin-bottom:4px">Enter giveaway</h2><small style="color:var(--muted)">${giveaway?.title || 'Community giveaway'}</small></div><button type="button" class="close close-modal">×</button></div><div class="form-grid"><div class="form-group"><label>Your name</label><input required class="field" name="name" placeholder="Trader name"></div><div class="form-group"><label>Email</label><input required type="email" class="field" name="email" placeholder="you@email.com"></div></div><button class="btn" style="width:100%">Submit entry</button></form></div>`; }

function render() { const pages={home,directory,compare,profile,match,news:newsPage,calculators,deals,alerts:alertsPage,creator:creatorPage,dashboard,admin:adminPage,'how-score':()=>infoPage('how-score'),editorial:()=>infoPage('editorial'),contact:()=>infoPage('contact'),'affiliate-disclosure':()=>infoPage('affiliate-disclosure'),privacy:()=>infoPage('privacy'),terms:()=>infoPage('terms')}; document.querySelector('#app').innerHTML=`<div class="shell">${nav()}${(pages[state.route] || home)()}${footer()}</div>`; bind(); if(state.route==='calculators') calculate(); }
function bind() {
  document.querySelectorAll('[data-route]').forEach(el=>el.onclick=()=>navigate(el.dataset.route));
  const menu=document.querySelector('.mobile-menu'); if(menu) menu.onclick=()=>{state.menuOpen=!state.menuOpen;render();};
  bindFirmClicks();
  document.querySelectorAll('[data-calc]').forEach(el=>el.onclick=()=>{state.calc=el.dataset.calc;render()});
  const searchInput=document.querySelector('#search-input'); if(searchInput) searchInput.oninput=e=>{state.search=e.target.value;refreshHeroResults();};
  const hs=document.querySelector('#hero-search'); if(hs) hs.onsubmit=e=>{e.preventDefault();state.search=document.querySelector('#search-input').value;navigate('directory')};
  document.querySelectorAll('[data-quick]').forEach(el=>el.onclick=()=>{state.search=el.dataset.quick;state.filters.market=el.dataset.quick;navigate('directory');});
  const ds=document.querySelector('#directory-search'); if(ds) ds.oninput=e=>{state.search=e.target.value;refreshDirectoryResults();};
  document.querySelectorAll('.filter-input').forEach(el=>el.oninput=e=>{state.filters[e.target.dataset.filter]=e.target.value;refreshDirectoryResults();});
  const clear=document.querySelector('#clear-filters'); if(clear) clear.onclick=()=>{state.search='';state.filters={market:'all',status:'all',maxFee:'',minRating:''};render();};
  const af=document.querySelector('#add-firm'); if(af) af.onchange=e=>{const i=+e.target.value;if(!Number.isNaN(i)&&!state.compare.includes(i)){state.compare.push(i);if(state.compare.length>5)state.compare.shift();render();}};
  document.querySelectorAll('.remove-compare').forEach(el=>el.onclick=e=>{e.stopPropagation();state.compare=state.compare.filter(i=>i!=el.dataset.index);render();});
  document.querySelectorAll('.calc-input').forEach(el=>el.oninput=calculate);
  const add=document.querySelector('#add-account'); if(add) add.onclick=()=>{document.body.insertAdjacentHTML('beforeend',modal());bindModal()};
  document.querySelectorAll('.delete-account').forEach(el=>el.onclick=async()=>{try{if(currentUser) await api.delete(`/api/dashboard/accounts/${el.dataset.id}`);state.accounts=state.accounts.filter(a=>a.id!=el.dataset.id);saveAccounts();render();toast('Account removed');}catch{toast('Could not remove account. Please sign in again.');}});
  document.querySelectorAll('.copy-code').forEach(el=>el.onclick=async()=>{try{await navigator.clipboard.writeText(el.dataset.code); await api.post('/api/affiliate-clicks',{firmId:el.dataset.firmId,dealId:el.dataset.dealId,redirectUrl:el.dataset.url,source:'discount-code'}); toast('Code copied and affiliate click tracked');}catch{toast(`Code copied: ${el.dataset.code}`);}});
  document.querySelectorAll('.enter-giveaway').forEach(el=>el.onclick=()=>{document.body.insertAdjacentHTML('beforeend',giveawayModal(el.dataset.giveawayId));bindGiveawayModal();});
  const aff=document.querySelector('.affiliate'); if(aff) aff.onclick=async()=>{const firm=firms.find(x=>x.id===state.selectedFirm); try{await api.post('/api/affiliate-clicks',{firmId:firm.id,source:'firm-profile'}); toast('Affiliate click tracked');}catch{toast('Affiliate destination ready to connect');}};
  const save=document.querySelector('.save-firm'); if(save) save.onclick=()=>{save.textContent='♥ Saved';toast('Firm saved to your watchlist')};
  document.querySelectorAll('.pref-input').forEach(el=>el.oninput=e=>{userProfile[e.target.dataset.pref]=e.target.type==='number'?Number(e.target.value):e.target.value;localStorage.setItem('fundscope-profile',JSON.stringify(userProfile));render();});
  const savePrefs=document.querySelector('#save-preferences'); if(savePrefs) savePrefs.onclick=async()=>{localStorage.setItem('fundscope-profile',JSON.stringify(userProfile)); if(currentUser){try{await api.post('/api/recommendations',{preferences:userProfile});const profile=await api.put('/api/profiles/me',userProfile);userProfile=profile;profiles=[profile];}catch{toast('Could not sync preferences. Please sign in again.');return;}} toast('Preferences saved and recommendations updated');};
  const authForm=document.querySelector('#auth-form'); if(authForm) authForm.onsubmit=async e=>{e.preventDefault();const d=new FormData(e.target);const mode=d.get('mode');try{const result=await api.post(`/api/auth/${mode}`,{name:d.get('name'),email:d.get('email'),password:d.get('password')});applyAuthPayload(result);toast(mode==='register'?'Account created and signed in':'Signed in');render();}catch{toast('Could not sign in. Try demo@fundscope.local / demo123');}};
  const logout=document.querySelector('#logout'); if(logout) logout.onclick=async()=>{try{await api.post('/api/auth/logout',{});}catch{}currentUser=null;profiles=[];state.accounts=[];localStorage.removeItem('fundscope-user');localStorage.removeItem('fundscope-accounts');toast('Logged out');render();};
  const feedback=document.querySelector('#feedback-form'); if(feedback) feedback.onsubmit=async e=>{e.preventDefault();const d=new FormData(e.target);try{await api.post('/api/feedback',{name:d.get('name'),email:d.get('email'),message:d.get('message')});toast('Feedback submitted');e.target.reset();}catch{toast('Feedback saved for backend mode');}};
  document.querySelectorAll('.tabs .tab').forEach((el,i)=>el.onclick=()=>{document.querySelectorAll('.tabs .tab').forEach(x=>x.classList.remove('active'));el.classList.add('active');if(i>0)toast(i===1?'Showing latest trader reviews':'Payout proof is shown in the right panel');});
  bindAdmin();
}
function formJson(form) {
  const body = {};
  new FormData(form).forEach((value,key)=>body[key]=value);
  form.querySelectorAll('input[type="checkbox"]').forEach(input=>body[input.name]=input.checked);
  return body;
}
function bindAdmin() {
  if (state.route !== 'admin') return;
  if (currentUser && currentUser.role !== 'admin' && !adminSetupStatus) refreshAdminSetupStatus().then(render).catch(()=>{adminSetupStatus={adminConfigured:true};render();});
  const claim=document.querySelector('#claim-admin'); if(claim) claim.onclick=async()=>{try{const result=await api.post('/api/admin/setup',{});applyAuthPayload(result);adminSetupStatus={adminConfigured:true};adminData=null;toast('Admin access claimed');render();}catch{toast('Admin setup is not available');}};
  if (currentUser?.role === 'admin' && !adminData) refreshAdminData().then(render).catch(()=>toast('Admin access denied'));
  const refresh=document.querySelector('#refresh-admin'); if(refresh) refresh.onclick=async()=>{try{await refreshAdminData();render();toast('Admin data refreshed');}catch{toast('Could not refresh admin data');}};
  const wire=(id,path,msg)=>{const form=document.querySelector(id); if(form) form.onsubmit=async e=>{e.preventDefault();try{const result=await api.post(path,formJson(form));adminData=result.overview;await refreshPublicData();form.reset();render();toast(msg);}catch{toast('Admin save failed. Check required fields and access.');}};};
  wire('#admin-firm-form','/api/admin/firms','Firm saved');
  wire('#admin-deal-form','/api/admin/discount-codes','Discount saved');
  wire('#admin-news-form','/api/admin/news','News published');
  wire('#admin-rule-form','/api/admin/rule-changes','Rule change logged');
  wire('#admin-alert-form','/api/admin/alerts','Alert created');
  document.querySelectorAll('.admin-delete').forEach(btn=>btn.onclick=async()=>{try{const result=await api.delete(`/api/admin/${btn.dataset.collection}/${btn.dataset.id}`);adminData=result.overview;await refreshPublicData();render();toast('Deleted');}catch{toast('Delete failed or access denied');}});
}
function calculate(){ const v=id=>+(document.querySelector('#'+id)?.value||0); let label,value,note;if(state.calc==='lot'){const risk=v('balance')*v('risk')/100;value=(risk/(v('stop')*v('pip')||1)).toFixed(2)+' lots';label='Recommended position size';note=`This risks $${risk.toLocaleString()} if the stop loss is hit.`;}else if(state.calc==='draw'){const used=v('balance')-v('current'), max=v('balance')*v('limit')/100, left=max-used;value='$'+Math.max(0,left).toLocaleString();label='Drawdown remaining';note=`You have used $${used.toLocaleString()} of a $${max.toLocaleString()} maximum.`;}else{const total=v('balance')*v('target')/100, remaining=total-v('currentProfit'),daily=remaining/(v('days')||1);value='$'+Math.max(0,daily).toLocaleString(undefined,{maximumFractionDigits:0})+'/day';label='Required daily average';note=`$${Math.max(0,remaining).toLocaleString()} remains to reach the $${total.toLocaleString()} target.`;}document.querySelector('#result-label').textContent=label;document.querySelector('#result-value').textContent=value;document.querySelector('#result-note').textContent=note;}
function bindModal(){document.querySelector('.close-modal').onclick=()=>document.querySelector('.modal-backdrop').remove();document.querySelector('.modal-backdrop').onclick=e=>{if(e.target.classList.contains('modal-backdrop'))e.target.remove()};document.querySelector('#account-form').onsubmit=async e=>{e.preventDefault();const d=new FormData(e.target), target=+d.get('target');const account={id:Date.now(),firm:d.get('firm'),account:d.get('size')+' account',type:d.get('type'),progress:0,target:'$'+target.toLocaleString(),current:'$0'};try{const saved=currentUser?await api.post('/api/dashboard/accounts',account):account;state.accounts.push(saved);}catch{toast('Please sign in again to save this account online');return;}saveAccounts();document.querySelector('.modal-backdrop').remove();render();toast(currentUser?'Account saved to your hosted profile':'Account saved locally in demo mode');};}
function bindGiveawayModal(){document.querySelector('.close-modal').onclick=()=>document.querySelector('.modal-backdrop').remove();document.querySelector('.modal-backdrop').onclick=e=>{if(e.target.classList.contains('modal-backdrop'))e.target.remove()};document.querySelector('#giveaway-form').onsubmit=async e=>{e.preventDefault();const d=new FormData(e.target);try{const result=await api.post('/api/giveaway-entries',{giveawayId:d.get('giveawayId'),name:d.get('name'),email:d.get('email')});const item=giveaways.find(g=>g.id===d.get('giveawayId'));if(item) item.entries=result.giveaway.entries;document.querySelector('.modal-backdrop').remove();render();toast('Giveaway entry submitted');}catch{toast('Backend needed to submit giveaway entries');}};}
function saveAccounts(){if(currentUser)localStorage.removeItem('fundscope-accounts');else localStorage.setItem('fundscope-accounts',JSON.stringify(state.accounts));}
window.addEventListener('popstate',()=>{state.menuOpen=false;routeFromPath();render();});
async function loadBackendData(){
  try{
    const data=await api.get('/api/bootstrap');
    firms=data.firms?.length?data.firms:firms;
    reviews=data.reviews?.length?data.reviews:reviews;
    discountCodes=data.discountCodes || [];
    giveaways=data.giveaways || [];
    payoutProofs=data.payoutProofs || [];
    ruleChanges=data.ruleChanges || [];
    alerts=data.alerts || [];
    news=data.news || [];
    await hydrateAuthSession();
  }catch{
    try{
      const data=await api.get('data/db.json');
      firms=data.firms?.length?data.firms:firms;
      reviews=data.reviews?.length?data.reviews:reviews;
      discountCodes=data.discountCodes || [];
      giveaways=data.giveaways || [];
      payoutProofs=data.payoutProofs || [];
      ruleChanges=data.ruleChanges || [];
      alerts=data.alerts || [];
      news=data.news || [];
    }catch{
      discountCodes = [
        {id:'demo-deal',firmId:'ftmo',firm:'FTMO',code:'FUNDSCOPE10',label:'Demo 10% discount code',expiresAt:'2026-07-31',affiliateUrl:'#'}
      ];
      giveaways = [
        {id:'demo-giveaway',firmId:'ftmo',firm:'FTMO',title:'Demo $100k Challenge Giveaway',prize:'$100,000 challenge account',endsAt:'2026-07-20',entries:1284}
      ];
    }
  }
  routeFromPath();
  render();
}
loadBackendData();

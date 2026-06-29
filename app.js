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

const api = {
  async get(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  async post(path, body) {
    const res = await fetch(path, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
  async delete(path) {
    const res = await fetch(path, { method:'DELETE' });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }
};

const state = { route:'home', selectedFirm:'ftmo', calc:'lot', compare:[0,1,3], accounts: JSON.parse(localStorage.getItem('fundscope-accounts') || 'null') || [
  {id:1, firm:'FTMO', account:'$100,000 Challenge', type:'Challenge', progress:64, target:'$10,000', current:'$6,400'},
  {id:2, firm:'Topstep', account:'$50,000 Express', type:'Funded', progress:82, target:'$2,500', current:'$2,050'}
]};

const icon = (name) => ({search:'⌕',compare:'⇄',calc:'∑',dash:'◫',shield:'✓',chart:'↗',review:'★'}[name] || '•');
const brandLogo = () => `<span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7.2" stroke="currentColor" stroke-width="1.6" opacity=".55"/><path d="M14.9 9.1 13 13l-3.9 1.9L11 11l3.9-1.9Z" fill="#ffca5c" stroke="white" stroke-width="1.1" stroke-linejoin="round"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>`;
function navigate(route, id) { state.route=route; if(id) state.selectedFirm=id; window.scrollTo(0,0); render(); }
function logo(f, cls='firm-logo') {
  const safeName = f.name.replaceAll('"', '&quot;');
  return `<div class="${cls}" style="background:${f.color}">${f.logoUrl ? `<img src="${f.logoUrl}" alt="${safeName} logo" loading="lazy" onerror="this.remove();this.parentElement.textContent='${f.initials}'">` : f.initials}</div>`;
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
function dealCard(deal) { return `<article class="card deal-card"><div><span class="eyebrow">Discount code</span><h3>${deal.label}</h3><p>${deal.firm || firmName(deal.firmId)} · Expires ${deal.expiresAt}</p></div><div class="code-row"><code>${deal.code}</code><button class="btn btn-sm copy-code" data-code="${deal.code}" data-firm-id="${deal.firmId}" data-deal-id="${deal.id}" data-url="${deal.affiliateUrl}">Copy & track</button></div></article>`; }
function giveawayCard(giveaway) { return `<article class="card giveaway-card"><span class="eyebrow">Giveaway</span><h3>${giveaway.title}</h3><p>${giveaway.firm || firmName(giveaway.firmId)} · ${giveaway.prize}</p><div class="giveaway-meta"><span>${giveaway.entries.toLocaleString()} entries</span><span>Ends ${giveaway.endsAt}</span></div><button class="btn btn-light enter-giveaway" data-giveaway-id="${giveaway.id}">Enter giveaway</button></article>`; }

function nav() {
  const links=[['home','Discover'],['compare','Compare'],['calculators','Calculators'],['dashboard','Dashboard']];
  return `<nav class="nav"><div class="container nav-inner">
    <a class="brand" data-route="home">${brandLogo()} FundScope</a>
    <div class="nav-links">${links.map(([r,l])=>`<a class="nav-link ${state.route===r?'active':''}" data-route="${r}">${l}</a>`).join('')}<a class="nav-link ${state.route==='deals'?'active':''}" data-route="deals">Deals</a></div>
    <div class="nav-actions"><button class="btn btn-light btn-sm" data-route="compare">Compare firms</button><button class="btn btn-sm" data-route="dashboard">My dashboard</button></div>
    <button class="mobile-menu" aria-label="Open menu">☰</button>
  </div></nav>`;
}

function footer() { return `<footer class="footer"><div class="container"><div class="footer-grid">
  <div><div class="brand" style="color:white">${brandLogo()} FundScope</div><p style="max-width:300px;font-size:13px;line-height:1.6">Independent intelligence for traders making better prop firm decisions.</p></div>
  <div><h4>Discover</h4><a data-route="compare">Compare firms</a><a data-route="calculators">Calculators</a><a>Firm rankings</a></div>
  <div><h4>Company</h4><a>How we score</a><a>Editorial policy</a><a>Contact</a></div>
  <div><h4>Legal</h4><a>Affiliate disclosure</a><a>Privacy</a><a>Terms</a></div>
  </div><div class="footer-bottom">© 2026 FundScope. Trading involves risk. Firm information should be independently verified before purchase.</div></div></footer>`; }

function firmCard(f, featured=false) { return `<article class="card firm-card ${f.status==='inactive'?'muted-card':''}" data-firm="${f.id}">${featured?'<span class="featured-tag">Featured</span>':''}<div class="firm-top">${logo(f)}<div><div class="firm-name">${f.name}</div><div class="firm-meta-line">${stars(f)} ${firmStatus(f)}</div></div></div><div class="firm-stats"><div class="stat"><small>From</small><b>$${f.fee}</b></div><div class="stat"><small>Profit split</small><b>${f.split}</b></div><div class="stat"><small>Payout</small><b>${f.payout}</b></div></div><span class="best-for">Best for: ${f.best}</span></article>`; }

function home() { return `<main>
  <section class="hero"><div class="container hero-inner"><div><span class="eyebrow">Independent prop firm intelligence</span><h1>Find the right firm.<br><span>Fund your edge.</span></h1><p class="hero-copy">Compare rules, fees, payouts and real trader experiences—all in one place, without the marketing noise.</p><form class="search-box" id="hero-search"><input aria-label="Search firms" id="search-input" placeholder="Search a prop firm..."/><button class="btn" type="submit">${icon('search')} <span>Search firms</span></button></form><div class="hero-meta"><span><b>${firms.length}+</b> firms tracked</span><span><b>38k</b> verified reviews</span><span><b>Weekly</b> rule checks</span></div></div>
  <div class="insight-card"><div class="top"><div class="firm-top">${logo(firms[3],'mini-logo')}<div><b>FTMO</b><div style="font-size:11px;color:var(--muted)">FundScope rating</div></div></div><div class="score-ring"><b>9.2</b></div></div><div class="signal"><span>Payout reliability</span><b class="positive">Excellent</b></div><div class="signal"><span>Rule transparency</span><b class="positive">High</b></div><div class="signal"><span>Trader sentiment</span><b>92% positive</b></div><div class="signal"><span>Risk flag</span><b class="positive">Low</b></div></div></div></section>
  <div class="trust-strip"><div class="container trust-inner"><div><b>${firms.length}+</b><span>firms monitored</span></div><div><b>${firms.length * 3}+</b><span>plans compared</span></div><div><b>38,400</b><span>trader reviews</span></div><div><b>96%</b><span>rules up to date</span></div></div></div>
  <section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Top rated</span><h2>Featured prop firms</h2><p>High-confidence choices based on rules, reliability and trader feedback.</p></div><a class="link" data-route="compare">Compare all firms →</a></div><div class="grid grid-3">${activeFirms().slice(0,3).map((f,i)=>firmCard(f,i===1)).join('')}</div></div></section>
  <section class="section deals-preview"><div class="container"><div class="section-head"><div><span class="eyebrow">Promos & community</span><h2>Discount codes and giveaways</h2><p>Turn affiliate deals and giveaways into a repeat traffic engine.</p></div><a class="link" data-route="deals">View all deals →</a></div><div class="grid grid-2">${discountCodes.slice(0,2).map(dealCard).join('') || '<div class="card empty">Run through the backend API to load live discount codes.</div>'}${giveaways.slice(0,1).map(giveawayCard).join('')}</div></div></section>
  <section class="section" style="background:white"><div class="container"><div class="section-head"><div><span class="eyebrow">One workspace</span><h2>Trade with the full picture</h2><p>Research, plan and monitor every account from a single place.</p></div></div><div class="grid grid-4">${[['compare','Compare precisely','Put fees, targets and drawdown rules side by side.'],['review','Trust the evidence','Read trader reviews and inspect payout proof.'],['calc','Calculate the risk','Size positions and model drawdown before you trade.'],['dash','Track every account','See challenges, funded accounts and payout progress.']].map(x=>`<div class="feature-card"><div class="icon">${icon(x[0])}</div><h3>${x[1]}</h3><p>${x[2]}</p></div>`).join('')}</div></div></section>
  <section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Worldwide directory</span><h2>Known prop firms globally</h2><p>Includes verified listings, unverified listings, firms to review, and inactive historical names.</p></div></div><div class="grid grid-3">${firms.slice(3).map(f=>firmCard(f)).join('')}</div></div></section>
  </main>`; }

function compare() { const chosen=state.compare.map(i=>firms[i]); const row=(label,key,format=v=>v)=>`<tr><td>${label}</td>${chosen.map(f=>`<td>${format(f[key],f)}</td>`).join('')}</tr>`; return `<main><div class="container"><div class="page-head"><span class="eyebrow">Decision tool</span><h1>Compare prop firms</h1><p>Put the rules that matter side by side. Pricing is shown for a representative account and may change.</p></div><div class="toolbar"><select class="field" id="add-firm"><option>Add a firm to compare...</option>${firms.map((f,i)=>`<option value="${i}">${f.name}${f.status==='inactive'?' (inactive)':f.status==='verify'?' (verify)':''}</option>`).join('')}</select><select class="field"><option>$100k account</option><option>$50k account</option><option>$200k account</option></select></div><div class="compare-wrap"><table class="compare"><thead><tr><th>Metric</th>${chosen.map(f=>`<th><div class="firm-top">${logo(f,'mini-logo')}<span>${f.name}<br>${firmStatus(f)}</span></div></th>`).join('')}</tr></thead><tbody>${row('Overall rating','rating',(v,f)=>`${v} <span class="stars">★</span>`)}${row('Challenge fee','fee',v=>`$${v}`)}${row('Profit target','target')}${row('Daily drawdown','daily')}${row('Maximum drawdown','drawdown')}${row('Payout frequency','payout',v=>`<span class="pill">${v}</span>`)}${row('Maximum profit split','split')}${row('Platforms','platforms')}${row('Founded','founded')}${row('Profile','id',(v,f)=>`<button class="btn btn-light btn-sm" data-firm="${f.id}">View firm</button>`)}</tbody></table></div></div></main>`; }

function profile() { const f=firms.find(x=>x.id===state.selectedFirm)||firms[3]; const firmReviews=reviews.filter(r=>!r.firmId||r.firmId===f.id); const firmDeals=discountCodes.filter(d=>d.firmId===f.id); const firmGiveaways=giveaways.filter(g=>g.firmId===f.id); const firmProofs=payoutProofs.filter(p=>p.firmId===f.id); return `<main><section class="profile-hero"><div class="container profile-main">${logo(f)}<div><h1>${f.name}</h1><div class="profile-meta">${stars(f)} · Established ${f.founded} ${firmStatus(f)}</div></div><div class="profile-actions"><button class="btn btn-light save-firm">♡ Save</button><button class="btn btn-lime affiliate">Visit ${f.name} ↗</button></div></div></section><div class="container profile-grid"><div><div class="card"><div class="tabs"><a class="tab active">Overview</a><a class="tab">Reviews</a><a class="tab">Payout proof</a></div><div class="tab-content"><h2>Trading rules at a glance</h2><div class="rule-grid">${[['Challenge fee',`$${f.fee}`],['Profit target',f.target],['Daily drawdown',f.daily],['Maximum drawdown',f.drawdown],['Payout frequency',f.payout],['Profit split','Up to '+f.split]].map(x=>`<div class="rule"><small>${x[0]}</small><b>${x[1]}</b></div>`).join('')}</div><h2 style="margin-top:30px">What traders say</h2>${firmReviews.map(r=>`<div class="review"><div class="review-top"><b>${r.name}</b><small>${r.date}</small></div><div class="stars">${'★'.repeat(r.rating)}</div><p>${r.text}</p></div>`).join('') || '<div class="empty">No trader reviews yet.</div>'}</div></div></div><aside><div class="card side-card"><h3>FundScope score</h3><div class="rating-big">${(f.rating*2).toFixed(1)}<small style="font-size:14px;color:var(--muted)"> / 10</small></div><div class="signal"><span>Listing status</span><b>${firmStatus(f)}</b></div><div class="signal"><span>Rule clarity</span><b class="positive">Excellent</b></div><div class="signal"><span>Payout record</span><b class="positive">Verified</b></div><div class="signal"><span>Support</span><b>Good</b></div></div>${firmDeals.length?`<div class="card side-card"><h3>Active discount</h3>${firmDeals.map(deal=>`<div class="proof"><span><b>${deal.code}</b><br><small>${deal.label}</small></span><button class="btn btn-sm copy-code" data-code="${deal.code}" data-firm-id="${deal.firmId}" data-deal-id="${deal.id}" data-url="${deal.affiliateUrl}">Copy</button></div>`).join('')}</div>`:''}${firmGiveaways.length?`<div class="card side-card"><h3>Giveaway</h3>${firmGiveaways.map(giveaway=>`<div class="proof"><span><b>${giveaway.title}</b><br><small>${giveaway.entries.toLocaleString()} entries</small></span><button class="btn btn-sm btn-light enter-giveaway" data-giveaway-id="${giveaway.id}">Enter</button></div>`).join('')}</div>`:''}<div class="card side-card"><h3>Recent payout proof</h3>${firmProofs.map(x=>`<div class="proof"><span>$${x.amount.toLocaleString()} · ${x.submittedAt}</span><b class="check">✓</b></div>`).join('') || '<div class="empty">No verified payout proof yet.</div>'}<p style="font-size:11px;color:var(--muted)">Proof is community-submitted and manually reviewed.</p></div><div class="card side-card"><h3>Affiliate disclosure</h3><p style="font-size:12px;color:var(--muted);line-height:1.55">We may earn a commission if you purchase through our link. It never affects a firm's score or your price.</p></div></aside></div></main>`; }

function calculators() { const configs={lot:{title:'Lot size calculator',desc:'Calculate a position size that keeps risk within your plan.',fields:[['balance','Account balance ($)',100000],['risk','Risk per trade (%)',1],['stop','Stop loss (pips)',25],['pip','Pip value per lot ($)',10]]},draw:{title:'Drawdown calculator',desc:'See how much capital you can lose before breaching a limit.',fields:[['balance','Starting balance ($)',100000],['current','Current balance ($)',97500],['limit','Maximum drawdown (%)',10]]},profit:{title:'Profit target calculator',desc:'Break a challenge target into practical daily milestones.',fields:[['balance','Account size ($)',100000],['target','Profit target (%)',8],['days','Trading days',20],['currentProfit','Profit already made ($)',1200]]}}; const c=configs[state.calc]; return `<main><div class="container"><div class="page-head"><span class="eyebrow">Risk tools</span><h1>Trader calculators</h1><p>Simple planning tools built around prop firm constraints.</p></div><div class="calc-layout"><div class="calc-menu">${[['lot','Lot size'],['draw','Drawdown'],['profit','Profit target']].map(x=>`<button class="${state.calc===x[0]?'active':''}" data-calc="${x[0]}">${x[1]} calculator</button>`).join('')}</div><div class="card calculator"><h2>${c.title}</h2><p style="color:var(--muted)">${c.desc}</p><form id="calc-form"><div class="form-grid">${c.fields.map(f=>`<div class="form-group"><label for="${f[0]}">${f[1]}</label><input class="field calc-input" type="number" step="any" id="${f[0]}" value="${f[2]}"/></div>`).join('')}</div></form><div class="result-box"><div><small id="result-label">Recommended position size</small><div class="result-value" id="result-value">4.00 lots</div></div><span style="font-size:34px">${state.calc==='lot'?'◎':state.calc==='draw'?'◒':'↗'}</span></div><p id="result-note" style="font-size:12px;color:var(--muted)"></p></div></div></div></main>`; }

function deals() { return `<main><div class="container"><div class="page-head"><span class="eyebrow">Revenue engine</span><h1>Discount codes & giveaways</h1><p>Keep traders coming back with fresh promos, affiliate links and community giveaways.</p></div><div class="grid grid-2" style="margin-bottom:35px">${discountCodes.map(dealCard).join('') || '<div class="card empty">No active discount codes yet.</div>'}</div><div class="section-head"><div><span class="eyebrow">Open now</span><h2>Giveaways</h2><p>Collect leads and reward the community with challenge accounts or vouchers.</p></div></div><div class="grid grid-2">${giveaways.map(giveawayCard).join('') || '<div class="card empty">No open giveaways yet.</div>'}</div></div></main>`; }

function dashboard() { const funded=state.accounts.filter(a=>a.type==='Funded').length; return `<main><div class="container"><div class="page-head dash-head"><div><span class="eyebrow">Your workspace</span><h1>Good morning, Trader</h1><p>Here’s how your prop journey is moving.</p></div><button class="btn" id="add-account">+ Add account</button></div><div class="grid summary-grid"><div class="card summary-card"><small>Total accounts</small><strong>${state.accounts.length}</strong></div><div class="card summary-card"><small>Active challenges</small><strong>${state.accounts.length-funded}</strong></div><div class="card summary-card"><small>Funded accounts</small><strong>${funded}</strong></div><div class="card summary-card"><small>Nearest payout</small><strong>${state.accounts.length?'82%':'—'}</strong></div></div><div class="card" style="margin-bottom:70px"><div class="section-head" style="margin-bottom:5px"><div><h2 style="font-size:23px">Your accounts</h2><p>Challenge and funded account progress</p></div></div>${state.accounts.length?state.accounts.map(a=>`<div class="account-row"><div><b>${a.firm}</b><small style="display:block;color:var(--muted)">${a.account}</small></div><div><span class="pill">${a.type}</span></div><div><small>Current</small><br><b>${a.current}</b></div><div><div style="display:flex;justify-content:space-between;font-size:12px"><span>Target ${a.target}</span><b>${a.progress}%</b></div><div class="progress"><span style="width:${a.progress}%"></span></div></div><button class="close delete-account" data-id="${a.id}" aria-label="Delete account">×</button></div>`).join(''):'<div class="empty">No accounts yet. Add your first challenge to start tracking.</div>'}</div></div></main>`; }

function modal() { return `<div class="modal-backdrop"><form class="modal" id="account-form"><div class="modal-head"><div><h2 style="margin-bottom:4px">Add an account</h2><small style="color:var(--muted)">Track a challenge or funded account</small></div><button type="button" class="close close-modal">×</button></div><div class="form-grid"><div class="form-group"><label>Prop firm</label><input required class="field" name="firm" placeholder="e.g. FTMO"></div><div class="form-group"><label>Account size</label><input required class="field" name="size" placeholder="e.g. $100,000"></div><div class="form-group"><label>Account type</label><select class="field" name="type"><option>Challenge</option><option>Funded</option></select></div><div class="form-group"><label>Profit target ($)</label><input required type="number" class="field" name="target" value="10000"></div></div><button class="btn" style="width:100%">Add to dashboard</button></form></div>`; }
function giveawayModal(giveawayId) { const giveaway=giveaways.find(g=>g.id===giveawayId); return `<div class="modal-backdrop"><form class="modal" id="giveaway-form"><input type="hidden" name="giveawayId" value="${giveawayId}"><div class="modal-head"><div><h2 style="margin-bottom:4px">Enter giveaway</h2><small style="color:var(--muted)">${giveaway?.title || 'Community giveaway'}</small></div><button type="button" class="close close-modal">×</button></div><div class="form-grid"><div class="form-group"><label>Your name</label><input required class="field" name="name" placeholder="Trader name"></div><div class="form-group"><label>Email</label><input required type="email" class="field" name="email" placeholder="you@email.com"></div></div><button class="btn" style="width:100%">Submit entry</button></form></div>`; }

function render() { const pages={home,compare,profile,calculators,deals,dashboard}; document.querySelector('#app').innerHTML=`<div class="shell">${nav()}${pages[state.route]()}${footer()}</div>`; bind(); if(state.route==='calculators') calculate(); }
function bind() {
  document.querySelectorAll('[data-route]').forEach(el=>el.onclick=()=>navigate(el.dataset.route));
  document.querySelectorAll('[data-firm]').forEach(el=>el.onclick=()=>navigate('profile',el.dataset.firm));
  document.querySelectorAll('[data-calc]').forEach(el=>el.onclick=()=>{state.calc=el.dataset.calc;render()});
  const hs=document.querySelector('#hero-search'); if(hs) hs.onsubmit=e=>{e.preventDefault();const q=document.querySelector('#search-input').value.toLowerCase();const f=firms.find(x=>x.name.toLowerCase().includes(q));f?navigate('profile',f.id):toast('No matching firm found')};
  const af=document.querySelector('#add-firm'); if(af) af.onchange=e=>{const i=+e.target.value;if(!state.compare.includes(i)){state.compare.push(i);if(state.compare.length>4)state.compare.shift();render();}};
  document.querySelectorAll('.calc-input').forEach(el=>el.oninput=calculate);
  const add=document.querySelector('#add-account'); if(add) add.onclick=()=>{document.body.insertAdjacentHTML('beforeend',modal());bindModal()};
  document.querySelectorAll('.delete-account').forEach(el=>el.onclick=async()=>{try{await api.delete(`/api/dashboard/accounts/${el.dataset.id}`);}catch{}state.accounts=state.accounts.filter(a=>a.id!=el.dataset.id);saveAccounts();render();});
  document.querySelectorAll('.copy-code').forEach(el=>el.onclick=async()=>{try{await navigator.clipboard.writeText(el.dataset.code); await api.post('/api/affiliate-clicks',{firmId:el.dataset.firmId,dealId:el.dataset.dealId,redirectUrl:el.dataset.url,source:'discount-code'}); toast('Code copied and affiliate click tracked');}catch{toast(`Code copied: ${el.dataset.code}`);}});
  document.querySelectorAll('.enter-giveaway').forEach(el=>el.onclick=()=>{document.body.insertAdjacentHTML('beforeend',giveawayModal(el.dataset.giveawayId));bindGiveawayModal();});
  const aff=document.querySelector('.affiliate'); if(aff) aff.onclick=async()=>{const firm=firms.find(x=>x.id===state.selectedFirm); try{await api.post('/api/affiliate-clicks',{firmId:firm.id,source:'firm-profile'}); toast('Affiliate click tracked');}catch{toast('Affiliate destination ready to connect');}};
  const save=document.querySelector('.save-firm'); if(save) save.onclick=()=>{save.textContent='♥ Saved';toast('Firm saved to your watchlist')};
  document.querySelectorAll('.tabs .tab').forEach((el,i)=>el.onclick=()=>{document.querySelectorAll('.tabs .tab').forEach(x=>x.classList.remove('active'));el.classList.add('active');if(i>0)toast(i===1?'Showing latest trader reviews':'Payout proof is shown in the right panel');});
}
function calculate(){ const v=id=>+(document.querySelector('#'+id)?.value||0); let label,value,note;if(state.calc==='lot'){const risk=v('balance')*v('risk')/100;value=(risk/(v('stop')*v('pip')||1)).toFixed(2)+' lots';label='Recommended position size';note=`This risks $${risk.toLocaleString()} if the stop loss is hit.`;}else if(state.calc==='draw'){const used=v('balance')-v('current'), max=v('balance')*v('limit')/100, left=max-used;value='$'+Math.max(0,left).toLocaleString();label='Drawdown remaining';note=`You have used $${used.toLocaleString()} of a $${max.toLocaleString()} maximum.`;}else{const total=v('balance')*v('target')/100, remaining=total-v('currentProfit'),daily=remaining/(v('days')||1);value='$'+Math.max(0,daily).toLocaleString(undefined,{maximumFractionDigits:0})+'/day';label='Required daily average';note=`$${Math.max(0,remaining).toLocaleString()} remains to reach the $${total.toLocaleString()} target.`;}document.querySelector('#result-label').textContent=label;document.querySelector('#result-value').textContent=value;document.querySelector('#result-note').textContent=note;}
function bindModal(){document.querySelector('.close-modal').onclick=()=>document.querySelector('.modal-backdrop').remove();document.querySelector('.modal-backdrop').onclick=e=>{if(e.target.classList.contains('modal-backdrop'))e.target.remove()};document.querySelector('#account-form').onsubmit=async e=>{e.preventDefault();const d=new FormData(e.target), target=+d.get('target');const account={id:Date.now(),firm:d.get('firm'),account:d.get('size')+' account',type:d.get('type'),progress:0,target:'$'+target.toLocaleString(),current:'$0'};try{const saved=await api.post('/api/dashboard/accounts',account);state.accounts.push(saved);}catch{state.accounts.push(account);}saveAccounts();document.querySelector('.modal-backdrop').remove();render();toast('Account added to your dashboard');};}
function bindGiveawayModal(){document.querySelector('.close-modal').onclick=()=>document.querySelector('.modal-backdrop').remove();document.querySelector('.modal-backdrop').onclick=e=>{if(e.target.classList.contains('modal-backdrop'))e.target.remove()};document.querySelector('#giveaway-form').onsubmit=async e=>{e.preventDefault();const d=new FormData(e.target);try{const result=await api.post('/api/giveaway-entries',{giveawayId:d.get('giveawayId'),name:d.get('name'),email:d.get('email')});const item=giveaways.find(g=>g.id===d.get('giveawayId'));if(item) item.entries=result.giveaway.entries;document.querySelector('.modal-backdrop').remove();render();toast('Giveaway entry submitted');}catch{toast('Backend needed to submit giveaway entries');}};}
function saveAccounts(){localStorage.setItem('fundscope-accounts',JSON.stringify(state.accounts));}
window.addEventListener('popstate',render);
async function loadBackendData(){
  try{
    const data=await api.get('/api/bootstrap');
    firms=data.firms?.length?data.firms:firms;
    reviews=data.reviews?.length?data.reviews:reviews;
    discountCodes=data.discountCodes || [];
    giveaways=data.giveaways || [];
    payoutProofs=data.payoutProofs || [];
    state.accounts=data.dashboardAccounts?.length?data.dashboardAccounts:state.accounts;
    saveAccounts();
  }catch{
    try{
      const data=await api.get('data/db.json');
      firms=data.firms?.length?data.firms:firms;
      reviews=data.reviews?.length?data.reviews:reviews;
      discountCodes=data.discountCodes || [];
      giveaways=data.giveaways || [];
      payoutProofs=data.payoutProofs || [];
      state.accounts=data.dashboardAccounts?.length?data.dashboardAccounts:state.accounts;
      saveAccounts();
    }catch{
      discountCodes = [
        {id:'demo-deal',firmId:'ftmo',firm:'FTMO',code:'FUNDSCOPE10',label:'Demo 10% discount code',expiresAt:'2026-07-31',affiliateUrl:'#'}
      ];
      giveaways = [
        {id:'demo-giveaway',firmId:'ftmo',firm:'FTMO',title:'Demo $100k Challenge Giveaway',prize:'$100,000 challenge account',endsAt:'2026-07-20',entries:1284}
      ];
    }
  }
  render();
}
loadBackendData();

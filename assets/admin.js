/* 管理後台 admin.html：Firebase Auth 登入 + Firestore 讀寫。安全性靠 firestore.rules，這裡只是介面。 */
import { firebaseConfig, SDK, useEmulator } from './firebase-config.js';
import * as SEED from './cms-seed.js';
const [{ initializeApp }, A, F] = await Promise.all([import(SDK + 'firebase-app.js'), import(SDK + 'firebase-auth.js'), import(SDK + 'firebase-firestore.js')]);
const cfg = useEmulator ? { apiKey: 'demo-key', projectId: 'demo-hua-guide', appId: 'demo', authDomain: 'demo-hua-guide.firebaseapp.com' } : firebaseConfig;
const app = initializeApp(cfg), auth = A.getAuth(app), db = F.getFirestore(app);
if (useEmulator) { A.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true }); F.connectFirestoreEmulator(db, '127.0.0.1', 8080); }
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&"<>']/g, c => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;', "'": '&#39;' }[c]));
const getP = (o, p) => p.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);
const setP = (o, p, v) => { const ks = p.split('.'); let a = o; ks.slice(0, -1).forEach(k => { if (typeof a[k] !== 'object' || a[k] === null) a[k] = {}; a = a[k]; }); a[ks.at(-1)] = v; };
const fmtT = t => (t && t.toDate ? t.toDate().toLocaleString('zh-TW', { timeZone: 'Africa/Johannesburg', hour12: false }) : '');
const IMGS = ['p-cargo', 'p-dumplings', 'p-gift', 'p-health', 'p-jipai', 'p-megaphone', 'p-night', 'p-shop', 'p-tea'].map(n => 'assets/img/' + n + '.webp');
$('#imgs').innerHTML = IMGS.map(i => `<option value="${i}">`).join('');
let me = null, role = null;

/* ---------- 欄位定義 ---------- */
const GROUPS = [['food', '餐飲 Food'], ['services', '生活服務 Services'], ['other', '其他 Other']];
const SUBS = [['', '（無細分類）'], ['health', '醫療健康'], ['beauty', '美容美髮'], ['dining', '餐飲美食'], ['groceries', '超市購物'], ['legal', '法律簽證'], ['finance', '財稅金融'], ['home', '房屋居家'], ['education', '教育翻譯'], ['trade', '交通貿易'], ['travel', '休閒旅遊'], ['community', '社團宗教']];
const TAGS = { featured: '精選', affiliate: '經營者關係企業', sample: '範例（虛構必勾）', ad: '廣告', event: '活動' };
const COLL = {
  merchants: { label: '商家', pub: 'published', cols: [['name.tw', '名稱'], ['group', '大類'], ['sub', '細分類'], ['featuredHome', '首頁精選'], ['order', '順序']], fields: [
    ['name', '商家名稱', 'bi'], ['desc', '簡介（目錄頁）', 'bitext'], ['homeDesc', '首頁精選用簡介（可空白，空白就用上面的）', 'bitext'], ['meta', '分類／地址小字', 'bi'],
    ['group', '大類', 'select', GROUPS], ['sub', '細分類（首頁分類格子）', 'select', SUBS], ['image', '圖片網址', 'image'], ['homeImage', '首頁精選圖片（可空白）', 'image'], ['imageAi', '圖片是 AI 生成示意', 'bool'],
    ['tags', '標籤', 'tags', ['featured', 'affiliate', 'sample']], ['website', '官網網址', 'text'], ['phone', '電話', 'text'], ['whatsapp', 'WhatsApp 號碼', 'text'], ['note', '提醒小字', 'bi'],
    ['order', '排序（小的在前）', 'number'], ['published', '已發布（公開顯示）', 'bool'], ['featuredHome', '放在首頁「精選商家」', 'bool']] },
  slides: { label: '首頁輪播', pub: 'enabled', cols: [['title.tw', '標題'], ['start', '開始'], ['end', '結束'], ['order', '順序']], fields: [
    ['title', '標題（換行直接按 Enter）', 'bitext'], ['text', '說明', 'bi'], ['button', '按鈕文字', 'bi'], ['link', '按鈕連結（站內頁如 deals.html，或 https://…）', 'text'], ['external', '連結開新分頁', 'bool'],
    ['image', '圖片網址', 'image'], ['width', '圖片寬', 'number'], ['height', '圖片高', 'number'], ['tags', '標籤', 'tags', ['featured', 'ad', 'event', 'affiliate', 'sample']], ['biz', '統計用商家名（可空白）', 'text'],
    ['start', '開始日期（空白＝立即）', 'date'], ['end', '結束日期（空白＝不結束）', 'date'], ['order', '排序', 'number'], ['enabled', '啟用', 'bool']] },
  deals: { label: '優惠', pub: 'published', cols: [['biz.tw', '商家'], ['offer.tw', '優惠'], ['valid.tw', '期限'], ['order', '順序']], fields: [
    ['biz', '商家名稱', 'bi'], ['desc', '商家簡介', 'bitext'], ['offer', '優惠內容', 'bi'], ['valid', '期限', 'bi'], ['claim', '領取方式', 'bi'], ['meta', '分類／地址小字', 'bi'],
    ['image', '圖片網址', 'image'], ['imageAi', '圖片是 AI 生成示意', 'bool'], ['tags', '標籤', 'tags', ['featured', 'affiliate', 'sample']], ['website', '官網網址', 'text'], ['note', '提醒小字', 'bi'],
    ['order', '排序', 'number'], ['published', '已發布', 'bool']] },
  articles: { label: '文章／生活資訊', pub: 'published', cols: [['title.tw', '標題'], ['page', '放在'], ['order', '順序']], fields: [
    ['title', '標題', 'bi'], ['body', '內文（空一行＝新段落）', 'bitext'], ['link', '相關連結（可空白）', 'text'],
    ['page', '放在哪一頁', 'select', [['life', '生活資訊頁（卡片）'], ['guides', '生活指南列表（獨立文章頁）']]], ['order', '排序', 'number'], ['published', '已發布', 'bool']] }
};
const FEATURES = [['carousel', '首頁輪播'], ['deals', '優惠頁與優惠連結'], ['giveaway', '抽獎頁與連結'], ['life', '生活資訊頁'], ['guides', '生活指南'], ['form_business', '表單：免費登錄商家'], ['form_advertise', '表單：廣告洽詢'], ['form_giveaway', '表單：抽獎報名'],
  ['adslots', '廣告版位方塊'], ['share', 'WhatsApp 分享區'], ['mapview', '商家地圖切換'], ['water', '首頁「今日停水停電」卡片'], ['board', '留言板（尚未建置，先保留開關）'],
  ...SUBS.slice(1).map(([k, l]) => ['cat_' + k, '首頁分類格子：' + l])];
const SITE = {
  settings: { label: '網站設定與開關', fields: [['siteName', '網站名稱', 'bi'], ['contactWhatsapp', '聯絡 WhatsApp 號碼（顯示在頁尾，空白不顯示）', 'text'], ['waGroup', 'WhatsApp 群組連結', 'text'], ['waChannel', 'WhatsApp 頻道連結', 'text'],
    ['announcement.on', '顯示公告橫條', 'bool'], ['announcement', '公告內容', 'bi'], ['announcement.link', '公告連結（可空白）', 'text'],
    ['maintenance.on', '顯示維護中橫條', 'bool'], ['maintenance', '維護訊息', 'bi'], ['features', '功能開關', 'features'], ['hidden', '隱藏個別區塊', 'blocks']] },
  advertise: { label: '廣告方案與價格', fields: [['intro', '頁首說明', 'bitext'], ['rows', '廣告位（表格）', 'list', [['name', '版位名稱', 'bi'], ['spec', '規格', 'text'], ['price', '價格（空白＝待定）', 'text']]],
    ['plans', '方案卡片', 'list', [['name', '方案名稱', 'bi'], ['desc', '內容', 'bi'], ['price', '價格（空白＝待定）', 'text']]]] },
  giveaway: { label: '抽獎內容', fields: [['banner', '頂部提示（空白＝不顯示）', 'bi'], ['title', '標題', 'bi'], ['rules', '規則', 'list', [['', '規則', 'bitext']]]] }
};

/* ---------- 表單產生器 ---------- */
let blockCache = null;
async function scanBlocks() {
  if (blockCache) return blockCache;
  const pages = ['index.html', 'life.html', 'more.html', 'guides/index.html'], out = [];
  for (const p of pages) { try { const h = await (await fetch(p)).text(); const d = new DOMParser().parseFromString(h, 'text/html');
    d.querySelectorAll('[data-block]').forEach(e => { const zh = [...e.querySelectorAll('[lang^=zh]')].map(x => x.textContent).join(' ') || e.textContent; out.push([e.dataset.block, p + '：' + zh.replace(/\s+/g, ' ').trim().slice(0, 50)]); }); } catch (_) {} }
  return (blockCache = out);
}
function fieldHtml(path, label, type, opt, val) {
  const id = 'f_' + path.replace(/\W/g, '_') + '_' + Math.random().toString(36).slice(2, 6);
  const L = `<span class="ad-lbl">${esc(label)}</span>`;
  switch (type) {
    case 'bi': return `<div class="ad-field">${L}<div class="ad-grid2"><label>繁中<input data-p="${path}.tw" value="${esc(val?.tw)}"></label><label>English（空白就顯示中文）<input data-p="${path}.en" value="${esc(val?.en)}"></label></div></div>`;
    case 'bitext': return `<div class="ad-field">${L}<div class="ad-grid2"><label>繁中<textarea data-p="${path}.tw">${esc(val?.tw)}</textarea></label><label>English<textarea data-p="${path}.en">${esc(val?.en)}</textarea></label></div></div>`;
    case 'text': return `<div class="ad-field"><label for="${id}">${esc(label)}</label><input id="${id}" data-p="${path}" value="${esc(val)}"></div>`;
    case 'number': return `<div class="ad-field"><label for="${id}">${esc(label)}</label><input id="${id}" type="number" data-p="${path}" data-t="num" value="${esc(val ?? 0)}"></div>`;
    case 'date': return `<div class="ad-field"><label for="${id}">${esc(label)}</label><input id="${id}" type="date" data-p="${path}" value="${esc(val)}"></div>`;
    case 'bool': return `<div class="ad-field"><label class="ad-check"><input type="checkbox" data-p="${path}" data-t="bool" ${val ? 'checked' : ''}> ${esc(label)}</label></div>`;
    case 'select': return `<div class="ad-field"><label for="${id}">${esc(label)}</label><select id="${id}" data-p="${path}">${opt.map(([v, l]) => `<option value="${esc(v)}" ${v === (val ?? '') ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>`;
    case 'tags': return `<div class="ad-field">${L}${opt.map(t => `<label class="ad-check"><input type="checkbox" data-tag="${path}" value="${t}" ${(val || []).includes(t) ? 'checked' : ''}> ${esc(TAGS[t])}</label>`).join('')}</div>`;
    case 'image': return `<div class="ad-field"><label for="${id}">${esc(label)}</label><input id="${id}" list="imgs" data-p="${path}" data-img value="${esc(val)}" placeholder="assets/img/… 或 https://…"><img class="ad-img" alt="" src="${esc(val || '')}" ${val ? '' : 'hidden'}><span class="ad-help">可選網站現有圖片，或貼外部圖片網址（Firebase Storage 尚未開通，暫不能直接上傳）。</span></div>`;
    case 'features': return `<fieldset><legend>${esc(label)}</legend>${FEATURES.map(([k, l]) => `<label class="ad-check"><input type="checkbox" data-p="${path}.${k}" data-t="bool" ${val?.[k] !== false ? 'checked' : ''}> ${esc(l)}</label>`).join('<br>')}</fieldset>`;
    case 'blocks': return `<fieldset data-blocks="${path}"><legend>${esc(label)}（勾選＝隱藏）</legend><p class="ad-help">載入中…</p></fieldset>`;
    case 'list': return `<fieldset data-list="${path}"><legend>${esc(label)}</legend><div class="items">${(val || []).map(v => listItem(opt, v)).join('')}</div><button type="button" data-add>＋ 新增一筆</button></fieldset>`;
  }
}
function listItem(sub, v) {
  return `<div class="ad-list-item">${sub.map(([k, l, t, o]) => fieldHtml(k ? '@.' + k : '@', l, t, o, k ? v?.[k] : v)).join('')}<div class="ad-row"><button type="button" data-up>↑</button><button type="button" data-down>↓</button><button type="button" class="danger" data-del>刪除這筆</button></div></div>`;
}
function wire(root, fields, data) {
  root.addEventListener('input', e => { if (e.target.matches('[data-img]')) { const im = e.target.parentElement.querySelector('img'); im.src = e.target.value; im.hidden = !e.target.value; } });
  root.addEventListener('click', e => {
    const fs = e.target.closest('[data-list]'); if (!fs) return; const it = e.target.closest('.ad-list-item');
    if (e.target.matches('[data-add]')) { const f = fields.find(x => x[0] === fs.dataset.list); fs.querySelector('.items').insertAdjacentHTML('beforeend', listItem(f[3], f[3][0][0] ? {} : { tw: '', en: '' })); }
    if (e.target.matches('[data-del]')) it.remove();
    if (e.target.matches('[data-up]') && it.previousElementSibling) it.parentNode.insertBefore(it, it.previousElementSibling);
    if (e.target.matches('[data-down]') && it.nextElementSibling) it.parentNode.insertBefore(it.nextElementSibling, it);
  });
  $$('[data-blocks]', root).forEach(async fs => { const bl = await scanBlocks(); const hid = getP(data, fs.dataset.blocks) || [];
    fs.innerHTML = `<legend>隱藏個別區塊（勾選＝隱藏）</legend>` + (bl.length ? bl.map(([id, t]) => `<label class="ad-check"><input type="checkbox" data-block value="${esc(id)}" ${hid.includes(id) ? 'checked' : ''}> ${esc(t)}</label>`).join('<br>') : '<p class="ad-help">讀不到頁面區塊</p>'); });
}
function readValue(el) { return el.dataset.t === 'bool' ? el.checked : el.dataset.t === 'num' ? Number(el.value || 0) : el.value.trim(); }
function collect(root) {
  const out = {};
  $$('[data-p]', root).filter(e => !e.closest('[data-list]')).forEach(e => setP(out, e.dataset.p, readValue(e)));
  const tags = {}; $$('[data-tag]', root).forEach(e => { (tags[e.dataset.tag] ||= []); if (e.checked) tags[e.dataset.tag].push(e.value); }); Object.entries(tags).forEach(([k, v]) => setP(out, k, v));
  $$('[data-blocks]', root).forEach(fs => { if (fs.querySelector('[data-block]')) setP(out, fs.dataset.blocks, $$('[data-block]:checked', fs).map(e => e.value)); });
  $$('[data-list]', root).forEach(fs => setP(out, fs.dataset.list, $$('.ad-list-item', fs).map(it => { const o = {}; $$('[data-p]', it).forEach(e => { const p = e.dataset.p.replace(/^@\.?/, ''); if (p) setP(o, p, readValue(e)); else Object.assign(o, readValue(e)); }); return o.__v ?? o; })));
  return out;
}
const audit = () => ({ updatedAt: F.serverTimestamp(), updatedBy: me.uid, updatedByEmail: me.email || '' });

/* ---------- 對話框 ---------- */
function openDialog(title, html, onSave, setup) {
  const d = $('#dlg'); $('#dlg-title').textContent = title; $('#dlg-body').innerHTML = html; $('#dlg-msg').textContent = '';
  if (setup) setup($('#dlg-body'));
  const form = $('#dlg-form');
  form.onsubmit = async e => { e.preventDefault(); $('#dlg-save').disabled = true; try { await onSave($('#dlg-body')); d.close(); } catch (err) { console.error(err); $('#dlg-msg').textContent = '儲存失敗：' + (err.code || err.message); } finally { $('#dlg-save').disabled = false; } };
  $('#dlg-cancel').onclick = () => d.close(); d.showModal();
}

/* ---------- 內容集合（商家／輪播／優惠／文章） ---------- */
async function viewColl(name) {
  const C = COLL[name], v = $('#view');
  v.innerHTML = `<h1>${C.label}</h1><div class="ad-row"><button class="primary" id="add">＋ 新增${C.label}</button><span class="ad-help">灰色列＝未公開。公開網站只讀得到已公開的資料。</span></div><div id="tbl">載入中…</div>`;
  $('#add').onclick = () => edit(name, null, {});
  const snap = await F.getDocs(F.collection(db, name));
  const rows = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order || 0) - (b.order || 0));
  $('#tbl').innerHTML = rows.length ? `<table><thead><tr>${C.cols.map(c => `<th>${c[1]}</th>`).join('')}<th>公開</th><th>最後修改</th><th></th></tr></thead><tbody>${rows.map(r => `<tr class="${r[C.pub] ? '' : 'off'}" data-id="${esc(r.id)}">${C.cols.map(c => { const x = getP(r, c[0]); return `<td>${typeof x === 'boolean' ? (x ? '✓' : '') : esc(x)}</td>`; }).join('')}<td><button data-toggle>${r[C.pub] ? '公開中 → 下架' : '未公開 → 發布'}</button></td><td class="ad-help">${esc(fmtT(r.updatedAt))}<br>${esc(r.updatedByEmail || '')}</td><td><button data-edit>編輯</button> <button data-copy>複製</button> <button class="danger" data-del>刪除</button></td></tr>`).join('')}</tbody></table>` : '<p>還沒有資料。可以先到「網站設定」匯入初始資料，或按「新增」。</p>';
  $('#tbl').onclick = async e => {
    const tr = e.target.closest('tr[data-id]'); if (!tr) return; const r = rows.find(x => x.id === tr.dataset.id);
    if (e.target.matches('[data-edit]')) edit(name, r.id, r);
    if (e.target.matches('[data-copy]')) { const { id, updatedAt, updatedBy, updatedByEmail, ...rest } = r; edit(name, null, { ...rest, [C.pub]: false }); }
    if (e.target.matches('[data-toggle]')) { await F.updateDoc(F.doc(db, name, r.id), { [C.pub]: !r[C.pub], ...audit() }); viewColl(name); }
    if (e.target.matches('[data-del]') && confirm(`確定刪除「${getP(r, C.cols[0][0]) || r.id}」？刪除後無法復原。`)) { await F.deleteDoc(F.doc(db, name, r.id)); viewColl(name); }
  };
}
function edit(name, id, data) {
  const C = COLL[name];
  const html = (id ? `<p class="ad-help">ID：${esc(id)}</p>` : `<div class="ad-field"><label>ID（英文小寫、數字、- ；空白自動產生）<input data-newid pattern="[a-z0-9-]*"></label></div>`) + C.fields.map(([p, l, t, o]) => fieldHtml(p, l, t, o, getP(data, p))).join('');
  openDialog((id ? '編輯' : '新增') + C.label, html, async body => {
    const val = { ...collect(body), ...audit() };
    if (name === 'merchants' && !val.name?.tw) throw new Error('請填商家名稱（繁中）');
    const nid = id || $('[data-newid]', body).value.trim();
    if (nid && !/^[a-z0-9-]{1,60}$/.test(nid)) throw new Error('ID 格式不對');
    if (id) await F.setDoc(F.doc(db, name, id), val, { merge: true });
    else if (nid) { if ((await F.getDoc(F.doc(db, name, nid))).exists()) throw new Error('這個 ID 已經有了'); await F.setDoc(F.doc(db, name, nid), val); }
    else await F.addDoc(F.collection(db, name), val);
    viewColl(name);
  }, b => wire(b, C.fields, data));
}

/* ---------- 網站設定 / 廣告 / 抽獎 ---------- */
async function viewSite(key) {
  const S = SITE[key], v = $('#view'); const snap = await F.getDoc(F.doc(db, 'site', key)); const data = snap.exists() ? snap.data() : (SEED.site[key] || {});
  v.innerHTML = `<h1>${S.label}</h1>${snap.exists() ? `<p class="ad-help">最後修改：${esc(fmtT(data.updatedAt))} ${esc(data.updatedByEmail || '')}</p>` : '<p class="ad-msg">尚未存進資料庫，下面先帶入初始內容；按儲存或匯入初始資料後才會生效。</p>'}
   <form id="sf" class="ad-card">${S.fields.map(([p, l, t, o]) => fieldHtml(p, l, t, o, getP(data, p))).join('')}<div class="ad-row"><button type="submit">儲存</button><span id="smsg" class="ad-msg" role="status"></span></div></form>
   ${key === 'settings' ? seedBox() : ''}`;
  wire($('#sf'), S.fields, data);
  $('#sf').onsubmit = async e => { e.preventDefault(); const val = collect($('#sf')); if (key === 'settings') val.seeded = data.seeded === true;
    try { await F.setDoc(F.doc(db, 'site', key), { ...val, ...audit() }, { merge: true }); $('#smsg').className = 'ad-msg ok'; $('#smsg').textContent = '已儲存，前台重新整理就會看到。'; } catch (err) { $('#smsg').className = 'ad-msg'; $('#smsg').textContent = '儲存失敗：' + (err.code || err.message); } };
  if (key === 'settings') $('#seed').onclick = runSeed;
}
function seedBox() { return `<section class="ad-card" style="margin-top:16px"><h2>匯入初始資料</h2><p class="ad-help">把目前網站上寫死的商家、輪播、優惠、廣告方案、抽獎規則和網站設定寫進資料庫，之後前台就改讀資料庫。只需要做一次；再按一次會用原始內容蓋掉同 ID 的資料（你新增的其他資料不受影響）。匯入前，前台一律顯示原本寫死的內容。</p><button id="seed" class="primary">匯入初始資料</button> <span id="seedmsg" class="ad-msg" role="status"></span></section>`; }
async function runSeed() {
  if (!confirm('匯入初始資料？同 ID 的商家／輪播／優惠會被原始內容覆蓋。')) return;
  const b = F.writeBatch(db), a = audit();
  for (const n of ['merchants', 'slides', 'deals']) SEED[n].forEach(({ id, ...d }) => b.set(F.doc(db, n, id), { ...d, ...a }));
  for (const [k, d] of Object.entries(SEED.site)) b.set(F.doc(db, 'site', k), { ...d, ...a });
  try { await b.commit(); $('#seedmsg').className = 'ad-msg ok'; $('#seedmsg').textContent = '匯入完成。'; } catch (err) { $('#seedmsg').textContent = '匯入失敗：' + (err.code || err.message); }
}

/* ---------- 送件審核 ---------- */
const SUB = {
  business: { label: '商家登錄', coll: 'submissions_business', show: [['bname', '名稱'], ['category', '分類'], ['address', '地址'], ['phone', '電話'], ['whatsapp', 'WhatsApp'], ['hours', '營業時間'], ['desc', '簡介']] },
  advertise: { label: '廣告洽詢', coll: 'submissions_advertise', show: [['name', '姓名'], ['business', '商家'], ['email', 'Email'], ['phone', '電話'], ['plan', '方案'], ['message', '訊息']] },
  giveaway: { label: '抽獎報名', coll: 'submissions_giveaway', show: [['name', '名字'], ['whatsapp', 'WhatsApp'], ['marketing', '願收行銷訊息']] }
};
const CATMAP = { food: ['food', 'dining', '餐飲', 'Food'], grocery: ['food', 'groceries', '超市', 'Groceries'], services: ['services', '', '生活服務', 'Services'], health: ['services', 'health', '醫療健康', 'Health'], other: ['other', '', '其他', 'Other'] };
let subKind = 'business', subStatus = 'pending';
async function viewSubs() {
  const S = SUB[subKind], v = $('#view');
  v.innerHTML = `<h1>送件審核</h1><div class="ad-row">${Object.entries(SUB).map(([k, s]) => `<button data-k="${k}" ${k === subKind ? 'class="primary"' : ''}>${s.label}</button>`).join('')}
   <select id="st" style="width:auto">${[['pending', '待審核'], ['approved', '已通過'], ['rejected', '已拒絕'], ['all', '全部']].map(([k, l]) => `<option value="${k}" ${k === subStatus ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
   ${subKind === 'business' ? '<p class="ad-help">按「通過並刊登」會自動建立一筆已發布的商家，馬上出現在商家目錄；之後可到「商家」補英文、圖片。</p>' : ''}<div id="subs">載入中…</div>`;
  $$('[data-k]', v).forEach(b => b.onclick = () => { subKind = b.dataset.k; viewSubs(); });
  $('#st').onchange = e => { subStatus = e.target.value; viewSubs(); };
  const q = subStatus === 'all' ? F.collection(db, S.coll) : F.query(F.collection(db, S.coll), F.where('status', '==', subStatus));
  const rows = (await F.getDocs(q)).docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  const pill = s => `<span class="pill ${s === 'approved' ? 'ok' : s === 'rejected' ? 'no' : 'wait'}">${{ approved: '已通過', rejected: '已拒絕', pending: '待審核' }[s] || s}</span>`;
  $('#subs').innerHTML = rows.length ? rows.map(r => `<div class="ad-card" style="margin:8px 0" data-id="${esc(r.id)}"><div class="ad-row">${pill(r.status)} <span class="ad-help">${esc(fmtT(r.createdAt))} · 語言 ${esc(r.lang)}${r.merchantId ? ' · 商家 ID ' + esc(r.merchantId) : ''}</span></div>
     <div class="ad-sub">${S.show.map(([k, l]) => `<div class="ad-kv"><b>${l}：</b>${esc(typeof r[k] === 'boolean' ? (r[k] ? '是' : '否') : r[k])}</div>`).join('')}</div>
     <div class="ad-row"><input data-note placeholder="備註（只有管理員看得到）" value="${esc(r.note)}" style="max-width:420px"><button data-act="note">存備註</button>
     ${subKind === 'business' ? '<button class="primary" data-act="approve">通過並刊登</button>' : '<button class="primary" data-act="approve">標為已處理</button>'}<button data-act="reject">拒絕</button><button class="danger" data-act="delete">刪除</button></div></div>`).join('') : '<p>沒有資料。</p>';
  $('#subs').onclick = async e => {
    const act = e.target.dataset.act; if (!act) return; const card = e.target.closest('[data-id]'), r = rows.find(x => x.id === card.dataset.id), ref = F.doc(db, S.coll, r.id);
    const note = $('[data-note]', card).value.trim().slice(0, 500), rv = { note, reviewedAt: F.serverTimestamp(), reviewedBy: me.uid };
    try {
      if (act === 'delete') { if (!confirm('確定刪除這筆送件？無法復原。')) return; await F.deleteDoc(ref); }
      else if (act === 'note') await F.updateDoc(ref, { ...rv, status: r.status });
      else if (act === 'reject') await F.updateDoc(ref, { ...rv, status: 'rejected' });
      else if (act === 'approve' && subKind === 'business') {
        if (r.merchantId && !confirm('這筆已經建立過商家，要再建一筆嗎？')) return;
        const c = CATMAP[r.category] || CATMAP.other, mref = F.doc(F.collection(db, 'merchants')), b = F.writeBatch(db);
        b.set(mref, { name: { tw: r.bname, en: '' }, desc: { tw: r.desc, en: '' }, homeDesc: { tw: '', en: '' }, meta: { tw: c[2] + ' · ' + r.address + ' · ' + r.hours, en: c[3] + ' · ' + r.address + ' · ' + r.hours },
          group: c[0], sub: c[1], image: '', homeImage: '', imageAi: false, tags: [], website: '', phone: r.phone || '', whatsapp: r.whatsapp || '', note: { tw: '', en: '' }, order: 100, published: true, featuredHome: false, sourceSubmission: r.id, ...audit() });
        b.update(ref, { ...rv, status: 'approved', merchantId: mref.id }); await b.commit();
      } else if (act === 'approve') await F.updateDoc(ref, { ...rv, status: 'approved' });
      viewSubs();
    } catch (err) { console.error(err); alert('操作失敗：' + (err.code || err.message)); }
  };
}

/* ---------- 管理員 ---------- */
async function viewAdmins() {
  const v = $('#view');
  v.innerHTML = `<h1>管理員</h1><p class="ad-help">你的 UID：<code>${esc(me.uid)}</code>（${esc(me.email || '')}），角色：${esc(role)}</p>
   <p class="ad-help">新增管理員：對方先在這個頁面登入一次（會看到自己的 UID），把 UID 給你，你在這裡加上。owner 可以管理管理員；editor 只能改內容和審核。這裡不會建立帳號或密碼。</p>
   <form id="af" class="ad-card ad-row"><input name="uid" placeholder="UID" required style="max-width:300px"><input name="email" placeholder="Email（備註用）" style="max-width:240px"><select name="role" style="width:auto"><option value="editor">editor 編輯</option><option value="owner">owner 擁有者</option></select><button type="submit">新增／更新</button><span id="amsg" class="ad-msg"></span></form><div id="al">載入中…</div>`;
  $('#af').onsubmit = async e => { e.preventDefault(); const f = e.target.elements; try { await F.setDoc(F.doc(db, 'admins', f.uid.value.trim()), { email: f.email.value.trim(), role: f.role.value, ...audit() }); viewAdmins(); } catch (err) { $('#amsg').textContent = '失敗：' + (err.code || err.message); } };
  try { const rows = (await F.getDocs(F.collection(db, 'admins'))).docs;
    $('#al').innerHTML = `<table><thead><tr><th>UID</th><th>Email</th><th>角色</th><th></th></tr></thead><tbody>${rows.map(d => `<tr data-id="${esc(d.id)}"><td><code>${esc(d.id)}</code></td><td>${esc(d.data().email)}</td><td>${esc(d.data().role)}</td><td>${d.id === me.uid ? '（你自己）' : '<button class="danger" data-del>移除</button>'}</td></tr>`).join('')}</tbody></table><p class="ad-help">另外，擁有 custom claim admin=true 的帳號一律是 owner（不會列在這裡）。</p>`;
    $('#al').onclick = async e => { if (!e.target.matches('[data-del]')) return; const id = e.target.closest('tr').dataset.id; if (confirm('移除這位管理員？')) { await F.deleteDoc(F.doc(db, 'admins', id)); viewAdmins(); } };
  } catch (err) { $('#al').textContent = '只有 owner 能看管理員名單。'; }
}


/* ---------- 商家統計 ---------- */
const SK = ['views', 'click_whatsapp', 'click_call', 'click_website', 'dwell_ms_total', 'dwell_samples'];
const jd = (d = new Date()) => d.toLocaleDateString('en-CA', { timeZone: 'Africa/Johannesburg' }).replace(/-/g, '');
const ymd = s => s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6);
function rangeStart(r) { const t = jd(), d = new Date(ymd(t) + 'T00:00:00Z');
  if (r === 'week') { d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); return d.toISOString().slice(0, 10).replace(/-/g, ''); }
  if (r === 'month') return t.slice(0, 6) + '01'; return '00000000'; }
function days(a, b) { const out = [], d = new Date(ymd(a) + 'T00:00:00Z'), e = new Date(ymd(b) + 'T00:00:00Z'); while (d <= e && out.length < 400) { out.push(d.toISOString().slice(0, 10).replace(/-/g, '')); d.setUTCDate(d.getUTCDate() + 1); } return out; }
const RL = { week: '本週', month: '本月', all: '全部' };
let statsCache = null;
async function loadStats() {
  const [s, m] = await Promise.all([F.getDocs(F.collection(db, 'stats_daily')), F.getDocs(F.collection(db, 'merchants'))]);
  const names = {}; m.docs.forEach(d => { const n = d.data().name || {}; names[d.id] = n.tw || n.en || d.id; });
  const rows = s.docs.map(d => { const mm = d.id.match(/^(.+)_(\d{8})$/); return mm ? { biz: mm[1], day: mm[2], ...Object.fromEntries(SK.map(k => [k, Number(d.data()[k] || 0)])) } : null; }).filter(Boolean);
  return (statsCache = { rows, names });
}
function aggregate(rows, from) {
  const by = {}; rows.filter(r => r.day >= from).forEach(r => { const o = by[r.biz] || (by[r.biz] = { biz: r.biz, ...Object.fromEntries(SK.map(k => [k, 0])) }); SK.forEach(k => o[k] += r[k]); });
  return Object.values(by).map(o => { const clicks = o.click_whatsapp + o.click_call + o.click_website; return { ...o, clicks, ctr: o.views ? clicks / o.views : 0, dwell: o.dwell_samples ? o.dwell_ms_total / o.dwell_samples / 1000 : 0 }; }).sort((a, b) => b.views - a.views || b.clicks - a.clicks);
}
const pct = x => (x * 100).toFixed(1) + '%', sec = x => x.toFixed(1);
function barSvg(list, names) {
  const top = list.slice(0, 10), W = 640, rh = 26, H = top.length * rh + 24, max = Math.max(1, ...top.map(o => o.views)), L = 170;
  return `<svg class="st-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="曝光排行"><text x="${L}" y="14" font-size="11" fill="#888"><tspan fill="#22d3ee">■</tspan> 曝光　<tspan fill="#f43f5e">■</tspan> 點擊</text>${top.map((o, i) => { const y = 24 + i * rh, w1 = (W - L - 60) * o.views / max, w2 = (W - L - 60) * o.clicks / max;
    return `<text x="${L - 6}" y="${y + 13}" text-anchor="end" font-size="12" fill="currentColor">${esc(String(names[o.biz] || o.biz).slice(0, 14))}</text><rect x="${L}" y="${y}" width="${w1}" height="10" fill="#22d3ee"/><rect x="${L}" y="${y + 11}" width="${w2}" height="8" fill="#f43f5e"/><text x="${L + w1 + 4}" y="${y + 10}" font-size="11" fill="currentColor">${o.views} / ${o.clicks}</text>`; }).join('')}</svg>`;
}
function lineSvg(series) { // series: [{day, views, clicks}]
  const W = 640, H = 220, P = 34, n = series.length, max = Math.max(1, ...series.map(s => Math.max(s.views, s.clicks)));
  const x = i => P + (n < 2 ? (W - 2 * P) / 2 : i * (W - 2 * P) / (n - 1)), y = v => H - P - v * (H - 2 * P) / max;
  const path = k => series.map((s, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(s[k]).toFixed(1)).join(' ');
  const step = Math.max(1, Math.ceil(n / 8));
  return `<svg class="st-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="每日走勢"><line x1="${P}" y1="${H - P}" x2="${W - P}" y2="${H - P}" stroke="#888"/><text x="4" y="${P}" font-size="11" fill="#888">${max}</text><text x="4" y="${H - P}" font-size="11" fill="#888">0</text>
    <path d="${path('views')}" fill="none" stroke="#22d3ee" stroke-width="2"/><path d="${path('clicks')}" fill="none" stroke="#f43f5e" stroke-width="2"/>
    ${series.map((s, i) => `<circle cx="${x(i)}" cy="${y(s.views)}" r="2.5" fill="#22d3ee"><title>${ymd(s.day)} 曝光 ${s.views}</title></circle><circle cx="${x(i)}" cy="${y(s.clicks)}" r="2.5" fill="#f43f5e"><title>${ymd(s.day)} 點擊 ${s.clicks}</title></circle>`).join('')}
    ${series.map((s, i) => i % step ? '' : `<text x="${x(i)}" y="${H - P + 16}" font-size="10" text-anchor="middle" fill="#888">${s.day.slice(4, 6)}/${s.day.slice(6)}</text>`).join('')}<text x="${W - P}" y="14" text-anchor="end" font-size="11" fill="#888"><tspan fill="#22d3ee">━</tspan> 曝光　<tspan fill="#f43f5e">━</tspan> 點擊</text></svg>`;
}
function seriesFor(rows, biz, from) {
  const mine = rows.filter(r => r.biz === biz && r.day >= from), first = from === '00000000' ? (mine.map(r => r.day).sort()[0] || jd()) : from;
  const map = {}; mine.forEach(r => { map[r.day] = r; });
  return days(first, jd()).map(d => { const r = map[d] || {}; return { day: d, views: r.views || 0, clicks: (r.click_whatsapp || 0) + (r.click_call || 0) + (r.click_website || 0) }; });
}
const DWELL_NOTE = '停留時間是估算值：計算商家卡片在訪客畫面上（至少一半可見、分頁在前景）的累積時間，單次最多 60 秒，不代表實際閱讀時間。';
async function viewStats(range = 'month', pick = '') {
  const v = $('#view'); v.innerHTML = '<h1>商家統計</h1><p>載入中…</p>';
  const { rows, names } = statsCache || await loadStats(); const from = rangeStart(range), list = aggregate(rows, from);
  const sel = pick && list.some(o => o.biz === pick) ? pick : (list[0] && list[0].biz) || '';
  v.innerHTML = `<h1>商家統計</h1>
   <div class="ad-row st-bar" role="group" aria-label="期間">${Object.entries(RL).map(([k, l]) => `<button type="button" data-range="${k}" aria-pressed="${k === range}" class="${k === range ? 'primary' : 'ghost'}">${l}</button>`).join('')}
    <button type="button" id="st-reload" class="ghost">重新整理</button><button type="button" id="st-csv">匯出 CSV</button></div>
   <p class="ad-help">期間：${RL[range]}（${range === 'all' ? '全部資料' : ymd(from) + ' 起'}，約堡時間）。曝光＝商家卡片至少一半出現在畫面上（每次開頁每家算一次）；點擊率＝（WhatsApp＋電話＋官網點擊）÷ 曝光。${DWELL_NOTE}</p>
   ${list.length ? `<div class="ad-card st-wrap"><table id="st-table"><thead><tr><th>商家</th><th>曝光</th><th>WhatsApp</th><th>電話</th><th>官網</th><th>點擊合計</th><th>點擊率</th><th>平均停留（秒，估算）</th><th></th></tr></thead><tbody>
    ${list.map(o => `<tr data-biz="${esc(o.biz)}"${o.biz === sel ? ' aria-selected="true"' : ''}><td><button type="button" class="linkish" data-pick>${esc(names[o.biz] || o.biz)}</button></td><td>${o.views}</td><td>${o.click_whatsapp}</td><td>${o.click_call}</td><td>${o.click_website}</td><td>${o.clicks}</td><td>${pct(o.ctr)}</td><td>${sec(o.dwell)}</td><td><button type="button" data-report>匯出月報</button></td></tr>`).join('')}</tbody></table></div>
   <div class="st-grid"><section class="ad-card"><h2>曝光／點擊排行（前 10）</h2>${barSvg(list, names)}</section>
   <section class="ad-card"><h2>每日走勢：${esc(names[sel] || sel)}</h2>${lineSvg(seriesFor(rows, sel, from))}</section></div>`
    : '<p class="ad-card">這段期間還沒有統計資料。網站上線（並部署新的 firestore.rules）後，有人看到商家卡片就會開始累積。</p>'}`;
  v.onclick = e => { const b = e.target.closest('button'); if (!b) return; const tr = b.closest('tr');
    if (b.dataset.range) viewStats(b.dataset.range, sel);
    else if (b.id === 'st-reload') { statsCache = null; viewStats(range, sel); }
    else if (b.id === 'st-csv') csv(list, names, range, from);
    else if (b.hasAttribute('data-pick')) viewStats(range, tr.dataset.biz);
    else if (b.hasAttribute('data-report')) report(tr.dataset.biz, rows, names);
  };
}
function csv(list, names, range, from) {
  const q = s => '"' + String(s).replace(/"/g, '""') + '"';
  const lines = [['商家', '商家ID', '曝光', 'WhatsApp', '電話', '官網', '點擊合計', '點擊率', '平均停留秒(估算)'].map(q).join(',')].concat(list.map(o => [names[o.biz] || o.biz, o.biz, o.views, o.click_whatsapp, o.click_call, o.click_website, o.clicks, pct(o.ctr), sec(o.dwell)].map(q).join(',')));
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })); a.download = `商家統計_${range}_${from === '00000000' ? 'all' : from}_${jd()}.csv`; document.body.appendChild(a); a.click(); a.remove();
}
function report(biz, rows, names) {
  const t = jd(), from = t.slice(0, 6) + '01', o = aggregate(rows.filter(r => r.biz === biz), from)[0] || { views: 0, click_whatsapp: 0, click_call: 0, click_website: 0, clicks: 0, ctr: 0, dwell: 0 };
  const name = names[biz] || biz, w = window.open('', '_blank'); if (!w) { alert('瀏覽器擋住了新視窗，請允許彈出視窗。'); return; }
  w.document.write(`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><title>${esc(name)} 月報 ${t.slice(0, 4)}-${t.slice(4, 6)}</title><style>
   body{font-family:system-ui,"Noto Sans TC",sans-serif;max-width:760px;margin:24px auto;padding:0 16px;color:#111}h1{font-size:22px;margin:0}.sub{color:#555;margin:4px 0 16px}
   .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:16px 0}.kpi{border:1px solid #ddd;border-radius:8px;padding:10px}.kpi b{display:block;font-size:22px}
   table{width:100%;border-collapse:collapse;font-size:14px}td,th{border-bottom:1px solid #eee;padding:6px;text-align:left}.note{font-size:12px;color:#666;margin-top:16px}svg{width:100%;height:auto;color:#111}
   .noprint{margin:12px 0}@media print{.noprint{display:none}body{margin:0}}</style></head><body>
   <div class="noprint"><button onclick="print()">列印／存成 PDF</button></div>
   <h1>${esc(name)}・曝光月報</h1><p class="sub">約堡華人好康網｜${ymd(from)} 至 ${ymd(t)}（約堡時間）</p>
   <div class="kpis"><div class="kpi">曝光<b>${o.views}</b></div><div class="kpi">點擊合計<b>${o.clicks}</b></div><div class="kpi">點擊率<b>${pct(o.ctr)}</b></div><div class="kpi">平均停留（估算）<b>${sec(o.dwell)} 秒</b></div></div>
   <table><tr><th>WhatsApp 點擊</th><th>電話點擊</th><th>官網點擊</th></tr><tr><td>${o.click_whatsapp}</td><td>${o.click_call}</td><td>${o.click_website}</td></tr></table>
   <h2 style="font-size:16px;margin-top:20px">每日走勢</h2>${lineSvg(seriesFor(rows, biz, from))}
   <p class="note">曝光＝商家卡片至少一半出現在訪客畫面上（每次開頁算一次）。點擊率＝點擊合計 ÷ 曝光。${DWELL_NOTE} 統計不含任何訪客個人資料。</p></body></html>`);
  w.document.close();
}

/* ---------- 路由與登入 ---------- */
const TABS = [['subs', '送件審核', viewSubs], ['merchants', '商家', () => viewColl('merchants')], ['slides', '首頁輪播', () => viewColl('slides')], ['deals', '優惠', () => viewColl('deals')], ['articles', '文章／生活資訊', () => viewColl('articles')],
  ['advertise', '廣告方案', () => viewSite('advertise')], ['giveaway', '抽獎內容', () => viewSite('giveaway')], ['stats', '商家統計', () => viewStats()], ['settings', '網站設定與開關', () => viewSite('settings')], ['admins', '管理員', viewAdmins]];
function go(k) { $$('#tabs button').forEach(b => b.setAttribute('aria-current', b.dataset.tab === k)); const t = TABS.find(x => x[0] === k) || TABS[0]; history.replaceState(null, '', '#' + t[0]); t[2]().catch(err => { console.error(err); $('#view').innerHTML = `<p class="ad-msg">讀取失敗：${esc(err.code || err.message)}</p>`; }); }
$('#tabs').innerHTML = TABS.map(([k, l]) => `<button type="button" data-tab="${k}">${l}</button>`).join('') + `<a href="index.html${useEmulator ? '?emu=1' : ''}" target="_blank" rel="noopener" style="margin-left:auto;align-self:center">看網站 ↗</a>`;
$('#tabs').onclick = e => { const b = e.target.closest('[data-tab]'); if (b) go(b.dataset.tab); };
$('#login-form').onsubmit = async e => { e.preventDefault(); const f = e.target.elements; $('#login-msg').textContent = ''; try { await A.signInWithEmailAndPassword(auth, f.email.value.trim(), f.password.value); } catch (err) { $('#login-msg').textContent = '登入失敗：' + (err.code || err.message); } };
$('#google').onclick = async () => { try { await A.signInWithPopup(auth, new A.GoogleAuthProvider()); } catch (err) { $('#login-msg').textContent = '登入失敗：' + (err.code || err.message); } };
$('#signup').onclick = async () => { const f = $('#login-form').elements; $('#login-msg').textContent = ''; if (!f.email.value.trim() || f.password.value.length < 8) { $('#login-msg').textContent = '請先填 Email 和至少 8 個字元的密碼。'; return; } try { await A.createUserWithEmailAndPassword(auth, f.email.value.trim(), f.password.value); } catch (err) { $('#login-msg').textContent = '建立失敗：' + (err.code || err.message); } };
$('#logout').onclick = () => A.signOut(auth);
A.onAuthStateChanged(auth, async u => {
  me = u; role = null; $('#logout').hidden = !u; $('#who').textContent = u ? (u.email || u.uid) : '';
  if (!u) { $('#login').hidden = false; $('#app').hidden = true; return; }
  const tok = await u.getIdTokenResult(true);
  if (tok.claims.admin === true) role = 'owner';
  else { try { const d = await F.getDoc(F.doc(db, 'admins', u.uid)); if (d.exists() && ['owner', 'editor'].includes(d.data().role)) role = d.data().role; } catch (_) {} }
  if (!role) { $('#login').hidden = false; $('#app').hidden = true; $('#login-msg').innerHTML = `這個帳號不是管理員。請把你的 UID 給網站擁有者：<br><code>${esc(u.uid)}</code>`; return; }
  $('#login').hidden = true; $('#app').hidden = false; $('#who').textContent = (u.email || u.uid) + '（' + role + '）';
  $$('#tabs [data-tab=admins]').forEach(b => b.hidden = role !== 'owner');
  go(location.hash.slice(1) || 'subs');
});
window.__admin = { ready: true };

/* ---------- 目錄篩選：大類 chip (food/services/other) + 細分類 ?cat= ---------- */
const DIR_SUBS={health:'services',beauty:'services',dining:'food',groceries:'food',legal:'services',finance:'services',home:'services',education:'other',trade:'services',travel:'other',community:'other'};
const DIR_GROUPS=['food','services','other'];let dirF={t:'all'};
function dirMatch(cat,sub){return dirF.t==='all'||(dirF.t==='group'?cat===dirF.k:sub===dirF.k)}
function applyDir(push){const dir=document.getElementById('dir');if(!dir)return;let n=0;
 dir.querySelectorAll('.biz').forEach(c=>{const ok=dirMatch(c.dataset.cat,c.dataset.sub);c.hidden=!ok;if(ok)n++});
 const g=dirF.t==='all'?'all':dirF.t==='group'?dirF.k:null;
 document.querySelectorAll('.chip[data-filter]').forEach(c=>{const on=c.dataset.filter===g;c.classList.toggle('active',on);c.setAttribute('aria-pressed',on)});
 const bar=document.getElementById('catbar');if(bar){bar.hidden=dirF.t!=='sub';bar.querySelectorAll('.catbar__name').forEach(e=>e.hidden=e.dataset.k!==dirF.k);
  const cc=document.getElementById('catcount');if(cc)cc.textContent='('+n+')'}
 const em=document.getElementById('dir-empty');if(em)em.hidden=n>0;
 if(typeof syncPins==='function')syncPins();
 if(push){const u=new URL(location.href);if(dirF.t==='all')u.searchParams.delete('cat');else u.searchParams.set('cat',dirF.k);history.replaceState(null,'',u)}}
document.querySelectorAll('.chip[data-filter]').forEach(b=>b.addEventListener('click',()=>{const f=b.dataset.filter;dirF=f==='all'?{t:'all'}:{t:'group',k:f};applyDir(true)}));
document.querySelectorAll('#catclear').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();dirF={t:'all'};applyDir(true)}));
{const cq=(new URLSearchParams(location.search).get('cat')||'').toLowerCase();
 if(DIR_SUBS[cq])dirF={t:'sub',k:cq};else if(DIR_GROUPS.includes(cq))dirF={t:'group',k:cq};
 if(document.getElementById('dir')){applyDir(false);if(cq&&dirF.t==='all'){const u=new URL(location.href);u.searchParams.delete('cat');history.replaceState(null,'',u)}}}
const wa=document.getElementById('wa-share');if(wa)wa.href='https://wa.me/?text='+encodeURIComponent(document.title+' '+location.href);
const gw=document.getElementById('gw-form');
if(gw){gw.addEventListener('submit',e=>{e.preventDefault();const errs=[];const st=document.getElementById('gw-status');st.hidden=true;
 const chk=(n,ok,msg)=>{gw.elements[n].classList.toggle('invalid',!ok);if(!ok)errs.push(msg)};
 chk('name',gw.elements.name.value.trim()!=='','請填名字 Name is required');
 chk('whatsapp',/^\+?[0-9 ()-]{9,20}$/.test(gw.elements.whatsapp.value.trim()),'WhatsApp 號碼格式不正確 Invalid WhatsApp number');
 chk('consent',gw.elements.consent.checked,'請勾選個資同意 Please tick the POPIA consent');
 document.getElementById('gw-errors').innerHTML=errs.length?'<ul>'+errs.map(x=>'<li>'+x+'</li>').join('')+'</ul>':'';
 if(!errs.length)sendForm('giveaway',gw,{name:gw.elements.name.value.trim(),whatsapp:gw.elements.whatsapp.value.trim(),consent:true,marketing:gw.elements.marketing.checked},st)});}
/* ---------- 送到 Firebase：forms.js 只在按送出時才載入 ---------- */
function sendForm(kind,form,data,st,file){import(new URL(ASSET+'forms.js',location.href).href).then(m=>m.submit(kind,form,data,st,file)).catch(e=>{console.error(e);st.textContent=window.__lang==='en'?'Could not send – please try again later.':window.__lang==='cn'?'送出失败，请稍后再试。':'送出失敗，請稍後再試。';st.dataset.state='error';st.hidden=false})}
const adf=document.getElementById('ad-form');
if(adf){adf.addEventListener('submit',e=>{e.preventDefault();const errs=[];const st=document.getElementById('form-status');st.hidden=true;const E=adf.elements;
 const chk=(n,ok,msg)=>{E[n].classList.toggle('invalid',!ok);if(!ok)errs.push(msg)};
 chk('name',E.name.value.trim()!=='','請填姓名 Name is required');chk('business',E.business.value.trim()!=='','請填商家名稱 Business name required');
 chk('email',/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(E.email.value.trim()),'Email 格式不正確 Invalid email');
 chk('phone',E.phone.value.trim()===''||/^\+?[0-9 ()-]{7,20}$/.test(E.phone.value.trim()),'電話格式不正確 Invalid phone');
 chk('consent',E.consent.checked,'請勾選個資同意 Please tick the POPIA consent');
 document.getElementById('form-errors').innerHTML=errs.length?'<ul>'+errs.map(x=>'<li>'+x+'</li>').join('')+'</ul>':'';
 if(!errs.length)sendForm('advertise',adf,{name:E.name.value.trim(),business:E.business.value.trim(),email:E.email.value.trim(),phone:E.phone.value.trim(),plan:E.plan.value,message:E.message.value.trim(),consent:true},st)})}
const NP=u=>u.replace(/\/$/,'/index.html');const here=NP(location.pathname);document.querySelectorAll('.bottom-nav a, .site-nav a').forEach(a=>{if(NP(new URL(a.href).pathname)===here)a.setAttribute('aria-current','page')});
const ss=document.getElementById('site-search');
if(ss){ss.addEventListener('input',()=>{const items=[...document.querySelectorAll('main .card, main .list li, main [data-s]')];/* 每次重抓：cms.js 可能已換掉內容 */const q=ss.value.trim().toLowerCase();let n=0;
 items.forEach(el=>{const show=!q||el.textContent.toLowerCase().includes(q);el.hidden=!show;if(show)n++});
 document.getElementById('search-count').textContent=q?(window.__lang==='en'?`${n} result(s)`:`找到 ${n} 筆 · ${n} result(s)`):''})}
const ASSET=(document.querySelector('script[src$="site.js"]').getAttribute('src')).replace(/site\.js$/,'');
/* ---------- 點擊統計 Click tracking ----------
 * track(event, props)：props 只放商家名稱/按鈕種類等非個資欄位，絕不放姓名、電話、IP。
 * 轉接點 Adapter hooks（上線時擇一，待定）：
 *  - Plausible：載入 plausible script 後，在下方 sendRemote 內呼叫 window.plausible(event,{props})
 *  - Cloudflare Web Analytics：只有頁面瀏覽，無自訂事件；需事件時改用 Cloudflare Zaraz 的 zaraz.track(event, props)
 * 原型：只寫入 localStorage（key hg_events），不發任何網路請求。
 * 停用的按鈕（disabled）瀏覽器不會觸發 click，因此不會被記錄。 */
/* 商家統計：有 data-cms-id 的商家卡片點擊 → stats.js（Firestore 匿名計數，無個資）。stats.js 載入前先排隊。 */
window.__hgQ=window.__hgQ||[];function sendRemote(event,props){if(props.id&&/^click_(whatsapp|call|website)$/.test(event))window.__hgQ.push([props.id,event])}
function track(event,props={}){try{const k='hg_events',a=JSON.parse(localStorage.getItem(k)||'[]');a.push({e:event,p:props,t:Date.now()});localStorage.setItem(k,JSON.stringify(a.slice(-1000)))}catch(_){}sendRemote(event,props)}
window.track=track;
document.addEventListener('click',e=>{const el=e.target.closest('[data-track]');if(!el||el.disabled)return;
 const card=el.closest('article');const biz=el.dataset.biz||(card&&card.querySelector('h2,h3')?card.querySelector('h2,h3').textContent.trim():'(未知)');
 const host=el.closest('[data-cms-id]');track('click_'+el.dataset.track,{biz,id:host&&!host.closest('.n-hero')?host.dataset.cmsId:'',kind:el.dataset.track,page:location.pathname.split('/').pop()||'index.html'})});
const stT=document.getElementById('stats-table');
function renderStats(){const ev=JSON.parse(localStorage.getItem('hg_events')||'[]');const kinds=['whatsapp','call','directions','website','share'];const m={};
 ev.forEach(x=>{const b=x.p.biz||'?';m[b]=m[b]||{};m[b][x.p.kind]=(m[b][x.p.kind]||0)+1});
 const tb=stT.querySelector('tbody');tb.innerHTML='';Object.keys(m).forEach(b=>{const tr=document.createElement('tr');const td=t=>{const c=document.createElement('td');c.textContent=t;tr.appendChild(c)};td(b);kinds.forEach(k=>td(m[b][k]||0));tb.appendChild(tr)});
 document.getElementById('stats-empty').hidden=Object.keys(m).length>0}
if(stT){renderStats();document.getElementById('stats-clear').addEventListener('click',()=>{localStorage.removeItem('hg_events');renderStats()})}
/* ---------- 登錄商家表單 ---------- */
const ly=document.getElementById('lyb-form');
if(ly){const pv=document.getElementById('lyb-preview');ly.elements.photo.addEventListener('change',()=>{const f=ly.elements.photo.files[0];if(f&&f.type.startsWith('image/')){const r=new FileReader();r.onload=()=>{pv.src=r.result;pv.hidden=false};r.readAsDataURL(f)}else{pv.hidden=true}});
 ly.addEventListener('submit',e=>{e.preventDefault();const errs=[];const st=document.getElementById('lyb-status');st.hidden=true;const E=ly.elements;
 const chk=(n,ok,msg)=>{E[n].classList.toggle('invalid',!ok);if(!ok)errs.push(msg)};const tel=v=>/^\+?[0-9 ()-]{9,20}$/.test(v);
 chk('bname',E.bname.value.trim()!=='','請填商家名稱 Business name required');chk('category',E.category.value!=='','請選分類 Choose a category');
 chk('address',E.address.value.trim()!=='','請填地址 Address required');chk('phone',tel(E.phone.value.trim()),'電話格式不正確 Invalid phone');
 chk('whatsapp',E.whatsapp.value.trim()===''||tel(E.whatsapp.value.trim()),'WhatsApp 號碼格式不正確 Invalid WhatsApp');
 chk('hours',E.hours.value.trim()!=='','請填營業時間 Hours required');chk('desc',E.desc.value.trim()!=='','請填簡介 Description required');
 chk('consent',E.consent.checked,'請勾選個資書面同意 Please tick the POPIA consent');
 document.getElementById('lyb-errors').innerHTML=errs.length?'<ul>'+errs.map(x=>'<li>'+x+'</li>').join('')+'</ul>':'';
 if(!errs.length)sendForm('business',ly,{bname:E.bname.value.trim(),category:E.category.value,address:E.address.value.trim(),phone:E.phone.value.trim(),whatsapp:E.whatsapp.value.trim(),hours:E.hours.value.trim(),desc:E.desc.value.trim(),consent:true},st,E.photo.files[0])})}
/* ---------- 繁簡切換 (opencc-js, tw→cn, 延遲載入) ---------- */
function loadScript(src){return new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
function loadCss(href){const l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.appendChild(l)}
async function toSimplified(){const t0=performance.now();await loadScript(ASSET+'vendor/opencc-t2cn.js');const t1=performance.now();
 const conv0=OpenCC.Converter({from:'tw',to:'cn'});const KEEP=[['江味斋','江味齋']];/* 品牌名不轉換 brand names kept as-is */const conv=t=>KEEP.reduce((s,[a,b])=>s.split(a).join(b),conv0(t));const CJK=/[\u3400-\u9fff]/;
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentNode.nodeName;return(p==='SCRIPT'||p==='STYLE'||!CJK.test(n.nodeValue))?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
 const nodes=[];while(w.nextNode())nodes.push(w.currentNode);nodes.forEach(n=>{n.nodeValue=conv(n.nodeValue)});
 document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(i=>{if(CJK.test(i.placeholder))i.placeholder=conv(i.placeholder)});
 document.title=conv(document.title);document.documentElement.lang='zh-Hans';document.querySelectorAll('[data-lang]').forEach(b=>{if(b.dataset.lang==='tw')b.textContent='繁'});
 document.querySelectorAll('[lang="zh-Hant-TW"]').forEach(e=>e.lang='zh-Hans');
 const t2=performance.now();window.__zh={loadMs:t1-t0,convertMs:t2-t1,nodes:nodes.length};
 window.__hgConvert=root=>{const w2=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(w2.nextNode()){const n=w2.currentNode;if(CJK.test(n.nodeValue))n.nodeValue=conv(n.nodeValue)}root.querySelectorAll&&root.querySelectorAll('[lang="zh-Hant-TW"]').forEach(e=>e.lang='zh-Hans')};
 }
/* ---------- 三語切換 繁 / 简 / EN ----------
 * localStorage key hg_lang = tw | cn | en（舊 key hg_zh 自動遷移後刪除）。
 * 中文模式隱藏 [lang=en] 英文副標；EN 模式隱藏 [lang^=zh]，並把中英混排的短標籤去掉中文。 */
function getLang(){let l=null;try{l=localStorage.getItem('hg_lang');if(!l){l=localStorage.getItem('hg_zh')==='cn'?'cn':'tw';localStorage.setItem('hg_lang',l)}localStorage.removeItem('hg_zh')}catch(_){}return ['tw','cn','en'].includes(l)?l:'tw'}
const LANG=getLang();window.__lang=LANG;
document.querySelectorAll('.lang-switch [data-lang]').forEach(b=>{b.setAttribute('aria-pressed',b.dataset.lang===LANG);
 b.addEventListener('click',()=>{if(b.dataset.lang===LANG)return;try{localStorage.setItem('hg_lang',b.dataset.lang)}catch(_){}location.reload()})});
const CJK_RUN=/[\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF\u3000-\u303F「」『』（）、，。：；！？…]+/g;
function stripCJK(t){return t.replace(CJK_RUN,' ').replace(/\s*[·\/|]\s*(?=[·\/|]|$)/g,' ').replace(/^\s*[·\/|,:]\s*/,'').replace(/\(\s*\)/g,'').replace(/\s{2,}/g,' ')}
const HAS_CJK=/[\u3400-\u9FFF]/;window.__enGaps=[];
function inZh(n){const e=n.nodeType===1?n:n.parentElement;const z=e&&e.closest('[lang]:not(html):not([data-lang])');return z&&z.getAttribute('lang').startsWith('zh')}
function enNode(n){if(!HAS_CJK.test(n.nodeValue)||inZh(n))return;const p=n.parentElement;if(!p||p.closest('script,style,.lang-switch'))return;
 const out=stripCJK(n.nodeValue);const blk=p.closest('a,li,td,th,p,label,button,h1,h2,h3,h4,option,div,section');if(!/[A-Za-z0-9]/.test(out)&&!(blk&&/[A-Za-z]/.test(stripCJK(blk.textContent))))window.__enGaps.push(n.nodeValue.trim().slice(0,40)+' @'+p.tagName+'.'+p.className);n.nodeValue=/^\s/.test(n.nodeValue)?' '+out.trim()+(/\s$/.test(n.nodeValue)?' ':''):out.trim()+(/\s$/.test(n.nodeValue)?' ':'')}
function enAttrs(root){(root.querySelectorAll?root:document).querySelectorAll('[aria-label],[alt],[placeholder],[title]').forEach(e=>{if(e.closest('.lang-switch'))return;['aria-label','alt','placeholder','title'].forEach(a=>{const v=e.getAttribute(a);if(v&&HAS_CJK.test(v)){const o=stripCJK(v).trim();if(!/[A-Za-z]/.test(o))window.__enGaps.push('attr '+a+': '+v);e.setAttribute(a,o)}})})}
function enTree(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const ns=[];while(w.nextNode())ns.push(w.currentNode);ns.forEach(enNode);if(root.nodeType===1)enAttrs(root)}
if(LANG==='en'){enTree(document.body);enAttrs(document);document.title=stripCJK(document.title).trim();
 const md=document.querySelector('meta[name=description]');if(md)md.content=stripCJK(md.content).trim();
 new MutationObserver(ms=>ms.forEach(m=>{if(m.type==='characterData')enNode(m.target);else m.addedNodes.forEach(n=>{if(n.nodeType===3)enNode(n);else if(n.nodeType===1)enTree(n)})})).observe(document.body,{subtree:true,childList:true,characterData:true})}
/* cms.js 動態插入內容後呼叫 __hgRelang(root)：EN 由 MutationObserver 處理，簡體在這裡轉。 */
window.__hgCnReady=LANG==='cn'?toSimplified():Promise.resolve();
window.__hgRelang=root=>{if(LANG==='cn')window.__hgCnReady.then(()=>window.__hgConvert&&window.__hgConvert(root))};
window.__hgApplyDir=()=>applyDir(false);
/* ---------- 地圖 (Leaflet + OSM, 延遲載入) ---------- */
const mapWrap=document.getElementById('map-wrap');var mapObj=null,PINS=[];
function syncPins(){if(!mapObj)return;PINS.forEach(m=>{const ok=dirMatch(m._hg[0],m._hg[1]);if(ok&&!mapObj.hasLayer(m))m.addTo(mapObj);else if(!ok&&mapObj.hasLayer(m))mapObj.removeLayer(m)})}
const SAMPLE_PINS=[[-26.1076,28.0567,'food','dining','<span lang="zh-Hant-TW">範例川菜館</span><span lang="en">Sample Sichuan Kitchen</span>'],[-26.1450,28.0410,'food','groceries','<span lang="zh-Hant-TW">範例亞洲超市</span><span lang="en">Sample Asian Supermarket</span>'],[-26.1900,28.0300,'services','','<span lang="zh-Hant-TW">範例生活服務</span><span lang="en">Sample services</span>']]; // 範例位置，非真實店址 sample only
async function showMap(){mapWrap.hidden=false;document.getElementById('dir').hidden=true;
 if(!mapObj){loadCss(ASSET+'vendor/leaflet/leaflet.css');await loadScript(ASSET+'vendor/leaflet/leaflet.js');
  mapObj=L.map('map').setView([-26.15,28.04],11);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(mapObj);
  SAMPLE_PINS.forEach(([a,b,c,sb,n])=>{const m=L.marker([a,b]);m._hg=[c,sb];PINS.push(m);m.bindPopup(`${n}<br><b lang="zh-Hant-TW">範例位置，非真實店址</b><br lang="zh-Hant-TW"><span lang="en">Sample location, not a real address</span>`)});syncPins()}
 else mapObj.invalidateSize()}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-view]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)});
 if(b.dataset.view==='map')showMap();else{mapWrap.hidden=true;document.getElementById('dir').hidden=false}}));

/* 商家曝光／點擊統計（stats.js）與 GoatCounter 瀏覽次數（analytics.js），延遲載入 */
document.addEventListener('hg:cms',()=>{if(document.querySelector('.biz[data-cms-id], .n-card--merchant[data-cms-id]'))loadScript(ASSET+'stats.js').catch(()=>{})});
loadScript(ASSET+'analytics.js').catch(()=>{});

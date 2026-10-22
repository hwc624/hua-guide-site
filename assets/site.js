document.querySelectorAll('.chip[data-filter]').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('.chip[data-filter]').forEach(c=>c.classList.toggle('active',c===b));const f=b.dataset.filter;
 document.querySelectorAll('#dir .biz').forEach(c=>{c.hidden=!(f==='all'||c.dataset.cat===f)})}));
const form=document.getElementById('ad-form');
if(form){form.addEventListener('submit',e=>{e.preventDefault();const errs=[];const st=document.getElementById('form-status');st.hidden=true;
 const chk=(n,ok,msg)=>{const el=form.elements[n];el.classList.toggle('invalid',!ok);if(!ok)errs.push(msg)};
 chk('name',form.name.value.trim()!=='','請填姓名 Name is required');
 chk('business',form.business.value.trim()!=='','請填商家名稱 Business is required');
 chk('email',/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim()),'Email 格式不正確 Invalid email');
 chk('phone',form.phone.value.trim()===''||/^[+0-9 ()-]{7,20}$/.test(form.phone.value.trim()),'電話格式不正確 Invalid phone');
 chk('consent',form.consent.checked,'請勾選 POPIA 同意 Please tick the POPIA consent');
 document.getElementById('form-errors').innerHTML=errs.length?'<ul>'+errs.map(x=>'<li>'+x+'</li>').join('')+'</ul>':'';
 if(!errs.length){st.textContent='原型，尚未連線：資料未送出。 Prototype, not connected: nothing was sent.';st.hidden=false}});}
const wa=document.getElementById('wa-share');if(wa)wa.href='https://wa.me/?text='+encodeURIComponent(document.title+' '+location.href);
const gw=document.getElementById('gw-form');
if(gw){gw.addEventListener('submit',e=>{e.preventDefault();const errs=[];const st=document.getElementById('gw-status');st.hidden=true;
 const chk=(n,ok,msg)=>{gw.elements[n].classList.toggle('invalid',!ok);if(!ok)errs.push(msg)};
 chk('name',gw.elements.name.value.trim()!=='','請填名字 Name is required');
 chk('whatsapp',/^\+?[0-9 ()-]{9,20}$/.test(gw.elements.whatsapp.value.trim()),'WhatsApp 號碼格式不正確 Invalid WhatsApp number');
 chk('consent',gw.elements.consent.checked,'請勾選 POPIA 同意 Please tick the POPIA consent');
 document.getElementById('gw-errors').innerHTML=errs.length?'<ul>'+errs.map(x=>'<li>'+x+'</li>').join('')+'</ul>':'';
 if(!errs.length){st.textContent='上線後開放，資料未送出。 Opens at launch – nothing was sent.';st.hidden=false}});}
const here=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.bottom-nav a').forEach(a=>{if(a.getAttribute('href').split('/').pop()===here)a.setAttribute('aria-current','page')});
const cq=new URLSearchParams(location.search).get('cat');if(cq){const c=document.querySelector(`.chip[data-filter="${cq}"]`);if(c)c.click()}
const ss=document.getElementById('site-search');
if(ss){const items=[...document.querySelectorAll('main .card, main .list li')];ss.addEventListener('input',()=>{const q=ss.value.trim().toLowerCase();let n=0;
 items.forEach(el=>{const show=!q||el.textContent.toLowerCase().includes(q);el.hidden=!show;if(show)n++});
 document.getElementById('search-count').textContent=q?`找到 ${n} 筆 · ${n} result(s)`:''})}
const ASSET=(document.querySelector('script[src$="site.js"]').getAttribute('src')).replace(/site\.js$/,'');
/* ---------- 點擊統計 Click tracking ----------
 * track(event, props)：props 只放商家名稱/按鈕種類等非個資欄位，絕不放姓名、電話、IP。
 * 轉接點 Adapter hooks（上線時擇一，待定）：
 *  - Plausible：載入 plausible script 後，在下方 sendRemote 內呼叫 window.plausible(event,{props})
 *  - Cloudflare Web Analytics：只有頁面瀏覽，無自訂事件；需事件時改用 Cloudflare Zaraz 的 zaraz.track(event, props)
 * 原型：只寫入 localStorage（key hg_events），不發任何網路請求。
 * 停用的按鈕（disabled）瀏覽器不會觸發 click，因此不會被記錄。 */
function sendRemote(event,props){/* 上線時接 Plausible / Zaraz，原型不做任何事 */}
function track(event,props={}){try{const k='hg_events',a=JSON.parse(localStorage.getItem(k)||'[]');a.push({e:event,p:props,t:Date.now()});localStorage.setItem(k,JSON.stringify(a.slice(-1000)))}catch(_){}sendRemote(event,props)}
window.track=track;
document.addEventListener('click',e=>{const el=e.target.closest('[data-track]');if(!el||el.disabled)return;
 const card=el.closest('article');const biz=el.dataset.biz||(card&&card.querySelector('h3')?card.querySelector('h3').textContent.trim():'(未知)');
 track('click_'+el.dataset.track,{biz,kind:el.dataset.track,page:location.pathname.split('/').pop()||'index.html'})});
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
 chk('consent',E.consent.checked,'請勾選 POPIA 書面同意 Please tick the POPIA consent');
 document.getElementById('lyb-errors').innerHTML=errs.length?'<ul>'+errs.map(x=>'<li>'+x+'</li>').join('')+'</ul>':'';
 if(!errs.length){st.textContent='上線後開放，資料與照片都未送出。 Opens at launch – nothing was sent or uploaded.';st.hidden=false}})}
/* ---------- 繁簡切換 (opencc-js, tw→cn, 延遲載入) ---------- */
function loadScript(src){return new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
function loadCss(href){const l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.appendChild(l)}
async function toSimplified(){const t0=performance.now();await loadScript(ASSET+'vendor/opencc-t2cn.js');const t1=performance.now();
 const conv=OpenCC.Converter({from:'tw',to:'cn'});const CJK=/[\u3400-\u9fff]/;
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentNode.nodeName;return(p==='SCRIPT'||p==='STYLE'||!CJK.test(n.nodeValue))?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
 const nodes=[];while(w.nextNode())nodes.push(w.currentNode);nodes.forEach(n=>{n.nodeValue=conv(n.nodeValue)});
 document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(i=>{if(CJK.test(i.placeholder))i.placeholder=conv(i.placeholder)});
 document.title=conv(document.title);document.documentElement.lang='zh-Hans';
 document.querySelectorAll('[lang="zh-Hant-TW"]').forEach(e=>e.lang='zh-Hans');
 const t2=performance.now();window.__zh={loadMs:t1-t0,convertMs:t2-t1,nodes:nodes.length};
 const b=document.getElementById('zh-toggle');if(b)b.textContent='繁體'}
const zb=document.getElementById('zh-toggle');
if(zb){zb.addEventListener('click',()=>{if(localStorage.getItem('hg_zh')==='cn'){localStorage.setItem('hg_zh','tw');location.reload()}else{localStorage.setItem('hg_zh','cn');toSimplified()}})}
if(localStorage.getItem('hg_zh')==='cn')toSimplified();
/* ---------- 地圖 (Leaflet + OSM, 延遲載入) ---------- */
const mapWrap=document.getElementById('map-wrap');let mapObj=null;
const SAMPLE_PINS=[[-26.1076,28.0567,'範例川菜館'],[-26.1450,28.0410,'範例亞洲超市'],[-26.1900,28.0300,'範例生活服務']]; // 範例位置，非真實店址 sample only
async function showMap(){mapWrap.hidden=false;document.getElementById('dir').hidden=true;
 if(!mapObj){loadCss(ASSET+'vendor/leaflet/leaflet.css');await loadScript(ASSET+'vendor/leaflet/leaflet.js');
  mapObj=L.map('map').setView([-26.15,28.04],11);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(mapObj);
  SAMPLE_PINS.forEach(([a,b,n])=>L.marker([a,b]).addTo(mapObj).bindPopup(`${n}<br><b>範例位置，非真實店址</b><br>Sample location, not a real address`))}
 else mapObj.invalidateSize()}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===b));
 if(b.dataset.view==='map')showMap();else{mapWrap.hidden=true;document.getElementById('dir').hidden=false}}));

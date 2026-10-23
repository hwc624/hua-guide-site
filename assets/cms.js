/* 前台讀取管理頁內容（Firestore REST，免載 SDK）。
 * 讀不到（離線、逾時、規則擋、尚未匯入初始資料 seeded!=true）時什麼都不改，頁面維持 HTML 裡的靜態內容（備援）。
 * 只讀公開資料：site/*、merchants(published)、slides(enabled)、deals(published)、articles(published)。 */
(function(){
'use strict';
var ME=document.currentScript||document.querySelector('script[src$="cms.js"]');
var ASSET=ME.getAttribute('src').replace(/cms\.js.*$/,''),ROOT=ASSET.replace(/assets\/$/,'');
var EMU=/^(127\.0\.0\.1|localhost)$/.test(location.hostname)&&new URLSearchParams(location.search).has('emu');
/* ⚠️ 正式站開關：部署 firestore.rules 並在管理頁匯入初始資料之後才改成 true。false 時正式站完全不連 Firestore，只用 HTML 靜態內容。 */
var PROD_ENABLED=false;
var NOCMS=new URLSearchParams(location.search).has('nocms')||(!EMU&&!PROD_ENABLED);
var PROJECT=EMU?'demo-hua-guide':'hua-guide-haokang',KEY='AIzaSyCLmmOYAQG0fbFU2x5HqFM9WjrAEhej8OU';
var BASE=(EMU?'http://127.0.0.1:8080':'https://firestore.googleapis.com')+'/v1/projects/'+PROJECT+'/databases/(default)/documents';
var LANG=window.__lang||'tw';
var PAGE=(location.pathname.replace(/\/$/,'/index.html').match(/([^\/]+)\.html$/)||[,'index'])[1];
var IN_GUIDES=/\/guides\//.test(location.pathname);
window.__cms={state:'loading'};
if(NOCMS){window.__cms.state='off';return}

/* ---------- Firestore REST ---------- */
function dec(v){if(!v)return null;if('stringValue'in v)return v.stringValue;if('booleanValue'in v)return v.booleanValue;if('integerValue'in v)return +v.integerValue;if('doubleValue'in v)return v.doubleValue;
 if('nullValue'in v)return null;if('timestampValue'in v)return v.timestampValue;if('mapValue'in v)return decF(v.mapValue.fields||{});if('arrayValue'in v)return (v.arrayValue.values||[]).map(dec);return null}
function decF(f){var o={};for(var k in f)o[k]=dec(f[k]);return o}
function req(url,body){var ac=new AbortController(),t=setTimeout(function(){ac.abort()},5000);
 return fetch(url+(EMU?'':(url.indexOf('?')<0?'?':'&')+'key='+KEY),body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:ac.signal}:{signal:ac.signal})
  .then(function(r){clearTimeout(t);if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})}
function query(coll,field){return req(BASE+':runQuery',{structuredQuery:{from:[{collectionId:coll}],where:{fieldFilter:{field:{fieldPath:field},op:'EQUAL',value:{booleanValue:true}}}}})
 .then(function(rows){return rows.filter(function(r){return r.document}).map(function(r){var d=decF(r.document.fields||{});d.id=r.document.name.split('/').pop();return d}).sort(function(a,b){return (a.order||0)-(b.order||0)})})}
function getSite(){return req(BASE+'/site?pageSize=20').then(function(r){var o={};(r.documents||[]).forEach(function(d){o[d.name.split('/').pop()]=decF(d.fields||{})});return o})}

/* ---------- helpers ---------- */
function esc(s){return String(s==null?'':s).replace(/[&"<>']/g,function(c){return{'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;',"'":'&#39;'}[c]})}
function br(s){return esc(s).replace(/\n/g,'<br>')}
function bi(o){o=o||{};if(!o.tw&&!o.en)return'';return '<span lang="zh-Hant-TW">'+br(o.tw||o.en)+'</span><span lang="en">'+br(o.en||o.tw)+'</span>'}
function has(o){return o&&(o.tw||o.en)}
function url(u){u=String(u||'').trim();if(!u||/^\s*(javascript|data|vbscript):/i.test(u))return'';return u}
function rel(u){u=url(u);return /^(https?:|mailto:|tel:|#|\/)/i.test(u)||!u?u:ROOT+u}
function ext(u){return /^https?:/i.test(u)?' target="_blank" rel="noopener"':''}
function tel(n){return String(n||'').replace(/[^0-9+]/g,'')}
function relang(el){if(el&&window.__hgRelang)window.__hgRelang(el)}
function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
var AI='<span class="ph-tag"><span lang="zh-Hant-TW">AI 生成示意</span><span lang="en">AI-generated</span></span>';
var CLOSED={tw:'此功能目前暫停開放。',en:'This feature is currently unavailable.'};

/* ---------- 全站：站名、公告、維護、開關、隱藏區塊、WhatsApp ---------- */
function applySettings(S){var F=S.features||{};
 if(has(S.siteName)){$$('.brand.n-logo, .n-intro__title').forEach(function(e){e.innerHTML=bi(S.siteName);relang(e)});
  var oldTw='約堡華人好康網';if(S.siteName.tw&&S.siteName.tw!==oldTw)document.title=document.title.split(oldTw).join(S.siteName.tw)}
 var top=$('main');
 if(S.maintenance&&S.maintenance.on&&has(S.maintenance)){var m=document.createElement('div');m.className='cms-banner cms-banner--warn';m.setAttribute('role','status');m.dataset.cms='maintenance';m.innerHTML=bi(S.maintenance);top.insertBefore(m,top.firstChild);relang(m)}
 if(S.announcement&&S.announcement.on&&has(S.announcement)){var a=document.createElement(url(S.announcement.link)?'a':'div');a.className='cms-banner';a.dataset.cms='announcement';if(a.tagName==='A'){a.href=rel(S.announcement.link);if(ext(S.announcement.link))a.target='_blank'}a.innerHTML=bi(S.announcement);top.insertBefore(a,top.firstChild);relang(a)}
 (S.hidden||[]).forEach(function(id){$$('[data-block="'+String(id).replace(/"/g,'')+'"]').forEach(function(e){e.hidden=true})});
 function off(k){return F[k]===false}
 function hideLinks(file){$$('main a[href], footer a[href]').forEach(function(a){var h=a.getAttribute('href').split(/[?#]/)[0];if(h===file||h.slice(-file.length-1)==='/'+file||(file==='guides/'&&/(^|\/)guides\//.test(h))){var box=a.closest('[data-block],li')||a;box.hidden=true}})}
 function closePage(){var mm=$('main');mm.innerHTML='<section class="cms-closed" data-cms="closed"><h1 class="bi">'+bi({tw:'暫停開放',en:'Temporarily unavailable'})+'</h1><p class="bi">'+bi(CLOSED)+'</p><a class="btn" href="'+ROOT+'index.html">'+bi({tw:'回首頁',en:'Back to home'})+'</a></section>';relang(mm)}
 if(off('carousel'))$$('.n-hero[data-carousel]').forEach(function(e){e.hidden=true;e.dataset.cmsOff='1'});
 [['deals','deals.html','deals'],['giveaway','giveaway.html','giveaway'],['life','life.html','life']].forEach(function(x){if(off(x[0])){hideLinks(x[1]);if(PAGE===x[2]&&!IN_GUIDES)closePage()}});
 if(off('guides')){hideLinks('guides/');if(IN_GUIDES)closePage()}
 if(off('adslots'))$$('.ad-slot-wrap').forEach(function(e){e.hidden=true});
 if(off('share'))$$('.share-box').forEach(function(e){e.hidden=true});
 if(off('mapview'))$$('[data-view]').forEach(function(e){e.parentElement.hidden=true});
 ['health','beauty','dining','groceries','legal','finance','home','education'].forEach(function(k){if(off('cat_'+k))$$('a[href$="directory.html?cat='+k+'"]').forEach(function(e){e.hidden=true})});
 [['form_business','lyb-form'],['form_advertise','ad-form'],['form_giveaway','gw-form']].forEach(function(x){var f=document.getElementById(x[1]);if(f&&off(x[0])){var p=document.createElement('p');p.className='status cms-form-off';p.dataset.cms='form-off';p.innerHTML=bi({tw:'此表單目前暫停收件。',en:'This form is not accepting entries right now.'});f.replaceWith(p);relang(p)}});
 if(url(S.waGroup))$$('.join .tbd').forEach(function(e){var a=document.createElement('a');a.href=url(S.waGroup);a.target='_blank';a.rel='noopener';a.className='btn wa';a.innerHTML=bi({tw:'加入群組',en:'Join group'});e.replaceWith(a);relang(a)});
 if(url(S.waChannel))$$('.n-feature').forEach(function(card){if(/WHATSAPP/.test(card.textContent)&&card.tagName!=='A'){var b=card.querySelector('.n-btn');if(b){var a=document.createElement('a');a.className=b.className;a.href=url(S.waChannel);a.target='_blank';a.rel='noopener';a.innerHTML=bi({tw:'加入頻道 →',en:'Join channel →'});b.replaceWith(a);relang(a)}}});
 if(tel(S.contactWhatsapp)){var ft=$('footer.site-footer');if(ft){var p2=document.createElement('p');p2.dataset.cms='contact';p2.innerHTML='WhatsApp: <a href="https://wa.me/'+esc(tel(S.contactWhatsapp).replace('+',''))+'" target="_blank" rel="noopener">'+esc(S.contactWhatsapp)+'</a>';ft.insertBefore(p2,ft.children[1]||null)}}
}

/* ---------- 商家 ---------- */
function bizActions(m,cls){var o='',bz=esc((m.name&&m.name.tw||'')+' '+(m.name&&m.name.en||''));
 if(tel(m.whatsapp))o+='<a class="'+cls+' wa" href="https://wa.me/'+esc(tel(m.whatsapp).replace('+',''))+'" target="_blank" rel="noopener" data-track="whatsapp" data-biz="'+bz+'">WhatsApp</a> ';
 if(tel(m.phone))o+='<a class="'+cls+'" href="tel:'+esc(tel(m.phone))+'" data-track="call" data-biz="'+bz+'">'+bi({tw:'打電話',en:'Call'})+'</a> ';
 if(url(m.website))o+='<a class="'+cls+'" href="'+esc(rel(m.website))+'"'+ext(m.website)+' data-track="website" data-biz="'+bz+'">'+bi({tw:'官網 ↗',en:'Website ↗'})+'</a>';
 return o}
function bizCard(m){var t=m.tags||[],img=url(m.image);
 return '<article class="card biz'+(t.indexOf('featured')>=0?' featured':'')+(t.indexOf('sample')>=0?' sample':'')+'" data-cat="'+esc(m.group||'other')+'" data-sub="'+esc(m.sub||'')+'" data-cms-id="'+esc(m.id)+'">'
  +(img?'<div class="ph ph-img"><img src="'+esc(rel(img))+'" alt="" width="800" height="600" loading="lazy" decoding="async">'+(m.imageAi?AI:'')+'</div>':'')
  +'<div class="badges">'+(t.indexOf('affiliate')>=0?'<span class="badge affil">'+bi({tw:'經營者關係企業',en:'Affiliated with the site operator'})+'</span>':'')+(t.indexOf('featured')>=0?'<span class="badge feat">精選商家 Featured</span>':'')+(t.indexOf('sample')>=0?'<span class="badge sample-b">範例 / Sample</span>':'')+'</div>'
  +'<h2>'+bi(m.name)+'</h2>'+(has(m.desc)?'<p class="bi">'+bi(m.desc)+'</p>':'')+(has(m.meta)?'<p class="meta">'+bi(m.meta)+'</p>':'')
  +bizActions(m,'btn')+(has(m.note)?'<p class="act-note">'+bi(m.note)+'</p>':'')+'</article>'}
function homeCard(m){var t=m.tags||[],img=url(m.homeImage||m.image);
 return '<article class="card n-card n-card--merchant n-card--glow" style="--n-glow-color:var(--n-neon-red)" data-cat="'+esc(m.group||'')+'" data-cms-id="'+esc(m.id)+'">'+(img?'<img src="'+esc(rel(img))+'" alt="" width="800" height="600" loading="lazy" decoding="async">':'')
  +'<div class="n-card__body"><span class="n-card__tags"><span class="n-tag n-tag--red">'+bi({tw:'精選',en:'Featured'})+'</span>'+(t.indexOf('affiliate')>=0?'<span class="n-tag n-tag--affiliate">'+bi({tw:'經營者關係企業',en:'Affiliated with the site operator'})+'</span>':'')+(t.indexOf('sample')>=0?'<span class="n-tag n-tag--sample">範例 / Sample</span>':'')+'</span>'
  +'<h3 class="n-card__title">'+bi(m.name)+'</h3>'+(has(m.homeDesc||m.desc)?'<p class="n-card__meta">'+bi(has(m.homeDesc)?m.homeDesc:m.desc)+'</p>':'')+(has(m.note)?'<p class="act-note">'+bi(m.note)+'</p>':'')
  +'<div class="n-card__actions">'+bizActions(m,'n-btn n-btn--primary n-btn--sm')+'</div></div></article>'}
function applyMerchants(list){var dir=document.getElementById('dir');
 if(dir){dir.innerHTML=list.map(bizCard).join('');relang(dir);if(window.__hgApplyDir)window.__hgApplyDir()}
 var feat=$('.n-split article.n-card--merchant');if(feat){var f=list.filter(function(m){return m.featuredHome});var w=document.createElement('div');w.innerHTML=f.map(homeCard).join('');
  var nodes=[].slice.call(w.children);nodes.forEach(function(n){feat.parentNode.insertBefore(n,feat)});feat.remove();nodes.forEach(relang)}}

/* ---------- 輪播 ---------- */
function applySlides(list){var root=$('.n-hero[data-carousel]');if(!root||root.dataset.cmsOff||!window.HGCarousel)return;var now=new Date().toISOString().slice(0,10);
 var s=list.filter(function(x){return (!x.start||x.start<=now)&&(!x.end||x.end>=now)});window.HGCarousel.mount(s,true);relang(root)}

/* ---------- 優惠 ---------- */
function applyDeals(list){var g=$('.grid.deals');if(!g)return;
 g.innerHTML=list.map(function(d){var t=d.tags||[],img=url(d.image);
  return '<article class="card deal'+(t.indexOf('featured')>=0?' featured':'')+(t.indexOf('sample')>=0?' sample':'')+'" data-cms-id="'+esc(d.id)+'">'+(img?'<div class="ph ph-img"><img src="'+esc(rel(img))+'" alt="" width="800" height="600" loading="lazy" decoding="async">'+(d.imageAi?AI:'')+'</div>':'')
  +'<div class="badges">'+(t.indexOf('affiliate')>=0?'<span class="badge affil">'+bi({tw:'經營者關係企業',en:'Affiliated with the site operator'})+'</span>':'')+(t.indexOf('featured')>=0?'<span class="badge feat">本週優惠 Deal</span>':'')+(t.indexOf('sample')>=0?'<span class="badge sample-b">範例 / Sample</span>':'')+'</div>'
  +'<h2 class="h3">'+bi(d.biz)+'</h2>'+(has(d.desc)?'<p class="bi">'+bi(d.desc)+'</p>':'')
  +(has(d.offer)?'<p class="bi">'+bi({tw:'優惠：'+(d.offer.tw||''),en:'Offer: '+(d.offer.en||d.offer.tw||'')})+'</p>':'')
  +(has(d.valid)?'<p class="meta">'+bi({tw:'期限：'+(d.valid.tw||''),en:'Valid until: '+(d.valid.en||d.valid.tw||'')})+'</p>':'')
  +(has(d.claim)?'<p class="meta">'+bi({tw:'領取方式：'+(d.claim.tw||''),en:'How to claim: '+(d.claim.en||d.claim.tw||'')})+'</p>':'')
  +(has(d.meta)?'<p class="meta">'+bi(d.meta)+'</p>':'')+(url(d.website)?'<a class="btn" href="'+esc(rel(d.website))+'"'+ext(d.website)+' data-track="website" data-biz="'+esc(d.biz&&d.biz.tw||'')+'">'+bi({tw:'官網 ↗',en:'Website ↗'})+'</a>':'')
  +(has(d.note)?'<p class="act-note">'+bi(d.note)+'</p>':'')+'</article>'}).join('');relang(g)}

/* ---------- 文章（生活資訊 / 指南） ---------- */
function paras(o){var tw=String(o&&o.tw||'').split(/\n{2,}/),en=String(o&&(o.en||o.tw)||'').split(/\n{2,}/);var n=Math.max(tw.length,en.length),h='';for(var i=0;i<n;i++)h+='<p class="bi">'+bi({tw:tw[i]||'',en:en[i]||''})+'</p>';return h}
function applyArticles(list){
 var life=$('.grid.life');if(life)list.filter(function(a){return a.page==='life'}).forEach(function(a){var e=document.createElement('article');e.className='card';e.dataset.cmsId=a.id;e.innerHTML='<h2 class="h3">'+bi(a.title)+'</h2>'+paras(a.body)+(url(a.link)?'<p><a href="'+esc(rel(a.link))+'"'+ext(a.link)+'>'+bi({tw:'更多 →',en:'More →'})+'</a></p>':'');life.appendChild(e);relang(e)});
 if(IN_GUIDES&&PAGE==='index'){var ul=$('main ul.list');if(ul)list.filter(function(a){return a.page==='guides'}).forEach(function(a){var li=document.createElement('li');li.dataset.cmsId=a.id;li.innerHTML='<a href="../article.html?id='+encodeURIComponent(a.id)+'">'+bi(a.title)+'</a>';ul.appendChild(li);relang(li)})}
 if(PAGE==='article'){var id=new URLSearchParams(location.search).get('id'),a=list.filter(function(x){return x.id===id})[0],box=document.getElementById('article');if(box){
  if(a){box.innerHTML='<h1 class="bi">'+bi(a.title)+'</h1>'+paras(a.body)+(url(a.link)?'<p><a href="'+esc(rel(a.link))+'"'+ext(a.link)+'>'+bi({tw:'相關連結 ↗',en:'Related link ↗'})+'</a></p>':'');var tt=(a.title&&(LANG==='en'?a.title.en||a.title.tw:a.title.tw))||'';if(tt)document.title=tt+' | '+document.title}
  else box.innerHTML='<p class="bi">'+bi({tw:'找不到這篇文章。',en:'Article not found.'})+'</p>';relang(box)}}}

/* ---------- 廣告方案 / 抽獎 ---------- */
function applyAdvertise(A){if(PAGE!=='advertise')return;var tb=$('main table tbody'),pl=$('.grid.plans');var price=function(p){return p?'<td>'+esc(p)+'</td>':'<td class="tbd">待定 / TBD</td>'};
 if(has(A.intro)){var hp=$('.n-pg-hero p.bi');if(hp){hp.innerHTML=bi(A.intro);relang(hp)}}
 if(tb&&A.rows){tb.innerHTML=A.rows.map(function(r){return '<tr><td>'+bi(r.name)+'</td><td>'+esc(r.spec)+'</td>'+price(r.price)+'</tr>'}).join('');relang(tb)}
 if(pl&&A.plans){pl.innerHTML=A.plans.map(function(p){return '<div class="card"><h3>'+bi(p.name)+'</h3><p class="bi">'+bi(p.desc)+'</p>'+(p.price?'<p>'+esc(p.price)+'</p>':'<p class="tbd">待定 / TBD</p>')+'</div>'}).join('');relang(pl)}}
function applyGiveaway(G){if(PAGE!=='giveaway')return;var w=$('.warn-big'),h=$('.n-pg-hero h1'),ol=$('ol.rules');
 if(w){if(has(G.banner)){w.innerHTML='<strong>'+bi(G.banner)+'</strong>';relang(w)}else w.hidden=true}
 if(h&&has(G.title)){h.innerHTML=bi(G.title);relang(h)}
 if(ol&&G.rules){ol.innerHTML=G.rules.map(function(r){return '<li>'+bi(r)+'</li>'}).join('')+'<li>'+bi({tw:'詳見',en:'See our'})+' <a href="privacy.html">'+bi({tw:'隱私政策',en:'Privacy Policy'})+'</a></li>';relang(ol)}}

/* ---------- 執行 ---------- */
function done(st,e){window.__cms.state=st;if(e)window.__cms.error=String(e&&e.message||e);document.documentElement.dataset.cms=st;document.dispatchEvent(new CustomEvent('hg:cms',{detail:st}))}
getSite().then(function(site){var S=site.settings;
 if(!S||S.seeded!==true){done('static');return}
 window.__cms.site=site;applySettings(S);if(site.advertise)applyAdvertise(site.advertise);if(site.giveaway)applyGiveaway(site.giveaway);
 var jobs=[];
 if(document.getElementById('dir')||$('.n-split article.n-card--merchant'))jobs.push(query('merchants','published').then(applyMerchants));
 if($('.n-hero[data-carousel]'))jobs.push(query('slides','enabled').then(applySlides));
 if($('.grid.deals'))jobs.push(query('deals','published').then(applyDeals));
 if($('.grid.life')||(IN_GUIDES&&PAGE==='index')||PAGE==='article')jobs.push(query('articles','published').then(applyArticles));
 return Promise.all(jobs).then(function(){done('live')})
}).catch(function(e){console.warn('[cms] 用靜態備援 static fallback:',e&&e.message);done('fallback',e)});
})();

/* 商家統計 stats.js：匿名計數寫入 Firestore stats_daily/{商家ID_YYYYMMDD}（約堡日期）。
 * 只存數字：views 曝光、click_whatsapp / click_call / click_website 點擊、dwell_ms_total / dwell_samples 停留估算。
 * 不存 IP、姓名、電話、cookie 或任何訪客識別碼。firestore.rules 限制公開只能小量遞增這些欄位、不能讀。
 * 曝光：卡片 ≥50% 進入畫面，每次載入頁面每家只算一次。
 * 停留（估算）：卡片 ≥50% 可見且分頁在前景的累積時間，單次最多 60 秒，滿 1 秒才算一筆。 */
(function(){
'use strict';
if(window.__hgStats)return;window.__hgStats=1;
var EMU=/^(127\.0\.0\.1|localhost)$/.test(location.hostname)&&new URLSearchParams(location.search).has('emu');
var LOCAL=/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
if(LOCAL&&!EMU)return; // 本機未開 emulator 不寫正式資料
var PROJECT=EMU?'demo-hua-guide':'hua-guide-haokang',KEY='AIzaSyCLmmOYAQG0fbFU2x5HqFM9WjrAEhej8OU';
var DOCS='projects/'+PROJECT+'/databases/(default)/documents';
var URL_=(EMU?'http://127.0.0.1:8080':'https://firestore.googleapis.com')+'/v1/'+DOCS+':commit'+(EMU?'':'?key='+KEY);
var MAX={views:50,click_whatsapp:20,click_call:20,click_website:20,dwell_ms_total:600000,dwell_samples:50}; // 與 firestore.rules 同步
var CAP=60000,MIN=1000,ID=/^[A-Za-z0-9_-]{1,60}$/;
var q={},seen={},vis=new Map(),timer=null;
function day(){return new Date().toLocaleDateString('en-CA',{timeZone:'Africa/Johannesburg'}).replace(/-/g,'')}
function add(id,f,n){if(!ID.test(id)||!(f in MAX))return;var o=q[id]||(q[id]={});o[f]=(o[f]||0)+n;sched()}
function sched(){if(!timer)timer=setTimeout(flush,8000)}
function flush(beacon){clearTimeout(timer);timer=null;var d=day(),writes=[];
 Object.keys(q).forEach(function(id){var o=q[id],ft=[];Object.keys(o).forEach(function(f){var n=Math.min(Math.round(o[f]),MAX[f]);if(n>0)ft.push({fieldPath:f,increment:{integerValue:String(n)}})});
  if(ft.length)writes.push({transform:{document:DOCS+'/stats_daily/'+id+'_'+d,fieldTransforms:ft}})});
 q={};if(!writes.length)return;
 try{fetch(URL_,{method:'POST',keepalive:!!beacon,headers:{'Content-Type':'application/json'},body:JSON.stringify({writes:writes})}).catch(function(){})}catch(_){}}
function endVis(el){var t=vis.get(el);if(t==null)return;vis.delete(el);var ms=Math.min(performance.now()-t,CAP);if(ms>=MIN){add(el.dataset.cmsId,'dwell_ms_total',ms);add(el.dataset.cmsId,'dwell_samples',1)}}
var io=new IntersectionObserver(function(es){es.forEach(function(e){var el=e.target,id=el.dataset.cmsId;
 if(e.isIntersecting&&e.intersectionRatio>=0.5&&!el.hidden){if(!seen[id]){seen[id]=1;add(id,'views',1)}if(document.visibilityState==='visible'&&!vis.has(el))vis.set(el,performance.now())}
 else endVis(el)})},{threshold:[0,0.5]});
function scan(){document.querySelectorAll('.biz[data-cms-id], .n-card--merchant[data-cms-id]').forEach(function(el){if(!el.__hgObs){el.__hgObs=1;io.observe(el)}})}
scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
function drain(){var Q=window.__hgQ||[];while(Q.length){var x=Q.shift();add(x[0],x[1],1)}}
drain();window.__hgQ={push:function(x){add(x[0],x[1],1)}};
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden'){Array.from(vis.keys()).forEach(endVis);flush(true)}
 else io.takeRecords&&scan()});
addEventListener('pagehide',function(){Array.from(vis.keys()).forEach(endVis);flush(true)});
window.__hgStatsFlush=function(){Array.from(vis.keys()).forEach(endVis);flush(false)}; // 測試用
})();

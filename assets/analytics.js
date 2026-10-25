/* GoatCounter 網站瀏覽次數（免費、不用 cookie、不存個資）。
 * ⚠️ 唯一設定處：GC_CODE。'hua-guide' 為佔位代碼，Hans 需先到 https://www.goatcounter.com/signup 註冊同名代碼
 *    （或註冊別的代碼後改這裡）。頁尾公開人次需在 GoatCounter「Settings」勾選
 *    「Allow adding visitor counts on your website」，沒開或讀不到時頁尾自動隱藏。
 * 本機（localhost / 127.0.0.1）不送資料。 */
(function(){
'use strict';
var GC_CODE='hua-guide'; // ← 佔位 PLACEHOLDER，註冊後確認
var GC_SHOW_FOOTER=true;
var LOCAL=/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
if(!GC_CODE||window.__hgGC)return;window.__hgGC=GC_CODE;
var base='https://'+GC_CODE+'.goatcounter.com';
if(!LOCAL){var s=document.createElement('script');s.async=true;s.src='https://gc.zgo.at/count.js';s.setAttribute('data-goatcounter',base+'/count');document.head.appendChild(s)}
if(!GC_SHOW_FOOTER)return;
var ft=document.querySelector('footer.site-footer');if(!ft)return;
var p=document.createElement('p');p.className='gc-count';p.hidden=true;ft.appendChild(p);
if(LOCAL&&!/[?&]gcdemo=1/.test(location.search))return;
var url=LOCAL?null:base+'/counter//TOTAL.json';
function show(n){p.innerHTML='<span lang="zh-Hant-TW">網站累計瀏覽 '+n+' 次</span><span lang="en">'+n+' total page views</span>';p.hidden=false;if(window.__hgRelang)window.__hgRelang(p)}
if(!url){show('1,234（示意 demo）');return} // 本機 ?gcdemo=1 只為截圖示意
var ac=new AbortController(),t=setTimeout(function(){ac.abort()},4000);
fetch(url,{signal:ac.signal}).then(function(r){clearTimeout(t);if(!r.ok)throw 0;return r.json()}).then(function(j){if(j&&j.count)show(String(j.count).replace(/[<>&]/g,''))}).catch(function(){});
})();

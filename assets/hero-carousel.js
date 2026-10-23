/* 首頁輪播 hero carousel。
 * 載入時用 HERO_SLIDES（靜態備援）掛上；cms.js 讀到 Firestore 的 slides 後呼叫 HGCarousel.mount(slides, true) 整組重建。
 * 第 1 張在 HTML 內（不用 JS 也看得到），rebuildAll=false 時保留它。需在 site.js 之前同步執行，才會被繁簡/EN 轉換涵蓋。 */
(function(){
var root=document.querySelector('.n-hero[data-carousel]');if(!root)return;
var track=root.querySelector('.n-hero__track');
var L='tw';try{L=localStorage.getItem('hg_lang')||(localStorage.getItem('hg_zh')==='cn'?'cn':'tw')}catch(_){}
var T={tw:{prev:'上一張',next:'下一張',slide:'第 %n 張，共 %t 張',dots:'選擇投影片',pause:'暫停輪播',play:'播放輪播',rd:'輪播',sl:'投影片'},
 cn:{prev:'上一张',next:'下一张',slide:'第 %n 张，共 %t 张',dots:'选择幻灯片',pause:'暂停轮播',play:'播放轮播',rd:'轮播',sl:'幻灯片'},
 en:{prev:'Previous slide',next:'Next slide',slide:'Slide %n of %t',dots:'Choose slide',pause:'Pause carousel',play:'Play carousel',rd:'carousel',sl:'slide'}}[L]||{};
var TAG={featured:['n-tag--badge','精選商家','FEATURED'],ad:['n-tag--badge','廣告','AD'],event:['n-tag--badge','活動','EVENT'],affiliate:['n-tag--affiliate','經營者關係企業','Affiliated with the site operator'],sample:['n-tag--sample','範例','Sample']};
function esc(s){return String(s==null?'':s).replace(/[&"<>]/g,function(c){return{'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;'}[c]})}
function br(s){return esc(s).replace(/\n/g,'<br>')}
function bi(o){o=o||{};return '<span lang="zh-Hant-TW">'+br(o.tw)+'</span><span lang="en">'+br(o.en||o.tw)+'</span>'}
function safeUrl(u){u=String(u||'');return /^(https?:|mailto:|tel:|[a-z0-9_\-\/.#?=&%]+$)/i.test(u)&&!/^\s*javascript:/i.test(u)?u:'#'}
function build(s,first){var d=document.createElement('div');d.className='n-hero__slide';
 var tags=(s.tags||[]).map(function(k){var t=TAG[k];if(!t)return'';return k==='sample'?'<span class="n-tag n-tag--sample">範例 / Sample</span>':'<span class="n-tag '+t[0]+'">'+bi({tw:t[1],en:t[2]})+'</span>'}).join('');
 d.innerHTML='<img src="'+esc(safeUrl(s.image))+'" alt="'+esc(s.alt||'')+'" width="'+(+s.width||800)+'" height="'+(+s.height||600)+'"'+(first?' fetchpriority="high"':' loading="lazy"')+' decoding="async"><div class="n-hero__body"><span class="n-hero__tags">'+tags+'</span><h2 class="n-hero__title">'+bi(s.title)+'</h2><p class="n-hero__text">'+bi(s.text)+'</p>'+(s.link?'<a class="n-btn n-btn--ghost n-btn--sm" href="'+esc(safeUrl(s.link))+'"'+(s.external?' target="_blank" rel="noopener"':'')+(s.biz?' data-track="website" data-biz="'+esc(s.biz)+'"':'')+'>'+bi(s.button)+'</a>':'')+'</div>';
 return d}
var inst=null;
function mount(S,rebuildAll){
 if(inst){inst.ac.abort();clearInterval(inst.timer)}
 var ac=new AbortController(),sig={signal:ac.signal};inst={ac:ac,timer:null};
 var old=root.querySelector('.n-hero__controls');if(old)old.remove();
 root.classList.remove('is-carousel');root.removeAttribute('role');
 if(rebuildAll){track.innerHTML='';S.forEach(function(s,i){track.appendChild(build(s,i===0))})}
 else for(var i=1;i<S.length;i++)track.appendChild(build(S[i]));
 var slides=[].slice.call(track.children),n=slides.length;
 slides.forEach(function(s,k){s.style.transform='';s.classList.toggle('is-active',k===0);s.removeAttribute('aria-hidden');s.inert=false});
 root.hidden=n===0;if(n<2)return;
 root.setAttribute('role','region');root.setAttribute('aria-roledescription',T.rd);root.setAttribute('aria-label','精選 / Featured');
 root.classList.add('is-carousel');
 var ctl=document.createElement('div');ctl.className='n-hero__controls';
 ctl.innerHTML='<button type="button" class="n-hero__btn n-hero__btn--play" aria-label="'+T.pause+'">❚❚</button><button type="button" class="n-hero__btn n-hero__btn--prev" aria-label="'+T.prev+'">‹</button><div class="n-hero__dots" role="group" aria-label="'+T.dots+'"></div><button type="button" class="n-hero__btn n-hero__btn--next" aria-label="'+T.next+'">›</button>';
 root.appendChild(ctl);var dotsEl=ctl.querySelector('.n-hero__dots'),playB=ctl.querySelector('.n-hero__btn--play');
 slides.forEach(function(s,k){s.setAttribute('role','group');s.setAttribute('aria-roledescription',T.sl);s.setAttribute('aria-label',T.slide.replace('%n',k+1).replace('%t',n));
  var b=document.createElement('button');b.type='button';b.className='n-hero__dot';b.setAttribute('aria-label',T.slide.replace('%n',k+1).replace('%t',n));b.addEventListener('click',function(){go(k,true)});dotsEl.appendChild(b)});
 var dots=[].slice.call(dotsEl.children),cur=0;
 function go(k,user){var nx=(k+n)%n;if(nx!==cur){var back=k<cur,o=slides[cur],t=slides[nx];
 t.classList.add('no-anim');t.style.transform='translateX('+(back?'-100%':'100%')+')';void t.offsetWidth;t.classList.remove('no-anim');
 if(o!==t){o.classList.add('is-out');o.style.transform='translateX('+(back?'100%':'-100%')+')';setTimeout(function(){o.classList.remove('is-out')},650)}
 t.style.transform=''}
 cur=nx;slides.forEach(function(s,j){var on=j===cur;s.classList.toggle('is-active',on);s.setAttribute('aria-hidden',on?'false':'true');s.inert=!on;if(!on&&!s.classList.contains('is-out'))s.style.transform=''});
  dots.forEach(function(d,j){d.setAttribute('aria-current',j===cur?'true':'false')});root.dataset.index=cur;if(user)restart()}
 var playing=true,hover=false,focus=false,DELAY=3000;
 function running(){return playing&&!hover&&!focus&&!document.hidden}
 function restart(){clearInterval(inst.timer);inst.timer=null;if(running())inst.timer=setInterval(function(){go(cur+1)},DELAY);track.setAttribute('aria-live',running()?'off':'polite')}
 function setPlay(p){playing=p;playB.setAttribute('aria-label',p?T.pause:T.play);playB.textContent=p?'❚❚':'▶';restart()}
 ctl.querySelector('.n-hero__btn--prev').addEventListener('click',function(){go(cur-1,true)});
 ctl.querySelector('.n-hero__btn--next').addEventListener('click',function(){go(cur+1,true)});
 playB.addEventListener('click',function(){setPlay(!playing)});
 root.addEventListener('mouseenter',function(){hover=true;restart()},sig);root.addEventListener('mouseleave',function(){hover=false;restart()},sig);
 root.addEventListener('focusin',function(e){if(e.target.matches(':focus-visible')){focus=true;restart()}},sig);root.addEventListener('focusout',function(e){if(!root.contains(e.relatedTarget)){focus=false;restart()}},sig);
 document.addEventListener('visibilitychange',restart,sig);
 root.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){go(cur-1,true);e.preventDefault()}else if(e.key==='ArrowRight'){go(cur+1,true);e.preventDefault()}},sig);
 var x0=null,y0=0;track.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true,signal:ac.signal});
 track.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))go(cur+(dx<0?1:-1),true)},{passive:true,signal:ac.signal});
 setPlay(playing);go(0);
}
window.HGCarousel={mount:mount,build:build};
mount(window.HERO_SLIDES||[],false);
})();

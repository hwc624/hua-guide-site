document.querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active',c===b));const f=b.dataset.filter;
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

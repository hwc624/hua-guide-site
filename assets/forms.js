/* 表單送出到 Firebase（只在有表單的頁面延遲載入）Form submission to Firestore / Storage. */
import { firebaseConfig, photos, SDK, useEmulator, configured } from './firebase-config.js';
const cfg = useEmulator ? { apiKey: 'demo-key', projectId: 'demo-hua-guide', storageBucket: 'demo-hua-guide.appspot.com', appId: 'demo' } : firebaseConfig;
const MSG = {
  ok:      { tw: '已送出，謝謝！我們會盡快與您聯絡。', cn: '已送出，谢谢！我们会尽快与您联系。', en: 'Sent – thank you! We will be in touch soon.' },
  okLyb:   { tw: '已送出，審核通過後會刊登。', cn: '已送出，审核通过后会刊登。', en: 'Sent – your listing will be published after review.' },
  okGw:    { tw: '已報名，祝您中獎！', cn: '已报名，祝您中奖！', en: 'You are entered – good luck!' },
  noPhoto: { tw: '（照片暫不支援上傳，請用 WhatsApp 傳給我們。）', cn: '（照片暂不支持上传，请用 WhatsApp 传给我们。）', en: ' (Photo upload is not available yet – please send it via WhatsApp.)' },
  wait:    { tw: '送出太頻繁，請稍等一分鐘再試。', cn: '送出太频繁，请稍等一分钟再试。', en: 'Too many submissions – please wait a minute and try again.' },
  big:     { tw: '照片需為 JPG / PNG / WebP，且小於 5 MB。', cn: '照片需为 JPG / PNG / WebP，且小于 5 MB。', en: 'Photo must be JPG / PNG / WebP and under 5 MB.' },
  off:     { tw: '表單尚未連上後台，資料未送出。', cn: '表单尚未连上后台，资料未送出。', en: 'Form not connected yet – nothing was sent.' },
  err:     { tw: '送出失敗，請稍後再試或用 WhatsApp 聯絡我們。', cn: '送出失败，请稍后再试或用 WhatsApp 联系我们。', en: 'Could not send – please try again later or contact us on WhatsApp.' },
  sending: { tw: '送出中…', cn: '送出中…', en: 'Sending…' }
};
const L = () => (['tw', 'cn', 'en'].includes(window.__lang) ? window.__lang : 'tw');
export const t = k => MSG[k][L()];
const COLL = { business: 'submissions_business', advertise: 'submissions_advertise', giveaway: 'submissions_giveaway' };
const OKMSG = { business: 'okLyb', advertise: 'ok', giveaway: 'okGw' };
const PHOTO_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
let fb;
async function init() {
  if (fb) return fb;
  const [{ initializeApp }, fs] = await Promise.all([import(SDK + 'firebase-app.js'), import(SDK + 'firebase-firestore.js')]);
  const app = initializeApp(cfg);
  const db = fs.getFirestore(app);
  if (useEmulator) fs.connectFirestoreEmulator(db, '127.0.0.1', 8080);
  fb = { app, db, fs };
  return fb;
}
async function uploadPhoto(file) {
  const st = await import(SDK + 'firebase-storage.js');
  const s = st.getStorage(fb.app);
  if (useEmulator) st.connectStorageEmulator(s, '127.0.0.1', 9199);
  const path = 'uploads/business/' + crypto.randomUUID() + '.' + PHOTO_TYPES[file.type];
  await st.uploadBytes(st.ref(s, path), file, { contentType: file.type });
  return path;
}
/* kind: business | advertise | giveaway；form 有 honeypot 欄位 name="website" */
export async function submit(kind, form, data, statusEl, file) {
  const show = (m, cls) => { statusEl.textContent = m; statusEl.dataset.state = cls; statusEl.hidden = false; };
  const btn = form.querySelector('[type=submit]');
  if (form.elements.website && form.elements.website.value) { show(t(OKMSG[kind]), 'ok'); form.reset(); return; } // 機器人：假裝成功
  const rk = 'hg_sub_' + kind, now = Date.now();
  try { if (now - Number(localStorage.getItem(rk) || 0) < 60000) { show(t('wait'), 'error'); return; } } catch (_) {}
  if (file && (!PHOTO_TYPES[file.type] || file.size >= 5 * 1024 * 1024)) { show(t('big'), 'error'); return; }
  if (!configured) { show(t('off'), 'error'); return; }
  btn.disabled = true; show(t('sending'), 'busy');
  try {
    const { db, fs } = await init();
    let extra = '';
    if (file) { if (photos) data.photoPath = await uploadPhoto(file); else extra = t('noPhoto'); }
    await fs.addDoc(fs.collection(db, COLL[kind]), { ...data, lang: L(), status: 'pending', createdAt: fs.serverTimestamp() });
    try { localStorage.setItem(rk, String(now)); } catch (_) {}
    show(t(OKMSG[kind]) + extra, 'ok'); form.reset();
    const pv = document.getElementById('lyb-preview'); if (pv) pv.hidden = true;
  } catch (e) { console.error(e); show(t('err'), 'error'); }
  finally { btn.disabled = false; }
}

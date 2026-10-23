/* Firebase 設定 Firebase config — 唯一需要填的檔案。
 * ⚠️ 以下為佔位值 PLACEHOLDER：Hans 建立 Firebase 專案並註冊 Web App 後，
 *    把主控台「專案設定 > 你的應用程式 > SDK 設定」裡的值貼進來。
 *    這些值是公開的識別碼，不是密碼；安全性靠 firestore.rules / storage.rules。
 * photos：Cloud Storage 新專案需 Blaze（綁卡）方案。沒開 Storage 就設 false，照片改請商家用 WhatsApp 傳。 */
export const firebaseConfig = {
  apiKey: "AIzaSyCLmmOYAQG0fbFU2x5HqFM9WjrAEhej8OU",
  authDomain: "hua-guide-haokang.firebaseapp.com",
  projectId: "hua-guide-haokang",
  storageBucket: "hua-guide-haokang.firebasestorage.app",
  appId: "1:839673315478:web:cfe1e1e3c85ac7b98742b7"
};
export const photos = false;
export const SDK = "https://www.gstatic.com/firebasejs/10.14.1/";
/* 本機測試：在 127.0.0.1 / localhost 網址加 ?emu=1 就改連 Firebase Emulator，不會碰正式資料。 */
export const useEmulator = /^(127\.0\.0\.1|localhost)$/.test(location.hostname) && new URLSearchParams(location.search).has("emu");
export const configured = useEmulator || !firebaseConfig.projectId.startsWith("PLACEHOLDER");

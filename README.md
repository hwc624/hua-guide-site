# 約堡華人好康網（原型）
- 網址 `https://example.co.za` 為**待定佔位**（canonical、OG、sitemap.xml、robots.txt 皆用此值），正式網域確定後全域取代。
- 自託管第三方：`assets/vendor/opencc-t2cn.js`（opencc-js 1.4.2，MIT/Apache-2.0，只含 繁→簡 詞典，用 tw→cn）、`assets/vendor/leaflet/`（Leaflet 1.9.4，BSD-2）。
- 地圖圖磚：OpenStreetMap（© OpenStreetMap contributors）。正式上線流量大時需改用付費/自建圖磚以符合 OSM 使用政策（待定）。
- 點擊統計：`assets/site.js` 的 `track()`；原型只存 localStorage，轉接點見註解。
- 字型：Google Fonts（Noto Sans TC）。上線前可考慮自託管以免把訪客 IP 傳給 Google（POPIA 待評估）。

## 管理後台 admin.html（分支 admin-cms）
- `admin.html` + `assets/admin.js`：Firebase Auth 登入（Email/密碼或 Google）。管理員 = custom claim `admin==true`（owner）或 `admins/{uid}` 文件（role owner|editor）。
- 可管理：送件審核（通過商家自動刊登）、商家、首頁輪播（含排程）、優惠、文章／生活資訊、廣告方案與價格、抽獎內容、網站設定（站名、WhatsApp、公告、維護橫條、功能開關、隱藏區塊）、管理員名單。
- 前台 `assets/cms.js` 用 Firestore REST 讀已發布內容；讀不到就維持 HTML 靜態內容。正式站開關 `PROD_ENABLED`（預設 false）。
- 初始資料在 `assets/cms-seed.js`，在管理頁「網站設定 → 匯入初始資料」寫入。
- 本機測試：`firebase emulators:start --only firestore,auth --project demo-hua-guide`，網址加 `?emu=1`。

# 約堡華人生活指南（原型）
- 網址 `https://example.co.za` 為**待定佔位**（canonical、OG、sitemap.xml、robots.txt 皆用此值），正式網域確定後全域取代。
- 自託管第三方：`assets/vendor/opencc-t2cn.js`（opencc-js 1.4.2，MIT/Apache-2.0，只含 繁→簡 詞典，用 tw→cn）、`assets/vendor/leaflet/`（Leaflet 1.9.4，BSD-2）。
- 地圖圖磚：OpenStreetMap（© OpenStreetMap contributors）。正式上線流量大時需改用付費/自建圖磚以符合 OSM 使用政策（待定）。
- 點擊統計：`assets/site.js` 的 `track()`；原型只存 localStorage，轉接點見註解。
- 字型：Google Fonts（Noto Sans TC）。上線前可考慮自託管以免把訪客 IP 傳給 Google（POPIA 待評估）。

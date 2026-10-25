/* 初始資料（從目前寫死在 HTML 裡的內容整理出來）。管理頁「匯入初始資料」會把這些寫進 Firestore。
 * 範例資料一律帶 sample 標籤。改這個檔不會影響線上網站；匯入後請在管理頁編輯。 */
const AI = true;
export const merchants = [
  { id: 'jiangway', order: 10, published: true, featuredHome: true, group: 'food', sub: 'dining', image: 'assets/img/p-jipai.webp', homeImage: 'assets/img/p-dumplings.webp', imageAi: AI, tags: ['featured', 'affiliate'],
    name: { tw: '江味齋', en: 'JiangWay' },
    desc: { tw: '台灣家常味。主打炭烤雞排與水餃，純外帶，承接企業外燴。', en: 'Taiwanese home cooking. Charcoal-grilled chicken cutlets and dumplings. Takeaway only; corporate catering available.' },
    homeDesc: { tw: '炭烤雞排、手工水餃。純外帶，承接企業外燴。', en: 'Charcoal-grilled chicken cutlets and handmade dumplings. Takeaway only; corporate catering.' },
    meta: { tw: '餐飲 · 地址：新地址待補（搬遷中），請見官網', en: 'Food & Drink · Address: new address TBD (relocating), see website' },
    website: 'https://jiangway.netlify.app', phone: '', whatsapp: '',
    note: { tw: '電話待提供、地址搬遷中，請用官網聯絡', en: 'Phone TBD, address relocating – contact via website' } },
  ...[
    ['sample-sichuan', 'food', 'dining', 'p-dumplings', '範例川菜館', 'Sample Sichuan Kitchen', '麻辣川菜，內用外帶（虛構）。', 'Spicy Sichuan dishes, dine-in and takeaway (fictional).', '餐飲', 'Food'],
    ['sample-supermarket', 'food', 'groceries', 'p-tea', '範例亞洲超市', 'Sample Asian Supermarket', '華人食材與日用品（虛構）。', 'Chinese groceries and household goods (fictional).', '餐飲', 'Food'],
    ['sample-accounting', 'services', 'finance', 'p-health', '範例會計事務所', 'Sample Accounting Office', '個人與小企業報稅，中英服務（虛構）。', 'Personal and small-business tax, Chinese & English (fictional).', '生活服務', 'Services'],
    ['sample-immigration', 'services', 'legal', 'p-cargo', '範例移民顧問', 'Sample Immigration Consultant', '簽證與居留文件協助（虛構）。', 'Visa and residency paperwork help (fictional).', '生活服務', 'Services'],
    ['sample-solar', 'services', 'home', 'p-night', '範例太陽能安裝', 'Sample Solar Installer', '逆變器與電池安裝（虛構）。', 'Inverter and battery installation (fictional).', '生活服務', 'Services'],
    ['sample-school', 'other', 'education', 'p-shop', '範例中文補習班', 'Sample Chinese School', '兒童中文課程（虛構）。', 'Mandarin classes for children (fictional).', '其他', 'Other']
  ].map(([id, group, sub, img, ntw, nen, dtw, den, mtw, men], i) => ({
    id, order: 20 + i * 10, published: true, featuredHome: false, group, sub, image: 'assets/img/' + img + '.webp', imageAi: AI, tags: ['sample'],
    name: { tw: ntw, en: nen }, desc: { tw: dtw, en: den }, meta: { tw: mtw + ' · 虛構資料', en: men + ' · Fictional' },
    website: '', phone: '', whatsapp: '', note: { tw: '', en: '' } }))
];
export const slides = [
  { id: 'jiangway', order: 10, enabled: true, start: '', end: '', image: 'assets/img/p-jipai.webp', width: 800, height: 600, tags: ['featured', 'affiliate'],
    title: { tw: '江味齋\n炭烤雞排', en: 'JiangWay\ncharcoal-grilled chicken cutlet' },
    text: { tw: '台式家常味・手工水餃・純外帶・企業外燴', en: 'Taiwanese home cooking · handmade dumplings · takeaway only · corporate catering' },
    button: { tw: '前往官網點餐 →', en: 'Order on website →' }, link: 'https://jiangway.netlify.app', external: true, biz: '江味齋 JiangWay' },
  { id: 'sample-gift', order: 20, enabled: true, start: '', end: '', image: 'assets/img/p-gift.webp', width: 800, height: 600, tags: ['ad', 'sample'],
    title: { tw: '範例：開幕優惠\n全店 85 折', en: 'Sample: opening deal\n15% off everything' },
    text: { tw: '範例商家・虛構優惠，僅示意輪播效果', en: 'Fictional sample business and deal, for preview only' },
    button: { tw: '看優惠 →', en: 'See deals →' }, link: 'deals.html', external: false, biz: '' },
  { id: 'sample-night', order: 30, enabled: true, start: '', end: '', image: 'assets/img/p-night.webp', width: 800, height: 450, tags: ['event', 'sample'],
    title: { tw: '範例：週末夜市\n美食市集', en: 'Sample: weekend\nnight market' },
    text: { tw: '範例活動・虛構日期與地點，僅示意輪播效果', en: 'Fictional sample event, date and venue, for preview only' },
    button: { tw: '看活動 →', en: 'See events →' }, link: 'giveaway.html', external: false, biz: '' }
];
const TBD = { tw: '待商家確認', en: 'To be confirmed by business' };
export const deals = [
  { id: 'jiangway', order: 10, published: true, image: 'assets/img/p-jipai.webp', imageAi: AI, tags: ['featured', 'affiliate'],
    biz: { tw: '江味齋', en: 'JiangWay' }, desc: { tw: '台灣家常味：炭烤雞排、水餃。純外帶，承接企業外燴。', en: 'Taiwanese home cooking: charcoal-grilled chicken cutlets, dumplings. Takeaway only; corporate catering.' },
    offer: TBD, valid: TBD, claim: { tw: '出示此畫面或 WhatsApp 聯絡（方式待商家確認）', en: 'Show this screen or WhatsApp (method to be confirmed)' },
    meta: { tw: '地址：搬遷中，請見官網', en: 'Address: relocating, see website' }, website: 'https://jiangway.netlify.app',
    note: { tw: '電話待提供、地址搬遷中，請用官網聯絡', en: 'Phone TBD, address relocating – contact via website' } },
  { id: 'sample-a', order: 20, published: true, image: 'assets/img/p-dumplings.webp', imageAi: AI, tags: ['sample'], biz: { tw: '範例商家 A', en: 'Sample business A' }, desc: { tw: '', en: '' },
    offer: { tw: '首次服務九折（範例）', en: '10% off first service (sample)' }, valid: { tw: '範例', en: 'Sample' }, claim: { tw: '出示此畫面', en: 'Show this screen' }, meta: { tw: '生活服務', en: 'Services' }, website: '', note: { tw: '', en: '' } },
  { id: 'sample-b', order: 30, published: true, image: 'assets/img/p-tea.webp', imageAi: AI, tags: ['sample'], biz: { tw: '範例商家 B', en: 'Sample business B' }, desc: { tw: '', en: '' },
    offer: { tw: '買十送一（範例）', en: 'Buy 10 get 1 free (sample)' }, valid: { tw: '範例', en: 'Sample' }, claim: { tw: '出示此畫面', en: 'Show this screen' }, meta: { tw: '餐飲', en: 'Food & Drink' }, website: '', note: { tw: '', en: '' } }
];
export const site = {
  settings: {
    seeded: true,
    siteName: { tw: '約堡華人好康網', en: 'Joburg Chinese Life Guide' },
    contactWhatsapp: '', waGroup: '', waChannel: '',
    announcement: { on: false, tw: '', en: '', link: '' },
    maintenance: { on: false, tw: '網站維護中，部分功能暫停。', en: 'Site maintenance in progress – some features are paused.' },
    features: { carousel: true, deals: true, giveaway: true, guides: true, life: true, form_business: true, form_advertise: true, form_giveaway: true, adslots: true, share: true, mapview: true, water: true, board: false,
      cat_health: true, cat_beauty: true, cat_dining: true, cat_groceries: true, cat_legal: true, cat_finance: true, cat_home: true, cat_education: true },
    hidden: []
  },
  advertise: {
    intro: { tw: '直接向華人商家販售廣告位。價格由站方另行決定。', en: 'Ad placements sold directly to businesses. Pricing to be confirmed.' },
    rows: [
      { name: { tw: '首頁頂部橫幅', en: 'Homepage top banner' }, spec: '728×90 桌機 / 320×100 手機', price: '' },
      { name: { tw: '精選商家版位', en: 'Featured business slot' }, spec: '首頁與目錄置頂卡片 Pinned card', price: '' },
      { name: { tw: '目錄頁橫幅', en: 'Directory banner' }, spec: '728×90 / 320×100', price: '' },
      { name: { tw: '文章內橫幅', en: 'In-article banner' }, spec: '300×250', price: '' },
      { name: { tw: '業配文', en: 'Sponsored article' }, spec: '1 篇，標示「贊助」 Labelled “Sponsored”', price: '' },
      { name: { tw: 'AI 短片組合', en: 'Banner + AI short video' }, spec: '橫幅＋短片 Banner + video', price: '' }
    ],
    plans: [
      { name: { tw: '基本', en: 'Basic' }, desc: { tw: '目錄刊登＋精選標示 1 個月', en: 'Listing + featured badge, 1 month' }, price: '' },
      { name: { tw: '標準', en: 'Standard' }, desc: { tw: '橫幅＋精選商家版位', en: 'Banner + featured slot' }, price: '' },
      { name: { tw: '組合', en: 'Bundle' }, desc: { tw: '橫幅＋業配文＋AI 短片', en: 'Banner + sponsored article + AI video' }, price: '' }
    ]
  },
  giveaway: {
    banner: { tw: '即將推出 · 規則待法規確認', en: 'Coming soon · Rules pending legal review' },
    title: { tw: '抽獎活動（即將推出）', en: 'Giveaway (coming soon)' },
    rules: [
      { tw: '免費參加，不收報名費，不需購買任何商品。', en: 'Free entry; no entry fee; no purchase necessary.' },
      { tw: '活動期間：待定。', en: 'Entry period: TBD.' },
      { tw: '主辦方員工、顧問、供應商及其家屬不得參加。', en: 'Employees, consultants and suppliers of the organiser, and their families, may not enter.' },
      { tw: '以公平、隨機方式抽選，抽獎由獨立會計師或律師認證。', en: 'Winners drawn fairly at random; the draw is certified by an independent accountant or attorney.' },
      { tw: '得獎者於待定日期公布並以 WhatsApp 通知。', en: 'Winners announced on TBD and notified by WhatsApp.' },
      { tw: '活動紀錄保存 3 年。', en: 'Competition records are kept for 3 years.' },
      { tw: '個人資料依 POPIA 及本站隱私政策處理，僅用於本活動。', en: 'Personal information is processed under POPIA and our Privacy Policy, only for this giveaway.' },
      { tw: '獎品：待定。', en: 'Prize: TBD.' }
    ]
  }
};

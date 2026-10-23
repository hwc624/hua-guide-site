/* 首頁輪播 banner 資料（Homepage hero carousel slides）
 * 新增一張：複製下面任一個 { ... } 區塊貼到陣列裡，改圖片、文字、連結即可；要下架就刪掉那個區塊。
 * 順序就是輪播順序。第 1 張（江味齋）同時寫死在 index.html 裡（不用 JS 也看得到），改第 1 張時兩邊都要改。
 * tags 可填：featured（精選商家）、ad（廣告）、event（活動）、affiliate（經營者關係企業）、sample（範例，虛構資料必加）。
 * 只寫繁中（tw）與英文（en）；簡體會自動轉換。換行用 \n。
 * 管理頁（admin.html）啟用後，輪播改由 Firestore slides 集合提供，這個檔只在讀不到 Firestore 時當備援。只剩 1 張時，箭頭和圓點會自動隱藏。 */
window.HERO_SLIDES = [
  {
    image: 'assets/img/p-jipai.webp', width: 800, height: 600, alt: '',
    tags: ['featured', 'affiliate'],
    title: { tw: '江味齋\n炭烤雞排', en: 'JiangWay\ncharcoal-grilled chicken cutlet' },
    text: { tw: '台式家常味・手工水餃・純外帶・企業外燴', en: 'Taiwanese home cooking · handmade dumplings · takeaway only · corporate catering' },
    button: { tw: '前往官網點餐 →', en: 'Order on website →' },
    link: 'https://jiangway.netlify.app', external: true, biz: '江味齋 JiangWay'
  },
  {
    image: 'assets/img/p-gift.webp', width: 800, height: 600, alt: '',
    tags: ['ad', 'sample'],
    title: { tw: '範例：開幕優惠\n全店 85 折', en: 'Sample: opening deal\n15% off everything' },
    text: { tw: '範例商家・虛構優惠，僅示意輪播效果', en: 'Fictional sample business and deal, for preview only' },
    button: { tw: '看優惠 →', en: 'See deals →' },
    link: 'deals.html'
  },
  {
    image: 'assets/img/p-night.webp', width: 800, height: 450, alt: '',
    tags: ['event', 'sample'],
    title: { tw: '範例：週末夜市\n美食市集', en: 'Sample: weekend\nnight market' },
    text: { tw: '範例活動・虛構日期與地點，僅示意輪播效果', en: 'Fictional sample event, date and venue, for preview only' },
    button: { tw: '看活動 →', en: 'See events →' },
    link: 'giveaway.html'
  }
];

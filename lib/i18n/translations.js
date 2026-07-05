export const locales = ["zh-TW", "en"];
export const defaultLocale = "zh-TW";

export const localeLabels = {
  "zh-TW": "繁中",
  en: "EN",
};

export const translations = {
  "zh-TW": {
    meta: {
      title: "官方網站",
      description:
        "快節奏競技、全球聯機、極致畫面——立即下載，開啟冒險",
    },
    nav: {
      home: "首頁",
      download: "下載",
      contact: "聯繫",
    },
    hero: {
      badge: "現已開放下載",
      tagline: "下一代行動端 / PC 跨平台遊戲體驗",
      description:
        "快節奏競技、全球聯機、極致畫面——立即下載，開啟冒險",
      download: "立即下載",
      moments: "精彩瞬間",
      coverAlt: "遊戲封面",
    },
    features: {
      title: "核心賣點",
      subtitle: "為什麼選擇 {name}",
      items: [
        {
          title: "各類支付方式",
          desc: "我們提供各種存款和取款方式，您可以快速安全地完成交易。我們相信您可以找到您最喜愛的支付方式。",
        },
        {
          title: "安全和負責任地博彩",
          desc: "我們深受客戶和關鍵監管者的信賴。我們支持負責任博彩，提供各類安全的工具，確保客戶盡情享受博彩體驗。",
        },
        {
          title: "特別的優惠和獎金",
          desc: "我們為所有在網站註冊並滿足所有 1xBet 要求的成年客戶提供綜合性的獎金項目。豐厚的贏利等著您！",
        },
        {
          title: "各類遊戲",
          desc: "1xBet 中有 5,000 多款線上娛樂場遊戲，超大贏利等著您。其中包括老虎機、桌面遊戲和卡牌遊戲，僅限本娛樂場。我們會不斷添加新的遊戲豐富遊戲集合。",
        },
      ],
    },
    screenshots: {
      title: "遊戲截圖",
      subtitle: "一睹精彩遊戲畫面",
    },
    cta: {
      title: "準備好開始了嗎？",
      subtitle: "免費下載，即刻暢玩",
      button: "立即下載 {name}",
    },
    download: {
      metaTitle: "下載",
      metaDescription: "下載 {name}，支持 Android、iOS 和 PC 平台",
      title: "下載遊戲",
      subtitle: "選擇你的平台，掃碼或點擊連結即可下載",
      qrTitle: "掃碼下載",
      scanHint: "掃碼或點擊下載",
      directDownload: "直接下載 →",
      changelog: "更新日誌",
      platforms: {
        android: "Android 下載",
        ios: "iOS 下載",
        pc: "PC 版下載",
      },
      changelogItems: [
        { version: "v1.0.0", date: "2026-07-04", notes: "首發版本上線" },
        { version: "v0.9.0", date: "2026-06-15", notes: "公測版本，新增排位模式" },
      ],
    },
    contact: {
      metaTitle: "聯繫我們",
      metaDescription: "通過 Telegram 聯繫 {name} 團隊",
      title: "聯繫我們",
      subtitle: "有問題、反饋或合作需求？歡迎通過 Telegram 聯繫我們。",
      telegram: "Telegram",
    },
    footer: {
      copyright: "保留所有權利。",
    },
  },
  en: {
    meta: {
      title: "Official Website",
      description:
        "Fast-paced action, global multiplayer, stunning visuals — download now and start your adventure",
    },
    nav: {
      home: "Home",
      download: "Download",
      contact: "Contact",
    },
    hero: {
      badge: "Available Now",
      tagline: "Next-gen mobile & PC cross-platform gaming",
      description:
        "Fast-paced action, global multiplayer, stunning visuals — download now and start your adventure",
      download: "Download Now",
      moments: "Highlights",
      coverAlt: "Game cover",
    },
    features: {
      title: "Key Features",
      subtitle: "Why choose {name}",
      items: [
        {
          title: "Payment Methods",
          desc: "We offer a wide range of deposit and withdrawal options for fast, secure transactions. Find the payment method that works best for you.",
        },
        {
          title: "Safe & Responsible Gaming",
          desc: "Trusted by customers and regulators alike. We promote responsible gaming with secure tools to help you enjoy the experience.",
        },
        {
          title: "Bonuses & Promotions",
          desc: "Registered adult customers who meet all 1xBet requirements enjoy a comprehensive bonus program. Big wins await!",
        },
        {
          title: "Games Library",
          desc: "Over 5,000 online casino games with huge winning potential — slots, table games, card games and more. New titles added regularly.",
        },
      ],
    },
    screenshots: {
      title: "Screenshots",
      subtitle: "See the game in action",
    },
    cta: {
      title: "Ready to get started?",
      subtitle: "Free to download — play instantly",
      button: "Download {name}",
    },
    download: {
      metaTitle: "Download",
      metaDescription: "Download {name} for Android, iOS and PC",
      title: "Download",
      subtitle: "Choose your platform — scan the QR code or tap the link",
      qrTitle: "Scan to Download",
      scanHint: "Scan or tap to download",
      directDownload: "Download directly →",
      changelog: "Changelog",
      platforms: {
        android: "Android Download",
        ios: "iOS Download",
        pc: "PC Download",
      },
      changelogItems: [
        { version: "v1.0.0", date: "2026-07-04", notes: "Initial release" },
        { version: "v0.9.0", date: "2026-06-15", notes: "Public beta with ranked mode" },
      ],
    },
    contact: {
      metaTitle: "Contact Us",
      metaDescription: "Reach the {name} team via Telegram",
      title: "Contact Us",
      subtitle: "Questions, feedback or partnership inquiries? Reach us on Telegram.",
      telegram: "Telegram",
    },
    footer: {
      copyright: "All rights reserved.",
    },
  },
};

export function interpolate(text, vars = {}) {
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    text
  );
}

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
        "快節奏競技、全球聯機、極致畫面——立即註冊，開啟冒險",
    },
    nav: {
      home: "首頁",
      contact: "聯繫",
    },
    hero: {
      badge: "現已開放註冊",
      tagline: "下一代行動端 / PC 跨平台遊戲體驗",
      description:
        "快節奏競技、全球聯機、極致畫面——立即註冊，開啟冒險",
      register: "立即註冊",
      moments: "精彩瞬間",
      coverAlt: "遊戲封面",
    },
    promo: {
      label: "促銷代碼領 100% 優惠",
      copy: "點擊複製",
      copied: "已複製",
      hint: "註冊時輸入此代碼即可領取優惠",
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
      subtitle: "免費註冊，即刻暢玩",
      button: "立即註冊 {name}",
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
        "Fast-paced action, global multiplayer, stunning visuals — register now and start your adventure",
    },
    nav: {
      home: "Home",
      contact: "Contact",
    },
    hero: {
      badge: "Register Now",
      tagline: "Next-gen mobile & PC cross-platform gaming",
      description:
        "Fast-paced action, global multiplayer, stunning visuals — register now and start your adventure",
      register: "Register Now",
      moments: "Highlights",
      coverAlt: "Game cover",
    },
    promo: {
      label: "Promo code — get 100% bonus",
      copy: "Tap to copy",
      copied: "Copied",
      hint: "Enter this code when registering to claim your bonus",
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
      subtitle: "Free to register — play instantly",
      button: "Register {name}",
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

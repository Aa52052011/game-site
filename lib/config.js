export const siteConfig = {
  name: "你的游戏名称",
  tagline: "下一代移动端 / PC 跨平台游戏体验",
  description: "快节奏竞技、全球联机、极致画面——立即下载，开启冒险",

  video: {
    // 替换为实际宣传视频 URL（YouTube / Bilibili 嵌入链接）
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    poster: "/hero-cover.svg",
  },

  features: [
    { icon: "🔥", title: "极速战斗", desc: "流畅操作，毫秒级响应，每一场都酣畅淋漓" },
    { icon: "🎯", title: "竞技排位", desc: "公平匹配系统，挑战全球玩家，攀登排行榜" },
    { icon: "🌍", title: "全球联机", desc: "跨平台实时对战，与好友组队征服世界" },
    { icon: "⚔️", title: "丰富玩法", desc: "多种模式与地图，持续更新保持新鲜感" },
  ],

  screenshots: [
    { src: "/screenshots/shot-1.svg", alt: "游戏截图 1" },
    { src: "/screenshots/shot-2.svg", alt: "游戏截图 2" },
    { src: "/screenshots/shot-3.svg", alt: "游戏截图 3" },
    { src: "/screenshots/shot-4.svg", alt: "游戏截图 4" },
  ],

  downloads: {
    android: {
      label: "Android APK 下载",
      url: "https://yourgame.com/download/game.apk",
      color: "green",
    },
    ios: {
      label: "iOS 下载 (TestFlight)",
      url: "https://testflight.apple.com/join/yourcode",
      color: "blue",
    },
    pc: {
      label: "PC 版下载 (Steam)",
      url: "https://store.steampowered.com/app/yourgame",
      color: "purple",
    },
  },

  changelog: [
    { version: "v1.0.0", date: "2026-07-04", notes: "首发版本上线" },
    { version: "v0.9.0", date: "2026-06-15", notes: "公测版本，新增排位模式" },
  ],

  contact: {
    email: "support@yourgame.com",
    telegram: "@yourgame",
    discord: "https://discord.gg/yourgame",
    business: "biz@yourgame.com",
  },
};

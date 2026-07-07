export const locales = [
  "zh-TW",
  "en",
  "ar",
  "fr",
  "es",
  "pt",
  "ru",
  "ja",
  "ko",
  "ms",
  "hi",
  "id",
  "vi",
  "th",
];

export const defaultLocale = "zh-TW";

export const localeLabels = {
  "zh-TW": "繁體中文",
  en: "English",
  ar: "العربية",
  fr: "Français",
  es: "Español",
  pt: "Português",
  ru: "Русский",
  ja: "日本語",
  ko: "한국어",
  ms: "Bahasa Melayu",
  hi: "हिन्दी",
  id: "Bahasa Indonesia",
  vi: "Tiếng Việt",
  th: "ไทย",
};

export const htmlLangMap = {
  "zh-TW": "zh-Hant",
  en: "en",
  ar: "ar",
  fr: "fr",
  es: "es",
  pt: "pt",
  ru: "ru",
  ja: "ja",
  ko: "ko",
  ms: "ms",
  hi: "hi",
  id: "id",
  vi: "vi",
  th: "th",
};

export const rtlLocales = new Set(["ar"]);

export function getHtmlLang(locale) {
  return htmlLangMap[locale] || "en";
}

export function getTextDirection(locale) {
  return rtlLocales.has(locale) ? "rtl" : "ltr";
}

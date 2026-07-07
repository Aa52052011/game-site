export {
  locales,
  defaultLocale,
  localeLabels,
  htmlLangMap,
  rtlLocales,
  getHtmlLang,
  getTextDirection,
} from "./config.js";

export { translations } from "./messages/index.js";

export function interpolate(text, vars = {}) {
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    text
  );
}

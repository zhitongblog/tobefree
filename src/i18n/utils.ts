import { ui, defaultLang, type UiKey } from './ui';

export type Lang = keyof typeof ui;

export const locales = Object.keys(ui) as Lang[];

/** Extract the current locale from a URL like /zh/tools/obsidian. */
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang as Lang;
}

/** Returns a translator bound to a locale. Falls back to the default language. */
export function useTranslations(lang: Lang) {
  return function t(key: UiKey, vars?: Record<string, string | number>): string {
    let str: string = ui[lang][key] ?? ui[defaultLang as Lang][key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    }
    return str;
  };
}

/** Build a locale-prefixed path: localizedPath('zh', '/tools') -> '/zh/tools'. */
export function localizedPath(lang: Lang, path = ''): string {
  const clean = path.replace(/^\/+/, '');
  return clean ? `/${lang}/${clean}` : `/${lang}/`;
}

/** The other locale (for the language switcher). */
export function altLang(lang: Lang): Lang {
  return lang === 'zh' ? 'en' : 'zh';
}

/** Same page in the other language, preserving the sub-path. */
export function altLangPath(url: URL, lang: Lang): string {
  const rest = url.pathname.split('/').slice(2).join('/');
  return localizedPath(altLang(lang), rest);
}

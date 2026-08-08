import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext(null);
const LS_KEY = "melgara-lang";

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
      return saved === "am" ? "am" : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, lang);
    } catch {
      /* private mode — ignore */
    }
    document.documentElement.lang = lang === "am" ? "am" : "en";
    document.title =
      lang === "am"
        ? "ሜልጋራ | ማዕድን እና ማምረቻ | የመዳብ ማዕድን | አፍሪካ | ዱባይ"
        : "MELGARA | Mining & Manufacturing | Copper Ore | Africa | Dubai";
  }, [lang]);

  // Translate a UI string key, with optional {var} interpolation.
  const t = useCallback(
    (key, vars) => {
      let s =
        (translations[lang] && translations[lang][key]) ||
        (translations.en && translations.en[key]) ||
        key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          s = s.replaceAll(`{${k}}`, String(v));
        });
      }
      return s;
    },
    [lang]
  );

  // Pick the language-specific variant of a data object (falls back to English).
  const pick = useCallback(
    (obj) => (obj && obj[lang] ? obj[lang] : obj),
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t, pick, isAm: lang === "am" }),
    [lang, t, pick]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}

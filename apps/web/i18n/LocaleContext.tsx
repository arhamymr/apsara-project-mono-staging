'use client';
import React from 'react';
import type { Lang } from './types';

const STORAGE_KEY = 'app.lang';

type LocaleContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LocaleCtx = React.createContext<LocaleContextValue | null>(null);

export function useLocale(): LocaleContextValue {
  const ctx = React.useContext(LocaleCtx);
  if (!ctx) throw new Error('useLocale must be used within AppLocaleProvider');
  return ctx;
}

export function AppLocaleProvider({ children }: React.PropsWithChildren) {
  const [lang, setLangState] = React.useState<Lang>('en');

  React.useEffect(() => {
    try {
      const saved =
        (localStorage.getItem(STORAGE_KEY) as Lang | null) ||
        (localStorage.getItem('os.lang') as Lang | null) ||
        (localStorage.getItem('landing.lang') as Lang | null);
      if (saved === 'en' || saved === 'id') setLangState(saved);
    } catch {}
  }, []);

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
      localStorage.setItem('os.lang', l);
      localStorage.setItem('landing.lang', l);
    } catch {}
    try {
      window.dispatchEvent(new CustomEvent('app-lang-change', { detail: l }));
    } catch {}
  }, []);

  const value = React.useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>;
}

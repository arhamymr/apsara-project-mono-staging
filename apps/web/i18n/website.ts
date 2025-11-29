'use client';
import { useLocale } from './LocaleContext';

const STRINGS = {
  en: {
    tabs: {
      general: 'General',
      build: 'Build Page',
      theme: 'Theme',
      settings: 'Settings',
      blogs: 'Blogs',
    },
    actions: {
      buildPage: 'Build Page',
      saveDraft: 'Save as Draft',
      publish: 'Publish Website',
    },
  },
  id: {
    tabs: {
      general: 'Umum',
      build: 'Bangun Halaman',
      theme: 'Tema',
      settings: 'Pengaturan',
      blogs: 'Blog',
    },
    actions: {
      buildPage: 'Bangun Halaman',
      saveDraft: 'Simpan sebagai Draf',
      publish: 'Terbitkan Website',
    },
  },
} as const;

export function useWebsiteStrings() {
  const { lang } = useLocale();
  return STRINGS[lang];
}

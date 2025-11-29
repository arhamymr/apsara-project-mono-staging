/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocale } from '../LocaleContext';
import type { Lang } from '../types';

export const OS_STRINGS: Record<Lang, any> = {
  en: {
    topbar: { fallbackTitle: 'Desktop', langLabel: 'Language' },
    bootloader: {
      title: 'Starting Apsara Desktop…',
      caption: 'Preparing workspace',
      aria: 'Loading desktop',
    },
    dock: {
      closeAll: 'Close all windows',
      settings: 'Dock Settings',
      manageApps: 'Dock apps',
      configureDock: 'Configure dock apps',
    },
    window: {
      minimize: 'Minimize',
      maximize: 'Maximize',
      restore: 'Restore',
      close: 'Close',
    },
  },
  id: {
    topbar: { fallbackTitle: 'Desktop', langLabel: 'Bahasa' },
    bootloader: {
      title: 'Memulai Apsara Desktop…',
      caption: 'Menyiapkan ruang kerja',
      aria: 'Memuat desktop',
    },
    dock: {
      closeAll: 'Tutup semua jendela',
      settings: 'Pengaturan Dock',
      manageApps: 'Aplikasi Dock',
      configureDock: 'Atur aplikasi di Dock',
    },
    window: {
      minimize: 'Perkecil',
      maximize: 'Maksimalkan',
      restore: 'Kembalikan',
      close: 'Tutup',
    },
  },
};

export function useOSStrings() {
  const { lang } = useLocale();
  return OS_STRINGS[lang];
}

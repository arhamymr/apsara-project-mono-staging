'use client';
import { useLocale } from './LocaleContext';

const STRINGS = {
  en: {
    article: {
      titles: [
        'Designing with Grids',
        'The Component Mindset',
        'Color & Contrast',
        'Micro‑Interactions',
        'Systematize Typography',
        'Layout Patterns',
        'Motion for UI',
        'Design Tokens',
        'Figma Systems',
        'Responsive Web',
      ],
      dropHintTitle: 'Drag images or Unsplash links here to add',
      emptyDropHint: 'Drop images or Unsplash URLs here',
    },
    browser: {
      searchPrefix: 'Search:',
    },
    graphic: {
      title: 'Design smarter. Build faster.\nLaunch beautifully.',
      subtitle: 'Content assist that respects your craft.',
      cta: 'Get Started',
    },
    music: {
      queue: 'Queue',
      tracks: (n: number) => `${n} tracks`,
    },
  },
  id: {
    article: {
      titles: [
        'Mendesain dengan Grid',
        'Mindset Komponen',
        'Warna & Kontras',
        'Mikro‑Interaksi',
        'Sistematisasi Tipografi',
        'Pola Tata Letak',
        'Gerak untuk UI',
        'Token Desain',
        'Sistem Figma',
        'Web Responsif',
      ],
      dropHintTitle: 'Tarik gambar atau tautan Unsplash ke sini',
      emptyDropHint: 'Letakkan gambar atau URL Unsplash di sini',
    },
    browser: {
      searchPrefix: 'Cari:',
    },
    graphic: {
      title: 'Rancang lebih cerdas. Bangun lebih cepat.\nLuncurkan indah.',
      subtitle: 'Bantuan konten yang menghargai karya Anda.',
      cta: 'Mulai',
    },
    music: {
      queue: 'Antrean',
      tracks: (n: number) => `${n} lagu`,
    },
  },
} as const;

export function useAppsStrings() {
  const { lang } = useLocale();
  return STRINGS[lang];
}

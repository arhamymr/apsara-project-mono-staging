'use client';
import { useLocale } from './LocaleContext';

const STRINGS = {
  en: {
    website: {
      theme: { typography: 'Typography', color: 'Color' },
      onboarding: {
        yourWebsites: 'Your Websites',
        limitReached: 'Limit reached. Remove one to add a new website.',
        noWebsite: 'No Website Created',
        startWithTemplate: 'Start with Template',
        startWithTemplateDesc:
          'Choose a professionally designed template and customize it to match your brand.',
        pages: 'Pages',
        untitled: 'Untitled',
        loading: 'Loading websites…',
        retry: 'Try again',
        createWebsite: 'Create Website',
      },
    },
    kb: {
      nav: {
        collections: 'Collections',
        sources: 'Sources',
        syncs: 'Syncs',
        qa: 'Q&A Playground',
        settings: 'Settings',
      },
      quickStats: 'Quick Stats',
      stats: {
        sources: 'Sources',
        collections: 'Collections',
        chunks: 'Chunks',
        tokens: 'Tokens',
      },
      title: 'Knowledge Base',
      actions: { export: 'Export', runSync: 'Run Sync' },
      messages: {
        loading: 'Loading knowledge bases…',
        loadErrorTitle: 'Unable to load knowledge bases',
        loadErrorFallback: 'Something went wrong.',
        tryAgain: 'Try again',
      },
    },
    chatbot: {
      header: {
        title: 'AI Chatbot',
        subtitle:
          'Configure model, behavior, data sources, and guardrails. Changes take effect after saving.',
        disable: 'Disable Bot',
        reset: 'Reset',
        saving: 'Saving…',
        save: 'Save Settings',
      },
      tabs: {
        model: 'Model',
        tools: 'Tools',
        guardrails: 'Guardrails',
        sources: 'Sources',
        presets: 'Presets',
      },
    },
  },
  id: {
    website: {
      theme: { typography: 'Tipografi', color: 'Warna' },
      onboarding: {
        yourWebsites: 'Website Anda',
        limitReached:
          'Batas tercapai. Hapus salah satu untuk menambah yang baru.',
        noWebsite: 'Belum Ada Website',
        startWithTemplate: 'Mulai dengan Template',
        startWithTemplateDesc:
          'Pilih template profesional dan sesuaikan agar sesuai dengan brand Anda.',
        pages: 'Halaman',
        untitled: 'Tanpa Judul',
        loading: 'Memuat website…',
        retry: 'Coba lagi',
        createWebsite: 'Buat Website',
      },
    },
    kb: {
      nav: {
        collections: 'Koleksi',
        sources: 'Sumber',
        syncs: 'Sinkronisasi',
        qa: 'Ruang Uji T&J',
        settings: 'Pengaturan',
      },
      quickStats: 'Statistik Cepat',
      stats: {
        sources: 'Sumber',
        collections: 'Koleksi',
        chunks: 'Potongan',
        tokens: 'Token',
      },
      title: 'Basis Pengetahuan',
      actions: { export: 'Ekspor', runSync: 'Jalankan Sinkronisasi' },
      messages: {
        loading: 'Memuat basis pengetahuan…',
        loadErrorTitle: 'Gagal memuat basis pengetahuan',
        loadErrorFallback: 'Terjadi kesalahan.',
        tryAgain: 'Coba lagi',
      },
    },
    chatbot: {
      header: {
        title: 'AI Chatbot',
        subtitle:
          'Atur model, perilaku, sumber data, dan guardrails. Perubahan berlaku setelah disimpan.',
        disable: 'Nonaktifkan Bot',
        reset: 'Reset',
        saving: 'Menyimpan…',
        save: 'Simpan Pengaturan',
      },
      tabs: {
        model: 'Model',
        tools: 'Alat',
        guardrails: 'Guardrails',
        sources: 'Sumber',
        presets: 'Preset',
      },
    },
  },
} as const;

export function useDashboardStrings() {
  const { lang } = useLocale();
  return STRINGS[lang];
}

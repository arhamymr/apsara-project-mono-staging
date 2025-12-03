import type { Lang } from './types';
import type { TemplateStrings } from '@/components/templates/types';

export const TEMPLATES_STRINGS: Record<Lang, TemplateStrings> = {
  en: {
    hero: {
      title: 'Templates',
      subtitle: 'Browse our collection of professionally crafted templates.',
    },
    requestCard: {
      title: 'Need a Custom Template?',
      description: 'Let us create a unique template tailored to your specific needs.',
      button: 'Request Custom Template',
      whatsappMessage: 'Hi, I would like to request a custom template.',
    },
    modal: {
      download: 'Download Assets (ZIP)',
      openPreview: 'Open Preview',
      copyLink: 'Copy Link',
      linkCopied: 'Link copied!',
      previewUnavailable: 'Preview unavailable — open in new tab',
      author: 'Author',
      category: 'Category',
      fileSize: 'File Size',
      license: 'License',
    },
    cta: {
      title: 'Ready to Build Something Amazing?',
      subtitle: 'Start with our templates or let us create a custom solution for your business.',
      primaryButton: 'Get Started Free',
      secondaryButton: 'Contact Us',
    },
    empty: 'No templates yet. Try refreshing or check back later.',
    licenses: {
      free: 'Free',
      premium: 'Premium',
      commercial: 'Commercial',
    },
  },
  id: {
    hero: {
      title: 'Template',
      subtitle: 'Jelajahi koleksi template profesional kami.',
    },
    requestCard: {
      title: 'Butuh Template Kustom?',
      description: 'Kami dapat membuat template unik sesuai kebutuhan spesifik Anda.',
      button: 'Minta Template Kustom',
      whatsappMessage: 'Halo, saya ingin meminta template kustom.',
    },
    modal: {
      download: 'Unduh Aset (ZIP)',
      openPreview: 'Buka Pratinjau',
      copyLink: 'Salin Tautan',
      linkCopied: 'Tautan disalin!',
      previewUnavailable: 'Pratinjau tidak tersedia — buka di tab baru',
      author: 'Pembuat',
      category: 'Kategori',
      fileSize: 'Ukuran File',
      license: 'Lisensi',
    },
    cta: {
      title: 'Siap Membangun Sesuatu yang Luar Biasa?',
      subtitle: 'Mulai dengan template kami atau biarkan kami membuat solusi khusus untuk bisnis Anda.',
      primaryButton: 'Mulai Gratis',
      secondaryButton: 'Hubungi Kami',
    },
    empty: 'Belum ada template. Coba refresh atau kembali lagi nanti.',
    licenses: {
      free: 'Gratis',
      premium: 'Premium',
      commercial: 'Komersial',
    },
  },
};

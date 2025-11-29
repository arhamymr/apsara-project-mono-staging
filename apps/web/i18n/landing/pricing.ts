import type { Lang } from '../types';

export const PRICING_STRINGS: Record<Lang, any> = {
  en: {
    title: 'Flexible Pricing Options',
    subtitle: 'Choose the plan that fits your business needs and budget.',
    footnote: 'Custom enterprise solutions available. Contact us for details.',
    popular: 'Most Popular',
    tiers: [
      {
        name: 'Starter',
        desc: 'Perfect for individuals and small projects.',
        features: ['1 Active Project', 'Email Support', 'Basic Templates', '500MB Storage'],
        cta: 'Get Started',
      },
      {
        name: 'Professional',
        desc: 'Ideal for growing businesses and teams.',
        features: ['Unlimited Projects', 'Priority Support', 'Premium Templates', '10GB Storage', 'Advanced Analytics', 'Team Collaboration'],
        cta: 'Go Professional',
      },
    ],
  },
  id: {
    title: 'Opsi Harga Fleksibel',
    subtitle: 'Pilih paket yang sesuai dengan kebutuhan dan budget bisnis Anda.',
    footnote: 'Solusi enterprise kustom tersedia. Hubungi kami untuk detail.',
    popular: 'Paling Populer',
    tiers: [
      {
        name: 'Starter',
        desc: 'Cocok untuk individu dan proyek kecil.',
        features: ['1 Proyek Aktif', 'Dukungan Email', 'Template Dasar', 'Penyimpanan 500MB'],
        cta: 'Mulai Sekarang',
      },
      {
        name: 'Professional',
        desc: 'Ideal untuk bisnis dan tim yang berkembang.',
        features: ['Proyek Tak Terbatas', 'Dukungan Prioritas', 'Template Premium', 'Penyimpanan 10GB', 'Analitik Lanjutan', 'Kolaborasi Tim'],
        cta: 'Pilih Professional',
      },
    ],
  },
};

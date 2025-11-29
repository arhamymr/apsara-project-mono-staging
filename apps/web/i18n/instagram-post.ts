import type { Lang } from './types';

export const INSTAGRAM_POST_STRINGS: Record<
  Lang,
  {
    hero: { title: string; subtitle: string; cta: string; whatsapp_message: string };
    features: { title: string; subtitle: string; list: { title: string; description: string; icon: string }[] };
    services: { title: string; subtitle: string; list: { title: string; description: string }[] };
    pricing: {
      title: string;
      subtitle: string;
      basic: { title: string; price: string; unit: string; description: string; cta: string; features: string[] };
      premium: { title: string; price: string; unit: string; description: string; cta: string; features: string[] };
    };
    portfolio: { title: string; subtitle: string; items: { image: string; title: string; category: string }[] };
    cta: { title: string; subtitle: string; button: string };
  }
> = {
  en: {
    hero: {
      title: 'Professional Instagram Post Design',
      subtitle: 'Eye-catching, scroll-stopping Instagram content that elevates your brand. We specialize in creating stunning visual posts that drive engagement and grow your audience.',
      cta: 'Get Started',
      whatsapp_message: 'Hi, I need help creating Instagram post designs for my brand.',
    },
    features: {
      title: 'Why Choose Us',
      subtitle: 'Professional design services tailored for Instagram success.',
      list: [
        { title: 'Custom Designs', description: 'Unique, brand-aligned visuals crafted specifically for your Instagram aesthetic.', icon: 'Palette' },
        { title: 'Fast Turnaround', description: 'Quick delivery without compromising quality. Get your designs when you need them.', icon: 'Zap' },
        { title: 'Unlimited Revisions', description: 'We refine until you are 100% satisfied with the final result.', icon: 'RefreshCw' },
        { title: 'Multi-Format', description: 'Posts, carousels, stories, and reels covers - all formats covered.', icon: 'LayoutGrid' },
      ],
    },
    services: {
      title: 'Our Services',
      subtitle: 'Complete Instagram design solutions for your brand.',
      list: [
        { title: 'Single Post Design', description: 'Stunning individual posts that capture attention and communicate your message.' },
        { title: 'Carousel Posts', description: 'Multi-slide content that tells a story and keeps viewers swiping.' },
        { title: 'Story Templates', description: 'Engaging story designs that boost interaction and brand recall.' },
        { title: 'Feed Aesthetic', description: 'Cohesive grid planning for a visually stunning Instagram profile.' },
        { title: 'Promotional Graphics', description: 'Sale announcements, product launches, and event promotions.' },
        { title: 'Quote & Text Posts', description: 'Typography-focused designs that inspire and engage your audience.' },
      ],
    },
    pricing: {
      title: 'Simple Pricing',
      subtitle: 'Transparent rates for quality Instagram designs.',
      basic: {
        title: 'Per Post',
        price: 'IDR 50K',
        unit: '/design',
        description: 'Perfect for individual posts and one-time needs.',
        cta: 'Order Now',
        features: ['Single post design', 'Source file included', '2 revision rounds', '24-48h delivery'],
      },
      premium: {
        title: 'Monthly Package',
        price: 'IDR 500K',
        unit: '/month',
        description: 'Best value for consistent content creators.',
        cta: 'Subscribe',
        features: ['12 posts per month', 'Carousel included', 'Unlimited revisions', 'Priority support', 'Brand guidelines'],
      },
    },
    portfolio: {
      title: 'Our Work',
      subtitle: 'See examples of our Instagram designs.',
      items: [
        { image: '/images/portfolio/ig-1.jpg', title: 'Product Launch', category: 'Promotional' },
        { image: '/images/portfolio/ig-2.jpg', title: 'Brand Story', category: 'Carousel' },
        { image: '/images/portfolio/ig-3.jpg', title: 'Quote Design', category: 'Typography' },
        { image: '/images/portfolio/ig-4.jpg', title: 'Sale Announcement', category: 'Promotional' },
        { image: '/images/portfolio/ig-5.jpg', title: 'Lifestyle Post', category: 'Single Post' },
        { image: '/images/portfolio/ig-6.jpg', title: 'Event Promo', category: 'Story' },
      ],
    },
    cta: { title: 'Ready to Transform Your Instagram?', subtitle: 'Let us create stunning visuals that make your brand stand out.', button: 'Contact Us Now' },
  },
  id: {
    hero: {
      title: 'Desain Post Instagram Profesional',
      subtitle: 'Konten Instagram yang menarik perhatian dan meningkatkan brand Anda. Kami spesialis membuat desain visual yang memukau untuk meningkatkan engagement dan followers.',
      cta: 'Mulai Sekarang',
      whatsapp_message: 'Halo, saya butuh bantuan membuat desain post Instagram untuk brand saya.',
    },
    features: {
      title: 'Mengapa Pilih Kami',
      subtitle: 'Layanan desain profesional untuk kesuksesan Instagram Anda.',
      list: [
        { title: 'Desain Custom', description: 'Visual unik yang sesuai dengan estetika brand Instagram Anda.', icon: 'Palette' },
        { title: 'Pengerjaan Cepat', description: 'Pengiriman cepat tanpa mengorbankan kualitas.', icon: 'Zap' },
        { title: 'Revisi Unlimited', description: 'Kami perbaiki sampai Anda 100% puas dengan hasilnya.', icon: 'RefreshCw' },
        { title: 'Multi-Format', description: 'Post, carousel, story, dan cover reels - semua format tersedia.', icon: 'LayoutGrid' },
      ],
    },
    services: {
      title: 'Layanan Kami',
      subtitle: 'Solusi desain Instagram lengkap untuk brand Anda.',
      list: [
        { title: 'Desain Post Tunggal', description: 'Post individual yang menarik perhatian dan menyampaikan pesan Anda.' },
        { title: 'Post Carousel', description: 'Konten multi-slide yang bercerita dan membuat viewers terus swipe.' },
        { title: 'Template Story', description: 'Desain story yang meningkatkan interaksi dan brand recall.' },
        { title: 'Estetika Feed', description: 'Perencanaan grid yang kohesif untuk profil Instagram yang memukau.' },
        { title: 'Grafis Promosi', description: 'Pengumuman sale, peluncuran produk, dan promosi event.' },
        { title: 'Post Quote & Teks', description: 'Desain tipografi yang menginspirasi dan engage audiens Anda.' },
      ],
    },
    pricing: {
      title: 'Harga Sederhana',
      subtitle: 'Tarif transparan untuk desain Instagram berkualitas.',
      basic: {
        title: 'Per Post',
        price: 'Rp 50 Ribu',
        unit: '/desain',
        description: 'Cocok untuk post individual dan kebutuhan sekali pakai.',
        cta: 'Pesan Sekarang',
        features: ['Desain single post', 'File sumber disertakan', '2 putaran revisi', 'Pengiriman 24-48 jam'],
      },
      premium: {
        title: 'Paket Bulanan',
        price: 'Rp 500 Ribu',
        unit: '/bulan',
        description: 'Nilai terbaik untuk content creator konsisten.',
        cta: 'Berlangganan',
        features: ['12 post per bulan', 'Carousel termasuk', 'Revisi unlimited', 'Dukungan prioritas', 'Brand guidelines'],
      },
    },
    portfolio: {
      title: 'Karya Kami',
      subtitle: 'Lihat contoh desain Instagram kami.',
      items: [
        { image: '/images/portfolio/ig-1.jpg', title: 'Peluncuran Produk', category: 'Promosi' },
        { image: '/images/portfolio/ig-2.jpg', title: 'Cerita Brand', category: 'Carousel' },
        { image: '/images/portfolio/ig-3.jpg', title: 'Desain Quote', category: 'Tipografi' },
        { image: '/images/portfolio/ig-4.jpg', title: 'Pengumuman Sale', category: 'Promosi' },
        { image: '/images/portfolio/ig-5.jpg', title: 'Post Lifestyle', category: 'Single Post' },
        { image: '/images/portfolio/ig-6.jpg', title: 'Promo Event', category: 'Story' },
      ],
    },
    cta: { title: 'Siap Transformasi Instagram Anda?', subtitle: 'Biarkan kami membuat visual memukau yang membuat brand Anda menonjol.', button: 'Hubungi Kami Sekarang' },
  },
};

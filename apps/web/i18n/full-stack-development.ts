import type { Lang } from './types';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface Service {
  title: string;
  description: string;
}

interface TechItem {
  name: string;
  category: string;
}

interface PricingTier {
  title: string;
  price: string;
  unit: string;
  description: string;
  cta: string;
  note?: string;
  features: string[];
}

interface TrustBadge {
  label: string;
  icon: string;
}

interface WorkflowStep {
  number: string;
  title: string;
  description: string;
}

export interface FullStackDevelopmentStrings {
  trustBadges: TrustBadge[];
  workflow: {
    title: string;
    subtitle: string;
    steps: WorkflowStep[];
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    whatsapp_message: string;
  };
  features: {
    title: string;
    subtitle: string;
    list: Feature[];
  };
  services: {
    title: string;
    subtitle: string;
    list: Service[];
  };
  pricing: {
    title: string;
    subtitle: string;
    hourly: PricingTier;
    project: PricingTier;
  };
  techStack: {
    title: string;
    subtitle: string;
    list: TechItem[];
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
}

export const FULL_STACK_DEVELOPMENT_STRINGS: Record<Lang, FullStackDevelopmentStrings> = {
  en: {
    trustBadges: [
      { icon: 'Clock', label: '24-48h Response' },
      { icon: 'Shield', label: 'Secure Development' },
      { icon: 'MessageCircle', label: 'Free Consultation' },
      { icon: 'Sparkles', label: 'Modern Tech Stack' },
    ],
    workflow: {
      title: 'Our Development Process',
      subtitle: 'A proven methodology to deliver quality results.',
      steps: [
        { number: '01', title: 'Discovery', description: 'We analyze your requirements, define project scope, and create a detailed technical roadmap.' },
        { number: '02', title: 'Design', description: 'Architecture planning, database design, and UI/UX wireframes for your application.' },
        { number: '03', title: 'Development', description: 'Agile development with regular updates, code reviews, and continuous integration.' },
        { number: '04', title: 'Deployment', description: 'Launch to production with monitoring, documentation, and ongoing support.' },
      ],
    },
    hero: {
      title: 'Full-Stack Web Development',
      subtitle:
        'Build powerful, scalable web applications from frontend to backend. We deliver complete solutions using modern technologies like React, Next.js, Node.js, and cloud infrastructure.',
      cta: 'Start Your Project',
      whatsapp_message: 'Hi, I need help building a full-stack web application.',
    },
    features: {
      title: 'Why Choose Our Full-Stack Services',
      subtitle:
        'End-to-end development expertise with a focus on performance, scalability, and user experience.',
      list: [
        {
          title: 'Modern Tech Stack',
          description:
            'React, Next.js, TypeScript, Node.js, and cloud-native technologies for robust applications.',
          icon: 'Code2',
        },
        {
          title: 'Scalable Architecture',
          description:
            'Build applications that grow with your business using microservices and serverless patterns.',
          icon: 'Server',
        },
        {
          title: 'Database Design',
          description:
            'Expert database modeling with PostgreSQL, MongoDB, and Redis for optimal data management.',
          icon: 'Database',
        },
        {
          title: 'Cloud Deployment',
          description:
            'Deploy to AWS, Vercel, or your preferred cloud with CI/CD pipelines and monitoring.',
          icon: 'Cloud',
        },
      ],
    },
    services: {
      title: 'Our Full-Stack Services',
      subtitle:
        'Comprehensive development solutions covering every aspect of your web application.',
      list: [
        { title: 'Frontend Development', description: 'Beautiful, responsive UIs with React, Next.js, and modern CSS frameworks.' },
        { title: 'Backend Development', description: 'Robust APIs and server-side logic with Node.js, Express, and serverless functions.' },
        { title: 'Database Architecture', description: 'Design and implement efficient database schemas and data access layers.' },
        { title: 'Authentication & Security', description: 'Secure user authentication, authorization, and data protection.' },
        { title: 'Third-Party Integrations', description: 'Connect with payment gateways, CRMs, analytics, and other services.' },
        { title: 'Performance Optimization', description: 'Optimize load times, caching strategies, and overall application performance.' },
      ],
    },
    pricing: {
      title: 'Flexible Pricing Options',
      subtitle: 'Choose the engagement model that works best for your project.',
      hourly: {
        title: 'Hourly Rate',
        price: 'IDR 1M',
        unit: 'starting from',
        description: 'Ideal for ongoing development, maintenance, and feature additions.',
        cta: 'Book Hours',
        features: ['Flexible scheduling', 'Direct communication', 'Detailed time tracking', 'No minimum hours'],
      },
      project: {
        title: 'Project-Based',
        price: 'IDR 5M',
        unit: 'starting from',
        description: 'Fixed-price projects with clear scope, timeline, and deliverables.',
        cta: 'Get Quote',
        note: '* Final pricing depends on project complexity and requirements',
        features: ['Fixed project scope', 'Milestone payments', 'Priority support', 'Revision rounds included'],
      },
    },
    techStack: {
      title: 'Technologies We Use',
      subtitle: 'Modern tools and frameworks to build robust applications.',
      list: [
        { name: 'React', category: 'Frontend' },
        { name: 'TypeScript', category: 'Language' },
        { name: 'JavaScript', category: 'Language' },
        { name: 'Tailwind CSS', category: 'Styling' },
        { name: 'shadcn/ui', category: 'UI Library' },
        { name: 'Expo', category: 'Mobile' },
        { name: 'Go', category: 'Backend' },
        { name: 'Laravel', category: 'Backend' },
        { name: 'Svelte', category: 'Frontend' },
        { name: 'Inertia.js', category: 'Framework' },
        { name: 'Figma', category: 'Design' },
        { name: 'AI Integration', category: 'AI' },
      ],
    },
    cta: {
      title: 'Ready to Build Your Application?',
      subtitle: 'Let\'s discuss your project requirements and create a roadmap for success.',
      button: 'Schedule Consultation',
    },
  },
  id: {
    trustBadges: [
      { icon: 'Clock', label: 'Respon 24-48 Jam' },
      { icon: 'Shield', label: 'Pengembangan Aman' },
      { icon: 'MessageCircle', label: 'Konsultasi Gratis' },
      { icon: 'Sparkles', label: 'Teknologi Modern' },
    ],
    workflow: {
      title: 'Proses Pengembangan Kami',
      subtitle: 'Metodologi terbukti untuk hasil berkualitas.',
      steps: [
        { number: '01', title: 'Analisis', description: 'Kami menganalisis kebutuhan Anda, menentukan scope proyek, dan membuat roadmap teknis.' },
        { number: '02', title: 'Desain', description: 'Perencanaan arsitektur, desain database, dan wireframe UI/UX untuk aplikasi Anda.' },
        { number: '03', title: 'Pengembangan', description: 'Pengembangan agile dengan update rutin, code review, dan continuous integration.' },
        { number: '04', title: 'Deployment', description: 'Peluncuran ke production dengan monitoring, dokumentasi, dan dukungan berkelanjutan.' },
      ],
    },
    hero: {
      title: 'Full-Stack Web Development',
      subtitle:
        'Kami membangun aplikasi web lengkap dari tampilan depan hingga sistem backend. Menggunakan teknologi terkini seperti React, Next.js, Node.js, dan cloud infrastructure.',
      cta: 'Mulai Proyek',
      whatsapp_message: 'Halo, saya ingin membuat aplikasi web full-stack.',
    },
    features: {
      title: 'Kenapa Pilih Kami',
      subtitle:
        'Tim berpengalaman yang fokus pada performa, skalabilitas, dan pengalaman pengguna terbaik.',
      list: [
        {
          title: 'Teknologi Terkini',
          description:
            'React, Next.js, TypeScript, Node.js, dan teknologi cloud untuk aplikasi yang handal.',
          icon: 'Code2',
        },
        {
          title: 'Siap Berkembang',
          description:
            'Arsitektur yang dirancang untuk tumbuh bersama bisnis Anda dengan microservices dan serverless.',
          icon: 'Server',
        },
        {
          title: 'Database Optimal',
          description:
            'Perancangan database dengan PostgreSQL, MongoDB, dan Redis untuk performa maksimal.',
          icon: 'Database',
        },
        {
          title: 'Deploy ke Cloud',
          description:
            'Deployment ke AWS, Vercel, atau cloud pilihan Anda dengan CI/CD dan monitoring.',
          icon: 'Cloud',
        },
      ],
    },
    services: {
      title: 'Layanan Kami',
      subtitle:
        'Solusi lengkap untuk setiap kebutuhan aplikasi web Anda.',
      list: [
        { title: 'Frontend', description: 'Tampilan menarik dan responsif dengan React, Next.js, dan CSS framework modern.' },
        { title: 'Backend', description: 'API dan logika server yang handal dengan Node.js, Express, dan serverless.' },
        { title: 'Database', description: 'Perancangan dan implementasi database yang efisien dan terstruktur.' },
        { title: 'Keamanan', description: 'Sistem login yang aman, otorisasi, dan perlindungan data pengguna.' },
        { title: 'Integrasi', description: 'Koneksi dengan payment gateway, CRM, analytics, dan layanan lainnya.' },
        { title: 'Optimasi', description: 'Percepat loading, caching, dan tingkatkan performa aplikasi secara keseluruhan.' },
      ],
    },
    pricing: {
      title: 'Pilihan Harga',
      subtitle: 'Pilih model kerja sama yang paling sesuai untuk proyek Anda.',
      hourly: {
        title: 'Per Jam',
        price: 'Rp 1 Juta',
        unit: 'mulai dari',
        description: 'Cocok untuk pengembangan berkelanjutan, perbaikan, dan penambahan fitur.',
        cta: 'Pesan Sekarang',
        features: ['Jadwal fleksibel', 'Komunikasi langsung', 'Tracking waktu detail', 'Tanpa minimum jam'],
      },
      project: {
        title: 'Per Proyek',
        price: 'Rp 5 Juta',
        unit: 'mulai dari',
        description: 'Harga tetap dengan scope, timeline, dan hasil yang jelas.',
        cta: 'Minta Penawaran',
        note: '* Harga disesuaikan dengan kompleksitas dan kebutuhan proyek',
        features: ['Scope proyek tetap', 'Pembayaran per milestone', 'Dukungan prioritas', 'Revisi termasuk'],
      },
    },
    techStack: {
      title: 'Teknologi yang Kami Gunakan',
      subtitle: 'Tools dan framework modern untuk membangun aplikasi yang handal.',
      list: [
        { name: 'React', category: 'Frontend' },
        { name: 'TypeScript', category: 'Bahasa' },
        { name: 'JavaScript', category: 'Bahasa' },
        { name: 'Tailwind CSS', category: 'Styling' },
        { name: 'shadcn/ui', category: 'UI Library' },
        { name: 'Expo', category: 'Mobile' },
        { name: 'Go', category: 'Backend' },
        { name: 'Laravel', category: 'Backend' },
        { name: 'Svelte', category: 'Frontend' },
        { name: 'Inertia.js', category: 'Framework' },
        { name: 'Figma', category: 'Desain' },
        { name: 'AI Integration', category: 'AI' },
      ],
    },
    cta: {
      title: 'Siap Membuat Aplikasi?',
      subtitle: 'Konsultasikan kebutuhan proyek Anda dan mari wujudkan bersama.',
      button: 'Konsultasi Gratis',
    },
  },
};

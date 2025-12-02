import type { Lang } from './types';

interface MobileAppDevelopmentStrings {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    whatsapp_message: string;
  };
  features: {
    title: string;
    subtitle: string;
    list: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
  };
  services: {
    title: string;
    subtitle: string;
    list: Array<{
      title: string;
      description: string;
    }>;
  };
  techStack: {
    title: string;
    subtitle: string;
    list: Array<{
      name: string;
      category: string;
    }>;
  };
  pricing: {
    title: string;
    subtitle: string;
    hourly: {
      title: string;
      price: string;
      unit: string;
      description: string;
      cta: string;
    };
    project: {
      title: string;
      price: string;
      unit: string;
      description: string;
      cta: string;
      note?: string;
    };
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
}

export const MOBILE_APP_DEVELOPMENT_STRINGS: Record<Lang, MobileAppDevelopmentStrings> = {
  en: {
    hero: {
      title: 'React Native Mobile Development',
      subtitle:
        'Build powerful, cross-platform mobile apps with React Native. One codebase for iOS and Android with native performance, faster development cycles, and cost-effective solutions.',
      cta: 'Start Your App',
      whatsapp_message: 'Hi, I need help building a React Native mobile application.',
    },
    features: {
      title: 'Why Choose React Native',
      subtitle:
        'Leverage the power of React Native for efficient, high-quality mobile app development.',
      list: [
        {
          title: 'Cross-Platform Excellence',
          description:
            'Write once, run on both iOS and Android with up to 90% code sharing between platforms.',
          icon: 'Layers',
        },
        {
          title: 'Native Performance',
          description:
            'React Native compiles to native code, delivering smooth 60fps animations and fast load times.',
          icon: 'Zap',
        },
        {
          title: 'Hot Reloading',
          description:
            'Faster development with instant preview of changes without rebuilding the entire app.',
          icon: 'RefreshCw',
        },
        {
          title: 'Rich Ecosystem',
          description:
            'Access thousands of npm packages and native modules for any functionality you need.',
          icon: 'Package',
        },
      ],
    },
    services: {
      title: 'Our React Native Services',
      subtitle:
        'End-to-end React Native development from concept to App Store and Play Store launch.',
      list: [
        { title: 'Custom App Development', description: 'Tailored React Native apps built from scratch to match your unique requirements.' },
        { title: 'UI/UX Implementation', description: 'Pixel-perfect designs with smooth animations using React Native Reanimated and Gesture Handler.' },
        { title: 'Expo & Bare Workflow', description: 'Choose between Expo for rapid development or bare workflow for full native control.' },
        { title: 'State Management', description: 'Scalable architecture with Redux, Zustand, or React Query for optimal data flow.' },
        { title: 'Native Module Integration', description: 'Bridge native iOS/Android code when you need platform-specific features.' },
        { title: 'App Store Deployment', description: 'Complete submission and approval process for Apple App Store and Google Play Store.' },
      ],
    },
    techStack: {
      title: 'Our React Native Tech Stack',
      subtitle: 'Modern tools and libraries for robust mobile development.',
      list: [
        { name: 'React Native', category: 'Framework' },
        { name: 'Expo', category: 'Development Platform' },
        { name: 'TypeScript', category: 'Language' },
        { name: 'React Navigation', category: 'Navigation' },
        { name: 'Reanimated', category: 'Animations' },
        { name: 'React Query', category: 'Data Fetching' },
        { name: 'Zustand', category: 'State Management' },
        { name: 'NativeWind', category: 'Styling' },
      ],
    },
    pricing: {
      title: 'React Native App Pricing',
      subtitle: 'Transparent pricing for your mobile development needs.',
      hourly: {
        title: 'Hourly Rate',
        price: 'IDR 175K',
        unit: '/hour',
        description: 'Flexible engagement for feature development, bug fixes, and maintenance.',
        cta: 'Book Hours',
      },
      project: {
        title: 'Full App Project',
        price: 'IDR 12M',
        unit: 'starting from',
        description: 'Complete React Native app with design implementation, development, and deployment.',
        cta: 'Get Quote',
        note: '* Pricing varies based on app complexity, features, and third-party integrations',
      },
    },
    cta: {
      title: 'Ready to Build with React Native?',
      subtitle: 'Launch your app on iOS and Android simultaneously with a single codebase.',
      button: 'Discuss Your App',
    },
  },
  id: {
    hero: {
      title: 'Pembuatan Aplikasi React Native',
      subtitle:
        'Bangun aplikasi mobile cross-platform dengan React Native. Satu codebase untuk iOS dan Android dengan performa native, pengembangan lebih cepat, dan biaya lebih hemat.',
      cta: 'Buat Aplikasi Sekarang',
      whatsapp_message: 'Halo, saya ingin membuat aplikasi mobile dengan React Native.',
    },
    features: {
      title: 'Kenapa Pilih React Native',
      subtitle:
        'Manfaatkan keunggulan React Native untuk pengembangan aplikasi mobile yang efisien dan berkualitas.',
      list: [
        {
          title: 'Cross-Platform Unggul',
          description:
            'Tulis sekali, jalankan di iOS dan Android dengan hingga 90% kode yang sama.',
          icon: 'Layers',
        },
        {
          title: 'Performa Native',
          description:
            'React Native dikompilasi ke kode native, menghasilkan animasi 60fps dan loading cepat.',
          icon: 'Zap',
        },
        {
          title: 'Hot Reloading',
          description:
            'Pengembangan lebih cepat dengan preview instan tanpa rebuild seluruh aplikasi.',
          icon: 'RefreshCw',
        },
        {
          title: 'Ekosistem Lengkap',
          description:
            'Akses ribuan package npm dan modul native untuk berbagai kebutuhan fitur.',
          icon: 'Package',
        },
      ],
    },
    services: {
      title: 'Layanan React Native Kami',
      subtitle:
        'Pengembangan React Native dari konsep hingga peluncuran di App Store dan Play Store.',
      list: [
        { title: 'Pembuatan Aplikasi Custom', description: 'Aplikasi React Native yang dibuat khusus sesuai kebutuhan unik Anda.' },
        { title: 'Implementasi UI/UX', description: 'Desain pixel-perfect dengan animasi halus menggunakan Reanimated dan Gesture Handler.' },
        { title: 'Expo & Bare Workflow', description: 'Pilih Expo untuk pengembangan cepat atau bare workflow untuk kontrol native penuh.' },
        { title: 'State Management', description: 'Arsitektur scalable dengan Redux, Zustand, atau React Query untuk alur data optimal.' },
        { title: 'Integrasi Native Module', description: 'Bridge kode native iOS/Android saat butuh fitur spesifik platform.' },
        { title: 'Deployment App Store', description: 'Proses submission lengkap ke Apple App Store dan Google Play Store.' },
      ],
    },
    techStack: {
      title: 'Tech Stack React Native Kami',
      subtitle: 'Tools dan library modern untuk pengembangan mobile yang solid.',
      list: [
        { name: 'React Native', category: 'Framework' },
        { name: 'Expo', category: 'Platform Pengembangan' },
        { name: 'TypeScript', category: 'Bahasa' },
        { name: 'React Navigation', category: 'Navigasi' },
        { name: 'Reanimated', category: 'Animasi' },
        { name: 'React Query', category: 'Data Fetching' },
        { name: 'Zustand', category: 'State Management' },
        { name: 'NativeWind', category: 'Styling' },
      ],
    },
    pricing: {
      title: 'Biaya Aplikasi React Native',
      subtitle: 'Harga transparan sesuai kebutuhan proyek Anda.',
      hourly: {
        title: 'Per Jam',
        price: 'Rp 175 Ribu',
        unit: '/jam',
        description: 'Fleksibel untuk pengembangan fitur, perbaikan bug, dan pemeliharaan.',
        cta: 'Pesan Sekarang',
      },
      project: {
        title: 'Per Proyek',
        price: 'Rp 12 Juta',
        unit: 'mulai dari',
        description: 'Aplikasi React Native lengkap dengan implementasi desain, pengembangan, dan deployment.',
        cta: 'Minta Penawaran',
        note: '* Harga disesuaikan dengan kompleksitas dan integrasi pihak ketiga',
      },
    },
    cta: {
      title: 'Siap Membangun dengan React Native?',
      subtitle: 'Luncurkan aplikasi Anda di iOS dan Android secara bersamaan dengan satu codebase.',
      button: 'Konsultasi Gratis',
    },
  },
};

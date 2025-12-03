import type { Lang } from './types';

interface ApiDevelopmentStrings {
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

export const API_DEVELOPMENT_STRINGS: Record<Lang, ApiDevelopmentStrings> = {
  en: {
    hero: {
      title: 'API Development & Integration',
      subtitle:
        'Build robust, secure, and scalable APIs that power your applications. We specialize in REST, GraphQL, and real-time APIs with comprehensive documentation and security.',
      cta: 'Build Your API',
      whatsapp_message: 'Hi, I need help building or integrating APIs.',
    },
    features: {
      title: 'Why Choose Our API Services',
      subtitle:
        'Expert API development with focus on security, performance, and developer experience.',
      list: [
        {
          title: 'REST APIs',
          description:
            'Well-designed RESTful APIs following industry best practices and standards.',
          icon: 'Globe',
        },
        {
          title: 'GraphQL APIs',
          description:
            'Flexible GraphQL APIs for efficient data fetching and real-time subscriptions.',
          icon: 'GitBranch',
        },
        {
          title: 'Security First',
          description:
            'OAuth 2.0, JWT authentication, rate limiting, and comprehensive security measures.',
          icon: 'Shield',
        },
        {
          title: 'Documentation',
          description:
            'Auto-generated API documentation with OpenAPI/Swagger for easy integration.',
          icon: 'FileText',
        },
      ],
    },
    services: {
      title: 'Our API Services',
      subtitle:
        'Complete API solutions from design to deployment and maintenance.',
      list: [
        { title: 'API Design', description: 'Design scalable API architectures following REST or GraphQL best practices.' },
        { title: 'API Development', description: 'Build high-performance APIs with Node.js, Python, or your preferred stack.' },
        { title: 'Authentication & Security', description: 'Implement OAuth 2.0, JWT, API keys, and security best practices.' },
        { title: 'Third-Party Integration', description: 'Connect with payment gateways, social platforms, and external services.' },
        { title: 'API Documentation', description: 'Comprehensive documentation with Swagger/OpenAPI specifications.' },
        { title: 'Performance Optimization', description: 'Caching, rate limiting, and optimization for high-traffic APIs.' },
      ],
    },
    pricing: {
      title: 'API Development Pricing',
      subtitle: 'Flexible pricing for your API development and integration needs.',
      hourly: {
        title: 'Hourly Rate',
        price: 'IDR 1M',
        unit: 'starting from',
        description: 'Ideal for API integrations, enhancements, and maintenance.',
        cta: 'Book Hours',
      },
      project: {
        title: 'API Project',
        price: 'IDR 3M',
        unit: 'starting from',
        description: 'Complete API development with design, implementation, and documentation.',
        cta: 'Get Quote',
        note: '* Pricing depends on API complexity, endpoints, and integration requirements',
      },
    },
    cta: {
      title: 'Ready to Build Your API?',
      subtitle: 'Let\'s create a powerful API that connects your systems and enables growth.',
      button: 'Start API Project',
    },
  },
  id: {
    hero: {
      title: 'Pembuatan & Integrasi API',
      subtitle:
        'Kami membangun API yang handal, aman, dan siap untuk skala besar. Berpengalaman dalam REST, GraphQL, dan API real-time dengan dokumentasi lengkap.',
      cta: 'Buat API Sekarang',
      whatsapp_message: 'Halo, saya butuh bantuan untuk membuat atau mengintegrasikan API.',
    },
    features: {
      title: 'Kenapa Pilih Layanan API Kami',
      subtitle:
        'Tim berpengalaman yang mengutamakan keamanan, performa, dan kemudahan integrasi.',
      list: [
        {
          title: 'REST API',
          description:
            'API RESTful yang dirancang sesuai standar industri dan mudah diintegrasikan.',
          icon: 'Globe',
        },
        {
          title: 'GraphQL API',
          description:
            'API GraphQL yang fleksibel untuk pengambilan data yang efisien dan real-time.',
          icon: 'GitBranch',
        },
        {
          title: 'Keamanan Terjamin',
          description:
            'Dilengkapi OAuth 2.0, JWT, rate limiting, dan standar keamanan terbaik.',
          icon: 'Shield',
        },
        {
          title: 'Dokumentasi Lengkap',
          description:
            'Dokumentasi otomatis dengan OpenAPI/Swagger untuk kemudahan integrasi.',
          icon: 'FileText',
        },
      ],
    },
    services: {
      title: 'Layanan API Kami',
      subtitle:
        'Solusi API menyeluruh dari perancangan hingga deployment dan pemeliharaan.',
      list: [
        { title: 'Perancangan API', description: 'Arsitektur API yang terstruktur dan siap untuk berkembang.' },
        { title: 'Pembuatan API', description: 'API berkinerja tinggi dengan Node.js, Python, atau teknologi pilihan Anda.' },
        { title: 'Keamanan & Autentikasi', description: 'Implementasi OAuth 2.0, JWT, API keys, dan standar keamanan terbaik.' },
        { title: 'Integrasi Layanan Lain', description: 'Koneksi dengan payment gateway, media sosial, dan layanan pihak ketiga.' },
        { title: 'Dokumentasi API', description: 'Dokumentasi lengkap dengan spesifikasi Swagger/OpenAPI.' },
        { title: 'Optimasi Performa', description: 'Caching, rate limiting, dan optimasi untuk traffic tinggi.' },
      ],
    },
    pricing: {
      title: 'Biaya Pembuatan API',
      subtitle: 'Pilihan harga yang fleksibel sesuai kebutuhan proyek Anda.',
      hourly: {
        title: 'Per Jam',
        price: 'Rp 1 Juta',
        unit: 'mulai dari',
        description: 'Cocok untuk integrasi, perbaikan, dan pemeliharaan API.',
        cta: 'Pesan Sekarang',
      },
      project: {
        title: 'Per Proyek',
        price: 'Rp 3 Juta',
        unit: 'mulai dari',
        description: 'Pembuatan API lengkap termasuk perancangan, implementasi, dan dokumentasi.',
        cta: 'Minta Penawaran',
        note: '* Harga disesuaikan dengan kompleksitas dan kebutuhan integrasi',
      },
    },
    cta: {
      title: 'Siap Membuat API?',
      subtitle: 'Wujudkan API yang menghubungkan sistem Anda dan mendukung pertumbuhan bisnis.',
      button: 'Mulai Proyek',
    },
  },
};

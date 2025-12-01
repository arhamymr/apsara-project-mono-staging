import type { Lang } from './types';

export const API_DEVELOPMENT_STRINGS: Record<Lang, any> = {
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
        price: 'IDR 150K',
        unit: '/hour',
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
      title: 'Pengembangan & Integrasi API',
      subtitle:
        'Bangun API yang robust, aman, dan scalable untuk mendukung aplikasi Anda. Kami ahli dalam REST, GraphQL, dan API real-time dengan dokumentasi lengkap dan keamanan.',
      cta: 'Bangun API Anda',
      whatsapp_message: 'Halo, saya butuh bantuan untuk membangun atau mengintegrasikan API.',
    },
    features: {
      title: 'Mengapa Memilih Layanan API Kami',
      subtitle:
        'Pengembangan API ahli dengan fokus pada keamanan, performa, dan pengalaman developer.',
      list: [
        {
          title: 'REST APIs',
          description:
            'API RESTful yang dirancang dengan baik mengikuti best practices dan standar industri.',
          icon: 'Globe',
        },
        {
          title: 'GraphQL APIs',
          description:
            'API GraphQL yang fleksibel untuk pengambilan data efisien dan subscription real-time.',
          icon: 'GitBranch',
        },
        {
          title: 'Keamanan Utama',
          description:
            'OAuth 2.0, autentikasi JWT, rate limiting, dan langkah keamanan komprehensif.',
          icon: 'Shield',
        },
        {
          title: 'Dokumentasi',
          description:
            'Dokumentasi API yang di-generate otomatis dengan OpenAPI/Swagger untuk integrasi mudah.',
          icon: 'FileText',
        },
      ],
    },
    services: {
      title: 'Layanan API Kami',
      subtitle:
        'Solusi API lengkap dari desain hingga deployment dan maintenance.',
      list: [
        { title: 'Desain API', description: 'Desain arsitektur API yang scalable mengikuti best practices REST atau GraphQL.' },
        { title: 'Pengembangan API', description: 'Bangun API berperforma tinggi dengan Node.js, Python, atau stack pilihan Anda.' },
        { title: 'Autentikasi & Keamanan', description: 'Implementasi OAuth 2.0, JWT, API keys, dan best practices keamanan.' },
        { title: 'Integrasi Pihak Ketiga', description: 'Koneksi dengan payment gateway, platform sosial, dan layanan eksternal.' },
        { title: 'Dokumentasi API', description: 'Dokumentasi komprehensif dengan spesifikasi Swagger/OpenAPI.' },
        { title: 'Optimasi Performa', description: 'Caching, rate limiting, dan optimasi untuk API dengan traffic tinggi.' },
      ],
    },
    pricing: {
      title: 'Harga Pengembangan API',
      subtitle: 'Harga fleksibel untuk kebutuhan pengembangan dan integrasi API Anda.',
      hourly: {
        title: 'Tarif Per Jam',
        price: 'Rp 150 Ribu',
        unit: '/jam',
        description: 'Ideal untuk integrasi API, peningkatan, dan maintenance.',
        cta: 'Pesan Jam',
      },
      project: {
        title: 'Proyek API',
        price: 'Rp 3 Juta',
        unit: 'mulai dari',
        description: 'Pengembangan API lengkap dengan desain, implementasi, dan dokumentasi.',
        cta: 'Dapatkan Penawaran',
        note: '* Harga tergantung pada kompleksitas API, endpoints, dan kebutuhan integrasi',
      },
    },
    cta: {
      title: 'Siap Membangun API Anda?',
      subtitle: 'Mari buat API yang powerful untuk menghubungkan sistem Anda dan memungkinkan pertumbuhan.',
      button: 'Mulai Proyek API',
    },
  },
};

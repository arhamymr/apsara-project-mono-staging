import type { Lang } from '../types';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQStrings {
  title: string;
  items: FAQItem[];
}

export const FAQ_STRINGS: Record<Lang, FAQStrings> = {
  en: {
    title: 'Frequently Asked Questions',
    items: [
      { q: 'What is Apsara Digital?', a: 'Apsara Digital is an all-in-one application and set of tools for building your online presence. From professional websites and AI automation to operations, marketing tools, and custom applications — everything you need to establish and grow your business online.' },
      { q: 'Who are you and what do you do?', a: 'I\'m a solo developer specializing in web development, AI integration, and automation solutions. I work directly with clients to deliver high-quality, personalized digital solutions without the overhead of a large agency.' },
      { q: 'Why should I hire a solo developer instead of an agency?', a: 'Working with me means direct communication, faster turnaround, competitive pricing, and personalized attention to your project. You\'ll always know who\'s working on your project and can reach me directly for any questions or updates.' },
      { q: 'How long does it take to build a website?', a: 'Timeline depends on complexity. Simple landing pages can be delivered in 3-5 days, while full websites typically take 1-2 weeks. Custom web applications may require 4-8 weeks. I\'ll provide a clear timeline estimate during our initial consultation.' },
      { q: 'What services do you offer?', a: 'I specialize in custom website development, web applications, AI chatbot integration, workflow automation, RAG systems (chat with your data), and website repair/optimization. All solutions are tailored to your specific business needs.' },
      { q: 'Can you fix or improve my existing website?', a: 'Absolutely. I provide website repair, optimization, and enhancement services. This includes fixing bugs, improving performance, adding new features, SEO optimization, and making sites mobile-responsive.' },
      { q: 'How does the consultation process work?', a: 'The free consultation includes a discussion of your project requirements, technical recommendations, timeline estimates, and a detailed quote. There\'s no obligation to proceed - it\'s simply an opportunity to explore how I can help your business.' },
      { q: 'What technologies do you work with?', a: 'I work with modern web technologies including React, Next.js, TypeScript, Node.js, and various AI platforms like OpenAI, Anthropic, and Google. I choose the best tools for each project to ensure optimal results.' },
      { q: 'How do we communicate during the project?', a: 'I maintain clear and consistent communication throughout the project via your preferred channel (email, WhatsApp, or video calls). You\'ll receive regular updates and have direct access to me for any questions or feedback.' },
    ],
  },
  id: {
    title: 'Pertanyaan yang Sering Diajukan',
    items: [
      { q: 'Apa itu Apsara Digital?', a: 'Apsara Digital adalah aplikasi dan seperangkat tools lengkap untuk membangun persona online Anda. Dari website profesional dan otomatisasi AI hingga operasional, tools marketing, dan aplikasi kustom — semua yang Anda butuhkan untuk membangun dan mengembangkan bisnis online Anda.' },
      { q: 'Siapa Anda dan apa yang Anda kerjakan?', a: 'Saya adalah solo developer yang mengkhususkan diri dalam pengembangan web, integrasi AI, dan solusi otomatisasi. Saya bekerja langsung dengan klien untuk memberikan solusi digital berkualitas tinggi dan personal tanpa biaya overhead agensi besar.' },
      { q: 'Mengapa saya harus menyewa solo developer daripada agensi?', a: 'Bekerja dengan saya berarti komunikasi langsung, penyelesaian lebih cepat, harga kompetitif, dan perhatian personal untuk proyek Anda. Anda akan selalu tahu siapa yang mengerjakan proyek Anda dan bisa menghubungi saya langsung untuk pertanyaan atau update.' },
      { q: 'Berapa lama waktu yang dibutuhkan untuk membuat website?', a: 'Timeline tergantung pada kompleksitas. Landing page sederhana dapat diselesaikan dalam 3-5 hari, sementara website lengkap biasanya membutuhkan 1-2 minggu. Aplikasi web kustom mungkin memerlukan 4-8 minggu. Saya akan memberikan estimasi timeline yang jelas saat konsultasi awal.' },
      { q: 'Layanan apa saja yang Anda tawarkan?', a: 'Saya mengkhususkan diri dalam pengembangan website kustom, aplikasi web, integrasi chatbot AI, otomatisasi workflow, sistem RAG (chat dengan data Anda), dan perbaikan/optimasi website. Semua solusi disesuaikan dengan kebutuhan bisnis spesifik Anda.' },
      { q: 'Bisakah Anda memperbaiki atau meningkatkan website saya yang sudah ada?', a: 'Tentu saja. Saya menyediakan layanan perbaikan, optimasi, dan peningkatan website. Ini termasuk memperbaiki bug, meningkatkan performa, menambah fitur baru, optimasi SEO, dan membuat situs responsif untuk mobile.' },
      { q: 'Bagaimana proses konsultasinya?', a: 'Konsultasi gratis mencakup diskusi kebutuhan proyek Anda, rekomendasi teknis, estimasi timeline, dan penawaran detail. Tidak ada kewajiban untuk melanjutkan - ini hanya kesempatan untuk mengeksplorasi bagaimana saya bisa membantu bisnis Anda.' },
      { q: 'Teknologi apa yang Anda gunakan?', a: 'Saya bekerja dengan teknologi web modern termasuk React, Next.js, TypeScript, Node.js, dan berbagai platform AI seperti OpenAI, Anthropic, dan Google. Saya memilih tools terbaik untuk setiap proyek untuk memastikan hasil optimal.' },
      { q: 'Bagaimana komunikasi selama proyek berlangsung?', a: 'Saya menjaga komunikasi yang jelas dan konsisten sepanjang proyek melalui channel pilihan Anda (email, WhatsApp, atau video call). Anda akan menerima update rutin dan memiliki akses langsung ke saya untuk pertanyaan atau feedback.' },
    ],
  },
};

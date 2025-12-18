export const SKILLS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Figma',
  'shadcn/ui',
  'Expo',
  'Go',
  'Laravel',
  'Svelte',
  'Inertia.js',
  'AI Integration',
];

export const EXPERIENCE = [
  {
    company: 'Telkom Indonesia',
    role: 'Frontend Developer',
    period: 'Jul 2020 – Present',
    location: 'Jakarta',
    contract: 'Contract via PT Infomedia Solusi Humanika',
    highlights: [
      'Delivered features using Agile/Scrum methodology with daily standups, sprint planning, and retrospectives',
      'Managed tasks and backlog breakdown using JIRA for efficient project tracking',
      'Built a scalable design system aligned with business requirements',
      'Implemented real-time search functionality with React and Next.js',
      'Authored automated and unit tests to ensure code stability and maintainability',
      'Partnered with the marketing team to optimize SEO performance',
      'Refactored and strengthened application security architecture',
    ],
  },
  {
    company: 'Gakken Health & Education Indonesia',
    role: 'Frontend Developer',
    period: 'Sep 2019 – Jan 2020',
    location: 'Makassar',
    highlights: [
      'Developed and maintained production codebase using Next.js',
      'Designed user interfaces in Figma for seamless developer handoff',
      'Built dynamic components with React Hooks, Context API, and Styled Components',
      'Created responsive layouts optimized for multiple devices and browsers',
      'Collaborated closely with the design team to deliver polished user experiences',
    ],
  },
  {
    company: 'Docotel Teknologi Celebes',
    role: 'Frontend Developer',
    period: 'Jan 2019 – Aug 2019',
    location: 'Makassar',
    highlights: [
      'Translated UI designs into reusable React components',
      'Integrated RESTful APIs with frontend components',
      'Resolved bugs and improved overall user experience',
      'Delivered new features on schedule to meet business objectives',
    ],
  },
];

export const FREELANCE_PROJECTS = [
  {
    name: 'Apsara Digital',
    year: '2025',
    description:
      'Full-stack platform with landing page and dashboard built on Laravel and Svelte',
    url: 'https://apsara.digital',
  },
  {
    name: 'Oratif.id',
    year: '2025',
    description: 'Corporate landing page developed with Laravel',
    url: 'https://oratif.id',
  },
  {
    name: 'MyMete',
    year: '2024',
    description: 'Mobile app with admin dashboard for content management',
    url: 'https://mymete.app',
  },
  {
    name: 'Serpul',
    year: '2023',
    description:
      'Custom payment platform with authentication and API integration using Next.js and Chakra UI',
    url: 'https://serpul.id',
  },
  {
    name: 'Syarihub.id',
    year: '2023',
    description:
      'Progressive web app for Quran learning with Next.js, Chakra UI, and Laravel backend',
    url: 'https://syarihub.id',
  },
];

export const SOCIALS = [
  { icon: 'github', href: 'https://github.com/arhamymr', label: 'GitHub' },
  {
    icon: 'linkedin',
    href: 'https://www.linkedin.com/in/arhamymr',
    label: 'LinkedIn',
  },
  { icon: 'blog', href: 'https://medium.com/@arhamymr', label: 'Blog' },
  { icon: 'mail', href: 'mailto:arhamymr@gmail.com', label: 'Email' },
];

export const PORTFOLIO_GALLERY = [
  {
    title: 'Dashboard Design',
    category: 'UI/UX',
    image: 'https://placehold.co/600x400/1a1a1a/00c950?text=Dashboard',
  },
  {
    title: 'Mobile App',
    category: 'Mobile',
    image: 'https://placehold.co/600x400/1a1a1a/00c950?text=Mobile+App',
  },
  {
    title: 'Landing Page',
    category: 'Web',
    image: 'https://placehold.co/600x400/1a1a1a/00c950?text=Landing+Page',
  },
  {
    title: 'E-commerce',
    category: 'Web',
    image: 'https://placehold.co/600x400/1a1a1a/00c950?text=E-commerce',
  },
  {
    title: 'Design System',
    category: 'UI/UX',
    image: 'https://placehold.co/600x400/1a1a1a/00c950?text=Design+System',
  },
  {
    title: 'Admin Panel',
    category: 'Web',
    image: 'https://placehold.co/600x400/1a1a1a/00c950?text=Admin+Panel',
  },
];

import { getWhatsAppUrl } from '@/lib/utils';

export const CONTACT_INFO = {
  location: 'Jakarta Barat',
  phone: '(+62) 89669594959',
  whatsapp: getWhatsAppUrl(),
  email: 'arhamymr@gmail.com',
};

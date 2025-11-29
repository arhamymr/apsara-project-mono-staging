import { Background, Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Calendar,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Moon,
  Phone,
  Sun,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const SKILLS = [
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

const EXPERIENCE = [
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

const FREELANCE_PROJECTS = [
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

const SOCIALS = [
  { icon: Github, href: 'https://github.com/arhamymr', label: 'GitHub' },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/arhamymr',
    label: 'LinkedIn',
  },
  { icon: BookOpen, href: 'https://medium.com/@arhamymr', label: 'Blog' },
  { icon: Mail, href: 'mailto:arhamymr@gmail.com', label: 'Email' },
];

const PORTFOLIO_GALLERY = [
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

export default function PortfolioPage() {
  const [isDark, setIsDark] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(true);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    const dark = stored === 'dark' || (!stored && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingBar(!entry.isIntersecting);
      },
      { threshold: 0.3 },
    );

    if (contactRef.current) {
      observer.observe(contactRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  return (
    <>
      <Head title="Arham - Frontend Developer & UI/UX Designer | Portfolio" />
      <div className="bg-background text-foreground relative min-h-dvh overflow-hidden">
        <Background />

        {/* Floating bottom navbar */}
        <div
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
            showFloatingBar
              ? 'translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-20 opacity-0'
          }`}
        >
          <div className="bg-background/80 border-border flex items-center gap-2 rounded-full border px-2 py-2 shadow-lg backdrop-blur-md">
            <button
              onClick={toggleTheme}
              className="hover:bg-muted rounded-full p-2.5 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <Button size="sm" className="rounded-full px-4" asChild>
              <a
                href="https://wa.me/6289669594959"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get In Touch
              </a>
            </Button>
          </div>
        </div>
        <main className="relative z-10 mx-auto max-w-2xl px-4 py-8">
          <div className="border-border relative overflow-hidden rounded-2xl border">
            {/* Spinning logo */}
            <img
              src="/logo.svg"
              alt="Logo"
              className="pointer-events-none absolute -top-[250px] -right-[200px] size-128 w-auto animate-spin opacity-50 [animation-duration:30s]"
            />
            <HeroSection />
            <SkillsSection />
            <PortfolioGallery />
            <ExperienceSection />
            <FreelanceSection />
            <div ref={contactRef}>
              <ContactSection />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function HeroSection() {
  const fadeUp = useFadeUp();

  return (
    <Section className="flex min-h-[80vh] items-center justify-center">
      <div className="container mx-auto px-4">
        <motion.div
          {...fadeUp}
          className="flex flex-col items-center text-center"
        >
          <Badge variant="outline" className="mb-4">
            Designer & Developer
          </Badge>
          <h1 className="mb-2 text-2xl tracking-tight md:text-4xl">
            Muhammad Arham
          </h1>

          <div className="text-muted-foreground mb-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Jakarta Barat
            </span>
            <a
              href="https://wa.me/6289669594959"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary flex items-center gap-1 transition-colors"
            >
              <Phone className="h-4 w-4" />
              (+62) 89669594959
            </a>
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              arhamymr@gmail.com
            </span>
          </div>
          <p className="text-muted-foreground max-w-2xl text-lg md:text-xl">
            Designer and developer with 5+ years of experience. I can support
            your project from UI/UX design all the way to code implementation,
            including AI integration.
          </p>
          <div className="mt-8 flex gap-4">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-primary/10 hover:text-primary rounded-full p-3 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function SkillsSection() {
  const fadeUp = useFadeUp();

  return (
    <Section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <h2 className="text-2xl tracking-tight md:text-3xl">
            Skills & Technologies
          </h2>
        </motion.div>
        <motion.div
          {...fadeUp}
          className="mx-auto flex max-w-2xl flex-wrap justify-center gap-3"
        >
          {SKILLS.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="bg-muted hover:bg-primary/10 hover:text-primary cursor-default rounded-full px-4 py-2 text-sm transition-colors"
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

function PortfolioGallery() {
  const fadeUp = useFadeUp();

  return (
    <Section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <h2 className="text-2xl tracking-tight md:text-3xl">
            Design Portfolio
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            A selection of my recent design work
          </p>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-2">
          {PORTFOLIO_GALLERY.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl"
            >
              <img
                src={item.image}
                alt={item.title}
                className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Badge variant="secondary" className="mb-2 w-fit text-xs">
                  {item.category}
                </Badge>
                <h3 className="text-sm font-medium text-white">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ExperienceSection() {
  const fadeUp = useFadeUp();

  return (
    <Section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <h2 className="text-2xl tracking-tight md:text-3xl">
            Work Experience
          </h2>
        </motion.div>
        <div className="mx-auto max-w-3xl space-y-8">
          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-background border-border hover:border-foreground/30 rounded-xl border p-6 transition-colors"
            >
              <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-medium">{exp.company}</h3>
                  {exp.contract && (
                    <p className="text-muted-foreground text-xs">
                      {exp.contract}
                    </p>
                  )}
                </div>
                <Badge variant="secondary">{exp.role}</Badge>
              </div>
              <div className="text-muted-foreground mb-4 flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {exp.period}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {exp.location}
                </span>
              </div>
              <ul className="text-muted-foreground space-y-2 text-sm">
                {exp.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function FreelanceSection() {
  const fadeUp = useFadeUp();

  return (
    <Section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <h2 className="text-2xl tracking-tight md:text-3xl">
            Freelance Projects
          </h2>
        </motion.div>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {FREELANCE_PROJECTS.map((project, i) => (
            <motion.a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-background border-border hover:border-foreground/30 group block rounded-xl border p-6 transition-colors"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{project.name}</h3>
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {project.year}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {project.description}
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ContactSection() {
  const fadeUp = useFadeUp();

  return (
    <Section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto max-w-md text-center">
          <Briefcase className="text-primary mx-auto mb-4 h-12 w-12" />
          <h2 className="mb-4 text-2xl tracking-tight md:text-3xl">
            Let's Collaborate
          </h2>
          <p className="text-muted-foreground mb-4">
            Have a project in mind? I'd love to discuss how we can work
            together.
          </p>

          <Button size="lg" asChild>
            <a
              href="https://wa.me/6289669594959"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get In Touch
            </a>
          </Button>
        </motion.div>
      </div>
    </Section>
  );
}

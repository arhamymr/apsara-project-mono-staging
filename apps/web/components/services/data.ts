import type { LucideIcon } from 'lucide-react';
import {
  Clock,
  FileText,
  GitBranch,
  Globe,
  Lock,
  MessageCircle,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Zap,
  Code,
  Layers,
  Database,
  Cloud,
  Palette,
  Monitor,
  Cpu,
  Settings,
  Users,
} from 'lucide-react';
import type { TrustBadge, WorkflowStep, TechItem } from './service-page-components';

// Common trust badges
export const API_TRUST_BADGES: TrustBadge[] = [
  { icon: Clock, label: '24-48h Response' },
  { icon: Shield, label: 'Secure APIs' },
  { icon: MessageCircle, label: 'Free Consultation' },
  { icon: Sparkles, label: 'Modern Standards' },
];

export const MOBILE_TRUST_BADGES: TrustBadge[] = [
  { icon: Clock, label: '24-48h Response' },
  { icon: Smartphone, label: 'Cross-Platform' },
  { icon: MessageCircle, label: 'Free Consultation' },
  { icon: Sparkles, label: 'Modern Tech' },
];

export const FULLSTACK_TRUST_BADGES: TrustBadge[] = [
  { icon: Clock, label: '24-48h Response' },
  { icon: Layers, label: 'Full Stack' },
  { icon: MessageCircle, label: 'Free Consultation' },
  { icon: Sparkles, label: 'Modern Stack' },
];

// Icon maps for features
export const API_ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  GitBranch,
  Shield,
  FileText,
  Server,
  Lock,
  Zap,
};

export const MOBILE_ICON_MAP: Record<string, LucideIcon> = {
  Smartphone,
  Code,
  Zap,
  Shield,
  Cloud,
  Palette,
};

export const FULLSTACK_ICON_MAP: Record<string, LucideIcon> = {
  Monitor,
  Server,
  Database,
  Cloud,
  Shield,
  Zap,
  Code,
  Layers,
};

// Service icons
export const API_SERVICE_ICONS: LucideIcon[] = [Globe, Server, Lock, GitBranch, FileText, Zap];
export const MOBILE_SERVICE_ICONS: LucideIcon[] = [Smartphone, Code, Palette, Cloud, Settings, Users];
export const FULLSTACK_SERVICE_ICONS: LucideIcon[] = [Monitor, Server, Database, Cloud, Shield, Cpu];

// Workflow steps
export const API_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    number: '01',
    title: 'API Design',
    description: 'Define endpoints, data models, authentication, and create OpenAPI specifications.',
  },
  {
    number: '02',
    title: 'Development',
    description: 'Build secure, performant APIs with proper error handling and validation.',
  },
  {
    number: '03',
    title: 'Testing',
    description: 'Comprehensive testing including unit, integration, and load testing.',
  },
  {
    number: '04',
    title: 'Deployment',
    description: 'Deploy with monitoring, rate limiting, and auto-generated documentation.',
  },
];

export const MOBILE_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    number: '01',
    title: 'Discovery',
    description: 'Understand your requirements, target audience, and define the app scope.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Create wireframes, UI/UX designs, and interactive prototypes.',
  },
  {
    number: '03',
    title: 'Development',
    description: 'Build the app with clean code, testing, and iterative feedback.',
  },
  {
    number: '04',
    title: 'Launch',
    description: 'Deploy to app stores with ongoing support and maintenance.',
  },
];

export const FULLSTACK_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    number: '01',
    title: 'Planning',
    description: 'Define requirements, architecture, and technology stack.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Create UI/UX designs and database schemas.',
  },
  {
    number: '03',
    title: 'Development',
    description: 'Build frontend, backend, and integrate all components.',
  },
  {
    number: '04',
    title: 'Deployment',
    description: 'Deploy, monitor, and provide ongoing maintenance.',
  },
];

// Pricing features
export const API_HOURLY_FEATURES = [
  'Flexible scheduling',
  'Direct communication',
  'Detailed time tracking',
  'No minimum hours',
];

export const API_PROJECT_FEATURES = [
  'Complete API design',
  'Full documentation',
  'Security implementation',
  'Deployment support',
];

export const MOBILE_HOURLY_FEATURES = [
  'Flexible scheduling',
  'Direct communication',
  'Detailed time tracking',
  'No minimum hours',
];

export const MOBILE_PROJECT_FEATURES = [
  'Complete app design',
  'iOS & Android builds',
  'App store submission',
  'Post-launch support',
];

export const FULLSTACK_HOURLY_FEATURES = [
  'Flexible scheduling',
  'Direct communication',
  'Detailed time tracking',
  'No minimum hours',
];

export const FULLSTACK_PROJECT_FEATURES = [
  'Complete solution',
  'Frontend & Backend',
  'Database design',
  'Deployment & DevOps',
];

// Tech stack items
export const COMMON_TECH_ITEMS: TechItem[] = [
  { name: 'React', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Next.js', category: 'Framework' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'AWS', category: 'Cloud' },
];

// Default icons
export const DEFAULT_FEATURE_ICON = Globe;
export const DEFAULT_SERVICE_ICON = Server;

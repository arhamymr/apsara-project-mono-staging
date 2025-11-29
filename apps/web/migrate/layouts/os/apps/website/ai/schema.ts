// ai/schema.ts
import { z } from 'zod';

/** 👇 Your strict enums */
export const ThemeId = z.enum([
  'light',
  'dark',
  'sakura',
  'sakura-dark',
  'ocean',
  'ocean-dark',
  'amber',
  'amber-dark',
  'apsara',
  'apsara-dark',
]);

export const TypographyId = z.enum([
  'sans',
  'serif',
  'mono',
  'inter',
  'roboto',
  'poppins',
  'lato',
  'montserrat',
  'open-sans',
  'raleway',
  'nunito',
  'merriweather',
  'playfair',
  'fira-code',
  'source-code',
  'work-sans',
  'rubik',
  'manrope',
  'ubuntu',
  'josefin',
]);

/** Reusable link + simple unions for your sections */
const NavLink = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
});

const Logo = z.object({
  src: z.string().url(),
  scale: z.number().default(1),
  padding: z.number().default(0),
});

const SocialLink = z.object({
  kind: z
    .enum([
      'instagram',
      'twitter',
      'x',
      'github',
      'linkedin',
      'facebook',
      'youtube',
      'website',
    ])
    .optional(),
  label: z.string(),
  href: z.string(),
});

/** Footer link groups */
const FooterLink = z.object({
  label: z.string(),
  href: z.string(),
});
const LinkGroup = z.object({
  title: z.string(),
  links: z.array(FooterLink),
});

/** Section unions (minimal to match your example) */
const SectionHero = z.object({
  id: z.string(),
  type: z.literal('hero'),
  props: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    primaryButton: z.object({ label: z.string(), href: z.string() }).optional(),
    secondaryButton: z
      .object({ label: z.string(), href: z.string() })
      .optional(),
    showButton: z.boolean().optional(),
    buttonText: z.string().optional(),
    buttonHref: z.string().optional(),
    align: z.enum(['left', 'center', 'right']).optional(),
    eyebrow: z
      .object({
        label: z.string(),
        icon: z.string().optional(),
      })
      .optional(),
    meta: z.string().optional(),
  }),
});

const FeatureCardLogo = z.object({
  id: z.string(),
  type: z.literal('logo'),
  label: z.string(),
  logo: z.string(),
});
const FeatureCardIcon = z.object({
  id: z.string(),
  type: z.literal('icon'),
  icon: z.string(),
  title: z.string(),
  description: z.string().optional(),
});
const FeatureCardStat = z.object({
  id: z.string(),
  type: z.literal('stat'),
  label: z.string(),
  value: z.string(),
});
const FeatureCardTestimonial = z.object({
  id: z.string(),
  type: z.literal('testimonial'),
  quote: z.string(),
  author: z.string(),
});

const SectionFeatures = z.object({
  id: z.string(),
  type: z.literal('features'),
  props: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    columns: z.number().optional(),
    items: z.number().optional(),
    variant: z.string().optional(),
    itemsData: z
      .array(
        z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          name: z.string().optional(),
          role: z.string().optional(),
          avatar: z.string().optional(),
        }),
      )
      .optional(),
    cards: z
      .array(
        FeatureCardLogo.or(FeatureCardIcon)
          .or(FeatureCardStat)
          .or(FeatureCardTestimonial),
      )
      .optional(),
  }),
});

const SectionText = z.object({
  id: z.string(),
  type: z.literal('text'),
  props: z.object({
    size: z.enum(['small', 'medium', 'large']).optional(),
    align: z.enum(['left', 'center', 'right']).optional(),
    html: z.string().optional(),
  }),
});

const PostItem = z.object({
  id: z.string(),
  title: z.string(),
  excerpt: z.string(),
  href: z.string(),
  image: z.string(),
  category: z.string(),
  author: z.object({ name: z.string(), avatar: z.string() }),
  date: z.string(),
  readingTime: z.string(),
});

const SectionPosts = z.object({
  id: z.string(),
  type: z.enum(['posts', 'postsVerticalList']),
  props: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    columns: z.number().optional(),
    posts: z.array(PostItem),
  }),
});

const SectionPostDetail = z.object({
  id: z.string(),
  type: z.literal('postDetail'),
  props: z.object({
    id: z.string(),
    title: z.string(),
    excerpt: z.string(),
    href: z.string(),
    image: z.string(),
    category: z.string(),
    author: z.object({ name: z.string(), avatar: z.string().url() }),
    date: z.string(),
    readingTime: z.string(),
    tags: z.array(z.string()).default([]),
    contentHtml: z.string(),
    prev: z.object({ title: z.string(), href: z.string() }).optional(),
    next: z.object({ title: z.string(), href: z.string() }).optional(),
  }),
});

const AnySection = z.union([
  SectionHero,
  SectionFeatures,
  SectionText,
  SectionPosts,
  SectionPostDetail,
]);

/** Header & Footer blocks */
const HeaderBlock = z.object({
  id: z.string(),
  type: z.literal('header'),
  props: z.object({
    logo: Logo,
    showNav: z.boolean().default(true),
    navLinks: z.array(NavLink).default([]),
    cta: z.object({ label: z.string(), href: z.string() }).optional(),
  }),
});

const FooterBlock = z.object({
  id: z.string(),
  type: z.literal('footer'),
  props: z.object({
    logo: Logo,
    tagline: z.string().optional(),
    links: z.array(FooterLink).default([]),
    groups: z.array(LinkGroup).default([]),
    social: z.array(SocialLink).default([]),
    copyright: z.string().optional(),
    align: z.enum(['between', 'center', 'left', 'right']).optional(),
  }),
});

/** Pages */
const Page = z.object({
  id: z.string(),
  title: z.string(),
  path: z.string(),
  sections: z.array(AnySection),
});

export const SiteObjectSchema = z.object({
  id: z.string(),
  type: z.literal('landing-page'),
  themeId: ThemeId,
  typographyId: TypographyId,
  name: z.string(),
  preview: z.string().url(),
  description: z.string(),
  globals: z.object({
    header: z.array(HeaderBlock),
    footer: z.array(FooterBlock),
  }),
  pages: z.object({
    home: Page,
    about: Page.optional(),
    services: Page.optional(),
    blog: Page.optional(),
    blog_detail: Page.optional(),
  }),
});
export type SiteObject = z.infer<typeof SiteObjectSchema>;

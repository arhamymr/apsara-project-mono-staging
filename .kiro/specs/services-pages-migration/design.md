# Design Document: Services Pages Migration

## Overview

This feature migrates the Services accordion section from the homepage into dedicated, comprehensive service pages. Each service page follows the established design pattern used in existing pages like `/fix-website`, `/instagram-post`, and `/digital-products`. The implementation includes creating new pages for Full-Stack Development, Mobile App Development, API Development, and a Services overview page, along with updating the navigation menu.

## Architecture

### Page Structure

Each service page follows the established pattern:

```
ServicePage
├── TopNav (existing component)
├── main
│   ├── HeroSection
│   ├── TrustBadges
│   ├── FeaturesSection
│   ├── ServicesSection (detailed offerings)
│   ├── WorkflowSection (process steps)
│   ├── PricingSection
│   ├── TestimonialsSection (optional)
│   └── CTASection
└── Footer (existing component)
```

### File Structure

```
apps/web/
├── app/
│   ├── full-stack-development/
│   │   └── page.tsx
│   ├── mobile-app-development/
│   │   └── page.tsx
│   ├── api-development/
│   │   └── page.tsx
│   └── services/
│       └── page.tsx
├── i18n/
│   ├── full-stack-development.ts
│   ├── mobile-app-development.ts
│   ├── api-development.ts
│   └── services.ts
└── components/home/sections/
    └── Services.tsx (to be removed)
```

## Components and Interfaces

### Service Page Component Pattern

Based on existing pages (`fix-website`, `instagram-post`), each service page uses:

```typescript
// Page structure pattern
export default function ServicePage() {
  return (
    <div className="bg-background text-foreground min-h-dvh">
      <TopNav />
      <main id="main-content">
        <HeroSection />
        <TrustBadges />
        <FeaturesSection />
        <ServicesSection />
        <WorkflowSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
```

### i18n String Interface

```typescript
interface ServiceStrings {
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
```

### Navigation Update

Update `TopNav.tsx` to include new service links in the Services dropdown:

```typescript
const navItems = [
  {
    label: s.topNav.links.services,
    children: [
      { href: '/full-stack-development', label: 'Full-Stack Development', icon: Code2 },
      { href: '/mobile-app-development', label: 'Mobile App Development', icon: Smartphone },
      { href: '/api-development', label: 'API Development', icon: Server },
      { href: '/create-website', label: 'Website Development', icon: Globe },
      { href: '/fix-website', label: 'Website Repair', icon: Wrench },
      { href: '/ai-integration', label: 'AI Solutions', icon: Bot },
      { href: '/instagram-post', label: 'Instagram Post Design', icon: Image },
    ],
  },
  // ... rest of nav items
];
```

## Data Models

### Service Page Content Model

Each service page content is defined in its i18n file with the following structure:

| Field | Type | Description |
|-------|------|-------------|
| hero | object | Hero section content with title, subtitle, CTA |
| features | object | Features section with title, subtitle, and list of 4+ features |
| services | object | Detailed services list with title, subtitle, and offerings |
| pricing | object | Pricing tiers with hourly and project-based options |
| cta | object | Final CTA section content |

### Navigation Item Model

| Field | Type | Description |
|-------|------|-------------|
| href | string | Route path for the service page |
| label | string | Display label (i18n key) |
| description | string | Short description for dropdown |
| icon | LucideIcon | Icon component for visual identification |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Service page features minimum count
*For any* service page i18n configuration, the features.list array SHALL contain at least 4 items to ensure adequate feature coverage.
**Validates: Requirements 2.2**

### Property 2: Navigation links point to valid routes
*For any* service menu item in the navigation, the href attribute SHALL correspond to an existing page route in the application.
**Validates: Requirements 3.2**

### Property 3: i18n locale consistency
*For any* supported locale (en, id), all service page strings SHALL be defined and non-empty for that locale.
**Validates: Requirements 5.1, 5.2, 5.3**

### Property 4: Hero section required fields
*For any* service page hero configuration, the object SHALL contain non-empty title, subtitle, cta, and whatsapp_message fields.
**Validates: Requirements 2.1**

## Error Handling

### Missing i18n Strings
- Fallback to English if Indonesian translation is missing
- Log warning in development mode for missing translations

### Navigation Errors
- Invalid routes should redirect to 404 page
- Broken links should be caught during build time

### Component Errors
- Use React Error Boundaries to catch rendering errors
- Display fallback UI if a section fails to render

## Testing Strategy

### Unit Testing
- Test that each service page component renders without errors
- Test that i18n strings are properly loaded for each locale
- Test navigation menu contains all expected service links

### Property-Based Testing
Using a property-based testing library (e.g., fast-check), implement the following:

1. **Feature count property**: Generate random service configurations and verify features.list.length >= 4
2. **i18n completeness property**: For all locales and all service pages, verify all required string keys exist
3. **Navigation href validity property**: For all navigation items, verify href matches a valid route pattern

### Integration Testing
- Test navigation from homepage to each service page
- Test language switching on service pages
- Test mobile menu functionality

### Test Annotations
Each property-based test MUST be tagged with:
```typescript
// **Feature: services-pages-migration, Property {number}: {property_text}**
```

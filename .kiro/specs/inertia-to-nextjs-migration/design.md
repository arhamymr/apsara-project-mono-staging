# Design Document: Inertia to Next.js Migration

## Overview

This design document outlines the architecture and implementation approach for migrating an Inertia.js + Laravel React application to Next.js 14+ App Router. The migration involves converting approximately 50+ pages, 100+ components, and various hooks, contexts, and utilities from the `apps/web/migrate` folder into the proper Next.js app structure.

The application is a comprehensive digital workspace platform featuring:
- A macOS-style desktop interface with windowed applications
- Website builder functionality
- Dashboard with multiple apps (Kanban, Invoice, Analytics, etc.)
- Authentication system
- Blog and legal pages
- Internationalization support

## Architecture

### Current State (Inertia.js)

```
apps/web/migrate/
├── app.tsx              # Inertia app entry point
├── provider.tsx         # Root providers (QueryClient, Theme, etc.)
├── pages/               # Inertia page components
├── components/          # Shared components
├── hooks/               # Custom hooks
├── context/             # React contexts
├── layouts/             # Layout components (OS, Legal, Dark Mode)
├── lib/                 # Utility functions
├── types/               # TypeScript definitions
└── i18n/                # Internationalization
```

### Target State (Next.js App Router)

```
apps/web/
├── app/
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── verify-email/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx       # OS desktop layout
│   │   ├── page.tsx
│   │   └── website/
│   │       ├── page.tsx
│   │       ├── create/page.tsx
│   │       └── [id]/edit/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── legal/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   └── cookies/page.tsx
│   ├── ai-integration/page.tsx
│   ├── create-website/page.tsx
│   ├── digital-products/page.tsx
│   ├── fix-website/page.tsx
│   ├── instagram-post/page.tsx
│   ├── unified-platform/page.tsx
│   ├── sketch/page.tsx
│   ├── components/page.tsx
│   ├── email/
│   │   ├── unsubscribe/page.tsx
│   │   └── unsubscribed/page.tsx
│   └── websites/
│       └── [id]/page.tsx
├── components/
│   ├── providers.tsx        # Client providers wrapper
│   ├── ui/                  # UI components (shadcn)
│   ├── home/                # Landing page components
│   ├── dashboard/           # Dashboard components
│   ├── editor/              # Editor components
│   └── ...
├── hooks/
│   ├── use-website/
│   ├── use-appearance.tsx
│   └── ...
├── contexts/
│   ├── site-context.tsx
│   └── editable-context.tsx
├── layouts/
│   ├── os/                  # Desktop OS layout system
│   └── dark-mode/
├── lib/
│   ├── utils.ts
│   └── ...
├── types/
│   └── ...
└── i18n/
    └── ...
```

## Components and Interfaces

### Provider Architecture

The root layout will integrate all providers in a client component wrapper:

```typescript
// components/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { WebsiteFormProvider } from '@/hooks/use-website/provider';
import { SiteProvider } from '@/contexts/site-context';
import { AppLocaleProvider } from '@/i18n/LocaleContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({...}));
  
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <WebsiteFormProvider>
          <SiteProvider>
            <AppLocaleProvider>
              {children}
            </AppLocaleProvider>
          </SiteProvider>
        </WebsiteFormProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
```

### Inertia to Next.js Pattern Mapping

| Inertia Pattern | Next.js Equivalent |
|-----------------|-------------------|
| `Head` component | `metadata` export or `<title>` |
| `usePage()` | Server components props, `useSearchParams`, context |
| `router.visit()` | `useRouter().push()` from `next/navigation` |
| `router.post()` | Server Actions or fetch API |
| `Link` from Inertia | `Link` from `next/link` |
| `useForm` | `react-hook-form` + Server Actions |
| `route()` helper | Direct URL strings or route constants |

### Component Migration Strategy

1. **Server Components (Default)**: Static content, data fetching
2. **Client Components**: Interactive UI, hooks, browser APIs

```typescript
// Example: Converting auth page
// Before (Inertia)
import { Head, Link, useForm } from '@inertiajs/react';

// After (Next.js)
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
```

## Data Models

### Route Configuration

```typescript
// lib/routes.ts
export const routes = {
  home: '/',
  auth: {
    login: '/login',
    register: '/register',
    verifyEmail: '/verify-email',
  },
  dashboard: {
    index: '/dashboard',
    website: {
      index: '/dashboard/website',
      create: '/dashboard/website/create',
      edit: (id: string) => `/dashboard/website/${id}/edit`,
    },
  },
  blog: {
    index: '/blog',
    show: (slug: string) => `/blog/${slug}`,
  },
  legal: {
    index: '/legal',
    privacy: '/legal/privacy',
    terms: '/legal/terms',
    cookies: '/legal/cookies',
  },
} as const;
```

### Page Props Types

```typescript
// types/page-props.ts
export interface PageProps {
  params: Record<string, string>;
  searchParams: Record<string, string | string[] | undefined>;
}

export interface BlogPostPageProps extends PageProps {
  params: { slug: string };
}

export interface WebsiteEditPageProps extends PageProps {
  params: { id: string };
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the following correctness properties have been identified. Many acceptance criteria are example-based (specific file existence checks) rather than universal properties. The properties below focus on transformation rules that must hold across all migrated files.

### Property 1: No Inertia Imports Remain

*For any* TypeScript/TSX file in the migrated `apps/web/app`, `apps/web/components`, `apps/web/hooks`, `apps/web/contexts`, or `apps/web/lib` directories, the file SHALL NOT contain any imports from `@inertiajs/react` or `laravel-vite-plugin`.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 4.3, 5.2**

### Property 2: Client Directive for Interactive Components

*For any* React component file that uses React hooks (`useState`, `useEffect`, `useContext`, etc.), browser APIs (`window`, `document`, `localStorage`), or event handlers, the file SHALL include the `'use client'` directive at the top.

**Validates: Requirements 4.4, 6.3**

### Property 3: Import Path Validity

*For any* TypeScript/TSX file in the migrated codebase, all import statements SHALL resolve to existing files or valid npm packages (no broken imports).

**Validates: Requirements 11.1**

### Property 4: No Circular Dependencies

*For any* set of files in the migrated codebase, there SHALL NOT exist a circular dependency chain where file A imports from file B, which imports from file C, ..., which imports from file A.

**Validates: Requirements 11.3**

### Property 5: Browser API Isolation

*For any* utility function in `lib/` that uses browser-only APIs (`window`, `document`, `localStorage`, `navigator`), the function SHALL either be in a file marked with `'use client'` or be wrapped in a typeof check for SSR safety.

**Validates: Requirements 8.2**

### Property 6: Type Definition Compatibility

*For any* type definition file in `types/`, the file SHALL NOT reference types from `@inertiajs/react` or other Inertia-specific packages.

**Validates: Requirements 9.2**

## Error Handling

### Migration Errors

1. **Missing Dependencies**: If a migrated component references a dependency not yet migrated, the build will fail. Strategy: Migrate in dependency order (utilities → contexts → hooks → components → pages).

2. **Import Resolution Failures**: If import paths are incorrect after migration, TypeScript will report errors. Strategy: Use IDE refactoring tools and verify with `tsc --noEmit`.

3. **Hydration Mismatches**: If server and client render different content, React will warn. Strategy: Ensure components using browser APIs are marked as client components.

4. **Route Conflicts**: If two routes resolve to the same path, Next.js will error. Strategy: Follow App Router conventions strictly.

### Runtime Error Handling

```typescript
// Example: Safe browser API access
function getStoredValue(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
```

## Testing Strategy

### Dual Testing Approach

The migration will use both unit tests and property-based tests to ensure correctness.

### Unit Tests

Unit tests will verify specific migration outcomes:

1. **Route Existence Tests**: Verify each expected route file exists
2. **Component Render Tests**: Verify migrated components render without errors
3. **Provider Integration Tests**: Verify providers wrap the application correctly
4. **Hook Functionality Tests**: Verify hooks work with Next.js patterns

### Property-Based Tests

Property-based tests will use **fast-check** library to verify universal properties across the codebase.

**Configuration**: Each property test will run a minimum of 100 iterations.

**Test Annotations**: Each property-based test will be tagged with:
```typescript
// **Feature: inertia-to-nextjs-migration, Property {number}: {property_text}**
```

#### Property Test Implementations

1. **No Inertia Imports Test**: Generate random file paths from migrated directories, read file contents, verify no Inertia imports exist.

2. **Client Directive Test**: Parse all TSX files, identify those using hooks/browser APIs, verify `'use client'` directive presence.

3. **Import Path Validity Test**: For each file, extract all imports, verify each resolves to an existing file or package.

4. **Circular Dependency Test**: Build dependency graph, verify no cycles exist using topological sort.

5. **Browser API Isolation Test**: Scan lib/ files for browser API usage, verify proper isolation.

6. **Type Definition Compatibility Test**: Scan types/ files for Inertia type references, verify none exist.

### Test Execution

```bash
# Run all tests
pnpm test

# Run property-based tests only
pnpm test:properties

# Run with coverage
pnpm test:coverage
```

### Validation Checklist

- [ ] All pages render without errors
- [ ] Navigation between pages works
- [ ] Authentication flow functions correctly
- [ ] Dashboard OS interface loads and is interactive
- [ ] Theme switching works
- [ ] Internationalization works
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] All property-based tests pass

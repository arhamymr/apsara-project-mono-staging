# Requirements Document

## Introduction

This document specifies the requirements for migrating an existing Inertia.js + Laravel React application to a Next.js 14+ App Router architecture. The migration involves converting pages, components, hooks, contexts, layouts, and utilities from the `apps/web/migrate` folder into the proper Next.js app structure at `apps/web/app`. The migration must preserve existing functionality while adapting Inertia-specific patterns to Next.js equivalents.

## Glossary

- **Inertia.js**: A library that allows building single-page apps using classic server-side routing and controllers
- **App Router**: Next.js 13+ routing system using the `app` directory with file-based routing
- **Server Component**: React component that renders on the server by default in Next.js App Router
- **Client Component**: React component marked with `'use client'` directive that runs in the browser
- **Route Group**: Next.js folder wrapped in parentheses `(group)` that organizes routes without affecting URL
- **Layout**: Shared UI component that wraps pages and preserves state across navigation
- **Page Component**: The main component rendered for a specific route in Next.js
- **Migrate Folder**: Source folder at `apps/web/migrate` containing the original Inertia.js code

## Requirements

### Requirement 1: Project Structure Setup

**User Story:** As a developer, I want the Next.js app structure properly organized, so that the migrated code follows Next.js conventions and best practices.

#### Acceptance Criteria

1. WHEN the migration begins THEN the System SHALL create the following directory structure under `apps/web`:
   - `app/` for routes and pages
   - `components/` for shared React components
   - `hooks/` for custom React hooks
   - `lib/` for utility functions
   - `contexts/` for React context providers
   - `types/` for TypeScript type definitions

2. WHEN organizing route folders THEN the System SHALL use Next.js App Router conventions with `page.tsx` files for routes and `layout.tsx` files for shared layouts.

3. WHEN migrating provider components THEN the System SHALL create a root layout at `app/layout.tsx` that wraps the application with necessary providers (QueryClient, ThemeProvider, etc.).

### Requirement 2: Page Migration

**User Story:** As a developer, I want all Inertia pages converted to Next.js pages, so that the application routes work correctly in the Next.js environment.

#### Acceptance Criteria

1. WHEN migrating the home page (`pages/index.tsx`) THEN the System SHALL convert it to `app/page.tsx` with appropriate client/server component designation.

2. WHEN migrating auth pages (`pages/auth/*.tsx`) THEN the System SHALL create corresponding routes at `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`, and `app/(auth)/verify-email/page.tsx`.

3. WHEN migrating dashboard pages (`pages/dashboard/*.tsx`) THEN the System SHALL create routes at `app/dashboard/page.tsx` and nested routes for website management.

4. WHEN migrating blog pages (`pages/blog/*.tsx`) THEN the System SHALL create routes at `app/blog/page.tsx` and `app/blog/[slug]/page.tsx` for dynamic blog posts.

5. WHEN migrating legal pages (`pages/legal/*.tsx`) THEN the System SHALL create routes at `app/legal/page.tsx`, `app/legal/privacy/page.tsx`, `app/legal/terms/page.tsx`, and `app/legal/cookies/page.tsx`.

6. WHEN migrating standalone pages (ai-integration, create-website, digital-products, etc.) THEN the System SHALL create corresponding routes in the `app/` directory.

### Requirement 3: Inertia Pattern Conversion

**User Story:** As a developer, I want Inertia-specific code patterns converted to Next.js equivalents, so that the application functions correctly without Inertia dependencies.

#### Acceptance Criteria

1. WHEN encountering `Head` component from `@inertiajs/react` THEN the System SHALL replace it with Next.js `Metadata` export or `<title>` in the head.

2. WHEN encountering `usePage()` hook THEN the System SHALL replace it with appropriate Next.js data fetching patterns (server components, `useSearchParams`, or context).

3. WHEN encountering `router.visit()` or `router.get()` THEN the System SHALL replace it with Next.js `useRouter` from `next/navigation`.

4. WHEN encountering `Link` from `@inertiajs/react` THEN the System SHALL replace it with `Link` from `next/link`.

5. WHEN encountering `useForm` from `@inertiajs/react` THEN the System SHALL replace it with a combination of React state management and fetch/server actions.

### Requirement 4: Component Migration

**User Story:** As a developer, I want all shared components migrated and properly organized, so that they can be imported and used throughout the Next.js application.

#### Acceptance Criteria

1. WHEN migrating UI components (`components/ui/*`) THEN the System SHALL place them in `components/ui/` maintaining the same structure.

2. WHEN migrating feature components (home, dashboard, editor, etc.) THEN the System SHALL place them in appropriate subdirectories under `components/`.

3. WHEN a component uses Inertia-specific imports THEN the System SHALL update those imports to use Next.js equivalents.

4. WHEN a component requires client-side interactivity THEN the System SHALL add the `'use client'` directive at the top of the file.

### Requirement 5: Hook Migration

**User Story:** As a developer, I want all custom hooks migrated and functional, so that shared logic remains available throughout the application.

#### Acceptance Criteria

1. WHEN migrating hooks from `hooks/` THEN the System SHALL place them in `hooks/` at the app level.

2. WHEN a hook uses Inertia-specific APIs THEN the System SHALL refactor it to use Next.js equivalents or standard React patterns.

3. WHEN migrating the `use-website` hook folder THEN the System SHALL preserve its provider pattern and adapt it for Next.js.

### Requirement 6: Context and Provider Migration

**User Story:** As a developer, I want all React contexts and providers migrated, so that global state management continues to work.

#### Acceptance Criteria

1. WHEN migrating context files (`context/*.tsx`) THEN the System SHALL place them in `contexts/` and ensure they work with Next.js App Router.

2. WHEN migrating the root provider (`provider.tsx`) THEN the System SHALL integrate it into the root `layout.tsx` with proper client component boundaries.

3. WHEN a provider requires client-side features THEN the System SHALL create a separate client component wrapper.

### Requirement 7: Layout Migration

**User Story:** As a developer, I want all layouts migrated to Next.js layout components, so that shared UI structure is preserved across routes.

#### Acceptance Criteria

1. WHEN migrating the legal layout (`layouts/LegalLayout.tsx`) THEN the System SHALL convert it to a Next.js layout at `app/legal/layout.tsx`.

2. WHEN migrating theme provider (`layouts/dark-mode/*`) THEN the System SHALL integrate it into the root layout with proper client component handling.

3. WHEN migrating OS layouts (`layouts/os/*`) THEN the System SHALL create appropriate layout components for the dashboard section.

### Requirement 8: Utility and Library Migration

**User Story:** As a developer, I want all utility functions and libraries migrated, so that helper functions remain available.

#### Acceptance Criteria

1. WHEN migrating utility files (`lib/*.ts`) THEN the System SHALL place them in `lib/` at the app level.

2. WHEN a utility uses browser-only APIs THEN the System SHALL ensure it is only imported in client components or uses dynamic imports.

### Requirement 9: Type Definition Migration

**User Story:** As a developer, I want all TypeScript type definitions migrated, so that type safety is maintained.

#### Acceptance Criteria

1. WHEN migrating type files (`types/*.ts`, `types/*.d.ts`) THEN the System SHALL place them in `types/` at the app level.

2. WHEN type definitions reference Inertia-specific types THEN the System SHALL update them to use Next.js or generic React types.

### Requirement 10: Internationalization Migration

**User Story:** As a developer, I want the i18n setup migrated, so that multi-language support continues to work.

#### Acceptance Criteria

1. WHEN migrating i18n files (`i18n/*.ts`) THEN the System SHALL place them in `i18n/` or `lib/i18n/` at the app level.

2. WHEN migrating the LocaleContext THEN the System SHALL ensure it works with Next.js App Router and client components.

### Requirement 11: Import Path Updates

**User Story:** As a developer, I want all import paths updated correctly, so that the application compiles without import errors.

#### Acceptance Criteria

1. WHEN files are moved to new locations THEN the System SHALL update all relative import paths to reflect the new structure.

2. WHEN the project uses path aliases (e.g., `@/`) THEN the System SHALL ensure `tsconfig.json` paths are configured correctly for the new structure.

3. WHEN circular dependencies are detected THEN the System SHALL refactor the code to eliminate them.

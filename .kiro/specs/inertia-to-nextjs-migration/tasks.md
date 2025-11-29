# Implementation Plan

## Phase 1: Foundation Setup

- [x] 1. Set up project structure and update providers






  - [x] 1.1 Create directory structure for migration

    - Create `apps/web/contexts/` directory
    - Create `apps/web/i18n/` directory  
    - Create `apps/web/layouts/` directory
    - Verify `apps/web/hooks/`, `apps/web/lib/`, `apps/web/types/` exist or create them
    - _Requirements: 1.1_

  - [x] 1.2 Update root providers component

    - Update `apps/web/components/providers.tsx` to include QueryClientProvider, WebsiteFormProvider, SiteProvider, AppLocaleProvider
    - Ensure all providers are client components with 'use client' directive
    - _Requirements: 1.3, 6.2, 6.3_

  - [x] 1.3 Update tsconfig.json path aliases

    - Verify `@/` alias points to `apps/web/` correctly
    - Add any additional path aliases needed for the migration
    - _Requirements: 11.2_

## Phase 2: Utility and Type Migration

- [x] 2. Migrate utility functions and types





  - [x] 2.1 Migrate lib utilities


    - Copy `migrate/lib/*.ts` to `apps/web/lib/`
    - Update any Inertia-specific code patterns
    - Ensure browser-only utilities have SSR safety checks
    - _Requirements: 8.1, 8.2_


  - [x] 2.2 Migrate type definitions










    - Copy `migrate/types/*.ts` and `migrate/types/*.d.ts` to `apps/web/types/`
    - Remove any Inertia-specific type references


    - Add Next.js page props types
    - _Requirements: 9.1, 9.2_
  - [x] 2.3 Migrate schemas





    - Copy `migrate/schemas/*.ts` to `apps/web/lib/schemas/` or `apps/web/types/`
    - _Requirements: 8.1_
  - [ ]* 2.4 Write property test for no Inertia imports in lib/types
    - **Property 1: No Inertia Imports Remain**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

## Phase 3: Context and Hook Migration

- [x] 3. Migrate contexts and hooks





  - [x] 3.1 Migrate context files

    - Copy `migrate/context/site-context.tsx` to `apps/web/contexts/`
    - Copy `migrate/context/editable-context.tsx` to `apps/web/contexts/`
    - Ensure 'use client' directive is present
    - Remove any Inertia-specific patterns
    - _Requirements: 6.1, 6.3_

  - [x] 3.2 Migrate i18n files

    - Copy `migrate/i18n/*.ts` and `migrate/i18n/*.tsx` to `apps/web/i18n/`
    - Copy `migrate/i18n/landing/` and `migrate/i18n/os/` subdirectories
    - Update LocaleContext for Next.js App Router compatibility
    - _Requirements: 10.1, 10.2_

  - [x] 3.3 Migrate hooks

    - Copy `migrate/hooks/*.ts` and `migrate/hooks/*.tsx` to `apps/web/hooks/`
    - Copy `migrate/hooks/use-website/` folder
    - Update any hooks using Inertia APIs to use Next.js equivalents
    - _Requirements: 5.1, 5.2, 5.3_
  - [ ]* 3.4 Write property test for client directive presence
    - **Property 2: Client Directive for Interactive Components**
    - **Validates: Requirements 4.4, 6.3**

## Phase 4: Layout Migration

- [x] 4. Migrate layout components





  - [x] 4.1 Migrate dark-mode theme components


    - Copy `migrate/layouts/dark-mode/` to `apps/web/layouts/dark-mode/`
    - Update theme-provider.tsx to work alongside next-themes if needed
    - Ensure 'use client' directives are present
    - _Requirements: 7.2_

  - [x] 4.2 Migrate OS desktop layout

    - Copy `migrate/layouts/os/` to `apps/web/layouts/os/`
    - This includes: apps/, components/, state/, widgets/, and all root files
    - Update any Inertia-specific imports to Next.js equivalents
    - _Requirements: 7.3_
  - [x] 4.3 Migrate legal layout


    - Copy `migrate/layouts/LegalLayout.tsx` to `apps/web/layouts/`
    - Will be used to create `app/legal/layout.tsx`
    - _Requirements: 7.1_


- [x] 5. Checkpoint - Ensure foundation is solid










  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: Component Migration
-



- [x] 6. Migrate UI and shared components

  - [x] 6.1 Migrate UI components
    - Copy `migrate/components/ui/` to `apps/web/components/ui/` (merge with existing)
    - Ensure no Inertia imports remain
    - Add 'use client' where needed
    - _Requirements: 4.1, 4.3, 4.4_
  - [x] 6.2 Migrate home/landing components
    - Copy `migrate/components/home/` to `apps/web/components/home/`
    - Update any Inertia Link to next/link
    - _Requirements: 4.2, 4.3_
  - [x] 6.3 Migrate dashboard components
    - Copy `migrate/components/dashboard/` to `apps/web/components/dashboard/`
    - Update Inertia patterns to Next.js equivalents
    - _Requirements: 4.2, 4.3_
  - [x] 6.4 Migrate editor components
    - Copy `migrate/components/editor/` to `apps/web/components/editor/`
    - Copy `migrate/components/text-editor/` to `apps/web/components/text-editor/`
    - _Requirements: 4.2_
  - [x] 6.5 Migrate remaining shared components
    - Copy `migrate/components/asset-picker/` to `apps/web/components/asset-picker/`
    - Copy `migrate/components/modal/` to `apps/web/components/modal/`
    - Copy `migrate/components/legal/` to `apps/web/components/legal/`
    - Copy standalone components: breadcrumbs.tsx, category-select.tsx, image-upload.tsx, etc.

    - _Requirements: 4.2_
  - [ ]* 6.6 Write property test for import path validity
    - **Property 3: Import Path Validity**
    - **Validates: Requirements 11.1**

## Phase 6: Page Migration - Core Pages

- [x] 7. Migrate home and marketing pages





  - [x] 7.1 Migrate home page




    - Convert `migrate/pages/index.tsx` to `apps/web/app/page.tsx`
    - Replace `Head` with Next.js metadata export
    - Update component imports to new paths
    - _Requirements: 2.1, 3.1_
  - [x] 7.2 Migrate standalone marketing pages





    - Create `apps/web/app/ai-integration/page.tsx` from `migrate/pages/ai-integration.tsx`
    - Create `apps/web/app/create-website/page.tsx` from `migrate/pages/create-website.tsx`
    - Create `apps/web/app/digital-products/page.tsx` from `migrate/pages/digital-products.tsx`
    - Create `apps/web/app/fix-website/page.tsx` from `migrate/pages/fix-website.tsx`
    - Create `apps/web/app/instagram-post/page.tsx` from `migrate/pages/instagram-post.tsx`
    - Create `apps/web/app/unified-platform/page.tsx` from `migrate/pages/unified-platform.tsx`
    - Replace Inertia Head with metadata exports
    - _Requirements: 2.6, 3.1_

## Phase 7: Page Migration - Auth Pages
-

- [x] 8. Migrate authentication pages





  - [x] 8.1 Create auth route group and pages

    - Create `apps/web/app/(auth)/login/page.tsx` from `migrate/pages/auth/login.tsx`
    - Create `apps/web/app/(auth)/register/page.tsx` from `migrate/pages/auth/register.tsx`
    - Create `apps/web/app/(auth)/verify-email/page.tsx` from `migrate/pages/auth/verify-email.tsx`
    - _Requirements: 2.2_
  - [x] 8.2 Convert Inertia form handling to Next.js


    - Replace `useForm` from Inertia with react-hook-form
    - Replace `form.post(route('login'))` with fetch/server actions
    - Replace Inertia `Link` with next/link
    - Update `route()` helper calls to direct URL strings
    - _Requirements: 3.3, 3.4, 3.5_

## Phase 8: Page Migration - Dashboard

- [x] 9. Migrate dashboard pages

  - [x] 9.1 Create dashboard layout and index
    - Create `apps/web/app/dashboard/layout.tsx` that wraps with OS desktop layout
    - Create `apps/web/app/dashboard/page.tsx` from `migrate/pages/dashboard/index.tsx`
    - _Requirements: 2.3, 7.3_

  - [x] 9.2 Create dashboard website routes


    - Create `apps/web/app/dashboard/website/page.tsx` from `migrate/pages/dashboard/website/index.tsx`
    - Create `apps/web/app/dashboard/website/create/page.tsx` from `migrate/pages/dashboard/website/create.tsx`
    - Create `apps/web/app/dashboard/website/[id]/edit/page.tsx` from `migrate/pages/dashboard/website/edit.tsx`
    - _Requirements: 2.3_

- [x] 10. Checkpoint - Verify core pages work





  - Ensure all tests pass, ask the user if questions arise.

## Phase 9: Page Migration - Content Pages
- [x] 11. Migrate blog pages










- [ ] 11. Migrate blog pages

  - [x] 11.1 Create blog routes


    - Create `apps/web/app/blog/page.tsx` from `migrate/pages/blog/index.tsx`
    - Create `apps/web/app/blog/[slug]/page.tsx` from `migrate/pages/blog/show.tsx`
    - Add metadata generation for dynamic blog posts
    - _Requirements: 2.4, 3.1_
-

- [x] 12. Migrate legal pages




  - [x] 12.1 Create legal layout and routes


    - Create `apps/web/app/legal/layout.tsx` using migrated LegalLayout
    - Create `apps/web/app/legal/page.tsx` from `migrate/pages/legal/index.tsx`
    - Create `apps/web/app/legal/privacy/page.tsx` from `migrate/pages/legal/privacy.tsx`
    - Create `apps/web/app/legal/terms/page.tsx` from `migrate/pages/legal/terms.tsx`
    - Create `apps/web/app/legal/cookies/page.tsx` from `migrate/pages/legal/cookies.tsx`
    - _Requirements: 2.5, 7.1_

## Phase 10: Page Migration - Remaining Pages

- [x] 13. Migrate remaining pages





  - [x] 13.1 Create sketch page


    - Create `apps/web/app/sketch/page.tsx` from `migrate/pages/sketch/index.tsx`
    - _Requirements: 2.6_
  - [x] 13.2 Create components showcase page


    - Create `apps/web/app/components/page.tsx` from `migrate/pages/components/index.tsx`
    - Copy `migrate/pages/components/` subdirectories (components/, data/, examples/, hooks/, lib/, types/)
    - _Requirements: 2.6_
  - [x] 13.3 Create email pages


    - Create `apps/web/app/email/unsubscribe/page.tsx` from `migrate/pages/email/unsubscribe.tsx`
    - Create `apps/web/app/email/unsubscribed/page.tsx` from `migrate/pages/email/unsubscribed.tsx`
    - _Requirements: 2.6_
  - [x] 13.4 Create websites show page


    - Create `apps/web/app/websites/[id]/page.tsx` from `migrate/pages/websites/show.tsx`
    - _Requirements: 2.6_
  - [x] 13.5 Create me/profile page


    - Create `apps/web/app/me/page.tsx` from `migrate/pages/me.tsx`
    - _Requirements: 2.6_
  - [x] 13.6 Create error page


    - Create `apps/web/app/error.tsx` from `migrate/pages/error.tsx`
    - Adapt to Next.js error boundary conventions
    - _Requirements: 2.6_

## Phase 11: Final Validation

- [-] 14. Import path cleanup and validation


  - [ ] 14.1 Update all import paths
    - Run TypeScript compiler to identify broken imports
    - Fix all import path errors across migrated files
    - Ensure all `@/` aliases resolve correctly
    - _Requirements: 11.1, 11.2_
  - [ ]* 14.2 Write property test for circular dependencies
    - **Property 4: No Circular Dependencies**
    - **Validates: Requirements 11.3**
  - [ ]* 14.3 Write property test for browser API isolation
    - **Property 5: Browser API Isolation**
    - **Validates: Requirements 8.2**
  - [ ]* 14.4 Write property test for type definition compatibility
    - **Property 6: Type Definition Compatibility**
    - **Validates: Requirements 9.2**

- [ ] 15. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Cleanup
  - [ ] 16.1 Remove migrate folder
    - After verifying all functionality works, remove `apps/web/migrate/` folder
    - Remove any unused Inertia dependencies from package.json
    - _Requirements: All_

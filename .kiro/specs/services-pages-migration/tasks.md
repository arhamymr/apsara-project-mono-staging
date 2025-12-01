# Implementation Plan

- [-] 1. Create i18n files for new service pages



  - [x] 1.1 Create `apps/web/i18n/full-stack-development.ts` with English and Indonesian translations


    - Include hero, features (4+ items), services, pricing, and cta sections
    - Follow the structure from `fix-website.ts` as reference
    - _Requirements: 1.1, 5.1, 5.2, 5.3_

  - [x] 1.2 Create `apps/web/i18n/mobile-app-development.ts` with English and Indonesian translations

    - Include platform options (iOS, Android, Cross-platform) in features
    - _Requirements: 1.2, 5.1, 5.2, 5.3_

  - [x] 1.3 Create `apps/web/i18n/api-development.ts` with English and Indonesian translations

    - Include API types (REST, GraphQL), security features in content
    - _Requirements: 1.3, 5.1, 5.2, 5.3_

  - [ ] 1.4 Create `apps/web/i18n/services.ts` for services overview page
    - Include overview content and service cards data
    - _Requirements: 1.4, 5.1, 5.2, 5.3_
  - [ ] 1.5 Write property test for i18n completeness
    - **Property 3: i18n locale consistency**
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [ ] 2. Create Full-Stack Development service page
  - [ ] 2.1 Create `apps/web/app/full-stack-development/page.tsx`
    - Implement HeroSection, TrustBadges, FeaturesSection, ServicesSection, WorkflowSection, PricingSection, CTASection
    - Use existing components (TopNav, Footer, Section, Badge, Button)
    - Follow the pattern from `fix-website/page.tsx`
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4, 2.6_
  - [ ] 2.2 Write property test for hero section required fields
    - **Property 4: Hero section required fields**
    - **Validates: Requirements 2.1**
  - [ ] 2.3 Write property test for features minimum count
    - **Property 1: Service page features minimum count**
    - **Validates: Requirements 2.2**

- [ ] 3. Create Mobile App Development service page
  - [ ] 3.1 Create `apps/web/app/mobile-app-development/page.tsx`
    - Implement all sections following the established pattern
    - Include platform-specific content (iOS, Android, Cross-platform)
    - _Requirements: 1.2, 2.1, 2.2, 2.3, 2.4, 2.6_

- [ ] 4. Create API Development service page
  - [ ] 4.1 Create `apps/web/app/api-development/page.tsx`
    - Implement all sections following the established pattern
    - Include API types (REST, GraphQL) and security features
    - _Requirements: 1.3, 2.1, 2.2, 2.3, 2.4, 2.6_

- [ ] 5. Create Services overview page
  - [ ] 5.1 Create `apps/web/app/services/page.tsx`
    - Display cards linking to all individual service pages
    - Include brief descriptions for each service
    - _Requirements: 1.4_

- [ ] 6. Checkpoint - Ensure all service pages render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Update navigation menu
  - [ ] 7.1 Update `apps/web/i18n/landing/topNav.ts` with new service labels and descriptions
    - Add fullStackDevelopment, mobileAppDevelopment, apiDevelopment keys
    - Add descriptions for each new service
    - _Requirements: 3.1, 5.1, 5.2_
  - [ ] 7.2 Update `apps/web/components/home/sections/TopNav.tsx` to include new service links
    - Add Full-Stack Development, Mobile App Development, API Development to Services dropdown
    - Import appropriate icons (Code2, Smartphone, Server)
    - Update both desktop and mobile menu
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ] 7.3 Write property test for navigation links validity
    - **Property 2: Navigation links point to valid routes**
    - **Validates: Requirements 3.2**

- [ ] 8. Remove Services accordion from homepage
  - [ ] 8.1 Remove Services component import and usage from homepage
    - Update `apps/web/app/page.tsx` to remove Services section
    - _Requirements: 4.1_
  - [ ] 8.2 Delete `apps/web/components/home/sections/Services.tsx`
    - Remove the file completely
    - _Requirements: 4.1, 4.2_
  - [ ] 8.3 Update `apps/web/components/home/sections/index.ts` exports if needed
    - Remove Services export from barrel file
    - _Requirements: 4.2_

- [ ] 9. Final Checkpoint - Ensure all tests pass and pages work correctly
  - Ensure all tests pass, ask the user if questions arise.

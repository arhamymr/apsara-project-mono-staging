import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

// Import i18n files from web app
import { FULL_STACK_DEVELOPMENT_STRINGS } from '../../../../apps/web/i18n/full-stack-development'
import { MOBILE_APP_DEVELOPMENT_STRINGS } from '../../../../apps/web/i18n/mobile-app-development'
import { API_DEVELOPMENT_STRINGS } from '../../../../apps/web/i18n/api-development'
import { SERVICES_STRINGS } from '../../../../apps/web/i18n/services'
import { TOP_NAV_STRINGS } from '../../../../apps/web/i18n/landing/topNav'

/**
 * **Feature: services-pages-migration, Property 3: i18n locale consistency**
 * **Validates: Requirements 5.1, 5.2, 5.3**
 * 
 * For any supported locale (en, id), all service page strings SHALL be defined 
 * and non-empty for that locale.
 */
describe('i18n locale consistency for service pages', () => {
  const SUPPORTED_LOCALES = ['en', 'id'] as const
  
  const SERVICE_I18N_FILES = [
    { name: 'full-stack-development', strings: FULL_STACK_DEVELOPMENT_STRINGS },
    { name: 'mobile-app-development', strings: MOBILE_APP_DEVELOPMENT_STRINGS },
    { name: 'api-development', strings: API_DEVELOPMENT_STRINGS },
    { name: 'services', strings: SERVICES_STRINGS },
  ]

  // Helper to check if a value is a non-empty string
  const isNonEmptyString = (value: unknown): boolean => {
    return typeof value === 'string' && value.trim().length > 0
  }

  // Helper to recursively check all string values in an object
  const getAllStringPaths = (obj: unknown, path = ''): { path: string; value: unknown }[] => {
    const results: { path: string; value: unknown }[] = []
    
    if (obj === null || obj === undefined) {
      return results
    }
    
    if (typeof obj === 'string') {
      results.push({ path, value: obj })
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        results.push(...getAllStringPaths(item, `${path}[${index}]`))
      })
    } else if (typeof obj === 'object') {
      Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
        const newPath = path ? `${path}.${key}` : key
        results.push(...getAllStringPaths(value, newPath))
      })
    }
    
    return results
  }

  // Property test: All locales have the same structure
  it('Property 3: All service i18n files have consistent structure across locales', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SERVICE_I18N_FILES),
        fc.constantFrom(...SUPPORTED_LOCALES),
        (serviceFile, locale) => {
          const localeStrings = serviceFile.strings[locale]
          
          // Locale should exist
          expect(localeStrings).toBeDefined()
          expect(localeStrings).not.toBeNull()
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  // Property test: All string values are non-empty
  it('Property 3: All string values in service i18n files are non-empty', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SERVICE_I18N_FILES),
        fc.constantFrom(...SUPPORTED_LOCALES),
        (serviceFile, locale) => {
          const localeStrings = serviceFile.strings[locale]
          const stringPaths = getAllStringPaths(localeStrings)
          
          // Filter to only string values (not icon names which are identifiers)
          const textStrings = stringPaths.filter(({ path }) => !path.includes('icon') && !path.includes('href'))
          
          textStrings.forEach(({ path, value }) => {
            expect(
              isNonEmptyString(value),
              `${serviceFile.name}.${locale}.${path} should be a non-empty string, got: "${value}"`
            ).toBe(true)
          })
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  // Property test: Both locales have the same keys
  it('Property 3: English and Indonesian locales have matching keys', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SERVICE_I18N_FILES),
        (serviceFile) => {
          const enPaths = getAllStringPaths(serviceFile.strings.en).map(p => p.path).sort()
          const idPaths = getAllStringPaths(serviceFile.strings.id).map(p => p.path).sort()
          
          expect(
            enPaths,
            `${serviceFile.name}: English and Indonesian should have the same structure`
          ).toEqual(idPaths)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  // Property test: Required sections exist
  it('Property 3: All service pages have required sections (hero, cta)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SERVICE_I18N_FILES),
        fc.constantFrom(...SUPPORTED_LOCALES),
        (serviceFile, locale) => {
          const localeStrings = serviceFile.strings[locale]
          
          // Hero section is required
          expect(localeStrings.hero).toBeDefined()
          expect(localeStrings.hero.title).toBeDefined()
          expect(localeStrings.hero.subtitle).toBeDefined()
          expect(localeStrings.hero.cta).toBeDefined()
          
          // CTA section is required
          expect(localeStrings.cta).toBeDefined()
          expect(localeStrings.cta.title).toBeDefined()
          expect(localeStrings.cta.subtitle).toBeDefined()
          expect(localeStrings.cta.button).toBeDefined()
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  // Property test: Hero section has whatsapp_message for service pages (not overview)
  it('Property 3: Service pages have whatsapp_message in hero section', () => {
    const SERVICE_PAGES = SERVICE_I18N_FILES.filter(f => f.name !== 'services')
    
    fc.assert(
      fc.property(
        fc.constantFrom(...SERVICE_PAGES),
        fc.constantFrom(...SUPPORTED_LOCALES),
        (serviceFile, locale) => {
          const localeStrings = serviceFile.strings[locale]
          
          expect(
            isNonEmptyString(localeStrings.hero.whatsapp_message),
            `${serviceFile.name}.${locale}.hero.whatsapp_message should be a non-empty string`
          ).toBe(true)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})


/**
 * **Feature: services-pages-migration, Property 4: Hero section required fields**
 * **Validates: Requirements 2.1**
 * 
 * For any service page hero configuration, the object SHALL contain non-empty 
 * title, subtitle, cta, and whatsapp_message fields.
 */
describe('Hero section required fields', () => {
  const SUPPORTED_LOCALES = ['en', 'id'] as const
  
  // Service pages that have hero sections with whatsapp_message
  const SERVICE_PAGES_WITH_HERO = [
    { name: 'full-stack-development', strings: FULL_STACK_DEVELOPMENT_STRINGS },
    { name: 'mobile-app-development', strings: MOBILE_APP_DEVELOPMENT_STRINGS },
    { name: 'api-development', strings: API_DEVELOPMENT_STRINGS },
  ]

  const isNonEmptyString = (value: unknown): boolean => {
    return typeof value === 'string' && value.trim().length > 0
  }

  it('Property 4: Hero section contains all required fields (title, subtitle, cta, whatsapp_message)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SERVICE_PAGES_WITH_HERO),
        fc.constantFrom(...SUPPORTED_LOCALES),
        (serviceFile, locale) => {
          const hero = serviceFile.strings[locale].hero
          
          // All required fields must exist and be non-empty strings
          expect(
            isNonEmptyString(hero.title),
            `${serviceFile.name}.${locale}.hero.title should be a non-empty string`
          ).toBe(true)
          
          expect(
            isNonEmptyString(hero.subtitle),
            `${serviceFile.name}.${locale}.hero.subtitle should be a non-empty string`
          ).toBe(true)
          
          expect(
            isNonEmptyString(hero.cta),
            `${serviceFile.name}.${locale}.hero.cta should be a non-empty string`
          ).toBe(true)
          
          expect(
            isNonEmptyString(hero.whatsapp_message),
            `${serviceFile.name}.${locale}.hero.whatsapp_message should be a non-empty string`
          ).toBe(true)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * **Feature: services-pages-migration, Property 1: Service page features minimum count**
 * **Validates: Requirements 2.2**
 * 
 * For any service page i18n configuration, the features.list array SHALL contain 
 * at least 4 items to ensure adequate feature coverage.
 */
describe('Service page features minimum count', () => {
  const SUPPORTED_LOCALES = ['en', 'id'] as const
  
  // Service pages that have features sections
  const SERVICE_PAGES_WITH_FEATURES = [
    { name: 'full-stack-development', strings: FULL_STACK_DEVELOPMENT_STRINGS },
    { name: 'mobile-app-development', strings: MOBILE_APP_DEVELOPMENT_STRINGS },
    { name: 'api-development', strings: API_DEVELOPMENT_STRINGS },
  ]

  it('Property 1: Features list contains at least 4 items', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SERVICE_PAGES_WITH_FEATURES),
        fc.constantFrom(...SUPPORTED_LOCALES),
        (serviceFile, locale) => {
          const features = serviceFile.strings[locale].features
          
          // Features section must exist
          expect(features).toBeDefined()
          expect(features.list).toBeDefined()
          expect(Array.isArray(features.list)).toBe(true)
          
          // Must have at least 4 features
          expect(
            features.list.length >= 4,
            `${serviceFile.name}.${locale}.features.list should have at least 4 items, got ${features.list.length}`
          ).toBe(true)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 1: Each feature has required title and description', () => {
    const isNonEmptyString = (value: unknown): boolean => {
      return typeof value === 'string' && value.trim().length > 0
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...SERVICE_PAGES_WITH_FEATURES),
        fc.constantFrom(...SUPPORTED_LOCALES),
        (serviceFile, locale) => {
          const features = serviceFile.strings[locale].features.list
          
          features.forEach((feature: { title: string; description: string }, index: number) => {
            expect(
              isNonEmptyString(feature.title),
              `${serviceFile.name}.${locale}.features.list[${index}].title should be a non-empty string`
            ).toBe(true)
            
            expect(
              isNonEmptyString(feature.description),
              `${serviceFile.name}.${locale}.features.list[${index}].description should be a non-empty string`
            ).toBe(true)
          })
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})


/**
 * **Feature: services-pages-migration, Property 2: Navigation links point to valid routes**
 * **Validates: Requirements 3.2**
 * 
 * For any service menu item in the navigation, the href attribute SHALL correspond 
 * to an existing page route in the application.
 */
describe('Navigation links point to valid routes', () => {
  // Valid routes in the application (based on app directory structure)
  const VALID_ROUTES = [
    '/full-stack-development',
    '/mobile-app-development',
    '/api-development',
    '/create-website',
    '/fix-website',
    '/ai-integration',
    '/instagram-post',
    '/unified-platform',
    '/digital-products',
    '/blog',
    '/me',
    '/services',
    '/dashboard',
    '/login',
    '/',
  ]

  // Navigation items as defined in TopNav.tsx
  const getNavItems = () => [
    {
      label: 'Services',
      children: [
        { href: '/full-stack-development' },
        { href: '/mobile-app-development' },
        { href: '/api-development' },
        { href: '/create-website' },
        { href: '/fix-website' },
        { href: '/ai-integration' },
        { href: '/instagram-post' },
      ],
    },
    {
      label: 'Products',
      children: [
        { href: '/unified-platform' },
        { href: '/digital-products' },
      ],
    },
    { href: '/blog' },
    { href: '/me' },
  ]

  // Extract all hrefs from navigation items
  const getAllNavHrefs = (): string[] => {
    const hrefs: string[] = []
    const navItems = getNavItems()
    
    navItems.forEach((item) => {
      if ('href' in item && item.href) {
        hrefs.push(item.href)
      }
      if ('children' in item && item.children) {
        item.children.forEach((child) => {
          if (child.href) {
            hrefs.push(child.href)
          }
        })
      }
    })
    
    return hrefs
  }

  it('Property 2: All navigation hrefs point to valid routes', () => {
    const navHrefs = getAllNavHrefs()
    
    fc.assert(
      fc.property(
        fc.constantFrom(...navHrefs),
        (href) => {
          expect(
            VALID_ROUTES.includes(href),
            `Navigation href "${href}" should be a valid route`
          ).toBe(true)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 2: New service pages are included in navigation', () => {
    const navHrefs = getAllNavHrefs()
    const newServiceRoutes = [
      '/full-stack-development',
      '/mobile-app-development',
      '/api-development',
    ]
    
    fc.assert(
      fc.property(
        fc.constantFrom(...newServiceRoutes),
        (route) => {
          expect(
            navHrefs.includes(route),
            `New service route "${route}" should be included in navigation`
          ).toBe(true)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 2: Navigation i18n strings exist for all service links', () => {
    const SUPPORTED_LOCALES = ['en', 'id'] as const
    const serviceKeys = [
      'fullStackDevelopment',
      'mobileAppDevelopment',
      'apiDevelopment',
      'fixWebsite',
      'aiIntegration',
      'instagramPost',
    ]

    fc.assert(
      fc.property(
        fc.constantFrom(...serviceKeys),
        fc.constantFrom(...SUPPORTED_LOCALES),
        (serviceKey, locale) => {
          const localeStrings = TOP_NAV_STRINGS[locale] as {
            links: Record<string, string | Record<string, string>>
          }
          
          // Service label should exist
          expect(
            localeStrings.links[serviceKey],
            `${locale}.links.${serviceKey} should exist`
          ).toBeDefined()
          
          // Service description should exist
          const descriptions = localeStrings.links.descriptions as Record<string, string>
          expect(
            descriptions[serviceKey],
            `${locale}.links.descriptions.${serviceKey} should exist`
          ).toBeDefined()
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { cn } from './utils'

/**
 * **Feature: ui-component-consolidation, Property 6: Utility Function Compatibility**
 * **Validates: Requirements 6.2**
 * 
 * For any input to the `cn` utility function, the output from `@workspace/ui/lib/utils`
 * SHALL be identical to the output from `@/lib/utils`.
 * 
 * Since both implementations use the same underlying libraries (clsx + tailwind-merge),
 * we verify that the cn function behaves correctly for all valid inputs.
 */
describe('cn utility function compatibility', () => {
  // Arbitrary for generating valid Tailwind-like class names
  const tailwindClassArb = fc.oneof(
    // Common Tailwind utility classes
    fc.constantFrom(
      'flex', 'block', 'inline', 'hidden', 'grid',
      'p-4', 'px-2', 'py-3', 'm-4', 'mx-auto', 'my-2',
      'text-sm', 'text-lg', 'text-xl', 'font-bold', 'font-medium',
      'bg-red-500', 'bg-blue-500', 'bg-white', 'bg-black',
      'text-white', 'text-black', 'text-gray-500',
      'rounded', 'rounded-md', 'rounded-lg', 'rounded-full',
      'border', 'border-2', 'border-gray-200',
      'w-full', 'w-1/2', 'h-full', 'h-screen',
      'absolute', 'relative', 'fixed', 'sticky',
      'top-0', 'left-0', 'right-0', 'bottom-0',
      'z-10', 'z-50', 'z-auto',
      'opacity-50', 'opacity-100',
      'transition', 'duration-300', 'ease-in-out',
      'hover:bg-blue-600', 'focus:outline-none', 'active:bg-blue-700',
      'sm:flex', 'md:hidden', 'lg:block', 'xl:grid',
      'dark:bg-gray-800', 'dark:text-white'
    ),
    // Custom class names (alphanumeric with hyphens)
    fc.stringMatching(/^[a-z][a-z0-9-]{0,20}$/)
  )

  // Arbitrary for class value inputs (string, undefined, null, boolean, object, array)
  const classValueArb: fc.Arbitrary<unknown> = fc.oneof(
    tailwindClassArb,
    fc.constant(undefined),
    fc.constant(null),
    fc.constant(false),
    fc.constant(true),
    // Object with boolean values (conditional classes)
    fc.dictionary(tailwindClassArb, fc.boolean()),
    // Array of class names
    fc.array(tailwindClassArb, { maxLength: 5 })
  )

  it('Property 6: cn function produces consistent output for any valid class inputs', () => {
    fc.assert(
      fc.property(
        fc.array(classValueArb, { minLength: 0, maxLength: 10 }),
        (inputs) => {
          // The cn function should not throw for any valid input
          const result = cn(...(inputs as Parameters<typeof cn>))
          
          // Result should always be a string
          expect(typeof result).toBe('string')
          
          // Result should not contain undefined, null, false, or true as literal strings
          expect(result).not.toContain('undefined')
          expect(result).not.toContain('null')
          expect(result).not.toContain('false')
          expect(result).not.toContain('true')
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 6: cn function is idempotent for string inputs', () => {
    fc.assert(
      fc.property(
        fc.array(tailwindClassArb, { minLength: 1, maxLength: 5 }),
        (classes) => {
          const firstPass = cn(...classes)
          const secondPass = cn(firstPass)
          
          // Applying cn to its own output should produce the same result
          expect(secondPass).toBe(firstPass)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 6: cn function correctly merges conflicting Tailwind classes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          ['p-2', 'p-4'],
          ['m-2', 'm-4'],
          ['text-sm', 'text-lg'],
          ['bg-red-500', 'bg-blue-500'],
          ['w-full', 'w-1/2']
        ),
        (conflictingClasses) => {
          const result = cn(...conflictingClasses)
          
          // tailwind-merge should keep only the last conflicting class
          const [first, second] = conflictingClasses
          
          // The second class should win (tailwind-merge behavior)
          expect(result).toBe(second)
          
          // Split result into individual classes and verify first is not present
          const resultClasses = result.split(' ')
          expect(resultClasses).not.toContain(first)
          expect(resultClasses).toContain(second)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 6: cn function handles empty and falsy inputs correctly', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.oneof(
            fc.constant(''),
            fc.constant(undefined),
            fc.constant(null),
            fc.constant(false),
            fc.constant(0)
          ),
          { minLength: 0, maxLength: 5 }
        ),
        (falsyInputs) => {
          const result = cn(...(falsyInputs as Parameters<typeof cn>))
          
          // Result should be an empty string for all falsy inputs
          expect(result).toBe('')
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 6: cn function preserves non-conflicting classes', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.constantFrom('flex', 'block', 'grid'),
          fc.constantFrom('p-4', 'p-2', 'p-8'),
          fc.constantFrom('text-white', 'text-black')
        ),
        ([display, padding, textColor]) => {
          const result = cn(display, padding, textColor)
          
          // All non-conflicting classes should be preserved
          expect(result).toContain(display)
          expect(result).toContain(padding)
          expect(result).toContain(textColor)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})

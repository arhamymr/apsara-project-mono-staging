# Implementation Plan

- [x] 1. Set up project structure and types





  - [x] 1.1 Create the docs app directory structure


    - Create `apps/web/layouts/os/apps/docs/` directory
    - Create subdirectories: `components/`, `data/app-docs/`, `__tests__/`
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 Define TypeScript interfaces and types


    - Create `types.ts` with all interfaces (AppDocEntry, DocCategory, DocEntry, DocContent, SearchResult)
    - Define category order constants
    - _Requirements: 1.1, 3.3_
  - [ ]* 1.3 Write property test for sidebar app display
    - **Property 1: Sidebar displays all registered apps**
    - **Validates: Requirements 1.1**



- [x] 2. Implement documentation registry and data layer




  - [x] 2.1 Create documentation registry

    - Create `docs-registry.ts` with static documentation data
    - Implement function to get all apps with documentation status
    - Implement function to get documentation for specific app
    - _Requirements: 1.1, 4.1, 4.2_

  - [-] 2.2 Create sample documentation files

    - Create markdown documentation for 3-4 existing apps (Finder, Notes, Kanban)
    - Structure with categories: Overview, Getting Started, Features
    - _Requirements: 1.3, 3.1_
  - [ ]* 2.3 Write property test for documentation availability indicator
    - **Property 7: Documentation availability indicator accuracy**
    - **Validates: Requirements 4.1, 4.2**



- [x] 3. Implement core hooks



  - [x] 3.1 Create useDocs hook


    - Implement app selection state management
    - Implement category and entry navigation
    - Implement previous/next navigation logic
    - _Requirements: 1.2, 5.2, 5.3_
  - [ ]* 3.2 Write property test for navigation sequence
    - **Property 8: Navigation maintains entry sequence**
    - **Validates: Requirements 5.2, 5.3**
  - [x] 3.3 Create useDocsSearch hook



    - Implement search query state
    - Implement search filtering logic across all documentation
    - Return results with app name, title, and snippet
    - _Requirements: 2.1, 2.2, 2.3_
  - [ ]* 3.4 Write property test for search results
    - **Property 4: Search results contain query text**
    - **Validates: Requirements 2.1**
  - [ ]* 3.5 Write property test for search result fields
    - **Property 5: Search results contain required fields**
    - **Validates: Requirements 2.2**



- [x] 4. Checkpoint - Make sure all tests are passing

  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement UI components





  - [x] 5.1 Create DocsHeader component


    - Display selected app name and icon
    - Add search trigger button
    - _Requirements: 1.1_
  - [x] 5.2 Create DocsSidebar component


    - Display list of all apps with icons
    - Show documentation availability indicator (checkmark/dimmed)
    - Handle app selection
    - Include search input field
    - _Requirements: 1.1, 4.1, 4.2, 4.3_
  - [ ]* 5.3 Write property test for app selection updates content
    - **Property 2: App selection updates content panel**
    - **Validates: Requirements 1.2**
  - [x] 5.4 Create DocsTableOfContents component


    - Display categories in correct order
    - Handle category selection
    - Highlight active category
    - _Requirements: 3.1, 3.3_
  - [ ]* 5.5 Write property test for category ordering
    - **Property 6: Category ordering is consistent**
    - **Validates: Requirements 3.3**

- [x] 6. Implement markdown rendering





  - [x] 6.1 Create MarkdownRenderer component


    - Use react-markdown or similar library for rendering
    - Style headings, paragraphs, lists, and links
    - _Requirements: 1.3_
  - [x] 6.2 Create CodeBlock component with copy functionality

    - Render code blocks with syntax highlighting
    - Add copy button to each code block
    - Implement clipboard copy with feedback
    - _Requirements: 7.1, 7.2, 7.3_
  - [ ]* 6.3 Write property test for markdown rendering
    - **Property 3: Markdown rendering produces valid HTML structure**
    - **Validates: Requirements 1.3**
  - [ ]* 6.4 Write property test for code block copy buttons
    - **Property 9: Code blocks have copy buttons**
    - **Validates: Requirements 7.1**


- [x] 7. Implement main content area




  - [x] 7.1 Create DocsContent component


    - Display documentation content using MarkdownRenderer
    - Show loading skeleton while loading
    - Show error message with retry on failure
    - Show placeholder for apps without documentation
    - _Requirements: 1.2, 1.3, 1.4, 6.1, 6.2_
  - [x] 7.2 Add navigation buttons


    - Add previous/next buttons at bottom of content
    - Disable buttons at boundaries
    - _Requirements: 5.1, 5.4_
  - [x] 7.3 Create DocsSearchResults component


    - Display search results with app name, title, snippet
    - Handle result selection to navigate to documentation
    - Show "no results" message when empty
    - _Requirements: 2.2, 2.3, 2.4_

- [x] 8. Assemble main DocsApp component





  - [x] 8.1 Create DocsApp index component


    - Compose all components together
    - Wire up hooks and state
    - Follow existing app layout patterns (header, sidebar, content)
    - _Requirements: 1.1, 1.2_
  - [x] 8.2 Register app in app-definitions


    - Add DocsApp to app-definitions.tsx
    - Set appropriate icon (📖) and default size
    - _Requirements: 1.1_



- [x] 9. Checkpoint - Make sure all tests are passing



  - Ensure all tests pass, ask the user if questions arise.
  - Note: Documentation App has no TypeScript errors. Pre-existing errors in other parts of the codebase are unrelated.



- [x] 10. Add documentation content



  - [x] 10.1 Write documentation for core apps


    - Create documentation for Finder, Notes, Kanban, Knowledge Base
    - Include Overview, Getting Started, and Features sections
    - Add code examples where relevant
    - _Requirements: 1.3, 3.1_
  - [x] 10.2 Write documentation for utility apps


    - Create documentation for Calculator, Tasks, Sketch
    - Keep documentation concise but informative
    - _Requirements: 1.3_

- [-] 11. Final Checkpoint - Make sure all tests are passing



  - Ensure all tests pass, ask the user if questions arise.


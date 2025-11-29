# Requirements Document

## Introduction

This document specifies the requirements for consolidating UI components from `apps/web/components/ui` to use the shared `@workspace/ui` package at `packages/ui`. The goal is to eliminate duplicate component implementations while maintaining backward compatibility with existing imports (e.g., `@/components/ui/button` continues to work). Components that already exist in `packages/ui` will be re-exported, while app-specific components (like Plate editor nodes) will remain in the web app.

## Glossary

- **Shared UI Package**: The `@workspace/ui` package located at `packages/ui` containing reusable UI components
- **Web App UI**: The UI components located at `apps/web/components/ui`
- **Re-export**: A module that imports from one location and exports from another, enabling import path preservation
- **Base Component**: A generic, reusable UI component (button, input, dialog, etc.) suitable for sharing
- **App-Specific Component**: A component tied to specific app functionality (editor nodes, AI components, etc.)
- **Plate Editor**: A rich text editor framework used in the web app with custom node components

## Requirements

### Requirement 1: Component Classification

**User Story:** As a developer, I want components classified into shared vs app-specific categories, so that I know which components should be consolidated.

#### Acceptance Criteria

1. WHEN analyzing components THEN the System SHALL classify components into two categories:
   - Base components that exist in both `packages/ui` and `apps/web/components/ui`
   - App-specific components that only exist in `apps/web/components/ui`

2. WHEN a component exists in `packages/ui` THEN the System SHALL mark it as a candidate for re-export from the web app.

3. WHEN a component is Plate editor-specific (contains `-node`, `-toolbar-button`, or editor-related naming) THEN the System SHALL mark it as app-specific and exclude from consolidation.

### Requirement 2: Import Path Preservation

**User Story:** As a developer, I want existing imports to continue working without changes, so that the refactoring does not require updating every file that uses UI components.

#### Acceptance Criteria

1. WHEN a base component is consolidated THEN the System SHALL create a re-export file at `apps/web/components/ui/{component}.tsx` that exports from `@workspace/ui`.

2. WHEN importing `@/components/ui/button` THEN the System SHALL resolve to the same Button component as `@workspace/ui/components/button`.

3. WHEN a component has the same API in both locations THEN the System SHALL use the `packages/ui` version as the source of truth.

### Requirement 3: Base Component Re-export

**User Story:** As a developer, I want base UI components to be re-exported from the shared package, so that there is a single source of truth for common components.

#### Acceptance Criteria

1. WHEN consolidating a base component THEN the System SHALL replace the component implementation with a re-export statement.

2. WHEN the re-export is created THEN the System SHALL export all named exports from the shared package component.

3. WHEN the shared package component has different exports THEN the System SHALL ensure all required exports are available.

### Requirement 4: App-Specific Component Retention

**User Story:** As a developer, I want app-specific components to remain in the web app, so that Plate editor and other specialized functionality continues to work.

#### Acceptance Criteria

1. WHEN a component is classified as app-specific THEN the System SHALL keep the component implementation in `apps/web/components/ui`.

2. WHEN an app-specific component depends on a base component THEN the System SHALL update its import to use the local re-export path.

3. WHEN Plate editor node components exist THEN the System SHALL preserve their current implementation and location.

### Requirement 5: Dependency Verification

**User Story:** As a developer, I want the consolidation to not break any existing functionality, so that the application continues to work correctly.

#### Acceptance Criteria

1. WHEN a component is consolidated THEN the System SHALL verify that all exports match between the original and re-exported versions.

2. WHEN the shared package is missing required dependencies THEN the System SHALL add them to `packages/ui/package.json`.

3. WHEN TypeScript compilation is run THEN the System SHALL produce no new type errors related to the consolidated components.

### Requirement 6: Style Consistency

**User Story:** As a developer, I want styles to remain consistent after consolidation, so that the UI appearance does not change.

#### Acceptance Criteria

1. WHEN components are consolidated THEN the System SHALL ensure Tailwind CSS classes resolve correctly.

2. WHEN the shared package uses different utility imports THEN the System SHALL verify the `cn` utility function is compatible.

3. WHEN CSS variables are used THEN the System SHALL ensure they are defined in both the shared package and web app.


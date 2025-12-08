# Vibe Coding - Artifacts Feature

## Overview

The artifacts feature allows the vibe-coding app to store and display generated code files. This document explains how the dummy artifact system works.

## Database Schema

### Artifacts Table

```typescript
artifacts: {
  sessionId: Id<"chatSessions">,
  userId: Id<"users">,
  name: string,
  description?: string,
  files: Record<string, string>, // path => content
  metadata?: {
    framework?: string,
    language?: string,
    dependencies?: string[],
  },
  createdAt: number,
  updatedAt: number,
}
```

**Indexes:**
- `by_session` - Query artifacts by session
- `by_user` - Query artifacts by user
- `by_created` - Query artifacts by creation time

## Convex Functions

### `createDummyArtifact`

Creates a dummy artifact for testing purposes.

**Arguments:**
- `sessionId`: The chat session ID
- `projectType`: Either "react" or "html" (default: "react")

**Returns:** Artifact ID

**Example:**
```typescript
const artifactId = await createDummyArtifact({
  sessionId: "...",
  projectType: "react"
});
```

### `getSessionArtifacts`

Retrieves all artifacts for a session.

**Arguments:**
- `sessionId`: The chat session ID

**Returns:** Array of artifacts

### `getLatestArtifact`

Retrieves the most recent artifact for a session.

**Arguments:**
- `sessionId`: The chat session ID

**Returns:** Latest artifact or null

## React Hook

### `useArtifactsConvex`

Custom hook for managing artifacts in the UI.

**Parameters:**
- `sessionId`: The chat session ID

**Returns:**
```typescript
{
  fileTree: FileNode[],           // Hierarchical file structure
  selectedFile: string,            // Currently selected file path
  fileContent: string,             // Content of selected file
  artifacts: Artifact[],           // All artifacts for session
  latestArtifact: Artifact | null, // Most recent artifact
  hasArtifacts: boolean,           // Whether any artifacts exist
  isLoadingArtifacts: boolean,     // Loading state
  onFileSelect: (path: string) => void,
  onFolderToggle: (path: string[]) => void,
  createDummyArtifact: (type?: 'react' | 'html') => Promise<void>
}
```

## Dummy Artifacts

### React App

Creates a complete React + Vite application with:
- `package.json` - Dependencies and scripts
- `index.html` - HTML entry point
- `src/main.jsx` - React entry point
- `src/App.jsx` - Main App component with counter
- `src/App.css` - Component styles
- `src/index.css` - Global styles
- `README.md` - Project documentation

### HTML App

Creates a simple HTML/CSS/JS website with:
- `index.html` - Main HTML file with gradient background
- `styles.css` - Modern CSS styling
- `script.js` - JavaScript functionality
- `README.md` - Project documentation

## UI Components

### EditorTab

Displays the file explorer and Monaco code editor.

**Features:**
- File tree navigation
- Syntax highlighting
- Read-only editor
- Create dummy artifact buttons
- Loading states

### ArtifactsTab

Lists all artifacts for the session.

**Features:**
- Artifact cards with metadata
- File count display
- Framework/language tags
- Create dummy artifact buttons

## Usage Example

```typescript
// In your component
const {
  fileTree,
  selectedFile,
  fileContent,
  hasArtifacts,
  onFileSelect,
  createDummyArtifact,
} = useArtifactsConvex(sessionId);

// Create a dummy React app
await createDummyArtifact('react');

// Select a file
onFileSelect('src/App.jsx');

// Display in Monaco Editor
<Editor
  value={fileContent}
  language={getLanguageFromPath(selectedFile)}
/>
```

## File Tree Structure

The hook automatically builds a hierarchical file tree from flat file paths:

```
Input:
{
  "package.json": "...",
  "src/main.jsx": "...",
  "src/App.jsx": "..."
}

Output:
[
  { name: "package.json", path: "package.json", type: "file" },
  {
    name: "src",
    path: "src",
    type: "folder",
    isOpen: true,
    children: [
      { name: "main.jsx", path: "src/main.jsx", type: "file" },
      { name: "App.jsx", path: "src/App.jsx", type: "file" }
    ]
  }
]
```

## Future Enhancements

1. **AI-Generated Artifacts**: Replace dummy artifacts with real AI-generated code
2. **File Editing**: Allow users to edit files in the Monaco editor
3. **File Operations**: Add/delete/rename files
4. **Version History**: Track artifact versions
5. **Export**: Download artifacts as ZIP files
6. **Sandbox Integration**: Deploy artifacts to live sandboxes
7. **Diff View**: Compare artifact versions

## Testing

To test the artifacts feature:

1. Open the Vibe Coding app
2. Start a new session
3. Click "Create React App" or "Create HTML App" button
4. Browse the file tree in the Explorer
5. Click on files to view their content in the editor
6. Switch to the "Artifacts" tab to see all artifacts

## Notes

- Artifacts are stored per session
- Each session can have multiple artifacts
- The latest artifact is displayed in the editor
- File content is stored as strings in Convex
- The Monaco editor is read-only for dummy artifacts
- Folders are always expanded by default

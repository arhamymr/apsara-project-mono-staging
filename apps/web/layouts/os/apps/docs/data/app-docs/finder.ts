/**
 * Documentation for the Finder App
 * 
 * Requirements: 1.3, 3.1
 */

import type { AppDocumentation } from '../../types';

export const finderDocs: AppDocumentation = {
  id: 'finder',
  name: 'Finder',
  icon: '📁',
  description: 'File management and organization app for browsing and managing your files.',
  categories: [
    {
      id: 'overview',
      name: 'Overview',
      order: 1,
      entries: [
        {
          id: 'introduction',
          title: 'Introduction to Finder',
          slug: 'introduction',
          content: `Finder is your central hub for managing files and folders within the OS environment. It provides an intuitive interface for browsing, organizing, and accessing all your digital assets.

## Key Features

- **File Browsing**: Navigate through your file system with ease
- **Folder Organization**: Create and manage folders to keep your files organized
- **Quick Search**: Find files quickly using the built-in search functionality
- **File Preview**: Preview files without opening them in separate applications
- **Drag and Drop**: Easily move files between folders

## Getting Started

To open Finder, click on the 📁 icon in your dock or use the app launcher. The main window will display your files and folders in a familiar layout.
`,
        },
      ],
    },
    {
      id: 'getting-started',
      name: 'Getting Started',
      order: 2,
      entries: [
        {
          id: 'navigation',
          title: 'Navigating Files',
          slug: 'navigation',
          content: `Learn how to navigate through your files and folders efficiently.

## Basic Navigation

### Using the Sidebar
The sidebar on the left shows your main locations:
- **Recent**: Recently accessed files
- **Favorites**: Your bookmarked folders
- **Folders**: All your folders

### Breadcrumb Navigation
The breadcrumb bar at the top shows your current location. Click on any part of the path to navigate directly to that folder.

\`\`\`
Home > Documents > Projects > MyProject
\`\`\`

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ↑ / ↓ | Navigate up/down in file list |
| Enter | Open selected file/folder |
| Backspace | Go to parent folder |
| Cmd/Ctrl + F | Open search |

## Tips

- Double-click a folder to open it
- Single-click a file to select it
- Use the view toggle to switch between list and grid views
`,
        },
        {
          id: 'file-operations',
          title: 'File Operations',
          slug: 'file-operations',
          content: `Learn how to perform common file operations in Finder.

## Creating Files and Folders

### Create a New Folder
1. Right-click in the file area
2. Select "New Folder"
3. Enter a name for your folder
4. Press Enter to confirm

### Upload Files
1. Click the "Upload" button in the toolbar
2. Select files from your computer
3. Wait for the upload to complete

## Moving and Copying

### Drag and Drop
Simply drag files or folders to move them to a new location.

### Copy Files
1. Select the file(s) you want to copy
2. Right-click and select "Copy"
3. Navigate to the destination
4. Right-click and select "Paste"

## Deleting Files

1. Select the file(s) to delete
2. Press the Delete key or right-click and select "Delete"
3. Confirm the deletion

> **Note**: Deleted files may be recoverable from the trash for a limited time.
`,
        },
      ],
    },
    {
      id: 'features',
      name: 'Features',
      order: 3,
      entries: [
        {
          id: 'search',
          title: 'Search Functionality',
          slug: 'search',
          content: `Finder includes powerful search capabilities to help you find files quickly.

## Basic Search

1. Click the search icon or press \`Cmd/Ctrl + F\`
2. Type your search query
3. Results appear instantly as you type

## Search Filters

You can filter search results by:
- **File Type**: Images, Documents, Videos, etc.
- **Date Modified**: Today, This Week, This Month
- **Size**: Small, Medium, Large

## Search Tips

- Use quotes for exact matches: \`"project report"\`
- Use file extensions to find specific types: \`.pdf\`, \`.jpg\`
- Search is case-insensitive

## Example Searches

\`\`\`
# Find all PDF files
.pdf

# Find files with "report" in the name
report

# Find exact phrase
"quarterly report 2024"
\`\`\`
`,
        },
        {
          id: 'preview',
          title: 'File Preview',
          slug: 'preview',
          content: `Preview files without opening them in a separate application.

## Supported File Types

Finder supports previewing many file types:

- **Images**: JPG, PNG, GIF, SVG, WebP
- **Documents**: PDF, TXT, MD
- **Code**: JS, TS, HTML, CSS, JSON

## Using Preview

### Quick Look
1. Select a file
2. Press Space or click the preview button
3. The preview panel opens on the right

### Preview Panel Features
- Zoom in/out for images
- Scroll through document pages
- Syntax highlighting for code files

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Space | Toggle preview |
| Esc | Close preview |
| + / - | Zoom in/out |
`,
        },
      ],
    },
  ],
};

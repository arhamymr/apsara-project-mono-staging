/**
 * Documentation for the Notes App
 * 
 * Requirements: 1.3, 3.1
 */

import type { AppDocumentation } from '../../types';

export const notesDocs: AppDocumentation = {
  id: 'notes',
  name: 'Notes',
  icon: '📝',
  description: 'A rich text note-taking application for capturing and organizing your thoughts.',
  categories: [
    {
      id: 'overview',
      name: 'Overview',
      order: 1,
      entries: [
        {
          id: 'introduction',
          title: 'Introduction to Notes',
          slug: 'introduction',
          content: `Notes is a powerful note-taking application that helps you capture, organize, and find your thoughts quickly.

## Key Features

- **Rich Text Editing**: Format your notes with headings, lists, and more
- **Folder Organization**: Keep notes organized in folders
- **Quick Search**: Find notes instantly with full-text search
- **Auto-Save**: Never lose your work with automatic saving
- **Markdown Support**: Write in markdown for quick formatting

## Interface Overview

The Notes app has three main areas:

1. **Sidebar**: Browse folders and notes
2. **Note List**: View notes in the selected folder
3. **Editor**: Write and edit your notes

## Getting Started

Click the 📝 icon in your dock to open Notes. Create your first note by clicking the "New Note" button.
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
          id: 'creating-notes',
          title: 'Creating Notes',
          slug: 'creating-notes',
          content: `Learn how to create and manage your notes effectively.

## Create a New Note

1. Click the **+ New Note** button in the toolbar
2. Start typing your note content
3. Your note is automatically saved

## Note Titles

The first line of your note becomes the title. Use a heading for best results:

\`\`\`markdown
# My Note Title

This is the content of my note...
\`\`\`

## Organizing with Folders

### Create a Folder
1. Click the folder icon in the sidebar
2. Enter a folder name
3. Press Enter to create

### Move Notes to Folders
- Drag and drop notes to folders
- Or right-click a note and select "Move to..."

## Quick Tips

- Use \`Cmd/Ctrl + N\` to create a new note quickly
- Pin important notes to keep them at the top
- Use tags to categorize notes across folders
`,
        },
        {
          id: 'formatting',
          title: 'Formatting Your Notes',
          slug: 'formatting',
          content: `Notes supports rich text formatting to make your notes more readable.

## Text Formatting

| Format | Shortcut | Markdown |
|--------|----------|----------|
| **Bold** | Cmd/Ctrl + B | \`**text**\` |
| *Italic* | Cmd/Ctrl + I | \`*text*\` |
| ~~Strikethrough~~ | - | \`~~text~~\` |
| \`Code\` | Cmd/Ctrl + E | \`\\\`code\\\`\` |

## Headings

Use headings to structure your notes:

\`\`\`markdown
# Heading 1
## Heading 2
### Heading 3
\`\`\`

## Lists

### Bullet Lists
\`\`\`markdown
- Item 1
- Item 2
  - Nested item
\`\`\`

### Numbered Lists
\`\`\`markdown
1. First item
2. Second item
3. Third item
\`\`\`

### Checklists
\`\`\`markdown
- [ ] Todo item
- [x] Completed item
\`\`\`

## Code Blocks

For longer code snippets, use fenced code blocks:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`
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
          title: 'Searching Notes',
          slug: 'search',
          content: `Find your notes quickly with powerful search capabilities.

## Basic Search

1. Click the search icon or press \`Cmd/Ctrl + F\`
2. Type your search query
3. Results update as you type

## Search Scope

Search looks through:
- Note titles
- Note content
- Tags

## Search Tips

- Search is case-insensitive
- Use multiple words to narrow results
- Recent searches are saved for quick access

## Filtering Results

Filter your search results by:
- **Folder**: Search within a specific folder
- **Date**: Find notes from a specific time period
- **Tags**: Filter by assigned tags

## Example

To find all notes about "project planning":

1. Open search with \`Cmd/Ctrl + F\`
2. Type "project planning"
3. Review matching notes in the results
`,
        },
        {
          id: 'sharing',
          title: 'Sharing Notes',
          slug: 'sharing',
          content: `Share your notes with others or export them for use elsewhere.

## Export Options

### Export as Markdown
1. Open the note you want to export
2. Click the menu icon (⋮)
3. Select "Export as Markdown"
4. Save the .md file

### Export as PDF
1. Open the note
2. Click the menu icon (⋮)
3. Select "Export as PDF"
4. Choose save location

## Sharing with Others

### Share Link
1. Click the "Share" button
2. Copy the generated link
3. Send to collaborators

### Permissions
When sharing, you can set:
- **View only**: Recipients can read but not edit
- **Can edit**: Recipients can make changes

## Collaboration Tips

- Use comments to discuss changes
- Track version history to see edits
- Mention collaborators with @username
`,
        },
      ],
    },
  ],
};

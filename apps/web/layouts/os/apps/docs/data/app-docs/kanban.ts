/**
 * Documentation for the Kanban App
 * 
 * Requirements: 1.3, 3.1
 */

import type { AppDocumentation } from '../../types';

export const kanbanDocs: AppDocumentation = {
  id: 'kanban',
  name: 'Kanban',
  icon: '📋',
  description: 'Visual project management with customizable boards, columns, and cards.',
  categories: [
    {
      id: 'overview',
      name: 'Overview',
      order: 1,
      entries: [
        {
          id: 'introduction',
          title: 'Introduction to Kanban',
          slug: 'introduction',
          content: `Kanban is a visual project management tool that helps you organize work using boards, columns, and cards.

## What is Kanban?

Kanban is a workflow management method that visualizes work, limits work-in-progress, and maximizes efficiency. Originally developed by Toyota, it's now widely used in software development and project management.

## Key Concepts

- **Board**: A collection of columns representing a workflow
- **Column**: A stage in your workflow (e.g., "To Do", "In Progress", "Done")
- **Card**: A task or work item that moves through columns

## Key Features

- **Multiple Boards**: Create separate boards for different projects
- **Customizable Columns**: Define your own workflow stages
- **Drag and Drop**: Move cards between columns easily
- **Card Details**: Add descriptions, checklists, and due dates
- **Labels**: Categorize cards with color-coded labels

## Getting Started

1. Open Kanban from the dock (📋)
2. Create a new board or select an existing one
3. Add columns to define your workflow
4. Create cards for your tasks
5. Drag cards through columns as work progresses
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
          id: 'creating-boards',
          title: 'Creating Boards',
          slug: 'creating-boards',
          content: `Learn how to create and configure Kanban boards for your projects.

## Create a New Board

1. Click the **+ New Board** button in the sidebar
2. Enter a name for your board
3. Optionally add a description
4. Click "Create"

## Board Templates

Start quickly with pre-configured templates:

- **Basic Kanban**: To Do, In Progress, Done
- **Software Development**: Backlog, Sprint, In Progress, Review, Done
- **Content Pipeline**: Ideas, Writing, Editing, Published

## Board Settings

Access board settings by clicking the gear icon:

- **Name**: Change the board name
- **Description**: Add or edit description
- **Background**: Customize the board appearance
- **Archive**: Archive completed boards

## Example Board Setup

\`\`\`
Project Alpha Board
├── Backlog
├── To Do
├── In Progress
├── Review
└── Done
\`\`\`
`,
        },
        {
          id: 'managing-columns',
          title: 'Managing Columns',
          slug: 'managing-columns',
          content: `Columns represent stages in your workflow. Learn how to create and customize them.

## Add a Column

1. Click **+ Add Column** at the end of your board
2. Enter a column name
3. Press Enter or click outside to save

## Column Options

Click the column menu (⋮) to access:

- **Rename**: Change the column name
- **Set WIP Limit**: Limit cards in this column
- **Move**: Reorder the column
- **Archive All Cards**: Archive all cards in the column
- **Delete**: Remove the column

## Work-in-Progress (WIP) Limits

WIP limits help prevent overload:

\`\`\`
In Progress (3/5)
├── Task 1
├── Task 2
└── Task 3
\`\`\`

When a column reaches its limit, it's highlighted to indicate you should complete existing work before adding more.

## Reordering Columns

Drag columns by their header to reorder them. This helps you adjust your workflow as needed.

## Best Practices

- Keep column names short and clear
- Use 3-7 columns for most workflows
- Set WIP limits to improve flow
- Archive unused columns instead of deleting
`,
        },
        {
          id: 'working-with-cards',
          title: 'Working with Cards',
          slug: 'working-with-cards',
          content: `Cards represent individual tasks or work items. Learn how to create and manage them effectively.

## Create a Card

1. Click **+ Add Card** at the bottom of any column
2. Enter a title for the card
3. Press Enter to create

## Card Details

Click a card to open its detail view:

### Description
Add a detailed description using markdown:

\`\`\`markdown
## Task Overview
This task involves updating the user interface...

## Acceptance Criteria
- [ ] Update header design
- [ ] Add new navigation items
- [ ] Test on mobile devices
\`\`\`

### Checklists
Break down tasks into subtasks:

\`\`\`
Checklist: Design Tasks
☑ Create wireframes
☑ Design mockups
☐ Get approval
☐ Implement changes
\`\`\`

### Due Dates
Set deadlines to track progress:
- Click "Due Date"
- Select a date
- Optionally set a reminder

### Labels
Categorize cards with colored labels:
- 🔴 Urgent
- 🟡 Medium Priority
- 🟢 Low Priority
- 🔵 Feature
- 🟣 Bug

## Moving Cards

- **Drag and Drop**: Drag cards between columns
- **Quick Move**: Right-click → Move to → Select column

## Archiving Cards

Archive completed cards to keep your board clean:
1. Open the card
2. Click "Archive"

View archived cards from the board menu.
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
          id: 'labels-filters',
          title: 'Labels and Filters',
          slug: 'labels-filters',
          content: `Organize and find cards quickly with labels and filters.

## Using Labels

### Create Labels
1. Open any card
2. Click "Labels"
3. Click "Create new label"
4. Choose a color and name
5. Click "Create"

### Apply Labels
1. Open a card
2. Click "Labels"
3. Select one or more labels
4. Labels appear on the card

### Label Colors

| Color | Suggested Use |
|-------|---------------|
| 🔴 Red | Urgent/Critical |
| 🟠 Orange | High Priority |
| 🟡 Yellow | Medium Priority |
| 🟢 Green | Low Priority |
| 🔵 Blue | Feature |
| 🟣 Purple | Bug/Issue |

## Filtering Cards

### Filter by Label
1. Click the "Filter" button
2. Select labels to filter by
3. Only matching cards are shown

### Filter by Member
Filter to see cards assigned to specific people.

### Filter by Due Date
- Overdue
- Due today
- Due this week
- No due date

## Search

Use the search bar to find cards by:
- Title
- Description
- Comments
`,
        },
        {
          id: 'collaboration',
          title: 'Collaboration',
          slug: 'collaboration',
          content: `Work together with your team on Kanban boards.

## Assigning Members

### Add Members to Cards
1. Open a card
2. Click "Members"
3. Select team members
4. Members appear on the card

### Member Avatars
Assigned members show as avatars on cards for quick identification.

## Comments

### Add a Comment
1. Open a card
2. Scroll to the comments section
3. Type your comment
4. Click "Send"

### Mention Team Members
Use @username to notify specific people:

\`\`\`
@john Can you review this task?
\`\`\`

## Activity Log

Every card tracks activity:
- Card created
- Card moved
- Comments added
- Members assigned
- Due dates changed

## Notifications

Get notified when:
- You're assigned to a card
- Someone mentions you
- A card you're watching is updated
- Due dates are approaching

## Best Practices

- Assign clear owners to each card
- Use comments for discussions
- Keep card descriptions updated
- Review boards regularly in team meetings
`,
        },
      ],
    },
  ],
};

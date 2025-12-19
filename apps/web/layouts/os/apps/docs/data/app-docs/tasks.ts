/**
 * Documentation for the Tasks App
 * 
 * Requirements: 1.3, 3.1
 */

import type { AppDocumentation } from '../../types';

export const tasksDocs: AppDocumentation = {
  id: 'tasks',
  name: 'Tasks',
  icon: '✅',
  description: 'A simple task management application for tracking your to-dos.',
  categories: [
    {
      id: 'overview',
      name: 'Overview',
      order: 1,
      entries: [
        {
          id: 'introduction',
          title: 'Introduction to Tasks',
          slug: 'introduction',
          content: `Tasks is a straightforward application for managing your to-do items and staying organized.

## Key Features

- **Simple Interface**: Clean, distraction-free task management
- **Quick Entry**: Add tasks quickly and easily
- **Task Tracking**: Keep track of what needs to be done

## Use Cases

- Daily to-do lists
- Quick reminders
- Simple project tracking
- Personal task management

## Getting Started

Click the ✅ icon in your dock to open Tasks. Start adding your tasks to stay organized.
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
          id: 'managing-tasks',
          title: 'Managing Tasks',
          slug: 'managing-tasks',
          content: `Learn how to create and manage your tasks effectively.

## Creating Tasks

1. Open the Tasks app
2. Enter your task description
3. Press Enter or click Add

## Task Organization

Keep your tasks organized by:
- Prioritizing important items
- Breaking large tasks into smaller ones
- Reviewing and updating regularly

## Best Practices

- Keep task descriptions clear and actionable
- Start tasks with action verbs (e.g., "Review", "Complete", "Send")
- Review your task list daily
- Mark tasks complete as you finish them

## Example Tasks

\`\`\`
✅ Review project proposal
✅ Send weekly report
✅ Schedule team meeting
✅ Update documentation
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
          id: 'productivity-tips',
          title: 'Productivity Tips',
          slug: 'productivity-tips',
          content: `Get the most out of the Tasks app with these tips.

## Daily Workflow

1. **Morning Review**: Check your tasks at the start of each day
2. **Prioritize**: Focus on the most important tasks first
3. **Update**: Mark tasks complete as you finish them
4. **Evening Review**: Plan tomorrow's tasks

## Task Writing Tips

Write effective tasks:

| Instead of | Write |
|------------|-------|
| "Email" | "Send project update to team" |
| "Meeting" | "Prepare slides for Monday meeting" |
| "Report" | "Complete Q4 sales report" |

## Staying Focused

- Work on one task at a time
- Take breaks between tasks
- Celebrate completing tasks
- Don't overload your list

## Integration with Other Apps

Tasks works well alongside:
- **Notes**: For detailed task notes
- **Kanban**: For project-based task management
- **Calendar**: For time-sensitive tasks
`,
        },
      ],
    },
  ],
};

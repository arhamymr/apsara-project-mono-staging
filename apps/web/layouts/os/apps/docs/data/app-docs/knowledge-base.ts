/**
 * Documentation for the Knowledge Base App
 * 
 * Requirements: 1.3, 3.1
 */

import type { AppDocumentation } from '../../types';

export const knowledgeBaseDocs: AppDocumentation = {
  id: 'knowledgebase',
  name: 'Knowledge Base',
  icon: '📚',
  description: 'Create and manage a searchable knowledge base with AI-powered features.',
  categories: [
    {
      id: 'overview',
      name: 'Overview',
      order: 1,
      entries: [
        {
          id: 'introduction',
          title: 'Introduction to Knowledge Base',
          slug: 'introduction',
          content: `Knowledge Base is a powerful tool for creating, organizing, and searching through your team's collective knowledge.

## What is Knowledge Base?

Knowledge Base helps you:
- Document processes and procedures
- Store frequently asked questions
- Share best practices
- Create searchable documentation

## Key Features

- **Rich Content Editor**: Create beautiful documents with formatting
- **AI-Powered Search**: Find information quickly with smart search
- **Categories & Tags**: Organize content logically
- **Version History**: Track changes over time
- **Collaboration**: Work together on documentation

## Use Cases

- **Team Documentation**: Onboarding guides, processes
- **FAQ Repository**: Common questions and answers
- **Technical Docs**: API documentation, guides
- **Policy Documents**: Company policies, procedures

## Getting Started

1. Open Knowledge Base from the dock (📚)
2. Browse existing articles or create new ones
3. Use search to find specific information
4. Organize with categories and tags
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
          id: 'creating-articles',
          title: 'Creating Articles',
          slug: 'creating-articles',
          content: `Learn how to create and publish knowledge base articles.

## Create a New Article

1. Click **+ New Article** in the toolbar
2. Enter a title for your article
3. Write your content in the editor
4. Add categories and tags
5. Click "Publish" when ready

## Article Structure

A well-structured article includes:

\`\`\`markdown
# Article Title

Brief introduction explaining what this article covers.

## Section 1
Content for the first section...

## Section 2
Content for the second section...

## Related Articles
- Link to related article 1
- Link to related article 2
\`\`\`

## Rich Content

### Adding Images
1. Click the image icon in the toolbar
2. Upload or paste an image URL
3. Add alt text for accessibility

### Adding Code
Use code blocks for technical content:

\`\`\`javascript
// Example code
function example() {
  return "Hello, World!";
}
\`\`\`

### Adding Tables

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |

## Draft vs Published

- **Draft**: Only visible to you, work in progress
- **Published**: Visible to all users with access

## Best Practices

- Use clear, descriptive titles
- Break content into logical sections
- Include examples where helpful
- Keep articles focused on one topic
- Update articles when information changes
`,
        },
        {
          id: 'organizing-content',
          title: 'Organizing Content',
          slug: 'organizing-content',
          content: `Keep your knowledge base organized for easy navigation and discovery.

## Categories

### Create a Category
1. Go to Settings → Categories
2. Click "Add Category"
3. Enter name and description
4. Choose a color/icon
5. Save

### Category Hierarchy
Organize categories in a tree structure:

\`\`\`
📁 Engineering
   ├── 📁 Frontend
   ├── 📁 Backend
   └── 📁 DevOps
📁 Product
   ├── 📁 Features
   └── 📁 Roadmap
📁 HR
   ├── 📁 Policies
   └── 📁 Benefits
\`\`\`

### Assign Categories
1. Open an article
2. Click "Categories"
3. Select relevant categories
4. Save changes

## Tags

Tags provide flexible cross-category organization:

- Use tags for topics that span categories
- Keep tags concise and consistent
- Examples: \`onboarding\`, \`api\`, \`security\`, \`faq\`

### Popular Tags
View popular tags to see common topics:
- Click "Tags" in the sidebar
- Browse by tag popularity
- Click a tag to see all related articles

## Navigation

### Sidebar
The sidebar shows:
- All categories
- Recent articles
- Favorites
- Tags

### Breadcrumbs
Navigate using breadcrumbs:
\`\`\`
Home > Engineering > Frontend > React Best Practices
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
          title: 'Search & Discovery',
          slug: 'search',
          content: `Find information quickly with powerful search capabilities.

## Basic Search

1. Click the search bar or press \`Cmd/Ctrl + K\`
2. Type your query
3. Results appear instantly

## AI-Powered Search

Knowledge Base uses AI to understand your queries:

- **Natural Language**: Ask questions naturally
- **Semantic Search**: Finds related content even without exact matches
- **Smart Suggestions**: Get suggestions as you type

### Example Queries

\`\`\`
"How do I reset my password?"
"vacation policy"
"deploy to production steps"
\`\`\`

## Search Filters

Narrow results with filters:

- **Category**: Search within specific categories
- **Author**: Find articles by specific authors
- **Date**: Filter by creation or update date
- **Tags**: Filter by tags

## Search Results

Results show:
- Article title
- Preview snippet with highlighted matches
- Category and tags
- Last updated date

## Quick Actions

From search results:
- Press Enter to open the first result
- Use arrow keys to navigate
- Press Cmd/Ctrl + Enter to open in new tab

## Tips for Better Search

- Use specific keywords
- Try different phrasings
- Use filters to narrow results
- Check related articles for more context
`,
        },
        {
          id: 'ai-features',
          title: 'AI Features',
          slug: 'ai-features',
          content: `Knowledge Base includes AI-powered features to enhance your experience.

## AI Writing Assistant

Get help writing and improving articles:

### Generate Content
1. Start a new article
2. Click "AI Assist"
3. Describe what you want to write
4. Review and edit the generated content

### Improve Writing
Select text and use AI to:
- Fix grammar and spelling
- Improve clarity
- Make content more concise
- Expand on ideas

## Smart Summaries

AI can generate summaries of long articles:

1. Open a long article
2. Click "Generate Summary"
3. A concise summary appears at the top

## Related Articles

AI automatically suggests related articles based on:
- Content similarity
- Common tags
- User reading patterns

## Question Answering

Ask questions and get answers from your knowledge base:

1. Type a question in search
2. AI finds relevant articles
3. Get a direct answer with source links

### Example

**Question**: "What's our refund policy?"

**AI Answer**: "Our refund policy allows returns within 30 days of purchase. Full details can be found in the Refund Policy article."

## Best Practices

- Review AI-generated content before publishing
- Use AI suggestions as a starting point
- Keep your knowledge base updated for better AI results
- Provide feedback to improve AI accuracy
`,
        },
        {
          id: 'collaboration',
          title: 'Collaboration',
          slug: 'collaboration',
          content: `Work together with your team on knowledge base content.

## Editing Together

### Concurrent Editing
Multiple users can edit different articles simultaneously.

### Edit Locking
When someone is editing an article:
- Others see "Currently being edited by [name]"
- They can view but not edit
- Lock releases when editor saves or leaves

## Comments & Feedback

### Add Comments
1. Open an article
2. Scroll to the comments section
3. Type your comment
4. Click "Post"

### Inline Comments
Highlight text to add inline comments:
1. Select text
2. Click the comment icon
3. Add your feedback
4. Save

## Review Workflow

### Request Review
1. Finish your draft
2. Click "Request Review"
3. Select reviewers
4. Add a message

### Review Process
Reviewers can:
- Approve the article
- Request changes
- Add comments
- Suggest edits

## Version History

Track all changes to articles:

1. Open an article
2. Click "History"
3. View all versions
4. Compare changes
5. Restore previous versions if needed

## Notifications

Get notified about:
- Comments on your articles
- Review requests
- Article updates you're following
- Mentions (@username)

## Permissions

Control who can:
- View articles
- Edit articles
- Publish articles
- Manage categories
`,
        },
      ],
    },
  ],
};

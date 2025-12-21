import { EndpointDoc, Permission } from './types';

export const PERMISSIONS: { value: Permission; label: string; description: string }[] = [
  { value: 'blogs:read', label: 'Read Blogs', description: 'Access published blog posts' },
  { value: 'blogs:write', label: 'Write Blogs', description: 'Create and update blog posts' },
  { value: 'leads:read', label: 'Read Leads', description: 'View lead information' },
  { value: 'leads:write', label: 'Write Leads', description: 'Create and update leads' },
  { value: 'analytics:read', label: 'Read Analytics', description: 'Access usage analytics' },
];

export const API_ENDPOINTS: EndpointDoc[] = [
  {
    method: 'GET',
    path: '/api/v1/blogs',
    description: 'List all published blog posts with pagination',
    requiredPermission: 'blogs:read',
    responseExample: {
      data: [
        {
          id: 'blog_123',
          title: 'Getting Started',
          slug: 'getting-started',
          excerpt: 'Learn how to get started...',
          coverImage: 'https://...',
          tags: ['tutorial'],
          publishedAt: '2024-01-15T10:00:00Z',
        },
      ],
      pagination: { page: 1, perPage: 10, total: 25, hasMore: true },
    },
  },
  {
    method: 'GET',
    path: '/api/v1/blogs/:slug',
    description: 'Get a single blog post by slug',
    requiredPermission: 'blogs:read',
    responseExample: {
      id: 'blog_123',
      title: 'Getting Started',
      slug: 'getting-started',
      content: '<p>Full HTML content...</p>',
      excerpt: 'Learn how to get started...',
      coverImage: 'https://...',
      authorName: 'John Doe',
      tags: ['tutorial'],
      publishedAt: '2024-01-15T10:00:00Z',
    },
  },
  {
    method: 'POST',
    path: '/api/v1/leads',
    description: 'Submit a new lead. Specify pipelineId to add to an existing pipeline, or leave empty to create/use "API Leads" pipeline.',
    requiredPermission: 'leads:write',
    requestBody: {
      type: 'object',
      properties: {
        name: { type: 'string', required: true, description: 'Lead name' },
        email: { type: 'string', required: true, description: 'Email address' },
        phone: { type: 'string', description: 'Phone number' },
        company: { type: 'string', description: 'Company name' },
        source: { type: 'string', description: 'Lead source (e.g., website, api)' },
        notes: { type: 'string', description: 'Additional notes' },
        pipelineId: { type: 'string', description: 'Pipeline ID to add lead to (uses first column). Get from /api/v1/pipelines' },
        columnId: { type: 'string', description: 'Specific column ID (overrides pipelineId)' },
      },
    },
    responseExample: {
      id: 'lead_456',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'new',
      createdAt: 1705312800000,
    },
  },
  {
    method: 'GET',
    path: '/api/v1/health',
    description: 'Check API health status (no authentication required)',
    requiredPermission: 'blogs:read',
    responseExample: {
      status: 'healthy',
      version: '1.0.0',
      time: '2024-01-15T10:00:00Z',
    },
  },
];

export const CODE_EXAMPLES = {
  curl: {
    blogs: `curl -X GET "YOUR_API_BASE_URL/api/v1/blogs" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
    lead: `curl -X POST "YOUR_API_BASE_URL/api/v1/leads" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Inc",
    "source": "website_contact_form",
    "pipelineId": "YOUR_PIPELINE_ID"
  }'`,
  },
  javascript: {
    blogs: `const response = await fetch('YOUR_API_BASE_URL/api/v1/blogs', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
const blogs = await response.json();`,
    lead: `const response = await fetch('YOUR_API_BASE_URL/api/v1/leads', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Inc',
    source: 'website_contact_form',
    pipelineId: 'YOUR_PIPELINE_ID'
  })
});
const lead = await response.json();`,
  },
  python: {
    blogs: `import requests

response = requests.get(
    'YOUR_API_BASE_URL/api/v1/blogs',
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)
blogs = response.json()`,
    lead: `import requests

response = requests.post(
    'YOUR_API_BASE_URL/api/v1/leads',
    headers={'Authorization': 'Bearer YOUR_API_KEY'},
    json={
        'name': 'John Doe',
        'email': 'john@example.com',
        'company': 'Acme Inc',
        'source': 'website_contact_form',
        'pipelineId': 'YOUR_PIPELINE_ID'
    }
)
lead = response.json()`,
  },
};

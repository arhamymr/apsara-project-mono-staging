'use client';

import { useState, useMemo } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { toast } from 'sonner';

interface BlogApiHelperModalProps {
  onClose: () => void;
}

type Language = 'curl' | 'javascript' | 'typescript' | 'python';
type Endpoint = 'list' | 'get';

export function BlogApiHelperModal({ onClose }: BlogApiHelperModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('curl');
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>('list');
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}/api/v1`
    : 'https://your-domain.com/api/v1';

  const authToken = 'YOUR_API_KEY_HERE';

  const endpoints = [
    { id: 'list' as Endpoint, label: 'List Blogs', method: 'GET', path: '/blogs' },
    { id: 'get' as Endpoint, label: 'Get Blog', method: 'GET', path: '/blogs/:slug' },
  ];

  const codeExamples = useMemo(() => {
    const examples: Record<Endpoint, Record<Language, string>> = {
      list: {
        curl: `curl -X GET "${baseUrl}/blogs?page=1&limit=10" \\
  -H "Authorization: Bearer ${authToken}"`,
        javascript: `const response = await fetch('${baseUrl}/blogs?page=1&limit=10', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ${authToken}'
  }
});

const { data, pagination } = await response.json();
console.log('Blogs:', data);`,
        typescript: `interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    hasMore: boolean;
  };
}

const listBlogs = async (page = 1, limit = 10): Promise<PaginatedResponse<Blog>> => {
  const response = await fetch(\`${baseUrl}/blogs?page=\${page}&limit=\${limit}\`, {
    headers: {
      'Authorization': 'Bearer ${authToken}'
    }
  });

  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }

  return response.json();
};

// Usage
const { data: blogs, pagination } = await listBlogs(1, 10);`,
        python: `import requests

url = "${baseUrl}/blogs"
headers = {
    "Authorization": "Bearer ${authToken}"
}
params = {
    "page": 1,
    "limit": 10
}

response = requests.get(url, headers=headers, params=params)

if response.status_code == 200:
    result = response.json()
    blogs = result["data"]
    pagination = result["pagination"]
    print(f"Found {len(blogs)} blogs")
else:
    print(f"Error: {response.status_code}")`
      },
      get: {
        curl: `curl -X GET "${baseUrl}/blogs/my-blog-slug" \\
  -H "Authorization: Bearer ${authToken}"`,
        javascript: `const slug = 'my-blog-slug';
const response = await fetch(\`${baseUrl}/blogs/\${slug}\`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ${authToken}'
  }
});

const blog = await response.json();
console.log('Blog:', blog);`,
        typescript: `interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

const getBlog = async (slug: string): Promise<Blog> => {
  const response = await fetch(\`${baseUrl}/blogs/\${slug}\`, {
    headers: {
      'Authorization': 'Bearer ${authToken}'
    }
  });

  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }

  return response.json();
};

// Usage
const blog = await getBlog('my-blog-slug');`,
        python: `import requests

slug = "my-blog-slug"
url = f"${baseUrl}/blogs/{slug}"
headers = {
    "Authorization": "Bearer ${authToken}"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    blog = response.json()
    print(f"Blog: {blog['title']}")
else:
    print(f"Error: {response.status_code}")`
      }
    };

    return examples;
  }, [baseUrl, authToken]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeExamples[selectedEndpoint][selectedLanguage]);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const languages = [
    { id: 'curl' as Language, label: 'cURL' },
    { id: 'javascript' as Language, label: 'JavaScript' },
    { id: 'typescript' as Language, label: 'TypeScript' },
    { id: 'python' as Language, label: 'Python' },
  ];

  const currentEndpoint = endpoints.find((e) => e.id === selectedEndpoint);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background border-border relative flex w-full max-w-3xl flex-col rounded-lg border shadow-lg">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Blog API Integration</h2>
            <p className="text-muted-foreground text-sm">
              {currentEndpoint?.method} {currentEndpoint?.path}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Endpoint Selector */}
        <div className="border-border flex gap-2 border-b px-6 py-3">
          {endpoints.map((endpoint) => (
            <button
              key={endpoint.id}
              onClick={() => setSelectedEndpoint(endpoint.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedEndpoint === endpoint.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {endpoint.label}
            </button>
          ))}
        </div>

        {/* Language Tabs */}
        <div className="border-border flex gap-1 border-b px-6 py-3">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                selectedLanguage === lang.id
                  ? 'bg-secondary text-secondary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Code Display */}
        <div className="max-h-[400px] overflow-auto p-6">
          <div className="bg-muted relative rounded-lg">
            <div className="border-border flex items-center justify-between border-b px-4 py-2">
              <span className="text-muted-foreground text-xs font-medium">
                {languages.find((l) => l.id === selectedLanguage)?.label}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 gap-1 text-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <pre className="overflow-x-auto p-4">
              <code className="text-sm">{codeExamples[selectedEndpoint][selectedLanguage]}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="border-border border-t px-6 py-4">
          <div className="text-muted-foreground text-xs">
            <p>• Replace <code className="bg-muted rounded px-1">YOUR_API_KEY_HERE</code> with your API key from API Hub</p>
            <p>• Requires <code className="bg-muted rounded px-1">blogs:read</code> permission for GET requests</p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { toast } from 'sonner';

interface ApiHelperModalProps {
  pipeline: any;
  onClose: () => void;
}

type Language = 'curl' | 'javascript' | 'typescript' | 'python';

export function ApiHelperModal({ pipeline, onClose }: ApiHelperModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('curl');
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}/api/v1`
    : 'https://your-domain.com/api/v1';

  const authToken = 'YOUR_API_KEY_HERE';

  // Get first column for examples
  const firstColumn = pipeline?.columns?.[0];
  const pipelineId = pipeline?._id;
  const columnId = firstColumn?._id;

  const codeExamples = useMemo(() => {
    const examples: Record<Language, string> = {
      curl: `curl -X POST "${baseUrl}/leads" \\
  -H "Authorization: Bearer ${authToken}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "pipelineId": "${pipelineId}",
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "phone": "+1-555-0123",
    "source": "Website",
    "notes": "Interested in enterprise plan"
  }'`,
      javascript: `const response = await fetch('${baseUrl}/leads', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${authToken}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    pipelineId: '${pipelineId}',
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Corp',
    phone: '+1-555-0123',
    source: 'Website',
    notes: 'Interested in enterprise plan'
  })
});

const lead = await response.json();
console.log('Lead created:', lead);`,
      typescript: `interface CreateLeadRequest {
  pipelineId: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  source?: string;
  notes?: string;
}

const createLead = async (data: CreateLeadRequest) => {
  const response = await fetch('${baseUrl}/leads', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ${authToken}',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }

  return response.json();
};

// Usage
const lead = await createLead({
  pipelineId: '${pipelineId}',
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Acme Corp',
  phone: '+1-555-0123',
  source: 'Website',
  notes: 'Interested in enterprise plan'
});`,
      python: `import requests

url = "${baseUrl}/leads"
headers = {
    "Authorization": "Bearer ${authToken}",
    "Content-Type": "application/json"
}
data = {
    "pipelineId": "${pipelineId}",
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "phone": "+1-555-0123",
    "source": "Website",
    "notes": "Interested in enterprise plan"
}

response = requests.post(url, headers=headers, json=data)

if response.status_code == 201:
    lead = response.json()
    print(f"Lead created: {lead}")
else:
    print(f"Error: {response.status_code}")`
    };

    return examples;
  }, [baseUrl, authToken, pipelineId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeExamples[selectedLanguage]);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background border-border relative flex w-full max-w-3xl flex-col rounded-lg border shadow-lg">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Create Lead via API</h2>
            <p className="text-muted-foreground text-sm">
              POST /api/v1/leads
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Pipeline Info */}
        <div className="border-border border-b px-6 py-3">
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Pipeline:</span>
              <span className="ml-2 font-medium">{pipeline?.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Pipeline ID:</span>
              <code className="bg-muted ml-2 rounded px-1.5 py-0.5 text-xs">{pipelineId}</code>
            </div>
            <div>
              <span className="text-muted-foreground">First Column:</span>
              <span className="ml-2">{firstColumn?.title}</span>
            </div>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="border-border flex gap-1 border-b px-6 py-3">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                selectedLanguage === lang.id
                  ? 'bg-primary text-primary-foreground'
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
              <code className="text-sm">{codeExamples[selectedLanguage]}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="border-border border-t px-6 py-4">
          <div className="text-muted-foreground text-xs">
            <p>• Replace <code className="bg-muted rounded px-1">YOUR_API_KEY_HERE</code> with your API key from API Hub</p>
            <p>• New leads will be added to the first column of this pipeline</p>
          </div>
        </div>
      </div>
    </div>
  );
}

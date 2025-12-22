'use client';

import { useState, useMemo } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import { toast } from 'sonner';

interface ApiHelperModalProps {
  pipeline: any;
  onClose: () => void;
}

type Language = 'curl' | 'javascript' | 'typescript' | 'python';

export function ApiHelperModal({ pipeline, onClose }: ApiHelperModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('curl');
  const [copied, setCopied] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}/api/v1`
    : 'https://your-domain.com/api/v1';

  const authToken = 'YOUR_API_KEY_HERE';

  // Get first column for examples
  const firstColumn = pipeline?.columns?.[0];
  const pipelineId = pipeline?._id;

  // Payload example for POST request
  const payloadExample = useMemo(() => {
    return JSON.stringify({
      pipelineId: pipelineId || 'PIPELINE_ID',
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Acme Corp',
      phone: '+1-555-0123',
      value: 5000,
      source: 'Website',
      notes: 'Interested in enterprise plan'
    }, null, 2);
  }, [pipelineId]);

  const payloadSchema = `{
  "pipelineId": string,    // Required - ID of the target pipeline
  "name": string,          // Required - Lead's full name
  "email": string,         // Optional - Lead's email address
  "company": string,       // Optional - Company name
  "phone": string,         // Optional - Phone number
  "value": number,         // Optional - Deal value
  "source": string,        // Optional - Lead source (e.g., "Website", "Referral")
  "notes": string          // Optional - Additional notes
}`;

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

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(payloadExample);
      setCopiedPayload(true);
      toast.success('Payload copied to clipboard!');
      setTimeout(() => setCopiedPayload(false), 2000);
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

        {/* Main Tabs: Code & Payload */}
        <Tabs defaultValue="code" className="flex-1 flex flex-col overflow-hidden">
          <div className="border-border border-b px-6">
            <TabsList className="h-10 bg-transparent p-0">
              <TabsTrigger value="code" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                Code Examples
              </TabsTrigger>
              <TabsTrigger value="payload" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                Payload (POST)
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="code" className="flex-1 overflow-hidden flex flex-col m-0">
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
            <div className="flex-1 overflow-auto p-6">
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
          </TabsContent>

          <TabsContent value="payload" className="flex-1 overflow-auto m-0 p-6">
            <div className="space-y-4">
              {/* Payload Schema */}
              <div>
                <h3 className="text-sm font-medium mb-2">Request Body Schema</h3>
                <div className="bg-muted rounded-lg">
                  <pre className="overflow-x-auto p-4">
                    <code className="text-sm text-muted-foreground">{payloadSchema}</code>
                  </pre>
                </div>
              </div>

              {/* Example Payload */}
              <div>
                <h3 className="text-sm font-medium mb-2">Example Payload</h3>
                <div className="bg-muted relative rounded-lg">
                  <div className="border-border flex items-center justify-between border-b px-4 py-2">
                    <span className="text-muted-foreground text-xs font-medium">JSON</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyPayload}
                      className="h-7 gap-1 text-xs"
                    >
                      {copiedPayload ? (
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
                    <code className="text-sm">{payloadExample}</code>
                  </pre>
                </div>
              </div>

              {/* Notes */}
              <div className="text-muted-foreground text-xs space-y-1">
                <p>• The <code className="bg-muted rounded px-1">pipelineId</code> field is required and must match an existing pipeline</p>
                <p>• New leads will be automatically added to the first column of the pipeline</p>
                <p>• The <code className="bg-muted rounded px-1">value</code> field accepts numeric values for deal tracking</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

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

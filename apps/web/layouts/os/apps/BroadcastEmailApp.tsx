import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Check,
  ChevronsUpDown,
  Clock8,
  Eye,
  FileEdit,
  Inbox,
  Layers,
  ListChecks,
  Mail,
  Paperclip,
  Plus,
  Save,
  Send,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';

// ------------------------------------------------------------
// Broadcast Email UI — UI-only (no data fetching)
// - Single-file React component
// - Tailwind + shadcn-ui + lucide-react
// - Screens: Dashboard, Lists, Subscribers, Templates, Campaigns (Create Wizard)
// - Inertia-ready: mount this as a page component
// ------------------------------------------------------------

// Mock data
const MOCK_LISTS = [
  {
    id: 1,
    name: 'Customers',
    from_name: 'Apsara',
    from_email: 'noreply@apsara.dev',
    subscribers: 4280,
  },
  {
    id: 2,
    name: 'Leads',
    from_name: 'Apsara',
    from_email: 'hello@apsara.dev',
    subscribers: 1023,
  },
];

const MOCK_TEMPLATES = [
  {
    id: 1,
    name: 'Product Update',
    subject: "What's new this week",
    updated_at: '2025-11-06',
  },
  {
    id: 2,
    name: 'Promo Flash',
    subject: '🔥 40% OFF ends tonight',
    updated_at: '2025-11-07',
  },
];

const MOCK_CAMPAIGNS = [
  {
    id: 1,
    name: 'Black Friday Teaser',
    subject: 'Save the date',
    list: 'Leads',
    status: 'completed',
    sent: 980,
    opens: 512,
    clicks: 141,
  },
  {
    id: 2,
    name: 'October Newsletter',
    subject: 'Hello October',
    list: 'Customers',
    status: 'completed',
    sent: 4100,
    opens: 1880,
    clicks: 402,
  },
  {
    id: 3,
    name: 'New Feature ✨',
    subject: 'AI Templates launched',
    list: 'Customers',
    status: 'draft',
    sent: 0,
    opens: 0,
    clicks: 0,
  },
];

// Utility: Step component
function Stepper({
  step,
  setStep,
}: {
  step: number;
  setStep: (n: number) => void;
}) {
  const steps = ['Audience', 'Content', 'Settings', 'Review'] as const;
  return (
    <div className="flex items-center gap-3">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <button
            type="button"
            onClick={() => setStep(i)}
            className={
              'relative inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm transition ' +
              (i <= step
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80')
            }
          >
            <span className="bg-background text-foreground inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold">
              {i + 1}
            </span>
            {s}
          </button>
          {i < steps.length - 1 && <div className="bg-border h-px flex-1" />}
        </React.Fragment>
      ))}
    </div>
  );
}

// Utility: Simple Stat Card
function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="border-border/60 border">
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        {hint && (
          <div className="text-muted-foreground mt-1 text-xs">{hint}</div>
        )}
      </CardContent>
    </Card>
  );
}

function Topbar({ onNewCampaign }: { onNewCampaign: () => void }) {
  return (
    <div className="bg-background/80 sticky top-0 z-20 flex items-center justify-between border-b px-4 py-3 backdrop-blur">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Mail className="h-4 w-4" />
        <span>Broadcast</span>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <Sparkles className="mr-2 h-4 w-4" /> AI Assistant
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate subject & content ideas</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button size="sm" onClick={onNewCampaign}>
          <Plus className="mr-2 h-4 w-4" /> New Campaign
        </Button>
      </div>
    </div>
  );
}

function Sidebar({
  view,
  setView,
}: {
  view: string;
  setView: (v: string) => void;
}) {
  const items = [
    { key: 'dashboard', icon: Inbox, label: 'Dashboard' },
    { key: 'lists', icon: ListChecks, label: 'Lists' },
    { key: 'subscribers', icon: Users, label: 'Subscribers' },
    { key: 'templates', icon: Layers, label: 'Templates' },
    { key: 'campaigns', icon: Send, label: 'Campaigns' },
    { key: 'settings', icon: Settings, label: 'Settings' },
  ];
  return (
    <aside className="bg-muted/30 hidden w-[240px] shrink-0 border-r p-3 md:block">
      <div className="text-muted-foreground mb-3 px-2 text-xs font-semibold tracking-wide uppercase">
        Menu
      </div>
      <nav className="grid gap-1">
        {items.map((it) => (
          <Button
            key={it.key}
            variant={view === it.key ? 'secondary' : 'ghost'}
            className="justify-start"
            onClick={() => setView(it.key)}
          >
            <it.icon className="mr-2 h-4 w-4" /> {it.label}
          </Button>
        ))}
      </nav>
    </aside>
  );
}

function DashboardView() {
  return (
    <div className="grid gap-4 p-4 md:grid-cols-3">
      <div className="grid gap-4 sm:grid-cols-3 md:col-span-2">
        <Stat label="Total Sent" value="5,080" hint="Last 30 days" />
        <Stat label="Avg. Open Rate" value="31%" hint="Across all campaigns" />
        <Stat label="Avg. CTR" value="8.4%" hint="Across all campaigns" />
      </div>
      <Card className="border-border/60 border">
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Recent Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_CAMPAIGNS.slice(0, 3).map((c) => (
            <div key={c.id} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-muted-foreground text-xs">{c.subject}</div>
              </div>
              <Badge variant="outline">{c.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/60 border md:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Performance Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {MOCK_CAMPAIGNS.map((c) => (
              <div key={c.id} className="rounded-xl border p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{c.name}</div>
                  <Badge variant="outline" className="capitalize">
                    {c.status}
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="text-xl font-semibold">{c.sent}</div>
                    <div className="text-muted-foreground text-xs">Sent</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold">{c.opens}</div>
                    <div className="text-muted-foreground text-xs">Opens</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold">{c.clicks}</div>
                    <div className="text-muted-foreground text-xs">Clicks</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ListsView() {
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Lists</div>
          <div className="text-muted-foreground text-sm">
            Manage sender details and audiences
          </div>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> New List
        </Button>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Subscribers</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_LISTS.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell>
                  {l.from_name} &lt;{l.from_email}&gt;
                </TableCell>
                <TableCell>{l.subscribers.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <FileEdit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function SubscribersView() {
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Subscribers</div>
          <div className="text-muted-foreground text-sm">
            Import and manage audience members
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Paperclip className="mr-2 h-4 w-4" /> Import CSV
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Subscriber
          </Button>
        </div>
      </div>
      <Card>
        <div className="flex items-center gap-2 p-3">
          <Input placeholder="Search email or tag..." />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="subscribed">Subscribed</SelectItem>
              <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
              <SelectItem value="bounced">Bounced</SelectItem>
              <SelectItem value="complained">Complained</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <ChevronsUpDown className="mr-2 h-4 w-4" /> Sort
          </Button>
        </div>
        <Separator />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(8)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>user{i}@example.com</TableCell>
                <TableCell>Jane {i}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    subscribed
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary">buyer</Badge>
                    <Badge variant="secondary">newsletter</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function TemplatesView() {
  const [preview, setPreview] = useState<string | null>(null);
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Templates</div>
          <div className="text-muted-foreground text-sm">
            Create and reuse email layouts
          </div>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> New Template
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_TEMPLATES.map((t) => (
          <Card key={t.id} className="border-border/60 border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>{t.name}</span>
                <Badge variant="outline">Updated {t.updated_at}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-muted-foreground text-sm">{t.subject}</div>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" /> Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Preview — {t.name}</DialogTitle>
                    </DialogHeader>
                    <div className="rounded-lg border p-4 text-sm">
                      <p className="mb-2 font-medium">Subject: {t.subject}</p>
                      <p className="text-muted-foreground">
                        This is a placeholder preview. Paste your HTML here in
                        the editor when composing a campaign.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="sm">
                  <FileEdit className="mr-2 h-4 w-4" /> Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CampaignCreateWizard({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    subject: '',
    preheader: '',
    listId: 1,
    templateId: 1,
    provider: 'ses',
    schedule: '',
    batchSize: 500,
    utm: 'utm_source=newsletter&utm_medium=email',
    html: '<h1>Hello {{ first_name }}</h1>\n<p>Welcome to our update.</p>',
    text: 'Hello {{ first_name }} — Welcome to our update.',
  });

  const listOptions = MOCK_LISTS;
  const templateOptions = MOCK_TEMPLATES;

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Create Campaign</div>
          <div className="text-muted-foreground text-sm">
            Audience → Content → Settings → Review
          </div>
        </div>
        <div className="flex gap-2">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          ) : (
            <Button onClick={onDone}>
              <Send className="mr-2 h-4 w-4" /> Done
            </Button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <Stepper step={step} setStep={setStep} />
      </div>

      {step === 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Audience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Label>List</Label>
                <Select
                  value={String(form.listId)}
                  onValueChange={(v) => setForm({ ...form, listId: Number(v) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select list" />
                  </SelectTrigger>
                  <SelectContent>
                    {listOptions.map((l) => (
                      <SelectItem key={l.id} value={String(l.id)}>
                        {l.name} — {l.subscribers} subs
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label>Segment (optional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All subscribers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All subscribers</SelectItem>
                    <SelectItem value="buyers">Tag: buyer</SelectItem>
                    <SelectItem value="recent">Last engaged 30d</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estimate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {listOptions
                  .find((l) => l.id === form.listId)
                  ?.subscribers.toLocaleString()}
              </div>
              <div className="text-muted-foreground mt-1 text-sm">
                Potential recipients
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Label>Template</Label>
                <Select
                  value={String(form.templateId)}
                  onValueChange={(v) =>
                    setForm({ ...form, templateId: Number(v) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templateOptions.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label>Subject</Label>
                <Input
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  placeholder="e.g., What's new this week"
                />
              </div>
              <div className="grid gap-3">
                <Label>Preheader</Label>
                <Input
                  value={form.preheader}
                  onChange={(e) =>
                    setForm({ ...form, preheader: e.target.value })
                  }
                  placeholder="Short preview line"
                />
              </div>
              <div className="grid gap-3">
                <Label>HTML</Label>
                <Textarea
                  value={form.html}
                  onChange={(e) => setForm({ ...form, html: e.target.value })}
                  className="min-h-[220px] font-mono"
                />
              </div>
              <div className="grid gap-3">
                <Label>Text (fallback)</Label>
                <Textarea
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  className="min-h-[120px] font-mono"
                />
              </div>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" /> Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Preview</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-3">
                        <div className="mb-2 text-sm font-semibold">HTML</div>
                        <div
                          className="prose prose-sm dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: form.html }}
                        />
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="mb-2 text-sm font-semibold">Text</div>
                        <pre className="text-sm whitespace-pre-wrap">
                          {form.text}
                        </pre>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost">
                  <Sparkles className="mr-2 h-4 w-4" /> AI Suggest
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Merge Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <code>{'{{ first_name }}'}</code>{' '}
                <Button size="sm" variant="ghost">
                  Copy
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <code>{'{{ last_name }}'}</code>{' '}
                <Button size="sm" variant="ghost">
                  Copy
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <code>{'{{ email }}'}</code>{' '}
                <Button size="sm" variant="ghost">
                  Copy
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <code>{'{{ unsubscribe_url }}'}</code>{' '}
                <Button size="sm" variant="ghost">
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Label>Provider</Label>
                <Select
                  value={form.provider}
                  onValueChange={(v) => setForm({ ...form, provider: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ses">SES</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="brevo">Brevo</SelectItem>
                    <SelectItem value="smtp">SMTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label>Schedule</Label>
                <Input
                  type="datetime-local"
                  value={form.schedule}
                  onChange={(e) =>
                    setForm({ ...form, schedule: e.target.value })
                  }
                />
                <div className="text-muted-foreground text-xs">
                  Leave empty to send now (in real app).
                </div>
              </div>
              <div className="grid gap-3">
                <Label>Batch Size</Label>
                <Input
                  type="number"
                  value={form.batchSize}
                  onChange={(e) =>
                    setForm({ ...form, batchSize: Number(e.target.value) })
                  }
                />
              </div>
              <div className="grid gap-3">
                <Label>UTM Params</Label>
                <Input
                  value={form.utm}
                  onChange={(e) => setForm({ ...form, utm: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Include unsubscribe link</span>{' '}
                <Check className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>Plain-text part</span>{' '}
                <Check className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>List-Unsubscribe header</span>{' '}
                <Check className="h-4 w-4 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <div className="text-muted-foreground text-xs">Name</div>
                  <div className="font-medium">{form.name || '(auto)'}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-muted-foreground text-xs">Subject</div>
                  <div className="font-medium">{form.subject}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-muted-foreground text-xs">List</div>
                  <div className="font-medium">
                    {MOCK_LISTS.find((l) => l.id === form.listId)?.name}
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-muted-foreground text-xs">Provider</div>
                  <div className="font-medium uppercase">{form.provider}</div>
                </div>
                <div className="rounded-lg border p-3 md:col-span-2">
                  <div className="text-muted-foreground text-xs">Schedule</div>
                  <div className="font-medium">
                    {form.schedule || 'Send now'}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="rounded-lg border p-3">
                <div className="text-muted-foreground mb-2 text-xs">
                  Preview
                </div>
                <div
                  className="prose prose-sm dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: form.html }}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">
                <Send className="mr-2 h-4 w-4" /> Send (UI only)
              </Button>
              <Button variant="outline" className="w-full">
                <Clock8 className="mr-2 h-4 w-4" /> Schedule
              </Button>
              <Button variant="ghost" className="w-full">
                <Save className="mr-2 h-4 w-4" /> Save Draft
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function CampaignsView({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Campaigns</div>
          <div className="text-muted-foreground text-sm">
            Manage and track broadcasts
          </div>
        </div>
        <Button size="sm" onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Campaign
        </Button>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>List</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Metrics</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_CAMPAIGNS.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.subject}</TableCell>
                <TableCell>{c.list}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-right text-sm">
                  {c.opens} opens • {c.clicks} clicks
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default function BroadcastEmailUI() {
  const [view, setView] = useState<string>('dashboard');
  const [creating, setCreating] = useState<boolean>(false);

  return (
    <div className="bg-background text-foreground flex min-h-screen">
      <Sidebar
        view={view}
        setView={(v) => {
          setCreating(false);
          setView(v);
        }}
      />
      <main className="flex-1">
        <Topbar
          onNewCampaign={() => {
            setCreating(true);
            setView('campaigns');
          }}
        />
        {!creating && view === 'dashboard' && <DashboardView />}
        {!creating && view === 'lists' && <ListsView />}
        {!creating && view === 'subscribers' && <SubscribersView />}
        {!creating && view === 'templates' && <TemplatesView />}
        {!creating && view === 'campaigns' && (
          <CampaignsView onCreate={() => setCreating(true)} />
        )}
        {!creating && view === 'settings' && (
          <div className="p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Settings</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                Provider credentials, domain auth (SPF/DKIM/DMARC), default UTM,
                etc. (UI only)
              </CardContent>
            </Card>
          </div>
        )}
        {creating && <CampaignCreateWizard onDone={() => setCreating(false)} />}
      </main>
    </div>
  );
}

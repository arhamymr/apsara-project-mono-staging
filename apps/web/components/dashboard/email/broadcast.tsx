'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  CalendarIcon,
  Eye,
  Loader2,
  Mail,
  PanelRightClose,
  PanelRightOpen,
  Send,
  Sparkles,
  TestTube2,
} from 'lucide-react';
import { useState } from 'react';

/**
 * Broadcast Email UI — UI only (no external logic)
 * - Minimal state just for toggles and mock interactions
 * - Uses Tailwind + shadcn/ui
 * - Dark/light aware via bg-background/text-foreground tokens
 * - Responsive & container-query friendly (uses @md, @lg)
 */
export default function BroadcastEmailUI() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [abEnabled, setAbEnabled] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  return (
    <div className="bg-background text-foreground w-full">
      {/* Header */}
      <div className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
        <div className="mx-auto flex max-w-screen-2xl items-center gap-3 px-4 py-3 @md:px-6">
          <Mail className="size-5" />
          <div className="mr-auto">
            <h1 className="text-base leading-tight font-semibold @md:text-lg">
              Broadcast Email
            </h1>
            <p className="text-muted-foreground text-xs">
              Compose, target, and schedule a one-to-many campaign.
            </p>
          </div>
          <div className="hidden items-center gap-2 @md:flex">
            <Button variant="secondary" size="sm">
              Save draft
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLoadingPreview(true);
                setTimeout(() => setLoadingPreview(false), 800);
              }}
            >
              {loadingPreview ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Eye className="mr-2 size-4" />
              )}
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <TestTube2 className="mr-2 size-4" />
              Send test
            </Button>
            {scheduled ? (
              <Button size="sm">
                <Send className="mr-2 size-4" />
                Schedule
              </Button>
            ) : (
              <Button size="sm" className="gap-2">
                <Send className="size-4" />
                Send now
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-4 px-4 py-4 @md:px-6 @lg:grid-cols-12">
        {/* Compose column */}
        <div className="space-y-4 @lg:col-span-8">
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Compose</CardTitle>
              <CardDescription>
                From info, subject, and content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* From & Reply-to */}
              <div className="grid gap-3 @md:grid-cols-2">
                <div className="space-y-2">
                  <Label>From name</Label>
                  <Input placeholder="Apsara Digital" />
                </div>
                <div className="space-y-2">
                  <Label>From email</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="noreply@apsara.id">
                        noreply@apsara.id
                      </SelectItem>
                      <SelectItem value="hello@apsara.id">
                        hello@apsara.id
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 @md:col-span-2">
                  <Label>Reply-to (optional)</Label>
                  <Input placeholder="support@apsara.id" />
                </div>
              </div>

              {/* Subject & Preheader */}
              <div className="grid gap-3 @md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input placeholder="Big update: New features for your site ✨" />
                </div>
                <div className="space-y-2">
                  <Label>Preheader (optional)</Label>
                  <Input placeholder="A quick peek at what's new" />
                </div>
              </div>

              {/* Template picker (UI only) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Template</Label>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Sparkles className="size-4" />
                    Use AI
                  </Button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <button
                      key={i}
                      className="hover:bg-muted/30 min-w-[160px] rounded-xl border p-2 transition"
                    >
                      <div className="bg-muted aspect-[4/3] rounded-lg" />
                      <div className="mt-2 text-left">
                        <p className="text-sm font-medium">Template {i + 1}</p>
                        <p className="text-muted-foreground text-xs">
                          Newsletter
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor (placeholder) */}
              <div className="space-y-2">
                <div className="bg-muted/40 flex items-center gap-1 rounded-lg border p-1">
                  <ToolbarButton label="Bold" />
                  <ToolbarButton label="Italic" />
                  <ToolbarButton label="Underline" />
                  <Separator orientation="vertical" className="mx-1 h-6" />
                  <ToolbarButton label="Link" />
                  <ToolbarButton label="Image" />
                  <ToolbarButton label="Button" />
                </div>
                <Textarea
                  className="min-h-[240px]"
                  placeholder="Write your email content here..."
                />
              </div>

              {/* Attachments (UI only) */}
              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="text-muted-foreground rounded-xl border border-dashed p-4 text-sm">
                  Drag & drop files here, or{' '}
                  <span className="text-primary">browse</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-wrap justify-between gap-2">
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Badge variant="secondary">Draft</Badge>
                <span>Auto-saved a minute ago</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 size-4" />
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  <TestTube2 className="mr-2 size-4" />
                  Send test
                </Button>
                <Button size="sm">
                  <Send className="mr-2 size-4" />
                  Send
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Campaign notes */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Internal notes</CardTitle>
              <CardDescription>Only visible to your team.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Jot down objectives, links, QA checklist, etc." />
            </CardContent>
          </Card>
        </div>

        {/* Settings / Audience column */}
        <div className="space-y-4 @lg:col-span-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Audience & Settings</p>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              {sidebarOpen ? (
                <PanelRightClose className="size-4" />
              ) : (
                <PanelRightOpen className="size-4" />
              )}
            </Button>
          </div>

          <div
            className={
              sidebarOpen
                ? 'space-y-4'
                : 'pointer-events-none space-y-4 opacity-60 select-none'
            }
          >
            {/* Audience */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Audience</CardTitle>
                <CardDescription>
                  Choose recipients and segments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Send to</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All subscribers</SelectItem>
                      <SelectItem value="segment">Specific segment</SelectItem>
                      <SelectItem value="import">Upload CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Segments (optional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Active last 30d',
                      'Indonesia',
                      'Prospects',
                      'Paid users',
                    ].map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="cursor-pointer"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Exclude (optional)</Label>
                  <Input placeholder="Segment or tag to exclude" />
                </div>
              </CardContent>
            </Card>

            {/* A/B Test */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">A/B testing</CardTitle>
                    <CardDescription>
                      Compare two variants to optimize opens/clicks.
                    </CardDescription>
                  </div>
                  <Switch checked={abEnabled} onCheckedChange={setAbEnabled} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2 @md:grid-cols-2">
                  <div className="space-y-1">
                    <Label>Subject A</Label>
                    <Input placeholder="Subject A" disabled={!abEnabled} />
                  </div>
                  <div className="space-y-1">
                    <Label>Subject B</Label>
                    <Input placeholder="Subject B" disabled={!abEnabled} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Split</Label>
                  <Slider defaultValue={[50]} disabled={!abEnabled} />
                  <p className="text-muted-foreground text-xs">
                    50%/50% of recipients (UI only)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Delivery */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Delivery</CardTitle>
                <CardDescription>
                  Send now or schedule for later.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Schedule</Label>
                    <p className="text-muted-foreground text-xs">
                      Asia/Jakarta (WIB)
                    </p>
                  </div>
                  <Switch checked={scheduled} onCheckedChange={setScheduled} />
                </div>
                <div className="grid gap-2 @md:grid-cols-2">
                  <div className="space-y-1">
                    <Label>Date & time</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="datetime-local"
                        disabled={!scheduled}
                        className="flex-1"
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={!scheduled}
                          >
                            <CalendarIcon className="size-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64" align="end">
                          <p className="text-muted-foreground text-sm">
                            Calendar picker placeholder
                          </p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Send throttling</Label>
                    <Select disabled={!scheduled}>
                      <SelectTrigger>
                        <SelectValue placeholder="No throttling" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No throttling</SelectItem>
                        <SelectItem value="500m">500 emails / min</SelectItem>
                        <SelectItem value="1k5m">
                          1,500 emails / 5 min
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking & UTM */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tracking & UTM</CardTitle>
                <CardDescription>
                  Analytics toggles for performance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="open" defaultChecked />
                  <Label htmlFor="open">Track opens</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="click" defaultChecked />
                  <Label htmlFor="click">Track link clicks</Label>
                </div>
                <Separator />
                <div className="grid gap-2 @md:grid-cols-3">
                  <div className="space-y-1">
                    <Label>utm_source</Label>
                    <Input placeholder="newsletter" />
                  </div>
                  <div className="space-y-1">
                    <Label>utm_medium</Label>
                    <Input placeholder="email" />
                  </div>
                  <div className="space-y-1">
                    <Label>utm_campaign</Label>
                    <Input placeholder="oct-2025-launch" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Compliance</CardTitle>
                <CardDescription>Footer address & unsubscribe.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label>Physical address</Label>
                  <Input placeholder="Jl. Example No. 123, Jakarta" />
                </div>
                <div className="text-muted-foreground flex items-start gap-2 text-xs">
                  <Checkbox id="legal" defaultChecked />
                  <Label htmlFor="legal">
                    Include unsubscribe link and legal footer
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="hover:bg-background rounded-md border px-2 py-1 text-xs"
      aria-label={label}
      title={label}
    >
      {label}
    </button>
  );
}

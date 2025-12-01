'use client';

import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { cn } from '@/lib/utils';
import { Check, Globe, Plus } from 'lucide-react';
import * as React from 'react';

type TemplateItem = {
  id: string;
  name: string;
  thumb?: string; // optional thumbnail url
  description?: string;
  badges?: string[];
};

type CreateWebsiteMiniProps = {
  /** Called after user confirms a template. Backward-compatible: templateId is optional. */
  onCreate?: (templateId?: string) => void;
  /** Provide your own templates; defaults included for demo. */
  templates?: TemplateItem[];
  className?: string;
};

const DEFAULT_TEMPLATES: TemplateItem[] = [
  { id: 'blank', name: 'Blank', description: 'Clean base to start from' },
  { id: 'portfolio-min', name: 'Portfolio Minimal' },
  { id: 'blog-starter', name: 'Blog Starter' },
  { id: 'saas-landing', name: 'SaaS Landing' },
  { id: 'shop-lite', name: 'Shop Lite' },
];

export function CreateWebsiteMini({
  onCreate,
  templates = DEFAULT_TEMPLATES,
  className,
}: CreateWebsiteMiniProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<string | null>(null);
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        (t.description?.toLowerCase().includes(q) ?? false),
    );
  }, [query, templates]);

  function confirm() {
    if (!selected) return;
    // close then call (so UI feels snappy)
    setOpen(false);
    onCreate?.(selected);
  }

  return (
    <>
      <Card className={cn('w-full max-w-xs rounded-lg', className)}>
        <CardHeader className="p-4 pb-1">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4" />
            Create Your Website
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="text-muted-foreground text-xs">
            Start a new website with a template or a clean base.
          </div>
          <div>
            <Dialog
              open={open}
              onOpenChange={(v) => {
                setOpen(v);
                if (!v) {
                  // reset selection/search when closing
                  setSelected(null);
                  setQuery('');
                }
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="shrink-0">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Select a template</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                  <Input
                    placeholder="Search templates (e.g. blog, portfolio, blank)…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {filtered.map((t) => {
                      const isActive = selected === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelected(t.id)}
                          className={cn(
                            'group relative rounded-lg border p-3 text-left transition',
                            isActive
                              ? 'border-primary ring-primary/30 ring-2'
                              : 'hover:border-foreground/20',
                          )}
                        >
                          {/* Thumbnail (optional) */}
                          {t.thumb ? (
                            <div className="mb-2 overflow-hidden rounded-md">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={t.thumb}
                                alt={t.name}
                                className="h-20 w-full object-cover transition-transform group-hover:scale-[1.02]"
                              />
                            </div>
                          ) : (
                            <div className="bg-muted mb-2 h-20 w-full rounded-md" />
                          )}

                          <div className="leading-tight font-medium">
                            {t.name}
                          </div>
                          <div className="text-muted-foreground line-clamp-2 text-xs">
                            {t.description ?? 'Preset layout'}
                          </div>

                          {t.badges?.length ? (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {t.badges.map((b) => (
                                <span
                                  key={b}
                                  className="bg-muted rounded-md px-1.5 py-0.5 text-[10px]"
                                >
                                  {b}
                                </span>
                              ))}
                            </div>
                          ) : null}

                          {isActive && (
                            <div className="bg-primary text-primary-foreground absolute top-2 right-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium">
                              <Check className="h-3 w-3" />
                              Selected
                            </div>
                          )}
                        </button>
                      );
                    })}
                    {filtered.length === 0 && (
                      <div className="text-muted-foreground col-span-full rounded-md border p-6 text-center text-sm">
                        No templates match “{query}”.
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={confirm} disabled={!selected}>
                    Continue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

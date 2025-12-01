'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Separator } from '@workspace/ui/components/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@workspace/ui/components/sheet';
import {
  Copy,
  EllipsisVertical,
  Eye,
  Grid3X3,
  Import,
  List,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

/**
 * Email Template Manager UI — UI-only (no data wiring)
 * - Browse, filter, preview, and start from templates
 * - Clean, responsive, dark/light aware via bg-background/text-foreground
 * - Works as a drop-in view for your Broadcast flow
 */
export default function EmailTemplateManagerUI() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const templates = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    name: `Newsletter ${i + 1}`,
    type: i % 3 === 0 ? 'Announcement' : i % 3 === 1 ? 'Product' : 'Digest',
    tags: i % 2 ? ['Minimal', '2-col'] : ['Bold', 'CTA'],
  }));

  const handlePreview = (idx: number) => {
    setSelectedIdx(idx);
    setOpenPreview(true);
  };

  return (
    <div className="bg-background text-foreground w-full">
      {/* Header */}
      <div className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
        <div className="mx-auto flex max-w-screen-2xl items-center gap-3 px-4 py-3 @md:px-6">
          <div className="mr-auto">
            <h1 className="text-base leading-tight font-semibold @md:text-lg">
              Email Templates
            </h1>
            <p className="text-muted-foreground text-xs">
              Pick a starting point for your campaign.
            </p>
          </div>
          <div className="hidden items-center gap-2 @md:flex">
            <Button variant="outline" size="sm">
              <Import className="mr-2 size-4" />
              Import
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="size-4" />
              New template
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mx-auto max-w-screen-2xl space-y-4 px-4 py-4 @md:px-6">
        <div className="flex flex-col gap-3 @md:flex-row @md:items-center">
          <div className="flex flex-1 items-center gap-2">
            <Input placeholder="Search templates…" className="flex-1" />
            <Button variant="outline" size="sm" className="gap-1">
              <Sparkles className="size-4" />
              AI suggest
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              aria-label="Grid view"
              onClick={() => setView('grid')}
            >
              <Grid3X3 className="size-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              aria-label="List view"
              onClick={() => setView('list')}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid gap-3 @md:grid-cols-4">
          <div className="space-y-1">
            <Label>Category</Label>
            <Select defaultValue="newsletter">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="promotion">Promotion</SelectItem>
                <SelectItem value="transactional">Transactional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Layout</Label>
            <Select defaultValue="single">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single column</SelectItem>
                <SelectItem value="two">Two columns</SelectItem>
                <SelectItem value="hero">Hero + body</SelectItem>
                <SelectItem value="gallery">Gallery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Style</Label>
            <Select defaultValue="minimal">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="elegant">Elegant</SelectItem>
                <SelectItem value="playful">Playful</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Brand color</Label>
            <div className="flex flex-wrap gap-2">
              {[
                '#111827',
                '#1D4ED8',
                '#059669',
                '#DC2626',
                '#F59E0B',
                '#7C3AED',
              ].map((c) => (
                <span
                  key={c}
                  className="inline-block size-6 rounded-md border"
                  style={{ background: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Content */}
        {view === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @lg:grid-cols-3">
            {templates.map((t, idx) => (
              <TemplateCard
                key={t.id}
                t={t}
                onPreview={() => handlePreview(idx)}
              />
            ))}
          </div>
        ) : (
          <div className="divide-y rounded-xl border">
            {templates.map((t, idx) => (
              <div key={t.id} className="flex items-center gap-4 p-3">
                <div className="bg-muted size-16 flex-none rounded-md" />
                <div className="mr-auto min-w-0">
                  <p className="truncate font-medium">{t.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {t.type} · Responsive · Dark/Light
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {t.tags.map((tg) => (
                      <Badge key={tg} variant="secondary">
                        {tg}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(idx)}
                  >
                    <Eye className="mr-2 size-4" />
                    Preview
                  </Button>
                  <RowActions />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer / Pagination (UI only) */}
        <div className="flex items-center justify-between py-2 text-sm">
          <p className="text-muted-foreground">Showing 12 of 128 templates</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Drawer */}
      <Sheet open={openPreview} onOpenChange={setOpenPreview}>
        <SheetContent
          side="right"
          className="w-full @md:w-[520px] @lg:w-[720px]"
        >
          <SheetHeader>
            <SheetTitle>Template preview</SheetTitle>
          </SheetHeader>
          <div className="mt-4 grid gap-4 @md:grid-cols-5">
            <div className="@md:col-span-3">
              <div className="bg-muted aspect-[3/5] w-full overflow-hidden rounded-xl border" />
            </div>
            <div className="space-y-4 @md:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Details</CardTitle>
                  <CardDescription>Metadata and quick actions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Name</span>
                    <span className="text-muted-foreground">
                      {selectedIdx !== null && templates[selectedIdx] ? templates[selectedIdx].name : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category</span>
                    <span className="text-muted-foreground">Newsletter</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Layout</span>
                    <span className="text-muted-foreground">Hero + body</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Responsive</span>
                    <span className="text-muted-foreground">Yes</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {selectedIdx !== null && templates[selectedIdx] &&
                      templates[selectedIdx].tags.map((tg) => (
                        <Badge key={tg} variant="secondary">
                          {tg}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button className="flex-1">Use this template</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <EllipsisVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Copy className="mr-2 size-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Variables</CardTitle>
                  <CardDescription>Preview with sample data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="name" defaultChecked />
                      <Label htmlFor="name">{'{{ customer_name }}'}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="cta" defaultChecked />
                      <Label htmlFor="cta">{'{{ cta_label }}'}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="brand" defaultChecked />
                      <Label htmlFor="brand">{'{{ brand_color }}'}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="footer" defaultChecked />
                      <Label htmlFor="footer">{'{{ legal_footer }}'}</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function TemplateCard({
  t,
  onPreview,
}: {
  t: { id: number; name: string; type: string; tags: string[] };
  onPreview: () => void;
}) {
  return (
    <Card className="group overflow-hidden rounded-2xl">
      <div className="relative">
        <div className="bg-muted aspect-[4/3] w-full" />
        <div className="absolute inset-0 hidden items-center justify-center bg-black/30 backdrop-blur-sm group-hover:flex">
          <Button variant="secondary" size="sm" onClick={onPreview}>
            <Eye className="mr-2 size-4" />
            Preview
          </Button>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-base leading-tight">{t.name}</CardTitle>
        <CardDescription className="truncate">
          {t.type} • Responsive • Dark/Light
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1">
          {t.tags.map((tg) => (
            <Badge key={tg} variant="secondary">
              {tg}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Button className="flex-1">Use</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Copy className="mr-2 size-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash2 className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

function RowActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <EllipsisVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Copy className="mr-2 size-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Trash2 className="mr-2 size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

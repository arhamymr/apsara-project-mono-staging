/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
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
import { useWebsite } from '@/hooks/use-website';
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Image as ImageIcon,
  Link as LinkIcon,
  PencilLine,
  Plus,
  Trash2,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import * as React from 'react';

type AdFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'always';
type WebsiteAd = {
  id: string;
  image: string;
  ctaHref?: string;
  enabled: boolean;
  frequency: AdFrequency;
};

export function AdsManager() {
  const { website, setWebsite } = useWebsite();

  const ads = website.ads ?? []; // array of WebsiteAd

  // ---------------- actions ----------------
  const setActive = (id: string) => {
    setWebsite({
      ...website,
      ads: ads.map((a) => ({ ...a, enabled: a.id === id })),
    });
  };

  const remove = (id: string) => {
    const next = ads.filter((a) => a.id !== id);
    // jika yang dihapus adalah active & masih ada sisa → aktifkan index 0
    const hadActive = ads.find((a) => a.id === id)?.enabled;
    if (hadActive && next.length > 0) next[0].enabled = true;
    setWebsite({ ...website, ads: next });
  };

  const upsert = (payload: Partial<WebsiteAd> & { id?: string }) => {
    // new
    if (!payload.id) {
      const newAd: WebsiteAd = {
        id: nanoid(8),
        image: payload.image || '',
        ctaHref: payload.ctaHref || '',
        enabled: ads.length === 0 ? true : false, // pertama auto aktif
        frequency: (payload.frequency as AdFrequency) || 'weekly',
      };
      setWebsite({ ...website, ads: [...ads, newAd] });
      return;
    }
    // update
    setWebsite({
      ...website,
      ads: ads.map((a) =>
        a.id === payload.id ? ({ ...a, ...payload } as WebsiteAd) : a,
      ),
    });
  };

  // ------------- add / edit dialog -------------
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<WebsiteAd | null>(null);

  const [form, setForm] = React.useState<Partial<WebsiteAd>>({
    image: '',
    ctaHref: '',
    frequency: 'weekly',
  });

  const startAdd = (e) => {
    e.preventDefault();
    setEditing(null);
    setForm({ image: '', ctaHref: '', frequency: 'weekly' });
    setOpen(true);
  };

  const startEdit = (ad: WebsiteAd) => {
    setEditing(ad);
    setForm(ad);
    setOpen(true);
  };

  const onSubmit = () => {
    if (!form.image) return; // minimal perlu gambar
    upsert({ ...form, id: editing?.id });
    setOpen(false);
  };

  // ------------- upload banner (to dataURL) -------------
  const handleFile = async (file?: File) => {
    if (!file) return;
    const okTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    if (!okTypes.includes(file.type)) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Ads Campaigns</h3>
        </div>
        <Button onClick={startAdd} size="sm">
          <Plus className="h-4 w-4" /> New Campaign
        </Button>
      </div>

      <Separator />

      {ads.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-muted-foreground flex flex-col items-center gap-3 py-10 text-sm">
            <ImageIcon className="h-6 w-6" />
            No campaigns yet. Click New Campaign to add one
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {ads.map((ad) => (
            <Card key={ad.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-sm">Campaign #{ad.id}</CardTitle>
                  <CardDescription className="text-xs">
                    {ad.frequency} {ad.enabled && '• Active'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {ad.enabled ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="bg-muted relative aspect-4/3 overflow-hidden rounded-md border">
                  {ad.image ? (
                    <img
                      src={ad.image}
                      alt={ad.id}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground grid h-full place-items-center">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-3.5 w-3.5" />
                    <span className="truncate">{ad.ctaHref || '—'}</span>
                  </div>
                  <span className="uppercase">{ad.frequency}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={ad.enabled ? 'secondary' : 'outline'}
                      onClick={() => setActive(ad.id)}
                    >
                      {ad.enabled ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Active
                        </>
                      ) : (
                        <>
                          <Circle className="mr-2 h-4 w-4" /> Set Active
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => startEdit(ad)}
                      aria-label="Edit"
                    >
                      <PencilLine className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => remove(ad.id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit Campaign' : 'New Campaign'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* preview */}
            <div className="bg-muted relative aspect-4/3 overflow-hidden rounded-md border">
              {form.image ? (
                <img
                  src={form.image}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground grid h-full place-items-center">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )}
            </div>

            {/* file input */}
            <div className="grid gap-2">
              <Label>Banner Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.currentTarget.files?.[0])}
              />
              <p className="text-muted-foreground text-xs">
                PNG/JPG/WEBP/SVG — tampil sebagai poster di modal.
              </p>
            </div>

            {/* CTA link */}
            <div className="grid gap-2">
              <Label>CTA Link (optional)</Label>
              <Input
                placeholder="/promo"
                value={form.ctaHref || ''}
                onChange={(e) =>
                  setForm((p) => ({ ...p, ctaHref: e.target.value }))
                }
              />
            </div>

            {/* Frequency */}
            <div className="grid gap-2">
              <Label>Frequency</Label>
              <Select
                value={(form.frequency as AdFrequency) || 'weekly'}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, frequency: v as AdFrequency }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always">Always</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="once">Once</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!form.image && (
              <div className="text-muted-foreground flex items-center gap-2 rounded-md border border-dashed p-2 text-xs">
                <AlertCircle className="h-4 w-4" />
                Upload banner dulu.
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={!form.image}>
              {editing ? 'Save Changes' : 'Create Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

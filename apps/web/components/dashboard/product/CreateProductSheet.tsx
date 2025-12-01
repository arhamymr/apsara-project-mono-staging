'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import { Image as ImageIcon, Plus } from 'lucide-react';

export function CreateProductSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" /> New product
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[560px] max-w-[92vw]">
        <SheetHeader>
          <SheetTitle>Create product</SheetTitle>
          <SheetDescription>
            View-only form. Hook this to your API later.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="e.g., Comfort Tee — Black" />
          </div>

          <div className="grid gap-2 @md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" placeholder="SKU-123" />
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apparel">Apparel</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="workspace">Workspace</SelectItem>
                  <SelectItem value="merch">Merch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2 @md:grid-cols-[1fr,120px,1fr] @md:items-end">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" placeholder="0" />
            </div>
            <div className="grid gap-2">
              <Label>Currency</Label>
              <Select defaultValue="USD">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="IDR">IDR</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" placeholder="0" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" placeholder="Short description…" rows={4} />
          </div>

          <div className="grid gap-2">
            <Label>Images</Label>
            <div className="grid grid-cols-3 gap-2">
              <button className="text-muted-foreground hover:bg-muted/40 aspect-square rounded-xl border text-sm">
                <div className="flex h-full w-full items-center justify-center gap-2">
                  <ImageIcon className="size-5" /> Add
                </div>
              </button>
              <button className="text-muted-foreground hover:bg-muted/40 aspect-square rounded-xl border text-sm">
                <div className="flex h-full w-full items-center justify-center gap-2">
                  <ImageIcon className="size-5" /> Add
                </div>
              </button>
              <button className="text-muted-foreground hover:bg-muted/40 aspect-square rounded-xl border text-sm">
                <div className="flex h-full w-full items-center justify-center gap-2">
                  <ImageIcon className="size-5" /> Add
                </div>
              </button>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <div className="flex w-full items-center justify-between">
            <Button variant="outline">Save draft</Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost">Preview</Button>
              <Button>Publish</Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

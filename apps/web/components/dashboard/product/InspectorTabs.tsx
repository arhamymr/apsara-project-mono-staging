'use client';

import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Textarea } from '@workspace/ui/components/textarea';

export function InspectorTabs() {
  return (
    <Tabs defaultValue="general">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="pricing">Pricing</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="mt-4">
        <div className="grid gap-3 @md:grid-cols-2">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input placeholder="Product name" />
          </div>
          <div className="grid gap-2">
            <Label>SKU</Label>
            <Input placeholder="SKU" />
          </div>
          <div className="grid gap-2 @md:col-span-2">
            <Label>Description</Label>
            <Textarea placeholder="Description…" rows={3} />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="pricing" className="mt-4">
        <div className="grid gap-3 @md:grid-cols-3">
          <div className="grid gap-2">
            <Label>Price</Label>
            <Input type="number" placeholder="0" />
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
            <Label>Stock</Label>
            <Input type="number" placeholder="0" />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="media" className="mt-4">
        <div className="grid grid-cols-3 gap-2 @md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-muted aspect-square rounded-lg border" />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

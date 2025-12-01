'use client';

import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Input } from '@workspace/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import {
  Archive,
  ChevronDown,
  Copy,
  Package2,
  Trash2,
  Undo2,
} from 'lucide-react';

export function ProductToolbar() {
  return (
    <Card className="border-dashed">
      <CardContent className="p-3 @md:p-4 @lg:p-5">
        <div className="grid gap-3 @md:grid-cols-[1fr,auto] @md:items-center">
          <div className="grid gap-2 @md:grid-cols-3">
            <div className="flex items-center gap-2 rounded-xl border px-3 py-2">
              <Package2 className="size-4 opacity-60" />
              <Input
                className="border-0 p-0 shadow-none focus-visible:ring-0"
                placeholder="Search products…"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="apparel">Apparel</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="workspace">Workspace</SelectItem>
                <SelectItem value="merch">Merch</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="out-of-stock">Out of stock</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Select defaultValue="recent">
              <SelectTrigger className="@md:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Sort: Recently updated</SelectItem>
                <SelectItem value="priceLow">
                  Sort: Price (low → high)
                </SelectItem>
                <SelectItem value="priceHigh">
                  Sort: Price (high → low)
                </SelectItem>
                <SelectItem value="name">Sort: Name (A→Z)</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Bulk actions <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>With selected</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Copy className="mr-2 size-4" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="mr-2 size-4" /> Archive
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Undo2 className="mr-2 size-4" /> Restore
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 size-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

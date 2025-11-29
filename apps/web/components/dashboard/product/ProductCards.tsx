'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Archive,
  Copy,
  Edit,
  Image as ImageIcon,
  MoreVertical,
  Tag,
  Trash2,
} from 'lucide-react';
import { MOCK_PRODUCTS } from './mock';
import { StatusBadge } from './StatusBadge';

export function ProductCards() {
  return (
    <div className="grid gap-3 @lg:hidden">
      {MOCK_PRODUCTS.map((p) => (
        <Card key={p.id} className="overflow-hidden">
          <div className="flex items-center justify-between px-3 pt-3">
            <div className="flex items-center gap-2">
              <Checkbox aria-label={`Select ${p.name}`} />
              <StatusBadge status={p.status} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 size-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 size-4" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="mr-2 size-4" /> Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 size-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardContent className="grid gap-3 p-3">
            <div className="flex items-center gap-3">
              <div className="bg-muted size-16 shrink-0 overflow-hidden rounded-md border">
                {p.thumbnail ? (
                  // eslint-disable-next-line
                  <img
                    src={p.thumbnail}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                    <ImageIcon className="size-5" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="truncate leading-tight font-medium">
                  {p.name}
                </div>
                <div className="text-muted-foreground truncate text-xs">
                  SKU: {p.sku}
                </div>

                <div className="mt-1 grid grid-cols-2 gap-2 text-sm @sm:grid-cols-4">
                  <div>
                    <div className="text-muted-foreground">Category</div>
                    <div>{p.category}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Price</div>
                    <div>
                      {p.currency} {p.price.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Stock</div>
                    <div>{p.stock}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Updated</div>
                    <div className="truncate">{p.updatedAt}</div>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {p.tags?.map((t) => (
                    <Badge key={t} variant="outline" className="gap-1">
                      <Tag className="size-3" /> {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

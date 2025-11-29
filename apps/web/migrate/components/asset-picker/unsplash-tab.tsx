/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import * as React from 'react';
import { UnsplashTile } from './tiles';
import type { UnsplashPhoto } from './types';

export function UnsplashTab({
  open,
  active,
  initialQuery = 'nature',
  onPick,
}: {
  open: boolean;
  active: boolean;
  initialQuery?: string;
  onPick: (photo: UnsplashPhoto) => void;
}) {
  const [qUnsplash, setQUnsplash] = React.useState(initialQuery);
  const [unsplashPage, setUnsplashPage] = React.useState(1);
  const [unsplashLoading, setUnsplashLoading] = React.useState(false);
  const [unsplashItems, setUnsplashItems] = React.useState<UnsplashPhoto[]>([]);
  const [unsplashTotal, setUnsplashTotal] = React.useState(0);
  const UNSPLASH_PER_PAGE = 12;

  const searchUnsplash = React.useCallback(async (q: string, page = 1) => {
    if (!q) {
      setUnsplashItems([]);
      setUnsplashTotal(0);
      return;
    }
    setUnsplashLoading(true);
    try {
      const res = await fetch(
        `/api/unsplash/search?q=${encodeURIComponent(q)}&page=${page}`,
      );
      if (!res.ok) throw new Error('Unsplash API error');

      const json = await res.json();
      setUnsplashItems(json.data ?? []);
      setUnsplashTotal(json.total ?? 0);
      setUnsplashPage(page);
    } finally {
      setUnsplashLoading(false);
    }
  }, []);

  // initial fetch when switching into Unsplash tab
  React.useEffect(() => {
    if (open && active && unsplashItems.length === 0) {
      void searchUnsplash(qUnsplash, 1);
    }
  }, [active, open, qUnsplash, searchUnsplash, unsplashItems.length]);

  const unsplashMaxPage =
    unsplashTotal > 0
      ? Math.max(1, Math.ceil(unsplashTotal / UNSPLASH_PER_PAGE))
      : 1;

  return (
    <TabsContent value="unsplash" className="mt-0">
      <div className="mb-2 flex min-w-0 flex-1 items-center gap-2 px-4">
        <div className="relative w-full max-w-[420px]">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search Unsplash photos…"
            value={qUnsplash}
            onChange={(e) => setQUnsplash(e.target.value)}
            className="pl-8"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void searchUnsplash(qUnsplash, 1);
              }
            }}
          />
        </div>
        <Button onClick={() => searchUnsplash(qUnsplash, 1)}>
          {unsplashLoading ? 'Loading…' : 'Search'}
        </Button>
      </div>

      <div className="px-4">
        <Card className="max-h-80 overflow-y-auto rounded-md p-2 shadow-none">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {unsplashItems.map((p) => (
              <UnsplashTile key={p.id} photo={p} onClick={onPick} />
            ))}
            {unsplashItems.length === 0 && !unsplashLoading && (
              <div className="text-muted-foreground col-span-full grid place-items-center rounded-lg border border-dashed py-12 text-sm">
                No results. Try another keyword.
              </div>
            )}
          </div>
        </Card>

        {/* Simple pager (Unsplash) */}
        {unsplashTotal > 0 && (
          <div className="mt-3 flex items-center justify-between px-1">
            <div className="text-muted-foreground text-xs">
              Page {unsplashPage} / {unsplashMaxPage} • {unsplashTotal} results
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={unsplashPage <= 1 || unsplashLoading}
                onClick={() =>
                  searchUnsplash(qUnsplash, Math.max(1, unsplashPage - 1))
                }
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={unsplashPage >= unsplashMaxPage || unsplashLoading}
                onClick={() =>
                  searchUnsplash(
                    qUnsplash,
                    Math.min(unsplashMaxPage, unsplashPage + 1),
                  )
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}

        <div className="mt-3 mb-3 flex justify-end">
          {/* Close button is provided at parent dialog footer */}
        </div>
      </div>
    </TabsContent>
  );
}

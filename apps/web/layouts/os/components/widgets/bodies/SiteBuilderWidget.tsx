'use client';

import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Separator } from '@workspace/ui/components/separator';
import { useActiveSite } from '@/contexts/site-context';
import { useWindowContext } from '@/layouts/os/WindowContext';
import { useRouter } from 'next/navigation';
import { Globe, Plus } from 'lucide-react';

function useOptionalActiveSite() {
  try {
    return useActiveSite();
  } catch {
    return null;
  }
}

export function SiteBuilderWidget() {
  const { openAppById } = useWindowContext();
  const router = useRouter();
  const siteContext = useOptionalActiveSite();
  const siteList = Array.isArray(siteContext?.sites) ? siteContext?.sites : [];
  const count = siteList.length;
  const hasSites = count > 0;

  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <h3 className="text-xs font-semibold">Site Builder</h3>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Launch builder and manage your websites.
          </p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => openAppById('website-builder')}
        >
          Open
        </Button>
      </div>

      <Separator className="my-3" />

      <div className="text-muted-foreground flex items-center justify-between text-xs font-medium tracking-wide uppercase">
        <span>Websites</span>
        <span>{count}</span>
      </div>

      <ScrollArea className="mt-3 max-h-56">
        {hasSites ? (
          <div className="space-y-2">
            {siteList.map((site) => {
              const displayName = site?.name ?? 'Untitled';
              const slug = site?.slug;
              const href =
                slug != null
                  ? `/dashboard/website/edit/${slug}`
                  : '/dashboard/website';
              const status = String(site?.status ?? 'draft').toUpperCase();
              return (
                <button
                  key={String(site?.id ?? displayName)}
                  type="button"
                  onClick={() => router.push(href)}
                  className={
                    'flex w-full items-center justify-between rounded-sm border px-3 py-2 text-left text-sm transition'
                  }
                >
                  <span className="truncate text-sm font-medium">
                    {displayName}
                  </span>
                  <span className="text-muted-foreground ml-3 shrink-0 text-[11px] uppercase">
                    {status}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="border-border bg-muted text-muted-foreground flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed py-4 text-center text-xs">
            <Plus className="h-5 w-5" />
            <span>No websites yet</span>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

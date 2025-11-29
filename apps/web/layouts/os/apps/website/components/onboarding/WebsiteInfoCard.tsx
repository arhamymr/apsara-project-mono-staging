import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDashboardStrings } from '@/i18n/dashboard';
import { cn } from '@/lib/utils';

type WebsiteInfoCardProps = {
  site: any;
  onOpen: (site: any) => void;
};

export function WebsiteInfoCard({ site, onOpen }: WebsiteInfoCardProps) {
  const strings = useDashboardStrings();
  const status = String(site?.status ?? 'draft').toUpperCase();
  const slug = site?.slug ? `${site.slug}.domain.com` : '—';
  const preview = site?.structure?.preview || site?.preview || '🌐';

  return (
    <Card
      className={cn(
        'cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-transform hover:scale-[1.01] hover:shadow-md',
      )}
      onClick={() => onOpen(site)}
    >
      <div className="bg-muted/40 relative aspect-video w-full overflow-hidden">
        {typeof preview === 'string' && preview.startsWith('http') ? (
          <img
            src={preview}
            alt={site?.name ?? 'preview'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-5xl">
            {preview}
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold">
              {site.name ?? strings.website.onboarding.untitled}
            </h4>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <span className="truncate">{slug}</span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1">
            <Badge
              variant="outline"
              className={cn(
                'h-6 px-2 text-[11px]',
                status === 'ACTIVATED' && 'border-0 bg-emerald-500 text-white',
                status === 'DRAFT' && 'border-0 bg-amber-500 text-white',
              )}
            >
              {status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="text-muted-foreground text-xs">
            {site.updated_at
              ? `Updated ${new Date(site.updated_at).toLocaleDateString()}`
              : ''}
          </div>
          <Button
            size="xs"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(site);
            }}
          >
            Open
          </Button>
        </div>
      </div>
    </Card>
  );
}

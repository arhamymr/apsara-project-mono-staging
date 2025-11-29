import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboardStrings } from '@/i18n/dashboard';
import { AlertTriangle, Globe } from 'lucide-react';

type HeaderProps = {
  count: number;
  maxWebsites: number;
  isLoading: boolean;
  onCreateNew: () => void;
  onRetry?: () => void;
};

export function OnboardingHeader({
  count,
  maxWebsites,
  isLoading,
  onCreateNew,
  onRetry,
}: HeaderProps) {
  const strings = useDashboardStrings();
  const isAtLimit = count >= maxWebsites;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="bg-muted/10 flex items-center gap-2 rounded-full p-2">
          <Globe className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-semibold">
            {strings.website.onboarding.yourWebsites}
          </p>
          <p className="text-muted-foreground text-xs">
            {strings.website.onboarding.manageDesc}
          </p>
        </div>
        <Badge
          variant={isAtLimit ? 'destructive' : 'secondary'}
          className="ml-2"
        >
          {count}/{maxWebsites}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        {isAtLimit && (
          <div className="border-destructive/20 bg-destructive/5 text-destructive flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs">
            <AlertTriangle className="h-4 w-4" />
            {strings.website.onboarding.limitReached}
          </div>
        )}
        <Button
          size="sm"
          onClick={onCreateNew}
          disabled={isAtLimit || isLoading}
        >
          {strings.website.onboarding.createWebsite}
        </Button>
      </div>
    </div>
  );
}

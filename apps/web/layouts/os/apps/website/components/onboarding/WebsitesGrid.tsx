import { Button } from '@workspace/ui/components/button';
import { useDashboardStrings } from '@/i18n/dashboard';
import { AlertTriangle, FileQuestionIcon, Globe, Loader2 } from 'lucide-react';
import { TemplatesSection, WebsiteInfoCard } from '.';
import type { TemplateDefinition } from '../../template-schema';

type WebsitesGridProps = {
  websites: any[];
  isLoading: boolean;
  errorMessage?: string;
  isAtLimit: boolean;
  onRetry?: () => void;
  onSelectTemplate: (template: TemplateDefinition) => void;
  onOpenWebsite: (site: any) => void;
  onCreateNew: () => void;
};

export function WebsitesGrid({
  websites,
  isLoading,
  errorMessage,
  isAtLimit,
  onRetry,
  onSelectTemplate,
  onOpenWebsite,
  onCreateNew,
}: WebsitesGridProps) {
  const strings = useDashboardStrings();

  const list = Array.isArray(websites) ? websites : [];
  const count = list.length;

  return (
    <div className="flex h-full flex-col gap-8 overflow-auto p-6">
      {/* Header */}
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
          <span className="bg-secondary ml-2 rounded-md px-2 py-1 text-xs font-medium">
            {count}/{5}
          </span>
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

      {/* Websites grid / states */}
      {isLoading ? (
        <div className="grid place-items-center gap-3 rounded-2xl border border-dashed py-16">
          <Loader2 className="text-muted-foreground h-10 w-10 animate-spin" />
          <p className="text-muted-foreground max-w-3xl text-center text-sm">
            {strings.website.onboarding.loading}
          </p>
        </div>
      ) : errorMessage ? (
        <div className="grid place-items-center gap-3 rounded-2xl border border-dashed py-16">
          <AlertTriangle className="text-destructive h-10 w-10" />
          <p className="text-muted-foreground max-w-3xl text-center text-sm">
            {errorMessage}
          </p>
          {onRetry && (
            <Button size="sm" variant="outline" onClick={() => onRetry()}>
              {strings.website.onboarding.retry}
            </Button>
          )}
        </div>
      ) : count > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((site: any) => (
            <WebsiteInfoCard
              key={site.id ?? site.slug}
              site={site}
              onOpen={onOpenWebsite}
            />
          ))}
        </div>
      ) : (
        <div className="grid place-items-center gap-3 rounded-2xl border border-dashed py-16">
          <FileQuestionIcon className="text-muted-foreground h-10 w-10" />
          <p className="text-muted-foreground max-w-3xl text-center text-sm">
            {strings.website.onboarding.noWebsite}
          </p>
        </div>
      )}

      <TemplatesSection
        isAtLimit={isAtLimit}
        onSelectTemplate={onSelectTemplate}
      />
    </div>
  );
}

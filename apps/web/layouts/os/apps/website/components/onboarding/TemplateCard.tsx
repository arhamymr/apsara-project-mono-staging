import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { useDashboardStrings } from '@/i18n/dashboard';
import { cn } from '@/lib/utils';
import type { TemplateDefinition } from '../../template-schema';

type TemplateCardProps = {
  template: TemplateDefinition;
  onSelect: () => void;
  disabled?: boolean;
};

export function TemplateCard({
  template,
  onSelect,
  disabled,
}: TemplateCardProps) {
  const strings = useDashboardStrings();

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'group bg-card relative w-full cursor-pointer rounded-xl border p-4 text-left transition-all hover:border-green-500 hover:shadow-md',
        disabled && 'opacity-60',
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="bg-muted/10 aspect-[16/9] w-full overflow-hidden rounded-md">
          <img
            src={template.preview}
            alt={template.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="truncate text-base font-semibold">
              {template.name}
            </h3>
          </div>
          <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
            {template.description}
          </p>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="px-3 py-1 text-xs">
              {Object.keys(template.pages).length}{' '}
              {strings.website.onboarding.pages}
            </Badge>
            <Button
              size="xs"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              disabled={disabled}
            >
              Use
            </Button>
          </div>
        </div>
      </div>
    </button>
  );
}

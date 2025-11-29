import { Separator } from '@/components/ui/separator';
import { useDashboardStrings } from '@/i18n/dashboard';
import { FileText } from 'lucide-react';
import { TemplateCard } from '.';
import type { TemplateDefinition } from '../../template-schema';
import { templates } from '../../templates';

type TemplatesSectionProps = {
  isAtLimit: boolean;
  onSelectTemplate: (template: TemplateDefinition) => void;
};

export function TemplatesSection({
  isAtLimit,
  onSelectTemplate,
}: TemplatesSectionProps) {
  const strings = useDashboardStrings();

  return (
    <>
      <Separator />

      {/* Templates */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <FileText className="h-7 w-7" />
          <div>
            <h3 className="text-xl font-semibold">
              {strings.website.onboarding.startWithTemplate}
            </h3>
            <p className="text-muted-foreground text-base">
              {strings.website.onboarding.startWithTemplateDesc}
            </p>
          </div>
        </div>

        <div
          className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          id="template"
        >
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              disabled={isAtLimit}
              onSelect={() => onSelectTemplate(template)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

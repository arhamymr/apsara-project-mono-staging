/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { useWebsite } from '@/hooks/use-website';
import { useWebsiteHistory } from '@/hooks/use-website/history-store';
import { useBuilderSelection } from '@/hooks/use-website/selection-store';
import { appendWebsiteNode } from '@/layouts/os/apps/website/runtime/node-ops';
import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { SECTION_LIBRARY, SectionTemplate } from './section-data';

const numberFormatter = new Intl.NumberFormat(undefined);

type CategoryCountProps = { count?: number };

const CategoryCount = React.memo(function CategoryCount({
  count = 0,
}: CategoryCountProps) {
  const safeCount = Number.isFinite(count) && count >= 0 ? count : 0;

  const formatted = React.useMemo(
    () => numberFormatter.format(safeCount),
    [safeCount],
  );

  return (
    <Badge
      variant="secondary"
      className="ml-2 text-[10px]"
      aria-label={`${formatted} items`}
      title={`${formatted} items`}
      role="status"
      aria-live="polite"
      data-testid="category-count"
    >
      <span aria-hidden="true">{formatted}</span>
    </Badge>
  );
});
CategoryCount.displayName = 'CategoryCount';

function cloneTemplateNode(node: TemplateNode): TemplateNode {
  if (typeof structuredClone === 'function') return structuredClone(node);
  return JSON.parse(JSON.stringify(node));
}

export function UiComponentGallery() {
  const { website, activePage, setWebsite } = useWebsite();
  const recordHistory = useWebsiteHistory((state) => state.record);
  const setSelected = useBuilderSelection((state) => state.setSelected);

  const handleAddSection = React.useCallback(
    (section: SectionTemplate) => {
      if (!website || !activePage) return;

      recordHistory(website);

      let nextSelectionPath: number[] | null = null;
      let nextNodeId: string | null = null;

      setWebsite((prev: any) => {
        if (!prev) return prev;
        const clone = cloneTemplateNode(section.template);
        if (!clone.id) {
          clone.id = `${section.id}-${Math.random().toString(36).slice(2, 8)}`;
        }
        const result = appendWebsiteNode(
          prev,
          { slot: { kind: 'page', pageId: activePage.id }, path: [] },
          clone,
        );
        if (result.node && result.path) {
          nextSelectionPath = result.path;
          nextNodeId = result.node.id ?? clone.id ?? null;
        }
        return result.website;
      });

      if (nextSelectionPath && nextNodeId) {
        setSelected({
          slot: { kind: 'page', pageId: activePage.id },
          nodeId: nextNodeId,
          path: nextSelectionPath,
        });
      }
    },
    [activePage, recordHistory, setSelected, setWebsite, website],
  );

  // Category mapping for accordion classification
  const CATEGORY_MAP: Record<string, string> = {
    'hero-callout': 'Hero and CTA',
    'value-prop-split': 'Hero and CTA',
    'cta-band': 'Hero and CTA',

    'feature-grid': 'Content and Features',
    'feature-checklist': 'Content and Features',
    'gallery-showcase': 'Content and Features',
    'video-spotlight': 'Content and Features',
    'blog-highlights': 'Content and Features',
    'resource-library': 'Content and Features',

    'testimonial-band': 'Social Proof',
    'testimonial-stack': 'Social Proof',
    'partners-strip': 'Social Proof',

    'process-steps': 'Process and Timeline',
    'timeline-milestones': 'Process and Timeline',
    'roadmap-preview': 'Process and Timeline',

    'integration-grid': 'Integrations',
    'faq-block': 'FAQ',
    'pricing-simple': 'Pricing',
    'contact-panel': 'Contact and Support',
    'support-cta': 'Contact and Support',
    'team-grid': 'Team',
    'stats-band': 'Stats',
    'newsletter-optin': 'Newsletter',

    // Articles
    'posts-feed-latest': 'Articles',
    'article-detail': 'Articles',
    'article-list': 'Articles',
  };

  const CATEGORY_ORDER: string[] = [
    'Hero and CTA',
    'Content and Features',
    'Articles',
    'Social Proof',
    'Process and Timeline',
    'Integrations',
    'FAQ',
    'Pricing',
    'Contact and Support',
    'Team',
    'Stats',
    'Newsletter',
  ];

  const categories = React.useMemo(
    () =>
      CATEGORY_ORDER.map((label) => {
        const sections = SECTION_LIBRARY.filter(
          (s) => CATEGORY_MAP[s.id] === label,
        );
        return {
          id: label.toLowerCase().replace(/\s+/g, '-'),
          label,
          sections,
        };
      }).filter((c) => c.sections.length > 0),
    [],
  );

  const defaultCategoryId = categories[0]?.id;

  return (
    <Accordion
      type="single"
      defaultValue={defaultCategoryId}
      collapsible
      className="text-xs"
    >
      {categories.map((cat) => (
        <AccordionItem key={cat.id} value={cat.id}>
          <AccordionTrigger
            className="px-3 py-2 text-xs font-semibold"
            data-testid="category-trigger"
          >
            <div className="flex items-center gap-1">
              <span className="font-semibold">{cat.label}</span>
              <CategoryCount count={cat.sections?.length ?? 0} />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-2 text-xs">
            <div className="space-y-1.5">
              {cat.sections.map((section, index) => (
                <div key={section.id} className="pb-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card className="border-none">
                        <CardHeader className="flex justify-end p-0 pb-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddSection(section)}
                            className="h-7 gap-1 rounded-sm px-2 text-[11px] font-semibold"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add section
                          </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div
                            className={cn(
                              'bg-muted/10 border-border rounded-md border border-dashed p-2 text-xs font-semibold',
                            )}
                          >
                            {section.preview()}
                          </div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-2 text-left">
                      <p className="text-muted-foreground text-xs font-semibold">
                        {section.title}
                      </p>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {section.description}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  {index !== cat.sections.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

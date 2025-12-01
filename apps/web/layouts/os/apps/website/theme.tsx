/* eslint-disable @typescript-eslint/no-explicit-any */
// ThemePanel.tsx
import { useSidebar } from '@workspace/ui/components/sidebar';
import { useWebsite } from '@/hooks/use-website';
import { useDashboardStrings } from '@/i18n/dashboard';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { RenderPage } from './components/page-renderer';
import { RenderSection } from './components/section-renderer';
import { SectionFont } from './components/theme/components/font-manager';
import { ThemePalette } from './components/theme/components/palette';
import { TypographyPicker } from './components/theme/components/typography';
import { usePageTheme } from './components/theme/page-theme';
import type { TemplateNode } from './template-schema';

export function ThemePanel() {
  const { activePage, website } = useWebsite();
  const { theme, setTheme, setTypography, typography } = usePageTheme();
  const { open } = useSidebar();
  const s = useDashboardStrings();

  useEffect(() => {
    setTypography(website?.typographyId as any);
  }, []);

  const headerNodes = (website?.globals?.header ?? []) as TemplateNode[];
  const footerNodes = (website?.globals?.footer ?? []) as TemplateNode[];
  const pageNodes = (activePage?.sections ?? []) as TemplateNode[];
  const renderCtx = { website, page: activePage };

  return (
    <div
      className={cn(
        open ? `max-h-[calc(100vh-134px)]` : `max-h-[calc(100vh-120px)]`,
        'border-t-none flex gap-4 overflow-y-auto rounded-none rounded-br-lg rounded-bl-lg border p-4',
      )}
    >
      {/* left column */}
      <div className="flex flex-1 flex-col gap-4">
        <p className="text-sm font-medium">{s.website.theme.typography}</p>
        <TypographyPicker
          value={typography}
          onSelect={(typo) => {
            setTypography(typo);
          }}
        />
        <p className="text-sm font-medium">{s.website.theme.color}</p>
        <ThemePalette
          value={theme}
          onSelect={setTheme}
          themes={[
            // Light
            'light',
            'sakura',
            'ocean',
            'amber',
            'apsara',
            'forest',
            'grape',
            'sky',
            'rose',
            'emerald',
            'violet',
            'cocoa',
            'cyber',

            // Dark
            'dark',
            'sakura-dark',
            'ocean-dark',
            'amber-dark',
            'apsara-dark',
            'forest-dark',
            'grape-dark',
            'sky-dark',
            'rose-dark',
            'emerald-dark',
            'violet-dark',
            'cocoa-dark',
            'cyber-dark',
          ]}
        />
      </div>

      {/* right column (preview) */}
      <div className="flex-1">
        <div className="rounded-xl rounded-tl-none rounded-tr-none border">
          <SectionFont typo={typography}>
            <div data-theme={theme} className="overflow-hidden rounded-b-xl">
              <div className="flex flex-col gap-0">
                <RenderSection
                  id="theme-header"
                  type="header"
                  nodes={headerNodes}
                  ctx={renderCtx}
                />
                <RenderPage
                  sections={pageNodes}
                  ctx={renderCtx}
                  className="flex flex-col"
                />
                <RenderSection
                  id="theme-footer"
                  type="footer"
                  nodes={footerNodes}
                  ctx={renderCtx}
                />
              </div>
            </div>
          </SectionFont>
        </div>
      </div>
    </div>
  );
}

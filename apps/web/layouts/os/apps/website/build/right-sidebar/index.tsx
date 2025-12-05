'use client';

import { useState } from 'react';

import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ListTree,
  SquarePlus,
} from 'lucide-react';
import { ElementPalette } from './element-palette';
import { SectionOrderer } from './section-orderer';
import { UiComponentGallery } from './ui-component-gallery';

type BuilderSidebarPanel = 'library' | 'elements' | 'reorder';

type PanelConfig = {
  id: BuilderSidebarPanel;
  label: string;
  description: string;
  icon: LucideIcon;
};

const PANELS: Record<BuilderSidebarPanel, PanelConfig> = {
  library: {
    id: 'library',
    label: 'Section Library',
    description: 'Browse ready-made sections to add to this page.',
    icon: LayoutGrid,
  },
  elements: {
    id: 'elements',
    label: 'Elements',
    description: 'Insert individual elements into the selected container.',
    icon: SquarePlus,
  },
  reorder: {
    id: 'reorder',
    label: 'Reorder Sections',
    description: 'Drag and drop to change the order of sections on the page.',
    icon: ListTree,
  },
};

export function BuilderSidebar() {
  const [activePanel, setActivePanel] = useState<BuilderSidebarPanel | null>(
    null,
  );
  const [isCollapsed, setIsCollapsed] = useState(true);

  const panel = activePanel ? PANELS[activePanel] : null;

  const handlePanelToggle = (panelId: BuilderSidebarPanel) => {
    setActivePanel((current) => {
      const shouldCollapse = current === panelId && !isCollapsed;
      setIsCollapsed(shouldCollapse);
      return shouldCollapse ? null : panelId;
    });
  };

  const handleCollapseToggle = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (next) {
        setActivePanel(null);
      } else if (!activePanel) {
        setActivePanel('library');
      }
      return next;
    });
  };

  return (
    <aside
      className={cn(
        'z-40 m-2 flex transition-all duration-200',
        isCollapsed ? 'w-[48px]' : 'w-[460px]',
      )}
    >
      <Card className="flex h-full flex-1 overflow-hidden rounded-sm border">
        <div className="flex h-full w-full">
          <nav className="bg-muted flex flex-col items-center gap-2 border-r p-1">
            {Object.values(PANELS).map((option) => {
              const Icon = option.icon;
              const isActive = !isCollapsed && option.id === activePanel;
              return (
                <Button
                  key={option.id}
                  size="sm"
                  variant="ghost"
                  aria-pressed={isActive}
                  aria-current={isActive ? 'page' : undefined}
                  title={option.label}
                  onClick={() => handlePanelToggle(option.id)}
                  className={cn(
                    'text-muted-foreground hover:text-foreground',
                    isActive &&
                      'text-primary ring-primary hover:bg-primary/10 ring-1',
                  )}
                  data-state={isActive ? 'active' : 'inactive'}
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{option.label}</span>
                </Button>
              );
            })}
            <div className="flex-1" />
            <Button
              size="icon"
              variant="ghost"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={handleCollapseToggle}
              className="text-muted-foreground hover:text-foreground"
            >
              {isCollapsed ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </nav>
          {!isCollapsed && panel && (
            <div className="flex flex-1 flex-col">
              <header className="border-border border-b px-3 py-2">
                <h3 className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                  {panel.label}
                </h3>
                <p className="text-muted-foreground mt-1 text-[11px] leading-snug">
                  {panel.description}
                </p>
              </header>

              <div className="flex-1 overflow-hidden p-1.5">
                {activePanel === 'library' ? (
                  <ScrollArea className="h-full max-h-[calc(100vh-220px)] w-full rounded-sm border">
                    <UiComponentGallery />
                  </ScrollArea>
                ) : null}

                {activePanel === 'elements' ? (
                  <div className="max-h-[620px] overflow-y-auto px-3 py-3 text-xs">
                    <ElementPalette />
                  </div>
                ) : null}

                {activePanel === 'reorder' ? (
                  <div className="max-h-[620px] overflow-y-auto px-3 py-3 text-xs">
                    <SectionOrderer
                      onRequestLibrary={() => setActivePanel('library')}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </Card>
    </aside>
  );
}

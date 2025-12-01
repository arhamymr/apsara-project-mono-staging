/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@workspace/ui/components/card';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { useSidebar } from '@workspace/ui/components/sidebar';
import { IPageData, useWebsite } from '@/hooks/use-website';
import { useWebsiteHistory } from '@/hooks/use-website/history-store';
import { useBuilderSelection } from '@/hooks/use-website/selection-store';
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { RenderPage } from '../components/page-renderer';
import { RenderSection } from '../components/section-renderer';
import { SectionFont } from '../components/theme/components/font-manager';
import { usePageTheme } from '../components/theme/page-theme';
import type { EditorSlot } from '../runtime/editor-types';
import { patchWebsiteNode } from '../runtime/node-ops';
import type { TemplateNode } from '../template-schema';

interface PreviewModeSectionProps {
  page: IPageData;
}

const HEADER_SLOT: EditorSlot = { kind: 'global', slot: 'header' };
const FOOTER_SLOT: EditorSlot = { kind: 'global', slot: 'footer' };

const slotsEqual = (left?: EditorSlot, right?: EditorSlot) => {
  if (!left || !right) return false;
  if (left.kind !== right.kind) return false;
  if (left.kind === 'global' && right.kind === 'global') {
    return left.slot === right.slot;
  }
  if (left.kind === 'page' && right.kind === 'page') {
    return left.pageId === right.pageId;
  }
  return false;
};

const pathsEqual = (left?: number[], right?: number[]) => {
  if (!left || !right) return false;
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
};

export function Preview({ page }: PreviewModeSectionProps) {
  const { website, viewportSize, getViewportStyles, setWebsite } = useWebsite();
  const { theme, setTypography, typography, setTheme } = usePageTheme();
  const { open } = useSidebar();
  const recordHistory = useWebsiteHistory((state) => state.record);
  const setSelected = useBuilderSelection((state) => state.setSelected);
  const setHovered = useBuilderSelection((state) => state.setHovered);
  const hoveredTarget = useBuilderSelection((state) => state.hovered);

  useEffect(() => {
    setTypography(website?.typographyId as any);
    setTheme(website?.themeId as any);
    setHovered(null);
  }, []);

  const handleHover = useCallback(
    (
      slot: EditorSlot,
      payload: { node: TemplateNode; path: number[] } | null,
    ) => {
      if (!payload) {
        if (hoveredTarget !== null) {
          setHovered(null);
        }
        return;
      }
      const nodeId =
        payload.node.id ??
        payload.node.htmlId ??
        `path:${payload.path.join('.')}`;
      if (
        hoveredTarget &&
        hoveredTarget.nodeId === nodeId &&
        slotsEqual(hoveredTarget.slot, slot) &&
        pathsEqual(hoveredTarget.path, payload.path)
      ) {
        return;
      }
      setHovered({
        slot,
        nodeId,
        path: payload.path,
      });
    },
    [hoveredTarget, setHovered],
  );

  const handleSelect = useCallback(
    (slot: EditorSlot, payload: { node: TemplateNode; path: number[] }) => {
      const nodeId =
        payload.node.id ??
        payload.node.htmlId ??
        `path:${payload.path.join('.')}`;
      setHovered(null);
      setSelected({
        slot,
        nodeId,
        path: payload.path,
      });
    },
    [setHovered, setSelected],
  );

  const handleTextChange = useCallback(
    (slot: EditorSlot, path: number[], value: string) => {
      setWebsite((prev: any) => {
        if (!prev) return prev;
        recordHistory(prev);
        return patchWebsiteNode(prev, { slot, path }, { text: value });
      });
    },
    [recordHistory, setWebsite],
  );

  const pageSlot = useMemo<EditorSlot>(
    () => ({
      kind: 'page',
      pageId: page.id,
    }),
    [page.id],
  );

  const buildEditorConfig = useCallback(
    (slot: EditorSlot) => ({
      mode: 'edit' as const,
      slot,
      onSelect: (payload: { node: TemplateNode; path: number[] }) =>
        handleSelect(slot, payload),
      onHover: (payload: { node: TemplateNode; path: number[] } | null) =>
        handleHover(slot, payload),
      onTextChange: (path: number[], value: string) =>
        handleTextChange(slot, path, value),
    }),
    [handleHover, handleSelect, handleTextChange],
  );

  const headerEditor = useMemo(
    () => buildEditorConfig(HEADER_SLOT),
    [buildEditorConfig],
  );
  const pageEditor = useMemo(
    () => buildEditorConfig(pageSlot),
    [buildEditorConfig, pageSlot],
  );
  const footerEditor = useMemo(
    () => buildEditorConfig(FOOTER_SLOT),
    [buildEditorConfig],
  );

  const headerNodes = (website?.globals?.header ?? []) as TemplateNode[];
  const pageNodes = (page?.sections ?? []) as TemplateNode[];
  const footerNodes = (website?.globals?.footer ?? []) as TemplateNode[];
  const hasContent =
    headerNodes.length > 0 || pageNodes.length > 0 || footerNodes.length > 0;
  const renderCtx = useMemo(() => ({ website, page }), [website, page]);

  const highlightStyles = `
    .builder-preview [data-editor-node] {
      position: relative;
      outline: 1px solid transparent;
      outline-offset: 0;
      transition: outline-color 120ms ease, outline-offset 120ms ease, outline-width 120ms ease, transform 150ms ease, padding 150ms ease, margin 150ms ease, background-color 150ms ease;
      box-sizing: border-box;
    }

    .builder-preview [data-editor-node][data-editor-hovered="true"] {
      outline-color: rgba(34, 197, 94, 0.55);
      outline-width: 2px;
      outline-offset: -2px;
    }

    .builder-preview [data-editor-node][data-editor-selected="true"] {
      outline-color: rgba(16, 185, 129, 0.8);
      outline-width: 2px;
      outline-offset: -2px;
    }

    .builder-preview [data-editor-node-type="image"] {
      display: inline-block;
    }

    .builder-preview [data-editor-node-type="image"][data-editor-hovered="true"] {
      border-radius: 0.5rem;
      background-color: rgba(34, 197, 94, 0.08);
    }

    .builder-preview [data-editor-node-type="image"][data-editor-selected="true"] {
      border-radius: 0.65rem;
      background-color: rgba(16, 185, 129, 0.12);
    }
  `;

  return (
    <>
      <Card
        className={cn(
          open ? `max-h-[calc(100vh-134px)]` : `max-h-[calc(100vh-120px)]`,
          'border-t-none w-full rounded-none rounded-br-lg rounded-bl-lg',
        )}
      >
        <ScrollArea
          className={cn(
            open ? `max-h-[calc(100vh-134px)]` : `max-h-[calc(100vh-120px)]`,
            'h-full w-full',
          )}
        >
          <div className="flex justify-center">
            <div
              className="bg-background @container overflow-hidden rounded-md p-1 transition-all duration-300 ease-in-out"
              style={getViewportStyles(viewportSize)}
              data-theme={theme}
            >
              <SectionFont typo={typography}>
                <style>{highlightStyles}</style>
                <div className="relative">
                  {!hasContent && (
                    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
                      <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                        <Eye className="text-muted-foreground mb-4 h-12 w-12 opacity-50" />
                        <CardTitle className="mb-2 text-lg">
                          No components to preview
                        </CardTitle>
                        <CardDescription>
                          Switch to Build Mode and add some components first
                        </CardDescription>
                      </CardContent>
                    </div>
                  )}
                  <div className="builder-preview flex flex-col gap-0">
                    <RenderSection
                      id="builder-header"
                      type="header"
                      nodes={headerNodes}
                      ctx={renderCtx}
                      editor={headerEditor}
                    />
                    <RenderPage
                      sections={pageNodes}
                      ctx={renderCtx}
                      editor={pageEditor}
                      className="flex flex-col"
                    />
                    <RenderSection
                      id="builder-footer"
                      type="footer"
                      nodes={footerNodes}
                      ctx={renderCtx}
                      editor={footerEditor}
                    />
                  </div>
                </div>
              </SectionFont>
            </div>
          </div>
        </ScrollArea>
      </Card>
    </>
  );
}

import * as React from 'react';

import { Button } from '@workspace/ui/components/button';
import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';

import { useBuilderSelection } from '@/hooks/use-website/selection-store';
import type { EditorSlot } from '../../runtime/editor-types';
import type { SimpleEditorConfig } from '../editor-types';
import { RenderNode } from '../node-renderer';
import {
  BRAND_FALLBACK_CLASS,
  DEFAULT_NAVBAR_SETTINGS,
  type NavbarAlignment,
  type NavbarAppearance,
  type NavbarSettings,
} from './navbar-types';

type NavbarRendererProps = {
  id?: string;
  className?: string;
  nodes: TemplateNode[];
  ctx: Record<string, any>;
  editor?: SimpleEditorConfig;
};

type ChildEntry = {
  node: TemplateNode;
  path: number[];
};

const pathsEqual = (left: number[], right: number[]) =>
  left.length === right.length &&
  left.every((value, index) => value === right[index]);

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

const NAVBAR_APPEARANCE_CLASSNAMES: Record<NavbarAppearance, string> = {
  default:
    'border-b border-border/60 bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/75',
  muted:
    'border-b border-border/50 bg-muted/70 text-foreground backdrop-blur supports-[backdrop-filter]:bg-muted/80',
  transparent: 'border-b border-border/40 bg-transparent text-foreground',
  inverted: 'border-b border-border/30 bg-foreground text-background',
};

const MENU_BASE_CLASS =
  'flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground';

const EMPTY_STATE = (
  <span className="text-muted-foreground text-sm">No navigation items</span>
);

function classifyChildren(
  children: TemplateNode[] | undefined,
  pathPrefix: number[],
) {
  const brand: ChildEntry[] = [];
  const menu: ChildEntry[] = [];
  const actions: ChildEntry[] = [];

  (children ?? []).forEach((child, index) => {
    const entry = { node: child, path: [...pathPrefix, index] };
    const slot = (child as any)?.slot;
    if (slot === 'brand') {
      brand.push(entry);
    } else if (slot === 'action' || (!slot && child.type === 'button')) {
      actions.push(entry);
    } else {
      menu.push(entry);
    }
  });

  return { brand, menu, actions };
}

function resolveSettings(node?: TemplateNode): NavbarSettings {
  if (!node) return DEFAULT_NAVBAR_SETTINGS;
  const raw =
    node.navbar && typeof node.navbar === 'object'
      ? (node.navbar as NavbarSettings)
      : {};
  return { ...DEFAULT_NAVBAR_SETTINGS, ...raw };
}

const alignmentClasses: Record<NavbarAlignment, string> = {
  left: 'justify-start text-left',
  center: 'justify-center text-center',
  right: 'justify-end text-right',
  'space-between': 'justify-between text-left',
};

export function NavbarRenderer({
  id,
  className,
  nodes,
  ctx,
  editor,
}: NavbarRendererProps) {
  const safeNodes = nodes ?? [];
  const editable = editor?.mode === 'edit';
  const slot = editor?.slot;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const headerRef = React.useRef<HTMLElement | null>(null);

  const navbarIndex = React.useMemo(
    () => safeNodes.findIndex((node) => node.type === 'navbar'),
    [safeNodes],
  );

  const navbarNode =
    navbarIndex >= 0 ? (safeNodes[navbarIndex] as TemplateNode) : undefined;

  const settings = React.useMemo(
    () => resolveSettings(navbarNode),
    [navbarNode],
  );

  const navbarPath = React.useMemo(() => {
    if (navbarIndex < 0) return [] as number[];
    return [navbarIndex];
  }, [navbarIndex]);

  const navbarNodeId = React.useMemo(() => {
    if (!navbarNode) return null;
    return (
      navbarNode.id ??
      navbarNode.htmlId ??
      (navbarPath.length ? `navbar:${navbarPath.join('.')}` : 'navbar')
    );
  }, [navbarNode, navbarPath]);

  const hovered = useBuilderSelection((state) => state.hovered);
  const selected = useBuilderSelection((state) => state.selected);

  const matchesSelection = React.useCallback(
    (target: typeof hovered) => {
      if (!target || !slot || !navbarNodeId || !navbarPath.length) return false;
      if (!slotsEqual(target.slot, slot)) return false;
      if (target.nodeId && target.nodeId === navbarNodeId) return true;
      if (Array.isArray(target.path))
        return pathsEqual(target.path, navbarPath);
      return false;
    },
    [slot, navbarNodeId, navbarPath],
  );

  const isHovered = matchesSelection(hovered);
  const isSelected = matchesSelection(selected);

  const appearanceClass =
    NAVBAR_APPEARANCE_CLASSNAMES[settings.appearance ?? 'default'];

  const layoutClass = cn(
    'relative w-full',
    appearanceClass,
    navbarNode?.class,
    className,
  );

  const childGroups = React.useMemo(() => {
    if (!navbarNode || navbarIndex < 0) {
      return { brand: [], menu: [], actions: [] };
    }
    return classifyChildren(navbarNode.children, [navbarIndex]);
  }, [navbarIndex, navbarNode]);

  const fallbackEntries = React.useMemo(() => {
    if (navbarNode) return [];
    return safeNodes.map((node, index) => ({ node, path: [index] }));
  }, [navbarNode, safeNodes]);

  const menuEntries = childGroups.menu.length
    ? childGroups.menu
    : fallbackEntries;
  const actionEntries = childGroups.actions;
  const brandEntry = childGroups.brand[0];

  const handleToggleMobile = React.useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = React.useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleHoverStart = React.useCallback(() => {
    if (!editable || !navbarNode) return;
    editor?.onHover?.({ node: navbarNode, path: navbarPath });
  }, [editable, editor, navbarNode, navbarPath]);

  const handleHoverEnd = React.useCallback(() => {
    if (!editable) return;
    editor?.onHover?.(null);
  }, [editable, editor]);

  const handleSelectNavbar = React.useCallback(() => {
    if (!editable || !navbarNode) return;
    editor?.onSelect?.({ node: navbarNode, path: navbarPath });
  }, [editable, editor, navbarNode, navbarPath]);

  const handleContainerClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!editable || !navbarNode) return;
      const root = headerRef.current;
      if (!root) return;
      const target = event.target as HTMLElement | null;
      const closestNode = target?.closest('[data-editor-node]');
      if (closestNode && closestNode !== root) {
        return;
      }
      event.stopPropagation();
      handleSelectNavbar();
    },
    [editable, navbarNode, handleSelectNavbar],
  );

  const renderEntry = React.useCallback(
    (entry: ChildEntry, variant: 'desktop' | 'mobile') => (
      <RenderNode
        key={`${variant}-${entry.node.id ?? entry.path.join('-')}`}
        node={entry.node}
        ctx={ctx}
        path={entry.path}
        editor={editor}
      />
    ),
    [ctx, editor],
  );

  const brandContent = brandEntry ? (
    renderEntry(brandEntry, 'desktop')
  ) : (
    <span className={BRAND_FALLBACK_CLASS}>Navigation</span>
  );

  const menuContent = menuEntries.map((entry) => renderEntry(entry, 'desktop'));
  const actionContent = actionEntries.map((entry) =>
    renderEntry(entry, 'desktop'),
  );

  const alignmentClass = alignmentClasses[settings.menuAlignment ?? 'center'];

  const desktopLayout = (() => {
    switch (settings.type) {
      case 'center-brand':
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex min-w-0 flex-col items-center gap-2">
              {brandContent}
            </div>
            {menuContent.length ? (
              <div className={cn(MENU_BASE_CLASS, 'w-full', alignmentClass)}>
                {menuContent}
              </div>
            ) : null}
            {actionContent.length ? (
              <div className="flex flex-wrap items-center justify-center gap-3">
                {actionContent}
              </div>
            ) : null}
          </div>
        );
      case 'justified':
        return (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                {brandContent}
              </div>
              {actionContent.length ? (
                <div className="hidden items-center gap-2 @lg:flex">
                  {actionContent}
                </div>
              ) : null}
            </div>
            {menuContent.length ? (
              <div
                className={cn(
                  MENU_BASE_CLASS,
                  'border-border/60 text-foreground w-full rounded-lg border px-4 py-2',
                  alignmentClass,
                )}
              >
                {menuContent}
              </div>
            ) : editable ? (
              <div className="border-border/50 rounded-lg border px-4 py-3">
                {EMPTY_STATE}
              </div>
            ) : null}
            {actionContent.length ? (
              <div className="flex items-center gap-2 @lg:hidden">
                {actionContent}
              </div>
            ) : null}
          </div>
        );
      case 'stacked':
        return (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex min-w-0 items-center gap-3">
                {brandContent}
              </div>
              {actionContent.length ? (
                <div className="flex flex-wrap items-center gap-2">
                  {actionContent}
                </div>
              ) : null}
            </div>
            {menuContent.length ? (
              <div className={cn(MENU_BASE_CLASS, alignmentClass)}>
                {menuContent}
              </div>
            ) : null}
          </div>
        );
      default:
        return (
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              {brandContent}
            </div>
            {menuContent.length ? (
              <div className={cn(MENU_BASE_CLASS, 'flex-1', alignmentClass)}>
                {menuContent}
              </div>
            ) : null}
            {actionContent.length ? (
              <div className="flex items-center gap-2">{actionContent}</div>
            ) : null}
          </div>
        );
    }
  })();

  const menuEntriesForMobile = menuEntries;

  const mobileMenuId = React.useMemo(
    () => `${id ?? 'navbar'}-mobile-menu`,
    [id],
  );

  const mobileMenuSurfaceClass = React.useMemo(() => {
    switch (settings.appearance) {
      case 'inverted':
        return 'bg-foreground text-background';
      case 'muted':
        return 'bg-muted/80 text-foreground backdrop-blur';
      case 'transparent':
        return 'bg-background/95 text-foreground backdrop-blur';
      default:
        return 'bg-background/95 text-foreground backdrop-blur';
    }
  }, [settings.appearance]);

  const headerInteractiveAttributes =
    editable && navbarNode && navbarNodeId
      ? {
          'data-editor-node': navbarNodeId,
          'data-editor-node-type': navbarNode.type,
          'data-editor-hovered': isHovered ? 'true' : undefined,
          'data-editor-selected': isSelected ? 'true' : undefined,
          onMouseEnter: handleHoverStart,
          onMouseLeave: handleHoverEnd,
        }
      : {};

  return (
    <header
      id={id ?? 'navbar'}
      ref={headerRef}
      className={layoutClass}
      onClick={handleContainerClick}
      {...(headerInteractiveAttributes as React.HTMLAttributes<HTMLElement>)}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-3 @md:px-6 @lg:px-8">
        <div className="flex items-center justify-between gap-3 @md:hidden">
          <div className="text-foreground flex min-w-0 items-center gap-3">
            {brandEntry ? renderEntry(brandEntry, 'mobile') : brandContent}
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls={mobileMenuId}
            onClick={handleToggleMobile}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="hidden w-full @md:block">{desktopLayout}</div>
      </div>
      <MobileDropdownMenu
        mobileOpen={mobileOpen}
        mobileMenuId={mobileMenuId}
        surfaceClass={mobileMenuSurfaceClass}
        brandEntry={brandEntry}
        actionEntries={actionEntries}
        menuEntries={menuEntriesForMobile}
        renderEntry={renderEntry}
        closeMobile={closeMobile}
      />
    </header>
  );
}

type MobileDropdownMenuProps = {
  mobileOpen: boolean;
  mobileMenuId: string;
  surfaceClass: string;
  brandEntry?: ChildEntry;
  actionEntries: ChildEntry[];
  menuEntries: ChildEntry[];
  renderEntry: (
    entry: ChildEntry,
    variant: 'desktop' | 'mobile',
  ) => React.ReactNode;
  closeMobile: () => void;
};

function MobileDropdownMenu({
  mobileOpen,
  mobileMenuId,
  surfaceClass,
  brandEntry,
  actionEntries,
  menuEntries,
  renderEntry,
  closeMobile,
}: MobileDropdownMenuProps) {
  return (
    <div
      id={mobileMenuId}
      className={cn(
        'border-border/60 origin-top overflow-hidden border-t transition-[max-height,opacity,transform] duration-300 ease-out md:hidden',
        mobileOpen
          ? 'pointer-events-auto max-h-[520px] translate-y-0 opacity-100'
          : 'pointer-events-none max-h-0 -translate-y-2 opacity-0',
      )}
      aria-hidden={!mobileOpen}
    >
      <div
        className={cn(
          'flex flex-col gap-4 px-6 py-6 text-sm font-medium shadow-xl',
          surfaceClass,
        )}
      >
        {brandEntry ? (
          <div className="border-border/50 rounded-md border p-3">
            {renderEntry(brandEntry, 'mobile')}
          </div>
        ) : null}
        {actionEntries.length ? (
          <div className="flex flex-col gap-3">
            {actionEntries.map((entry) => (
              <div
                key={`action-${entry.node.id ?? entry.path.join('-')}`}
                onClick={closeMobile}
              >
                {renderEntry(entry, 'mobile')}
              </div>
            ))}
          </div>
        ) : null}
        {menuEntries.length ? (
          <div className="flex flex-col gap-3">
            {menuEntries.map((entry) => (
              <div
                key={`menu-${entry.node.id ?? entry.path.join('-')}`}
                onClick={closeMobile}
              >
                {renderEntry(entry, 'mobile')}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No navigation items configured.
          </p>
        )}
      </div>
    </div>
  );
}

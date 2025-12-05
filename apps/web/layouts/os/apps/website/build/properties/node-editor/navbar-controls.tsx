import * as React from 'react';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';
import type { NavbarSettings } from '@/layouts/os/apps/website/components/renderers/navbar-types';
import {
  BRAND_FALLBACK_CLASS,
  DEFAULT_NAVBAR_SETTINGS,
  NAVBAR_ALIGNMENT_OPTIONS,
  NAVBAR_APPEARANCE_OPTIONS,
  NAVBAR_TYPE_OPTIONS,
} from '@/layouts/os/apps/website/components/renderers/navbar-types';
import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';

type NavbarControlsProps = {
  node: TemplateNode;
  onPatch: (
    patch: Partial<TemplateNode>,
    options?: { silent?: boolean },
  ) => void;
};

type ChildEntry = {
  child: TemplateNode;
  index: number;
};

const DEFAULT_MENU_CLASS =
  'text-sm font-medium text-muted-foreground transition hover:text-foreground';
const DEFAULT_ACTION_CLASS =
  'rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90';

const resolveNavbarSettings = (value: unknown): NavbarSettings => {
  if (value && typeof value === 'object') {
    return {
      ...DEFAULT_NAVBAR_SETTINGS,
      ...(value as NavbarSettings),
    };
  }
  return DEFAULT_NAVBAR_SETTINGS;
};

function ensureLink(child: TemplateNode): TemplateNode {
  return {
    ...child,
    type: 'link',
    action: {
      kind: 'link',
      href: child.action?.href ?? '#',
      target: child.action?.target ?? '_self',
    },
  };
}

function ensureButton(child: TemplateNode): TemplateNode {
  return {
    ...child,
    type: 'button',
    action: {
      kind: 'link',
      href: child.action?.href ?? '#',
      target: child.action?.target ?? '_self',
    },
  };
}

export function NavbarControls({ node, onPatch }: NavbarControlsProps) {
  const children = Array.isArray(node.children) ? node.children : [];
  const rawNavbarSettings = React.useMemo<Partial<NavbarSettings>>(
    () =>
      node.navbar && typeof node.navbar === 'object'
        ? { ...(node.navbar as NavbarSettings) }
        : {},
    [node.navbar],
  );
  const settings = React.useMemo(
    () => resolveNavbarSettings(rawNavbarSettings),
    [rawNavbarSettings],
  );

  const brand = children.find(
    (child) =>
      typeof (child as any)?.slot === 'string' && child.slot === 'brand',
  );
  const menuEntries = children
    .map((child, index) => ({ child, index }))
    .filter((entry) => entry.child.slot === 'menu' || !entry.child.slot);
  const actionEntries = children
    .map((child, index) => ({ child, index }))
    .filter((entry) => entry.child.slot === 'action');

  const updateChildren = React.useCallback(
    (updater: (draft: TemplateNode[]) => TemplateNode[]) => {
      const draft = [...children];
      const next = updater(draft);
      onPatch({ children: next });
    },
    [children, onPatch],
  );

  const updateNavbarSettings = React.useCallback(
    (patch: Partial<NavbarSettings>) => {
      const merged: Partial<NavbarSettings> = {
        ...rawNavbarSettings,
        ...patch,
      };
      const cleaned = Object.entries(merged).reduce<Partial<NavbarSettings>>(
        (acc, [key, value]) => {
          if (value === undefined || value === null) {
            return acc;
          }
          (acc as Record<string, unknown>)[key] = value;
          return acc;
        },
        {},
      );
      onPatch({ navbar: Object.keys(cleaned).length ? cleaned : undefined });
    },
    [onPatch, rawNavbarSettings],
  );

  const handleUpdateMenu = (
    entry: ChildEntry,
    patch: Partial<{ text: string; href: string }>,
  ) => {
    updateChildren((draft) => {
      const current = ensureLink(draft[entry.index] ?? {});
      const next: TemplateNode = {
        ...current,
        slot: 'menu',
        text: patch.text ?? current.text ?? 'Menu item',
        class: current.class ?? DEFAULT_MENU_CLASS,
        action: {
          ...(current.action ?? { kind: 'link', target: '_self' }),
          href: patch.href ?? current.action?.href ?? '#',
        },
      };
      draft[entry.index] = next;
      return draft;
    });
  };

  const handleUpdateAction = (
    entry: ChildEntry,
    patch: Partial<{ text: string; href: string }>,
  ) => {
    updateChildren((draft) => {
      const current = ensureButton(draft[entry.index] ?? {});
      const next: TemplateNode = {
        ...current,
        slot: 'action',
        text: patch.text ?? current.text ?? 'Action',
        class: current.class ?? DEFAULT_ACTION_CLASS,
        action: {
          ...(current.action ?? { kind: 'link', target: '_self' }),
          href: patch.href ?? current.action?.href ?? '#',
        },
      };
      draft[entry.index] = next;
      return draft;
    });
  };

  const addMenu = () => {
    updateChildren((draft) => [
      ...draft,
      {
        id: `nav-link-${Math.random().toString(36).slice(2, 8)}`,
        slot: 'menu',
        type: 'link',
        text: 'New link',
        class: DEFAULT_MENU_CLASS,
        action: { kind: 'link', href: '#', target: '_self' },
      },
    ]);
  };

  const addAction = () => {
    updateChildren((draft) => [
      ...draft,
      {
        id: `nav-action-${Math.random().toString(36).slice(2, 8)}`,
        slot: 'action',
        type: 'button',
        text: 'Call to action',
        class: DEFAULT_ACTION_CLASS,
        action: { kind: 'link', href: '#', target: '_self' },
      },
    ]);
  };

  const removeChild = (entry: ChildEntry) => {
    updateChildren((draft) => draft.filter((_, idx) => idx !== entry.index));
  };

  const setBrand = () => {
    updateChildren((draft) => {
      const next = [...draft];
      next.push({
        id: `nav-brand-${Math.random().toString(36).slice(2, 8)}`,
        slot: 'brand',
        type: 'text',
        text: 'Brand',
        class: BRAND_FALLBACK_CLASS,
      });
      return next;
    });
  };

  const selectedAppearance = NAVBAR_APPEARANCE_OPTIONS.find(
    (option) => option.id === settings.appearance,
  );

  return (
    <div className="border-border/60 space-y-5 rounded-md border border-dashed p-4">
      <div className="space-y-3">
        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          Layout
        </p>
        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-medium">
            Navbar type
          </label>
          <Select
            value={(settings.type ?? DEFAULT_NAVBAR_SETTINGS.type) as string}
            onValueChange={(value) =>
              updateNavbarSettings({
                type: value as NavbarSettings['type'],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              {NAVBAR_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  <div>
                    <p className="text-sm font-medium">{option.label}</p>
                    <p className="text-muted-foreground text-xs">
                      {option.description}
                    </p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-medium">
            Menu alignment
          </label>
          <Select
            value={
              (settings.menuAlignment ??
                DEFAULT_NAVBAR_SETTINGS.menuAlignment) as string
            }
            onValueChange={(value) =>
              updateNavbarSettings({
                menuAlignment: value as NavbarSettings['menuAlignment'],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select alignment" />
            </SelectTrigger>
            <SelectContent>
              {NAVBAR_ALIGNMENT_OPTIONS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-medium">
            Appearance
          </label>
          <Select
            value={
              (settings.appearance ??
                DEFAULT_NAVBAR_SETTINGS.appearance) as string
            }
            onValueChange={(value) =>
              updateNavbarSettings({
                appearance: value as NavbarSettings['appearance'],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select appearance" />
            </SelectTrigger>
            <SelectContent>
              {NAVBAR_APPEARANCE_OPTIONS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  <div>
                    <p className="text-sm font-medium">{option.label}</p>
                    <p className="text-muted-foreground text-xs">
                      {option.description}
                    </p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedAppearance ? (
            <p className="text-muted-foreground text-xs">
              {selectedAppearance.description}
            </p>
          ) : null}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          Brand
        </p>
        {brand ? (
          <Textarea
            value={brand.text ?? ''}
            onChange={(event) =>
              updateChildren((draft) => {
                const next = [...draft];
                const idx = draft.indexOf(brand);
                next[idx] = {
                  ...brand,
                  slot: 'brand',
                  text: event.target.value,
                  class: brand.class ?? BRAND_FALLBACK_CLASS,
                };
                return next;
              })
            }
            rows={2}
            className="text-sm leading-6 font-semibold"
          />
        ) : (
          <Button size="sm" variant="outline" onClick={setBrand}>
            Add brand text
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Menu items
          </p>
          <Button size="sm" variant="outline" onClick={addMenu}>
            Add link
          </Button>
        </div>
        {menuEntries.length === 0 ? (
          <p className="text-muted-foreground text-xs">
            No links yet. Use &ldquo;Add link&rdquo; to create one.
          </p>
        ) : (
          <div className="space-y-3">
            {menuEntries.map((entry, idx) => (
              <div
                key={entry.child.id ?? idx}
                className="border-border/60 space-y-2 rounded-md border p-3"
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Link {idx + 1}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => removeChild(entry)}
                    aria-label="Remove link"
                  >
                    ×
                  </Button>
                </div>
                <Input
                  value={entry.child.text ?? ''}
                  onChange={(event) =>
                    handleUpdateMenu(entry, { text: event.target.value })
                  }
                  placeholder="Label"
                  className="text-sm"
                />
                <Input
                  value={entry.child.action?.href ?? '#'}
                  onChange={(event) =>
                    handleUpdateMenu(entry, { href: event.target.value })
                  }
                  placeholder="https://"
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Actions
          </p>
          <Button size="sm" variant="outline" onClick={addAction}>
            Add action
          </Button>
        </div>
        {actionEntries.length === 0 ? (
          <p className="text-muted-foreground text-xs">
            Add primary actions like buttons for CTAs.
          </p>
        ) : (
          <div className="space-y-3">
            {actionEntries.map((entry, idx) => (
              <div
                key={entry.child.id ?? idx}
                className="border-border/60 space-y-2 rounded-md border p-3"
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Action {idx + 1}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => removeChild(entry)}
                    aria-label="Remove action"
                  >
                    ×
                  </Button>
                </div>
                <Input
                  value={entry.child.text ?? ''}
                  onChange={(event) =>
                    handleUpdateAction(entry, { text: event.target.value })
                  }
                  placeholder="Label"
                  className="text-sm"
                />
                <Input
                  value={entry.child.action?.href ?? '#'}
                  onChange={(event) =>
                    handleUpdateAction(entry, { href: event.target.value })
                  }
                  placeholder="https://"
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

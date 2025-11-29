import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { DesktopGroup } from '@/layouts/os/types';

export type AnchorRect = {
  left: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
} | null;

type ExpandedGroupPanelProps = {
  group: DesktopGroup;
  anchor: AnchorRect;
  onClose: () => void;
  onRename: (id: string, name: string) => void;
  onOpenApp: (appId: string) => void;
  onRemoveChild?: (childId: string) => void;
};

export default function ExpandedGroupPanel({
  group,
  anchor,
  onClose,
  onRename,
  onOpenApp,
  onRemoveChild,
}: ExpandedGroupPanelProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(group.label);
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);

  // enter animation
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const requestClose = useCallback(() => {
    setClosing(true);
    setEntered(false);
    // Allow the transition to run before unmounting
    const t = setTimeout(() => onClose(), 200);
    return () => clearTimeout(t);
  }, [onClose]);

  // outside click to close (with animation)
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        requestClose();
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [requestClose]);

  const layout = useMemo(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const finalWidth = Math.min(560, vw - 32);
    const rows = Math.max(1, Math.ceil(group.children.length / 4));
    const contentHeight = Math.min(0.6 * vh, 16 + rows * 96);
    const finalHeight = 48 + 1 + contentHeight;
    const left = anchor ? anchor.left : 16;
    const top = anchor ? anchor.top : 16;
    const sx = anchor ? Math.max(0.2, anchor.width / finalWidth) : 0.85;
    const sy = anchor
      ? Math.max(0.2, (anchor.height || 64) / finalHeight)
      : 0.85;
    return { finalWidth, contentHeight, left, top, sx, sy };
  }, [anchor, group.children.length]);

  return (
    <div
      className="pointer-events-auto fixed z-40"
      style={{ left: layout.left, top: layout.top, width: layout.finalWidth }}
    >
      <div
        className="rounded-xl border backdrop-blur-xl transition-transform duration-200 ease-out will-change-transform"
        style={{
          transformOrigin: 'top left',
          transform:
            entered && !closing
              ? 'scale(1, 1)'
              : `scale(${layout.sx}, ${layout.sy})`,
        }}
        ref={panelRef}
      >
        <div className="flex items-center justify-between gap-2 p-3">
          {isRenaming ? (
            <form
              className="flex w-full items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const next = renameValue.trim();
                if (next && next !== group.label) onRename(group.id, next);
                setIsRenaming(false);
              }}
            >
              <Input
                autoFocus
                aria-label="Group name"
                value={renameValue}
                onChange={(e) => setRenameValue(e.currentTarget.value)}
                onBlur={(e) => {
                  const next = e.currentTarget.value.trim();
                  if (next && next !== group.label) onRename(group.id, next);
                  setIsRenaming(false);
                }}
                className="h-8 text-sm"
              />
              <button
                type="submit"
                className="text-muted-foreground text-xs hover:underline"
              >
                Save
              </button>
            </form>
          ) : (
            <div className="flex w-full items-center justify-between gap-2">
              <span className="truncate text-sm font-medium">
                {group.label}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="text-muted-foreground text-xs hover:underline"
                  onClick={() => {
                    setRenameValue(group.label);
                    setIsRenaming(true);
                  }}
                >
                  Rename
                </button>
                <button
                  type="button"
                  className="text-muted-foreground text-xs hover:underline"
                  onClick={requestClose}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
        <Separator />
        <ScrollArea style={{ maxHeight: layout.contentHeight }} className="p-2">
          <div className="grid grid-cols-6 gap-3 p-1">
            {group.children.map((c) => (
              <div key={c.id} className="group relative">
                <button
                  type="button"
                  className="group hover:bg-muted/20 flex w-full cursor-pointer flex-col items-center rounded-xl border border-transparent p-1 text-center text-xs transition-all"
                  onClick={() => onOpenApp(c.appId)}
                  title={c.label}
                >
                  <div className="mb-2 flex size-12 items-center justify-center rounded-lg text-3xl transition-transform group-hover:scale-110">
                    {c.icon}
                  </div>
                  <span className="text-muted-foreground w-full truncate text-[11px]">
                    {c.label}
                  </span>
                </button>
                {onRemoveChild && (
                  <button
                    type="button"
                    aria-label="Remove from group"
                    className="absolute -top-1 -right-1 hidden h-4 w-4 rounded-full bg-red-600 text-[10px] leading-4 text-white shadow group-hover:block"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveChild(c.id);
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

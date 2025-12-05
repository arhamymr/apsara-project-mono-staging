import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { SiteBuilderWidget } from '@/layouts/os/components/widgets/bodies/SiteBuilderWidget';
import { cn } from '@/lib/utils';
import { GripVertical, Settings, Trash } from 'lucide-react';
import * as React from 'react';
import { useCallback } from 'react';
import { useWidgets, type WidgetModel } from '../../widgets/WidgetsContext';
import ClockWidget from './bodies/ClockWidget';
import NoteWidget from './bodies/NoteWidget';

type WidgetFrameProps = {
  id: string;
  x: number;
  y: number;
  onMove: (x: number, y: number) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
};

function WidgetFrame({
  id,
  x,
  y,
  onMove,
  onContextMenu,
  children,
}: WidgetFrameProps) {
  const dragging = React.useRef(false);
  const start = React.useRef<{
    x: number;
    y: number;
    mx: number;
    my: number;
  } | null>(null);
  const lastPos = React.useRef<{ x: number; y: number }>({ x, y });
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const handle = target.closest('[data-role="drag-handle"]');
    if (!handle && !e.altKey) return;
    dragging.current = true;
    start.current = { x, y, mx: e.clientX, my: e.clientY };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current || !start.current) return;
    const dx = e.clientX - start.current.mx;
    const dy = e.clientY - start.current.my;
    const nx = start.current.x + dx;
    const ny = start.current.y + dy;
    lastPos.current = { x: nx, y: ny };
    onMove(nx, ny);
  };

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    start.current = null;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);

    const GRID = 8;
    const NAVBAR = 56;
    const MARGIN = 8;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    const el = rootRef.current;
    const w = el?.offsetWidth ?? 260;
    const h = el?.offsetHeight ?? 180;
    const rawX = lastPos.current.x;
    const rawY = lastPos.current.y;
    const clampX = Math.max(MARGIN, Math.min(rawX, vw - w - MARGIN));
    const clampY = Math.max(NAVBAR + MARGIN, Math.min(rawY, vh - h - MARGIN));
    const snap = (v: number) => Math.round(v / GRID) * GRID;
    const sx = snap(clampX);
    const sy = snap(clampY);
    if (sx !== rawX || sy !== rawY) {
      lastPos.current = { x: sx, y: sy };
      onMove(sx, sy);
    }
  }, [onMove]);

  React.useEffect(() => () => onMouseUp(), [onMouseUp]);

  return (
    <Card
      role="group"
      data-id={id}
      ref={rootRef}
      onMouseDown={onMouseDown}
      onContextMenu={onContextMenu}
      className={
        'pointer-events-auto absolute w-[260px] rounded-md border shadow-sm backdrop-blur-md transition-shadow select-none hover:shadow-md'
      }
      style={{ left: x, top: y, zIndex: 300 }}
    >
      <div
        data-role="drag-handle"
        className="text-muted-foreground flex cursor-grab items-center justify-between border-b px-2 py-1.5 text-[11px]"
        title="Drag to move (Alt-drag anywhere)"
      >
        <span className="inline-flex items-center gap-1">
          <GripVertical className="h-3.5 w-3.5" />
          Drag
        </span>
      </div>
      {children}
    </Card>
  );
}

function WidgetSettingsDialog({
  open,
  onOpenChange,
  widget,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  widget: WidgetModel | null;
  onSave: (patch: Partial<WidgetModel>) => void;
}) {
  const [localText, setLocalText] = React.useState<string>('');
  const [showSeconds, setShowSeconds] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!widget) return;
    if (widget.type === 'note') {
      setLocalText(String(widget.settings?.text ?? ''));
    }
    if (widget.type === 'clock') {
      setShowSeconds(Boolean(widget.settings?.showSeconds));
    }
  }, [widget]);

  const apply = () => {
    if (!widget) return;
    if (widget.type === 'note')
      onSave({ settings: { ...(widget.settings || {}), text: localText } });
    if (widget.type === 'clock')
      onSave({ settings: { ...(widget.settings || {}), showSeconds } });
    onOpenChange(false);
  };

  return (
    <Dialog open={open && !!widget} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Widget Settings</DialogTitle>
        </DialogHeader>
        {widget?.type === 'note' && (
          <div className="space-y-2">
            <label className="text-xs font-medium">Text</label>
            <Input
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
            />
          </div>
        )}
        {widget?.type === 'clock' && (
          <div className="flex items-center gap-2 text-sm">
            <input
              id="clock-seconds"
              type="checkbox"
              checked={showSeconds}
              onChange={(e) => setShowSeconds(e.target.checked)}
            />
            <label htmlFor="clock-seconds">Show seconds</label>
          </div>
        )}
        {widget?.type === 'site-builder' && (
          <p className="text-muted-foreground text-xs">
            No settings for this widget.
          </p>
        )}
        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={apply}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function WidgetsBoard() {
  const { widgets, setWidgetPosition, updateWidget, removeWidget } =
    useWidgets();
  const [menuTarget, setMenuTarget] = React.useState<string | null>(null);
  const [settingsTarget, setSettingsTarget] =
    React.useState<WidgetModel | null>(null);

  const onContext = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuTarget((prev) => (prev === id ? null : id));
  };

  const closeMenus = () => setMenuTarget(null);

  React.useEffect(() => {
    const onGlobalClick = () => closeMenus();
    window.addEventListener('click', onGlobalClick);
    return () => window.removeEventListener('click', onGlobalClick);
  }, []);

  const renderBody = (w: WidgetModel) => {
    if (w.type === 'clock')
      return <ClockWidget showSeconds={Boolean(w.settings?.showSeconds)} />;
    if (w.type === 'note')
      return <NoteWidget text={String(w.settings?.text ?? '')} />;
    if (w.type === 'site-builder') return <SiteBuilderWidget />;
    return null;
  };

  return (
    <>
      {widgets.map((w) => (
        <WidgetFrame
          key={w.id}
          id={w.id}
          x={w.x}
          y={w.y}
          onMove={(x, y) => setWidgetPosition(w.id, x, y)}
          onContextMenu={onContext(w.id)}
        >
          <div className="relative">
            {renderBody(w)}
            {/* Inline menu on right click */}
            {menuTarget === w.id && (
              <div
                className={cn(
                  'bg-background/95 absolute top-2 right-2 z-[5] min-w-28 rounded border p-1 text-sm shadow-md',
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="hover:bg-muted flex w-full items-center gap-2 rounded px-2 py-1"
                  onClick={() => {
                    setSettingsTarget(w);
                    setMenuTarget(null);
                  }}
                >
                  <Settings className="h-3.5 w-3.5" /> Settings
                </button>
                <button
                  className="hover:bg-muted flex w-full items-center gap-2 rounded px-2 py-1 text-red-600"
                  onClick={() => removeWidget(w.id)}
                >
                  <Trash className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            )}
          </div>
        </WidgetFrame>
      ))}

      <WidgetSettingsDialog
        open={!!settingsTarget}
        onOpenChange={(v) => !v && setSettingsTarget(null)}
        widget={settingsTarget}
        onSave={(patch) =>
          settingsTarget && updateWidget(settingsTarget.id, patch)
        }
      />
    </>
  );
}

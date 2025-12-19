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
import { cn } from '@/lib/utils';
import { GripVertical, Settings, Trash } from 'lucide-react';
import * as React from 'react';
import { useWidgets, type WidgetModel } from '../../widgets/WidgetsContext';
import { useWidgetDrag, type SnapGuide } from './hooks/useWidgetDrag';
import ClockWidget from './bodies/ClockWidget';
import NoteWidget from './bodies/NoteWidget';

interface WidgetRect {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

type WidgetFrameProps = {
  id: string;
  x: number;
  y: number;
  otherWidgets: WidgetRect[];
  onMove: (x: number, y: number) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onSnapGuidesChange?: (guides: SnapGuide[]) => void;
  children: React.ReactNode;
};

const WidgetFrame = React.memo(function WidgetFrame({
  id,
  x,
  y,
  otherWidgets,
  onMove,
  onContextMenu,
  onSnapGuidesChange,
  children,
}: WidgetFrameProps) {
  const [isAltPressed, setIsAltPressed] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const {
    isDragging,
    dragOffset,
    snapGuides,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  } = useWidgetDrag({ widgetId: id, x, y, otherWidgets, onMove });

  // Notify parent of snap guides for rendering
  React.useEffect(() => {
    onSnapGuidesChange?.(isDragging ? snapGuides : []);
  }, [isDragging, snapGuides, onSnapGuidesChange]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && !isAltPressed) setIsAltPressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.altKey && isAltPressed) setIsAltPressed(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isAltPressed]);

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if (rootRef.current) handleDragStart(e, rootRef.current);
    },
    [handleDragStart],
  );

  const hasOffset = dragOffset.x !== 0 || dragOffset.y !== 0;
  const transformStyle = hasOffset
    ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`
    : 'translate3d(0, 0, 0)';

  return (
    <Card
      role="group"
      data-id={id}
      ref={rootRef}
      onPointerDown={onPointerDown}
      onPointerMove={isDragging ? handleDragMove : undefined}
      onPointerUp={isDragging ? handleDragEnd : undefined}
      onPointerCancel={isDragging ? handleDragEnd : undefined}
      onContextMenu={onContextMenu}
      className={`pointer-events-auto absolute w-[260px] rounded-md border shadow-sm backdrop-blur-md select-none hover:shadow-md ${
        isAltPressed ? 'ring-2 ring-primary/50 cursor-grab' : ''
      } ${isDragging ? 'shadow-lg ring-2 ring-primary' : ''}`}
      style={{
        left: x,
        top: y,
        transform: transformStyle,
        zIndex: isDragging ? 400 : 300,
        cursor: isDragging ? 'grabbing' : isAltPressed ? 'grab' : 'default',
        willChange: isDragging ? 'transform' : 'auto',
        touchAction: 'none',
        userSelect: isDragging ? 'none' : 'auto',
      }}
    >
      <div
        data-role="drag-handle"
        className={`text-muted-foreground flex items-center justify-between border-b px-2 py-1.5 text-[11px] select-none transition-colors ${isDragging ? 'cursor-grabbing bg-muted/50' : 'cursor-grab hover:bg-muted/30'}`}
        title="Drag to move (Alt-drag anywhere)"
      >
        <span className="inline-flex items-center gap-1 pointer-events-none">
          <GripVertical className="h-3.5 w-3.5" />
          Drag
        </span>
        <span className="text-[10px] opacity-60">Alt+drag anywhere</span>
      </div>
      {children}
    </Card>
  );
});

// Snap guide lines component
function SnapGuides({ guides }: { guides?: SnapGuide[] }) {
  if (!guides || guides.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[500]">
      {guides.map((guide, i) => (
        <div
          key={`${guide.type}-${guide.position}-${i}`}
          className="absolute bg-primary/60"
          style={
            guide.type === 'vertical'
              ? { left: guide.position, top: 0, width: 1, height: '100vh' }
              : { left: 0, top: guide.position, width: '100vw', height: 1 }
          }
        />
      ))}
    </div>
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
    if (widget.type === 'note') setLocalText(String(widget.settings?.text ?? ''));
    if (widget.type === 'clock') setShowSeconds(Boolean(widget.settings?.showSeconds));
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
            <Input value={localText} onChange={(e) => setLocalText(e.target.value)} />
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
  const { widgets, setWidgetPosition, updateWidget, removeWidget } = useWidgets();
  const [menuTarget, setMenuTarget] = React.useState<string | null>(null);
  const [settingsTarget, setSettingsTarget] = React.useState<WidgetModel | null>(null);
  const [activeSnapGuides, setActiveSnapGuides] = React.useState<SnapGuide[]>([]);

  // Convert widgets to WidgetRect format for snapping
  const widgetRects = React.useMemo<WidgetRect[]>(
    () =>
      widgets.map((w) => ({
        id: w.id,
        x: w.x,
        y: w.y,
        w: w.w ?? 260,
        h: w.h ?? 180,
      })),
    [widgets],
  );

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
    if (w.type === 'clock') return <ClockWidget showSeconds={Boolean(w.settings?.showSeconds)} />;
    if (w.type === 'note') return <NoteWidget text={String(w.settings?.text ?? '')} />;
    return null;
  };

  return (
    <>
      {/* Snap guide lines */}
      <SnapGuides guides={activeSnapGuides} />

      {widgets.map((w) => (
        <WidgetFrame
          key={w.id}
          id={w.id}
          x={w.x}
          y={w.y}
          otherWidgets={widgetRects}
          onMove={(x, y) => setWidgetPosition(w.id, x, y)}
          onContextMenu={onContext(w.id)}
          onSnapGuidesChange={setActiveSnapGuides}
        >
          <div className="relative">
            {renderBody(w)}
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
        onSave={(patch) => settingsTarget && updateWidget(settingsTarget.id, patch)}
      />
    </>
  );
}

import { AnyNode } from './types';

type Props = {
  nodes: AnyNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onToggleVisible: (id: string) => void;
  onToggleLock: (id: string) => void;
  onReorder: (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => void;
  onRemoveBg: (id: string) => void;
  onAddText: () => void;
  onAddRect: () => void;
  onAddImage: (url?: string) => void;
};

export default function LayersPanel({
  nodes,
  selectedId,
  onSelect,
  onRename,
  onToggleVisible,
  onToggleLock,
  onReorder,
  onRemoveBg,
  onAddText,
  onAddRect,
  onAddImage,
}: Props) {
  return (
    <aside className="bg-background/95 flex w-[260px] flex-col gap-2 border-r border-[var(--border)] p-3 backdrop-blur">
      <header className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-medium">Layers</h3>
        <div className="flex gap-1">
          <button
            className="hover:bg-muted rounded border px-2 py-1 text-xs"
            onClick={onAddText}
          >
            + Text
          </button>
          <button
            className="hover:bg-muted rounded border px-2 py-1 text-xs"
            onClick={onAddRect}
          >
            + Rect
          </button>
          <button
            className="hover:bg-muted rounded border px-2 py-1 text-xs"
            onClick={() => onAddImage()}
          >
            + Image
          </button>
        </div>
      </header>
      <div className="flex-1 space-y-1 overflow-auto">
        {nodes.map((n) => (
          <div
            key={n.id}
            className={`rounded border p-2 text-xs ${selectedId === n.id ? 'border-primary' : 'border-[var(--border)]'} bg-background/80`}
          >
            <div className="flex items-center gap-2">
              <input
                className="flex-1 bg-transparent outline-none"
                value={n.name || n.id}
                onChange={(e) => onRename(n.id, e.target.value)}
              />
              <button
                className="rounded border px-1"
                title="Toggle visible"
                onClick={() => onToggleVisible(n.id)}
              >
                {n.visible === false ? '🙈' : '👁️'}
              </button>
              <button
                className="rounded border px-1"
                title="Lock"
                onClick={() => onToggleLock(n.id)}
              >
                {n.locked ? '🔒' : '🔓'}
              </button>
            </div>
            <div className="mt-1 flex gap-1">
              <button
                className="rounded border px-2"
                onClick={() => onReorder(n.id, 'up')}
              >
                Up
              </button>
              <button
                className="rounded border px-2"
                onClick={() => onReorder(n.id, 'down')}
              >
                Down
              </button>
              <button
                className="rounded border px-2"
                onClick={() => onReorder(n.id, 'top')}
              >
                Top
              </button>
              <button
                className="rounded border px-2"
                onClick={() => onReorder(n.id, 'bottom')}
              >
                Bottom
              </button>
              {n.type === 'image' && (
                <button
                  className="ml-auto rounded border px-2"
                  onClick={() => onRemoveBg(n.id)}
                >
                  Remove BG (stub)
                </button>
              )}
              <button
                className="ml-auto rounded border px-2"
                onClick={() => onSelect(n.id)}
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ClipboardPaste, Copy, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCanvasStore } from '../../store/canvas.store';

type CanvasContextMenuProps = {
  children: ReactNode;
};

export function CanvasContextMenu({ children }: CanvasContextMenuProps) {
  const copy = useCanvasStore((state) => state.copy);
  const paste = useCanvasStore((state) => state.paste);
  const deleteSelected = useCanvasStore((state) => state.deleteSelected);
  const selection = useCanvasStore((state) => state.selection);
  const clipboard = useCanvasStore((state) => state.clipboard);

  const hasSelection = selection.ids.length > 0;
  const hasClipboard = clipboard.length > 0;

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-full w-full flex-1">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem
          disabled={!hasSelection}
          onClick={copy}
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy
          <span className="ml-auto text-xs tracking-widest opacity-60">
            Ctrl+C
          </span>
        </ContextMenuItem>
        <ContextMenuItem
          disabled={!hasClipboard}
          onClick={paste}
          className="gap-2"
        >
          <ClipboardPaste className="h-4 w-4" />
          Paste
          <span className="ml-auto text-xs tracking-widest opacity-60">
            Ctrl+V
          </span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          disabled={!hasSelection}
          onClick={deleteSelected}
          className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          Delete
          <span className="ml-auto text-xs tracking-widest opacity-60">
            Del
          </span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

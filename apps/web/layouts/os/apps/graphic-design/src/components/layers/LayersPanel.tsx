import type React from 'react';

import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Eye, EyeOff, Lock, Unlock } from 'lucide-react';

import { useCanvasStore } from '../../store/canvas.store';

export function LayersPanel() {
  const nodes = useCanvasStore((state) => state.nodes);
  const selection = useCanvasStore((state) => state.selection);
  const selectNode = useCanvasStore((state) => state.selectNode);
  const toggleVisibility = useCanvasStore((state) => state.toggleVisibility);
  const toggleLock = useCanvasStore((state) => state.toggleLock);

  const handleSelect =
    (id: string) => (event: React.MouseEvent<HTMLLIElement>) => {
      selectNode(id, event.shiftKey || event.metaKey || event.ctrlKey);
    };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Layers</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <ul className="space-y-1 p-3">
            {nodes.map((node) => {
              const isSelected = selection.ids.includes(node.id);
              return (
                <li
                  key={node.id}
                  onMouseDown={handleSelect(node.id)}
                  className={
                    'hover:bg-foreground/5 flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm transition ' +
                    (isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border')
                  }
                >
                  <span className="truncate">{node.name}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleVisibility(node.id);
                      }}
                    >
                      {node.visible === false ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleLock(node.id);
                      }}
                    >
                      {node.locked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Unlock className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

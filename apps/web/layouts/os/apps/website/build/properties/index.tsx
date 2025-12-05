'use client';

import { Button } from '@workspace/ui/components/button';
import { useWebsite } from '@/hooks/use-website';
import { cn } from '@/lib/utils';
import * as Lucide from 'lucide-react';
import * as React from 'react';
import { PropertiesHeaderControls } from './header-controls';
import { NodeEditor } from './node-editor';
import { useSidebarSelection } from './use-sidebar-selection';

export function BuilderProperties() {
  const { website, setWebsite } = useWebsite();
  const {
    selectedNode,
    selectedTarget,
    applyPatch,
    clearSelection,
    deleteSelected,
    duplicateSelected,
  } = useSidebarSelection(website, setWebsite);

  const [isMinimized, setIsMinimized] = React.useState(true);
  const [isMaximized, setIsMaximized] = React.useState(false);

  const handleMinimize = React.useCallback(() => {
    clearSelection();
    setIsMinimized(true);
    setIsMaximized(false);
  }, [clearSelection]);

  const handleRestore = React.useCallback(() => {
    setIsMinimized(false);
  }, []);

  const handleToggleMaximize = React.useCallback(() => {
    setIsMaximized((v) => !v);
    setIsMinimized(false);
  }, []);

  const handleClose = React.useCallback(() => {
    // Minimize when closing properties as requested
    setIsMinimized(true);
    setIsMaximized(false);
  }, []);

  React.useEffect(() => {
    if (selectedNode && isMinimized) {
      setIsMinimized(false);
    }
  }, [isMinimized, selectedNode]);

  return (
    <aside
      className={cn(
        'z-40 m-2 flex transition-all duration-200',
        isMinimized ? 'w-[48px]' : 'w-[390px]',
      )}
      data-testid="builder-properties-aside"
    >
      <div className="flex-1 border-none" data-testid="builder-properties">
        <div className="flex items-center justify-between pt-2">
          <PropertiesHeaderControls
            isMinimized={isMinimized}
            isMaximized={isMaximized}
            onMinimize={handleMinimize}
            onRestore={handleRestore}
            onToggleMaximize={handleToggleMaximize}
            onClose={handleClose}
          />
          {selectedNode && (
            <div className="flex items-start justify-end">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={duplicateSelected}
                  title="Duplicate"
                >
                  <Lucide.Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={deleteSelected}
                  title="Delete"
                >
                  <Lucide.Trash2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSelection}
                  title="Deselect"
                >
                  <Lucide.X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {!isMinimized && (
          <div
            className={cn(
              'space-y-5',
              'overflow-y-auto',
              isMaximized ? 'h-full' : 'max-h-[calc(100vh-140px)]',
            )}
          >
            {selectedNode ? (
              <NodeEditor
                node={selectedNode}
                onPatch={applyPatch}
                onClear={clearSelection}
                onDelete={deleteSelected}
                onDuplicate={duplicateSelected}
                location={selectedTarget}
              />
            ) : (
              <div className="text-muted-foreground text-sm">
                Select an element in the preview to edit its properties.
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

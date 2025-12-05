/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@workspace/ui/components/button';
import { useWebsite } from '@/hooks/use-website';
import { useWebsiteHistory } from '@/hooks/use-website/history-store';
import { useBuilderSelection } from '@/hooks/use-website/selection-store';
import { cn } from '@/lib/utils';
import { Redo2, Undo2 } from 'lucide-react';
import { DarkModeSwitch } from './dark-mode';
import { SelectPages } from './select-pages';

export function Toolbar() {
  const {
    viewportSize,
    setViewportSize,
    getViewportIcon,
    tabState,
    setWebsite,
  } = useWebsite();
  const undo = useWebsiteHistory((state) => state.undo);
  const redo = useWebsiteHistory((state) => state.redo);
  const canUndo = useWebsiteHistory((state) => state.canUndo);
  const canRedo = useWebsiteHistory((state) => state.canRedo);
  const clearSelection = useBuilderSelection((state) => state.clearSelection);

  const handleUndo = () => {
    if (!canUndo) return;
    setWebsite((prev: any) => undo(prev) ?? prev);
    clearSelection();
  };

  const handleRedo = () => {
    if (!canRedo) return;
    setWebsite((prev: any) => redo(prev) ?? prev);
    clearSelection();
  };

  const handleViewportChange = (
    e: any,
    size: 'desktop' | 'tablet' | 'mobile',
  ) => {
    e.preventDefault();
    setViewportSize(size);
  };
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      {/* Right: viewport toggles + preview toggle */}
      <SelectPages />
      {tabState === 'build' ? (
        <div className="bg-background flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUndo}
              disabled={!canUndo}
              title="Undo"
              aria-label="Undo"
              className="h-8 w-8"
            >
              <Undo2 className="h-4 w-4" />
              <span className="sr-only">Undo</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRedo}
              disabled={!canRedo}
              title="Redo"
              aria-label="Redo"
              className="h-8 w-8"
            >
              <Redo2 className="h-4 w-4" />
              <span className="sr-only">Redo</span>
            </Button>
          </div>
          <div className="flex items-center rounded-md">
            <Button
              variant={viewportSize === 'desktop' ? 'outline' : 'ghost'}
              size="sm"
              onClick={(e) => handleViewportChange(e, 'desktop')}
              className={cn(
                'flex cursor-pointer items-center gap-2 transition-all duration-200',
              )}
              title="Desktop"
            >
              {getViewportIcon('desktop')}
            </Button>
            <Button
              variant={viewportSize === 'tablet' ? 'outline' : 'ghost'}
              size="sm"
              onClick={(e) => handleViewportChange(e, 'tablet')}
              className={cn(
                'flex cursor-pointer items-center gap-2 transition-all duration-200',
              )}
              title="Tablet"
            >
              {getViewportIcon('tablet')}
            </Button>
            <Button
              variant={viewportSize === 'mobile' ? 'outline' : 'ghost'}
              size="sm"
              onClick={(e) => handleViewportChange(e, 'mobile')}
              className={cn(
                'flex cursor-pointer items-center gap-2 transition-all duration-200',
              )}
              title="Mobile"
            >
              {getViewportIcon('mobile')}
            </Button>
          </div>
          <DarkModeSwitch />
        </div>
      ) : null}
    </div>
  );
}

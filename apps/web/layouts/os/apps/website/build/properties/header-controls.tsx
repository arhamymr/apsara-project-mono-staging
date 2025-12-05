import { Button } from '@workspace/ui/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import * as Lucide from 'lucide-react';

export type PropertiesHeaderControlsProps = {
  isMinimized: boolean;
  isMaximized: boolean;
  onMinimize: () => void;
  onRestore: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
};

export function PropertiesHeaderControls({
  isMinimized,
  onMinimize,
  onRestore,
}: PropertiesHeaderControlsProps) {
  return (
    <div className="flex items-center gap-1">
      {!isMinimized ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onMinimize}
              title="Minimize properties"
              aria-label="Minimize properties"
              data-testid="props-minimize"
            >
              <Lucide.Minimize2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Minimize</TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRestore}
              title="Restore properties"
              aria-label="Restore properties"
              data-testid="props-restore"
            >
              <Lucide.Maximize2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Restore</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

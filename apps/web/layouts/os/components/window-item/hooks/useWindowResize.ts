import { useCallback, useRef, useState } from 'react';
import { useWindowActions } from '@/layouts/os/WindowActionsContext';
import { MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT } from '../constants';

type ResizeDirection =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

interface UseWindowResizeProps {
  windowId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ResizeState {
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startPosX: number;
  startPosY: number;
  direction: ResizeDirection;
}

export function useWindowResize({
  windowId,
  x,
  y,
  width,
  height,
}: UseWindowResizeProps) {
  const { focusWindow, updateWindowSize, setResizingWindow } = useWindowActions();
  const [isResizing, setIsResizing] = useState(false);
  const resizeStateRef = useRef<ResizeState | null>(null);

  const handleResizeStart = useCallback(
    (e: React.PointerEvent, direction: ResizeDirection) => {
      e.preventDefault();
      e.stopPropagation();
      
      focusWindow(windowId);
      setResizingWindow(windowId);
      setIsResizing(true);

      resizeStateRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: width,
        startHeight: height,
        startPosX: x,
        startPosY: y,
        direction,
      };

      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [focusWindow, windowId, setResizingWindow, width, height, x, y],
  );

  const handleResizeMove = useCallback(
    (e: React.PointerEvent) => {
      if (!resizeStateRef.current) return;

      const { startX, startY, startWidth, startHeight, startPosX, startPosY, direction } =
        resizeStateRef.current;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      // Handle horizontal resize
      if (direction.includes('right') || direction === 'right') {
        newWidth = Math.max(MIN_WINDOW_WIDTH, startWidth + deltaX);
      }
      if (direction.includes('left') || direction === 'left') {
        const potentialWidth = startWidth - deltaX;
        if (potentialWidth >= MIN_WINDOW_WIDTH) {
          newWidth = potentialWidth;
          newX = startPosX + deltaX;
        }
      }

      // Handle vertical resize
      if (direction.includes('bottom') || direction === 'bottom') {
        newHeight = Math.max(MIN_WINDOW_HEIGHT, startHeight + deltaY);
      }
      if (direction.includes('top') || direction === 'top') {
        const potentialHeight = startHeight - deltaY;
        if (potentialHeight >= MIN_WINDOW_HEIGHT) {
          newHeight = potentialHeight;
          newY = Math.max(0, startPosY + deltaY);
        }
      }

      updateWindowSize(windowId, newWidth, newHeight, newX, newY);
    },
    [windowId, updateWindowSize],
  );

  const handleResizeEnd = useCallback(
    (e: React.PointerEvent) => {
      if (!resizeStateRef.current) return;

      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      resizeStateRef.current = null;
      setIsResizing(false);
      setResizingWindow(null);
    },
    [setResizingWindow],
  );

  return {
    isResizing,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
  };
}

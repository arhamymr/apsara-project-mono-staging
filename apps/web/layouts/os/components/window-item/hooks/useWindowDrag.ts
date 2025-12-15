import { useCallback, useRef, useState } from 'react';
import { useWindowActions } from '@/layouts/os/WindowActionsContext';
import { useEdgeSnapping } from './useEdgeSnapping';

interface UseWindowDragProps {
  windowId: string;
  width: number;
  height: number;
}

export function useWindowDrag({ windowId, width, height }: UseWindowDragProps) {
  // Use split actions context - stable references
  const {
    focusWindow,
    updateWindowPosition,
    setDraggingWindow,
    setResizingWindow,
    updateWindowSize,
  } = useWindowActions();

  const { calculateEdgePosition } = useEdgeSnapping();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Use ref to track animation timeout for cleanup
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDragStart = useCallback(() => {
    // Clear any pending animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    focusWindow(windowId);
    setDraggingWindow(windowId);
  }, [focusWindow, windowId, setDraggingWindow]);

  const handleDrag = useCallback(() => {
    // Position updates only on drag stop for performance
  }, []);

  const handleDragStop = useCallback(
    (_event: unknown, data: { x: number; y: number }) => {
      const edgePosition = calculateEdgePosition(data.x, data.y, width, height);

      if (edgePosition.x !== data.x || edgePosition.y !== data.y) {
        setIsAnimating(true);
        updateWindowPosition(windowId, edgePosition.x, edgePosition.y);

        animationTimeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
          setDraggingWindow(null);
          animationTimeoutRef.current = null;
        }, 300);
      } else {
        updateWindowPosition(windowId, data.x, data.y);
        setDraggingWindow(null);
      }
    },
    [calculateEdgePosition, width, height, updateWindowPosition, windowId, setDraggingWindow],
  );

  const handleResizeStart = useCallback(() => {
    focusWindow(windowId);
    setResizingWindow(windowId);
  }, [focusWindow, windowId, setResizingWindow]);

  const handleResizeStop = useCallback(
    (
      _event: unknown,
      _direction: unknown,
      ref: HTMLElement,
      _delta: unknown,
      position: { x: number; y: number },
    ) => {
      updateWindowSize(
        windowId,
        parseInt(ref.style.width, 10),
        parseInt(ref.style.height, 10),
        position.x,
        position.y,
      );
      setResizingWindow(null);
    },
    [updateWindowSize, windowId, setResizingWindow],
  );

  const handleFocus = useCallback(() => {
    focusWindow(windowId);
  }, [focusWindow, windowId]);

  return {
    isAnimating,
    handleDragStart,
    handleDrag,
    handleDragStop,
    handleResizeStart,
    handleResizeStop,
    handleFocus,
  };
}

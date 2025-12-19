import { useCallback, useRef, useState } from 'react';
import { useWindowActions } from '@/layouts/os/WindowActionsContext';
import { useEdgeSnapping } from './useEdgeSnapping';

interface UseDndKitDragProps {
  windowId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DragState {
  startX: number;
  startY: number;
  startPosX: number;
  startPosY: number;
}

export function useDndKitDrag({
  windowId,
  x,
  y,
  width,
  height,
}: UseDndKitDragProps) {
  const {
    focusWindow,
    updateWindowPosition,
    setDraggingWindow,
  } = useWindowActions();

  const { calculateEdgePosition } = useEdgeSnapping();
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Track drag offset locally to avoid React state updates during drag
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const dragStateRef = useRef<DragState | null>(null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.window-drag-handle')) return;

      e.preventDefault();
      e.stopPropagation();
      
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }

      focusWindow(windowId);
      setDraggingWindow(windowId);
      setIsDragging(true);
      setDragOffset({ x: 0, y: 0 });

      dragStateRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPosX: x,
        startPosY: y,
      };

      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [focusWindow, windowId, setDraggingWindow, x, y],
  );

  const handleDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStateRef.current || !isDragging) return;

      // Cancel any pending RAF to avoid stacking
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Use RAF for smooth 60fps updates
      rafRef.current = requestAnimationFrame(() => {
        if (!dragStateRef.current) return;
        
        const { startX, startY, startPosY } = dragStateRef.current;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // Prevent dragging above viewport
        const newY = startPosY + deltaY;
        const clampedDeltaY = newY < 0 ? -startPosY : deltaY;

        setDragOffset({ x: deltaX, y: clampedDeltaY });
      });
    },
    [isDragging],
  );

  const handleDragEnd = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStateRef.current) return;

      // Cancel any pending RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      (e.target as HTMLElement).releasePointerCapture(e.pointerId);

      const { startX, startY, startPosX, startPosY } = dragStateRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const finalX = startPosX + deltaX;
      const finalY = Math.max(0, startPosY + deltaY);

      // Reset drag offset before applying final position
      setDragOffset({ x: 0, y: 0 });

      // Apply edge snapping
      const edgePosition = calculateEdgePosition(finalX, finalY, width, height);

      if (edgePosition.x !== finalX || edgePosition.y !== finalY) {
        setIsAnimating(true);
        updateWindowPosition(windowId, edgePosition.x, edgePosition.y);

        animationTimeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
          setDraggingWindow(null);
          animationTimeoutRef.current = null;
        }, 300);
      } else {
        updateWindowPosition(windowId, finalX, finalY);
        setDraggingWindow(null);
      }

      dragStateRef.current = null;
      setIsDragging(false);
    },
    [calculateEdgePosition, width, height, updateWindowPosition, windowId, setDraggingWindow],
  );

  const handleFocus = useCallback(() => {
    focusWindow(windowId);
  }, [focusWindow, windowId]);

  return {
    isDragging,
    isAnimating,
    dragOffset,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleFocus,
  };
}

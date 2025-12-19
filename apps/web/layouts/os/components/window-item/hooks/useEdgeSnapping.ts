import { useCallback } from 'react';
import { useViewportSize } from './useViewportSize';

interface EdgePosition {
  x: number;
  y: number;
}

export function useEdgeSnapping() {
  const viewport = useViewportSize();

  const calculateEdgePosition = useCallback(
    (x: number, y: number, width: number, height: number): EdgePosition => {
      if (!viewport.width || !viewport.height) {
        return { x, y };
      }

      const minVisibleWidth = width * 0.5;
      const minVisibleHeight = height * 0.5;

      const leftEdge = -width + minVisibleWidth;
      const rightEdge = viewport.width - minVisibleWidth;
      const topEdge = 0;
      const bottomEdge = viewport.height - minVisibleHeight;

      let targetX = x;
      let targetY = y;

      if (x + width < 0) {
        targetX = leftEdge;
      } else if (x > viewport.width) {
        targetX = rightEdge;
      }

      if (y + height < 0) {
        targetY = topEdge;
      } else if (y > viewport.height) {
        targetY = bottomEdge;
      }

      targetY = Math.max(0, targetY);

      return { x: targetX, y: targetY };
    },
    [viewport.width, viewport.height],
  );

  return { calculateEdgePosition };
}

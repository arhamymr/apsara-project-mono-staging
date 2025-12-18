import { useCallback, useRef, useState } from 'react';

const GRID = 12;
const NAVBAR = 56;
const MARGIN = 16;
const SNAP_THRESHOLD = 10;
const GAP = 12;

interface WidgetRect {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface UseWidgetDragProps {
  widgetId: string;
  x: number;
  y: number;
  otherWidgets: WidgetRect[];
  onMove: (x: number, y: number) => void;
}

interface DragState {
  startX: number;
  startY: number;
  startPosX: number;
  startPosY: number;
}

export interface SnapGuide {
  type: 'vertical' | 'horizontal';
  position: number;
}

export function useWidgetDrag({
  widgetId,
  x,
  y,
  otherWidgets,
  onMove,
}: UseWidgetDragProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);

  const dragStateRef = useRef<DragState | null>(null);
  const rafRef = useRef<number | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const otherWidgetsRef = useRef(otherWidgets);

  otherWidgetsRef.current = otherWidgets;

  const calculateSnap = useCallback(
    (rawX: number, rawY: number, width: number, height: number) => {
      const others = otherWidgetsRef.current.filter((w) => w.id !== widgetId);
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

      let snappedX = Math.round(rawX / GRID) * GRID;
      let snappedY = Math.round(rawY / GRID) * GRID;

      const guides: SnapGuide[] = [];

      const candidatesX: { value: number; guide: number }[] = [];
      const candidatesY: { value: number; guide: number }[] = [];

      // Screen edges
      candidatesX.push({ value: MARGIN, guide: MARGIN });
      candidatesX.push({ value: vw - width - MARGIN, guide: vw - MARGIN });
      candidatesY.push({ value: NAVBAR + MARGIN, guide: NAVBAR + MARGIN });
      candidatesY.push({ value: vh - height - MARGIN, guide: vh - MARGIN });

      // Widget-to-widget
      for (const other of others) {
        candidatesX.push({ value: other.x, guide: other.x });
        candidatesX.push({ value: other.x + other.w - width, guide: other.x + other.w });
        candidatesX.push({ value: other.x + other.w + GAP, guide: other.x + other.w + GAP / 2 });
        candidatesX.push({ value: other.x - width - GAP, guide: other.x - GAP / 2 });

        candidatesY.push({ value: other.y, guide: other.y });
        candidatesY.push({ value: other.y + other.h - height, guide: other.y + other.h });
        candidatesY.push({ value: other.y + other.h + GAP, guide: other.y + other.h + GAP / 2 });
        candidatesY.push({ value: other.y - height - GAP, guide: other.y - GAP / 2 });
      }

      let bestXDist = SNAP_THRESHOLD + 1;
      for (const candidate of candidatesX) {
        const dist = Math.abs(snappedX - candidate.value);
        if (dist < bestXDist && dist <= SNAP_THRESHOLD) {
          snappedX = candidate.value;
          bestXDist = dist;
          guides.push({ type: 'vertical', position: candidate.guide });
        }
      }

      let bestYDist = SNAP_THRESHOLD + 1;
      for (const candidate of candidatesY) {
        const dist = Math.abs(snappedY - candidate.value);
        if (dist < bestYDist && dist <= SNAP_THRESHOLD) {
          snappedY = candidate.value;
          bestYDist = dist;
          guides.push({ type: 'horizontal', position: candidate.guide });
        }
      }

      snappedX = Math.max(MARGIN, Math.min(snappedX, vw - width - MARGIN));
      snappedY = Math.max(NAVBAR + MARGIN, Math.min(snappedY, vh - height - MARGIN));

      return { x: snappedX, y: snappedY, guides };
    },
    [widgetId],
  );

  const handleDragStart = useCallback(
    (e: React.PointerEvent, element: HTMLElement) => {
      const target = e.target as HTMLElement;
      const handle = target.closest('[data-role="drag-handle"]');

      if (!handle && !e.altKey) return;

      const isInteractive = target.closest('button, input, textarea, select, a, [role="button"]');
      if (isInteractive && !e.altKey) return;

      e.preventDefault();
      e.stopPropagation();

      setIsDragging(true);
      setDragOffset({ x: 0, y: 0 });
      setSnapGuides([]);
      elementRef.current = element;

      dragStateRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPosX: x,
        startPosY: y,
      };

      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [x, y],
  );

  const handleDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStateRef.current || !isDragging) return;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        if (!dragStateRef.current || !elementRef.current) return;

        const { startX, startY, startPosX, startPosY } = dragStateRef.current;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        const rawX = startPosX + deltaX;
        const rawY = startPosY + deltaY;

        const width = elementRef.current.offsetWidth;
        const height = elementRef.current.offsetHeight;

        const { x: snappedX, y: snappedY, guides } = calculateSnap(rawX, rawY, width, height);

        setDragOffset({ x: snappedX - startPosX, y: snappedY - startPosY });
        setSnapGuides(guides);
      });
    },
    [isDragging, calculateSnap],
  );

  const handleDragEnd = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStateRef.current) return;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      (e.target as HTMLElement).releasePointerCapture(e.pointerId);

      const { startPosX, startPosY } = dragStateRef.current;
      const finalX = startPosX + dragOffset.x;
      const finalY = startPosY + dragOffset.y;

      setDragOffset({ x: 0, y: 0 });
      setSnapGuides([]);
      dragStateRef.current = null;
      elementRef.current = null;
      setIsDragging(false);

      onMove(finalX, finalY);
    },
    [onMove, dragOffset],
  );

  return {
    isDragging,
    dragOffset,
    snapGuides,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
}

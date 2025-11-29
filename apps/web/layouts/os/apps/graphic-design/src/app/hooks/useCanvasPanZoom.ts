import type React from 'react';
import { useCallback, useRef, useState } from 'react';

const MIN_SCALE = 0.2;
const MAX_SCALE = 4;
const SCALE_STEP = 1.06;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

type Offset = {
  x: number;
  y: number;
};

type PanZoomState = {
  scale: number;
  offset: Offset;
};

const INITIAL_STATE: PanZoomState = {
  scale: 1,
  offset: { x: 0, y: 0 },
};

export function useCanvasPanZoom() {
  const [state, setState] = useState<PanZoomState>(INITIAL_STATE);
  const isPanning = useRef(false);
  const lastMousePos = useRef<Offset>({ x: 0, y: 0 });

  const handleWheel = useCallback<React.WheelEventHandler<HTMLDivElement>>(
    (event) => {
      event.preventDefault();

      const stageRect = (
        event.currentTarget.querySelector('canvas') as HTMLCanvasElement | null
      )?.getBoundingClientRect();

      if (!stageRect) return;

      const point = {
        x: event.clientX - stageRect.left,
        y: event.clientY - stageRect.top,
      };

      const scaleMultiplier = event.deltaY > 0 ? 1 / SCALE_STEP : SCALE_STEP;

      setState((current) => {
        const nextScale = clamp(
          current.scale * scaleMultiplier,
          MIN_SCALE,
          MAX_SCALE,
        );

        const mousePointTo = {
          x: (point.x - current.offset.x) / current.scale,
          y: (point.y - current.offset.y) / current.scale,
        };

        const nextOffset = {
          x: point.x - mousePointTo.x * nextScale,
          y: point.y - mousePointTo.y * nextScale,
        };

        return { scale: nextScale, offset: nextOffset };
      });
    },
    [],
  );

  const startPan = useCallback((x: number, y: number) => {
    isPanning.current = true;
    lastMousePos.current = { x, y };
  }, []);

  const pan = useCallback((x: number, y: number) => {
    if (!isPanning.current) return;

    const dx = x - lastMousePos.current.x;
    const dy = y - lastMousePos.current.y;

    setState((prev) => ({
      ...prev,
      offset: {
        x: prev.offset.x + dx,
        y: prev.offset.y + dy,
      },
    }));

    lastMousePos.current = { x, y };
  }, []);

  const endPan = useCallback(() => {
    isPanning.current = false;
  }, []);

  const updateOffset = useCallback((next: Offset) => {
    setState((current) => ({ ...current, offset: next }));
  }, []);

  const resetView = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    scale: state.scale,
    offset: state.offset,
    handleWheel,
    startPan,
    pan,
    endPan,
    updateOffset,
    resetView,
  } as const;
}

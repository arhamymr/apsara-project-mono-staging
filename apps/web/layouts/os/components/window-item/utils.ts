import type { WinState } from '../../types';
import type { ViewportSize } from './hooks/useViewportSize';

export function createDragBoundFunc(
  viewport: ViewportSize,
  win: Pick<WinState, 'w' | 'h'>,
) {
  return (pos: { x: number; y: number }) => {
    if (!viewport.width || !viewport.height) {
      return pos;
    }

    const extraWidth = viewport.width;
    const extraHeight = viewport.height;

    const minX = -extraWidth / 2;
    const maxX = viewport.width - win.w + extraWidth / 2;

    const minY = -extraHeight / 2;
    const maxY = viewport.height - win.h + extraHeight / 2;

    return {
      x: clamp(pos.x, minX, maxX),
      y: clamp(pos.y, minY, maxY),
    };
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

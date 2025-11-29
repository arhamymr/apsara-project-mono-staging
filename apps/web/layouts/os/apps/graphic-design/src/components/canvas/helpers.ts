import { useEffect, useState } from 'react';

export function snapToGrid(value: number, gridSize = 8) {
  return Math.round(value / gridSize) * gridSize;
}

export function snapPosition(
  position: { x: number; y: number },
  gridSize = 8,
): { x: number; y: number } {
  return {
    x: snapToGrid(position.x, gridSize),
    y: snapToGrid(position.y, gridSize),
  };
}

export function hitTestRectangle(
  rect: { x: number; y: number; width: number; height: number },
  point: { x: number; y: number },
) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export function useCanvasImage(src?: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) {
      setImage(null);
      return;
    }

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    const handleLoad = () => setImage(img);
    const handleError = () => setImage(null);

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src]);

  return image;
}

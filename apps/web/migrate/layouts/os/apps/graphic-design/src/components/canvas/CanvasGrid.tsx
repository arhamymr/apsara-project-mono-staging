import type { ReactElement } from 'react';
import { Line } from 'react-konva';

type CanvasGridProps = {
  width: number;
  height: number;
  scale: number;
  offset: { x: number; y: number };
};

export function CanvasGrid({ width, height, scale, offset }: CanvasGridProps) {
  const spacing = 40 * scale;
  const lines: ReactElement[] = [];

  const startX = -((offset.x * scale) % spacing) - spacing;
  const startY = -((offset.y * scale) % spacing) - spacing;

  for (let x = startX; x < width + spacing; x += spacing) {
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, 0, x, height]}
        stroke="#000"
        opacity={0.06}
        strokeWidth={1}
      />,
    );
  }

  for (let y = startY; y < height + spacing; y += spacing) {
    lines.push(
      <Line
        key={`h-${y}`}
        points={[0, y, width, y]}
        stroke="#000"
        opacity={0.06}
        strokeWidth={1}
      />,
    );
  }

  return <>{lines}</>;
}

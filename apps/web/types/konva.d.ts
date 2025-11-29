import 'konva';

declare module 'konva' {
  interface Transformer {
    nodes(nodes: any[]): void;
    getLayer(): Layer | null;
    batchDraw(): void;
  }

  interface Rect extends Shape {
    scaleX(): number;
    scaleY(): number;
    scaleX(scale: number): void;
    scaleY(scale: number): void;
    x(): number;
    y(): number;
    width(): number;
    height(): number;
  }
}

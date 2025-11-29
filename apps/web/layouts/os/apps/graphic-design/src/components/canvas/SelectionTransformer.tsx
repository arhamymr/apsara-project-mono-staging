import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Transformer } from 'react-konva';

import { useCanvasStore } from '../../store/canvas.store';

export function SelectionTransformer() {
  const transformerRef = useRef<Konva.Transformer>(null);
  const selection = useCanvasStore((state) => state.selection);

  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;
    transformer.nodes([]);
    transformer.getLayer()?.batchDraw();
  }, [selection]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Transformer ref={transformerRef as any} rotateEnabled={false} anchorSize={6} />
  );
}

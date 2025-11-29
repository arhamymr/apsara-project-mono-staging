import { useEffect, useRef } from 'react';
import { Transformer } from 'react-konva';

import { useCanvasStore } from '../../store/canvas.store';

export function SelectionTransformer() {
  const transformerRef = useRef<Transformer>(null);
  const selection = useCanvasStore((state) => state.selection);

  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;
    transformer.nodes([]);
    transformer.getLayer()?.batchDraw();
  }, [selection]);

  return (
    <Transformer ref={transformerRef} rotateEnabled={false} anchorSize={6} />
  );
}

import Konva from 'konva';
import React, { useRef } from 'react';

export function useTransformer() {
  const trRef = useRef<Konva.Transformer>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // Attach the transformer whenever selection changes
  React.useEffect(() => {
    const tr = trRef.current;
    if (!tr) return;

    const stage = tr.getStage();
    if (!stage) return;

    const selectedNode = stage.findOne(`#${selectedId}`);
    tr.nodes(selectedNode ? [selectedNode] : []);
    tr.getLayer()?.batchDraw();
  }, [selectedId]);

  const clearSelectionOnEmptyArea = (e: any) => {
    // clicked on stage but NOT on a shape
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) setSelectedId(null);
  };
}

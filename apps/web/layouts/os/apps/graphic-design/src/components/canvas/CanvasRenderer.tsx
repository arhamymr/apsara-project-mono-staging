/* eslint-disable @typescript-eslint/no-explicit-any */
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useRef } from 'react';
import { Layer, Transformer } from 'react-konva';

import type { NodeModel } from '../../core/model';
import { isSelected } from '../../core/selection';
import { useCanvasStore } from '../../store/canvas.store';
import { CircleNode } from './nodes/CircleNode';
import { ImageNode } from './nodes/ImageNode';
import { NodeWrapper } from './nodes/NodeWrapper';
import { PathNode } from './nodes/PathNode';
import { RectNode } from './nodes/RectNode';
import { TextNode } from './nodes/TextNode';

type CanvasRendererProps = {
  scale: number;
  offset: { x: number; y: number };
};

export function CanvasRenderer({ scale, offset }: CanvasRendererProps) {
  const nodes = useCanvasStore((state) => state.nodes);
  const selection = useCanvasStore((state) => state.selection);
  const selectNode = useCanvasStore((state) => state.selectNode);
  const updateNode = useCanvasStore((state) => state.updateNode);
  const transformerRef = useRef<Konva.Transformer>(null);
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    const transformer = transformerRef.current;
    const layer = layerRef.current;
    if (!transformer || !layer) return;

    const stage = layer.getStage();
    if (!stage) return;

    const selectedNodes = selection.ids
      .map((id) => stage.findOne(`#${id}`))
      .filter(Boolean) as Konva.Node[];

    transformer.nodes(selectedNodes);
    transformer.getLayer()?.batchDraw();
  }, [selection.ids]);

  const handleSelect = (event: KonvaEventObject<MouseEvent>) => {
    const node = event.target;
    const id = node.id();
    if (!id) return;

    selectNode(
      id,
      event.evt.shiftKey || event.evt.metaKey || event.evt.ctrlKey,
    );
    node.moveToTop();
    node.getLayer()?.batchDraw();
  };

  const handleTransformEnd = (id: string, shape: Konva.Node) => {
    const attrs = shape.getAttrs();
    updateNode(id, attrs);
  };

  const handleDragEnd = (id: string, shape: Konva.Node) => {
    updateNode(id, { x: shape.x(), y: shape.y() });
  };

  return (
    <Layer
      ref={layerRef}
      name="drawing"
      scaleX={scale}
      scaleY={scale}
      x={offset.x}
      y={offset.y}
    >
      {nodes.map((node) => (
        <NodeWrapper
          key={node.id}
          node={node}
          isSelected={isSelected(selection, node.id)}
          onSelect={handleSelect}
          onDragEnd={handleDragEnd}
        >
          {(commonProps) => {
            switch (node.type) {
              case 'rect':
                return (
                  <RectNode
                    node={node as NodeModel<'rect'>}
                    isSelected={isSelected(selection, node.id)}
                    commonProps={commonProps}
                    onTransformEnd={handleTransformEnd}
                  />
                );
              case 'circle':
                return (
                  <CircleNode
                    node={node as NodeModel<'circle'>}
                    isSelected={isSelected(selection, node.id)}
                    commonProps={commonProps}
                    onTransformEnd={handleTransformEnd}
                  />
                );
              case 'text':
                return (
                  <TextNode
                    node={node as NodeModel<'text'>}
                    commonProps={commonProps}
                    onTransformEnd={handleTransformEnd}
                  />
                );
              case 'image':
                return (
                  <ImageNode
                    node={node as NodeModel<'image'>}
                    commonProps={commonProps}
                    onTransformEnd={handleTransformEnd}
                  />
                );
              case 'path':
                return (
                  <PathNode
                    node={node as NodeModel<'path'>}
                    isSelected={isSelected(selection, node.id)}
                    commonProps={commonProps}
                    onTransformEnd={handleTransformEnd}
                  />
                );
              default:
                return null;
            }
          }}
        </NodeWrapper>
      ))}
      <Transformer ref={transformerRef} rotateEnabled keepRatio={false} />
    </Layer>
  );
}

import { useCallback, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';

import { useCanvasPanZoom } from '../../app/hooks/useCanvasPanZoom';
import { useCanvasSize } from '../../app/hooks/useCanvasSize';
import { usePreventSystemZoom } from '../../app/hooks/usePreventSystemZoom';
import { useCanvasStore } from '../../store/canvas.store';
import { CanvasContextMenu } from './CanvasContextMenu';
import { CanvasGrid } from './CanvasGrid';
import { CanvasRenderer } from './CanvasRenderer';

export function CanvasStage() {
  const { containerRef, size } = useCanvasSize();
  const { scale, offset, handleWheel, startPan, pan, endPan } =
    useCanvasPanZoom();
  const activeTool = useCanvasStore((state) => state.activeTool);
  const clearSelection = useCanvasStore((state) => state.clearSelection);
  const setSelection = useCanvasStore((state) => state.setSelection);
  const nodes = useCanvasStore((state) => state.nodes);

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const selectionStart = useRef<{ x: number; y: number } | null>(null);

  usePreventSystemZoom();

  const handleStageMouseDown = useCallback(
    (event: any) => {
      // Clicked on empty space
      const clickedOnEmpty = event.target === event.target.getStage();
      if (clickedOnEmpty) {
        if (activeTool === 'select') {
          const stage = event.target.getStage();
          const pointerPosition = stage.getPointerPosition();
          const x = (pointerPosition.x - offset.x) / scale;
          const y = (pointerPosition.y - offset.y) / scale;

          setIsSelecting(true);
          selectionStart.current = { x, y };
          setSelectionBox({ x, y, width: 0, height: 0 });
          clearSelection();
        } else if (activeTool !== 'pan') {
          const stage = event.target.getStage();
          const pointerPosition = stage.getPointerPosition();
          const x = (pointerPosition.x - offset.x) / scale;
          const y = (pointerPosition.y - offset.y) / scale;

          useCanvasStore.getState().addNode(activeTool as any, { x, y });
        } else {
          clearSelection();
        }
      }
    },
    [activeTool, offset, scale, clearSelection],
  );

  const handleStageMouseMove = useCallback(
    (event: any) => {
      if (!isSelecting || !selectionStart.current) return;

      const stage = event.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      const currentX = (pointerPosition.x - offset.x) / scale;
      const currentY = (pointerPosition.y - offset.y) / scale;

      const startX = selectionStart.current.x;
      const startY = selectionStart.current.y;

      setSelectionBox({
        x: Math.min(startX, currentX),
        y: Math.min(startY, currentY),
        width: Math.abs(currentX - startX),
        height: Math.abs(currentY - startY),
      });
    },
    [isSelecting, offset, scale],
  );

  const handleStageMouseUp = useCallback(() => {
    if (isSelecting && selectionBox) {
      const selectedIds = nodes
        .filter((node) => {
          // Simple AABB intersection
          const nodeX = (node.attrs as any).x;
          const nodeY = (node.attrs as any).y;
          // Approximate width/height for non-rect nodes or use specific logic
          const nodeWidth =
            (node.attrs as any).width || (node.attrs as any).radius * 2 || 0;
          const nodeHeight =
            (node.attrs as any).height || (node.attrs as any).radius * 2 || 0;

          return (
            selectionBox.x < nodeX + nodeWidth &&
            selectionBox.x + selectionBox.width > nodeX &&
            selectionBox.y < nodeY + nodeHeight &&
            selectionBox.y + selectionBox.height > nodeY
          );
        })
        .map((node) => node.id);

      if (selectedIds.length > 0) {
        setSelection(selectedIds);
      }
    }

    setIsSelecting(false);
    setSelectionBox(null);
    selectionStart.current = null;
  }, [isSelecting, selectionBox, nodes, setSelection]);

  return (
    <CanvasContextMenu>
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={(e) => {
          if (activeTool === 'pan' || e.button === 1) {
            startPan(e.clientX, e.clientY);
          }
        }}
        onMouseMove={(e) => {
          pan(e.clientX, e.clientY);
        }}
        onMouseUp={endPan}
        onMouseLeave={endPan}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const tool = e.dataTransfer.getData('tool');
          if (!tool) return;

          const stage = containerRef.current?.querySelector('canvas');
          if (!stage) return;

          const rect = stage.getBoundingClientRect();
          const x = (e.clientX - rect.left - offset.x) / scale;
          const y = (e.clientY - rect.top - offset.y) / scale;

          useCanvasStore.getState().addNode(tool as any, { x, y });
        }}
      >
        <Stage
          width={size.width}
          height={size.height}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
          onMouseUp={handleStageMouseUp}
          style={{
            background: 'transparent',
            cursor: activeTool === 'pan' ? 'grab' : 'default',
          }}
        >
          <Layer listening={false}>
            <CanvasGrid
              width={size.width}
              height={size.height}
              scale={scale}
              offset={offset}
            />
          </Layer>
          <CanvasRenderer scale={scale} offset={offset} />
          {selectionBox && (
            <Layer>
              <Rect
                x={selectionBox.x * scale + offset.x}
                y={selectionBox.y * scale + offset.y}
                width={selectionBox.width * scale}
                height={selectionBox.height * scale}
                fill="rgba(0, 161, 255, 0.3)"
                stroke="#00a1ff"
                strokeWidth={1}
                listening={false}
              />
            </Layer>
          )}
        </Stage>
      </div>
    </CanvasContextMenu>
  );
}

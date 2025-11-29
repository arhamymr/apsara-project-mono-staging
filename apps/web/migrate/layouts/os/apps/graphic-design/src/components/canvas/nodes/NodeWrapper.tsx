/* eslint-disable @typescript-eslint/no-explicit-any */
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { type ReactNode, useRef } from 'react';

import type { NodeModel } from '../../../core/model';
import { useCanvasStore } from '../../../store/canvas.store';

type NodeWrapperProps = {
  node: NodeModel;
  isSelected: boolean;
  onSelect: (event: KonvaEventObject<MouseEvent>) => void;
  onDragEnd: (id: string, node: Konva.Node) => void;
  children: (props: any) => ReactNode;
};

export function NodeWrapper({
  node,
  isSelected,
  onSelect,
  onDragEnd,
  children,
}: NodeWrapperProps) {
  if (node.visible === false) {
    return null;
  }

  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const initialPositions = useRef<Record<string, { x: number; y: number }>>({});

  const handleDragStart = (event: KonvaEventObject<DragEvent>) => {
    if (isSelected) {
      const stage = event.target.getStage();
      if (!stage) return;

      dragStartPos.current = { x: event.target.x(), y: event.target.y() };

      const selectedIds = useCanvasStore.getState().selection.ids;
      const positions: Record<string, { x: number; y: number }> = {};

      selectedIds.forEach((id) => {
        const node = stage.findOne('#' + id);
        if (node) {
          positions[id] = { x: node.x(), y: node.y() };
        }
      });

      initialPositions.current = positions;
    }
  };

  const handleDragMove = (event: KonvaEventObject<DragEvent>) => {
    if (!isSelected || !dragStartPos.current) return;

    const selectedIds = useCanvasStore.getState().selection.ids;
    if (selectedIds.length <= 1) return;

    const dx = event.target.x() - dragStartPos.current.x;
    const dy = event.target.y() - dragStartPos.current.y;

    const stage = event.target.getStage();
    if (!stage) return;

    selectedIds.forEach((id) => {
      if (id !== node.id) {
        const shape = stage.findOne('#' + id);
        const initial = initialPositions.current[id];
        if (shape && initial) {
          shape.x(initial.x + dx);
          shape.y(initial.y + dy);
        }
      }
    });
  };

  const handleDragEnd = (event: KonvaEventObject<DragEvent>) => {
    if (!dragStartPos.current) {
      onDragEnd(node.id, event.target);
      return;
    }

    const dx = event.target.x() - dragStartPos.current.x;
    const dy = event.target.y() - dragStartPos.current.y;

    const selectedIds = useCanvasStore.getState().selection.ids;

    if (isSelected && selectedIds.length > 1) {
      useCanvasStore.getState().moveNodes(selectedIds, { x: dx, y: dy });
    } else {
      onDragEnd(node.id, event.target);
    }

    dragStartPos.current = null;
    initialPositions.current = {};
  };

  const commonProps = {
    key: node.id,
    id: node.id,
    x: (node.attrs as any).x,
    y: (node.attrs as any).y,
    listening: !node.locked,
    opacity: (node.attrs as any).opacity ?? 1,
    draggable: !node.locked,
    onMouseDown: onSelect,
    onDragStart: handleDragStart,
    onDragMove: handleDragMove,
    onDragEnd: handleDragEnd,
  };

  return children(commonProps);
}

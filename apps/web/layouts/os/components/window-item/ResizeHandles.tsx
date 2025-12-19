import { memo } from 'react';

type ResizeDirection =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

interface ResizeHandlesProps {
  onResizeStart: (e: React.PointerEvent, direction: ResizeDirection) => void;
  onResizeMove: (e: React.PointerEvent) => void;
  onResizeEnd: (e: React.PointerEvent) => void;
}

const HANDLE_SIZE = 4;
const CORNER_SIZE = 8;

export const ResizeHandles = memo(function ResizeHandles({
  onResizeStart,
  onResizeMove,
  onResizeEnd,
}: ResizeHandlesProps) {
  const handleProps = (direction: ResizeDirection) => ({
    onPointerDown: (e: React.PointerEvent) => onResizeStart(e, direction),
    onPointerMove: onResizeMove,
    onPointerUp: onResizeEnd,
    onPointerCancel: onResizeEnd,
  });

  return (
    <>
      {/* Edge handles */}
      <div
        className="absolute top-0 left-2 right-2 cursor-ns-resize"
        style={{ height: HANDLE_SIZE }}
        {...handleProps('top')}
      />
      <div
        className="absolute bottom-0 left-2 right-2 cursor-ns-resize"
        style={{ height: HANDLE_SIZE }}
        {...handleProps('bottom')}
      />
      <div
        className="absolute left-0 top-2 bottom-2 cursor-ew-resize"
        style={{ width: HANDLE_SIZE }}
        {...handleProps('left')}
      />
      <div
        className="absolute right-0 top-2 bottom-2 cursor-ew-resize"
        style={{ width: HANDLE_SIZE }}
        {...handleProps('right')}
      />

      {/* Corner handles */}
      <div
        className="absolute top-0 left-0 cursor-nwse-resize"
        style={{ width: CORNER_SIZE, height: CORNER_SIZE }}
        {...handleProps('topLeft')}
      />
      <div
        className="absolute top-0 right-0 cursor-nesw-resize"
        style={{ width: CORNER_SIZE, height: CORNER_SIZE }}
        {...handleProps('topRight')}
      />
      <div
        className="absolute bottom-0 left-0 cursor-nesw-resize"
        style={{ width: CORNER_SIZE, height: CORNER_SIZE }}
        {...handleProps('bottomLeft')}
      />
      <div
        className="absolute bottom-0 right-0 cursor-nwse-resize"
        style={{ width: CORNER_SIZE, height: CORNER_SIZE }}
        {...handleProps('bottomRight')}
      />
    </>
  );
});

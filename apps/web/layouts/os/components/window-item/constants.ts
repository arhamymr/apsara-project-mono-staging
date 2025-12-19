import type { CSSProperties } from 'react';

export const RESIZE_HANDLE_STYLES: Record<string, CSSProperties> = {
  bottom: { cursor: 'ns-resize', height: '4px' },
  right: { cursor: 'ew-resize', width: '4px' },
  bottomRight: { cursor: 'nwse-resize', width: '8px', height: '8px' },
  bottomLeft: { cursor: 'nesw-resize', width: '8px', height: '8px' },
  topRight: { cursor: 'nesw-resize', width: '8px', height: '8px' },
  topLeft: { cursor: 'nwse-resize', width: '8px', height: '8px' },
  top: { cursor: 'ns-resize', height: '4px' },
  left: { cursor: 'ew-resize', width: '4px' },
};

export const RESIZE_HANDLE_CLASSES = {
  bottom: 'resize-handle-bottom',
  right: 'resize-handle-right',
  bottomRight: 'resize-handle-corner',
  bottomLeft: 'resize-handle-corner',
  topRight: 'resize-handle-corner',
  topLeft: 'resize-handle-corner',
  top: 'resize-handle-top',
  left: 'resize-handle-left',
};

export const MIN_WINDOW_WIDTH = 320;
export const MIN_WINDOW_HEIGHT = 200;
export const ANIMATION_DURATION = 300;

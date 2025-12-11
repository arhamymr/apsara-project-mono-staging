import { useWindowContext } from '@/layouts/os/WindowContext';
import { WindowPortalProvider } from '@/layouts/os/WindowPortalContext';
import { memo, useRef, type RefObject } from 'react';
import { Rnd } from 'react-rnd';
import type { WinState } from '../../types';
import {
  MIN_WINDOW_HEIGHT,
  MIN_WINDOW_WIDTH,
  RESIZE_HANDLE_CLASSES,
  RESIZE_HANDLE_STYLES,
} from './constants';
import { useDeviceDetection } from './hooks/useDeviceDetection';
import { useWindowDrag } from './hooks/useWindowDrag';
import { WindowContent } from './WindowContent';
import { WindowContextMenu } from './WindowContextMenu';

function getWindowTitle(win: WinState, windows: WinState[]): string {
  if (win.sub && win.parentId) {
    const parent = windows.find((w) => w.id === win.parentId);
    return `${parent?.title ?? 'Window'} / ${win.title}`;
  }
  return win.title;
}

const WindowItem = memo(function WindowItem({ win }: { win: WinState }) {
  const { windows, activeId, closeWindow, minimizeWindow, toggleMaximizeWindow, focusWindow } =
    useWindowContext();

  const portalContainerRef = useRef<HTMLDivElement>(null);
  const isLowSpecDevice = useDeviceDetection();
  const active = activeId === win.id;

  const {
    isAnimating,
    handleDragStart,
    handleDrag,
    handleDragStop,
    handleResizeStart,
    handleResizeStop,
    handleFocus,
  } = useWindowDrag({ windowId: win.id, width: win.w, height: win.h });

  const rndStyle = {
    position: 'fixed' as const,
    zIndex: win.minimized ? -1 : win.z + 333,
    transition: isAnimating && !isLowSpecDevice ? 'transform 0.3s ease-out' : 'none',
    transform: `translate(${win.x}px, ${win.y}px)`,
    left: 0,
    top: 0,
    willChange: isLowSpecDevice ? 'auto' : 'transform',
    visibility: win.minimized ? ('hidden' as const) : ('visible' as const),
    pointerEvents: win.minimized ? ('none' as const) : ('auto' as const),
  };

  return (
    <WindowPortalProvider value={portalContainerRef as RefObject<HTMLElement>}>
      <Rnd
        position={{ x: win.x, y: win.y }}
        size={{ width: win.w, height: win.h }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        dragHandleClassName="window-drag-handle"
        disableDragging={win.maximized || win.minimized}
        enableResizing={!win.maximized && !win.minimized}
        minWidth={MIN_WINDOW_WIDTH}
        minHeight={MIN_WINDOW_HEIGHT}
        resizeHandleStyles={RESIZE_HANDLE_STYLES}
        resizeHandleClasses={RESIZE_HANDLE_CLASSES}
        style={rndStyle}
        onMouseDown={handleFocus}
      >
        <WindowContextMenu
          maximized={win.maximized ?? false}
          onBringToFront={() => focusWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onToggleMaximize={() => toggleMaximizeWindow(win.id)}
          onClose={() => closeWindow(win.id)}
        >
          <WindowContent
            ref={portalContainerRef}
            title={getWindowTitle(win, windows)}
            active={active}
            isSub={!!win.sub}
            maximized={win.maximized ?? false}
            content={win.content}
            onMinimize={() => minimizeWindow(win.id)}
            onToggleMaximize={() => toggleMaximizeWindow(win.id)}
            onClose={() => closeWindow(win.id)}
          />
        </WindowContextMenu>
      </Rnd>
    </WindowPortalProvider>
  );
});

export default WindowItem;

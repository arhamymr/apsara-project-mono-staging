import { useIsWindowActive, useParentWindowTitle } from '@/layouts/os/WindowStateContext';
import { useWindowActions } from '@/layouts/os/WindowActionsContext';
import { WindowPortalProvider } from '@/layouts/os/WindowPortalContext';
import { memo, useCallback, useMemo, useRef, type RefObject } from 'react';
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

interface WindowItemProps {
  win: WinState;
}

/**
 * Optimized WindowItem component that:
 * 1. Uses split contexts to minimize re-renders
 * 2. Memoizes callbacks and computed values
 * 3. Only subscribes to relevant state changes
 */
const WindowItem = memo(function WindowItem({ win }: WindowItemProps) {
  // Use split contexts - actions are stable, state is selective
  const { closeWindow, minimizeWindow, toggleMaximizeWindow, focusWindow } = useWindowActions();
  
  // Selective state subscriptions
  const active = useIsWindowActive(win.id);
  const parentTitle = useParentWindowTitle(win.parentId);

  const portalContainerRef = useRef<HTMLDivElement>(null);
  const isLowSpecDevice = useDeviceDetection();

  const {
    isAnimating,
    handleDragStart,
    handleDrag,
    handleDragStop,
    handleResizeStart,
    handleResizeStop,
    handleFocus,
  } = useWindowDrag({ windowId: win.id, width: win.w, height: win.h });

  const isMaximized = win.maximized ?? false;

  // Memoize window title computation
  const windowTitle = useMemo(() => {
    if (win.sub && win.parentId) {
      return `${parentTitle ?? 'Window'} / ${win.title}`;
    }
    return win.title;
  }, [win.sub, win.parentId, win.title, parentTitle]);

  // Memoize style object to prevent re-creation
  const rndStyle = useMemo(() => ({
    position: 'fixed' as const,
    zIndex: win.z + 333,
    transition: isAnimating && !isLowSpecDevice ? 'transform 0.3s ease-out' : 'none',
    transform: isMaximized ? 'none' : `translate(${win.x}px, ${win.y}px)`,
    left: isMaximized ? 0 : 0,
    top: isMaximized ? 0 : 0,
    right: isMaximized ? 0 : 'auto',
    bottom: isMaximized ? 0 : 'auto',
    width: isMaximized ? '100vw' : undefined,
    height: isMaximized ? '100vh' : undefined,
    willChange: isAnimating ? 'transform' : 'auto', // Only use willChange during animation
  }), [win.z, win.x, win.y, isMaximized, isAnimating, isLowSpecDevice]);

  // Memoize position and size objects
  const position = useMemo(
    () => (isMaximized ? { x: 0, y: 0 } : { x: win.x, y: win.y }),
    [isMaximized, win.x, win.y]
  );

  const size = useMemo(
    () => (isMaximized ? { width: '100vw', height: '100vh' } : { width: win.w, height: win.h }),
    [isMaximized, win.w, win.h]
  );

  // Memoize callbacks to prevent re-creation
  const handleBringToFront = useCallback(() => focusWindow(win.id), [focusWindow, win.id]);
  const handleMinimize = useCallback(() => minimizeWindow(win.id), [minimizeWindow, win.id]);
  const handleToggleMaximize = useCallback(() => toggleMaximizeWindow(win.id), [toggleMaximizeWindow, win.id]);
  const handleClose = useCallback(() => closeWindow(win.id), [closeWindow, win.id]);

  return (
    <WindowPortalProvider value={portalContainerRef as RefObject<HTMLElement>}>
      <Rnd
        position={position}
        size={size}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        dragHandleClassName="window-drag-handle"
        disableDragging={isMaximized}
        enableResizing={!isMaximized}
        minWidth={MIN_WINDOW_WIDTH}
        minHeight={MIN_WINDOW_HEIGHT}
        resizeHandleStyles={RESIZE_HANDLE_STYLES}
        resizeHandleClasses={RESIZE_HANDLE_CLASSES}
        style={rndStyle}
        onMouseDown={handleFocus}
      >
        <WindowContextMenu
          maximized={isMaximized}
          onBringToFront={handleBringToFront}
          onMinimize={handleMinimize}
          onToggleMaximize={handleToggleMaximize}
          onClose={handleClose}
        >
          <WindowContent
            ref={portalContainerRef}
            title={windowTitle}
            active={active}
            isSub={!!win.sub}
            maximized={isMaximized}
            content={win.content}
            onMinimize={handleMinimize}
            onToggleMaximize={handleToggleMaximize}
            onClose={handleClose}
          />
        </WindowContextMenu>
      </Rnd>
    </WindowPortalProvider>
  );
});

export default WindowItem;

// Re-export WindowList for convenience
export { WindowList } from './WindowList';

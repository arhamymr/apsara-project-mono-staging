import { useIsWindowActive, useParentWindowTitle } from '@/layouts/os/WindowStateContext';
import { useWindowActions } from '@/layouts/os/WindowActionsContext';
import { WindowPortalProvider } from '@/layouts/os/WindowPortalContext';
import { memo, useCallback, useMemo, useRef, type RefObject, type CSSProperties } from 'react';
import type { WinState } from '../../types';
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from './constants';
import { useDeviceDetection } from './hooks/useDeviceDetection';
import { useDndKitDrag } from './hooks/useDndKitDrag';
import { useWindowResize } from './hooks/useWindowResize';
import { ResizeHandles } from './ResizeHandles';
import { WindowContent } from './WindowContent';
import { WindowContextMenu } from './WindowContextMenu';

interface WindowItemProps {
  win: WinState;
}

/**
 * WindowItem component using CSS transforms for smooth 60fps dragging
 */
const WindowItem = memo(function WindowItem({ win }: WindowItemProps) {
  const { closeWindow, minimizeWindow, toggleMaximizeWindow, focusWindow } = useWindowActions();
  
  const active = useIsWindowActive(win.id);
  const parentTitle = useParentWindowTitle(win.parentId);

  const portalContainerRef = useRef<HTMLDivElement>(null);
  const isLowSpecDevice = useDeviceDetection();

  const isMaximized = win.maximized ?? false;

  // Drag handling with local offset for smooth movement
  const {
    isDragging,
    isAnimating,
    dragOffset,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleFocus,
  } = useDndKitDrag({
    windowId: win.id,
    x: win.x,
    y: win.y,
    width: win.w,
    height: win.h,
  });

  // Resize handling
  const {
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
  } = useWindowResize({
    windowId: win.id,
    x: win.x,
    y: win.y,
    width: win.w,
    height: win.h,
  });

  // Memoize window title computation
  const windowTitle = useMemo(() => {
    if (win.sub && win.parentId) {
      return `${parentTitle ?? 'Window'} / ${win.title}`;
    }
    return win.title;
  }, [win.sub, win.parentId, win.title, parentTitle]);

  // Memoize style object - use transform for GPU-accelerated movement
  const windowStyle = useMemo((): CSSProperties => {
    const shouldAnimate = isAnimating && !isLowSpecDevice;
    
    if (isMaximized) {
      return {
        position: 'fixed',
        zIndex: win.z + 333,
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        transform: 'none',
        transition: shouldAnimate ? 'all 0.3s ease-out' : 'none',
      };
    }

    // Use transform for drag offset (GPU accelerated, no layout thrashing)
    const translateX = dragOffset.x;
    const translateY = dragOffset.y;
    const hasOffset = translateX !== 0 || translateY !== 0;

    return {
      position: 'fixed',
      zIndex: win.z + 333,
      left: win.x,
      top: win.y,
      width: win.w,
      height: win.h,
      minWidth: MIN_WINDOW_WIDTH,
      minHeight: MIN_WINDOW_HEIGHT,
      // Use translate3d for GPU acceleration
      transform: hasOffset ? `translate3d(${translateX}px, ${translateY}px, 0)` : 'translate3d(0, 0, 0)',
      // Only animate when snapping back, not during drag
      transition: shouldAnimate ? 'left 0.3s ease-out, top 0.3s ease-out' : 'none',
      // Hint to browser for optimization during drag
      willChange: isDragging ? 'transform' : 'auto',
      touchAction: 'none',
      // Prevent content selection during drag
      userSelect: isDragging ? 'none' : 'auto',
    };
  }, [
    win.z,
    win.x,
    win.y,
    win.w,
    win.h,
    isMaximized,
    isAnimating,
    isLowSpecDevice,
    isDragging,
    dragOffset,
  ]);

  // Memoize callbacks
  const handleBringToFront = useCallback(() => focusWindow(win.id), [focusWindow, win.id]);
  const handleMinimize = useCallback(() => minimizeWindow(win.id), [minimizeWindow, win.id]);
  const handleToggleMaximize = useCallback(() => toggleMaximizeWindow(win.id), [toggleMaximizeWindow, win.id]);
  const handleClose = useCallback(() => closeWindow(win.id), [closeWindow, win.id]);

  return (
    <WindowPortalProvider value={portalContainerRef as RefObject<HTMLElement>}>
      <div
        style={windowStyle}
        onPointerDown={handleDragStart}
        onPointerMove={isDragging ? handleDragMove : undefined}
        onPointerUp={isDragging ? handleDragEnd : undefined}
        onPointerCancel={isDragging ? handleDragEnd : undefined}
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

        {/* Resize handles - only show when not maximized */}
        {!isMaximized && (
          <ResizeHandles
            onResizeStart={handleResizeStart}
            onResizeMove={handleResizeMove}
            onResizeEnd={handleResizeEnd}
          />
        )}
      </div>
    </WindowPortalProvider>
  );
});

export default WindowItem;

export { WindowList } from './WindowList';

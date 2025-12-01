import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@workspace/ui/components/context-menu';
import { useWindowContext } from '@/layouts/os/WindowContext';
import { WindowPortalProvider } from '@/layouts/os/WindowPortalContext';
import { cn } from '@/lib/utils';
import { memo, useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import type { WinState } from '../../types';
import { WindowTitleBar } from './WindowTitleBar';
import { useViewportSize } from './hooks/useViewportSize';

const WindowItem = memo(function WindowItem({ win }: { win: WinState }) {
  const {
    windows,
    activeId,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    setDraggingWindow,
    setResizingWindow,
  } = useWindowContext();
  const active = activeId === win.id;
  const portalContainerRef = useRef<HTMLDivElement | null>(null);
  const viewport = useViewportSize();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLowSpecDevice, setIsLowSpecDevice] = useState(false);

  // Detect low-spec devices
  useEffect(() => {
    // Simple performance detection based on device memory and cores
    const isLowSpec =
      (navigator.deviceMemory && navigator.deviceMemory < 4) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    setIsLowSpecDevice(!!isLowSpec);
  }, []);

  // Calculate edge positions for snapping
  const calculateEdgePosition = (
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    if (!viewport.width || !viewport.height) {
      return { x, y };
    }

    // Define minimum visible area (50% of window dimensions) when window is at edge
    const minVisibleWidth = width * 0.5;
    const minVisibleHeight = height * 0.5;

    // Calculate edge positions
    const leftEdge = -width + minVisibleWidth;
    const rightEdge = viewport.width - minVisibleWidth;
    const topEdge = 0; // Prevent windows from going above the top of screen
    const bottomEdge = viewport.height - minVisibleHeight;

    // Determine which edge to snap to based on current position
    let targetX = x;
    let targetY = y;

    // Check if window is outside viewport horizontally
    if (x + width < 0) {
      // Window is completely to the left of viewport, snap to left edge
      targetX = leftEdge;
    } else if (x > viewport.width) {
      // Window is completely to the right of viewport, snap to right edge
      targetX = rightEdge;
    }

    // Check if window is outside viewport vertically
    if (y + height < 0) {
      // Window is completely above viewport, snap to top edge (at y=0)
      targetY = topEdge;
    } else if (y > viewport.height) {
      // Window is completely below viewport, snap to bottom edge
      targetY = bottomEdge;
    }

    // Ensure window doesn't go above the top of the screen
    targetY = Math.max(0, targetY);

    return { x: targetX, y: targetY };
  };

  // Throttle drag updates for better performance
  const handleDrag = () => {
    // For now, we're not updating position during drag for performance
    // Position will be updated only on drag stop
  };

  const handleDragStop = (_event: unknown, data: { x: number; y: number }) => {
    // Calculate if the window should snap to an edge
    const edgePosition = calculateEdgePosition(data.x, data.y, win.w, win.h);

    if (edgePosition.x !== data.x || edgePosition.y !== data.y) {
      // Window is outside viewport, animate to edge position
      setIsAnimating(true);

      // Update position immediately to edge position
      updateWindowPosition(win.id, edgePosition.x, edgePosition.y);

      // Reset animation state after a short delay to allow animation to complete
      setTimeout(() => {
        setIsAnimating(false);
        setDraggingWindow(null);
      }, 300); // Match CSS transition duration
    } else {
      // Window is within viewport, just update position normally
      updateWindowPosition(win.id, data.x, data.y);
      setDraggingWindow(null);
    }
  };

  return (
    <WindowPortalProvider value={portalContainerRef}>
      <Rnd
        position={{ x: win.x, y: win.y }}
        size={{ width: win.w, height: win.h }}
        onDragStart={() => {
          focusWindow(win.id);
          setDraggingWindow(win.id);
        }}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onResizeStart={() => {
          focusWindow(win.id);
          setResizingWindow(win.id);
        }}
        onResizeStop={(_event, _direction, ref, _delta, position) => {
          updateWindowSize(
            win.id,
            parseInt(ref.style.width, 10),
            parseInt(ref.style.height, 10),
            position.x,
            position.y,
          );
          setResizingWindow(null);
        }}
        dragHandleClassName="window-drag-handle"
        disableDragging={win.maximized}
        enableResizing={!win.maximized}
        minWidth={320}
        minHeight={200}
        resizeHandleStyles={{
          bottom: { cursor: 'ns-resize', height: '4px' },
          right: { cursor: 'ew-resize', width: '4px' },
          bottomRight: { cursor: 'nwse-resize', width: '8px', height: '8px' },
          bottomLeft: { cursor: 'nesw-resize', width: '8px', height: '8px' },
          topRight: { cursor: 'nesw-resize', width: '8px', height: '8px' },
          topLeft: { cursor: 'nwse-resize', width: '8px', height: '8px' },
          top: { cursor: 'ns-resize', height: '4px' },
          left: { cursor: 'ew-resize', width: '4px' },
        }}
        resizeHandleClasses={{
          bottom: 'resize-handle-bottom',
          right: 'resize-handle-right',
          bottomRight: 'resize-handle-corner',
          bottomLeft: 'resize-handle-corner',
          topRight: 'resize-handle-corner',
          topLeft: 'resize-handle-corner',
          top: 'resize-handle-top',
          left: 'resize-handle-left',
        }}
        style={{
          zIndex: win.z + 333,
          transition:
            isAnimating && !isLowSpecDevice
              ? 'transform 0.3s ease-out'
              : 'none',
          transform: `translate(${win.x}px, ${win.y}px)`,
          left: 0,
          top: 0,
          willChange: isLowSpecDevice ? 'auto' : 'transform',
        }}
        onMouseDown={() => focusWindow(win.id)}
      >
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div
              ref={portalContainerRef}
              className={cn(
                'bg-muted @container flex h-full w-full flex-col overflow-hidden rounded-sm border transition-all select-none',
                active &&
                  (win.sub
                    ? 'ring-1 ring-amber-500/30 ring-offset-1 ring-offset-transparent'
                    : 'ring-1 ring-green-500/20 ring-offset-1 ring-offset-transparent'),
              )}
              aria-label={win.title}
            >
              <WindowTitleBar
                title={
                  win.sub && win.parentId
                    ? `${windows.find((w) => w.id === win.parentId)?.title ?? 'Window'} / ${win.title}`
                    : win.title
                }
                maximized={win.maximized ?? false}
                onMinimize={() => minimizeWindow(win.id)}
                onToggleMaximize={() => toggleMaximizeWindow(win.id)}
                onClose={() => closeWindow(win.id)}
              />
              <div className="bg-card flex-1 overflow-hidden">
                {win.content}
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-48">
            <ContextMenuItem onSelect={() => focusWindow(win.id)}>
              Bring to Front
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onSelect={() => minimizeWindow(win.id)}>
              Minimize
            </ContextMenuItem>
            {win.maximized ? (
              <ContextMenuItem onSelect={() => toggleMaximizeWindow(win.id)}>
                Restore
              </ContextMenuItem>
            ) : (
              <ContextMenuItem onSelect={() => toggleMaximizeWindow(win.id)}>
                Maximize
              </ContextMenuItem>
            )}
            <ContextMenuSeparator />
            <ContextMenuItem onSelect={() => closeWindow(win.id)}>
              Close
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Rnd>
    </WindowPortalProvider>
  );
});

export default WindowItem;

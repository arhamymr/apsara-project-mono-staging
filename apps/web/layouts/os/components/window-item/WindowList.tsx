'use client';

import { memo, useMemo } from 'react';
import { useWindowState } from '@/layouts/os/WindowStateContext';
import WindowItem from './index';

/**
 * Optimized window list component that:
 * 1. Memoizes the sorted windows array
 * 2. Only re-renders when windows array changes
 * 3. Filters out minimized windows at render time (not in state)
 */
export const WindowList = memo(function WindowList() {
  const { windows } = useWindowState();

  // Memoize sorted windows to prevent re-sorting on every render
  const sortedWindows = useMemo(
    () => [...windows].sort((a, b) => a.z - b.z),
    [windows]
  );

  // Filter visible windows (not minimized)
  const visibleWindows = useMemo(
    () => sortedWindows.filter((w) => !w.minimized),
    [sortedWindows]
  );

  return (
    <>
      {visibleWindows.map((w) => (
        <WindowItem key={w.id} win={w} />
      ))}
    </>
  );
});

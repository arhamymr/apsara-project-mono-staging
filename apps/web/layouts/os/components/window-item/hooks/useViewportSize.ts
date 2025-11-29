import { useEffect, useState } from 'react';

export type ViewportSize = {
  width: number;
  height: number;
};

export function useViewportSize(): ViewportSize {
  const [viewport, setViewport] = useState<ViewportSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  return viewport;
}

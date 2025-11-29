import { useEffect, useRef, useState } from 'react';

type Size = {
  width: number;
  height: number;
};

export function useCanvasSize(
  initialSize: Size = { width: 1200, height: 800 },
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<Size>(initialSize);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateSize = () => {
      setSize({ width: element.clientWidth, height: element.clientHeight });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { containerRef, size } as const;
}

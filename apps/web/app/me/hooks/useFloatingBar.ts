'use client';

import { useEffect, useRef, useState } from 'react';

export function useFloatingBar() {
  const [showFloatingBar, setShowFloatingBar] = useState(true);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setShowFloatingBar(!entry.isIntersecting);
        }
      },
      { threshold: 0.3 },
    );

    if (contactRef.current) {
      observer.observe(contactRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return { showFloatingBar, contactRef };
}

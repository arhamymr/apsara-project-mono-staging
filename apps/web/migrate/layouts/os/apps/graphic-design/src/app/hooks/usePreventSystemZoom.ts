import { useEffect } from 'react';

const PASSIVE_FALSE = { passive: false } as AddEventListenerOptions;

export function usePreventSystemZoom() {
  useEffect(() => {
    const preventGesture = (event: Event) => {
      event.preventDefault();
    };

    const preventWheelZoom = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };

    const gestureEvents = [
      'gesturestart',
      'gesturechange',
      'gestureend',
    ] as const;

    gestureEvents.forEach((eventName) => {
      window.addEventListener(
        eventName as unknown as keyof WindowEventMap,
        preventGesture,
        PASSIVE_FALSE,
      );
    });

    window.addEventListener('wheel', preventWheelZoom, PASSIVE_FALSE);

    return () => {
      gestureEvents.forEach((eventName) => {
        window.removeEventListener(
          eventName as unknown as keyof WindowEventMap,
          preventGesture,
        );
      });
      window.removeEventListener('wheel', preventWheelZoom);
    };
  }, []);
}

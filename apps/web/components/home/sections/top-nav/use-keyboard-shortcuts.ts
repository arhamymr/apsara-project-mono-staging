import { useEffect } from 'react';
import { WHATSAPP_URL } from './constants';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 't') window.open(WHATSAPP_URL, '_blank');
      if (key === 'g') window.location.href = '/login';
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

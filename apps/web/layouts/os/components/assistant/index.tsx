/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Asterisk } from 'lucide-react';
import { useCallback } from 'react';
import ChatAssistant from './chat';
import { useAssistant } from './hooks/useAssistant';

// ————————————————————————————————————————————————
// Component
// ————————————————————————————————————————————————
type StartMenuProps = {
  onOpenChange?: (open: boolean) => void;
};

export default function StartMenu({ onOpenChange }: StartMenuProps) {
  const { isOpen, setIsOpen, closeMenu, containerRef, panelRef } = useAssistant(
    { onOpenChange },
  );

  const handleCloseMenu = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  return (
    <div ref={containerRef} className="relative">
      {/* Assistant Button */}
      <Button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        variant={'outline'}
        size="sm"
        onClick={() => setIsOpen((v) => !v)}
        className="bg-muted gap-1 text-xs"
      >
        <Asterisk className="text-primary h-3 w-3 animate-pulse animate-spin" />
        Assistant
      </Button>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-[1001]" onClick={handleCloseMenu} />

          {/* Panel */}
          <div
            ref={panelRef}
            role="dialog"
            aria-label="AI Assistant"
            className="bg-background absolute bottom-[50px] -left-[100px] z-[1002] mb-3 w-[560px] overflow-hidden rounded-lg shadow-2xl"
          >
            <ChatAssistant />
          </div>
        </>
      )}
    </div>
  );
}

// end

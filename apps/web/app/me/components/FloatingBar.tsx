'use client';

import { Button } from '@workspace/ui/components/button';
import { Home, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { CONTACT_INFO } from '../data';

interface FloatingBarProps {
  show: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function FloatingBar({ show, isDark, onToggleTheme }: FloatingBarProps) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
        show
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-20 opacity-0'
      }`}
    >
      <div className="bg-background/80 border-border flex items-center gap-2 rounded-full border px-2 py-2 shadow-lg backdrop-blur-md">
        <Link
          href="/"
          className="hover:bg-muted rounded-full p-2.5 transition-colors"
          aria-label="Go to home"
        >
          <Home className="h-4 w-4" />
        </Link>
        <button
          onClick={onToggleTheme}
          className="hover:bg-muted rounded-full p-2.5 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
        <Button size="sm" className="rounded-full px-4" asChild>
          <a
            href={CONTACT_INFO.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get In Touch
          </a>
        </Button>
      </div>
    </div>
  );
}

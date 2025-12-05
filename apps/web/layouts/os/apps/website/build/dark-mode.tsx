'use client';

import { Button } from '@workspace/ui/components/button';
import { Moon, Sun } from 'lucide-react';
import { usePageTheme } from '../components/theme/page-theme';

function isDarkName(name: string) {
  return name === 'dark' || name.endsWith('-dark');
}
function toDark(name: string) {
  if (name === 'light') return 'dark';
  if (isDarkName(name)) return name; // already dark
  return `${name}-dark`; // use your baseline -dark rules
}
function toLight(name: string) {
  if (name === 'dark') return 'light';
  if (name.endsWith('-dark')) return name.replace(/-dark$/, '');
  return name; // already light variant
}

export function DarkModeSwitch() {
  const { theme, setTheme } = usePageTheme();
  const dark = isDarkName(theme);

  const toggleTheme = () => {
    const next = dark ? toLight(theme) : toDark(theme);
    setTheme(next);
  };

  // Keep DOM in sync if theme changes elsewhere in app
  // (optional but handy)
  // React.useEffect(() => applyThemeAttr(theme), [theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-md"
      aria-label={dark ? 'Switch to light' : 'Switch to dark'}
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

'use client';

import { useWindowContext } from '@/layouts/os/WindowContext';

export default function SettingsHubApp() {
  const { openAppById } = useWindowContext();

  const tiles = [
    {
      id: 'widget-manager',
      title: 'Widgets',
      emoji: '🧩',
    },
    {
      id: 'dock-manager',
      title: 'Dock',
      emoji: '📁',
    },
    {
      id: 'desktop-settings',
      title: 'Desktop',
      emoji: '🖥️',
    },
    {
      id: 'appearance',
      title: 'Appearance',
      emoji: '🎨',
    },
  ];

  return (
    <div className="h-full w-full p-6">
      <div className="mb-6 flex items-center gap-2">
        <span className="text-lg">⚙️</span>
        <h2 className="text-sm font-semibold opacity-80">Settings Hub</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {tiles.map(({ id, title, emoji }) => (
          <button
            key={id}
            onClick={() => openAppById(id)}
            className="group bg-muted/50 hover:border-primary hover:bg-muted flex cursor-pointer flex-col items-center justify-center rounded-xl border p-4 text-center shadow-sm transition hover:scale-[1.02]"
          >
            <span className="mb-2 text-3xl transition-transform group-hover:scale-110">
              {emoji}
            </span>
            <span className="text-sm font-medium opacity-80 group-hover:opacity-100">
              {title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

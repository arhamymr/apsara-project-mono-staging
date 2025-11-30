// import { useWindowContext } from '@/layouts/os/WindowContext';
// import { useCallback } from 'react';

export default function ChatHeader() {
  // const { apps, openApp } = useWindowContext();

  // const openSettings = useCallback(
  //   (appId?: string) => {
  //     const settings = appId
  //       ? apps.find((a) => a.id === appId)
  //       : apps.find((a) => a.id === 'settings-hub') ||
  //         apps.find((a) => a.id === 'desktop-settings') ||
  //         apps.find((a) => /settings/i.test(a.name));
  //     if (settings) openApp(settings);
  //   },
  //   [apps, openApp],
  // );

  return (
    <div className="flex w-full items-center justify-end gap-3 p-3">
      {/* User dropdown */}
      {/* <UserDropdown onOpenSettings={openSettings} /> */}
    </div>
  );
}

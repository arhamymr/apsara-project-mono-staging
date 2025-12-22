'use client';

import React from 'react';
import { useWindowContext } from '@/layouts/os/WindowContext';
import { BannerManager } from './components/banner-manager';
import CreateBannerWindow from './banner-create';
import EditBannerWindow from './banner-edit';
import type { Banner } from './types';

export default function BannersWindow() {
  const { openSubWindow, activeId, closeWindow, windows } = useWindowContext();

  const handleCreateBanner = () => {
    if (!activeId) return;
    openSubWindow(activeId, {
      title: 'New Banner',
      content: <CreateBannerWindow onCreated={() => {
        // Close the sub-window after creation
        const windowToClose = windows.find(w => w.title === 'New Banner' && w.parentId === activeId);
        if (windowToClose) {
          closeWindow(windowToClose.id);
        }
      }} />,
      width: 720,
      height: 600,
    });
  };

  const handleEditBanner = (banner: Banner) => {
    if (!activeId) return;
    const title = `Edit: ${banner.title}`;
    openSubWindow(activeId, {
      title,
      content: <EditBannerWindow 
        id={banner._id} 
        onUpdated={() => {
          // Close the sub-window after update
          const windowToClose = windows.find(w => w.title === title && w.parentId === activeId);
          if (windowToClose) {
            closeWindow(windowToClose.id);
          }
        }}
        onClose={() => {
          // Handle explicit close (e.g., after delete)
          const windowToClose = windows.find(w => w.title === title && w.parentId === activeId);
          if (windowToClose) {
            closeWindow(windowToClose.id);
          }
        }}
      />,
      width: 720,
      height: 600,
    });
  };

  return (
    <div className="text-foreground flex h-full flex-col">
      {/* Header */}
      <div className="bg-card sticky top-0 flex w-full items-center justify-between gap-2 border-b px-4 py-3">
        <h2 className="text-base font-semibold">Banner Management</h2>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-4xl">
          <BannerManager
            onCreateBanner={handleCreateBanner}
            onEditBanner={handleEditBanner}
          />
        </div>
      </div>
    </div>
  );
}

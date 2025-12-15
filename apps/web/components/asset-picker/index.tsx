/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { useWindowPortalContainer } from '@/layouts/os/WindowPortalContext';
import * as React from 'react';

import { FinderTab } from './finder-tab';
import type { Props, UnsplashPhoto } from './types';
import { UnsplashTab } from './unsplash-tab';

export function AssetPicker({
  open,
  onOpenChange,
  onSelect,
  kindFilter,
  onSelectUnsplash,
}: Props) {
  const [activeTab, setActiveTab] = React.useState<'finder' | 'unsplash'>(
    'finder',
  );

  const portalContainerRef = useWindowPortalContainer();
  const portalContainer = portalContainerRef?.current ?? undefined;

  const handlePickFinder = (url: string) => {
    onSelect(url);
    onOpenChange(false);
  };

  const handlePickUnsplash = (photo: UnsplashPhoto) => {
    if (onSelectUnsplash) {
      onSelectUnsplash(photo);
    } else {
      onSelect(photo.urls.full);
    }
    // keep dialog open (same behavior as original)
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl p-0"
        portalContainer={portalContainer}
      >
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-base">Select Assets</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <div className="px-4 pb-3">
            <TabsList>
              <TabsTrigger value="finder">Finder</TabsTrigger>
              <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
            </TabsList>
          </div>

          <FinderTab
            open={open}
            kindFilter={kindFilter}
            onSelectUrl={handlePickFinder}
            onClose={() => onOpenChange(false)}
          />

          <UnsplashTab
            open={open}
            active={activeTab === 'unsplash'}
            onPick={handlePickUnsplash}
          />

          {/* bottom actions (consistent close control across tabs) */}
          <TabsContent value={activeTab} className="mt-0">
            <div className="mt-3 mb-3 flex justify-end px-4">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

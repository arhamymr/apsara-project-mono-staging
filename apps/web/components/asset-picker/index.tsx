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
        className="max-w-6xl h-[90vh] p-0 flex flex-col"
        portalContainer={portalContainer}
      >
        <DialogHeader className="px-6 pt-6 pb-3 flex-shrink-0">
          <DialogTitle className="text-lg font-semibold">Select Assets</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 pb-4 flex-shrink-0">
            <TabsList>
              <TabsTrigger value="finder">Finder</TabsTrigger>
              <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden px-6">
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
          </div>

          {/* bottom actions (consistent close control across tabs) */}
          <TabsContent value={activeTab} className="mt-0 flex-shrink-0">
            <div className="mt-4 mb-6 flex justify-end px-6">
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

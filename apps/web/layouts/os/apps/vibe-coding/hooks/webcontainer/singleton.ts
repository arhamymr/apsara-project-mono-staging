'use client';

import { WebContainer } from '@webcontainer/api';

// Singleton WebContainer instance (only one allowed per page)
let webcontainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;
let bootFailed = false;

export async function getWebContainer(): Promise<WebContainer> {
  if (webcontainerInstance) return webcontainerInstance;

  if (bootFailed) {
    throw new Error('WebContainer boot previously failed. Refresh the page to retry.');
  }

  if (bootPromise) {
    return bootPromise;
  }

  bootPromise = WebContainer.boot()
    .then((instance) => {
      webcontainerInstance = instance;
      return instance;
    })
    .catch((err) => {
      bootFailed = true;
      bootPromise = null;
      throw err;
    });

  return bootPromise;
}

export function resetWebContainer(): void {
  webcontainerInstance = null;
  bootPromise = null;
  bootFailed = false;
}

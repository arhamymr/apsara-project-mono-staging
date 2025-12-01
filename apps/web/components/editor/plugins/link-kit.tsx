'use client';

import { LinkPlugin } from '@platejs/link/react';

import { LinkElement } from '@workspace/ui/components/link-node';
import { LinkFloatingToolbar } from '@workspace/ui/components/link-toolbar';

export const LinkKit = [
  LinkPlugin.configure({
    render: {
      node: LinkElement,
      afterEditable: () => <LinkFloatingToolbar />,
    },
  }),
];

'use client';

import { createPlatePlugin } from 'platejs/react';

export const FixedToolbarKit = [
  createPlatePlugin({
    key: 'fixed-toolbar',
    render: {
      beforeEditable: () => (
        <div className="flex gap-1 border-b p-2">
          {/* Toolbar buttons placeholder */}
        </div>
      ),
    },
  }),
];

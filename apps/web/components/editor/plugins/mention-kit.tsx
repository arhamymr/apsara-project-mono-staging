'use client';

import type { AnyPluginConfig } from 'platejs';

import { MentionInputPlugin, MentionPlugin } from '@platejs/mention/react';

import {
  MentionElement,
  MentionInputElement,
} from '@workspace/ui/components/mention-node';

export const MentionKit: AnyPluginConfig[] = [
  MentionPlugin.configure({
    options: { triggerPreviousCharPattern: /^$|^[\s"']$/ },
  }).withComponent(MentionElement),
  MentionInputPlugin.withComponent(MentionInputElement),
];

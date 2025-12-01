import type { AnyPluginConfig } from 'platejs';

import { BaseMentionPlugin } from '@platejs/mention';

import { MentionElementStatic } from '@workspace/ui/components/mention-node-static';

export const BaseMentionKit: AnyPluginConfig[] = [
  BaseMentionPlugin.withComponent(MentionElementStatic),
];

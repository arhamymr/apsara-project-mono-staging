'use client';

import emojiMartData from '@emoji-mart/data';
import { EmojiInputPlugin, EmojiPlugin } from '@platejs/emoji/react';

import { EmojiInputElement } from '@workspace/ui/components/emoji-node';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EmojiKit: any[] = [
  EmojiPlugin.configure({
    options: { data: emojiMartData as any },
  }),
  EmojiInputPlugin.withComponent(EmojiInputElement),
];

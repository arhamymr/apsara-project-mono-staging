'use client';

import type { TComment } from '@workspace/ui/components/comment';

import { createPlatePlugin } from 'platejs/react';

import { BlockDiscussion } from '@workspace/ui/components/block-discussion';

export interface TDiscussion {
  id: string;
  comments: TComment[];
  createdAt: Date;
  isResolved: boolean;
  userId: string;
  documentContent?: string;
}

const discussionsData: TDiscussion[] = [
  {
    id: 'discussion1',
    comments: [
      {
        id: 'comment1',
        value: 'Comments are a great way to provide feedback and discuss changes.',
        createdAt: Date.now() - 600_000,
        userId: 'charlie',
      },
      {
        id: 'comment2',
        value: 'Agreed! The link to the docs makes it easy to learn more.',
        createdAt: Date.now() - 500_000,
        userId: 'bob',
      },
    ],
    createdAt: new Date(),
    documentContent: 'comments',
    isResolved: false,
    userId: 'charlie',
  },
  {
    id: 'discussion2',
    comments: [
      {
        id: 'comment1',
        value: 'Nice demonstration of overlapping annotations with both comments and suggestions!',
        createdAt: Date.now() - 300_000,
        userId: 'bob',
      },
      {
        id: 'comment2',
        value: 'This helps users understand how powerful the editor can be.',
        createdAt: Date.now() - 200_000,
        userId: 'charlie',
      },
    ],
    createdAt: new Date(),
    documentContent: 'overlapping',
    isResolved: false,
    userId: 'bob',
  },
];

const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/glass/svg?seed=${seed}`;

const usersData: Record<
  string,
  { id: string; avatarUrl: string; name: string; hue?: number }
> = {
  alice: {
    id: 'alice',
    avatarUrl: avatarUrl('alice6'),
    name: 'Alice',
  },
  bob: {
    id: 'bob',
    avatarUrl: avatarUrl('bob4'),
    name: 'Bob',
  },
  charlie: {
    id: 'charlie',
    avatarUrl: avatarUrl('charlie2'),
    name: 'Charlie',
  },
};

// This plugin is purely UI. It's only used to store the discussions and users data
export const discussionPlugin = createPlatePlugin({
  key: 'discussion',
  options: {
    currentUserId: 'alice',
    discussions: discussionsData,
    users: usersData,
  },
})
  .configure({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: { aboveNodes: BlockDiscussion as any },
  })
  .extendSelectors(({ getOption }) => ({
    currentUser: () => getOption('users')[getOption('currentUserId')],
    user: (id: string) => getOption('users')[id],
  }));

export const DiscussionKit = [discussionPlugin];

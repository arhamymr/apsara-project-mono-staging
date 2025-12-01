import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from '@workspace/ui/components/context-menu';

type GroupLite = { id: string; label: string };

type Props = {
  appId: string;
  shortcutId: string;
  label: string;
  isPinned: boolean;
  groups: GroupLite[];
  onOpen: (appId: string) => void;
  onPin: () => void;
  onUnpin: () => void;
  onAddToGroup: (shortcutId: string, groupId: string) => void;
  onCreateGroupWith: (label: string, ids: string[]) => void;
};

export default function AppContextMenu({
  appId,
  shortcutId,
  label,
  isPinned,
  groups,
  onOpen,
  onPin,
  onUnpin,
  onAddToGroup,
  onCreateGroupWith,
}: Props) {
  return (
    <ContextMenuContent className="w-56">
      <ContextMenuItem onSelect={() => onOpen(appId)}>
        Open {label}
      </ContextMenuItem>
      <ContextMenuSeparator />
      {isPinned ? (
        <ContextMenuItem onSelect={onUnpin}>Unpin from Dock</ContextMenuItem>
      ) : (
        <ContextMenuItem onSelect={onPin}>Pin to Dock</ContextMenuItem>
      )}
      <ContextMenuSeparator />
      {groups.length ? (
        groups.map((g) => (
          <ContextMenuItem
            key={g.id}
            onSelect={() => onAddToGroup(shortcutId, g.id)}
          >
            Add to "{g.label}"
          </ContextMenuItem>
        ))
      ) : (
        <ContextMenuItem disabled>No groups yet</ContextMenuItem>
      )}
      <ContextMenuItem
        onSelect={() => onCreateGroupWith('Group', [shortcutId])}
      >
        New Group with this
      </ContextMenuItem>
    </ContextMenuContent>
  );
}

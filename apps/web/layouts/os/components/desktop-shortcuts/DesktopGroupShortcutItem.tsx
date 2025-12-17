import { ContextMenu, ContextMenuTrigger } from '@workspace/ui/components/context-menu';
import GroupContextMenu from '@/layouts/os/components/desktop-shortcuts/GroupContextMenu';
import GroupCard from '@/layouts/os/components/group-card';
import type { DesktopGroup } from '@/layouts/os/types';
import { memo } from 'react';

type Props = {
  item: DesktopGroup;
  onOpenGroup: (id: string, e?: React.MouseEvent<HTMLElement>) => void;
  onUngroup: (id: string) => void;
  dropHint?: boolean;
};

const DesktopGroupShortcutItem = memo(function DesktopGroupShortcutItem({
  item,
  onOpenGroup,
  onUngroup,
  dropHint,
}: Props) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div onClick={(e) => onOpenGroup(item.id, e)}>
          <GroupCard
            id={item.id}
            label={item.label}
            childrenApps={item.children}
            onOpenGroup={() => onOpenGroup(item.id)}
            dropHint={dropHint}
          />
        </div>
      </ContextMenuTrigger>
      <GroupContextMenu
        id={item.id}
        label={item.label}
        onOpen={() => onOpenGroup(item.id)}
        onUngroup={onUngroup}
      />
    </ContextMenu>
  );
});

export default DesktopGroupShortcutItem;

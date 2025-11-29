import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import DesktopIcon from '@/layouts/os/components/desktop-icon';
import AppContextMenu from '@/layouts/os/components/desktop-shortcuts/AppContextMenu';
import type { DesktopAppShortcut } from '@/layouts/os/types';

type GroupLite = { id: string; label: string };

type Props = {
  item: DesktopAppShortcut;
  isPinned: boolean;
  groups: GroupLite[];
  onOpenApp: (appId: string) => void;
  onPin: () => void;
  onUnpin: () => void;
  onAddToGroup: (shortcutId: string, groupId: string) => void;
  onCreateGroupWith: (label: string, ids: string[]) => void;
};

export default function DesktopAppShortcutItem({
  item,
  isPinned,
  groups,
  onOpenApp,
  onPin,
  onUnpin,
  onAddToGroup,
  onCreateGroupWith,
}: Props) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div>
          <DesktopIcon
            id={item.id}
            icon={item.icon}
            label={item.label}
            onOpen={() => onOpenApp(item.appId)}
          />
        </div>
      </ContextMenuTrigger>
      <AppContextMenu
        appId={item.appId}
        shortcutId={item.id}
        label={item.label}
        isPinned={isPinned}
        groups={groups}
        onOpen={onOpenApp}
        onPin={onPin}
        onUnpin={onUnpin}
        onAddToGroup={onAddToGroup}
        onCreateGroupWith={onCreateGroupWith}
      />
    </ContextMenu>
  );
}

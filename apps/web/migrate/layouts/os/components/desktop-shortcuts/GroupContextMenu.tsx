import {
  ContextMenuContent,
  ContextMenuItem,
} from '@/components/ui/context-menu';

type Props = {
  id: string;
  label: string;
  onOpen: () => void;
  onUngroup: (id: string) => void;
};

export default function GroupContextMenu({
  id,
  label,
  onOpen,
  onUngroup,
}: Props) {
  return (
    <ContextMenuContent className="w-48">
      <ContextMenuItem onSelect={onOpen}>Open</ContextMenuItem>
      <ContextMenuItem onSelect={() => onUngroup(id)}>Ungroup</ContextMenuItem>
    </ContextMenuContent>
  );
}

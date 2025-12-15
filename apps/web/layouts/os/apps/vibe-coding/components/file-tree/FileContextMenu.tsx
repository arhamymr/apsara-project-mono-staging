import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@workspace/ui/components/context-menu';
import { Copy, FileText, Folder } from 'lucide-react';
import { toast } from 'sonner';

interface FileContextMenuProps {
  children: React.ReactNode;
  path: string;
  type: 'file' | 'folder';
  name: string;
}

export function FileContextMenu({ children, path, type, name }: FileContextMenuProps) {
  const copyPath = () => {
    navigator.clipboard.writeText(path);
    toast.success('Path copied to clipboard');
  };

  const copyName = () => {
    navigator.clipboard.writeText(name);
    toast.success('Name copied to clipboard');
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={copyPath}>
          <Copy size={14} className="mr-2" />
          Copy Path
        </ContextMenuItem>
        <ContextMenuItem onClick={copyName}>
          {type === 'folder' ? (
            <Folder size={14} className="mr-2" />
          ) : (
            <FileText size={14} className="mr-2" />
          )}
          Copy Name
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled className="text-xs text-muted-foreground">
          {path}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

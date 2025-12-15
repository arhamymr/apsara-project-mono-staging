import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { FileContextMenu } from './FileContextMenu';
import type { DirDivProps } from './types';

interface DirDivComponentProps extends DirDivProps {
  renderChildren: () => React.ReactNode;
}

export function DirDiv({
  node,
  onFolderToggle,
  path,
  depth,
  renderChildren,
}: DirDivComponentProps) {
  const currentPath = [...path, node.name];
  const fullPath = currentPath.join('/');
  const isExpanded = node.expanded ?? false;

  return (
    <div>
      <FileContextMenu path={fullPath} type="folder" name={node.name}>
        <div
          className="hover:bg-muted flex cursor-pointer items-center gap-1 py-1 pr-2"
          style={{ paddingLeft: `${depth * 16}px` }}
          onClick={() => onFolderToggle(currentPath)}
        >
          {isExpanded ? (
            <ChevronDown size={16} className="text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight size={16} className="text-muted-foreground shrink-0" />
          )}
          {isExpanded ? (
            <FolderOpen size={16} className="text-primary shrink-0" />
          ) : (
            <Folder size={16} className="text-primary shrink-0" />
          )}
          <span className="text-sm truncate">{node.name}</span>
        </div>
      </FileContextMenu>
      {isExpanded && node.children && renderChildren()}
    </div>
  );
}

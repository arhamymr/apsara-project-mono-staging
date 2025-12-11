import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { SubTree } from './SubTree';
import { isChildSelected } from './utils';
import type { DirDivProps } from './types';

export function DirDiv({
  node,
  selectedFile,
  onFileSelect,
  onFolderToggle,
  path,
  depth,
}: DirDivProps) {
  const currentPath = [...path, node.name];
  const shouldAutoExpand = isChildSelected(node.children, selectedFile, path);
  const isExpanded = node.expanded || shouldAutoExpand;

  return (
    <div>
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
          <FolderOpen size={16} className="text-amber-500 shrink-0" />
        ) : (
          <Folder size={16} className="text-amber-500 shrink-0" />
        )}
        <span className="text-sm truncate">{node.name}</span>
      </div>
      {isExpanded && node.children && (
        <SubTree
          nodes={node.children}
          selectedFile={selectedFile}
          onFileSelect={onFileSelect}
          onFolderToggle={onFolderToggle}
          path={currentPath}
          depth={depth + 1}
        />
      )}
    </div>
  );
}

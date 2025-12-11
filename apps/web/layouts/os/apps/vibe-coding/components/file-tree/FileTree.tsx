import { SubTree } from './SubTree';
import type { FileTreeProps } from './types';

export function FileTree({
  nodes,
  selectedFile,
  onFileSelect,
  onFolderToggle,
}: FileTreeProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <SubTree
          nodes={nodes}
          selectedFile={selectedFile}
          onFileSelect={onFileSelect}
          onFolderToggle={onFolderToggle}
          depth={1}
        />
      </div>
    </div>
  );
}

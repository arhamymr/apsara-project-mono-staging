import { ChevronDown, ChevronRight, File, Folder } from 'lucide-react';

export type FileNode = {
  name: string;
  type: 'file' | 'folder';
  expanded?: boolean;
  children?: FileNode[];
};

interface FileTreeProps {
  nodes: FileNode[];
  selectedFile: string;
  onFileSelect: (path: string) => void;
  onFolderToggle: (path: string[]) => void;
  path?: string[];
}

export function FileTree({
  nodes,
  selectedFile,
  onFileSelect,
  onFolderToggle,
  path = [],
}: FileTreeProps) {
  return (
    <>
      {nodes.map((node) => {
        const currentPath = [...path, node.name];
        const fullPath = currentPath.join('/');

        if (node.type === 'folder') {
          return (
            <div key={fullPath}>
              <div
                className="hover:bg-muted flex cursor-pointer items-center gap-1 px-2 py-1"
                onClick={() => onFolderToggle(currentPath)}
              >
                {node.expanded ? (
                  <ChevronDown size={16} className="text-muted-foreground" />
                ) : (
                  <ChevronRight size={16} className="text-muted-foreground" />
                )}
                <Folder size={16} className="text-primary" />
                <span className="text-sm">{node.name}</span>
              </div>
              {node.expanded && node.children && (
                <div className="ml-4">
                  <FileTree
                    nodes={node.children}
                    selectedFile={selectedFile}
                    onFileSelect={onFileSelect}
                    onFolderToggle={onFolderToggle}
                    path={currentPath}
                  />
                </div>
              )}
            </div>
          );
        }

        return (
          <div
            key={fullPath}
            className={`hover:bg-muted ml-4 flex cursor-pointer items-center gap-1 px-2 py-1 ${
              selectedFile === fullPath ? 'bg-muted' : ''
            }`}
            onClick={() => onFileSelect(fullPath)}
          >
            <File size={16} className="text-muted-foreground" />
            <span className="text-sm">{node.name}</span>
          </div>
        );
      })}
    </>
  );
}

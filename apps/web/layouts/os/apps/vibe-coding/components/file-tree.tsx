import {
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  File,
  FileCode,
  FileCode2,
  FileImage,
  FileJson,
  FileText,
  FileType,
  Folder,
  FolderOpen,
  Settings,
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';

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
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  path?: string[];
  showControls?: boolean;
}

// Get file icon based on extension
function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  // TypeScript/JavaScript
  if (['ts', 'tsx'].includes(ext)) {
    return <FileCode2 size={16} className="text-blue-500" />;
  }
  if (['js', 'jsx', 'mjs', 'cjs'].includes(ext)) {
    return <FileCode2 size={16} className="text-yellow-500" />;
  }
  
  // Web files
  if (['html', 'htm'].includes(ext)) {
    return <FileCode size={16} className="text-orange-500" />;
  }
  if (['css', 'scss', 'sass', 'less'].includes(ext)) {
    return <FileCode size={16} className="text-purple-500" />;
  }
  
  // Data/Config files
  if (ext === 'json') {
    return <FileJson size={16} className="text-yellow-600" />;
  }
  if (['yaml', 'yml', 'toml'].includes(ext)) {
    return <Settings size={16} className="text-gray-500" />;
  }
  
  // Images
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(ext)) {
    return <FileImage size={16} className="text-green-500" />;
  }
  
  // Text/Docs
  if (['md', 'mdx', 'txt', 'readme'].includes(ext)) {
    return <FileText size={16} className="text-gray-400" />;
  }
  
  // Python
  if (ext === 'py') {
    return <FileCode2 size={16} className="text-green-600" />;
  }
  
  // Other code files
  if (['php', 'rb', 'go', 'rs', 'java', 'c', 'cpp', 'h', 'hpp'].includes(ext)) {
    return <FileCode size={16} className="text-blue-400" />;
  }
  
  // Config files by name
  if (filename.startsWith('.') || ['config', 'rc'].some(s => filename.includes(s))) {
    return <Settings size={16} className="text-gray-500" />;
  }
  
  // Font files
  if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(ext)) {
    return <FileType size={16} className="text-pink-500" />;
  }
  
  // Default
  return <File size={16} className="text-muted-foreground" />;
}

function FileTreeNode({
  node,
  selectedFile,
  onFileSelect,
  onFolderToggle,
  path = [],
}: {
  node: FileNode;
  selectedFile: string;
  onFileSelect: (path: string) => void;
  onFolderToggle: (path: string[]) => void;
  path?: string[];
}) {
  const currentPath = [...path, node.name];
  const fullPath = currentPath.join('/');

  if (node.type === 'folder') {
    return (
      <div>
        <div
          className="hover:bg-muted flex cursor-pointer items-center gap-1 px-2 py-1"
          onClick={() => onFolderToggle(currentPath)}
        >
          {node.expanded ? (
            <ChevronDown size={16} className="text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight size={16} className="text-muted-foreground shrink-0" />
          )}
          {node.expanded ? (
            <FolderOpen size={16} className="text-amber-500 shrink-0" />
          ) : (
            <Folder size={16} className="text-amber-500 shrink-0" />
          )}
          <span className="text-sm truncate">{node.name}</span>
        </div>
        {node.expanded && node.children && (
          <div className="ml-4">
            {node.children.map((child) => (
              <FileTreeNode
                key={[...currentPath, child.name].join('/')}
                node={child}
                selectedFile={selectedFile}
                onFileSelect={onFileSelect}
                onFolderToggle={onFolderToggle}
                path={currentPath}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`hover:bg-muted ml-4 flex cursor-pointer items-center gap-1 px-2 py-1 ${
        selectedFile === fullPath ? 'bg-muted' : ''
      }`}
      onClick={() => onFileSelect(fullPath)}
    >
      {getFileIcon(node.name)}
      <span className="text-sm truncate">{node.name}</span>
    </div>
  );
}

export function FileTree({
  nodes,
  selectedFile,
  onFileSelect,
  onFolderToggle,
  onExpandAll,
  onCollapseAll,
  showControls = false,
}: FileTreeProps) {

  console.log(nodes, "nodes")
  return (
    <div className="flex flex-col h-full">
      {showControls && (onExpandAll || onCollapseAll) && (
        <div className="flex items-center gap-1 px-2 py-1 border-b">
          {onExpandAll && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onExpandAll}
              title="Expand all"
            >
              <ChevronsUpDown size={14} />
            </Button>
          )}
          {onCollapseAll && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onCollapseAll}
              title="Collapse all"
            >
              <ChevronsDownUp size={14} />
            </Button>
          )}
        </div>
      )}
      <div className="flex-1 overflow-auto">
        {nodes.map((node) => (
          <FileTreeNode
            key={node.name}
            node={node}
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
            onFolderToggle={onFolderToggle}
          />
        ))}
      </div>
    </div>
  );
}

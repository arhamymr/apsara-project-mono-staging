export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  expanded?: boolean;
  children?: FileNode[];
}

export interface FileTreeProps {
  nodes: FileNode[];
  selectedFile: string;
  onFileSelect: (path: string) => void;
  onFolderToggle: (path: string[]) => void;
}

export interface SubTreeProps {
  nodes: FileNode[];
  selectedFile: string;
  onFileSelect: (path: string) => void;
  onFolderToggle: (path: string[]) => void;
  path?: string[];
  depth?: number;
}

export interface DirDivProps {
  node: FileNode;
  selectedFile: string;
  onFileSelect: (path: string) => void;
  onFolderToggle: (path: string[]) => void;
  path: string[];
  depth: number;
}

export interface FileDivProps {
  name: string;
  fullPath: string;
  isSelected: boolean;
  onClick: () => void;
  depth: number;
}

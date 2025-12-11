import type { FileNode } from './types';

/** Sort directories first, then files, alphabetically within each group */
export function sortDir(nodes: FileNode[]): FileNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type === 'folder' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  });
}

/** Check if a directory contains the selected file (for auto-expand) */
export function isChildSelected(
  nodes: FileNode[] | undefined,
  selectedFile: string,
  currentPath: string[]
): boolean {
  if (!nodes || !selectedFile) return false;
  
  for (const node of nodes) {
    const nodePath = [...currentPath, node.name].join('/');
    if (node.type === 'file' && nodePath === selectedFile) {
      return true;
    }
    if (node.type === 'folder' && node.children) {
      if (isChildSelected(node.children, selectedFile, [...currentPath, node.name])) {
        return true;
      }
    }
  }
  return false;
}

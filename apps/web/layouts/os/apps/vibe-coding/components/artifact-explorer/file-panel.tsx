import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { buildFileTree, FileTreeNode } from '@/lib/file-utils';
import {
  ChevronsDownUp,
  ChevronsUpDown,
  Download,
  Loader2,
} from 'lucide-react';
import { FileTree, FileNode } from '../file-tree';
import type { ArtifactDetails } from './types';

interface FilePanelProps {
  artifactDetails: ArtifactDetails | undefined;
  expandedFolders: Set<string>;
  selectedFile: string | null;
  isLoading: boolean;
  onFileSelect: (path: string) => void;
  onFolderToggle: (path: string[]) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onDownload: () => void;
}

function convertToFileNode(nodes: FileTreeNode[]): FileNode[] {
  return nodes.map((node) => ({
    name: node.name,
    type: node.type,
    expanded: node.expanded,
    children: node.children ? convertToFileNode(node.children) : undefined,
  }));
}

export function FilePanel({
  artifactDetails,
  expandedFolders,
  selectedFile,
  isLoading,
  onFileSelect,
  onFolderToggle,
  onExpandAll,
  onCollapseAll,
  onDownload,
}: FilePanelProps) {
  const fileTree = buildFileTree(
    artifactDetails?.file_manifest,
    expandedFolders,
  );

  return (
    <div className="w-64 border-r">
      <div className="bg-muted/50 flex items-center justify-between border-b px-3 py-2">
        <h3 className="text-xs font-semibold uppercase">Files</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onExpandAll}
            title="Expand all folders"
          >
            <ChevronsUpDown size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onCollapseAll}
            title="Collapse all folders"
          >
            <ChevronsDownUp size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onDownload}
            title="Download artifact"
          >
            <Download size={14} />
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[calc(100%-41px)]">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="py-2">
            <FileTree
              nodes={convertToFileNode(fileTree)}
              selectedFile={selectedFile || ''}
              onFileSelect={onFileSelect}
              onFolderToggle={onFolderToggle}
            />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

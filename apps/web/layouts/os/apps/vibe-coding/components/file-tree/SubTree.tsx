import { DirDiv } from './DirDiv';
import { FileDiv } from './FileDiv';
import { sortDir } from './utils';
import type { SubTreeProps } from './types';

export function SubTree({
  nodes,
  selectedFile,
  onFileSelect,
  onFolderToggle,
  path = [],
  depth = 0,
}: SubTreeProps) {
  const sortedNodes = sortDir(nodes);

  return (
    <>
      {sortedNodes.map((node) => {
        const currentPath = [...path, node.name];
        const fullPath = currentPath.join('/');

        if (node.type === 'folder') {
          return (
            <DirDiv
              key={fullPath}
              node={node}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              onFolderToggle={onFolderToggle}
              path={path}
              depth={depth}
            />
          );
        }

        return (
          <FileDiv
            key={fullPath}
            name={node.name}
            fullPath={fullPath}
            isSelected={selectedFile === fullPath}
            onClick={() => onFileSelect(fullPath)}
            depth={depth}
          />
        );
      })}
    </>
  );
}

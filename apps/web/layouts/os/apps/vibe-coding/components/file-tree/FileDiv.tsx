import { FileIcon } from './FileIcon';
import type { FileDivProps } from './types';

export function FileDiv({ name, fullPath, isSelected, onClick, depth }: FileDivProps) {
  return (
    <div
      className={`hover:bg-muted flex cursor-pointer items-center gap-1 py-1 pr-2 ${
        isSelected ? 'bg-muted' : ''
      }`}
      style={{ paddingLeft: `${depth * 16}px` }}
      onClick={onClick}
      title={fullPath}
    >
      <FileIcon filename={name} />
      <span className="text-sm truncate">{name}</span>
    </div>
  );
}

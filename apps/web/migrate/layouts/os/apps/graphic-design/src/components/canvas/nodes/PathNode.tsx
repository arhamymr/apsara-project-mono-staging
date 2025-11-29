/* eslint-disable @typescript-eslint/no-explicit-any */
import { Path } from 'react-konva';
import type { NodeModel } from '../../../core/model';

type PathNodeProps = {
  node: NodeModel<'path'>;
  isSelected: boolean;
  commonProps: any;
  onTransformEnd: (id: string, node: any) => void;
};

export function PathNode({
  node,
  isSelected,
  commonProps,
  onTransformEnd,
}: PathNodeProps) {
  return (
    <Path
      {...commonProps}
      data={node.attrs.data}
      fill={node.attrs.fill ?? 'transparent'}
      stroke={isSelected ? '#2563eb' : (node.attrs.stroke ?? '#1f2937')}
      strokeWidth={isSelected ? 2 : (node.attrs.strokeWidth ?? 2)}
      onTransformEnd={(event) => onTransformEnd(node.id, event.target)}
    />
  );
}

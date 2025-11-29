/* eslint-disable @typescript-eslint/no-explicit-any */
import { Circle } from 'react-konva';
import type { NodeModel } from '../../../core/model';

type CircleNodeProps = {
  node: NodeModel<'circle'>;
  isSelected: boolean;
  commonProps: any;
  onTransformEnd: (id: string, node: any) => void;
};

export function CircleNode({
  node,
  isSelected,
  commonProps,
  onTransformEnd,
}: CircleNodeProps) {
  return (
    <Circle
      {...commonProps}
      radius={node.attrs.radius}
      fill={node.attrs.fill ?? '#10b981'}
      stroke={isSelected ? '#2563eb' : (node.attrs.stroke ?? '#047857')}
      strokeWidth={isSelected ? 2 : 1}
      onTransformEnd={(event) => onTransformEnd(node.id, event.target)}
    />
  );
}

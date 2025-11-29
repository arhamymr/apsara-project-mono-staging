/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rect } from 'react-konva';
import type { NodeModel } from '../../../core/model';

type RectNodeProps = {
  node: NodeModel<'rect'>;
  isSelected: boolean;
  commonProps: any;
  onTransformEnd: (id: string, node: any) => void;
};

export function RectNode({
  node,
  isSelected,
  commonProps,
  onTransformEnd,
}: RectNodeProps) {
  return (
    <Rect
      {...commonProps}
      width={node.attrs.width}
      height={node.attrs.height}
      cornerRadius={node.attrs.cornerRadius ?? 0}
      fill={node.attrs.fill ?? '#94a3b8'}
      stroke={isSelected ? '#2563eb' : (node.attrs.stroke ?? '#1f2937')}
      strokeWidth={isSelected ? 2 : 1}
      onTransformEnd={(event) => onTransformEnd(node.id, event.target)}
    />
  );
}

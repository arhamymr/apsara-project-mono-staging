/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text } from 'react-konva';
import type { NodeModel } from '../../../core/model';

type TextNodeProps = {
  node: NodeModel<'text'>;
  commonProps: any;
  onTransformEnd: (id: string, node: any) => void;
};

export function TextNode({ node, commonProps, onTransformEnd }: TextNodeProps) {
  return (
    <Text
      {...commonProps}
      text={node.attrs.text}
      fontSize={node.attrs.fontSize ?? 20}
      fill={node.attrs.fill ?? '#111827'}
      width={node.attrs.width}
      align={node.attrs.align ?? 'left'}
      onTransformEnd={(event) => onTransformEnd(node.id, event.target)}
    />
  );
}

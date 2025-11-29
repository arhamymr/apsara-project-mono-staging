/* eslint-disable @typescript-eslint/no-explicit-any */
import { Image } from 'react-konva';
import type { NodeModel } from '../../../core/model';
import { useCanvasImage } from '../helpers';

type ImageNodeProps = {
  node: NodeModel<'image'>;
  commonProps: any;
  onTransformEnd: (id: string, node: any) => void;
};

export function ImageNode({
  node,
  commonProps,
  onTransformEnd,
}: ImageNodeProps) {
  const image = useCanvasImage(node.attrs.src);

  return (
    <Image
      {...commonProps}
      width={node.attrs.width}
      height={node.attrs.height}
      image={image}
      onTransformEnd={(event) => onTransformEnd(node.id, event.target)}
    />
  );
}

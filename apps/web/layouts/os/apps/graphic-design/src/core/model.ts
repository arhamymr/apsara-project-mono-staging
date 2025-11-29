export type Vec2 = {
  x: number;
  y: number;
};

export type NodeType = 'rect' | 'circle' | 'text' | 'image' | 'path';

export type RectNodeAttrs = Vec2 & {
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  cornerRadius?: number;
  opacity?: number;
};

export type CircleNodeAttrs = Vec2 & {
  radius: number;
  fill?: string;
  stroke?: string;
  opacity?: number;
};

export type TextNodeAttrs = Vec2 & {
  text: string;
  fontSize?: number;
  fill?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
};

export type ImageNodeAttrs = Vec2 & {
  src: string;
  width: number;
  height: number;
  opacity?: number;
};

export type PathNodeAttrs = Vec2 & {
  data: string;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  opacity?: number;
};

export type NodeAttrsMap = {
  rect: RectNodeAttrs;
  circle: CircleNodeAttrs;
  text: TextNodeAttrs;
  image: ImageNodeAttrs;
  path: PathNodeAttrs;
};

export type NodeModel<T extends NodeType = NodeType> = {
  id: string;
  type: T;
  name: string;
  attrs: NodeAttrsMap[T];
  locked?: boolean;
  visible?: boolean;
};

export type Tool = NodeType | 'select' | 'pan';

export function createRectNode(
  attrs: Partial<RectNodeAttrs> = {},
): NodeModel<'rect'> {
  return {
    id: crypto.randomUUID(),
    type: 'rect',
    name: attrs?.width ? `Rectangle ${Math.round(attrs.width)}` : 'Rectangle',
    attrs: {
      x: 0,
      y: 0,
      width: 120,
      height: 80,
      fill: '#94a3b8',
      stroke: '#1f2937',
      cornerRadius: 12,
      opacity: 0.7,
      ...attrs,
    },
    locked: false,
    visible: true,
  };
}

export function createCircleNode(
  attrs: Partial<CircleNodeAttrs> = {},
): NodeModel<'circle'> {
  return {
    id: crypto.randomUUID(),
    type: 'circle',
    name: 'Circle',
    attrs: {
      x: 0,
      y: 0,
      radius: 60,
      fill: '#10b981',
      stroke: '#047857',
      opacity: 0.7,
      ...attrs,
    },
    locked: false,
    visible: true,
  };
}

export function createTextNode(
  attrs: Partial<TextNodeAttrs> = {},
): NodeModel<'text'> {
  return {
    id: crypto.randomUUID(),
    type: 'text',
    name: attrs.text ?? 'Text',
    attrs: {
      x: 0,
      y: 0,
      text: attrs.text ?? 'New heading',
      fontSize: 20,
      fill: '#111827',
      width: attrs.width,
      align: attrs.align ?? 'left',
      ...attrs,
    },
    locked: false,
    visible: true,
  };
}

export function createImageNode(
  attrs: Partial<ImageNodeAttrs> = {},
): NodeModel<'image'> {
  return {
    id: crypto.randomUUID(),
    type: 'image',
    name: 'Image',
    attrs: {
      x: 0,
      y: 0,
      width: attrs.width ?? 200,
      height: attrs.height ?? 150,
      src: attrs.src ?? '',
      opacity: attrs.opacity ?? 1,
    },
    locked: false,
    visible: true,
  };
}

export function createPathNode(
  attrs: Partial<PathNodeAttrs> = {},
): NodeModel<'path'> {
  return {
    id: crypto.randomUUID(),
    type: 'path',
    name: 'Path',
    attrs: {
      x: 0,
      y: 0,
      data: attrs.data ?? 'M0 0 L50 50 L100 0 Z',
      stroke: '#1f2937',
      strokeWidth: 2,
      fill: 'transparent',
      opacity: 1,
      ...attrs,
    },
    locked: false,
    visible: true,
  };
}

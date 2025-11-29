export type NodeType = 'text' | 'rect' | 'image';

export type NodeBase = {
  id: string;
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  type: NodeType;
  visible?: boolean;
  locked?: boolean;
};

export type TextNode = NodeBase & {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  align?: 'left' | 'center' | 'right';
};

export type RectNode = NodeBase & {
  type: 'rect';
  fill: string;
  cornerRadius?: number;
};

export type ImageNode = NodeBase & {
  type: 'image';
  src: string;
  bgRemoved?: boolean;
};

export type AnyNode = TextNode | RectNode | ImageNode;

export const isTextNode = (n?: AnyNode): n is TextNode =>
  !!n && n.type === 'text';

// --- Artboards & Document ---
export type Artboard = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  background: string;
};

export type Document = {
  artboards: Artboard[];
  activeArtboardId: string;
  nodesByArtboard: Record<string, AnyNode[]>;
};

/* eslint-disable prettier/prettier */
import type {
  TemplateDefinition,
  TemplateNode,
  TemplatePage,
} from './template-schema';
import { businessTemplate } from './templates-data/business';
import { creativeStudioTemplate } from './templates-data/creative';
import { editorialBlogTemplate } from './templates-data/editorial';

export const templates: TemplateDefinition[] = [
  businessTemplate,
  creativeStudioTemplate,
  editorialBlogTemplate,
];


type TemplateNodeContext = {
  slot: string;
  path: number[];
  depth: number;
  parent?: TemplateNode;
};

type TemplateNodePredicate = (
  node: TemplateNode,
  ctx: TemplateNodeContext,
) => boolean;

type TemplateNodeTransformer = (
  node: TemplateNode,
  ctx: TemplateNodeContext,
) => TemplateNode;

type TransformResult = {
  nodes: TemplateNode[];
  matched: boolean;
  updated: boolean;
};

function getTemplateOrThrow(templateId: string): TemplateDefinition {
  const template = templates.find((t) => t.id === templateId);
  if (!template) {
    throw new Error(`Template with id "${templateId}" not found`);
  }
  if (!template.globals) {
    template.globals = {};
  }
  return template;
}

function transformNodes(
  nodes: TemplateNode[],
  predicate: TemplateNodePredicate,
  transformer: TemplateNodeTransformer,
  ctx: Omit<TemplateNodeContext, 'path'> & { path: number[] },
): TransformResult {
  let matched = false;
  let updated = false;

  const nextNodes = nodes.map((node, index) => {
    const nodeCtx: TemplateNodeContext = {
      slot: ctx.slot,
      depth: ctx.depth,
      parent: ctx.parent,
      path: [...ctx.path, index],
    };

    let nextNode = node;

    if (predicate(node, nodeCtx)) {
      matched = true;
      const transformed = transformer(node, nodeCtx);
      if (transformed !== node) {
        updated = true;
      }
      nextNode = transformed;
    }

    if (Array.isArray(nextNode.children) && nextNode.children.length > 0) {
      const childResult = transformNodes(
        nextNode.children,
        predicate,
        transformer,
        {
          slot: ctx.slot,
          depth: ctx.depth + 1,
          parent: nextNode,
          path: nodeCtx.path,
        },
      );

      if (childResult.matched) matched = true;

      if (childResult.updated) {
        updated = true;
        nextNode = { ...nextNode, children: childResult.nodes };
      }
    }

    return nextNode;
  });

  if (!updated) {
    return { nodes, matched, updated };
  }

  return { nodes: nextNodes, matched, updated };
}

function editTemplateSlot(
  template: TemplateDefinition,
  slot: string,
  predicate: TemplateNodePredicate,
  transformer: TemplateNodeTransformer,
): TransformResult {
  const slotNodes = (template.globals?.[slot] ?? []) as TemplateNode[];

  if (!Array.isArray(slotNodes) || slotNodes.length === 0) {
    return { nodes: slotNodes, matched: false, updated: false };
  }

  const result = transformNodes(slotNodes, predicate, transformer, {
    slot,
    depth: 0,
    parent: undefined,
    path: [],
  });

  if (result.updated) {
    template.globals = {
      ...(template.globals ?? {}),
      [slot]: result.nodes,
    };
  }

  return result;
}

export function editTemplateGlobalNode(
  templateId: string,
  slot: string,
  nodeId: string,
  updater: (node: TemplateNode) => TemplateNode,
): TemplateNode[] {
  const template = getTemplateOrThrow(templateId);
  const result = editTemplateSlot(
    template,
    slot,
    (node) => node.id === nodeId,
    (node) => updater(node),
  );
  return result.nodes;
}

export function patchTemplateGlobalNode(
  templateId: string,
  slot: string,
  nodeId: string,
  patch: Partial<TemplateNode>,
): TemplateNode[] {
  return editTemplateGlobalNode(templateId, slot, nodeId, (node) => ({
    ...node,
    ...patch,
  }));
}

export function patchTemplateHeaderNode(
  templateId: string,
  nodeId: string,
  patch: Partial<TemplateNode>,
): TemplateNode[] {
  return patchTemplateGlobalNode(templateId, 'header', nodeId, patch);
}

type InsertPosition = 'start' | 'end' | number;

function insertNode(
  nodes: TemplateNode[],
  node: TemplateNode,
  position: InsertPosition,
): TemplateNode[] {
  const list = [...nodes];

  if (position === 'start') {
    list.unshift(node);
    return list;
  }

  if (position === 'end') {
    list.push(node);
    return list;
  }

  const index =
    typeof position === 'number' && Number.isFinite(position)
      ? Math.max(0, Math.min(list.length, position))
      : list.length;

  list.splice(index, 0, node);
  return list;
}

export type UpsertTemplateNodeOptions = {
  templateId: string;
  slot: string;
  nodeId: string;
  patch?: Partial<TemplateNode>;
  create?: () => TemplateNode;
  parentId?: string;
  insertAt?: InsertPosition;
};

export function upsertTemplateNode({
  templateId,
  slot,
  nodeId,
  patch,
  create,
  parentId,
  insertAt = 'end',
}: UpsertTemplateNodeOptions): TemplateNode[] {
  const template = getTemplateOrThrow(templateId);
  let matched = false;

  const result = editTemplateSlot(
    template,
    slot,
    (node) => {
      if (node.id === nodeId) {
        matched = true;
        return true;
      }
      return false;
    },
    (node) => ({
      ...node,
      ...(patch ?? {}),
    }),
  );

  if (matched) {
    return result.nodes;
  }

  if (!create) {
    throw new Error(
      `Node "${nodeId}" not found in slot "${slot}" and no create() provided.`,
    );
  }

  const newNode = create();
  if (!newNode.id) newNode.id = nodeId;

  if (parentId) {
    const parentResult = editTemplateSlot(
      template,
      slot,
      (node) => node.id === parentId,
      (node, ctx) => {
        const children = Array.isArray(node.children) ? node.children : [];
        return {
          ...node,
          children: insertNode(children, newNode, insertAt),
        };
      },
    );

    if (!parentResult.matched) {
      throw new Error(
        `Parent node "${parentId}" not found in slot "${slot}" for template "${templateId}".`,
      );
    }

    return parentResult.nodes;
  }

  const existing = (template.globals?.[slot] ?? []) as TemplateNode[];
  const next = insertNode(existing, newNode, insertAt);

  template.globals = {
    ...(template.globals ?? {}),
    [slot]: next,
  };

  return next;
}

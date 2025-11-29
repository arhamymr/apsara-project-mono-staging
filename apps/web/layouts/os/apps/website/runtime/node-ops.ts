import type {
  EditorSelection,
  EditorSlot,
} from '@/layouts/os/apps/website/runtime/editor-types';
import type {
  TemplateDefinition,
  TemplateNode,
} from '@/layouts/os/apps/website/template-schema';

type WebsiteLike =
  | TemplateDefinition
  | (TemplateDefinition & Record<string, any>)
  | any;

export function getNodesForSlot(
  website: WebsiteLike,
  slot: EditorSlot,
): TemplateNode[] {
  if (slot.kind === 'global') {
    return (website.globals?.[slot.slot] ?? []) as TemplateNode[];
  }
  const page = website.pages?.[slot.pageId];
  return (page?.sections ?? []) as TemplateNode[];
}

export function setNodesForSlot(
  website: WebsiteLike,
  slot: EditorSlot,
  nodes: TemplateNode[],
): WebsiteLike {
  if (slot.kind === 'global') {
    return {
      ...website,
      globals: {
        ...(website.globals ?? {}),
        [slot.slot]: nodes,
      },
    };
  }

  const page = website.pages?.[slot.pageId];
  if (!page) return website;

  return {
    ...website,
    pages: {
      ...(website.pages ?? {}),
      [slot.pageId]: {
        ...page,
        sections: nodes,
      },
    },
  };
}

export function getNodeAtPath(
  nodes: TemplateNode[],
  path: number[],
): TemplateNode | null {
  let current: TemplateNode | null = null;
  let cursor: TemplateNode[] | undefined = nodes;
  for (const index of path) {
    if (
      !cursor ||
      !Array.isArray(cursor) ||
      index < 0 ||
      index >= cursor.length
    )
      return null;
    current = cursor[index];
    cursor = current?.children;
  }
  return current ?? null;
}

export function getNodeFromWebsite(
  website: WebsiteLike,
  selection: Pick<EditorSelection, 'slot' | 'path'>,
): TemplateNode | null {
  const nodes = getNodesForSlot(website, selection.slot);
  return getNodeAtPath(nodes, selection.path);
}

export function updateNodeAtPath(
  nodes: TemplateNode[],
  path: number[],
  updater: (node: TemplateNode) => TemplateNode,
): TemplateNode[] {
  if (path.length === 0) return nodes;
  if (!Array.isArray(nodes)) return nodes;
  const [index, ...rest] = path;
  if (index < 0 || index >= nodes.length) return nodes;

  let changed = false;
  const nextNodes = nodes.map((node, idx) => {
    if (idx !== index) return node;

    if (rest.length === 0) {
      const next = updater(node);
      if (next !== node) changed = true;
      return next;
    }

    const children = node.children ?? [];
    const nextChildren = updateNodeAtPath(children, rest, updater);
    if (nextChildren === children) return node;
    changed = true;
    return {
      ...node,
      children: nextChildren,
    };
  });

  return changed ? nextNodes : nodes;
}

export function patchWebsiteNode(
  website: WebsiteLike,
  selection: Pick<EditorSelection, 'slot' | 'path'>,
  patch: Partial<TemplateNode>,
): WebsiteLike {
  const nodes = getNodesForSlot(website, selection.slot);
  if (!nodes) return website;

  const nextNodes = updateNodeAtPath(nodes, selection.path, (node) => ({
    ...node,
    ...patch,
  }));

  if (nextNodes === nodes) return website;
  return setNodesForSlot(website, selection.slot, nextNodes);
}

function cloneNode<T>(node: T): T {
  if (typeof structuredClone === 'function') return structuredClone(node);
  return JSON.parse(JSON.stringify(node));
}

function generateNodeId(base?: string): string {
  const prefix = base ? `${base}-copy` : 'node';
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function removeNodeAtPath(
  nodes: TemplateNode[],
  path: number[],
): TemplateNode[] {
  if (!Array.isArray(nodes) || path.length === 0) return nodes;
  const [index, ...rest] = path;
  if (index < 0 || index >= nodes.length) return nodes;

  if (rest.length === 0) {
    const next = [...nodes];
    next.splice(index, 1);
    return next;
  }

  const target = nodes[index];
  if (!target) return nodes;
  const children = target.children ?? [];
  const nextChildren = removeNodeAtPath(children, rest);
  if (nextChildren === children) return nodes;

  return nodes.map((node, idx) =>
    idx === index
      ? {
          ...node,
          children: nextChildren,
        }
      : node,
  );
}

type DuplicateResult = {
  nodes: TemplateNode[];
  newPath: number[];
  node: TemplateNode | null;
};

export function duplicateNodeAtPath(
  nodes: TemplateNode[],
  path: number[],
): DuplicateResult {
  if (!Array.isArray(nodes) || path.length === 0) {
    return { nodes, newPath: path, node: null };
  }

  const [index, ...rest] = path;
  if (index < 0 || index >= nodes.length) {
    return { nodes, newPath: path, node: null };
  }

  if (rest.length === 0) {
    const original = nodes[index];
    if (!original) return { nodes, newPath: path, node: null };

    const copy = cloneNode(original);
    copy.id = generateNodeId(original.id);

    const next = [...nodes];
    next.splice(index + 1, 0, copy);

    return {
      nodes: next,
      newPath: [index + 1],
      node: copy,
    };
  }

  const target = nodes[index];
  if (!target) return { nodes, newPath: path, node: null };
  const children = target.children ?? [];
  const result = duplicateNodeAtPath(children, rest);
  if (result.nodes === children)
    return { nodes, newPath: path, node: result.node };

  const nextNodes = nodes.map((node, idx) =>
    idx === index
      ? {
          ...node,
          children: result.nodes,
        }
      : node,
  );

  return {
    nodes: nextNodes,
    newPath: [index, ...result.newPath],
    node: result.node,
  };
}

type AppendResult = {
  nodes: TemplateNode[];
  path: number[] | null;
  node: TemplateNode | null;
};

function ensureNodeHasId(node: TemplateNode): TemplateNode {
  const copy = cloneNode(node);
  if (!copy.id) {
    const base = typeof node.type === 'string' ? node.type : undefined;
    copy.id = generateNodeId(base);
  }
  return copy;
}

function clampInsertIndex(length: number, insertIndex?: number): number {
  if (typeof insertIndex !== 'number' || Number.isNaN(insertIndex)) {
    return length;
  }
  if (insertIndex <= 0) return 0;
  if (insertIndex >= length) return length;
  return insertIndex;
}

function removePlaceholderChildren(children: TemplateNode[]): TemplateNode[] {
  return children.filter((child) => !(child as any)?.meta?.placeholder);
}

function appendNodeAtPath(
  nodes: TemplateNode[] | undefined,
  path: number[],
  node: TemplateNode,
  insertIndex?: number,
): AppendResult {
  const safeNodes = Array.isArray(nodes) ? nodes : [];
  const nextNode = ensureNodeHasId(node);

  if (path.length === 0) {
    const filtered = removePlaceholderChildren(safeNodes);
    const index = clampInsertIndex(filtered.length, insertIndex);
    const nextNodes = [...filtered];
    nextNodes.splice(index, 0, nextNode);
    return {
      nodes: nextNodes,
      path: [index],
      node: nextNode,
    };
  }

  const targetNode = getNodeAtPath(safeNodes, path);
  if (!targetNode) {
    return { nodes: safeNodes, path: null, node: null };
  }

  const children = Array.isArray(targetNode.children)
    ? targetNode.children
    : [];
  const filteredChildren = removePlaceholderChildren(children);
  const index = clampInsertIndex(filteredChildren.length, insertIndex);
  const nextChildren = [...filteredChildren];
  nextChildren.splice(index, 0, nextNode);

  const updated = updateNodeAtPath(safeNodes, path, (current) => ({
    ...current,
    children: nextChildren,
  }));

  if (updated === safeNodes) {
    return { nodes: safeNodes, path: null, node: null };
  }

  return {
    nodes: updated,
    path: [...path, index],
    node: nextNode,
  };
}

export function removeWebsiteNode(
  website: WebsiteLike,
  selection: Pick<EditorSelection, 'slot' | 'path'>,
): WebsiteLike {
  const nodes = getNodesForSlot(website, selection.slot);
  if (!nodes) return website;
  const nextNodes = removeNodeAtPath(nodes, selection.path);
  if (nextNodes === nodes) return website;
  return setNodesForSlot(website, selection.slot, nextNodes);
}

export function duplicateWebsiteNode(
  website: WebsiteLike,
  selection: Pick<EditorSelection, 'slot' | 'path'>,
): { website: WebsiteLike; path: number[]; node: TemplateNode | null } {
  const nodes = getNodesForSlot(website, selection.slot);
  if (!nodes) return { website, path: selection.path, node: null };
  const result = duplicateNodeAtPath(nodes, selection.path);
  if (result.nodes === nodes || !result.node) {
    return { website, path: selection.path, node: result.node };
  }
  const nextWebsite = setNodesForSlot(website, selection.slot, result.nodes);
  return { website: nextWebsite, path: [...result.newPath], node: result.node };
}

export function appendWebsiteNode(
  website: WebsiteLike,
  target: Pick<EditorSelection, 'slot' | 'path'> & { insertIndex?: number },
  node: TemplateNode,
): {
  website: WebsiteLike;
  path: number[] | null;
  node: TemplateNode | null;
} {
  const nodes = getNodesForSlot(website, target.slot);
  const result = appendNodeAtPath(nodes, target.path, node, target.insertIndex);
  if (!result.node || !result.path) {
    return { website, path: null, node: null };
  }
  const nextWebsite = setNodesForSlot(website, target.slot, result.nodes);
  return {
    website: nextWebsite,
    path: result.path,
    node: result.node,
  };
}

function adjustTargetAfterRemoval(
  target: { path: number[]; insertIndex?: number },
  removedPath: number[],
): { path: number[]; insertIndex?: number } {
  const nextPath = [...target.path];
  let nextInsert = target.insertIndex;

  const sharedDepth = Math.min(nextPath.length, removedPath.length);
  for (let i = 0; i < sharedDepth; i += 1) {
    const removedIndex = removedPath[i];
    const targetIndex = nextPath[i];
    if (removedIndex === targetIndex) continue;
    if (removedIndex < targetIndex) {
      nextPath[i] = targetIndex - 1;
      break;
    }
    if (removedIndex > targetIndex) {
      break;
    }
  }

  const sameParent =
    removedPath.length === nextPath.length + 1 &&
    nextPath.every((value, index) => value === removedPath[index]);

  if (sameParent && typeof nextInsert === 'number') {
    const removedIndex = removedPath[removedPath.length - 1];
    if (removedIndex < nextInsert) {
      nextInsert -= 1;
    }
    if (nextInsert < 0) nextInsert = 0;
  }

  return { path: nextPath, insertIndex: nextInsert };
}

export function moveWebsiteNode(
  website: WebsiteLike,
  selection: Pick<EditorSelection, 'slot' | 'path'>,
  target: Pick<EditorSelection, 'slot' | 'path'> & { insertIndex?: number },
): {
  website: WebsiteLike;
  path: number[] | null;
  node: TemplateNode | null;
} {
  const node = getNodeFromWebsite(website, selection);
  if (!node) {
    return { website, path: null, node: null };
  }

  const removedWebsite = removeWebsiteNode(website, selection);

  let adjustedTarget = { path: target.path, insertIndex: target.insertIndex };
  if (selection.slot.kind === target.slot.kind) {
    adjustedTarget = adjustTargetAfterRemoval(adjustedTarget, selection.path);
  }

  const result = appendWebsiteNode(
    removedWebsite,
    {
      slot: target.slot,
      path: adjustedTarget.path,
      insertIndex: adjustedTarget.insertIndex,
    },
    node,
  );

  return result;
}

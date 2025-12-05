import * as React from 'react';

import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { useWebsite } from '@/hooks/use-website';
import { useWebsiteHistory } from '@/hooks/use-website/history-store';
import {
  useBuilderSelection,
  type SelectionTarget,
} from '@/hooks/use-website/selection-store';
import { CONTAINER_NODE_TYPES } from '@/layouts/os/apps/website/build/properties/node-editor/options';
import {
  appendWebsiteNode,
  getNodeFromWebsite,
} from '@/layouts/os/apps/website/runtime/node-ops';
import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';
import { Plus } from 'lucide-react';

type ElementTemplate = {
  id: string;
  label: string;
  description: string;
  template: TemplateNode;
};

const ELEMENT_LIBRARY: ElementTemplate[] = [
  {
    id: 'heading',
    label: 'Heading',
    description: 'Adds an editable headline element.',
    template: {
      type: 'text',
      class:
        'text-foreground text-2xl font-semibold tracking-tight leading-tight',
      text: 'Start with a strong heading',
      id: 'heading-element',
    },
  },
  {
    id: 'paragraph',
    label: 'Paragraph',
    description: 'Adds a supporting paragraph.',
    template: {
      type: 'text',
      class: 'text-muted-foreground text-base leading-7',
      text: 'Write a supporting paragraph that explains your idea.',
      id: 'paragraph-element',
    },
  },
  {
    id: 'button',
    label: 'Button',
    description: 'Adds a primary button with placeholder text.',
    template: {
      type: 'button',
      class:
        'bg-primary text-primary-foreground inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition hover:bg-primary/90',
      text: 'Call to action',
      id: 'button-element',
      action: { kind: 'link', href: '#', target: '_self' },
    },
  },
  {
    id: 'image',
    label: 'Image',
    description: 'Adds a responsive image placeholder.',
    template: {
      type: 'image',
      class: 'rounded-md object-cover',
      src: 'https://placehold.co/640x360',
      alt: 'Placeholder image',
      id: 'image-element',
      style: {
        width: '100%',
        height: 'auto',
      },
    },
  },
  {
    id: 'icon',
    label: 'Icon',
    description: 'Adds a Lucide icon with optional label.',
    template: {
      type: 'icon',
      iconName: 'Star',
      strokeWidth: 2,
      ariaLabel: 'Decorative icon',
      class: 'text-primary h-8 w-8',
      id: 'icon-element',
    },
  },
];

function cloneTemplate(node: TemplateNode, prefix: string): TemplateNode {
  const clone =
    typeof structuredClone === 'function'
      ? structuredClone(node)
      : JSON.parse(JSON.stringify(node));
  if (!clone.id) {
    clone.id = `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
  }
  return clone;
}

function isContainerNode(node: TemplateNode | null): boolean {
  if (!node) return false;
  return (
    CONTAINER_NODE_TYPES.has(node.type) ||
    Array.isArray(node.children) ||
    node.type === 'fragment'
  );
}

export function ElementPalette() {
  const { website, setWebsite } = useWebsite();
  const recordHistory = useWebsiteHistory((state) => state.record);
  const selection = useBuilderSelection((state) => state.selected);
  const setSelected = useBuilderSelection((state) => state.setSelected);

  const selectedNode = React.useMemo(
    () =>
      selection && website ? getNodeFromWebsite(website, selection) : null,
    [selection, website],
  );

  const targetIsContainer = isContainerNode(selectedNode);

  const handleAddElement = React.useCallback(
    (element: ElementTemplate) => {
      if (!website || !selection || !targetIsContainer) return;

      recordHistory(website);

      let nextSelection: SelectionTarget | null = null;

      setWebsite((prev: any) => {
        if (!prev) return prev;
        const clone = cloneTemplate(element.template, element.id);
        const result = appendWebsiteNode(
          prev,
          { slot: selection.slot, path: selection.path },
          clone,
        );
        if (result.node && result.path) {
          nextSelection = {
            slot: selection.slot,
            nodeId: result.node.id ?? clone.id ?? 'node',
            path: result.path,
          };
        }
        return result.website;
      });

      if (nextSelection) {
        setSelected(nextSelection);
      }
    },
    [
      recordHistory,
      selection,
      setSelected,
      setWebsite,
      targetIsContainer,
      website,
    ],
  );

  if (!selection) {
    return (
      <div className="text-muted-foreground border-border/70 rounded-md border border-dashed p-4 text-sm">
        Select a container on the canvas to add individual elements like
        headings, paragraphs, or buttons.
      </div>
    );
  }

  if (!targetIsContainer) {
    return (
      <div className="text-muted-foreground border-border/70 rounded-md border border-dashed p-4 text-sm">
        The selected node does not accept children. Choose a container section
        (e.g., stack, section, or view) to insert elements.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {ELEMENT_LIBRARY.map((element) => (
        <Card
          key={element.id}
          className="border-border/70 flex items-center justify-between rounded-md border px-3 py-2"
        >
          <div>
            <p className="text-sm font-semibold">{element.label}</p>
            <p className="text-muted-foreground text-xs">
              {element.description}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 rounded-sm text-xs font-semibold"
            onClick={() => handleAddElement(element)}
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </Card>
      ))}
    </div>
  );
}

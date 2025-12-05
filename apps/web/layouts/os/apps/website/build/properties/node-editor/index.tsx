import * as React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';

import { useWebsiteStore } from '@/hooks/use-website/store';

import { ContainerControls } from './container-controls';
import { Field } from './field';
import { IconControls } from './icon-controls';
import { ImageControls } from './image-controls';
import { LinkControls } from './link-controls';
import { NavbarControls } from './navbar-controls';
import { CONTAINER_NODE_TYPES } from './options';
import {
  extractPadding,
  extractScale,
  setPaddingBase,
  setScaleBase,
} from './style-utils';
import type {
  NodeBlurHandler,
  NodeChangeHandler,
  NodeEditorProps,
} from './types';

type PageListItem = {
  id: string | number;
  title: string;
  path: string;
};

export function NodeEditor({ node, onPatch }: NodeEditorProps) {
  const isTextual =
    node.type === 'text' || node.type === 'link' || node.type === 'button';
  const isImage = node.type === 'image';
  const linkLike = node.action?.kind === 'link' || node.type === 'link';
  const isContainer =
    CONTAINER_NODE_TYPES.has(node.type) || node.type === 'navbar';
  const isIcon = node.type === 'icon';

  const pages = useWebsiteStore((s) => s.website.pages);
  const pageList = React.useMemo<PageListItem[]>(
    () =>
      Object.values(pages || {}).map((p) => ({
        id: p.id,
        title: p.title,
        path: p.path,
      })),
    [pages],
  );
  const linkPathsListId = React.useMemo(
    () => `link-paths-${node.id ?? node.type}`,
    [node.id, node.type],
  );

  const scaleValue = React.useMemo(
    () => extractScale(node.style),
    [node.style],
  );
  const paddingValue = React.useMemo(
    () => extractPadding(node.style),
    [node.style],
  );
  const displayScale = React.useMemo(
    () => Math.min(3, Math.max(0, scaleValue)),
    [scaleValue],
  );
  const displayPadding = React.useMemo(
    () => Math.min(64, Math.max(0, paddingValue)),
    [paddingValue],
  );

  const updateStyle = React.useCallback(
    (
      mutator: (style: Record<string, unknown>) => Record<string, unknown>,
      silent: boolean,
    ) => {
      const current =
        (node.style && typeof node.style === 'object'
          ? (node.style as Record<string, unknown>)
          : {}) ?? {};
      const base = { ...current };
      const next = mutator(base);
      const cleaned = Object.entries(next).reduce<Record<string, unknown>>(
        (acc, [key, value]) => {
          if (
            value === undefined ||
            value === null ||
            (typeof value === 'string' && value.trim().length === 0)
          ) {
            return acc;
          }
          acc[key] = value;
          return acc;
        },
        {},
      );
      if (Object.keys(cleaned).length === 0) {
        onPatch({ style: undefined }, silent ? { silent: true } : undefined);
      } else {
        onPatch({ style: cleaned }, silent ? { silent: true } : undefined);
      }
    },
    [node.style, onPatch],
  );

  const setScale = React.useCallback(
    (value: number, silent: boolean) => {
      const clamped = Number.isFinite(value)
        ? Math.min(3, Math.max(0, value))
        : 1;
      updateStyle((style) => setScaleBase(style, clamped), silent);
    },
    [updateStyle],
  );

  const setPadding = React.useCallback(
    (value: number, silent: boolean) => {
      const clamped = Number.isFinite(value)
        ? Math.min(64, Math.max(0, value))
        : 0;
      updateStyle((style) => setPaddingBase(style, clamped), silent);
    },
    [updateStyle],
  );

  const handleChange: NodeChangeHandler =
    (key: keyof TemplateNode) => (event) => {
      onPatch({ [key]: event.target.value } as Partial<TemplateNode>, {
        silent: true,
      });
    };

  const handleBlur: NodeBlurHandler = (key: keyof TemplateNode) => (event) => {
    onPatch({ [key]: event.target.value } as Partial<TemplateNode>);
  };

  const hasContentControls = isIcon || isTextual || isImage || linkLike;

  const accordionSections: Array<{
    value: string;
    label: string;
    content: React.ReactNode;
  }> = [];

  if (isContainer) {
    accordionSections.push(
      {
        value: 'surface',
        label: 'Surface',
        content: (
          <ContainerControls
            key={`surface-${node.id ?? node.type}`}
            className={node.class ?? ''}
            onUpdateClass={(value) =>
              onPatch(
                { class: value.trim().length ? value : undefined },
                { silent: false },
              )
            }
            section="surface"
          />
        ),
      },
      {
        value: 'background',
        label: 'Background',
        content: (
          <ContainerControls
            key={`background-${node.id ?? node.type}`}
            className={node.class ?? ''}
            onUpdateClass={(value) =>
              onPatch(
                { class: value.trim().length ? value : undefined },
                { silent: false },
              )
            }
            section="background"
          />
        ),
      },
      {
        value: 'width',
        label: 'Content width',
        content: (
          <ContainerControls
            key={`width-${node.id ?? node.type}`}
            className={node.class ?? ''}
            onUpdateClass={(value) =>
              onPatch(
                { class: value.trim().length ? value : undefined },
                { silent: false },
              )
            }
            section="width"
          />
        ),
      },
      {
        value: 'spacing',
        label: 'Spacing',
        content: (
          <ContainerControls
            key={`spacing-${node.id ?? node.type}`}
            className={node.class ?? ''}
            onUpdateClass={(value) =>
              onPatch(
                { class: value.trim().length ? value : undefined },
                { silent: false },
              )
            }
            section="spacing"
          />
        ),
      },
      {
        value: 'gap',
        label: 'Gap between children',
        content: (
          <ContainerControls
            key={`gap-${node.id ?? node.type}`}
            className={node.class ?? ''}
            onUpdateClass={(value) =>
              onPatch(
                { class: value.trim().length ? value : undefined },
                { silent: false },
              )
            }
            section="gap"
          />
        ),
      },
    );
  }

  accordionSections.push({
    value: 'appearance',
    label: 'Appearance',
    content: (
      <div className="space-y-4">
        {node.type === 'navbar' ? (
          <NavbarControls node={node} onPatch={onPatch} />
        ) : null}
        <Field label="Class">
          <Textarea
            value={node.class ?? ''}
            placeholder="Tailwind classes"
            onChange={handleChange('class')}
            onBlur={handleBlur('class')}
            rows={3}
            className="font-mono text-xs leading-5"
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
          />
        </Field>
        {node.variant ? (
          <Field label="Variant">
            <Input
              value={node.variant}
              onChange={handleChange('variant')}
              onBlur={handleBlur('variant')}
            />
          </Field>
        ) : null}
      </div>
    ),
  });

  if (hasContentControls) {
    accordionSections.push({
      value: 'content',
      label: 'Content',
      content: (
        <div className="space-y-4">
          {isIcon ? <IconControls node={node} onPatch={onPatch} /> : null}

          {isTextual ? (
            <Field label="Text">
              <Input
                value={node.text ?? ''}
                placeholder="Display text"
                onChange={handleChange('text')}
                onBlur={handleBlur('text')}
              />
            </Field>
          ) : null}

          {isImage ? (
            <ImageControls
              node={node}
              displayScale={displayScale}
              displayPadding={displayPadding}
              setScale={setScale}
              setPadding={setPadding}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          ) : null}

          {linkLike ? (
            <LinkControls
              node={node}
              onPatch={onPatch}
              pageList={pageList}
              linkPathsListId={linkPathsListId}
            />
          ) : null}
        </div>
      ),
    });
  }

  const defaultValues = accordionSections.map((section) => section.value);

  return (
    <Accordion
      type="multiple"
      defaultValue={defaultValues}
      className="space-y-3"
    >
      {accordionSections.map((section) => (
        <AccordionItem key={section.value} value={section.value}>
          <AccordionTrigger className="hover:bg-muted/30 rounded-md px-3 py-2 text-left text-xs tracking-wide uppercase">
            {section.label}
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-3">{section.content}</div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export type { NodeEditorProps } from './types';

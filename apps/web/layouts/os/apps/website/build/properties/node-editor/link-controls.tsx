import { Input } from '@workspace/ui/components/input';
import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';

import { Field } from './field';
import type { NodePatchHandler } from './types';

type PageListItem = {
  id: string | number;
  title: string;
  path: string;
};

type LinkControlsProps = {
  node: TemplateNode;
  linkPathsListId: string;
  pageList: PageListItem[];
  onPatch: NodePatchHandler;
};

export function LinkControls({
  node,
  linkPathsListId,
  pageList,
  onPatch,
}: LinkControlsProps) {
  return (
    <>
      <Field label="Link URL">
        <Input
          value={node.action?.href ?? ''}
          placeholder="https://"
          list={linkPathsListId}
          onChange={(event) =>
            onPatch(
              {
                action: {
                  ...(node.action ?? { kind: 'link', target: '_self' }),
                  href: event.target.value,
                },
              },
              { silent: true },
            )
          }
          onBlur={(event) =>
            onPatch({
              action: {
                ...(node.action ?? { kind: 'link', target: '_self' }),
                href: event.target.value,
              },
            })
          }
        />
        <datalist id={linkPathsListId}>
          {pageList.map((p) => (
            <option key={p.path} value={p.path}>
              {p.title}
            </option>
          ))}
        </datalist>
      </Field>
      <Field label="Target">
        <Input
          value={node.action?.target ?? '_self'}
          placeholder="_self"
          onChange={(event) =>
            onPatch(
              {
                action: {
                  ...(node.action ?? { kind: 'link' }),
                  target: event.target.value,
                },
              },
              { silent: true },
            )
          }
          onBlur={(event) =>
            onPatch({
              action: {
                ...(node.action ?? { kind: 'link' }),
                target: event.target.value,
              },
            })
          }
        />
      </Field>
    </>
  );
}

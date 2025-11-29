import type {
  TemplateNode,
  TemplatePage,
} from '@/layouts/os/apps/website/template-schema';
import type { SimpleEditorConfig } from './editor-types';
import { RenderNode } from './node-renderer';

type RenderPageProps =
  | {
      page: TemplatePage;
      sections?: never;
      ctx?: Record<string, any>;
      editor?: SimpleEditorConfig;
      className?: string;
    }
  | {
      page?: never;
      sections: TemplateNode[];
      ctx?: Record<string, any>;
      editor?: SimpleEditorConfig;
      className?: string;
    };

export function RenderPage(props: RenderPageProps) {
  const { ctx = {}, editor, className = '' } = props;
  const nodes = 'page' in props ? props.page.sections : props.sections;
  const safeNodes = nodes ?? [];

  if (safeNodes.length === 0) return null;

  return (
    <div className={className}>
      {safeNodes.map((node, index) => (
        <RenderNode
          key={node.id ?? `page:${index}`}
          node={node}
          ctx={ctx}
          path={[index]}
          editor={editor}
        />
      ))}
    </div>
  );
}

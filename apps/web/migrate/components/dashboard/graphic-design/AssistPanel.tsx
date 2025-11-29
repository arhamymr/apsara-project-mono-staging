import { AnyNode, TextNode, isTextNode } from './types';

type Props = {
  selected?: AnyNode;
  variants: string[];
  onGenerate: (seedText: string) => void;
  onMakePunchier: () => void;
  onApply: (v: string) => void;
  onRejectIndex: (idx: number) => void;
  onUpdateSelectedText: (text: string) => void;
  onCommand: (cmd: string) => void;
};

export default function AssistPanel({
  selected,
  variants,
  onGenerate,
  onMakePunchier,
  onApply,
  onRejectIndex,
  onUpdateSelectedText,
  onCommand,
}: Props) {
  return (
    <aside className="bg-background/95 flex w-[360px] flex-col gap-3 border-l border-[var(--border)] p-4 backdrop-blur">
      <header className="flex items-center justify-between">
        <h2 className="text-base font-medium">Content Assist</h2>
        <span className="text-muted-foreground text-xs">Infinite canvas</span>
      </header>
      {!selected && (
        <div className="text-muted-foreground text-sm">
          Select a <span className="text-foreground">Text/Image/Rect</span> to
          get suggestions.
        </div>
      )}
      {isTextNode(selected) && (
        <>
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs">
              Selected Text
            </label>
            <textarea
              value={(selected as TextNode).text}
              onChange={(e) => onUpdateSelectedText(e.target.value)}
              className="bg-background h-24 w-full rounded-lg border border-[var(--border)] p-2 text-sm"
            />
            <div className="flex gap-2">
              <button
                className="hover:bg-muted rounded-md border border-[var(--border)] px-3 py-1.5 text-sm"
                onClick={() => onGenerate((selected as TextNode).text)}
              >
                Generate Variants
              </button>
              <button
                className="hover:bg-muted rounded-md border border-[var(--border)] px-3 py-1.5 text-sm"
                onClick={onMakePunchier}
              >
                Make Punchier
              </button>
            </div>
          </div>
          <div className="space-y-2 overflow-auto">
            <label className="text-muted-foreground text-xs">Variants</label>
            <div className="grid gap-2">
              {variants.map((v, idx) => (
                <div
                  key={idx}
                  className="hover:border-primary/40 rounded-xl border border-[var(--border)] p-2"
                >
                  <p className="text-sm leading-snug whitespace-pre-wrap">
                    {v}
                  </p>
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      className="hover:bg-muted rounded border px-2 py-1 text-xs"
                      onClick={() => onApply(v)}
                    >
                      Apply
                    </button>
                    <button
                      className="hover:bg-muted rounded border px-2 py-1 text-xs"
                      onClick={() => onRejectIndex(idx)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {variants.length === 0 && (
                <div className="text-muted-foreground text-xs">
                  No variants yet.
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <div className="mt-auto space-y-2 border-t border-[var(--border)] pt-2">
        <label className="text-muted-foreground text-xs">Command (demo)</label>
        <input
          placeholder="e.g., make title shorter by 20%"
          className="bg-background w-full rounded-md border border-[var(--border)] px-2 py-1 text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = (e.target as HTMLInputElement).value.trim();
              if (val) onCommand(val);
              (e.target as HTMLInputElement).value = '';
            }
          }}
        />
      </div>
    </aside>
  );
}

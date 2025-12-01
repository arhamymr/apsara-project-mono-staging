import { Separator } from '@workspace/ui/components/separator';

type Props = {
  text: string;
};

export function NoteWidget({ text }: Props) {
  return (
    <div className="p-3">
      <div
        className="flex items-center justify-between"
        data-role="drag-handle"
      >
        <h3 className="text-xs font-semibold">Note</h3>
        <span className="text-muted-foreground text-[10px]">Drag here</span>
      </div>
      <Separator className="my-2" />
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}

export default NoteWidget;

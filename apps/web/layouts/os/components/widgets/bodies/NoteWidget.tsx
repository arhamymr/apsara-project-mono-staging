import { Separator } from '@workspace/ui/components/separator';

type Props = {
  text: string;
};

export function NoteWidget({ text }: Props) {
  return (
    <div className="p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold">Note</h3>
      </div>
      <Separator className="my-2" />
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}

export default NoteWidget;

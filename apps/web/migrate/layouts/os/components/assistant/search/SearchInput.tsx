import { Search } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchInput({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search apps…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="text-muted-foreground w-full rounded-xs py-2 pr-4 pl-10 text-sm"
        autoFocus
      />
    </div>
  );
}

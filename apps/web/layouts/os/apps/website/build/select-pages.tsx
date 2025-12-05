import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { useWebsite } from '@/hooks/use-website';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function SelectPages() {
  const { website, activePage, setActivePage } = useWebsite();
  const pages = useMemo(
    () => Object.values(website?.pages ?? {}),
    [website?.pages],
  );
  const activePageId = activePage?.id ?? pages[0]?.id ?? 'home';
  const [selected, setSelected] = useState(activePageId);

  useEffect(() => {
    setSelected(activePageId);
  }, [activePageId]);

  const handleChangeSelected = useCallback(
    (value: string) => {
      setSelected(value);
      const page = pages.find((item) => item.id === value);
      if (page) setActivePage(page);
    },
    [pages, setActivePage],
  );

  return (
    <Select value={selected} onValueChange={handleChangeSelected}>
      <SelectTrigger className="bg-background w-[180px]">
        <SelectValue placeholder="Select page" />
      </SelectTrigger>
      <SelectContent className="z-[999999999]">
        <SelectGroup>
          {pages.map((page) => (
            <SelectItem key={page.id} value={page.id}>
              Switch to: {page.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

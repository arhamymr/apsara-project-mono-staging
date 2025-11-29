/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { useToolbar } from './toolbar-provider';

const fontSizes = [
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '28px',
  '32px',
  '36px',
  '48px',
];

export const FontSizeToolbar = () => {
  const { editor } = useToolbar() as any;

  let currentFontSize = editor?.getAttributes('fontSize')?.size || '16px';

  if (typeof currentFontSize === 'object') {
    currentFontSize = currentFontSize.size;
  }

  const handleFontSizeChange = (size: string) => {
    editor?.chain().focus().setFontSize(size).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          Font size {currentFontSize}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {fontSizes.map((size) => (
          <DropdownMenuItem
            key={size}
            onSelect={() => handleFontSizeChange(size)}
          >
            {size}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

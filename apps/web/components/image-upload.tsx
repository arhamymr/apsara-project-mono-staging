/* eslint-disable @typescript-eslint/no-explicit-any */

import { AssetPicker } from '@/components/asset-picker';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ImageIcon, Upload, X } from 'lucide-react';
import * as React from 'react';
import { useController, useFormContext } from 'react-hook-form';

type ImageUploadProps = {
  name: string;
  className?: string;
  maxSizeMB?: number;
  onChange?: (value: File | string | null) => void;
};

export function ImageUpload({
  name,
  className,
  maxSizeMB = 5,
}: ImageUploadProps) {
  const { control, setValue } = useFormContext();
  const { field } = useController({ name, control });
  const [pickerOpen, setPickerOpen] = React.useState(false);

  const handleClear = () => {
    setValue(name, null);
  };

  const chooseFromAssets = (value: any) => {
    setValue(name, value);
    setPickerOpen(false);
  };

  return (
    <div className={cn('w-full', className)}>
      {field.value ? (
        <div className="border-border bg-card relative overflow-hidden rounded-lg border">
          <img
            src={field.value as string}
            alt="Selected image"
            className="h-[400px] w-full rounded-lg object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 shadow-sm"
            type="button"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            'flex h-[250px] w-full flex-col items-center justify-center rounded-lg',
            'border-border bg-muted/30 text-muted-foreground border-2 border-dashed',
            'hover:bg-muted/50 cursor-pointer transition-colors',
            'focus-visible:ring-ring focus:outline-none focus-visible:ring-2',
            'focus-visible:ring-offset-background focus-visible:ring-offset-2',
          )}
          onClick={() => setPickerOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setPickerOpen(true);
          }}
          role="button"
          tabIndex={0}
        >
          <div className="mb-4 flex flex-col items-center justify-center">
            <ImageIcon className="h-[80px] w-[80px]" />
            <Upload className="mt-4 h-6 w-6" />
          </div>
          <p className="text-foreground mb-2 text-sm font-medium">
            Click to select a cover image
          </p>
          <p className="text-muted-foreground text-xs">
            PNG, JPG, GIF, {maxSizeMB}MB
          </p>
        </div>
      )}

      <AssetPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={chooseFromAssets}
      />
    </div>
  );
}

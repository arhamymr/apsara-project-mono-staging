import { AssetPicker } from '@/components/asset-picker';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@/lib/utils';
import React from 'react';

interface CoverImagePickerProps {
  imageUrl?: string;
  setImageUrl: (url?: string) => void;
}

export function CoverImagePicker({
  imageUrl,
  setImageUrl,
}: CoverImagePickerProps) {
  const [coverAttribution, setCoverAttribution] = React.useState<{
    label: string;
    url?: string;
  } | null>(null);
  const [isPickerOpen, setPickerOpen] = React.useState(false);

  return (
    <div>
      <label className="text-muted-foreground text-xs font-medium">
        Cover Image
      </label>
      <div
        className={cn(
          'border-muted-foreground/30 hover:border-foreground/50 mt-2 flex flex-col items-center justify-center rounded-md border border-dashed p-3 transition-colors',
          imageUrl && 'border-muted border-solid',
        )}
      >
        {imageUrl ? (
          <div className="relative w-full">
            <img
              src={imageUrl}
              alt="Cover preview"
              className="h-40 w-full rounded-md object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setPickerOpen(true)}
                className="bg-background/70 backdrop-blur-sm"
              >
                Change
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setImageUrl(undefined);
                  setCoverAttribution(null);
                }}
                className="bg-background/70 backdrop-blur-sm"
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-muted-foreground h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25v11.25M3 16.5l4.72-4.72a.75.75 0 011.06 0L12 14.25l2.47-2.47a.75.75 0 011.06 0L21 16.5M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5"
                />
              </svg>
            </div>
            <p className="text-muted-foreground text-sm">
              No cover image selected
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPickerOpen(true)}
            >
              Select cover image
            </Button>
          </div>
        )}

        {coverAttribution && (
          <a
            href={coverAttribution.url}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground mt-2 text-xs underline"
          >
            {coverAttribution.label}
          </a>
        )}
      </div>

      <AssetPicker
        open={isPickerOpen}
        onOpenChange={setPickerOpen}
        kindFilter="image"
        onSelect={(path) => {
          setImageUrl(path);
          setCoverAttribution(null);
          setPickerOpen(false);
        }}
        onSelectUnsplash={(photo) => {
          setImageUrl(photo.urls.regular ?? photo.urls.full);
          setCoverAttribution({
            label: `Photo by ${photo.user?.name ?? 'Unsplash'}`,
            url: photo.links?.html,
          });
          setPickerOpen(false);
        }}
      />
    </div>
  );
}

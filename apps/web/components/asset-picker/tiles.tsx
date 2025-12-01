import { Card } from '@workspace/ui/components/card';
import type { UnsplashPhoto } from './types';

/** Tile for displaying Unsplash photo search results */
export function UnsplashTile({
  photo,
  onClick,
}: {
  photo: UnsplashPhoto;
  onClick: (photo: UnsplashPhoto) => void;
}) {
  return (
    <Card
      className="group hover:border-primary cursor-pointer overflow-hidden rounded-md shadow-none"
      onClick={() => onClick(photo)}
    >
      <div className="relative aspect-4/3">
        <img
          src={photo.urls.small}
          alt={photo.alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="text-muted-foreground px-2 py-1 text-xs">
        {photo.user?.name}
      </div>
    </Card>
  );
}

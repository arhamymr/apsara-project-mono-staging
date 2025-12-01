import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Input } from '@workspace/ui/components/input';
import { ToggleGroup, ToggleGroupItem } from '@workspace/ui/components/toggle-group';
import {
  ChevronDown,
  Grid3X3,
  List,
  Loader2,
  Search,
  Upload,
} from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';

export function Toolbar({
  view,
  setView,
  onSearch,
  isUploading,
  isListLoading,
  isCreatingFolder,
  onCreateFolder,
  onTriggerUpload,

  breadcrumbs,
  setPrefix,
}: {
  view: 'grid' | 'list';
  setView: (v: 'grid' | 'list') => void;
  onSearch: (q: string) => void;
  isUploading?: boolean;
  isListLoading?: boolean;
  isCreatingFolder?: boolean;
  onCreateFolder: () => void | Promise<void>;
  onTriggerUpload: (visibility?: 'public' | 'private') => void;

  breadcrumbs: { name: string; prefix: string }[];
  setPrefix: (prefix: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <div className="flex w-full items-center justify-end gap-2">
        <div className="flex items-center gap-2">
          {isListLoading ? (
            <span className="text-muted-foreground flex items-center gap-2 text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading...
            </span>
          ) : null}

          <div className="relative w-full max-w-xs">
            <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search"
              className="pl-8"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value) => {
              if (value === 'grid' || value === 'list') setView(value);
            }}
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid3X3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="inline-flex items-center gap-px">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-r-none"
              onClick={() => onTriggerUpload('private')}
              aria-label="Upload"
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-l-none px-2"
                  aria-label="Upload visibility options"
                  disabled={isUploading}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[999] w-44 text-xs">
                <DropdownMenuLabel>Upload visibility</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => onTriggerUpload('private')}
                  disabled={isUploading}
                >
                  Private (default)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => onTriggerUpload('public')}
                  disabled={isUploading}
                >
                  Public
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <Breadcrumbs breadcrumbs={breadcrumbs} onClick={setPrefix} />
    </div>
  );
}

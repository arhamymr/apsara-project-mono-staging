import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Filter, Plus, Search, Users } from 'lucide-react';

export function Toolbar({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Users className="h-4 w-4" />
        <span>Leads</span>
      </div>
      <div className="flex flex-1 items-center gap-2 md:max-w-md">
        <div className="relative w-full">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input placeholder="Search leads…" className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Lead
        </Button>
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@workspace/ui/components/badge';
import { Input } from '@workspace/ui/components/input';
import { Separator } from '@workspace/ui/components/separator';
import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { CalendarDays, Search } from 'lucide-react';

interface ControlsProps {
  now: Date;
  query: string;
  setQuery: (v: string) => void;
  channel: string;
  setChannel: (v: string) => void;
  period: string;
  setPeriod: (v: any) => void;
}

export default function Controls({
  now,
  query,
  setQuery,
  period,
  setPeriod,
}: ControlsProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search pages or sources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Separator orientation="vertical" className="hidden h-6 md:block" />
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {now.toLocaleDateString()}
          </Badge>
        </div>
      </div>
      <Tabs
        value={period}
        onValueChange={(v) => setPeriod(v)}
        className="w-full md:w-auto"
      >
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

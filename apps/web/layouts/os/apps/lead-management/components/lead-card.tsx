'use client';

import { Building2, DollarSign, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import type { Lead } from '../types';

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card border-border group relative cursor-pointer rounded-lg border p-3 shadow-sm transition-all',
        'hover:shadow-md hover:ring-1 hover:ring-primary/20'
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-medium leading-snug">{lead.name}</h4>
          {lead.company && (
            <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{lead.company}</span>
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 z-[99999]">
            <DropdownMenuItem onClick={onClick}>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between gap-2">
        {lead.value ? (
          <Badge variant="secondary" className="text-xs font-medium">
            <DollarSign className="mr-0.5 h-3 w-3" />
            Rp{lead.value.toLocaleString('id-ID')}
          </Badge>
        ) : (
          <span />
        )}
        {lead.source && (
          <span className="text-muted-foreground max-w-[100px] truncate text-xs">{lead.source}</span>
        )}
      </div>
    </div>
  );
}

export function LeadCardOverlay({ lead }: { lead: Lead }) {
  return (
    <div className="ring-primary/30 w-64 rotate-3 cursor-grabbing shadow-2xl ring-2">
      <LeadCard lead={lead} />
    </div>
  );
}

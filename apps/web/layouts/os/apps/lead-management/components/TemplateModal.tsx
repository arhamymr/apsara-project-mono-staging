'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import type { PipelineColumn } from '../types';

interface TemplateModalProps {
  templates: { name: string; description: string; columns: Omit<PipelineColumn, 'id'>[] }[];
  onApply: (template: { name: string; description: string; columns: Omit<PipelineColumn, 'id'>[] }) => void;
  onClose: () => void;
}

export function TemplateModal({ templates, onApply, onClose }: TemplateModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-background border-border relative z-10 mx-4 w-full max-w-2xl rounded-lg border shadow-xl">
        <div className="border-border flex items-center justify-between border-b px-4 py-3">
          <div>
            <h2 className="text-base font-semibold">Pipeline Templates</h2>
            <p className="text-muted-foreground text-xs">Choose a template to get started quickly</p>
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {templates.map((template) => (
              <div
                key={template.name}
                className="bg-muted/30 hover:bg-muted/50 cursor-pointer rounded-lg border p-4 transition-colors"
                onClick={() => onApply(template)}
              >
                <h3 className="mb-1 font-medium">{template.name}</h3>
                <p className="text-muted-foreground mb-3 text-xs">{template.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {template.columns.map((col, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      <div className={cn('mr-1.5 h-2 w-2 rounded-full', col.dotColor)} />
                      {col.title}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-border flex justify-end border-t px-4 py-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

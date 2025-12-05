import * as React from 'react';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Slider } from '@workspace/ui/components/slider';
import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';

import { Field } from './field';
import { IconPicker } from './icon-picker';
import { ensureIconName, getLucideIconComponent } from './icon-utils';
import type { NodePatchHandler } from './types';

type IconControlsProps = {
  node: TemplateNode;
  onPatch: NodePatchHandler;
};

export function IconControls({ node, onPatch }: IconControlsProps) {
  const [iconPickerOpen, setIconPickerOpen] = React.useState(false);
  const iconName = typeof node.iconName === 'string' ? node.iconName : '';

  const displayIconName = ensureIconName(iconName || undefined);
  const LucideIcon = getLucideIconComponent(displayIconName);
  const stroke = typeof node.strokeWidth === 'number' ? node.strokeWidth : 2;
  const ariaLabelValue =
    typeof node.ariaLabel === 'string' ? node.ariaLabel : '';
  const accessibleLabel = ariaLabelValue.trim().length
    ? ariaLabelValue
    : undefined;

  return (
    <Field label="Icon">
      <div className="flex items-center gap-2">
        <Input
          value={iconName}
          placeholder="Lucide icon, e.g. Zap, Grid3x3"
          onChange={(event) =>
            onPatch({ iconName: event.target.value } as Partial<TemplateNode>, {
              silent: true,
            })
          }
          onBlur={() =>
            onPatch({
              iconName: iconName,
            } as Partial<TemplateNode>)
          }
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-border bg-background hover:bg-muted/20 h-8 rounded-md px-2 text-xs"
          onClick={() => setIconPickerOpen(true)}
          title="Browse icons"
        >
          Browse icons
        </Button>
        <LucideIcon
          className="text-muted-foreground h-5 w-5"
          strokeWidth={stroke}
          aria-label={accessibleLabel}
          aria-hidden={accessibleLabel ? undefined : true}
        />
      </div>
      <p className="text-muted-foreground mt-1 text-[11px]">
        Choose any Lucide icon by name (case-sensitive). Examples: Zap, Grid3x3,
        MousePointer, Type.
      </p>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-[11px]">Stroke</span>
          <Slider
            value={[stroke]}
            min={1}
            max={3}
            step={0.5}
            onValueChange={(value) => {
              if (!value.length) return;
              onPatch({ strokeWidth: value[0] } as Partial<TemplateNode>, {
                silent: true,
              });
            }}
            onValueCommit={(value) => {
              if (!value.length) return;
              onPatch({
                strokeWidth: value[0],
              } as Partial<TemplateNode>);
            }}
            className="w-32"
          />
        </div>
        <Input
          value={ariaLabelValue}
          placeholder="ARIA label (optional)"
          onChange={(event) =>
            onPatch(
              {
                ariaLabel: event.target.value,
              } as Partial<TemplateNode>,
              { silent: true },
            )
          }
          onBlur={(event) =>
            onPatch({
              ariaLabel: event.target.value.trim().length
                ? event.target.value
                : undefined,
            } as Partial<TemplateNode>)
          }
          className="text-xs"
        />
      </div>

      <IconPicker
        open={iconPickerOpen}
        onOpenChange={setIconPickerOpen}
        selectedName={iconName || undefined}
        onSelect={(name) => {
          onPatch({ iconName: name } as Partial<TemplateNode>);
          setIconPickerOpen(false);
        }}
      />
    </Field>
  );
}

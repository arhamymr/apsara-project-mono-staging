import type React from 'react';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import type { NodeModel } from '../../core/model';
import { useCanvasStore } from '../../store/canvas.store';

function useSelectedNode(): NodeModel | null {
  return useCanvasStore((state) => {
    const activeId = state.selection.ids[0];
    if (!activeId) return null;
    return state.nodes.find((node) => node.id === activeId) ?? null;
  });
}

function PropertyInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
}: {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number';
}) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    if (type === 'number') {
      const num = Number(localValue);
      if (!Number.isNaN(num)) {
        onChange(num);
      } else {
        setLocalValue(value); // Reset on invalid input
      }
    } else {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div className="grid grid-cols-2 items-center gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export function PropertiesPanel() {
  const node = useSelectedNode();
  const updateNode = useCanvasStore((state) => state.updateNode);

  if (!node) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Select a layer to view its properties.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleChange = (key: string) => (value: string | number) => {
    updateNode(node.id, { [key]: value });
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{node.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PropertyInput
          id="prop-x"
          label="X"
          type="number"
          value={(node.attrs as any).x ?? 0}
          onChange={handleChange('x')}
        />
        <PropertyInput
          id="prop-y"
          label="Y"
          type="number"
          value={(node.attrs as any).y ?? 0}
          onChange={handleChange('y')}
        />

        {node.type === 'rect' && (
          <div className="space-y-4">
            <Separator />
            <PropertyInput
              id="prop-width"
              label="Width"
              type="number"
              value={(node.attrs as any).width ?? 0}
              onChange={handleChange('width')}
            />
            <PropertyInput
              id="prop-height"
              label="Height"
              type="number"
              value={(node.attrs as any).height ?? 0}
              onChange={handleChange('height')}
            />
          </div>
        )}

        {node.type === 'circle' && (
          <div className="space-y-4">
            <Separator />
            <PropertyInput
              id="prop-radius"
              label="Radius"
              type="number"
              value={(node.attrs as any).radius ?? 0}
              onChange={handleChange('radius')}
            />
          </div>
        )}

        {node.type === 'text' && (
          <div className="space-y-4">
            <Separator />
            <PropertyInput
              id="prop-text"
              label="Text"
              value={(node.attrs as any).text ?? ''}
              onChange={handleChange('text')}
            />
            <PropertyInput
              id="prop-font"
              label="Font size"
              type="number"
              value={(node.attrs as any).fontSize ?? 16}
              onChange={handleChange('fontSize')}
            />
          </div>
        )}

        {node.type === 'image' && (
          <div className="space-y-4">
            <Separator />
            <PropertyInput
              id="prop-src"
              label="Source URL"
              value={(node.attrs as any).src ?? ''}
              onChange={handleChange('src')}
            />
            <PropertyInput
              id="prop-img-width"
              label="Width"
              type="number"
              value={(node.attrs as any).width ?? 0}
              onChange={handleChange('width')}
            />
            <PropertyInput
              id="prop-img-height"
              label="Height"
              type="number"
              value={(node.attrs as any).height ?? 0}
              onChange={handleChange('height')}
            />
          </div>
        )}

        {node.type === 'path' && (
          <div className="space-y-4">
            <Separator />
            <PropertyInput
              id="prop-data"
              label="Path Data"
              value={(node.attrs as any).data ?? ''}
              onChange={handleChange('data')}
            />
            <PropertyInput
              id="prop-stroke-width"
              label="Stroke Width"
              type="number"
              value={(node.attrs as any).strokeWidth ?? 2}
              onChange={handleChange('strokeWidth')}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

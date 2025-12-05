import { Input } from '@workspace/ui/components/input';
import { Slider } from '@workspace/ui/components/slider';
import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';

import { Field } from './field';
import type { NodeBlurHandler, NodeChangeHandler } from './types';

type ImageControlsProps = {
  node: TemplateNode;
  displayScale: number;
  displayPadding: number;
  setScale: (value: number, silent: boolean) => void;
  setPadding: (value: number, silent: boolean) => void;
  handleChange: NodeChangeHandler;
  handleBlur: NodeBlurHandler;
};

export function ImageControls({
  node,
  displayScale,
  displayPadding,
  setScale,
  setPadding,
  handleChange,
  handleBlur,
}: ImageControlsProps) {
  return (
    <>
      <Field label="Image Source">
        <Input
          value={node.src ?? ''}
          placeholder="https://example.com/image.png"
          onChange={handleChange('src')}
          onBlur={handleBlur('src')}
        />
      </Field>
      <Field label="Alt Text">
        <Input
          value={node.alt ?? ''}
          placeholder="Alternative description"
          onChange={handleChange('alt')}
          onBlur={handleBlur('alt')}
        />
      </Field>
      <Field label={`Scale (${displayScale.toFixed(2)}x)`}>
        <Slider
          value={[displayScale]}
          min={0}
          max={3}
          step={0.05}
          onValueChange={(value) => {
            if (!value.length) return;
            setScale(value[0], true);
          }}
          onValueCommit={(value) => {
            if (!value.length) return;
            setScale(value[0], false);
          }}
        />
      </Field>
      <Field label={`Padding (${Math.round(displayPadding)}px)`}>
        <Slider
          value={[displayPadding]}
          min={0}
          max={64}
          step={1}
          onValueChange={(value) => {
            if (!value.length) return;
            setPadding(value[0], true);
          }}
          onValueCommit={(value) => {
            if (!value.length) return;
            setPadding(value[0], false);
          }}
        />
      </Field>
    </>
  );
}

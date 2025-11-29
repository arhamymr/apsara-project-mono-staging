'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComponentExample } from '../types';

/**
 * Default Input Example
 */
function DefaultInputExample() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  );
}

/**
 * Input Types Example
 */
function InputTypesExample() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">Text Input</Label>
        <Input id="text" type="text" placeholder="Enter text" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-type">Email Input</Label>
        <Input id="email-type" type="email" placeholder="email@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password Input</Label>
        <Input id="password" type="password" placeholder="Enter password" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="number">Number Input</Label>
        <Input id="number" type="number" placeholder="Enter number" />
      </div>
    </div>
  );
}

/**
 * Disabled Input Example
 */
function DisabledInputExample() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="disabled">Disabled Input</Label>
        <Input
          id="disabled"
          type="text"
          placeholder="This input is disabled"
          disabled
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="disabled-value">Disabled with Value</Label>
        <Input
          id="disabled-value"
          type="text"
          value="Cannot edit this"
          disabled
          readOnly
        />
      </div>
    </div>
  );
}

/**
 * Input with File Upload Example
 */
function FileInputExample() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="file">Upload File</Label>
      <Input id="file" type="file" />
    </div>
  );
}

/**
 * Input Examples Registry
 */
export const inputExamples: ComponentExample[] = [
  {
    id: 'default',
    title: 'Default Input',
    description: 'Basic text input with label',
    code: `import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Example() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  );
}`,
    component: DefaultInputExample,
  },
  {
    id: 'types',
    title: 'Input Types',
    description: 'Different HTML input types',
    code: `import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Example() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">Text Input</Label>
        <Input id="text" type="text" placeholder="Enter text" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Input</Label>
        <Input id="email" type="email" placeholder="email@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password Input</Label>
        <Input id="password" type="password" placeholder="Enter password" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="number">Number Input</Label>
        <Input id="number" type="number" placeholder="Enter number" />
      </div>
    </div>
  );
}`,
    component: InputTypesExample,
  },
  {
    id: 'disabled',
    title: 'Disabled State',
    description: 'Input in disabled state',
    code: `import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Example() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="disabled">Disabled Input</Label>
        <Input
          id="disabled"
          type="text"
          placeholder="This input is disabled"
          disabled
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="disabled-value">Disabled with Value</Label>
        <Input
          id="disabled-value"
          type="text"
          value="Cannot edit this"
          disabled
          readOnly
        />
      </div>
    </div>
  );
}`,
    component: DisabledInputExample,
  },
  {
    id: 'file',
    title: 'File Upload',
    description: 'File input for uploading files',
    code: `import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Example() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="file">Upload File</Label>
      <Input id="file" type="file" />
    </div>
  );
}`,
    component: FileInputExample,
  },
];

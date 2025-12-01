'use client';

import { Button } from '@workspace/ui/components/button';
import { Download, Mail, Trash2 } from 'lucide-react';
import { ComponentExample } from '../types';

/**
 * Default Button Example
 */
function DefaultButtonExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button>Click me</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  );
}

/**
 * Button Variants Example
 */
function ButtonVariantsExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}

/**
 * Button Sizes Example
 */
function ButtonSizesExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

/**
 * Button with Icons Example
 */
function ButtonWithIconsExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button>
        <Mail />
        Send Email
      </Button>
      <Button variant="outline">
        <Download />
        Download
      </Button>
      <Button variant="destructive">
        <Trash2 />
        Delete
      </Button>
      <Button size="icon">
        <Mail />
      </Button>
    </div>
  );
}

/**
 * Disabled Button Example
 */
function DisabledButtonExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button disabled>Disabled</Button>
      <Button variant="outline" disabled>
        Disabled Outline
      </Button>
      <Button variant="destructive" disabled>
        Disabled Destructive
      </Button>
    </div>
  );
}

/**
 * Button Examples Registry
 */
export const buttonExamples: ComponentExample[] = [
  {
    id: 'default',
    title: 'Default Button',
    description: 'Basic button with primary styling',
    code: `import { Button } from '@workspace/ui/components/button';

export default function Example() {
  return (
    <div className="flex gap-3">
      <Button>Click me</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  );
}`,
    component: DefaultButtonExample,
  },
  {
    id: 'variants',
    title: 'Button Variants',
    description: 'All available button style variants',
    code: `import { Button } from '@workspace/ui/components/button';

export default function Example() {
  return (
    <div className="flex gap-3">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}`,
    component: ButtonVariantsExample,
  },
  {
    id: 'sizes',
    title: 'Button Sizes',
    description: 'Different button sizes',
    code: `import { Button } from '@workspace/ui/components/button';

export default function Example() {
  return (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}`,
    component: ButtonSizesExample,
  },
  {
    id: 'with-icons',
    title: 'Buttons with Icons',
    description: 'Buttons with icon elements',
    code: `import { Button } from '@workspace/ui/components/button';
import { Mail, Download, Trash2 } from 'lucide-react';

export default function Example() {
  return (
    <div className="flex gap-3">
      <Button>
        <Mail />
        Send Email
      </Button>
      <Button variant="outline">
        <Download />
        Download
      </Button>
      <Button variant="destructive">
        <Trash2 />
        Delete
      </Button>
      <Button size="icon">
        <Mail />
      </Button>
    </div>
  );
}`,
    component: ButtonWithIconsExample,
  },
  {
    id: 'disabled',
    title: 'Disabled State',
    description: 'Buttons in disabled state',
    code: `import { Button } from '@workspace/ui/components/button';

export default function Example() {
  return (
    <div className="flex gap-3">
      <Button disabled>Disabled</Button>
      <Button variant="outline" disabled>
        Disabled Outline
      </Button>
      <Button variant="destructive" disabled>
        Disabled Destructive
      </Button>
    </div>
  );
}`,
    component: DisabledButtonExample,
  },
];

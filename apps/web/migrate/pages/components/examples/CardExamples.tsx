import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComponentExample } from '../types';

/**
 * Default Card Example
 */
function DefaultCardExample() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          This is the main content area of the card. You can put any content
          here.
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Card with Footer Example
 */
function CardWithFooterExample() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          You have 3 unread messages waiting for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Check your inbox to see the latest updates and messages from your
          team.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">Dismiss</Button>
        <Button>View Messages</Button>
      </CardFooter>
    </Card>
  );
}

/**
 * Card with Form Example
 */
function CardWithFormExample() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create Account</Button>
      </CardFooter>
    </Card>
  );
}

/**
 * Simple Card Example
 */
function SimpleCardExample() {
  return (
    <Card className="w-full max-w-md p-6">
      <h3 className="mb-2 text-lg font-semibold">Simple Card</h3>
      <p className="text-muted-foreground text-sm">
        A card without using the sub-components. Just plain content inside the
        Card wrapper.
      </p>
    </Card>
  );
}

/**
 * Card Examples Registry
 */
export const cardExamples: ComponentExample[] = [
  {
    id: 'default',
    title: 'Default Card',
    description: 'Basic card with header and content',
    code: `import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Example() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          This is the main content area of the card. You can put any content
          here.
        </p>
      </CardContent>
    </Card>
  );
}`,
    component: DefaultCardExample,
  },
  {
    id: 'with-footer',
    title: 'Card with Footer',
    description: 'Card with header, content, and footer actions',
    code: `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Example() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          You have 3 unread messages waiting for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Check your inbox to see the latest updates and messages from your
          team.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">Dismiss</Button>
        <Button>View Messages</Button>
      </CardFooter>
    </Card>
  );
}`,
    component: CardWithFooterExample,
  },
  {
    id: 'with-form',
    title: 'Card with Form',
    description: 'Card containing a form with inputs',
    code: `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Example() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create Account</Button>
      </CardFooter>
    </Card>
  );
}`,
    component: CardWithFormExample,
  },
  {
    id: 'simple',
    title: 'Simple Card',
    description: 'Card without sub-components',
    code: `import { Card } from '@/components/ui/card';

export default function Example() {
  return (
    <Card className="w-full max-w-md p-6">
      <h3 className="text-lg font-semibold mb-2">Simple Card</h3>
      <p className="text-sm text-muted-foreground">
        A card without using the sub-components. Just plain content inside the
        Card wrapper.
      </p>
    </Card>
  );
}`,
    component: SimpleCardExample,
  },
];

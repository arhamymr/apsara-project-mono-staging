import { buttonExamples } from '../examples/ButtonExamples';
import { cardExamples } from '../examples/CardExamples';
import { inputExamples } from '../examples/InputExamples';
import { ComponentMetadata } from '../types';

/**
 * Central registry of all UI components with metadata
 * This registry contains the priority components for the initial showcase
 */
export const componentRegistry: ComponentMetadata[] = [
  {
    id: 'button',
    name: 'Button',
    description:
      'Versatile button component with multiple variants, sizes, and states for user interactions',
    category: 'form',
    filePath: 'components/ui/button.tsx',
    examples: buttonExamples,
    props: [
      {
        name: 'variant',
        type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
        required: false,
        defaultValue: '"default"',
        description: 'Visual style variant of the button',
        allowedValues: [
          'default',
          'destructive',
          'outline',
          'secondary',
          'ghost',
          'link',
        ],
      },
      {
        name: 'size',
        type: '"default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"',
        required: false,
        defaultValue: '"default"',
        description: 'Size of the button',
        allowedValues: ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'],
      },
      {
        name: 'asChild',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Render as a child component using Radix Slot',
      },
    ],
    variants: [
      {
        name: 'variant',
        values: [
          'default',
          'destructive',
          'outline',
          'secondary',
          'ghost',
          'link',
        ],
        defaultValue: 'default',
      },
      {
        name: 'size',
        values: ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'],
        defaultValue: 'default',
      },
    ],
    tags: ['button', 'form', 'action', 'cta', 'interactive'],
  },
  {
    id: 'input',
    name: 'Input',
    description:
      'Text input field with consistent styling and validation states',
    category: 'form',
    filePath: 'components/ui/input.tsx',
    examples: inputExamples,
    props: [
      {
        name: 'type',
        type: 'string',
        required: false,
        defaultValue: '"text"',
        description: 'HTML input type attribute',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        description: 'Placeholder text for the input',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Whether the input is disabled',
      },
    ],
    tags: ['input', 'form', 'text', 'field'],
  },
  {
    id: 'card',
    name: 'Card',
    description:
      'Container component with header, content, and footer sections for grouping related content',
    category: 'layout',
    filePath: 'components/ui/card.tsx',
    examples: cardExamples,
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
    ],
    tags: ['card', 'container', 'layout', 'panel'],
  },
  {
    id: 'select',
    name: 'Select',
    description:
      'Dropdown select component for choosing from a list of options',
    category: 'form',
    filePath: 'components/ui/select.tsx',
    examples: [],
    props: [
      {
        name: 'value',
        type: 'string',
        required: false,
        description: 'The controlled value of the select',
      },
      {
        name: 'onValueChange',
        type: '(value: string) => void',
        required: false,
        description: 'Callback when the value changes',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Whether the select is disabled',
      },
    ],
    tags: ['select', 'dropdown', 'form', 'picker'],
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    description:
      'Checkbox input for boolean selections and multi-select scenarios',
    category: 'form',
    filePath: 'components/ui/checkbox.tsx',
    examples: [],
    props: [
      {
        name: 'checked',
        type: 'boolean | "indeterminate"',
        required: false,
        description: 'The controlled checked state',
      },
      {
        name: 'onCheckedChange',
        type: '(checked: boolean) => void',
        required: false,
        description: 'Callback when the checked state changes',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Whether the checkbox is disabled',
      },
    ],
    tags: ['checkbox', 'form', 'toggle', 'selection'],
  },
  {
    id: 'dialog',
    name: 'Dialog',
    description:
      'Modal dialog component for displaying content that requires user attention',
    category: 'feedback',
    filePath: 'components/ui/dialog.tsx',
    examples: [],
    props: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        description: 'The controlled open state',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        required: false,
        description: 'Callback when the open state changes',
      },
      {
        name: 'modal',
        type: 'boolean',
        required: false,
        defaultValue: 'true',
        description: 'Whether the dialog is modal',
      },
    ],
    tags: ['dialog', 'modal', 'overlay', 'popup'],
  },
  {
    id: 'alert',
    name: 'Alert',
    description:
      'Alert component for displaying important messages and notifications',
    category: 'feedback',
    filePath: 'components/ui/alert.tsx',
    examples: [],
    props: [
      {
        name: 'variant',
        type: '"default" | "destructive"',
        required: false,
        defaultValue: '"default"',
        description: 'Visual style variant of the alert',
        allowedValues: ['default', 'destructive'],
      },
    ],
    variants: [
      {
        name: 'variant',
        values: ['default', 'destructive'],
        defaultValue: 'default',
      },
    ],
    tags: ['alert', 'notification', 'message', 'feedback'],
  },
  {
    id: 'badge',
    name: 'Badge',
    description:
      'Small badge component for labels, tags, and status indicators',
    category: 'data-display',
    filePath: 'components/ui/badge.tsx',
    examples: [],
    props: [
      {
        name: 'variant',
        type: '"default" | "secondary" | "destructive" | "outline"',
        required: false,
        defaultValue: '"default"',
        description: 'Visual style variant of the badge',
        allowedValues: ['default', 'secondary', 'destructive', 'outline'],
      },
    ],
    variants: [
      {
        name: 'variant',
        values: ['default', 'secondary', 'destructive', 'outline'],
        defaultValue: 'default',
      },
    ],
    tags: ['badge', 'label', 'tag', 'status'],
  },
  {
    id: 'table',
    name: 'Table',
    description: 'Data table component for displaying structured tabular data',
    category: 'data-display',
    filePath: 'components/ui/table.tsx',
    examples: [],
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
    ],
    tags: ['table', 'data', 'grid', 'list'],
  },
  {
    id: 'tabs',
    name: 'Tabs',
    description:
      'Tabbed interface component for organizing content into separate views',
    category: 'navigation',
    filePath: 'components/ui/tabs.tsx',
    examples: [],
    props: [
      {
        name: 'value',
        type: 'string',
        required: false,
        description: 'The controlled value of the active tab',
      },
      {
        name: 'onValueChange',
        type: '(value: string) => void',
        required: false,
        description: 'Callback when the active tab changes',
      },
      {
        name: 'defaultValue',
        type: 'string',
        required: false,
        description: 'The default active tab value',
      },
    ],
    tags: ['tabs', 'navigation', 'switch', 'panel'],
  },
  {
    id: 'avatar',
    name: 'Avatar',
    description:
      'Avatar component for displaying user profile images with fallback',
    category: 'data-display',
    filePath: 'components/ui/avatar.tsx',
    examples: [],
    props: [
      {
        name: 'src',
        type: 'string',
        required: false,
        description: 'The image source URL',
      },
      {
        name: 'alt',
        type: 'string',
        required: false,
        description: 'Alternative text for the image',
      },
    ],
    tags: ['avatar', 'profile', 'image', 'user'],
  },
  {
    id: 'separator',
    name: 'Separator',
    description: 'Visual separator component for dividing content sections',
    category: 'layout',
    filePath: 'components/ui/separator.tsx',
    examples: [],
    props: [
      {
        name: 'orientation',
        type: '"horizontal" | "vertical"',
        required: false,
        defaultValue: '"horizontal"',
        description: 'The orientation of the separator',
        allowedValues: ['horizontal', 'vertical'],
      },
      {
        name: 'decorative',
        type: 'boolean',
        required: false,
        defaultValue: 'true',
        description: 'Whether the separator is decorative',
      },
    ],
    tags: ['separator', 'divider', 'hr', 'line'],
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    description:
      'Loading skeleton component for placeholder content while data loads',
    category: 'feedback',
    filePath: 'components/ui/skeleton.tsx',
    examples: [],
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
    ],
    tags: ['skeleton', 'loading', 'placeholder', 'shimmer'],
  },
  {
    id: 'accordion',
    name: 'Accordion',
    description:
      'Collapsible accordion component for organizing content in expandable sections',
    category: 'layout',
    filePath: 'components/ui/accordion.tsx',
    examples: [],
    props: [
      {
        name: 'type',
        type: '"single" | "multiple"',
        required: true,
        description: 'Whether single or multiple items can be open',
        allowedValues: ['single', 'multiple'],
      },
      {
        name: 'collapsible',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Whether items can be collapsed',
      },
    ],
    tags: ['accordion', 'collapse', 'expand', 'faq'],
  },
  {
    id: 'toast',
    name: 'Toast',
    description:
      'Toast notification component for displaying temporary messages',
    category: 'feedback',
    filePath: 'components/ui/toast.tsx',
    examples: [],
    props: [
      {
        name: 'variant',
        type: '"default" | "destructive"',
        required: false,
        defaultValue: '"default"',
        description: 'Visual style variant of the toast',
        allowedValues: ['default', 'destructive'],
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        description: 'Duration in milliseconds before auto-dismiss',
      },
    ],
    tags: ['toast', 'notification', 'snackbar', 'message'],
  },
];

/**
 * Get component metadata by ID
 */
export function getComponentById(id: string): ComponentMetadata | undefined {
  return componentRegistry.find((component) => component.id === id);
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: string): ComponentMetadata[] {
  return componentRegistry.filter(
    (component) => component.category === category,
  );
}

/**
 * Get all component IDs
 */
export function getComponentIds(): string[] {
  return componentRegistry.map((component) => component.id);
}

/**
 * Search components by query
 */
export function searchComponents(query: string): ComponentMetadata[] {
  const lowerQuery = query.toLowerCase();
  return componentRegistry.filter(
    (component) =>
      component.name.toLowerCase().includes(lowerQuery) ||
      component.description.toLowerCase().includes(lowerQuery) ||
      component.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      component.category.toLowerCase().includes(lowerQuery),
  );
}

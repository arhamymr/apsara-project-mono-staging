import { LucideIcon } from 'lucide-react';
import { ComponentType } from 'react';

/**
 * Component category types
 */
export type ComponentCategory =
  | 'form' // Input, Select, Checkbox, etc.
  | 'layout' // Card, Grid, Container, etc.
  | 'feedback' // Alert, Toast, Dialog, etc.
  | 'data-display' // Table, Badge, Avatar, etc.
  | 'navigation' // Tabs, Breadcrumb, Menu, etc.
  | 'editor' // Rich text editor components
  | 'animation' // Animated components
  | 'utility'; // Utility components

/**
 * Category metadata with display information
 */
export interface CategoryMetadata {
  id: ComponentCategory;
  name: string;
  description: string;
  icon: LucideIcon;
  componentCount: number;
}

/**
 * Component prop definition
 */
export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
  allowedValues?: string[];
}

/**
 * Variant definition for components with multiple styles
 */
export interface VariantDefinition {
  name: string;
  values: string[];
  defaultValue: string;
}

/**
 * Component usage example
 */
export interface ComponentExample {
  id: string;
  title: string;
  description: string;
  code: string;
  component: ComponentType;
}

/**
 * Complete component metadata
 */
export interface ComponentMetadata {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  filePath: string;
  examples: ComponentExample[];
  props?: PropDefinition[];
  variants?: VariantDefinition[];
  dependencies?: string[];
  tags?: string[];
}

/**
 * Component showcase page props
 */
export interface ComponentShowcasePageProps {
  components: ComponentMetadata[];
  categories: CategoryMetadata[];
}

/**
 * View state for the showcase
 */
export type ShowcaseView = 'catalog' | 'detail';

/**
 * Component detail view props
 */
export interface ComponentDetailProps {
  component: ComponentMetadata;
  onBack: () => void;
}

/**
 * Component preview props
 */
export interface ComponentPreviewProps {
  component: ComponentMetadata;
  exampleIndex: number;
}

/**
 * Code block props
 */
export interface CodeBlockProps {
  code: string;
  filename?: string;
  showLineNumbers?: boolean;
}

/**
 * Props table props
 */
export interface PropsTableProps {
  props: PropDefinition[];
}

/**
 * Component sidebar props
 */
export interface ComponentSidebarProps {
  categories: CategoryMetadata[];
  components: ComponentMetadata[];
  selectedComponent?: string;
  onSelectComponent: (componentId: string) => void;
}

/**
 * Component grid props
 */
export interface ComponentGridProps {
  components: ComponentMetadata[];
  onSelectComponent: (componentId: string) => void;
}

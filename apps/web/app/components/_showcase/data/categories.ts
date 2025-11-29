import {
  FileText,
  FormInput,
  Layers,
  MessageSquare,
  Navigation,
  PenTool,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { CategoryMetadata, ComponentCategory } from '../types';

/**
 * Category definitions with metadata
 */
export const categories: CategoryMetadata[] = [
  {
    id: 'form' as ComponentCategory,
    name: 'Form Elements',
    description: 'Input fields, buttons, and form controls for user input',
    icon: FormInput,
    componentCount: 0, // Will be calculated dynamically
  },
  {
    id: 'layout' as ComponentCategory,
    name: 'Layout',
    description: 'Structural components for organizing content and UI elements',
    icon: Layers,
    componentCount: 0,
  },
  {
    id: 'feedback' as ComponentCategory,
    name: 'Feedback',
    description: 'Alerts, toasts, dialogs, and other user feedback components',
    icon: MessageSquare,
    componentCount: 0,
  },
  {
    id: 'data-display' as ComponentCategory,
    name: 'Data Display',
    description: 'Tables, badges, avatars, and components for displaying data',
    icon: FileText,
    componentCount: 0,
  },
  {
    id: 'navigation' as ComponentCategory,
    name: 'Navigation',
    description: 'Tabs, breadcrumbs, menus, and navigation components',
    icon: Navigation,
    componentCount: 0,
  },
  {
    id: 'editor' as ComponentCategory,
    name: 'Editor',
    description: 'Rich text editor components and editing tools',
    icon: PenTool,
    componentCount: 0,
  },
  {
    id: 'animation' as ComponentCategory,
    name: 'Animation',
    description: 'Animated components and motion effects',
    icon: Sparkles,
    componentCount: 0,
  },
  {
    id: 'utility' as ComponentCategory,
    name: 'Utility',
    description: 'Helper components and utility functions',
    icon: Wrench,
    componentCount: 0,
  },
];

/**
 * Get category metadata by ID
 */
export function getCategoryById(
  id: ComponentCategory,
): CategoryMetadata | undefined {
  return categories.find((cat) => cat.id === id);
}

/**
 * Get all category IDs
 */
export function getCategoryIds(): ComponentCategory[] {
  return categories.map((cat) => cat.id);
}

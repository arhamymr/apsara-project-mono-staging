/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentData } from './types';

export function getDefaultProps(
  type: ComponentData['type'],
): Record<string, any> {
  switch (type) {
    case 'header':
      return { title: 'My App', showNav: true };
    case 'hero':
      return {
        title: 'Welcome to Our App',
        subtitle: 'Build amazing things',
        showButton: true,
      };
    case 'features':
      return { title: 'Features', items: 3 };
    case 'cta':
      return { title: 'Get Started Today', buttonText: 'Sign Up' };
    case 'footer':
      return { copyright: '© 2024 My App' };
    case 'text':
      return { size: 'medium', align: 'left' };
    case 'image':
      return { width: 400, height: 300, alt: 'Placeholder image' };
    case 'button':
      return { variant: 'default', size: 'default' };
    default:
      return {};
  }
}

export function getDefaultContent(type: ComponentData['type']): string {
  switch (type) {
    case 'text':
      return 'Your text content goes here';
    case 'button':
      return 'Click me';
    default:
      return '';
  }
}

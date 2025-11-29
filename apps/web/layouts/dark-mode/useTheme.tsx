'use client';
import * as React from 'react';
import { ThemeContext } from './theme-provider';

export function useTheme() {
  return React.useContext(ThemeContext);
}

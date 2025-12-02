'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export const TableElementStatic = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, children, ...props }, ref) => (
  <table ref={ref} className={cn('w-full border-collapse', className)} {...props}>
    {children}
  </table>
));
TableElementStatic.displayName = 'TableElementStatic';

export const TableRowElementStatic = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, children, ...props }, ref) => (
  <tr ref={ref} className={cn('border-b', className)} {...props}>
    {children}
  </tr>
));
TableRowElementStatic.displayName = 'TableRowElementStatic';

export const TableCellElementStatic = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <td ref={ref} className={cn('border p-2', className)} {...props}>
    {children}
  </td>
));
TableCellElementStatic.displayName = 'TableCellElementStatic';

export const TableCellHeaderElementStatic = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <th ref={ref} className={cn('border p-2 font-bold', className)} {...props}>
    {children}
  </th>
));
TableCellHeaderElementStatic.displayName = 'TableCellHeaderElementStatic';

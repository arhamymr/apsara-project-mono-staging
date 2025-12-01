'use client';

import { Badge } from '@workspace/ui/components/badge';
import { PropsTableProps } from '../types';

export function PropsTable({ props }: PropsTableProps) {
  if (!props || props.length === 0) {
    return (
      <div className="border-border bg-muted/30 dark:bg-muted/10 rounded-lg border p-8 text-center">
        <p className="text-muted-foreground text-sm leading-relaxed">
          No props documentation available for this component.
        </p>
      </div>
    );
  }

  // Validate props data
  const validProps = props.filter(
    (prop) => prop && typeof prop.name === 'string' && prop.name.trim() !== '',
  );

  if (validProps.length === 0) {
    return (
      <div className="border-border bg-muted/30 dark:bg-muted/10 rounded-lg border p-8 text-center">
        <p className="text-destructive text-sm font-semibold">
          Invalid props data
        </p>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
          The props configuration for this component is invalid.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border overflow-x-auto rounded-lg border shadow-sm">
      <table
        className="w-full border-collapse"
        role="table"
        aria-label="Component properties"
      >
        <thead>
          <tr className="border-border bg-muted/50 dark:bg-muted/20 border-b">
            <th
              className="text-foreground px-5 py-3.5 text-left text-sm font-semibold tracking-tight"
              scope="col"
            >
              Name
            </th>
            <th
              className="text-foreground px-5 py-3.5 text-left text-sm font-semibold tracking-tight"
              scope="col"
            >
              Type
            </th>
            <th
              className="text-foreground px-5 py-3.5 text-left text-sm font-semibold tracking-tight"
              scope="col"
            >
              Default
            </th>
            <th
              className="text-foreground px-5 py-3.5 text-left text-sm font-semibold tracking-tight"
              scope="col"
            >
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {validProps.map((prop, index) => (
            <tr
              key={prop.name}
              className={`border-border border-b last:border-0 ${
                index % 2 === 0
                  ? 'bg-background dark:bg-background/50'
                  : 'bg-muted/20 dark:bg-muted/10'
              } hover:bg-muted/40 dark:hover:bg-muted/20 transition-colors`}
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <code className="text-foreground font-mono text-sm font-medium">
                    {prop.name}
                  </code>
                  {prop.required && (
                    <Badge
                      variant="destructive"
                      className="h-5 px-2 py-0.5 text-xs font-medium"
                      aria-label="Required property"
                    >
                      required
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-5 py-3.5">
                <code className="text-muted-foreground font-mono text-xs leading-relaxed break-words">
                  {formatType(prop.type)}
                </code>
                {prop.allowedValues && prop.allowedValues.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {prop.allowedValues.map((value) => (
                      <Badge
                        key={value}
                        variant="outline"
                        className="h-5 px-2 py-0.5 font-mono text-xs"
                      >
                        {value}
                      </Badge>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-5 py-3.5">
                {prop.defaultValue ? (
                  <code className="text-muted-foreground font-mono text-xs">
                    {prop.defaultValue}
                  </code>
                ) : (
                  <span className="text-muted-foreground text-xs italic">
                    -
                  </span>
                )}
              </td>
              <td className="px-5 py-3.5">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {prop.description}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Format TypeScript types for better readability
 */
function formatType(type: string): string {
  // Add line breaks for union types if they're too long
  if (type.length > 50 && type.includes('|')) {
    return type.replace(/\s*\|\s*/g, ' | ');
  }
  return type;
}

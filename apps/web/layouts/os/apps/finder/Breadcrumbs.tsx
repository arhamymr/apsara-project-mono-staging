import { Fragment } from 'react';

import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbItem as UiBreadcrumbItem,
} from '@/components/ui/breadcrumb';

type FinderBreadcrumb = {
  name: string;
  prefix: string;
};

interface BreadcrumbsProps {
  rootLabel?: string;
  breadcrumbs: FinderBreadcrumb[];
  onClick: (prefix: string) => void;
}

export function Breadcrumbs({
  rootLabel = 'Home',
  breadcrumbs,
  onClick,
}: BreadcrumbsProps) {
  const items: FinderBreadcrumb[] = [
    { name: rootLabel, prefix: '' },
    ...breadcrumbs,
  ];

  const lastIndex = items.length - 1;

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-muted-foreground flex items-center text-xs"
    >
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((crumb, index) => {
            const isLast = index === lastIndex;
            const key = `${crumb.prefix || 'root'}-${index}`;

            return (
              <Fragment key={key}>
                <UiBreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{crumb.name || 'Untitled'}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        onClick(crumb.prefix);
                      }}
                    >
                      {crumb.name || 'Untitled'}
                    </BreadcrumbLink>
                  )}
                </UiBreadcrumbItem>
                {!isLast ? <BreadcrumbSeparator>/</BreadcrumbSeparator> : null}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
}

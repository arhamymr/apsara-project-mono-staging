import React from 'react';

type SectionProps = React.ComponentPropsWithoutRef<'section'>;

export function Section({ id, className, children, ...rest }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-7xl px-4 py-20 md:px-6 ${className ?? ''}`}
      {...rest}
    >
      {children}
    </section>
  );
}

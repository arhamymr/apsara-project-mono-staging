import { ReactNode } from 'react';

interface LegalSectionProps {
  title: string;
  content: string | ReactNode;
  subsections?: Array<{
    title: string;
    content: string | ReactNode;
  }>;
  id?: string;
}

export function LegalSection({
  title,
  content,
  subsections,
  id,
}: LegalSectionProps) {
  return (
    <section
      id={id}
      className="mb-8 scroll-mt-20 sm:mb-10 lg:mb-12"
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <h2
        id={id ? `${id}-heading` : undefined}
        className="mb-4 text-xl font-semibold sm:text-2xl lg:text-3xl"
      >
        {title}
      </h2>

      <div className="text-muted-foreground space-y-3 text-sm sm:space-y-4 sm:text-base">
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>

      {subsections && subsections.length > 0 && (
        <div className="mt-6 space-y-6 sm:mt-8 sm:space-y-8">
          {subsections.map((subsection, index) => (
            <div key={index}>
              <h3 className="mb-3 text-lg font-medium sm:text-xl lg:text-2xl">
                {subsection.title}
              </h3>
              <div className="text-muted-foreground text-sm sm:text-base">
                {typeof subsection.content === 'string' ? (
                  <p>{subsection.content}</p>
                ) : (
                  subsection.content
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

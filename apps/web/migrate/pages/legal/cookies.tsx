import { LegalSection } from '@/components/legal/LegalSection';
import { LegalLayout } from '@/layouts/LegalLayout';
import { slugify } from '@/lib/legal-utils';

interface Section {
  title: string;
  content: string | React.ReactNode;
  subsections?: Array<{
    title: string;
    content: string | React.ReactNode;
  }>;
}

interface Props {
  content: {
    sections: Section[];
  };
  lastUpdated: string;
}

export default function CookiePolicy({ content, lastUpdated }: Props) {
  return (
    <LegalLayout
      title="Cookie Policy"
      lastUpdated={lastUpdated}
      showTableOfContents
    >
      {content.sections.map((section, index) => (
        <LegalSection
          key={index}
          id={slugify(section.title)}
          title={section.title}
          content={section.content}
          subsections={section.subsections}
        />
      ))}
    </LegalLayout>
  );
}

'use client';

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

// Static cookie policy content
const cookieContent: { sections: Section[] } = {
  sections: [
    {
      title: 'What Are Cookies',
      content: 'Cookies are small text files that are stored on your device when you visit a website. They help us provide you with a better experience.',
    },
    {
      title: 'Types of Cookies We Use',
      content: 'We use different types of cookies for various purposes.',
      subsections: [
        {
          title: 'Essential Cookies',
          content: 'These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas.',
        },
        {
          title: 'Analytics Cookies',
          content: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
        },
        {
          title: 'Functional Cookies',
          content: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences.',
        },
        {
          title: 'Marketing Cookies',
          content: 'These cookies are used to track visitors across websites to display relevant advertisements.',
        },
      ],
    },
    {
      title: 'Managing Cookies',
      content: 'You can control and manage cookies in your browser settings. Please note that removing or blocking cookies may impact your user experience.',
    },
    {
      title: 'Third-Party Cookies',
      content: 'Some cookies are placed by third-party services that appear on our pages. We do not control these cookies and recommend reviewing the privacy policies of these third parties.',
    },
    {
      title: 'Updates to This Policy',
      content: 'We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.',
    },
    {
      title: 'Contact Us',
      content: 'If you have any questions about our use of cookies, please contact us at privacy@example.com.',
    },
  ],
};

const lastUpdated = '2024-01-15';

export default function CookiePolicyPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      lastUpdated={lastUpdated}
      showTableOfContents
    >
      {cookieContent.sections.map((section, index) => (
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

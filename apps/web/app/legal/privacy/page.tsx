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

// Static privacy policy content
const privacyContent: { sections: Section[] } = {
  sections: [
    {
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.',
      subsections: [
        {
          title: 'Personal Information',
          content: 'This includes your name, email address, postal address, phone number, and payment information.',
        },
        {
          title: 'Usage Information',
          content: 'We automatically collect information about your use of our services, including your IP address, browser type, and pages visited.',
        },
      ],
    },
    {
      title: 'How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.',
    },
    {
      title: 'Information Sharing',
      content: 'We do not sell your personal information. We may share your information with service providers who assist us in operating our services.',
    },
    {
      title: 'Data Security',
      content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.',
    },
    {
      title: 'Your Rights',
      content: 'You have the right to access, correct, or delete your personal information. You may also opt out of certain data collection practices.',
    },
    {
      title: 'Contact Us',
      content: 'If you have any questions about this Privacy Policy, please contact us at privacy@example.com.',
    },
  ],
};

const lastUpdated = '2024-01-15';

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated={lastUpdated}
      showTableOfContents
    >
      {privacyContent.sections.map((section, index) => (
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

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

// Static terms of service content
const termsContent: { sections: Section[] } = {
  sections: [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
    },
    {
      title: 'Use of Services',
      content: 'You may use our services only for lawful purposes and in accordance with these Terms.',
      subsections: [
        {
          title: 'Account Responsibilities',
          content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
        },
        {
          title: 'Prohibited Activities',
          content: 'You agree not to engage in any activity that interferes with or disrupts our services or servers.',
        },
      ],
    },
    {
      title: 'Intellectual Property',
      content: 'All content, features, and functionality of our services are owned by us and are protected by copyright, trademark, and other intellectual property laws.',
    },
    {
      title: 'User Content',
      content: 'You retain ownership of any content you submit to our services. By submitting content, you grant us a license to use, modify, and display that content.',
    },
    {
      title: 'Limitation of Liability',
      content: 'To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages.',
    },
    {
      title: 'Termination',
      content: 'We may terminate or suspend your access to our services immediately, without prior notice, for any reason whatsoever.',
    },
    {
      title: 'Changes to Terms',
      content: 'We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page.',
    },
    {
      title: 'Contact Us',
      content: 'If you have any questions about these Terms, please contact us at legal@example.com.',
    },
  ],
};

const lastUpdated = '2024-01-15';

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated={lastUpdated}
      showTableOfContents
    >
      {termsContent.sections.map((section, index) => (
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

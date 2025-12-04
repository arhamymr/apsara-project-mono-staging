import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arham - Frontend Developer & UI/UX Designer | Portfolio',
  description: 'Portfolio of Arham, a Frontend Developer and UI/UX Designer specializing in modern web applications.',
};

export default function MeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

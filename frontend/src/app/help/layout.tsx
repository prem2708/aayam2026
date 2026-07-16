import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help & FAQs | Aayam TechFest 2026',
  description: 'Support and FAQs for Aayam TechFest 2026.',
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

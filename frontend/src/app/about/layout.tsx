import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Aayam TechFest 2026',
  description: 'Learn more about Aayam TechFest 2026, our journey, and the organizing team.',
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

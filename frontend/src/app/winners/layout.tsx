import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Winners | Aayam TechFest 2026',
  description: 'Past winners and hall of fame of Aayam TechFest.',
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function WinnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Space_Grotesk, Outfit } from 'next/font/google';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Providers } from '@/components/providers';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Aayam TechFest 2026 | Register for Events',
    template: '%s | Aayam TechFest',
  },
  description:
    'Discover and register for technical, cultural, gaming, workshop, and hackathon events at Aayam TechFest 2026 — India\'s premier college technical festival.',
  keywords: ['Aayam TechFest', 'tech fest', 'college fest', 'hackathon', 'events', 'registration'],
  openGraph: {
    title: 'Aayam TechFest 2026',
    description: 'Innovate. Compete. Celebrate. Register for fest events now.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Aayam TechFest',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aayam TechFest 2026',
    description: 'Register for technical festival events',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${spaceGrotesk.variable} ${outfit.variable} h-full`}>
        <body className="min-h-full flex flex-col antialiased bg-background text-foreground">
          <Providers>
            <Navbar />
            <main className="flex-1 pt-20">{children}</main>
            <Footer />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

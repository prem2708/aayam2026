import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Sora, DM_Sans } from 'next/font/google';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Providers } from '@/components/providers';
import './globals.css';

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Aayam TechFest 2026 | RKDF UNIVERSITY RANCHI',
    template: '%s | Aayam TechFest',
  },
  description:
    'Discover and register for technical, cultural, gaming, workshop, and hackathon events at Aayam TechFest 2026 — India\'s premier college technical festival.',
  keywords: ['Aayam TechFest', 'tech fest', 'college fest', 'hackathon', 'events', 'registration'],
  icons: {
    icon: 'https://ik.imagekit.io/ioyklag3bb/ChatGPT%20Image%20Jun%2019,%202026,%2001_03_57%20PM.png',
  },
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
  
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${sora.variable} ${dmSans.variable} h-full`} suppressHydrationWarning>
        <body className="min-h-full flex flex-col antialiased bg-background text-foreground" suppressHydrationWarning>
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

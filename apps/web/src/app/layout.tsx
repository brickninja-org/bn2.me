import type { Metadata, Viewport } from 'next';
import type { LayoutProps } from '@/lib/next';

import './globals.css';

import { Bitter, Inter } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider';

import { cn } from '@brickninja-org/ui/lib';

const bitter = Bitter({
  subsets: ['latin' as const],
  weight: '700',
  variable: '--font-bitter',
});

const inter = Inter({
  subsets: ['latin'],
});

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className={cn(bitter.variable, inter.className)} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider search={{ enabled: false }}>
          {children}
          <div className="p-4 border-t text-sm text-muted">
            <p>This site is not affiliated with LEGO Group, Brickset, Rebrickable, or any of their partners. All copyrights reserved to their respective owners.</p>
            <p>LEGO®, the LEGO® logo, the Minifigure, and the Brick and Knob configurations are trademarks of the LEGO® Group of Companies. © 2025 The LEGO® Group. brick.ninja and all content not covered by The LEGO® Group&apos;s copyright is, unless otherwise stated. bn2.me respects the LEGO® Fair Play rules.</p>
          </div>
        </RootProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    template: '%s · bn2.me',
    default: ''
  },
  description: 'Securely manage BN2 API access',
};


export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { color: '#f4f4f5', media: '(prefers-color-scheme: light)' },
    { color: '#111111', media: '(prefers-color-scheme: dark)' },
  ],
  userScalable: false,
  width: 'device-width',
};

import type { LayoutProps } from '@/lib/next';

import './globals.css';

import { Bitter } from 'next/font/google';
import Link from 'next/link';

import { LinkButton } from '@brickninja-org/ui/components/form/Button';

import { getBn2MeUrl } from '@/lib/client';

const bitter = Bitter({
  subsets: ['latin' as const],
  weight: '700',
  variable: '--font-bitter',
});

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html dir="ltr" lang="en" className={bitter.variable} suppressHydrationWarning>
      <head>
        <meta httpEquiv="origin-trial" content="A0iLUx2K54eCfcOLtbrWCwJbKP2wFWAYv9KKHE4f5Mupdq2UV89VMP/oflBf1IYyusxSQq0eWnRyRM7u8s65/Q0AAAB2eyJvcmlnaW4iOiJodHRwczovL2JuMi5tZTo0NDMiLCJmZWF0dXJlIjoiRmVkQ21CdXR0b25Nb2RlIiwiZXhwaXJ5IjoxNzQ0Njc1MjAwLCJpc1N1YmRvbWFpbiI6dHJ1ZSwiaXNUaGlyZFBhcnR5Ijp0cnVlfQ=="/>
      </head>
      <body>
        <div className="header border-b border-(--color-border)">
          <div className="flex items-center gap-4 w-full h-(--header-height,48px) max-w-(--max-page-width) mx-auto px-4 leading-4">
            <Link href="/" className="flex gap-4 font-bitter text-xl text-black">
              bn2.me Demo
            </Link>

            <LinkButton appearance="menu" href="/fed-cm">FedCM</LinkButton>
            <LinkButton appearance="menu" href={getBn2MeUrl()} external icon="bn2me" className="ml-auto">Return to bn2.me</LinkButton>
          </div>
        </div>
        <div className="w-full max-w-(--max-page-width) mx-auto p-4">
          {children}
        </div>
      </body>
    </html>
  );
}

export const metadata = {
  title: {
    template: '%s · bn2.me',
    default: '',
  },
  description: 'Try out bn2.me with this demo application',
};

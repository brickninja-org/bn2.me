import type { LayoutProps } from '@/lib/next';

import './globals.css';

import Link from 'next/link';
import { Bitter } from 'next/font/google';

import { cn } from '@brickninja-org/ui/lib';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { DataTableContext } from '@brickninja-org/ui/components/table/DataTable.context';

import { getUser } from '@/lib/session';

const bitter = Bitter({
  subsets: ['latin' as const],
  weight: '700',
  variable: '--font-bitter',
});

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: LayoutProps) {
  const user = await getUser();

  return (
    <html lang="en" className={cn(bitter.variable)}>
      <body>
        <div className="flex flex-col min-h-[100svh]">
          <div className="sticky top-0 flex gap-4 items-center h-12 px-(--max-page-width--padding) bg-white border-b leading-4 z-3">
            {/* <Icon icon="bn2me" color="var(--color-brand)"/> */}
            <Link href="/" className="font-bitter text-xl">bn2.me</Link>
            <div className="hidden sm:inline-block">by <a href="https://brick.ninja/" className="text-brand underline-offset-2 hover:underline">brick.ninja</a></div>
            <nav>
              <LinkButton appearance="menu" href="/discover" className="hidden sm:inline-flex">Discover</LinkButton>
              <LinkButton appearance="menu" href="/extension" className="hidden sm:inline-flex">Extension</LinkButton>
            </nav>
            <div className="ml-auto">
              <LinkButton appearance="menu" href={user ? '/profile' : '/login'} icon="person">{user ? user.name : 'Login'}</LinkButton>
            </div>
          </div>
          <hr className="sticky top-12 -mb-[1px] h-[1px] bg-transparent z-2"/>
          <DataTableContext>
            {children}
          </DataTableContext>
          <div className="flex justify-between gap-4 flex-wrap border-t py-4 px-(--max-page-width--padding)">
            <div className="text-inherit"><b>bn2.me</b> by <a href="https://brick.ninja/">brick.ninja</a> © {new Date().getFullYear()}</div>
            <div className="flex gap-4 flex-wrap">
              <Link href="/dev/docs">Developer Documentation</Link>
              <Link href="/legal">Legal Notice</Link>
              <Link href="/legal/privacy-policy">Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="p-4 border-t text-sm text-muted">
          <p>This site is not affiliated with LEGO Group, Brickset, Rebrickable, or any of their partners. All copyrights reserved to their respective owners.</p>
          <p>LEGO®, the LEGO® logo, the Minifigure, and the Brick and Knob configurations are trademarks of the LEGO® Group of Companies. © 2025 The LEGO® Group. brick.ninja and all content not covered by The LEGO® Group&apos;s copyright is, unless otherwise stated. bn2.me respects the LEGO® Fair Play rules.</p>
        </div>
      </body>
    </html>
  );
}

export const metadata = {
  title: {
    template: '%s · bn2.me',
    default: ''
  },
  description: 'Securely manage BN2 API access',
};

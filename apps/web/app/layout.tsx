import '@/styles/app.css';
// import '@brickninja-org/ui/styles/globals.css';

import type { ReactNode } from 'react';
import { Bitter } from 'next/font/google';
import Link from 'next/link';

import { cn } from '@brickninja-org/ui/lib';
import { DataTableContext } from '@brickninja-org/ui/components/table/data-table-context';
import { LinkButton } from '@brickninja-org/ui/components/form/button';

import { getUser } from '@/lib/session';

interface RootLayoutProps {
  children: ReactNode;
}

const bitter = Bitter({
  subsets: ['latin' as const],
  weight: '700',
  variable: '--font-bitter',
});

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: RootLayoutProps) {
  const user = await getUser();

  return (
    <html lang="en" className={cn(bitter.variable /*, wotfard.variable */)}>
      <body>
        <div className="flex flex-col min-h-[100svh]">
          <div className="sticky top-0 flex gap-4 items-center h-12 p-4 bg-white border-b z-[2]">
            {/* <Icon icon="gw2me" color="var(--color-brand)"/> */}
            <Link href="/" className="mt-0.5 font-bitter text-xl underline-offset-2 hover:underline">bn2.me</Link>
            <div className="hidden sm:inline-block">by <a href="https://brick.ninja/" className="text-red-700 underline-offset-2 hover:underline">brick.ninja</a></div>
            <nav>
              <LinkButton appearance="menu" href="/discover" className="hidden sm:inline-flex">Discover</LinkButton>
              <LinkButton appearance="menu" href="/extension" className="hidden sm:inline-flex">Extension</LinkButton>
            </nav>
            <div className="ml-auto">
              <LinkButton appearance="menu" href={user ? '/profile' : '/login'}>{user ? user.name : 'Login'}</LinkButton>
            </div>
          </div>
          <DataTableContext>
            {children}
          </DataTableContext>
          <div className="flex justify-between gap-4 flex-wrap border-t p-4">
            <div className=""><b>bn2.me</b> by <a href="https://brick.ninja/">brick.ninja</a> © {new Date().getFullYear()}</div>
            <div className="flex gap-4 flex-wrap">
              <Link href="/dev/docs">Developer Documentation</Link>
              <Link href="/legal">Legal Notice</Link>
              <Link href="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="p-4 border-t text-sm">
          <p>This site is not affiliated with ArenaNet, Guild Wars 2, or any of their partners. All copyrights reserved to their respective owners.</p>
          <p>© ArenaNet LLC. All rights reserved. NCSOFT, ArenaNet, Guild Wars, Guild Wars 2, GW2, Guild Wars 2: Heart of Thorns, Guild Wars 2: Path of Fire, Guild Wars 2: End of Dragons, and Guild Wars 2: Secrets of the Obscure and all associated logos, designs, and composite marks are trademarks or registered trademarks of NCSOFT Corporation.</p>
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

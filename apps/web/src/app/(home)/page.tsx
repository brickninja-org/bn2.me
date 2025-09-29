import type { FC, ReactNode } from 'react';
import type { Metadata } from 'next';

import { cn } from '@heroui/react';
import { Table } from '@brickninja-org/ui/components/table/Table';

import { getSession } from '@/lib/session';
import { LinkButton } from '@/components/button/link-button';
import { Iconify } from '@/components/iconify/iconify.client';
import { BrowserCard } from './browser-card';
import { ExampleConnectCard } from './example-connect-card';
import { VersionChip } from './version-chip';

export default async function HomePage() {
  const session = await getSession();

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col">
      <section className="z-10 flex flex-col items-center pt-20 text-center">
        <div className="mx-auto max-w-2xl flex flex-col items-center justify-center gap-y-4">
          <VersionChip/>
          <h1 className="bg-linear-to-r from-accent to-accent/70 bg-clip-text font-bold leading-[1.25] tracking-tight text-3xl text-center text-transparent sm:text-4xl lg:text-5xl">Securely Manage your<br/>BrickNinja API Keys</h1>
          <p className="text-muted text-balance text-lg">Some text will be placed here...</p>
          <div className="mt-2 flex gap-3">
            <LinkButton href="/dev/docs" size="lg" variant="primary"><span>Explore Docs</span></LinkButton>
            {!session && (<LinkButton href="/login" size="lg" variant="tertiary">Get Started</LinkButton>)}
          </div>
        </div>
      </section>

      <div className="flex-1 flex flex-col pt-32 pb-16">
        <div className="max-w-(--max-page-width) mx-auto px-4">
          <BrowserCard className="h-full min-h-[560px] max-h-none lg:max-h-[920px] max-w-(--max-page-width) mt-4 mb-32 lg:mr-8 px-4 rounded-lg overflow-visible">
            <ExampleConnectCard/>
          </BrowserCard>

          <div className="flex flex-col-reverse gap-8 items-center lg:flex-row lg:items-start mt-8 mb-16">
            <div className="relative shrink-0 w-[400px] max-w-full pt-1 rounded-lg bg-background/67 shadow-md overflow-x-auto whitespace-nowrap md:overflow-clip">
              <Table>
                <thead><tr><th>Account</th><th>Verified</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>account.1234</td><td className="text-accent"><Iconify icon="shield-check" className="inline-block"/> Verified</td><td className="text-success"><Iconify icon="heart-pulse" className="inline-block"/> Healthy</td></tr>
                  <tr><td>another.9876</td><td/><td className="text-success"><Iconify className="inline-block" icon="heart-pulse"/> Healthy</td></tr>
                  <tr><td colSpan={3}><Iconify icon="plus" className="inline-flex w-5 h-5 p-0.5"/> Add Account</td></tr>
                </tbody>
              </Table>
            </div>

            <div>
              <SectionHeader>Manage your brick.ninja Accounts</SectionHeader>
              <p className="mb-6">Manage all your brick.ninja Accounts in a single place. Applications will only be able to access the information from the accounts you authorize. You can update the accounts an application has access to at any time.</p>
              <p className="mb-6">You will be guided through the process of adding new accounts to bn2.me. You can also verify your ownership of accounts, and applications will be able to use this information.</p>
              <p className="mb-6">bn2.me will monitor the status of your API keys and inform you when you need to take action.</p>
              <LinkButton href="/accounts" icon="chevron-right" variant="ghost" className="discoverButton"><span>Add your Accounts</span></LinkButton>
            </div>
          </div>

          <SectionHeader>For Developers</SectionHeader>
          <p className="mb-6">If you are a developer, you can integrate bn2.me into your applications. bn2.me will take care of the authorization and brick.ninja account management, so you can focus on developing your application.</p>
          <p className="mb-6">Since bn2.me is an OAuth 2.0 provider, you can use existing libraries to use bn2.me in your application. Or use our extensive developer documentation to call the few API endpoints yourself.</p>
          <LinkButton href="/dev/docs" icon="chevron-right" variant="ghost"><span>Check Documentation</span></LinkButton>
        </div>
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: 'bn2.me · Securely manage your brick.ninja API keys',
};

const SectionHeader: FC<{ children: ReactNode, className?: string }> = ({ children, className }) => {
  return (
    <div className={cn('mb-4 leading-10 font-bitter font-bold text-[32px]', className)}>{children}</div>
  );
};

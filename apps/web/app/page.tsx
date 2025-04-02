import type { Metadata } from 'next';

import NextLink from 'next/link';

import { cn, Icon } from '@brickninja-org/ui';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';

import { getSession } from '@/lib/session';
import { ApplicationImage } from '@/components/application/ApplicationImage';
import { PermissionList } from '@/components/permission/PermissionList';
import { FC, ReactNode } from 'react';
import { Table } from '@brickninja-org/ui/components/table/Table';

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="flex-1 flex flex-col">
      <div className="absolute top-12 w-full h-[1px] bg-white z-2"/>

      <div className="">
        <div className="">
          <div className="w-fit mt-16 mx-auto bg-linear-to-r from-red-900 to-red-700 bg-clip-text font-bold leading-[1.25] text-6xl text-center text-transparent">Securely Manage your<br/>BrickNinja API Keys</div>
          {!session && (<NextLink href="/login" className="flex items-center justify-center gap-4 w-48 mt-8 mx-auto p-3 rounded-xs bg-red-800 text-white">Get Started</NextLink>)}
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-32 pb-16 grad bg-[radial-gradient(ellipse_1200px_500px_at_center_500px,#b7000d33,transparent)] no-repeat">
        <div className="max-w-(--max-page-width) mx-auto px-4">
          <div className="relative flex flex-col h-full min-h-[560px] max-h-[920px] max-w-(--max-page-width) mt-4 mb-32 mr-8 -ml-8 px-4 rounded-lg bg-[#ffffffaa] shadow-xs shadow-[inset 0 2px 1px -1px #ffffff22]">
            <div className="flex items-center justify-center gap-2 my-4 mx-32 p-2 rounded-lg bg-gray-100 text-gray-600"><Icon icon="lock-open"/> example.com</div>
            <div className="flex-1 mb-4 pt-8 pb-1 pr-[460px] pl-4">
              <SectionHeader>Connect Applications</SectionHeader>
              <p className="mb-6">Connect your Rebrickable accounts directly to applications. You do not have to create an API key and copy-paste it for every application anymore. If you have multiple accounts, you can simply choose the accounts the application should have access to.</p>
              <p className="mb-6">For all applications with bn2.me integration it is just one click to authorize access to your Rebrickable accounts. You review the requested permissions and authorize them using the secure OAuth 2.0 protocol. The application will only receive the permissions you granted.</p>
              <LinkButton href="/discover" icon="chevron-right" appearance="menu" className="[--icon-color:var(--color-brand)]"><span>Discover Applications</span></LinkButton>
            </div>
            <div className="absolute -bottom-16 -right-8 max-w-[460px] p-8 rounded-xs shadow-sm bg-white">
              <SectionHeader className="flex items-center gap-4">
                <ApplicationImage fileId={null} size={48}/>
                example.com
              </SectionHeader>
              <hr className="h-0 my-4 border-t-2"/>
              <p className="mb-6">example.com wants to access the following data of your bn2.me account.</p>
              <div className="grid gap-3 [grid-template-columns:16px_auto] mb-2 py-2 px-4 rounded-xs border"><Icon icon="person"/> Your username</div>
              <div className="grid gap-3 [grid-template-columns:16px_auto] mb-2 py-2 px-4 rounded-xs border">
                <Icon icon="window-dev-tools"/>
                <div>
                  Read-only access to the Rebrickable API
                  <PermissionList permissions={['account', 'collections']}/>
                </div>
              </div>
              <hr className="h-0 my-4 border-t-2"/>
              <div>Select Accounts</div>
              <div className="flex gap-2 items-center mt-4"><Icon icon="checkmark" className="w-5 h-5 p-0.5 rounded-xs bg-focus text-white"/>Main Account (account.1234)<Icon icon="verified"/></div>
              <div className="flex gap-2 items-center mt-4"><Icon icon="add" className="w-5 h-5 p-0.5"/>Add account</div>
              <hr className="h-0 my-4 border-t-2"/>
              <div className="p-3 border rounded-xs border-green-700 bg-green-100 text-green-800 text-center leading-4"><Icon icon="user"/> Authorize example.com</div>
            </div>
          </div>

          <div className="flex gap-8 items-center mt-8 mb-16">
            <div className="relative shrink-0 w-[400px] max-w-full pt-1 rounded-lg bg-[#ffffffaa] shadow-[inset_0_2px_1px_-1px_#ffffff22] overflow-x-auto whitespace-nowrap md:overflow-clip">
              <Table>
                <thead><tr><th>Account</th><th>Verified</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>account.1234</td><td className="text-blue-600"><Icon icon="verified"/> Verified</td><td className="text-green-600"><Icon icon="status"/> Healthy</td></tr>
                  <tr><td>another.9876</td><td/><td className="text-green-600"><Icon icon="status"/> Healthy</td></tr>
                  <tr><td colSpan={3}><Icon icon="add" className="inline-flex w-5 h-5 p-0.5"/> Add Account</td></tr>
                </tbody>
              </Table>
            </div>

            <div>
              <SectionHeader>Manage your Guild Wars 2 Accounts</SectionHeader>
              <p>Manage all your Guild Wars 2 Accounts in a single place. Applications will only be able to access the information from the accounts you authorize. You can update the accounts an application has access to at any time.</p>
              <p>You will be guided through the process of adding new accounts to gw2.me. You can also verify your ownership of accounts, and applications will be able to use this information.</p>
              <p>gw2.me will monitor the status of your API keys and inform you when you need to take action.</p>
              <LinkButton href="/accounts" icon="chevron-right" appearance="menu" className="discoverButton"><span>Add your Accounts</span></LinkButton>
            </div>
          </div>

          <SectionHeader>For Developers</SectionHeader>
          <p>If you are a developer, you can integrate gw2.me into your applications. gw2.me will take care of the authorization and Guild Wars 2 account management, so you can focus on developing your application.</p>
          <p>Since gw2.me is an OAuth 2.0 provider, you can use existing libraries to use gw2.me in your application. Or use our extensive developer documentation to call the few API endpoints yourself.</p>
          <LinkButton href="/dev/docs" icon="chevron-right" appearance="menu" className="[--icon-color:var(--color-brand)]"><span>Check Documentation</span></LinkButton>
        </div>
      </div>
    </div>
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

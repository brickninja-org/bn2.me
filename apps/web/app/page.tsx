import type { Metadata } from 'next';

import NextLink from 'next/link';

import { Icon } from '@brickninja-org/ui';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';

import { getSession } from '@/lib/session';
import { ApplicationImage } from '@/components/application/ApplicationImage';
import { PermissionList } from '@/components/permission/PermissionList';

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
          <div className="relative flex flex-col h-full min-h-[560px] max-h-[920px] max-w-(--max-page-width) mt-4 mb-8 mr-8 -ml-8 px-4 rounded-lg bg-[#ffffffaa] shadow-xs shadow-[inset 0 2px 1px -1px #ffffff22]">
            <div className="flex items-center justify-center gap-2 my-4 mx-32 p-2 rounded-lg bg-gray-100 text-gray-600"><Icon icon="lock-open"/> example.com</div>
            <div className="flex-1 mb-4 pt-8 pb-1 pr-[460px] pl-4">
              <div className="mb-4 font-bitter font-bold text-3xl">Connect Applications</div>
              <p className="mb-6">Connect your Rebrickable accounts directly to applications. You do not have to create an API key and copy-paste it for every application anymore. If you have multiple accounts, you can simply choose the accounts the application should have access to.</p>
              <p className="mb-6">For all applications with bn2.me integration it is just one click to authorize access to your Rebrickable accounts. You review the requested permissions and authorize them using the secure OAuth 2.0 protocol. The application will only receive the permissions you granted.</p>
              <LinkButton href="/discover" icon="chevron-right" iconColor="var(--nextui-primary)"><span>Discover Applications</span></LinkButton>
            </div>
            <div className="absolute -bottom-16 -right-8 max-w-[460px] p-8 rounded-xs shadow-sm bg-white">
              <div className="mb-4 font-bitter font-bold text-3xl flex items-center gap-4">
                <ApplicationImage fileId={null} size={48}/>
                example.com
              </div>
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
              <div className="p-3 border rounded-xs border-green-700 bg-green-100 text-green-800 text-center leading-4"><Icon icon="bn2me-outline"/> Authorize example.com</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export const metadata: Metadata = {
  title: 'bn2.me · Securely manage your brick.ninja API keys',
};

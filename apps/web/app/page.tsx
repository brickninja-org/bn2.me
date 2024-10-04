import NextLink from 'next/link';

import { getSession } from '@/lib/session';
import type { Metadata } from 'next';

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="flex-1 flex flex-col">
      <div className="absolute top-12 w-full h-[1px] bg-white z-[2]"/>

      <div className="">
        <div className="">
          <div className="w-fit mt-16 mx-auto bg-gradient-to-r from-red-900 to-red-700 bg-clip-text font-bold leading-[1.25] text-6xl text-center text-transparent">Securely Manage your<br/>BrickNinja API Keys</div>
          {!session && (<NextLink href="/login" className="flex items-center justify-center gap-4 w-48 mt-8 mx-auto p-3 rounded-sm bg-red-800 text-white">Get Started</NextLink>)}
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-32 pb-16">
        <div className="max-w-[--max-page-width] mx-auto px-4">
          <div className="relative flex flex-col h-full min-h-[560px] max-h-[920px] max-w-[--max-page-width] mt-4 mb-8 mr-8 -ml-8 px-4 rounded-lg bg-[#ffffffaa] shadow-sm shadow-[inset 0 2px 1px -1px #ffffffaa]">
            <div className="flex items-center justify-center gap-2 my-4 mx-32 p-2 rounded-lg bg-gray-100 text-gray-600">www.example.com</div>
            <div className="flex-1 mb-4 pt-8 pb-1 pr-[460px] pl-4">Browser content</div>
          </div>
        </div>
      </div>

    </div>
  );
}

export const metadata: Metadata = {
  title: 'bn2.me · Securely manage your brick.ninja API keys',
};

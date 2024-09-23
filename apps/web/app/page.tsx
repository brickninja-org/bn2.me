import NextLink from 'next/link';

import { getSession } from '@/lib/session';
import type { Metadata } from 'next';

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="flex-1 flex flex-col">
      <div className="absolute top-12 w-full h-[1px] bg-white z-[2]"/>

      <div className="hero">
        <div className="intro">
          <div className="w-fit mt-16 mx-auto bg-gradient-to-r from-red-900 to-red-700 bg-clip-text font-bold leading-[1.25] text-6xl text-center text-transparent">Securely Manage your<br/>BrickNinja API Keys</div>
          {!session && (<NextLink href="/login" className="flex items-center justify-center gap-4 w-48 mt-8 mx-auto p-3 rounded-sm bg-red-800 text-white">Get Started</NextLink>)}
        </div>
      </div>

      <div className="content">
        <div className="contentWidth">
          <div className="browser">B</div>
        </div>
      </div>

    </div>
  );
}

export const metadata: Metadata = {
  title: 'bn2.me · Securely manage your brick.ninja API keys',
};

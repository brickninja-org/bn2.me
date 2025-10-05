import type { Metadata } from 'next';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { getSession } from '@/lib/session';
import { PageLayout } from '@/components/layout/PageLayout';
import { LoginForm } from './form';
import { Callout } from 'fumadocs-ui/components/callout';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect('/profile');
  }

  const cookieStore = await cookies();

  return (
    <PageLayout thin>
      <Headline id="login">Login</Headline>

      {cookieStore.has('logout') && (
        <Callout>Logout successful</Callout>
      )}

      <LoginForm/>
    </PageLayout>
  );
}

export const metadata: Metadata = {
  title: 'Login',
};

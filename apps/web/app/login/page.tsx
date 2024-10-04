import type { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Headline } from '@brickninja-org/ui/components/headline';
import { Notice } from '@brickninja-org/ui/components/notice';

import { getSession } from '@/lib/session';
import { PageLayout } from '@/components/layout/PageLayout';
import { LoginForm } from './form';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    revalidatePath('/profile');
    redirect('/profile');
  }

  return (
    <PageLayout thin>
      <Headline id="login">Login</Headline>

      {cookies().has('logout') && (
        <Notice>Logout successful</Notice>
      )}

      <LoginForm/>
    </PageLayout>
  );
}

export const metadata: Metadata = {
  title: 'Login',
};

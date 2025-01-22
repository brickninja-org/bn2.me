import { Icon } from '@brickninja-org/ui';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { LoginForm } from 'app/login/form';
import { PageLayout } from '@/components/layout/PageLayout';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function FedCMLoginPage() {
  const session = await getSession();

  if (session) {
    return (
      <PageLayout thin>
        <div style={{ '--icon-size': '64px' }}>
          <Icon icon="loading" color="var(--color-primary)"/>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout thin>
      <Headline id="login">Login</Headline>
      <LoginForm returnTo="/fed-cm/login"/>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Login',
};

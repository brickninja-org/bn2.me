import type { Metadata } from 'next';

import { cache } from 'react';
import { revalidatePath } from 'next/cache';

import { UserProviderType } from '@bn2me/database';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Button } from '@brickninja-org/ui/components/form/Button';
import { Form } from '@brickninja-org/ui/components/form/Form';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';
import { Table } from '@brickninja-org/ui/components/table/Table';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';

import { db } from '@/lib/db';
import { getSession, getSessionOrRedirect } from '@/lib/session';
import { PageLayout } from '@/components/layout/PageLayout';
import { Provider } from '@/components/provider/Provider';
import { FormatDate } from '@/components/format/FormatDate';
import { NoticeContext } from '@/components/notice/NoticeContext';
import { PasskeyRegistrationButton } from '@/components/passkey/PasskeyRegistrationButton';

import { providers as availableProviders } from 'src/app/auth/providers';
import { GoogleIcon } from 'src/app/auth/google';
import { GitHubIcon } from 'src/app/auth/github';
import { login } from '@/app/(home)/login/action';
import { getLoginErrorCookieValue, LoginError } from '@/app/(home)/login/form';

const getUserData = cache(async () => {
  const currentSession = await getSessionOrRedirect();

  const [sessions, providers] = await Promise.all([
    db.userSession.findMany({
      where: { userId: currentSession.userId },
      orderBy: { lastUsed: 'desc' }
    }),

    db.userProvider.findMany({
      where: { userId: currentSession.userId },
      orderBy: { createdAt: 'asc' }
    }),
  ]);

  return {
    currentSession,
    sessions,
    providers
  };
});

export default async function ProfilePage() {
  const { currentSession, sessions, providers } = await getUserData();
  const providerError = await getLoginErrorCookieValue();

  const Providers = createDataTable(providers, ({ provider, providerAccountId }) => `${provider}.${providerAccountId}`);

  return (
    <PageLayout>
      <Headline id="providers">Login Providers</Headline>

      {providers.length <= 1 && (
        <Notice>You currently only have one login provider. For added security, it&apos;s recommended to have at least one backup login method.</Notice>
      )}

      <p>You can login with any of the login providers listed below.</p>

      <Providers.Table>
        <Providers.Column id="provider" title="Provider" sortBy="provider">
          {({ provider }) => <Provider provider={provider}/>}
        </Providers.Column>
        <Providers.Column id="user" title="User" sortBy="displayName">{({ displayName }) => displayName}</Providers.Column>
        <Providers.Column id="createdAt" title="Created" sortBy="createdAt" align="end">
          {({ createdAt }) => <FormatDate date={createdAt}/>}
        </Providers.Column>
        <Providers.Column id="usedAt" title="Last Used" sortBy="usedAt" align="end">
          {({ usedAt }) => usedAt ? <FormatDate date={usedAt}/> : 'never'}
        </Providers.Column>
      </Providers.Table>

      <p>Add additional login providers to make sure you can always login.</p>

      <Form action={login.bind(null, 'add', {})}>
        {providerError === LoginError.Unknown && (<Notice type="error">Unknown error</Notice>)}
        {providerError === LoginError.WrongUser && (<Notice type="error">The login provider you tried to add is already linked to a different user.</Notice>)}

        <NoticeContext>
          <FlexRow wrap>
            <PasskeyRegistrationButton/>
            {availableProviders[UserProviderType.google] && (<Button type="submit" name="provider" value="google" icon={<GoogleIcon/>}>Add Google</Button>)}
            {availableProviders[UserProviderType.github] && (<Button type="submit" name="provider" value="github" icon={<GitHubIcon/>}>Add GitHub</Button>)}
          </FlexRow>
        </NoticeContext>
      </Form>

      <Headline id="sessions" actions={<form action={revokeAllSessions}><Button type="submit" icon="delete">Revoke all</Button></form>}>Sessions</Headline>
      <Table>
        <thead>
          <tr>
            <th>Session</th>
            <th>Started</th>
            <th>Last Active</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id}>
              <td>{session.info}{session.id === currentSession.id && ' (Current Session)'}</td>
              <td><FormatDate date={session.createdAt}/></td>
              <td><FormatDate date={session.lastUsed}/></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageLayout>
  );
}

export const metadata: Metadata = {
  title: 'Login Providers'
};

async function revokeAllSessions() {
  'use server';

  const session = await getSession();

  if(!session) {
    return;
  }

  await db.userSession.deleteMany({
    where: { id: { not: session.id }, userId: session.userId }
  });

  revalidatePath('/providers');
}

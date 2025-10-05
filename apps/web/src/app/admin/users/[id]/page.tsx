import type { Metadata } from 'next';
import type { FormState } from '@brickninja-org/ui/components/form/Form';

import { cache } from 'react';

import { FormatDate } from '@/components/format/FormatDate';
import { Code } from '@/components/layout/Code';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageTitle } from '@/components/layout/PageTitle';
import { ColumnSelection } from '@/components/table/ColumnSelection';
import { db } from '@/lib/db';
import { getFormDataString } from '@/lib/form-data';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Form } from '@brickninja-org/ui/components/form/Form';
import { Button } from '@brickninja-org/ui/components/form/Button';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';
import { ensureUserIsAdmin } from 'src/app/admin/admin';
import { notFound } from 'next/navigation';
import { Icon } from '@brickninja-org/ui';
import { Provider } from '@/components/provider/Provider';
import { Features, State } from 'src/app/admin/authorization-requests/components';
import { AuthorizationRequestState } from '@bn2me/database';
import { isExpired } from '@/lib/date';
import { AuthorizationRequestData } from 'src/app/(authorize)/authorize/types';

const getUser = cache(function getUser(id: string) {
  return db.user.findUnique({
    where: { id },
    include: {
      authorizations: {
        include: {
          application: { select: { name: true, imageId: true }},
        },
      },
      accounts: {
        select: { id: true, accountId: true, accountName: true, displayName: true, verified: true, createdAt: true, apiTokens: { select: { id: true }}},
      },
      providers: true,
      emails: {
        include: { _count: { select: { applicationGrants: true }}},
        orderBy: { email: 'asc' },
      },
      sessions: { orderBy: { lastUsed: 'desc' }},
      authorizationRequests: {
        include: {
          client: { select: { application: { select: { imageId: true, name: true }}}},
        },
        orderBy: { createdAt: 'desc' },
        take: 250,
      },
    },
  });
});

export default async function AdminUserDetailPage({ params }: PageProps<'/admin/users/[id]'>) {
  await ensureUserIsAdmin();
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  const Authorizations = createDataTable(user.authorizations, ({ id }) => id);
  const Accounts = createDataTable(user.accounts, ({ id }) => id);
  const Providers = createDataTable(user.providers, ({ provider, providerAccountId }) => `${provider}:${providerAccountId}`);
  const Emails = createDataTable(user.emails, ({ id }) => id);
  const Sessions = createDataTable(user.sessions, ({ id }) => id);
  const AuthorizationRequests = createDataTable(user.authorizationRequests, ({ id }) => id);

  return (
    <PageLayout>
      <PageTitle>{user.name}</PageTitle>

      <Headline id="authorizations" actions={<ColumnSelection table={Authorizations}/>}>Authorizations ({user.authorizations.length})</Headline>
      <Authorizations.Table>
        <Authorizations.Column id="id" title="Id" hidden>{({ id }) => <Code inline borderless>{id}</Code>}</Authorizations.Column>
        <Authorizations.Column id="app" title="App">{({ application }) => <FlexRow>{/* <ApplicationImage fileId={client.application.imageId}/> */} {application.name}</FlexRow>}</Authorizations.Column>
        <Authorizations.Column id="clientId" title="Client Id" hidden>{({ clientId }) => <Code inline borderless>{clientId}</Code>}</Authorizations.Column>
        <Authorizations.Column id="applicationId" title="Application Id" hidden>{({ applicationId }) => <Code inline borderless>{applicationId}</Code>}</Authorizations.Column>
        <Authorizations.Column id="type" title="Type" sortBy="type">{({ type }) => type}</Authorizations.Column>
        <Authorizations.Column id="scope" title="Scope" hidden>{({ scope }) => scope.join(' ')}</Authorizations.Column>
        <Authorizations.Column id="createdAt" title="Created At" sortBy="createdAt">{({ createdAt }) => <FormatDate date={createdAt}/>}</Authorizations.Column>
        <Authorizations.Column id="expiresAt" title="Expires At" sortBy="expiresAt">{({ expiresAt }) => expiresAt ? <FormatDate date={expiresAt}/> : 'Never'}</Authorizations.Column>
        <Authorizations.Column id="usedAt" title="Used At" sortBy="usedAt">{({ usedAt }) => usedAt ? <FormatDate date={usedAt}/> : 'Never'}</Authorizations.Column>
      </Authorizations.Table>

      <Headline id="accounts" actions={<ColumnSelection table={Accounts}/>}>Accounts ({user.accounts.length})</Headline>
      <Accounts.Table>
        <Accounts.Column id="id" title="Id" hidden>{({ id }) => <Code inline borderless>{id}</Code>}</Accounts.Column>
        <Accounts.Column id="accountId" title="Account Id" hidden>{({ accountId }) => <Code inline borderless>{accountId}</Code>}</Accounts.Column>
        <Accounts.Column id="name" title="Name">{({ accountName }) => accountName}</Accounts.Column>
        <Accounts.Column id="display" title="Display Name">{({ displayName }) => displayName}</Accounts.Column>
        <Accounts.Column id="verified" title="Verified">{({ verified }) => verified && <Icon icon="checkmark"/>}</Accounts.Column>
        <Accounts.Column id="tokens" title="API keys">{({ apiTokens }) => apiTokens.length}</Accounts.Column>
        <Accounts.Column id="createdAt" title="Created At" sortBy="createdAt">{({ createdAt }) => <FormatDate date={createdAt}/>}</Accounts.Column>
      </Accounts.Table>

      <Headline id="providers" actions={<ColumnSelection table={Providers}/>}>Providers ({user.providers.length})</Headline>
      <Providers.Table>
        <Providers.Column id="provider" title="Provider">{({ provider }) => <Provider provider={provider}/>}</Providers.Column>
        <Providers.Column id="providerId" title="Provider Id" hidden>{({ providerAccountId }) => <Code inline borderless>{providerAccountId}</Code>}</Providers.Column>
        <Providers.Column id="name" title="Name">{({ displayName }) => displayName}</Providers.Column>
        <Providers.Column id="createdAt" title="Created At" sortBy="createdAt">{({ createdAt }) => <FormatDate date={createdAt}/>}</Providers.Column>
        <Providers.Column id="usedAt" title="Used At" sortBy="usedAt">{({ usedAt }) => usedAt ? <FormatDate date={usedAt}/> : 'never'}</Providers.Column>
      </Providers.Table>

      <Headline id="emails" actions={<ColumnSelection table={Emails}/>}>Emails ({user.emails.length})</Headline>
      <Form action={emailAction}>
        <Emails.Table>
          <Emails.Column id="id" title="Id" hidden>{({ id }) => <Code inline borderless>{id}</Code>}</Emails.Column>
          <Emails.Column id="email" title="Email">{({ email }) => email}</Emails.Column>
          <Emails.Column id="default" title="Default">{({ isDefaultForUserId }) => isDefaultForUserId && <Icon icon="checkmark"/>}</Emails.Column>
          <Emails.Column id="verified" title="Verified">{({ verified, verificationToken }) => verified ? <Icon icon="checkmark"/> : !!verificationToken && <Icon icon="time"/>}</Emails.Column>
          <Emails.Column id="grants" title="Grants">{({ _count }) => _count.applicationGrants}</Emails.Column>
          <Emails.Column id="createdAt" title="Created At" sortBy="createdAt">{({ createdAt }) => <FormatDate date={createdAt}/>}</Emails.Column>
          <Emails.Column small title="Actions" id="actions">
            {({ id, verified }) => (
              <FlexRow>
                <Button icon="mail" disabled={verified} type="submit" name={EMAIL_ACTION_SEND_VERIFICATION} value={id}>Send Verification</Button>
              </FlexRow>
            )}
          </Emails.Column>
        </Emails.Table>
      </Form>

      <Headline id="sessions" actions={<ColumnSelection table={Sessions}/>}>Sessions ({user.sessions.length})</Headline>
      <Sessions.Table>
        <Sessions.Column id="session" title="Session">{({ info }) => info}</Sessions.Column>
        <Sessions.Column id="createdAt" title="Created At" sortBy="createdAt">{({ createdAt }) => <FormatDate date={createdAt}/>}</Sessions.Column>
        <Sessions.Column id="lastUsedAt" title="Last Used At" sortBy="lastUsed">{({ lastUsed }) => <FormatDate date={lastUsed}/>}</Sessions.Column>
      </Sessions.Table>

      <Headline id="authRequests" actions={<ColumnSelection table={AuthorizationRequests}/>}>Authorization Requests ({user.authorizationRequests.length})</Headline>
      <AuthorizationRequests.Table>
        <AuthorizationRequests.Column id="id" title="Id" hidden>{({ id }) => <Code inline borderless>{id}</Code>}</AuthorizationRequests.Column>
        <AuthorizationRequests.Column id="type" title="Type" sortBy="type">{({ type }) => type}</AuthorizationRequests.Column>
        <AuthorizationRequests.Column id="state" title="Status" sortBy="state">{({ state, expiresAt }) => <State state={state === AuthorizationRequestState.Pending && isExpired(expiresAt) ? 'Expired' : state}/>}</AuthorizationRequests.Column>
        <AuthorizationRequests.Column id="app" title="Application" sortBy="clientId">{({ client }) => <FlexRow>{/* <ApplicationImage fileId={client.application.imageId}/> */} {client.application.name}</FlexRow>}</AuthorizationRequests.Column>
        <AuthorizationRequests.Column id="features" title="Features">{({ type, data }) => <Features type={type} data={(data as unknown as AuthorizationRequestData)}/>}</AuthorizationRequests.Column>
        <AuthorizationRequests.Column id="createAt" title="Created At" sortBy="createdAt">{({ createdAt }) => <FormatDate date={createdAt}/>}</AuthorizationRequests.Column>
        <AuthorizationRequests.Column id="updatedAt" title="Updated At" sortBy="updatedAt" hidden>{({ updatedAt }) => <FormatDate date={updatedAt}/>}</AuthorizationRequests.Column>
        <AuthorizationRequests.Column id="expiresAt" title="Expires At" sortBy="expiresAt" hidden>{({ expiresAt }) => expiresAt ? <FormatDate date={expiresAt}/> : 'never'}</AuthorizationRequests.Column>
      </AuthorizationRequests.Table>
    </PageLayout>
  );
}

export async function generateMetadata({ params }: PageProps<'/admin/users/[id]'>): Promise<Metadata> {
  await ensureUserIsAdmin();
  const { id } = await params;
  const user = await getUser(id);

  return {
    title: `User ${user?.name}`
  };
}

const EMAIL_ACTION_SEND_VERIFICATION = 'send-verification';

// eslint-disable-next-line require-await
async function emailAction(_: FormState, formData: FormData): Promise<FormState> {
  'use server';

  const sendVerification = getFormDataString(formData, EMAIL_ACTION_SEND_VERIFICATION);

  try {
    if(sendVerification) {
      // await sendEmailVerificationMail(sendVerification);
      return { success: 'Verification email sent.' };
    }
  } catch(e) {
    console.error(e);
    return { error: 'Internal server error' };
  }

  return { error: 'Unknown action' };
}

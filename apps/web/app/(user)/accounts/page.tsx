import { cache } from 'react';
import { redirect } from 'next/navigation';

import { AuthorizationType } from '@bn2me/database';
import { Icon } from '@brickninja-org/ui';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';

import { getSessionOrRedirect } from '@/lib/session';
import { db } from '@/lib/db';
import { PageLayout } from '@/components/layout/PageLayout';

const getAccounts = cache(async () => {
  const session = await getSessionOrRedirect();

  const accounts = await db.account.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'asc' },
    include: {
      _count: {
        select: {
          authorizations: { where: { type: AuthorizationType.AccessToken }},
          apiTokens: true
        }
      }
    },
  });

  return { accounts };
});

export default async function ProfilePage() {
  const { accounts } = await getAccounts();

  if(accounts.length === 0) {
    redirect('/accounts/add');
  }

  const Accounts = createDataTable(accounts, ({ id }) => id);

  return (
    <PageLayout>
      <Headline id="accounts" actions={<LinkButton href="/accounts/add" icon="key-add">Add API Key</LinkButton>}>Guild Wars 2 Accounts</Headline>

      {accounts.length > 0 && (
        <Accounts.Table>
          <Accounts.Column title="Account" id="accounts">
            {({ displayName, accountName }) => <><Icon icon="person"/> <b>{displayName ?? accountName}</b> {displayName && `(${accountName})`}</>}
          </Accounts.Column>
          <Accounts.Column title="Verified" id="verified" sortBy={({ verified }) => verified ? 1 : 0}>
            {({ verified }) => <FlexRow><Icon icon={verified ? 'verified' : 'unverified'}/> {verified ? 'Verified' : 'Not Verified'}</FlexRow>}
          </Accounts.Column>
          <Accounts.Column title="Authorized Applications" id="apps" align="end" sortBy={({ _count }) => _count.authorizations}>
            {({ _count }) => _count.authorizations}
          </Accounts.Column>
          <Accounts.Column title="API Keys" id="keys" align="end" sortBy={({ _count }) => _count.authorizations}>
            {({ _count }) => _count.apiTokens}
          </Accounts.Column>
          <Accounts.Column small title="Actions" id="actions">
            {({ id, verified }) => (
              <FlexRow>
                <LinkButton href={`/accounts/${id}`} icon="settings">Manage</LinkButton>
                {!verified && (<LinkButton href={`/accounts/${id}/verify`} icon="verified">Verify</LinkButton>)}
              </FlexRow>
            )}
          </Accounts.Column>
        </Accounts.Table>
      )}
    </PageLayout>
  );
}

export const metadata = {
  title: 'Accounts'
};

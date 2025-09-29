import { Icon } from '@brickninja-org/ui';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';
import { Tip } from '@brickninja-org/ui/components/tip/Tip';

import { db } from '@/lib/db';
import { FormatDate } from '@/components/format/FormatDate';
import { Code } from '@/components/layout/Code';
import { PageLayout } from '@/components/layout/PageLayout';
import { ProviderIcon } from '@/components/provider/Provider';
import { ColumnSelection } from '@/components/table/ColumnSelection';

import { ensureUserIsAdmin } from '../admin';

function getUsers() {
  return db.user.findMany({
    include: {
      _count: { select: { applications: true, authorizations: true, accounts: true }},
      sessions: { take: 1, orderBy: { lastUsed: 'desc' }, select: { lastUsed: true }},
      defaultEmail: { select: { email: true }},
      providers: { select: { provider: true, providerAccountId: true, displayName: true }, orderBy: { provider: 'asc' }},
    },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function AdminUserPage() {
  await ensureUserIsAdmin();
  const users = await getUsers();
  const Users = createDataTable(users, (user) => user.id);

  return (
    <PageLayout>
      <Headline id="users" actions={<ColumnSelection table={Users}/>}>Users ({users.length})</Headline>

      <Users.Table>
        <Users.Column id="id" title="ID" hidden>{({ id }) => <Code inline borderless>{id}</Code>}</Users.Column>
        <Users.Column id="name" title="UserName" sortBy="name">{({ name }) => name}</Users.Column>
        <Users.Column id="providers" title="Providers" sortBy="name">
          {({ providers }) => (
            <FlexRow>
              {providers.map((provider) => (<Tip key={`${provider.provider}-${provider.providerAccountId}`} tip={provider.displayName}><ProviderIcon provider={provider.provider}/></Tip>))}
            </FlexRow>
          )}
        </Users.Column>
        <Users.Column id="email" title="Email" sortBy={({ defaultEmail }) => defaultEmail?.email} hidden>{({ defaultEmail }) => defaultEmail?.email}</Users.Column>
        <Users.Column id="roles" title="Roles" sortBy={({ roles }) => roles.length} hidden>{({ roles }) => roles.join(', ')}</Users.Column>
        <Users.Column id="auths" title="Authorizations" sortBy={({ _count }) => _count.authorizations} align="end">{({ _count }) => _count.authorizations}</Users.Column>
        <Users.Column id="accounts" title="Accounts" sortBy={({ _count }) => _count.accounts} align="end">{({ _count }) => _count.accounts}</Users.Column>
        <Users.Column id="createdAt" title="Created At" sortBy="createdAt">{({ createdAt }) => <FormatDate date={createdAt}/>}</Users.Column>
        <Users.Column id="session" title="Last access" sortBy={({ sessions }) => sessions[0]?.lastUsed}>{({ sessions }) => sessions.length > 0 ? <FormatDate date={sessions[0].lastUsed}/> : '-'}</Users.Column>
        <Users.Column id="action" title="Actions" small>{({ id }) => <LinkButton appearance="menu" href={`/admin/users/${id}`} iconOnly><Icon icon="eye"/></LinkButton>}</Users.Column>
      </Users.Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Users',
};

import { FormatDate } from '@/components/format/FormatDate';
import { Code } from '@/components/layout/Code';
import { PageLayout } from '@/components/layout/PageLayout';
import { ColumnSelection } from '@/components/table/ColumnSelection';
import { db } from '@/lib/db';
import { Icon } from '@brickninja-org/ui';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { CopyButton } from '@brickninja-org/ui/components/form/buttons/CopyButton';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';
import { ensureUserIsAdmin } from 'src/app/admin/admin';
import Link from 'next/link';

function getApiKeys() {
  return db.apiToken.findMany({
    include: {
      account: {
        select: {
          accountId: true,
          accountName: true,
          displayName: true,
          verified: true,
          userId: true,
          user: { select: { name: true }},
          _count: { select: { applicationGrants: true }},
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export default async function AdminApiKeyPage() {
  await ensureUserIsAdmin();

  const apiKeys = await getApiKeys();
  const ApiKeys = createDataTable(apiKeys, (apiKey) => apiKey.id);

  return (
    <PageLayout>
      <Headline id="apikeys" actions={<ColumnSelection table={ApiKeys}/>}>API Keys ({apiKeys.length})</Headline>

      <ApiKeys.Table>
        <ApiKeys.Column id="id" title="ID" hidden>{({ id }) => <Code inline borderless>{id}</Code>}</ApiKeys.Column>
        <ApiKeys.Column id="name" title="Name" sortBy="name">{({ name }) => name}</ApiKeys.Column>
        <ApiKeys.Column id="token" title="Token" hidden>{({ token }) => <FlexRow><Code inline borderless>{token}</Code><CopyButton copy={token} icon="copy" iconOnly/></FlexRow>}</ApiKeys.Column>
        {/* <ApiKeys.Column id="permissions" title="Permissions" hidden>{({ permissions }) => <PermissionCount permissions={permissions as Permission[]}/>}</ApiKeys.Column> */}
        <ApiKeys.Column id="error" title="Error Count" align="end" sortBy="errorCount">{({ errorCount }) => errorCount}</ApiKeys.Column>
        <ApiKeys.Column id="usedAt" title="Last used" sortBy="usedAt">{({ usedAt }) => usedAt === null ? '-' : <FormatDate date={usedAt}/>}</ApiKeys.Column>
        <ApiKeys.Column id="accountId" title="Account Id" hidden>{({ accountId }) => <Code inline borderless>{accountId}</Code>}</ApiKeys.Column>
        <ApiKeys.Column id="account" title="Account Name" sortBy={({ account }) => account.accountName}>{({ account }) => account.accountName}</ApiKeys.Column>
        <ApiKeys.Column id="accountDisplay" title="Account Display Name" sortBy={({ account }) => account.displayName}>{({ account }) => account.displayName}</ApiKeys.Column>
        <ApiKeys.Column id="verified" title="Verified" sortBy={({ account }) => account.verified.toString()}>{({ account }) => <Icon icon={account.verified ? 'checkmark' : 'cancel'}/>}</ApiKeys.Column>
        <ApiKeys.Column id="owner" title="Owner" sortBy={({ account }) => account.user.name}>{({ account }) => <Link href={`/admin/users/${account.userId}`}><FlexRow><Icon icon="user"/>{account.user.name}</FlexRow></Link>}</ApiKeys.Column>
        <ApiKeys.Column id="auths" title="App Grants" sortBy={({ account }) => account._count.applicationGrants} align="end">{({ account }) => account._count.applicationGrants}</ApiKeys.Column>
        <ApiKeys.Column id="createdAt" title="Created At" sortBy="createdAt">{({ createdAt }) => <FormatDate date={createdAt}/>}</ApiKeys.Column>
      </ApiKeys.Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'API Keys',
};

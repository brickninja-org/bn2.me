import { Table } from '@brickninja-org/ui/components/table/Table';

import { Code } from '@/components/layout/Code';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageTitle } from '@/components/layout/PageTitle';

export default function DevDocsScopesPage() {
  return (
    <PageLayout>
      <PageTitle>Scopes</PageTitle>
      <p>bn2.me API endpoints each require specific permissions. When you authorizing a user, you will need to provide a list of scopes that is required by your application.</p>

      <p>This is a list of all supported scopes. Scopes with the prefix <Code inline>rb:</Code> are Rebrickable API permissions that are set on generated subtokens.</p>

      <Table>
        <thead>
          <tr>
            <Table.HeaderCell>Scope</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Code inline>identify</Code></td>
            <td>Get the username from /api/user</td>
          </tr>
        </tbody>
      </Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Scopes',
};

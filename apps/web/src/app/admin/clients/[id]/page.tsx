import type { Metadata } from 'next';

import { cache } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Icon } from '@brickninja-org/ui';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';

import { db } from '@/lib/db';
import { FormatDate } from '@/components/format/FormatDate';
import { Code } from '@/components/layout/Code';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageTitle } from '@/components/layout/PageTitle';
import { ColumnSelection } from '@/components/table/ColumnSelection';

import { ensureUserIsAdmin } from 'src/app/admin/admin';
import { isTruthy } from '@brickninja-org/helper/is';

const getClient = cache(function getClient(id: string) {
  return db.client.findUnique({
    where: { id },
    include: {
      application: true,
      authorizations: {
        include: {
          user: true,
        }
      },
    }
  });
});

export default async function AdminUserDetailPage({ params }: PageProps<'/admin/clients/[id]'>) {
  await ensureUserIsAdmin();
  const { id } = await params;
  const client = await getClient(id);

  if(!client) {
    notFound();
  }

  const Authorizations = createDataTable(client.authorizations, ({ id }) => id);

  const now = new Date();

  return (
    <PageLayout>
      <PageTitle>{client.application.name} / {client.id}</PageTitle>

      <Headline id="authorizations" actions={<ColumnSelection table={Authorizations}/>}>Authorizations ({client.authorizations.length})</Headline>
      <Authorizations.Table>
        <Authorizations.Column id="id" title="Id" hidden>{({ id }) => <Code inline borderless>{id}</Code>}</Authorizations.Column>
        <Authorizations.Column id="type" title="Type" sortBy="type">{({ type }) => type}</Authorizations.Column>
        <Authorizations.Column id="flags" title="Flags">{({ codeChallenge, dpopJkt }) => [codeChallenge && 'PKCE', dpopJkt && 'DPoP'].filter(isTruthy).join(', ')}</Authorizations.Column>
        <Authorizations.Column id="user" title="User" sortBy="userId">{({ user }) => <Link href={`/admin/users/${user.id}`}><FlexRow><Icon icon="person"/>{user.name}</FlexRow></Link>}</Authorizations.Column>
        <Authorizations.Column id="scope" title="Scope" hidden>{({ scope }) => scope.join(' ')}</Authorizations.Column>
        <Authorizations.Column id="createdAt" title="Created At" sortBy="createdAt">{({ createdAt }) => <FormatDate date={createdAt}/>}</Authorizations.Column>
        <Authorizations.Column id="expiresAt" title="Expires At" sortBy="expiresAt">{({ expiresAt }) => expiresAt ? (expiresAt < now ? <s><FormatDate date={expiresAt}/></s> : <FormatDate date={expiresAt}/>) : 'Never'}</Authorizations.Column>
        <Authorizations.Column id="usedAt" title="Used At" sortBy="usedAt">{({ usedAt }) => usedAt ? <FormatDate date={usedAt}/> : 'Never'}</Authorizations.Column>
      </Authorizations.Table>
    </PageLayout>
  );
}

export async function generateMetadata({ params }: PageProps<'/admin/clients/[id]'>): Promise<Metadata> {
  await ensureUserIsAdmin();
  const { id } = await params;
  const client = await getClient(id);

  return {
    title: `Application ${client?.application.name} / ${client?.id}`
  };
}

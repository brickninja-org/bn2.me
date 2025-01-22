import Link from 'next/link';

import { Icon } from '@brickninja-org/ui';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';

import { db } from '@/lib/db';
import { ApplicationImage } from '@/components/application/ApplicationImage';
import { FormatDate } from '@/components/format/FormatDate';
import { Code } from '@/components/layout/Code';
import { PageLayout } from '@/components/layout/PageLayout';
import { ColumnSelection } from '@/components/table/ColumnSelection';

import { ensureUserIsAdmin } from '../admin';

function getApps() {
  return db.client.findMany({
    include: {
      application: {
        select: {
          name: true,
          imageId: true,
          publicUrl: true,
          owner: { select: { id: true, name: true }},
          email: { select: { email: true }},
        },
      },
      _count: { select: { authorizations: true }},
      authorizations: {
        take: 1,
        where: { usedAt: { not: null }},
        orderBy: { usedAt: 'desc' },
        select: { usedAt: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export default async function AdminAppsPage() {
  await ensureUserIsAdmin();
  const apps = await getApps();
  const Apps = createDataTable(apps, (app) => app.id);

  return (
    <PageLayout>
      <Headline id="apps" actions={<ColumnSelection table={Apps}/>}>Apps ({apps.length})</Headline>

      <Apps.Table>
        <Apps.Column id="id" title="Id" hidden>{({ id }) => <Code inline borderless>{id}</Code>}</Apps.Column>
        <Apps.Column id="name" title="Name" sortBy={({ application }) => application.name}>{({ application }) => <FlexRow><ApplicationImage fileId={application.imageId}/> {application.name}</FlexRow>}</Apps.Column>
        <Apps.Column id="public" title="Public URL" sortBy={({ application }) => application.name} hidden>{({ application }) => application.publicUrl}</Apps.Column>
        <Apps.Column id="owner" title="Owner" sortBy={({ application }) => application.owner.name}>{({ application }) => <Link href={`/admin/users/${application.owner.id}`}><FlexRow><Icon icon="person"/>{application.owner.name}</FlexRow></Link>}</Apps.Column>
        <Apps.Column id="email" title="Email" sortBy={({ application }) => application.email?.email} hidden>{({ application }) => application.email?.email}</Apps.Column>
        <Apps.Column id="auths" title="Authorizations" sortBy={({ _count }) => _count.authorizations} align="end">{({ _count }) => _count.authorizations}</Apps.Column>
        <Apps.Column id="createdAt" title="Created At" sortBy="createdAt">{({ createdAt }) => <FormatDate date={createdAt}/>}</Apps.Column>
        <Apps.Column id="lastUsedAt" title="Last used" sortBy={({ authorizations }) => authorizations[0]?.usedAt}>{({ authorizations }) => authorizations[0]?.usedAt ? <FormatDate date={authorizations[0].usedAt}/> : '-'}</Apps.Column>
        <Apps.Column id="action" title="Actions" small>{({ id }) => <LinkButton appearance="menu" href={`/admin/clients/${id}`} iconOnly><Icon icon="eye"/></LinkButton>}</Apps.Column>
      </Apps.Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Apps'
};

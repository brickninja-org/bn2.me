import type { PageProps } from '@/lib/next';

import { db } from '@/lib/db';
import { getSessionOrRedirect } from '@/lib/session';
import { notExpired } from '@/lib/db/helper';
import Link from 'next/link';
import { Code } from '@/components/layout/Code';
import { FormatDate } from '@/components/format/FormatDate';
import { Icon } from '@brickninja-org/ui';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { getApplicationById } from '../helper';

const getClients = (applicationId: string, ownerId: string) => {
  return db.client.findMany({
    where: { applicationId, application: { ownerId }},
    include: {
      _count: { select: { authorizations: { where: { ...notExpired, type: { in: ['AccessToken', 'RefreshToken'] }}}}},
    },
  });
};

type ClientsPageProps = PageProps<{ id: string }>;

export default async function EditApplicationPage({ params }: ClientsPageProps) {
  const { id } = await params;
  const session = await getSessionOrRedirect();
  const clients = await getClients(id, session.userId);

  return (
    <>
      <p>Check the <Link href="/dev/docs/manage-apps#client">documentation</Link> for more information on how to manage your OAuth2 client.</p>

      <div className="border border-gray-300 rounded-xs nth-[*]:not-first:border-t nth-[*]:not-first:border-gray-300">
        {clients.map((client) => (
          <Link key={client.id} className="relative flex flex-col gap-2 py-4 pr-12 pl-4 text-foreground no-underline! hover:bg-gray-100" href={`/dev/applications/${id}/clients/${client.id}`} aria-label={`Manage client ${client.name}`}>
            <div className="mb-1 font-medium">{client.name} <span className="ml-2 py-0.5 px-2 rounded-[100px] border border-gray-300 text-sm font-normal">{client.type}</span></div>
            <div>Client ID: <Code inline borderless>{client.id}</Code></div>
            <div>{client._count.authorizations} active Authorizations</div>
            <div>Created at <FormatDate date={client.createdAt}/></div>
            <Icon className="absolute right-4 top-1/2 -mt-2" icon="chevron-right"/>
          </Link>
        ))}
      </div>

      <FlexRow>
        <LinkButton icon="add" href={`/dev/applications/${id}/clients/add`}>Create Client</LinkButton>
      </FlexRow>
    </>
  );
}

export async function generateMetadata({ params }: ClientsPageProps) {
  const { id } = await params;
  const session = await getSessionOrRedirect();
  const application = await getApplicationById(id, session.userId);

  return {
    title: `Edit ${application.name} / Clients`,
  };
}

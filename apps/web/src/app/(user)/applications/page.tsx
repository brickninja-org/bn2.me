import { cache } from 'react';
import Link from 'next/link';

import { Icon } from '@brickninja-org/ui';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Form } from '@brickninja-org/ui/components/form/Form';
import { Button } from '@brickninja-org/ui/components/form/Button';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { Separator } from '@brickninja-org/ui/components/layout/Separator';
import { table, Table } from '@brickninja-org/ui/components/table/Table';

import { db } from '@/lib/db';
import { getSessionOrRedirect } from '@/lib/session';
import { ApplicationImage } from '@/components/application/ApplicationImage';
import { FormatDate } from '@/components/format/FormatDate';
import { PageLayout } from '@/components/layout/PageLayout';

import { revokeAccess } from './actions';

const getUserData = cache(async () => {
  const session = await getSessionOrRedirect();

  const applications = await db.application.findMany({
    where: { users: { some: { userId: session.userId }}},
    select: {
      id: true,
      name: true,
      imageId: true,
      public: true,
      publicUrl: true,
      authorizations: {
        take: 1,
        where: { usedAt: { not: null }},
        orderBy: { usedAt: 'desc' },
        select: { usedAt: true },
      },
    }
  });

  return {
    applications,
  };
});

export default async function ProfilePage() {
  const { applications } = await getUserData();

  return (
    <PageLayout>
      <Headline id="applications">Authorized Applications</Headline>

      <p>Visit the <Link href="/discover">Discover</Link> page to find new applications using bn2.me.</p>

      <Form action={revokeAccess}>
        {applications.length > 0 && (
          <Table>
            <thead>
              <tr>
                <Table.HeaderCell>Application</Table.HeaderCell>
                <Table.HeaderCell>Last used</Table.HeaderCell>
                <Table.HeaderCell small>Actions</Table.HeaderCell>
              </tr>
            </thead>
            <tbody className={table().tbody()}>
              {applications.map((application) => (
                <tr key={application.id} className={table().tr()}>
                  <td className={table().td()}>
                    {application.public ? (
                      <a href={application.publicUrl} target="_blank" rel="noopener noreferrer">
                        <FlexRow>
                          <ApplicationImage fileId={application.imageId}/> {application.name} <Icon icon="external-link"/>
                        </FlexRow>
                      </a>
                    ) : (
                      <FlexRow><ApplicationImage fileId={application.imageId}/> {application.name}</FlexRow>
                    )}
                  </td>
                  <td>{application.authorizations[0]?.usedAt ? <FormatDate date={application.authorizations[0].usedAt}/> : 'never'}</td>
                  <td><Button type="submit" name="applicationId" value={application.id} className="text-red-600" icon="delete">Revoke Access</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <Separator/>
        <p>Are you a developer? <Link href="/dev/applications">Manage your own applications</Link>.</p>
      </Form>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Applications',
};

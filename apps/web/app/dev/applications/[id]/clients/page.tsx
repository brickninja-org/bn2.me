import type { PageProps } from '@/lib/next';

import { cache } from 'react';
import { notFound } from 'next/navigation';

import { db } from '@/lib/db';
import { getSessionOrRedirect } from '@/lib/session';
import { ApplicationForm } from './Form';
import { editOAuth2Client } from './_actions/edit';
import { deleteClientSecret, generateClientSecret } from './_actions/secret';

const getApplication = cache(async (id: string) => {
  const session = await getSessionOrRedirect();

  const application = await db.application.findFirst({
    where: { id, ownerId: session.userId },
    include: { clients: { include: { secrets: { select: { id: true, createdAt: true, usedAt: true }}}}},
  });

  if(!application) {
    notFound();
  }

  return application;
});

type EditApplicationPageProps = PageProps<{ id: string }>;

export default async function EditApplicationPage({ params }: EditApplicationPageProps) {
  const { id } = await params;
  const application = await getApplication(id);

  return (
    <>
      <p>Check the <a href="/dev/docs/manage-apps#client">documentation</a> for more information on how to manage your OAuth2 client.</p>

      <ApplicationForm
        applicationId={application.id}
        clients={application.clients}
        editApplicationAction={editOAuth2Client.bind(null, application.id)}
        generateClientSecretAction={generateClientSecret}
        deleteClientSecretAction={deleteClientSecret}/>
    </>
  );
}

export async function generateMetadata({ params }: EditApplicationPageProps) {
  const { id } = await params;
  const application = await getApplication(id);

  return {
    title: `Edit ${application.name}`
  };
}

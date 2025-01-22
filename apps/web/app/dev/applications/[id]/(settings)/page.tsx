import type { PageProps } from '@/lib/next';

import { cache } from 'react';
import { notFound } from 'next/navigation';

import { db } from '@/lib/db';
import { getSessionOrRedirect } from '@/lib/session';

import { editApplication } from '../../_actions/edit';
import { ApplicationForm } from './Form';

const getApplication = cache(async (id: string) => {
  const session = await getSessionOrRedirect();

  const application = await db.application.findFirst({
    where: { id, ownerId: session.userId },
    include: { clients: { include: { secrets: { select: { id: true, createdAt: true, usedAt: true }}}}}
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

  const emails = await db.userEmail.findMany({
    where: { userId: application.ownerId, verified: true },
  });

  return (
    <>
      <p>Check the <a href="/dev/docs/manage-apps#settings">documentation</a> for more information on how to manage your application.</p>

      <ApplicationForm application={application} applicationId={application.id} emails={emails} clients={application.clients}
        editApplicationAction={editApplication.bind(null, application.id)}/>
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

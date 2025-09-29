import type { PageProps } from '@/lib/next';

import { db } from '@/lib/db';
import { getSessionOrRedirect } from '@/lib/session';

import { editApplication } from '../../_actions/edit';
import { getApplicationById } from '../helper';
import { ApplicationForm } from './Form';

type EditApplicationPageProps = PageProps<{ id: string }>;

export default async function EditApplicationPage({ params }: EditApplicationPageProps) {
  const { id } = await params;
  const session = await getSessionOrRedirect();
  const application = await getApplicationById(id, session.userId);

  const emails = await db.userEmail.findMany({
    where: { userId: application.ownerId, verified: true },
  });

  return (
    <>
      <p>Check the <a href="/dev/docs/manage-apps#settings">documentation</a> for more information on how to manage your application.</p>

      <ApplicationForm
        application={application}
        applicationId={application.id}
        emails={emails}
        editApplicationAction={editApplication.bind(null, application.id)}/>
    </>
  );
}

export async function generateMetadata({ params }: EditApplicationPageProps) {
  const { id } = await params;
  const session = await getSessionOrRedirect();
  const application = await getApplicationById(id, session.userId);

  return {
    title: `Edit ${application.name}`
  };
}

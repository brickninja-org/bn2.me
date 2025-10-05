import type { Metadata } from 'next';

import { cache } from 'react';
import { notFound } from 'next/navigation';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Form } from '@brickninja-org/ui/components/form/Form';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';

import { db } from '@/lib/db';
import { getSessionOrRedirect } from '@/lib/session';
import { getApplicationById } from '../../../helper';
import { deleteClient } from '../../_actions/delete';
import { LinkButton } from '@/components/button';

const getClient = cache((clientId: string, applicationId: string, ownerId: string) => {
  return db.client.findFirst({
    where: { id: clientId, applicationId, application: { ownerId }},
  });
});

export default async function DeleteClientPage({ params }: PageProps<'/dev/applications/[id]/clients/[clientId]/delete'>) {
  const { id: applicationId, clientId } = await params;
  const session = await getSessionOrRedirect();
  const application = await getApplicationById(applicationId, session.userId);
  const client = await getClient(clientId, applicationId, session.userId);

  if(!client) {
    notFound();
  }

  return (
    <Form action={deleteClient.bind(null, application.id, client.id)}>
      <p>Are your sure you want to delete the client {client.name}? All active authorizations will be deleted as well.</p>

      <FlexRow>
        <LinkButton href={`/dev/applications/${application.id}/clients/${client.id}`}>Cancel</LinkButton>
        <SubmitButton icon="delete" intent="delete">Delete Client</SubmitButton>
      </FlexRow>
    </Form>
  );
}


export async function generateMetadata({ params }: PageProps<'/dev/applications/[id]/clients/[clientId]/delete'>): Promise<Metadata> {
  const { id: applicationId, clientId } = await params;
  const session = await getSessionOrRedirect();
  const application = await getApplicationById(applicationId, session.userId);
  const client = await getClient(clientId, applicationId, session.userId);

  if(!client) {
    notFound();
  }

  return {
    title: `Edit ${application.name} / Clients / Delete ${client.name}`
  };
}

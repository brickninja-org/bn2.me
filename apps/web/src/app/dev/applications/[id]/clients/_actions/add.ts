'use server';

import { redirect } from 'next/navigation';

import { ClientType } from '@bn2me/database';
import { FormState } from '@brickninja-org/ui/components/form/Form';

import { db } from '@/lib/db';
import { getFormDataString } from '@/lib/form-data';
import { getSession } from '@/lib/session';

export async function addClient(applicationId: string, _: FormState, formData: FormData): Promise<FormState> {
  // ensure user is logged in
  const session = await getSession();
  if (!session) {
    return { error: 'Not logged in' };
  }

  // get the existing application and verify ownership
  const application = await db.application.findUnique({
    where: { id: applicationId, ownerId: session.userId },
    include: {
      clients: { select: { id: true, name: true }},
    },
  });

  if (!application) {
    return { error: 'Application not found' };
  }

  // get form data
  const name = getFormDataString(formData, 'name');
  const type = getFormDataString(formData, 'type');

  // verify name
  if (!name) {
    return { error: 'Name is required' };
  }

  if (application.clients.some((other) => other.name === name)) {
    return { error: 'Name has to be unique' };
  }

  // verify type
  if (!type || isValidClientType(type)) {
    return { error: 'Invalid type' };
  }

  const clientType = type as ClientType;

  // create client
  const client = await db.client.create({
    data: {
      name,
      type: clientType,
      applicationId,
    },
  });

  // redirect to newly created client
  redirect(`/dev/applications/${applicationId}/clients/${client.id}`);
}

function isValidClientType(type: string): type is ClientType {
  return type in ClientType;
}

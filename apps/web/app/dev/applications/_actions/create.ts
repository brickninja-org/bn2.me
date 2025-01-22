'use server';

import type { FormState } from '@brickninja-org/ui/components/form/Form';

import { redirect } from 'next/navigation';

import { ClientType, Prisma } from '@bn2me/database';

import { db } from '@/lib/db';
import { getFormDataString } from '@/lib/form-data';
import { getSession } from '@/lib/session';

export async function createApplication(_: FormState, data: FormData): Promise<FormState> {
  const session = await getSession();

  if(!session) {
    return { error: 'Not logged in' };
  }

  const name = getFormDataString(data, 'name');
  if(!name || name.trim() === '') {
    return { error: 'Invalid name' };
  }

  const type = getFormDataString(data, 'type');
  if(!type || !isValidClientType(type)) {
    return { error: 'Invalid type' };
  }

  const email = getFormDataString(data, 'email');
  if(!email) {
    return { error: 'Invalid email' };
  }

  let applicationId: string;

  try {
    const application = await db.application.create({
      data: {
        name: name.trim(),
        ownerId: session.userId,
        emailId: email,
        clients: {
          create: { type }
        }
      },
      select: {
        id: true
      }
    });

    applicationId = application.id;
  } catch(e) {
    if(e instanceof Prisma.PrismaClientKnownRequestError) {
      // unique constraint failed - https://www.prisma.io/docs/orm/reference/error-reference#p2002
      if(e.code === 'P2002') {
        return { error: 'Name already in use' };
      }
    }

    console.error(e);
    return { error: 'Unknown error' };
  }

  redirect(`/dev/applications/${applicationId}`);
}

function isValidClientType(type: string): type is ClientType {
  return type in ClientType;
}

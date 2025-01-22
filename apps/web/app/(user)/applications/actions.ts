'use server';

import type { FormState } from '@brickninja-org/ui/components/form/Form';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function revokeAccess(_: FormState, formData: FormData): Promise<FormState> {
  const clientId = formData.get('clientId');

  if(!clientId || typeof clientId !== 'string') {
    return { error: 'Invalid client id' };
  }

  const session = await getSession();

  if(!session) {
    return { error: 'Not logged in' };
  }

  await db.authorization.deleteMany({
    where: { clientId, userId: session.userId }
  });

  revalidatePath('/applications');

  return { success: 'Access revoked. The application might still be able to access the Brickset API for up to 10 minutes.' };
}

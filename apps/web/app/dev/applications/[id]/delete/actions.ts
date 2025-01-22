'use server';

import type { FormState } from '@brickninja-org/ui/components/form/Form';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function deleteApplication(id: string): Promise<FormState> {
  const session = await getSession();

  if (!session) {
    return { error: 'Not logged in' };
  }

  try {
    await db.application.deleteMany({
      where: { id, ownerId: session.userId },
    });
  } catch {
    return { error: 'Unknown error' };
  }

  revalidatePath('/dev/applications');
  redirect('/dev/applications');
}

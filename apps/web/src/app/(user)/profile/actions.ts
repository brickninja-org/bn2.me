'use server';

import type { FormState } from '@brickninja-org/ui/components/form/Form';

import { db } from '@/lib/db';
import { getFormDataString } from '@/lib/form-data';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function updateSettings(_: FormState, formData: FormData): Promise<FormState> {
  // setup regex to test username
  const usernameRegex = /^[a-z0-9._-]{2,32}$/i;

  // get current user
  const session = await getSession();

  if(!session) {
    return { error: 'Not logged in' };
  }

  // get form data
  const username = getFormDataString(formData, 'username');

  // validate username
  if(username === undefined || !usernameRegex.test(username)) {
    return { error: 'Invalid username. The username can only contain latin characters (a-z), numbers and the special characters period (.), underscore (_) and dash (-) and must be between 2 and 32 characters long.' };
  }

  // check if username is not already taken
  const userExists = await db.user.findFirst({
    where: { name: username, id: { not: session.userId }},
    select: { id: true }
  });

  if(userExists) {
    return { error: 'Invalid username. The username is already taken.' };
  }

  // save
  await db.user.update({
    where: { id: session.userId },
    data: { name: username }
  });

  revalidatePath('/profile');
  return { success: 'Saved' };
}

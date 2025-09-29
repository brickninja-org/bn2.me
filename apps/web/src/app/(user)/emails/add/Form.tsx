import type { FC } from 'react';
import type { FormState } from '@brickninja-org/ui/components/form/Form';

import { redirect } from 'next/navigation';

import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Form } from '@brickninja-org/ui/components/form/Form';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { Label } from '@brickninja-org/ui/components/form/Label';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';

import { db } from '@/lib/db';
import { getFormDataString } from '@/lib/form-data';
import { sendEmailVerificationMail } from '@/lib/mail/email-verification';
import { getSession } from '@/lib/session';

export interface AddEmailFormProps {
  returnTo?: string,
}

export const AddEmailForm: FC<AddEmailFormProps> = ({ returnTo }) => {
  return (
    <Form action={addEmail.bind(null, returnTo)}>
      <Label label="Email"><input name="email" type={'email' as 'text'}/></Label>
      <FlexRow>
        {returnTo && (<LinkButton href={returnTo}>Cancel</LinkButton>)}
        <SubmitButton icon="add">Add Email</SubmitButton>
      </FlexRow>
    </Form>
  );
};


const emailRegex = /^.+@.+$/;

async function addEmail(returnTo: undefined | string, _: FormState, formData: FormData): Promise<FormState> {
  'use server';

  const session = await getSession();
  if(!session) {
    return { error: 'Not logged in' };
  }

  const email = getFormDataString(formData, 'email');

  if(email === undefined || !emailRegex.test(email)) {
    return { error: 'Invalid email' };
  }

  try {
    const { id } = await db.userEmail.create({
      data: { email, userId: session.userId },
      select: { id: true }
    });

    await sendEmailVerificationMail(id);
  } catch(e) {
    console.error(e);
    return { error: 'Could not save email' };
  }

  redirect(returnTo ?? '/profile');
}

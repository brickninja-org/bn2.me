import TestEmail from '@bn2me/emails/test';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';
import { Form, FormState } from '@brickninja-org/ui/components/form/Form';
import { TextInput } from '@brickninja-org/ui/components/form/TextInput';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { getFormDataString } from '@/lib/form-data';
import { PageLayout } from '@/components/layout/PageLayout';

import { ensureUserIsAdmin } from '../admin';
import { sendMail } from '@/lib/mail';

export default async function EmailPage() {
  await ensureUserIsAdmin();

  return (
    <PageLayout>
      <Headline id="email">Email</Headline>
      <Form action={send}>
        <FlexRow>
          <TextInput type={'email' as 'text'} name="email" defaultValue="dev@brick.ninja"/>
          <SubmitButton icon="mail">Send Test mail</SubmitButton>
        </FlexRow>
      </Form>
    </PageLayout>
  );
}

async function send(_: FormState, formData: FormData): Promise<FormState> {
  'use server';
  await ensureUserIsAdmin();

  const email = getFormDataString(formData, 'email');

  if(!email) {
    return { error: 'Invalid email' };
  }

  try {
    await sendMail('Test Mail', email, <TestEmail/>);
  } catch(e) {
    return { error: `Error: ${e}` };
  }

  return { success: 'Email sent' };
}

export const metadata = {
  title: 'Email'
};

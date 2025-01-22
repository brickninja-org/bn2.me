import type { Metadata } from 'next';
import type { FormState } from '@brickninja-org/ui/components/form/Form';

import { cache } from 'react';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Icon } from '@brickninja-org/ui';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Form } from '@brickninja-org/ui/components/form/Form';
import { Button, LinkButton } from '@brickninja-org/ui/components/form/Button';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';
import { Label } from '@brickninja-org/ui/components/form/Label';
import { TextInput } from '@brickninja-org/ui/components/form/TextInput';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';

import { db } from '@/lib/db';
import { getFormDataString } from '@/lib/form-data';
import { getSession, getSessionOrRedirect } from '@/lib/session';
import { PageLayout } from '@/components/layout/PageLayout';
import { Steps } from '@/components/steps/Steps';

const getUserData = cache(async () => {
  const { userId } = await getSessionOrRedirect();

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { emails: { orderBy: { email: 'asc' }}},
  });

  if (!user) {
    notFound();
  }

  return user;
});

export default async function ProfilePage() {
  const user = await getUserData();
  const Emails = createDataTable(user.emails, ({ id }) => id);

  return (
    <PageLayout>
      <Headline id="profile" actions={<LinkButton href="/logout" icon="sign-out" external>Logout</LinkButton>}>
        {user.name}
      </Headline>

      <p>Thank you for signing up to bn2.me.</p>

      <Steps>
        <div><Link href="/accounts/add">Add your Rebrickable Accounts</Link> by adding API Keys.</div>
        <div><Link href="/discover">Discover</Link> applications that support bn2.me.</div>
        <div>Get our <Link href="/extension">browser extension</Link> to generate subtokens for all other websites.</div>
        <div>Are your a developer? <Link href="/dev/applications">Manage your own applications</Link>.</div>
      </Steps>

      <Headline id="settings">Settings</Headline>
      <Form action={updateSettings}>
        <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
          <Label label="Username">
            <TextInput name="username" defaultValue={user.name}/>
          </Label>
          <FlexRow>
            <SubmitButton>Save</SubmitButton>
          </FlexRow>
        </div>
      </Form>

      <Headline id="emails" actions={(<LinkButton href="/emails/add" icon="add">Add Email</LinkButton>)}>Emails</Headline>
      <Form action={updateEmails}>
        <Emails.Table>
          <Emails.Column id="email" title="Email">{({ email }) => email}</Emails.Column>
          <Emails.Column id="default" title="Default">{({ isDefaultForUserId }) => isDefaultForUserId && <Icon icon="checkmark"/>}</Emails.Column>
          <Emails.Column id="verified" title="Verified">{({ verified }) => verified && <Icon icon="checkmark"/>}</Emails.Column>
          <Emails.Column small title="Actions" id="actions">
            {({ id, isDefaultForUserId }) => (
              <FlexRow>
                <Button icon="checkmark" disabled={!!isDefaultForUserId} type="submit" name="default" value={id}>Set as default</Button>
              </FlexRow>
            )}
          </Emails.Column>
        </Emails.Table>
      </Form>
    </PageLayout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const user = await getUserData();

  return {
    title: user.name,
  };
}

async function updateSettings(_: FormState, formData: FormData): Promise<FormState> {
  'use server';

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

async function updateEmails(_: FormState, formData: FormData): Promise<FormState> {
  'use server';

  const session = await getSession();
  if(!session) {
    return { error: 'Not logged in' };
  }

  const defaultEmailId = getFormDataString(formData, 'default');

  if(defaultEmailId) {
    await db.user.update({
      where: { id: session.userId },
      data: { defaultEmail: { connect: { id: defaultEmailId }}}
    });
  }

  revalidatePath('/profile');
  return { success: 'Email settings updated' };
}

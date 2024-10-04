import { cache } from 'react';
// import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { LinkButton } from '@brickninja-org/ui/components/form/button';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/submit-button';
// import { Form, FormState } from '@brickninja-org/ui/components/form';
import { Label } from '@brickninja-org/ui/components/form/label';
// import { TextInput } from '@brickninja-org/ui/components/form/text-input';
import { Headline } from '@brickninja-org/ui/components/headline';
import { FlexRow } from '@brickninja-org/ui/components/flex-row';

import { db } from '@/lib/db';
// import { getFormDataString } from '@/lib/form-data';
import { getSessionOrRedirect } from '@/lib/session';
import { PageLayout } from '@/components/layout/PageLayout';
import { Steps } from '@/components/steps/Steps';
import { Metadata } from 'next';

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

  return (
    <PageLayout>
      <Headline id="profile" actions={<LinkButton href="/logout" external>Logout</LinkButton>}>
        {user.name}
      </Headline>

      <p>Thank you for signing up to bn2.me</p>

      <Steps>
        <div><Link href="/accounts/add">Add your Brickset Accounts</Link> by adding API keys.</div>
        <div><Link href="/discover">Discover</Link> applications that support bn2.me.</div>
        <div>Are your a developer? <Link href="/dev/applications">Manage your own applications</Link>.</div>
      </Steps>

      <Headline id="settings">Settings</Headline>
      <form>
        <div className="flex flex-col gap-4">
          <Label label="username">
            <input name="username" defaultValue={user.name}/>
          </Label>
          <FlexRow>
            <SubmitButton>Save</SubmitButton>
          </FlexRow>
        </div>
      </form>
    </PageLayout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const user = await getUserData();

  return {
    title: user.name,
  };
}

/*
async function updateSettings(_: FormState, formData: FormData): Promise<FormState> {
  'use server';

  // setup regex to test username
  const usernameRegex = /^[a-z0-9._-]{2,32}$/i;

  // get current user
  const session = await getSession();

  if (!session) {
    return { error: 'Not logged in' };
  }

  // get form data
  const username = getFormDataString(formData, 'username');

  // validate username
  if (username === undefined || !usernameRegex.test(username)) {
    return { error: 'Invalid username. The username can only contain latin characters (a-z), numbers an the special chars period (.), underscore (_) and dash (-) and must be between 2 and 32 characters long.' };
  }

  // check if username is not already taken
  const userExists = await db.user.findFirst({
    where: { name: username, id: { not: session.userId }},
    select: { id: true },
  });

  if (userExists) {
    return { error: 'Invalid username. The username is already taken.' };
  }

  // save
  await db.user.update({
    where: { id: session.userId },
    data: { name: username },
  });

  revalidatePath('/profile');
  return { success: 'Saved' };
}
  */

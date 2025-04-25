import Link from 'next/link';

import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Form } from '@brickninja-org/ui/components/form/Form';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';
import { Label } from '@brickninja-org/ui/components/form/Label';
import { Select, SelectProps } from '@brickninja-org/ui/components/form/Select';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { getSessionOrRedirect } from '@/lib/session';
import { db } from '@/lib/db';
import { PageLayout } from '@/components/layout/PageLayout';

import { createApplication } from '../_actions/create';
import { ClientTypeOptions } from '../_actions/helper';
import { TextInput } from '@brickninja-org/ui/components/form/TextInput';

export default async function CreateApplicationPage() {
  const { userId } = await getSessionOrRedirect();
  const emails = await db.userEmail.findMany({
    where: { userId, verified: true },
  });

  const emailOptions: SelectProps['options'] = emails.map((email) => ({ value: email.id, label: email.email }));
  const defaultEmailId = emails.find((email) => email.isDefaultForUserId)?.id;

  return (
    <PageLayout>
      <Headline id="create">Create new application</Headline>

      <Form action={createApplication}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Label label="Name">
            <TextInput name="name"/>
          </Label>

          <Label label={<>Type (See <Link href="/dev/docs/manage-apps#public-confidential">documentation</Link> for distinction)</>}>
            <Select name="type" options={[{ value: '', label: '' }, ...ClientTypeOptions]}/>
          </Label>

          <Label label={<>Verified Contact Email (<Link href="/profile#emails">Manage Emails</Link>)</>}>
            <Select name="email" options={emailOptions} defaultValue={defaultEmailId}/>
          </Label>

          <FlexRow>
            <SubmitButton type="submit">Create Application</SubmitButton>
          </FlexRow>
        </div>
      </Form>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Create Application'
};

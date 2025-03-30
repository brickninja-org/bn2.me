import Link from 'next/link';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';
import { Form } from '@brickninja-org/ui/components/form/Form';
import { Label } from '@brickninja-org/ui/components/form/Label';
import { Select } from '@brickninja-org/ui/components/form/Select';
import { TextInput } from '@brickninja-org/ui/components/form/TextInput';

import type { PageProps } from '@/lib/next';
import { getSessionOrRedirect } from '@/lib/session';

import { ClientTypeOptions } from 'app/dev/applications/_actions/helper';
import { getApplicationById } from '../../helper';
import { addClient } from '../_actions/add';

type ClientsAddPageProps = PageProps<{ id: string }>;

export default async function ClientsAddPage({ params }: ClientsAddPageProps) {
  const { id } = await params;
  const session = await getSessionOrRedirect();
  const application = await getApplicationById(id, session.userId);

  return (
    <>
      <p>Check the <a href="/dev/docs/manage-apps#client">documentation</a> for more information on how to manage your OAuth2 clients.</p>

      <Form action={addClient.bind(null, application.id)}>
        <div className="flex flex-col gap-4">
          <Label label="Name">
            <TextInput name="name"/>
          </Label>

          <Label label={<>Type (See <Link href="/dev/docs/manage-apps#public-confidential">documentation</Link> for distinction)</>}>
            <Select name="type" options={[{ value: '', label: '' }, ...ClientTypeOptions]}/>
          </Label>

          <FlexRow>
            <SubmitButton type="submit" icon="add">Create Client</SubmitButton>
          </FlexRow>
        </div>
      </Form>
    </>
  );
}

export async function generateMetadata({ params }: ClientsAddPageProps) {
  const { id } = await params;
  const session = await getSessionOrRedirect();
  const application = await getApplicationById(id, session.userId);

  return {
    title: `Edit ${application.name} / Add Client`,
  };
}

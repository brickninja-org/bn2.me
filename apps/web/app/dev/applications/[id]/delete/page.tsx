import type { PageProps } from '@/lib/next';

import { notFound } from 'next/navigation';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Form } from '@brickninja-org/ui/components/form/Form';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { db } from '@/lib/db';
import { getSessionOrRedirect } from '@/lib/session';
import { PageLayout } from '@/components/layout/PageLayout';
import { deleteApplication } from './actions';

async function getApplication(id: string) {
  const session = await getSessionOrRedirect();

  const application = await db.application.findUnique({
    where: { id, ownerId: session.userId },
    select: { id: true, name: true },
  });

  if (!application) {
    notFound();
  }

  return application;
}

type DeleteApplicationPageProps = PageProps<{ id: string }>;

export default async function DeleteApplicationPage({ params }: DeleteApplicationPageProps) {
  const { id } = await params;
  const app = await getApplication(id);

  return (
    <PageLayout>
      <Form action={deleteApplication.bind(null, app.id)}>
        <Headline id="delete">{app.name}</Headline>

        <p>Are you sure you want to delete {app.name}?</p>

        <FlexRow>
          <LinkButton href={`/dev/applications/${app.id}`}>Cancel</LinkButton>
          <SubmitButton icon="delete" className="text-error">Delete Application</SubmitButton>
        </FlexRow>
      </Form>
    </PageLayout>
  );
}

export async function generateMetadata({ params }: DeleteApplicationPageProps) {
  const { id } = await params;
  const app = await getApplication(id);

  return {
    title: `Delete ${app.name}`,
  };
}

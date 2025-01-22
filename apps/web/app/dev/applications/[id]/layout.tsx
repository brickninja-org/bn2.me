import type { LayoutProps } from '@/lib/next';

import { cache } from 'react';
import { notFound } from 'next/navigation';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';

import { db } from '@/lib/db';
import { getSessionOrRedirect } from '@/lib/session';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageTitle } from '@/components/layout/PageTitle';
import { ApplicationImage } from '@/components/application/ApplicationImage';

import { Navbar } from './Navbar';

const getApplicationId = cache(
  (id: string, userId: string) => db.application.findUnique({ where: { id, ownerId: userId }}),
);

export default async function DevApplicationDetailLayout({ params, children }: LayoutProps<{ id: string }>) {
  const { id } = await params;
  const session = await getSessionOrRedirect();
  const application = await getApplicationId(id, session.userId);

  if (!application) {
    notFound();
  }

  return (
    <PageLayout>
      <PageTitle>
        <FlexRow>
          <ApplicationImage fileId={application.imageId} size={48}/>
          {application.name}
        </FlexRow>
      </PageTitle>
      <Navbar base={`/dev/applications/${application.id}/`} items={[
        { segment: '(settings)', label: 'Settings', href: `/dev/applications/${id}/` },
        { segment: 'clients', label: 'OAuth2 Client' },
      ]}/>
      {children}
    </PageLayout>
  );
}

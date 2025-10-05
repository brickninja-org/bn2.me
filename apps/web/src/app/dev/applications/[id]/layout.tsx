import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';

import { getSessionOrRedirect } from '@/lib/session';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageTitle } from '@/components/layout/PageTitle';
import { ApplicationImage } from '@/components/application/ApplicationImage';

import { Navbar } from './Navbar';
import { getApplicationById } from './helper';

export default async function DevApplicationDetailLayout({ params, children }: LayoutProps<'/dev/applications/[id]'>) {
  const { id } = await params;
  const session = await getSessionOrRedirect();
  const application = await getApplicationById(id, session.userId);

  return (
    <PageLayout>
      <PageTitle>
        <FlexRow>
          <ApplicationImage fileId={application?.imageId} size={48}/>
          {application.name}
        </FlexRow>
      </PageTitle>
      <Navbar base={`/dev/applications/${application.id}/`} items={[
        { segment: '(settings)', label: 'Settings', href: `/dev/applications/${id}/` },
        { segment: 'clients', label: 'Clients' },
        { segment: 'users', label: 'Users' },
      ]}/>
      {children}
    </PageLayout>
  );
}

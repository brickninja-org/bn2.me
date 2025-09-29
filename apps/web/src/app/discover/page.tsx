import { Icon } from '@brickninja-org/ui';

import { db } from '@/lib/db';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageTitle } from '@/components/layout/PageTitle';
import { ApplicationImage } from '@/components/application/ApplicationImage';

export const revalidate = 300;

const getApplications = async () => {
  const applications = await db.application.findMany({
    where: { public: true },
    select: { id: true, name: true, description: true, publicUrl: true, imageId: true },
  });
  
  return applications;
};

export default async function DiscoverPage() {
  const applications = await getApplications();

  if (!applications || applications.length === 0) {
    return (
      <PageLayout>
        <PageTitle>Discover</PageTitle>
        <p className="mb-4">There are currently no applications that support bn2.me.</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageTitle>Discover</PageTitle>
      <p className="mb-4">Here are some of the applications that support bn2.me.</p>
      <div className="grid [grid-template-columns:repeat(auto-fill,minmax(320px,auto))] gap-4">
        {applications.map((app) => (
          <a key={app.id} className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-[8px_16px] p-4 rounded-xs border border-gray-200 bg-background text-foreground no-underline! hover:shadow-lg hover:border-gray-200 hover:translate-y-[-2px] transition-all duration-300 will-change-transform" href={app.publicUrl} target="_blank" rel="noreferrer nooper">
            <div className="order-1 row-span-2">
              <ApplicationImage fileId={app.imageId} size={64}/>
            </div>
            <div className="order-2 inline-flex gap-1 items-center col-start-2 font-medium text-lg">{app.name} <Icon icon="external-link"/></div>
            <p className="order-3 col-start-2 row-start-2 m-0">{app.description}</p>
          </a>
        ))}
      </div>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Discover',
  description: 'Discover applications with bn2.me integration.',
};

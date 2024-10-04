// import { Icon } from '@brickninja-org/ui';

import { db } from '@/lib/db';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageTitle } from '@/components/layout/PageTitle';

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

  return (
    <PageLayout>
      <PageTitle>Discover</PageTitle>
      <p>Here are some of the applications that support bn2.me.</p>
      <div className="">
        {applications.map((app) => (
          <a key={app.id} className="" href={app.publicUrl} target="_blank" rel="noreferrer nooper">
            {/* TODO: Application image */}
            <div className="">{app.name} {/* <Icon icon="external-link"/> */}</div>
            <p>{app.description}</p>
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

import { db } from '@/lib/db';

export const revalidate = 300;

const getApplications = async () => {
  const applications = await db.application.findMany({
    where: { public: true },
    select: { id: true, name: true, description: true, publicUrl: true, imageId: true },
  });

  return applications;
};

export default async function ShowcasePage() {
  const applications = await getApplications();

  if (!applications || applications.length === 0) {
    return (
      <p>There are currently no applications that support bn2.me.</p>
    );
  }

  return (
    <div className="space-y-12">
      {applications.map((application) => (
        <section key={application.id}>test</section>
      ))}
    </div>
  );
}

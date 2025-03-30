import { PageProps } from '@/lib/next';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { AddEmailForm } from 'app/(user)/emails/add/Form';

export default async function AuthorizeAddEmailPage({ params }: PageProps<{ id: string }>) {
  const { id } = await params;

  return (
    <div>
      <Headline id="add">Add Email</Headline>

      <AddEmailForm returnTo={`/authorize/${id}`}/>
    </div>
  );
}

export const metadata = {
  title: 'Add Email'
};

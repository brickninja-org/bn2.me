import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { PageProps } from '@/lib/next';
import { AccountAddForm } from 'app/(user)/accounts/add/Form';

export default async function AuthorizeAddAccountPage({ params }: PageProps<{ id: string }>) {
  const { id } = await params;

  return (
    <div>
      <Headline id="add-api-key">Add API Key</Headline>

      <AccountAddForm returnTo={`/authorize/${id}`}/>
    </div>
  );
}

export const metadata = {
  title: 'Add API Key',
};

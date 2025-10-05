import { Metadata } from 'next';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { AccountAddForm } from '@/app/(user)/accounts/add/Form';

export default async function AuthorizeAddAccountPage({ params }: PageProps<'/authorize/[id]/add-account'>) {
  const { id } = await params;

  return (
    <div>
      <Headline id="add-api-key">Add API Key</Headline>

      <AccountAddForm returnTo={`/authorize/${id}`}/>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Add API Key',
};

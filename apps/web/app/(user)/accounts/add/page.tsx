import type { Metadata } from 'next';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { PageLayout } from '@/components/layout/PageLayout';

import { AccountAddForm } from './form';

export default function AccountCreatePage() {
  return (
    <PageLayout>
      <Headline id="create">Add API Key</Headline>

      <AccountAddForm/>
    </PageLayout>
  );
}

export const metadata: Metadata = {
  title: 'Add API Key',
};

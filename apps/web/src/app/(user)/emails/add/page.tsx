import type { Metadata } from 'next';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { PageLayout } from '@/components/layout/PageLayout';

import { AddEmailForm } from './Form';

export default function EmailsAddPage() {
  return (
    <PageLayout>
      <Headline id="add">Add Email</Headline>

      <AddEmailForm/>
    </PageLayout>
  );
}

export const metadata: Metadata = {
  title: 'Add Email'
};

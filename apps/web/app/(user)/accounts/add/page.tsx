import { PageLayout } from '@/components/layout/page-layout';
import { Headline } from '@brickninja-org/ui/components/headline';
import { Metadata } from 'next';

export default function AccountCreatePage() {
  return (
    <PageLayout>
      <Headline id="create">Add API Key</Headline>
    </PageLayout>
  );
}

export const metadata: Metadata = {
  title: 'Add API Key',
};

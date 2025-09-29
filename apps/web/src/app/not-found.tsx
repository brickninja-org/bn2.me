import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { PageLayout } from '@/components/layout/PageLayout';

export default function NotFoundPage() {
  return (
    <PageLayout>
      <Headline id="404">Not found</Headline>

      <p>We could not find the requested page.</p>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Not found'
};

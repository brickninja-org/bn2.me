import { Notice } from '@brickninja-org/ui/components/notice/Notice';

import { PageLayout } from '@/components/layout/PageLayout';
import { PageTitle } from '@/components/layout/PageTitle';

export default function DevDocsApiReferencePage() {
  return (
    <PageLayout>
      <PageTitle>API Reference</PageTitle>
      <Notice type="error">The API Reference is not yet available</Notice>
    </PageLayout>
  );
}

export const metadata = {
  title: 'API Reference',
};

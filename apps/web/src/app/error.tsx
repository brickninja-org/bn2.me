'use client';

import { useEffect } from 'react';

import { Button } from '@brickninja-org/ui/components/form/Button';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { PageLayout } from '@/components/layout/PageLayout';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string },
  reset: () => void,
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageLayout>
      <Headline id="error">Something went wrong!</Headline>
      <Button onClick={() => reset()}>Try again</Button>
    </PageLayout>
  );
}

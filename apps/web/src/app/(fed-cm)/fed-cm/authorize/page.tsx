import type { Metadata } from 'next';

import { PageLayout } from '@/components/layout/PageLayout';
import { searchParamsToURLSearchParams } from '@/lib/next';
import { Icon } from '@brickninja-org/ui';
import { ResolveFedCM } from './ResolveFedCM';

export default async function Page({ searchParams }: PageProps<'/fed-cm/authorize'>) {
  const code = searchParamsToURLSearchParams(await searchParams).get('code');

  return (
    <PageLayout thin>
      <div className="[--icon-size:64px]">
        <Icon icon="loading" color="var(--color-brand)"/>
      </div>
      <ResolveFedCM code={code}/>
    </PageLayout>
  );
}

export const metadata: Metadata = {
  title: 'Authorize',
};

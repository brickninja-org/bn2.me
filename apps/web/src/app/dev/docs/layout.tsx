import type { Metadata } from 'next';

import { DocsLayout } from 'fumadocs-ui/layouts/notebook';

import { source } from '@/lib/source';
import { baseOptions } from '@/app/layout.config';

export default function Layout({ children }: LayoutProps<'/dev/docs'>) {
  return (
    <DocsLayout
      tree={source.pageTree}
      sidebar={{
        collapsible: false,
        defaultOpenLevel: 0,
      }}
      searchToggle={{ enabled: true }}
      themeSwitch={{ mode: 'light-dark' }}
      {...baseOptions}
      nav={{
        ...baseOptions.nav,
        mode: 'top',
        title: 'bn2.me',
      }}
    >
      <div aria-hidden="true" className="gradient-background docs-gradient-background"/>
      {children}
    </DocsLayout>
  );
}

export const metadata: Metadata = {
  title: {
    template: '%s · Developer Documentation · bn2.me',
    default: '',
  }
};

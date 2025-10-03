import type { Metadata } from 'next';
import type { LayoutProps } from '@/lib/next';

import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { source } from '@/lib/source';
import { baseOptions } from '@/app/layout.config';

export default function Layout({ children }: LayoutProps) {
  return (
    <DocsLayout
      tree={source.pageTree}
      themeSwitch={{ mode: 'light-dark' }}
      {...baseOptions}
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

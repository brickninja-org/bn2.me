import type { LayoutProps } from '@/lib/next';

export default function DocsLayout({ children }: LayoutProps) {
  return children;
}

export const metadata = {
  title: {
    template: '%s · Developer Documentation · bn2.me',
    default: '',
  }
};

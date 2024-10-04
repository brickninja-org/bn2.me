import type { FC, ReactNode } from 'react';

import { cn } from '@brickninja-org/ui/lib';

interface PageLayoutProps {
  children: ReactNode;
  thin?: boolean;
  className?: string;
}

export const PageLayout: FC<PageLayoutProps> = ({ children, thin = false, className }) => {
  return (
    <main className={cn('min-w-0 flex-1 p-4', thin && 'max-w-[960px] mx-auto', className)}>
      {children}
    </main>
  );
};

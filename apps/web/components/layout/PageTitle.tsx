import type { FC, ReactNode } from 'react';

import { cn } from '@brickninja-org/ui/lib';

interface PageTitleProps {
  children: ReactNode;
  className?: string;
}

export const PageTitle: FC<PageTitleProps> = ({ children, className }) => {
  return (
    <h1 className={cn('mb-4 font-bitter text-3xl tracking-wide', className)}>{children}</h1>
  );
};

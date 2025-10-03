'use client';

import type { ComponentProps, ReactNode } from 'react';

import Link from 'next/link';
import { cn } from '@heroui/react';
import { UrlObject } from 'url';

interface ShowcaseItemProps extends ComponentProps<'div'> {
  item: unknown,
  href: string,
  isMinimal?: boolean,
  children?: ReactNode,
  className?: string,
}

export function ShowcaseItem({
  className,
  href,
  isMinimal = false,
  item,
  ...props
}: ShowcaseItemProps) {
  const { status } = item as { status: 'new' };

  return (
    <Link href={href as unknown as UrlObject}>
      <div
        className={cn(
          'group relative flex min-h-16 flex-col items-center justify-center',
          { 'h-[44px] w-[60px]': isMinimal },
          className,
        )}
        {...props}
      >
        {/* status chip */}
        {!!status && !isMinimal && (
          <div className="absolute right-2 top-1.5 z-10">
            {status}
          </div>
        )}
      </div>
    </Link>
  );
}

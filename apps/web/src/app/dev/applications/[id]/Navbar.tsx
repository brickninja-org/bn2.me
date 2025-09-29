'use client';

import type { FC, ReactNode } from 'react';

import { useSelectedLayoutSegments } from 'next/navigation';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { cn } from '@brickninja-org/ui';

interface NavbarProps {
  items: { label: ReactNode, segment: string, href?: string }[],
  base?: '/' | `/${string}/`,
}

export const Navbar: FC<NavbarProps> = ({ items, base = '/' }) => {
  const segment = useSelectedLayoutSegments().join('/');

  return (
    <nav className="my-4 -ml-4 border border-l-0 rounded-xs rounded-t-none rounded-l-none py-2 px-4 overflow-x-auto [scrollbar-width:thin]] [scrollbar-color:var(--color-border-dark)_transparent]">
      <ul className="inline-flex flex-start gap-2">
        {items.map((item) => (
          <li key={item.segment} className={cn([
            'group relative block border border-transparent border-b-0 rounded-t-xs rounded-l-xs',
            segment === item.segment && 'before:block before:absolute before:-bottom-2 before:left-4 before:right-4 before:h-1 before:bg-brand'])}
          >
            <LinkButton href={item.href ?? (base + item.segment)} appearance="menu" className={cn(segment === item.segment && 'hover:not-disabled:bg-transparent')}>
              {item.label}
            </LinkButton>
          </li>
        ))}
      </ul>
    </nav>
  );
};

'use client';

import type { FC, ReactNode } from 'react';

import { useSelectedLayoutSegments } from 'next/navigation';

import { IconProp } from '@brickninja-org/icons';
import { Separator } from '@brickninja-org/ui/components/layout/Separator';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';

import { ActiveButtonClass } from '@/components/layout/NavLayout';

export interface NavigationItem {
  icon?: IconProp;
  segment: string | string[];
  label: ReactNode
}

export interface NavigationProps {
  items: NavigationItem[];
  prefix?: `/${string}/`;
  children?: ReactNode;
}

export const Navigation: FC<NavigationProps> = ({ items, prefix, children }) => {
  const segments = useSelectedLayoutSegments();

  return (
    <>
      {items.map((item) => {
        const href = prefix + (Array.isArray(item.segment) ? item.segment.join('/') : item.segment);
        const isActive = Array.isArray(item.segment)
          ? item.segment.length === segments.length && item.segment.every((segment, i) => segment === segments[i])
          : item.segment === segments[0];

        return (
          <LinkButton key={href} appearance="menu" href={href} icon={item.icon} className={isActive ? ActiveButtonClass : undefined}>{item.label}</LinkButton>
        );
      })}

      {children && <Separator/>}
      {children}
    </>
  );
};

'use client';

import { useSelectedLayoutSegment } from 'next/navigation';

import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { Separator } from '@brickninja-org/ui/components/layout/Separator';

import { ActiveButtonClass, NavLayout } from '@/components/layout/NavLayout';
import { cn } from '@brickninja-org/ui';

export default function ProfileLayout({ children }: LayoutProps<'/'>) {
  const segment = useSelectedLayoutSegment();

  return (
    <NavLayout content={children}>
      <LinkButton appearance="menu" href="/profile" icon="person" className={cn(['justify-start', segment === 'profile' ? ActiveButtonClass : undefined])}>Profile</LinkButton>
      <LinkButton appearance="menu" href="/accounts" icon="key" className={cn(['justify-start', segment === 'accounts' ? ActiveButtonClass : undefined])}>Brickset Accounts</LinkButton>
      <LinkButton appearance="menu" href="/providers" icon="person-accounts" className={cn(['justify-start', segment === 'providers' ? ActiveButtonClass : undefined])}>Login Providers</LinkButton>
      <LinkButton appearance="menu" href="/applications" icon="apps" className={cn(['justify-start', segment === 'applications' ? ActiveButtonClass : undefined])}>Applications</LinkButton>
      <Separator/>
      <LinkButton appearance="menu" href="/dev/applications" icon="window-dev-tools" className="justify-start">Developer</LinkButton>
    </NavLayout>
  );
}

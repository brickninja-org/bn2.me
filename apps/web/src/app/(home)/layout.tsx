import type { ReactNode } from 'react';

import { HomeLayout } from 'fumadocs-ui/layouts/home';

import { baseOptions } from '@/app/layout.config';
import { LinkButton } from '@/components/button';
import { Iconify } from '@/components/iconify/iconify.client';
import { getUser } from '@/lib/session';

export interface HomeLayoutProps {
  children: ReactNode,
}

export default async function Layout({ children }: HomeLayoutProps) {
  const user = await getUser();

  return (
    <HomeLayout
      {...baseOptions}
      links={[
        {
          items: [
            {
              icon: <Iconify icon="book"/>,
              text: 'Getting Started',
              url: '/dev/docs',
            }
          ],
          on: 'menu',
          text: 'Documentation',
          type: 'menu',
        },
        {
          active: 'none',
          on: 'nav',
          text: 'Documentation',
          url: '/dev/docs/introduction',
        },
        {
          active: 'nested-url',
          on: 'nav',
          text: 'Showcase',
          url: '/showcase',
        },
        {
          type: 'custom',
          children: <LinkButton href={user ? '/profile' : '/login'} icon="person" variant="ghost">{user ? user.name : 'Login'}</LinkButton>,
          secondary: true,
        },
      ]}
      searchToggle={{ enabled: false }}
    >
      <div aria-hidden="true" className="gradient-background home-gradient-background"/>
      {children}
    </HomeLayout>
  );
}

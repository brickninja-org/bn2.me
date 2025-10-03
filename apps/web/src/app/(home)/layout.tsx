import type { ReactNode } from 'react';

import { HomeLayout } from 'fumadocs-ui/layouts/home';

import { baseOptions } from '@/app/layout.config';
import { LinkButton } from '@/components/button';
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
              text: 'Discover',
              url: '/discover',
            }
          ],
          on: 'menu',
          text: 'Applications',
          type: 'menu',
        },
        {
          active: 'none',
          on: 'nav',
          text: 'Discover',
          url: '/discover',
        },
        {
          active: 'none',
          on: 'nav',
          text: 'Extension',
          url: '/extension'
        },
        {
          type: 'custom',
          children: <LinkButton href={user ? '/profile' : '/login'} icon="person" variant="ghost">{user ? user.name : 'Login'}</LinkButton>,
          secondary: true,
        },
      ]}
    >
      <div aria-hidden="true" className="gradient-background home-gradient-background"/>
      {children}
    </HomeLayout>
  );
}

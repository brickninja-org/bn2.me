import type { ReactNode } from 'react';

import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from 'src/app/layout.config';

export interface HomeLayoutProps {
  children: ReactNode,
}

export default function Layout({ children }: HomeLayoutProps) {
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
      ]}
    >
      <div aria-hidden="true" className="gradient-background home-gradient-background"/>
      {children}
    </HomeLayout>
  );
}

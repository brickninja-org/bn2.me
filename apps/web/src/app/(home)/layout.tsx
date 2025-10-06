import type { Route } from 'next';

import NextLink from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';

import { baseOptions } from '@/app/layout.config';
import { LinkButton } from '@/components/button';
import { Iconify } from '@/components/iconify/iconify.client';
import { getUser } from '@/lib/session';
import { Link } from '@heroui/react';

export default async function Layout({ children }: LayoutProps<'/'>) {
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
      <footer className="flex flex-wrap justify-between gap-4 py-4 px-8 border-t">
        <div className="text-inherit"><b>bn2.me</b> by <Link href="https://brick.ninja">brick.ninja</Link> © {new Date().getFullYear()}</div>
        <div className="flex flex-wrap gap-4">
          <NextLink href="/dev/docs">Developer Documentation</NextLink>
          <NextLink href={'/legal' as Route}>Legal Notice</NextLink>
          <NextLink href="/legal/privacy-policy">Privacy Policy</NextLink>
        </div>
      </footer>
    </HomeLayout>
  );
}

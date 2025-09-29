'use client';

import { Card, cn } from '@heroui/react';
import { LinkButton } from '@/components/button';
import { Iconify } from '@/components/iconify/iconify.client';

interface BrowserCardProps {
  className?: string,
  children?: React.ReactNode,
}

export const BrowserCard = (props: BrowserCardProps) => {
  const { children, className } = props;

  return (
    <Card className={cn('relative flex flex-col bg-background/67 shadow-md dark:shadow-none', className)}>
      <Card.Header className="flex-row items-center justify-center gap-2 lg:mx-32 p-2 rounded-2xl bg-black/5 dark:bg-white/5 text-muted">
        <Iconify icon="lock"/>
        example.com
      </Card.Header>
      <Card.Content className="flex-1 pt-8 pb-4 px-4 lg:pr-[460px]">
        <h3 className="font-bitter font-bold text-3xl mb-4">Connect Applications</h3>
        <p className="mb-6">Connect your Rebrickable accounts directly to applications. You do not have to create an API key and copy-paste it for every application anymore. If you have multiple accounts, you can simply choose the accounts the application should have access to.</p>
        <p className="mb-6">For all applications with bn2.me integration it is just one click to authorize access to your Rebrickable accounts. You review the requested permissions and authorize them using the secure OAuth 2.0 protocol. The application will only receive the permissions you granted.</p>
        <LinkButton href="/discover" icon="chevron-right" variant="ghost" className="[--icon-color:var(--color-accent)]"><span>Discover Applications</span></LinkButton>
      </Card.Content>
      <Card.Footer className="static lg:absolute max-w-[460px] -bottom-16 -right-8 mx-auto -mb-16 lg:mb-0">
        {children}
      </Card.Footer>
    </Card>
  );
};

'use client';

import { buttonVariants, cn, Card, Separator } from '@heroui/react';
import { ApplicationImage } from '@/components/application/ApplicationImage';
import { PermissionList } from '@/components/permission/PermissionList';
import { Iconify } from '@/components/iconify/iconify.client';

interface ExampleConnectCardProps {
  className?: string,
}

export const ExampleConnectCard = (props: ExampleConnectCardProps) => {
  const { className } = props;

  return (
    <Card className={cn('bg-panel shadow-lg dark:shadow-none', className)}>
      <Card.Header>
        <div className="flex items-center gap-4">
          <ApplicationImage fileId={null} size={48}/>
          <Card.Title className="font-bitter font-bold text-3xl">example.com</Card.Title>
        </div>
      </Card.Header>
      <Card.Content>
        <Separator className="h-0.5 my-3"/>
        <p className="mb-4">example.com wants to access the following data of your bn2.me account.</p>
        <div className="flex gap-2 items-center mb-2 py-1.5 px-4 rounded-sm border">
          <Iconify icon="person"/>
          Your username
        </div>
        <div className="flex gap-2 items-base mb-2 py-1.5 px-4 rounded-sm border">
          <Iconify icon="wrench" className="mt-1"/>
          <div>
            Read-only access to the Rebrickable API
            <PermissionList permissions={['account', 'collections']}/>
          </div>
        </div>
        <Separator className="h-0.5 my-4"/>
        <div>Select Accounts</div>
        <div className="flex gap-2 items-center mt-1.5"><Iconify icon="check" className="w-5 h-5 p-0.5 rounded-xs bg-focus text-white"/>Main Account (account.1234)<Iconify icon="shield-check"/></div>
        <div className="flex gap-2 items-center mt-1"><Iconify icon="check" className="w-5 h-5 p-0.5 rounded-xs bg-focus text-white"/>another.9876</div>
        <div className="flex gap-2 items-center mt-1.5"><Iconify icon="plus" className="w-5 h-5 p-0.5"/>Add account</div>
        <Separator className="h-0.5 my-3"/>
      </Card.Content>
      <Card.Footer>
        <div className={buttonVariants({ class: 'w-full pointer-events-none' })}>
          <Iconify icon="person"/>
          Authorize example.com
        </div>
      </Card.Footer>
    </Card>
  );
};

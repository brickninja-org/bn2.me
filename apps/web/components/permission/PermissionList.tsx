import type { FC } from 'react';

import { Permission } from './Permission';

export interface PermissionListProps {
  permissions: string[];
}

export const PermissionList: FC<PermissionListProps> = ({ permissions }) => {
  return (
    <ul className="flex flex-wrap gap-2 my-2">
      {permissions.map((permission) => (
        <li className="py-1 px-2 rounded-full border border-dark bg-light text-sm leading-none" key={permission}><Permission permission={permission}/></li>
      ))}
    </ul>
  );
};

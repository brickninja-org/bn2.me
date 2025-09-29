import type { FC } from 'react';

import { Permission } from './Permission';

export interface PermissionListProps {
  permissions: string[],
}

export const PermissionList: FC<PermissionListProps> = ({ permissions }) => {
  return (
    <ul className="flex flex-wrap gap-2 my-2">
      {permissions.map((permission) => (
        <li key={permission}><Permission permission={permission}/></li>
      ))}
    </ul>
  );
};

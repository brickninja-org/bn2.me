import type { Metadata } from 'next';

import { NavLayout } from '@/components/layout/NavLayout';
import { Navigation } from '@/components/layout/Navigation';

import { ensureUserIsAdmin } from './admin';

export default async function AdminLayout({ children }: LayoutProps<'/admin'>) {
  await ensureUserIsAdmin();

  return (
    <NavLayout content={children}>
      <Navigation prefix="/admin/" items={[
        { segment: 'users', icon: 'user', label: 'Users' },
        { segment: 'apps', icon: 'apps', label: 'Apps' },
        { segment: 'authorization-requests', icon: 'user', label: 'Auth Requests' },
        { segment: 'api-keys', icon: 'key', label: 'API Keys' },
        { segment: 'requests', icon: 'api-status', label: 'API Requests' },
        { segment: 'email', icon: 'mail', label: 'Email' },
      ]}/>
    </NavLayout>
  );
}

export const metadata: Metadata = {
  title: {
    template: 'Admin: %s',
    default: '',
  },
};

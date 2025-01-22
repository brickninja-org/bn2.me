import { notFound } from 'next/navigation';

import { getUser } from '@/lib/session';

export async function ensureUserIsAdmin() {
  const user = await getUser();

  if (!user || !user.roles.includes('Admin')) {
    notFound();
  }
}

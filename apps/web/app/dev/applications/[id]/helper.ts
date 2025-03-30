import { cache } from 'react';
import { notFound } from 'next/navigation';

import { db } from '@/lib/db';

export const getApplicationById = cache(
  async (id: string, userId: string) => {
    const application = await db.application.findUnique({ where: { id, ownerId: userId }});

    if (!application) {
      notFound();
    }

    return application;
  },
);

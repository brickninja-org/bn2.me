'use client';

import { Chip } from '@heroui/react';
import { currentVersion } from '@/utils/version';

export const VersionChip = () => {
  return (
    <Chip className="bg-default/50 dark:border-border rounded-full dark:bg-white/10">
      <span className="text-muted">v{currentVersion}</span>
    </Chip>
  );
};

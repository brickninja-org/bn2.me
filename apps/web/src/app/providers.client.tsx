'use client';

import type { FC, ReactNode } from 'react';

import { RootProvider } from 'fumadocs-ui/provider';

interface ProviderProps {
  children: ReactNode,
}

export const Providers: FC<ProviderProps> = ({ children }) => {
  return (
    <RootProvider search={{ enabled: false }}>
      {children}
    </RootProvider>
  );
};

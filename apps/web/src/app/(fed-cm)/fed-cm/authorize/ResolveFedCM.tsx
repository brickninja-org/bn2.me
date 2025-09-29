'use client';

import type { FC } from 'react';

import { useEffect } from 'react';

export interface ResolveFedCMProps {
  code: string | undefined | null,
}

export const ResolveFedCM: FC<ResolveFedCMProps> = ({ code }) => {
  useEffect(() => {
    if ('IdentityProvider' in window) {
      if (code) {
        window.IdentityProvider.resolve(code);
      } else {
        window.IdentityProvider.close();
      }
    }
  }, [code]);

  return null;
};

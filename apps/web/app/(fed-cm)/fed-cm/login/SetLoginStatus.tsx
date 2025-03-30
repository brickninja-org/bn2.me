'use client';

import type { FC } from 'react';

import { useEffect } from 'react';

export const SetLoginStatus: FC = () => {
  useEffect(() => {
    if('login' in navigator) {
      navigator.login.setStatus('logged-in');
    }

    if('IdentityProvider' in window) {
      window.IdentityProvider.close();
    }
  });

  return null;
};

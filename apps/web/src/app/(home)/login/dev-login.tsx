'use client';

import type { FC } from 'react';

import { useCallback } from 'react';
import { Button } from '@heroui/react';

import { devLogin } from './dev-login.action';
import { Iconify } from '@/components/iconify/iconify.client';

export interface DevLoginProps {
  username?: string,
}

export const DevLogin: FC<DevLoginProps> = ({ username }) => {
  const login = useCallback(async () => {
    const name = username ?? prompt('username');

    if (name) {
      await devLogin(name);

      if ('login' in navigator) {
        (navigator.login as { setStatus(status: string): void }).setStatus('logged-in');
      }
    }
  }, [username]);

  return (
    <Button className="w-full justify-center" size="lg" variant="tertiary" onPress={login}>
      <Iconify icon="person"/>
      Dev Login
    </Button>
  );
};

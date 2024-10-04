'use client';

import { useCallback, type FC } from 'react';
import { IoPerson } from 'react-icons/io5';

import { Button } from '@brickninja-org/ui/components/form/button';

import { devLogin } from './dev-login.action';

export interface DevLoginProps {
  username?: string;
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
    <Button className="w-full justify-center" onClick={login}><IoPerson/>Dev Login</Button>
  );
};

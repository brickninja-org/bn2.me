'use client';

import type { FC } from 'react';

import { useCallback, useState } from 'react';

import { Button } from '@brickninja-org/ui/components/form/Button';
import { CopyButton } from '@brickninja-org/ui/components/form/buttons/CopyButton';
import { TextInput } from '@brickninja-org/ui/components/form/TextInput';

export interface ResetClientSecretProps {
  clientId: string;
  hasClientSecret: boolean;
  resetAction: (clientId: string) => Promise<string>;
}

export const ResetClientSecret: FC<ResetClientSecretProps> = ({ clientId, hasClientSecret, resetAction }) => {
  const [clientSecret, setClientSecret] = useState<string>();

  const handleReset = useCallback(async () => {
    const clientSecret = await resetAction(clientId);
    setClientSecret(clientSecret);
  }, [clientId, resetAction]);

  return (
    <>
      <TextInput value={clientSecret ?? (hasClientSecret ? '***' : '')} readOnly/>
      {!clientSecret
        ? <Button onClick={handleReset}>{hasClientSecret ? 'Reset client_secret' : 'Generate Client Secret'}</Button>
        : <CopyButton copy={clientSecret} icon="copy">Copy</CopyButton>}
    </>
  );
};

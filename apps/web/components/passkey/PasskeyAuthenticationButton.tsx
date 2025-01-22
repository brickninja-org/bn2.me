'use client';

import type { FC } from 'react';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { browserSupportsWebAuthn, startAuthentication } from '@simplewebauthn/browser';

import { Dialog } from '@brickninja-org/ui/components/dialog/Dialog';
import { Button } from '@brickninja-org/ui/components/form/Button';

import { LoginOptions } from 'app/login/action';
import { NoticeContext, useShowNotice } from '@/components/notice/NoticeContext';

import { getAuthenticationOptions, submitAuthentication } from './actions';
import { PasskeyAuthenticationDialog } from './PasskeyAuthenticatinDialog';

export interface PasskeyAuthenticationButtonProps {
  className?: string;
  options: LoginOptions;
}

export const PasskeyAuthenticationButton: FC<PasskeyAuthenticationButtonProps> = ({ className, options: loginOptions }) => {
  const [supportsPasskeys, setSupportsPasskeys] = useState(false);
  const [pending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const notice = useShowNotice();

  useEffect(() => {
    setSupportsPasskeys(browserSupportsWebAuthn());
  }, []);

  const handleClick = useCallback(() => {
    // hide any notice that might still be visible
    notice.show(null);

    if (loginOptions.userId) {
      startTransition(async () => {
        try {
          // get authentication options from server
          const { options, challenge } = await getAuthenticationOptions();

          // start passkey authentication
          const authenticaion = await startAuthentication({ optionsJSON: options });

          // submit authentication to server to verify challenge and start session
          await submitAuthentication(challenge, authenticaion, loginOptions.returnTo);
        } catch (e) {
          console.error(e);
          if (e instanceof Error) {
            if (e.name === 'NotAllowedError') {
              // user has canceled
              notice.show({ type: 'error', children: 'Passkey authentication canceled.' });
              return;
            }
          }

          notice.show({ type: 'error', children: 'Unknown error during passkey authentication.' });
        }
      });
    } else {
      setDialogOpen(true);
    }
  }, [loginOptions.returnTo, loginOptions.userId, notice]);

  return (
    <>
      <Button icon={pending ? 'loading' : 'person-passkey'} disabled={!supportsPasskeys || pending} onClick={handleClick} className={className}>
        Login with Passkey
      </Button>
      <Dialog open={dialogOpen} title="Passkey" onClose={() => setDialogOpen(false)}>
        <NoticeContext>
          <PasskeyAuthenticationDialog options={loginOptions}/>
        </NoticeContext>
      </Dialog>
    </>
  );
};

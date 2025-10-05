'use client';

import type { FC } from 'react';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { browserSupportsWebAuthn, startRegistration } from '@simplewebauthn/browser';
import { Button, Spinner } from '@heroui/react';

import { useShowNotice } from '@/components/notice/NoticeContext';

import { getRegistrationOptions, submitRegistration } from './actions';
import { Iconify } from '../iconify/iconify.client';

export const PasskeyRegistrationButton: FC = () => {
  const [supportsPasskeys, setSupportsPasskeys] = useState(false);
  const [pending, startTransition] = useTransition();
  const notice = useShowNotice();

  useEffect(() => {
    setSupportsPasskeys(browserSupportsWebAuthn());
  }, []);

  const handleClick = useCallback(() => startTransition(async () => {
    // hide any notice that might still be visible
    notice.show(null);

    try {
      // get registration options from server
      const { options, challenge } = await getRegistrationOptions({ type: 'add' });

      // start passkey registration
      const registration = await startRegistration({ optionsJSON: options });

      // submit registration to server to verify challenge and store passkey
      await submitRegistration({ type: 'add' }, challenge, registration);
    } catch (e) {
      console.error(e);
      if(e instanceof Error) {
        if(e.name === 'InvalidStateError') {
          // don't show any error, local device is already registered
          return;
        } else if(e.name === 'NotAllowedError') {
          // user has canceled
          notice.show({ type: 'error', children: 'Passkey registration canceled.' });

          return;
        }
      }

      notice.show({ type: 'error', children: 'Unknown error during passkey registration.' });
    }
  }), [notice]);

  return (
    <Button isDisabled={!supportsPasskeys || pending} onPress={handleClick}>
      {pending ? <Spinner/> : <Iconify icon="person-fill"/>}
      Add Passkey
    </Button>
  );
};

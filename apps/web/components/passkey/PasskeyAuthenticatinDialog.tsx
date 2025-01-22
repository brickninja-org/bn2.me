'use client';

import type { FC } from 'react';
import type { LoginOptions } from 'app/login/action';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { browserSupportsWebAuthnAutofill, startAuthentication, startRegistration, WebAuthnAbortService } from '@simplewebauthn/browser';
import { DialogActions } from '@brickninja-org/ui/components/dialog/DialogActions';
import { Button } from '@brickninja-org/ui/components/form/Button';
import { Label } from '@brickninja-org/ui/components/form/Label';
import { TextInput } from '@brickninja-org/ui/components/form/TextInput';

import { useShowNotice } from '@/components/notice/NoticeContext';

import { getAuthenticationOptions, getRegistrationOptions, submitAuthentication, submitRegistration } from './actions';

const invalidUsernameRegex = /[^a-z0-9._-]/i;

export interface PasskeyAuthenticationDialogProps {
  options: LoginOptions;
}

export const PasskeyAuthenticationDialog: FC<PasskeyAuthenticationDialogProps> = ({ options: { returnTo }}) => {
  const [pending, startTransition] = useTransition();
  const [isRegistration, setIsRegistration] = useState(false);
  const [username, setUsername] = useState('');
  const [authenticationTimeout, startAuthenticationTimeout, stopAuthenticationTimeout] = useTimeout();
  const notice = useShowNotice();

  const initializeConditionalUi = useCallback(async () => {
    const supported = await browserSupportsWebAuthnAutofill();

    if (!supported) {
      console.warn('webauthn conditional UI not supported');
      return;
    }

    console.log('initializing webauthn conditional UI');

    try {
      const { options, challenge } = await getAuthenticationOptions();

      if (options.timeout) {
        startAuthenticationTimeout(options.timeout);
      }

      // start authentication using "Conditional UI"
      // this promise only resolves when the users clicks on the autocomplete options of the text input
      const authentication = await startAuthentication({ optionsJSON: options, useBrowserAutofill: true });
      await startTransition(() => submitAuthentication(challenge, authentication, returnTo));
    } catch (e) {
      console.error(e);

      if (e instanceof Error && e.name === 'AbortError') {
        // silently ignore abort errors, these are 99% because we started a different authorization request,
        // either by restarting the conditional UI (especially in dev with react strict mode) or by submitting the form
        return;
      }

      notice.show({ type: 'error', children: 'Unknown error during passkey authentication.' });
    }
  }, [notice, returnTo, startAuthenticationTimeout]);

  // authentication submit handler
  const handleAuthenticate = useCallback(() => startTransition(async () => {
    // hide any error messages that are currently shown
    notice.show(null);

    try {
      const authenticationOnRegistration = await getAuthenticationOptions();
      const authentication = await startAuthentication({ optionsJSON: authenticationOnRegistration.options });
      await submitAuthentication(authenticationOnRegistration.challenge, authentication, returnTo);
    } catch (e) {
      console.error(e);

      // check if user has canceled
      if (e instanceof Error && e.name === 'NotAllowedError') {
        notice.show({ type: 'error', children: 'Passkey authentication canceled.' });
        return;
      }

      // show error
      notice.show({ type: 'error', children: 'Unknown error during passkey authentication.' });
    }
  }), [notice, returnTo]);

  // registration submit handler
  const handleRegister = useCallback(() => startTransition(async () => {
    // hide any error messages that are currently shown
    notice.show(null);

    // stop timeout timer for conditional UI
    stopAuthenticationTimeout();

    try {
      const authenticationOnRegistration = await getRegistrationOptions({ type: 'new', username });
      const registration = await startRegistration({ optionsJSON: authenticationOnRegistration.options });
      await submitRegistration({ type: 'new', username, returnTo }, authenticationOnRegistration.challenge, registration);
    } catch (e) {
      console.error(e);

      // restart conditional UI
      initializeConditionalUi();

      // check if user has canceled
      if (e instanceof Error && e.name === 'NotAllowedError') {
        notice.show({ type: 'error', children: 'Passkey authentication canceled.' });
        return;
      }

      // show error
      notice.show({ type: 'error', children: 'Unknown error during passkey authentication.' });
    }
  }), [notice, stopAuthenticationTimeout, username, returnTo, initializeConditionalUi]);

  // initialize conditional UI on registration page
  useEffect(() => {
    if (isRegistration) {
      initializeConditionalUi();

      return () => {
        WebAuthnAbortService.cancelCeremony();
        stopAuthenticationTimeout();
      };
    }
  }, [initializeConditionalUi, isRegistration, stopAuthenticationTimeout]);

  // hide errors when toggling between signin/registration or when timeout is exceeded
  useEffect(() => {
    notice.show(null);
  }, [authenticationTimeout, isRegistration, notice]);

  const isInvalidUsername = invalidUsernameRegex.test(username);

  if (authenticationTimeout) {
    return (
      <>
        <p>Passkey authentication challenge has expired.</p>
        <DialogActions>
          <Button variant="faded" radius="sm" onPress={() => initializeConditionalUi()} icon="revision">Restart</Button>
        </DialogActions>
      </>
    );
  }

  return (
    <>
      <p className="max-w-lg">
        Passkeys enable you to securely sign in to you bn2.me account using your fingerprint, face, screen lock, or hardware security key.
      </p>
      {isRegistration ? (
        <>
          <Label label="Username">
            <div className="w-full flex flex-col">
              <TextInput value={username} onChange={setUsername} readOnly={pending} autoComplete="username webauthn"/>
              {isInvalidUsername && <div className="mt-2 color-error">Invalid username</div>}
            </div>
          </Label>
          <DialogActions description={<>Already have an account? <Button onClick={() => setIsRegistration(false)}>Sign In</Button></>}>
            <Button disabled={pending || username.length < 2 || isInvalidUsername} icon={pending ? 'loading' : 'person-passkey'} onClick={handleRegister}>Register</Button>
          </DialogActions>
        </>
      ) : (
        <DialogActions description={<>Don&apos;t have an account? <Button onClick={() => setIsRegistration(true)}>Register Now</Button></>}>
          <Button disabled={pending} icon={pending ? 'loading' : 'person-passkey'} onClick={handleAuthenticate}>Sign In</Button>
        </DialogActions>
      )}
    </>
  );
};

function useTimeout() {
  const [isTimedOut, setIsTimedOut] = useState(false);
  const ref = useRef<NodeJS.Timeout>(null);

  const stopTimeout = useCallback(() => {
    setIsTimedOut(false);

    if (ref.current) {
      clearTimeout(ref.current);
    }
  }, []);

  const startTimeout = useCallback((ms: number) => {
    stopTimeout();

    ref.current = setTimeout(() => setIsTimedOut(true), ms);
  }, [stopTimeout]);

  // clear timeout on unmount
  useEffect(() => () => {
    if (ref.current) {
      clearTimeout(ref.current);
    }
  }, []);

  return [isTimedOut, startTimeout, stopTimeout] as const;
}

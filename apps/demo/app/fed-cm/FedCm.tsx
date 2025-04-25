'use client';

import { FC, startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Bn2MeClient, Scope } from '@bn2me/client';
import { PKCEChallenge } from '@bn2me/client/pkce';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Button } from '@brickninja-org/ui/components/form/Button';
import { Label } from '@brickninja-org/ui/components/form/Label';
import { Select } from '@brickninja-org/ui/components/form/Select';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';
import { Checkbox } from '@brickninja-org/ui/components/form/Checkbox';

export interface FedCmProps {
  clientId: string;
  bn2meUrl: string;
  pkceChallenge: PKCEChallenge,
}

export const FedCm: FC<FedCmProps> = ({ clientId, bn2meUrl, pkceChallenge }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [supportsFedCmMode, setSupportsFedCmMode] = useState(false);
  const [abort, setAbort] = useState<AbortController>();
  const [error, setError] = useState<string>();
  const [mediation, setMediation] = useState<CredentialMediationRequirement>('optional');
  const [mode, setMode] = useState<'passive' | 'active'>();
  const [scopes, setScopes] = useState<Scope[]>([Scope.Identify, Scope.Email]);

  const bn2me = useMemo(() => new Bn2MeClient({ client_id: clientId }, { url: bn2meUrl }), [clientId, bn2meUrl]);

  // check if the browser supports mode=button
  useEffect(() => {
    setLoading(false);

    // check if this browser supports mode=button
    try {
      navigator.credentials.get({
        identity: Object.defineProperty(
          {}, 'mode', {
            get () { startTransition(() => { setSupportsFedCmMode(true); }); }
          }
        )
      } as CredentialRequestOptions).catch(() => {});
    } catch {
      // empty on purpose
    }
  }, []);


  // trigger FedCM
  const handleClick = useCallback(() => {
    if (abort !== undefined) {
      abort.abort();
    }

    const abortController = new AbortController();
    setAbort(abortController);
    setError(undefined);

    bn2me.fedCM.request({ mode, mediation, signal: abortController.signal, scopes, ...pkceChallenge }).then((credential) => {
      setAbort(undefined);

      if (credential) {
        // need to append `iss` as well because /callback does issuer verification
        router.push(`/callback?code=${credential.token}&iss=${encodeURIComponent(new URL(bn2meUrl).origin)}`);
      }
    }).catch((e) => {
      if (!(e instanceof DOMException) || e.name === 'AbortError') {
        setAbort(undefined);
        setError(e.toString());
      }
    });
  }, [abort, bn2me.fedCM, bn2meUrl, mediation, mode, pkceChallenge, router, scopes]);

  if (loading || !bn2me.fedCM.isSupported()) {
    return <Notice type="error">Your browser does not support FedCM.</Notice>;
  }

  return (
    <div className="flex flex-col gap-4 border border-(--color-border) p-4 rounded-xs bg-(--color-background-light)">
      <Label label="Mediation">
        <Select options={['required', 'optional', 'silent'].map((m) => ({ label: m, value: m }))} value={mediation} onChange={setMediation as (value: string) => void}/>
      </Label>

      {supportsFedCmMode && (
        <Label label="Mediation">
          <Select options={['passive', 'active'].map((m) => ({ label: m, value: m }))} value={mode} onChange={setMode as (value: string) => void}/>
        </Label>
      )}
      <div className="w-full flex flex-col">
        {Object.values(Scope).map((scope) => (
          <Checkbox key={scope} checked={scopes.includes(scope)} onChange={(checked) => setScopes(checked ? [...scopes, scope] : scopes.filter((s) => s !== scope))}>
            {scope}
          </Checkbox>
        ))}
      </div>

      <FlexRow>
        <Button onClick={handleClick} icon={abort ? 'loading' : undefined /* 'bn2me' */}>Trigger FedCM</Button>
        {abort && <Button onClick={() => { abort.abort(); setAbort(undefined); }}>Cancel</Button>}
      </FlexRow>

      {error && (
        <div className="text-red-600">
          {error}
          <div className="mt-1 text-sm text-gray-600">Check the browser console for more details.</div>
        </div>
      )}
    </div>
  );
};

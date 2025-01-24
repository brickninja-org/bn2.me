'use client';

import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Bn2MeClient } from '@bn2me/client';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Button } from '@brickninja-org/ui/components/form/Button';
import { Label } from '@brickninja-org/ui/components/form/Label';
import { Select } from '@brickninja-org/ui/components/form/Select';

export interface FedCmProps {
  clientId: string;
  bn2meUrl: string;
}

export const FedCm: FC<FedCmProps> = ({ clientId, bn2meUrl }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [supportsFedCmMode, setSupportsFedCmMode] = useState(false);
  const [abort, setAbort] = useState<AbortController>();
  const [error, setError] = useState<string>();
  const [mediation, setMediation] = useState<CredentialMediationRequirement>('optional');
  const [mode, setMode] = useState<undefined | 'button'>();
  const bn2me = useMemo(() => new Bn2MeClient({ client_id: clientId }, { url: bn2meUrl }), [clientId, bn2meUrl]);

  // check if the browser supports mode=button
  useEffect(() => {
    let supportsFedCmMode = false;
    try {
      navigator.credentials.get({
        identity: Object.defineProperty(
          {}, 'mode', {
            get () { supportsFedCmMode = true; }
          }
        )
      } as CredentialRequestOptions).catch(() => {});
    } catch {
      // empty on purpose
    }

    setSupportsFedCmMode(supportsFedCmMode);
    setLoading(false);
  }, []);

  // trigger FedCM
  const handleClick = useCallback(() => {
    if (abort !== undefined) {
      abort.abort();
    }

    const abortController = new AbortController();
    setAbort(abortController);
    setError(undefined);

    bn2me.fedCM.request({ mode, mediation, signal: abortController.signal }).then((credential) => {
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
  }, [abort, bn2me.fedCM, bn2meUrl, mediation, mode, router]);

  if (loading || !bn2me.fedCM.isSupported()) {
    return <p>Your browser does not support FedCM.</p>;
  }

  return (
    <div className="flex flex-col gap-4 border border-gray-200 p-4 rounded-xs bg-gray-50">
      <Label label="Mediation">
        <Select options={['required', 'optional', 'silent'].map((m) => ({ label: m, value: m }))} value={mediation} onChange={setMediation as (value: string) => void}/>
      </Label>

      {supportsFedCmMode && (
        <Label label="Mediation">
          <Select options={['passive', 'active'].map((m) => ({ label: m, value: m }))} value={mode} onChange={setMode as (value: string) => void}/>
        </Label>
      )}

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

'use client';

import { Bn2MeClient } from '@bn2me/client';
import { type FC, useEffect, useMemo } from 'react';

export interface ClientProps {
  clientId: string;
  bn2meUrl: string;
  accessToken?: string;
}

export const Client: FC<ClientProps> = ({ clientId, bn2meUrl, accessToken }) => {
  const bn2me = useMemo(() => new Bn2MeClient({ client_id: clientId }, { url: bn2meUrl }), [clientId, bn2meUrl]);

  useEffect(() => {
    // @ts-expect-error global
    window.bn2me = bn2me;

    // @ts-expect-error global
    window.bn2meApi = accessToken ? bn2me.api(accessToken) : undefined;
  });

  return null;
};

import { Bn2MeError } from './error';

export interface FedCMRequestOptions {
  mediation?: CredentialMediationRequirement;
  mode?: 'button';
  signal?: AbortSignal;
}

export class Bn2MeFedCM {
  #configUrl;
  #clientId;

  constructor(configUrl: URL, clientId: string) {
    this.#configUrl = configUrl;
    this.#clientId = clientId;
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'IdentityCredential' in window;
  }

  request({ mediation, signal, mode }: FedCMRequestOptions) {
    if(!this.isSupported()) {
      throw new Bn2MeError('FedCM is not supported');
    }

    return navigator.credentials.get({
      mediation, signal,
      identity: {
        providers: [{
          configURL: this.#configUrl,
          clientId: this.#clientId,
        }],
        mode
      }
    } as CredentialCreationOptions) as unknown as Promise<null | { token: string, type: 'identity' }>;
  }
}

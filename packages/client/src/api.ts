import type { DPoPCallback, Options } from './types';
import { jsonOrError, okOrError } from './util';

export interface UserResponse {
  sub: string;
  user: {
    id: string;
    name: string;
    email?: string;
    emailVerified?: boolean;
  },
  settings?: unknown;
}

export interface AccountsResponse {
  accounts: {
    id: string;
    name: string;
    verified?: boolean;
    displayName?: string | null;
  }[]
}

export interface SubtokenOptions {
  permissions?: string[];
}

export interface SubtokenResponse {
  subtoken: string;
  expiresAt: string;
}

export interface ApiOptions extends Options {
  dpop?: DPoPCallback;
}

export class Bn2MeApi {
  constructor(private access_token: string, private options?: Partial<ApiOptions>) {}

  user(): Promise<UserResponse> {
    return this.#requestWithDPoP('api/user')
      .then((request) => fetch(request))
      .then(jsonOrError);
  }

  saveSettings(settings: unknown): Promise<void> {
    return this.#requestWithDPoP('api/user/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
      .then((request) => fetch(request))
      .then(okOrError);
  }

  accounts(): Promise<AccountsResponse> {
    return this.#requestWithDPoP('api/accounts')
      .then((request) => fetch(request))
      .then(jsonOrError);
  }

  subtoken(accountId: string, options?: SubtokenOptions): Promise<SubtokenResponse> {
    const url = this.#getUrl(`api/accounts/${accountId}/subtoken`);

    if (options?.permissions) {
      url.searchParams.set('permissions', options.permissions.join(','));
    }

    return this.#requestWithDPoP(url)
      .then((request) => fetch(request))
      .then(jsonOrError);
  }

  #getUrl(url: string) {
    return new URL(url, this.options?.url || 'https://bn2me.vercel.app/');
  }

  async #requestWithDPoP(endpoint: string | URL, init?: RequestInit): Promise<Request> {
    const url = endpoint instanceof URL ? endpoint : this.#getUrl(endpoint);

    const dpop = this.options?.dpop;

    const headers = new Headers(init?.headers);
    headers.set('Authorization', `${dpop ? 'DPoP' : 'Bearer'} ${this.access_token}`);

    if (dpop) {
      headers.set('DPoP', await dpop({
        htm: init?.method || 'GET',
        htu: url.toString(),
        accessToken: this.access_token,
      }));
    }

    return new Request(
      url,
      { cache: 'no-cache', ...init, headers },
    );
  }
}

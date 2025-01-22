import 'server-only';

import type { UserProviderRequest } from '@bn2me/database';

import { UserProviderType } from '@bn2me/database';

import { github } from './github';
import { google } from './google';

export interface ProviderConfig {
  id: UserProviderType,

  supportsPKCE: boolean,

  getAuthUrl(options: { redirect_uri: string, state: string, code_challenge?: string, code_challenge_method?: string, prompt?: boolean }): string

  getUser(params: { searchParams: { code?: string } & Record<string, string | undefined>, authRequest: UserProviderRequest }): Promise<ProviderProfile>
}

export interface ProviderProfile {
  /** identifier used by the provider */
  accountId: string;

  /** display name that is used on the provider side to identify the user */
  accountName: string;

  /** username that should be used on bn2.me  */
  username: string;

  /** email */
  email?: string;

  emailVerified?: boolean;

  /** token to make additional requests in the future */
  token: object;
}

type OAuth2ProviderType = Exclude<UserProviderType, 'passkey'>;

// map user provider keys to provider configs
export const providers: Record<string, ProviderConfig | undefined> = {
  [UserProviderType.github]: github(),
  [UserProviderType.google]: google(),
} satisfies Record<OAuth2ProviderType, ProviderConfig | undefined>;

export function getJsonIfOk(response: Response) {
  if(!response.ok) {
    throw new Error('Could not load json');
  }

  return response.json();
}
export enum Scope {
  Identify = 'identify',
  Email = 'email',

  Accounts = 'accounts',
  Accounts_Verified = 'accounts.verified',
  Accounts_DisplayName = 'accounts.displayName',

  BN2_Account = 'bn2:account',
  BN2_Collections = 'bn2:collections',
}

export interface ClientInfo {
  client_id: string;
  client_secret?: string;
}

export interface Options {
  url: string;
}

export interface DPoPParams {
  htm: 'POST' | 'GET' | (string & {});
  htu: string;
  nonce?: string;
  accessToken?: string;
}

export type DPoPCallback = (params: DPoPParams) => string | Promise<string>;

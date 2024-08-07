import { Scope } from '@bn2me/client';

export function hasBn2Scopes(scopes: Scope[]): boolean {
  return scopes.some((scope) => scope.startsWith('bn2:'));
}

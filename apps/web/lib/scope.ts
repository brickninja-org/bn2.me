import type { Scope } from '@bn2me/client';

export function hasBn2Scopes(scopes: Scope[]): boolean {
  return scopes.some((scope) => scope.startsWith('bn2:'));
}

export function scopeToPermissions(scopes: Scope[]): Permission[] {
  return scopes
  .filter((scope) => scope.startsWith('bn2:'))
  .map((permission) => permission.substring(4) as Permission);
}

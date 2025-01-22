import 'server-only';

import type { SignerOptions } from 'fast-jwt';

import { createSigner as jwtSigner, createVerifier as jwtVerifier } from 'fast-jwt';

function getKey() {
  const key = process.env.JWT_SECRET;

  if(!key) {
    throw new Error('JWT_SECRET env variable not set');
  }

  return key;
}

export const createSigner = (options: Partial<SignerOptions> = {}) => jwtSigner({ key: getKey(), iss: 'bn2.me', ...options });
export const createVerifier = () => jwtVerifier({ key: getKey() });

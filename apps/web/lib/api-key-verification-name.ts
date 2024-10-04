import { createHash } from 'crypto';
import { getSessionOrRedirect } from './session';

export async function getApiKeyVerificationName() {
  const session = await getSessionOrRedirect();

  const verifyKey = createHash('sha256').update(session.userId).digest('base64url').substring(0, 8);

  return `bn2.me ${verifyKey}`;
}

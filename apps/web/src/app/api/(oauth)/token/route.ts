import { handleOptionsRequest, handleRequest } from '../request';
import { handleTokenRequest } from './token';

export const dynamic = 'force-dynamic';

export const POST = handleRequest(handleTokenRequest);

export const OPTIONS = handleOptionsRequest();

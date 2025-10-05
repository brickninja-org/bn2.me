import { handleOptionsRequest, handleRequest } from '@/app/api/(oauth)/request';
import { handleParRequest } from './par';

export const dynamic = 'force-dynamic';

export const POST = handleRequest(handleParRequest);

export const OPTIONS = handleOptionsRequest();

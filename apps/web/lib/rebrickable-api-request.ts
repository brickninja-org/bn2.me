import type { FetchOptions } from '@rebrickableapi/fetch';
import type { AuthenticatedOptions, EndpointType, KnownEndpoint, OptionsByEndpoint } from '@rebrickableapi/types/endpoints';

import { fetchRebrickableAPI as fetch, RebrickableAPIError } from '@rebrickableapi/fetch';

import { db } from './db';

// TODO: use custom userAgent
// const userAgent = 'Mozilla/5.0 (compatible; bn2.me/1.0; +https://bn2.me)';

const fetchOptions: FetchOptions = {};

export async function fetchRebrickableApi<Url extends KnownEndpoint | (string & {})>(endpoint: Url, options: OptionsByEndpoint<Url>): Promise<EndpointType<url>> {
  const url = new URL(endpoint, 'https://rebrickable.com/');

  const startTime = performance.now();

  let response;
  try {
    console.log(`> ${endpoint}`, options);
    response = await fetch<Url>(endpoint, { ...options, ...fetchOptions });
  } catch (error) {
    console.error(error);

    const status = error instanceof RebrickableAPIError
      ? error.response.status
      : -1;

    const endTime = performance.now();

    await db.apiRequest.create({
      select: { id: true },
      data: {
        endpoint: url.pathname,
        queryParameters: url.search,
        apiKey: getAccessTokenFromOptions(options),
        status,
        responseTimeMs: endTime - startTime,
        response: `${error}`,
      },
    });

    throw error;
  }

  const endTime = performance.now();

  await db.apiRequest.create({
    select: { id: true },
    data: {
      endpoint: url.pathname,
      queryParameters: url.search,
      apiKey: getAccessTokenFromOptions(options),
      status: 200,
      responseTimeMs: endTime - startTime,
    },
  });

  return response;
}

function getAccessTokenFromOptions(options: AuthenticatedOptions | Record<never, never>): string | undefined {
  if ('key' in options) {
    return options.key;
  }

  return undefined;
}

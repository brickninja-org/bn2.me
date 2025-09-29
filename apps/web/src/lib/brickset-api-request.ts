import { BricksetApiError, FetchOptions, fetchBricksetApi as fetch } from '@brickset-api/fetch';
import { AuthenticatedOptions, KnownEndpoint, OptionsByEndpoint, EndpointType } from '@brickset-api/types/endpoints';

import { db } from '@/lib/db';

const fetchOptions: FetchOptions = {};

export async function fetchBricksetApi<Url extends KnownEndpoint | (string & {})>(endpoint: Url, options: OptionsByEndpoint<Url>): Promise<EndpointType<Url>> {
  const url = new URL(endpoint, 'https://brickset.com/api/v3.1/');

  const startTime = performance.now();

  let response;
  try {
    console.log(`> ${endpoint}`, options);
    // @ts-expect-error - this is a known issue with the fetch function
    response = await fetch<Url>(endpoint, { ...options, ...fetchOptions });

    if (Array.isArray(response) && response.length === 2) {
      throw new Error(`${endpoint} returned an invalid response.`);
    }
  } catch (error) {
    console.error(error);

    const status = error instanceof BricksetApiError
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
  if ('accessToken' in options) {
    return options.accessToken as string;
  }

  return undefined;
}
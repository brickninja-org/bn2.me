import type { InferMetaType, InferPageType } from 'fumadocs-core/source';

import { loader } from 'fumadocs-core/source';

import { docs } from '@/.source';

export const source = loader({
  baseUrl: '/dev/docs',
  source: docs.toFumadocsSource(),
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;

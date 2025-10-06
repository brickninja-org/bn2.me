import type { InferMetaType, InferPageType } from 'fumadocs-core/source';

import { loader } from 'fumadocs-core/source';

import { docs, pages } from '@/.source';

export const docsSource = loader({
  baseUrl: '/dev/docs',
  source: docs.toFumadocsSource(),
});

export type Page = InferPageType<typeof docsSource>;
export type Meta = InferMetaType<typeof docsSource>;

export const pagesSource = loader({
  baseUrl: '/legal',
  source: pages.toFumadocsSource(),
});

export type LegalPage = InferPageType<typeof pagesSource>;
export type LegalMeta = InferMetaType<typeof pagesSource>;

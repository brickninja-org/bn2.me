import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

export const docs = defineDocs({
  dir: 'content/docs/dev',
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export const pages = defineDocs({
  dir: 'content/pages/legal',
  docs: {
    schema: frontmatterSchema.extend({
      date: z.date().optional(),
    }),
  },
  meta: {
    schema: metaSchema.extend({
      date: z.date().optional(),
    }),
  },
});

export default defineConfig({
  lastModifiedTime: 'git',
  mdxOptions: {
    providerImportSource: '@/mdx-components',
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
    },
    rehypePlugins: [],
    remarkPlugins: [],
  },
});

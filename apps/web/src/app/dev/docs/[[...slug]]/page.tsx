import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';

import { docsSource } from '@/lib/source';

// const apiStatusIcons = ['preview', 'new'];

export default async function Page(props: PageProps<'/dev/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = docsSource.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  // const isAPIStatusIcon = page.data.icon && apiStatusIcons.includes(page.data.icon);

  return (
    <DocsPage
      full={page.data.full}
      toc={page.data.toc}
    >
      <DocsTitle className="flex items-end gap-2">
        {page.data.title}
      </DocsTitle>
      <DocsDescription className="text-md mb-4 mt-2">{page.data.description}</DocsDescription>

      <DocsBody className="prose-sm">
        <MDXContent/>
      </DocsBody>
    </DocsPage>
  );
}

export async function generateMetadata(props: PageProps<'/dev/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = docsSource.getPage(params.slug);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

export function generateStaticParams() {
  return docsSource.generateParams().filter((param) => param.slug && param.slug.length > 0);
}

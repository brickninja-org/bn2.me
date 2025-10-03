import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';

import { source } from '@/lib/source';

// const apiStatusIcons = ['preview', 'new'];

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
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

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  return {
    description: page.data.description,
    title: page.data.title,
  };
}

export function generateStaticParams() {
  return source.generateParams().filter((param) => param.slug && param.slug.length > 0);
}

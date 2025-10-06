import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';

import { FormatDate } from '@/components/format/FormatDate';
import { pagesSource } from '@/lib/source';

export default async function Page(props: PageProps<'/legal/[[...slug]]'>) {
  const params = await props.params;
  const page = pagesSource.getPage(params.slug);

  if (!page) notFound();

  const MDXContent = page.data.body;

  return (
    <article className="container mx-auto px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">{page.data.title}</h1>
        <p className="mb-12 font-light text-lg text-muted">Last updated: <FormatDate date={page.data.date!}/></p>
        <div className="prose">
          <MDXContent components={{ ...defaultMdxComponents }}/>
        </div>
      </div>
    </article>
  );
}

export async function generateMetadata(props: PageProps<'/legal/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = pagesSource.getPage(params.slug);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

export function generateStaticParams() {
  return pagesSource.generateParams().filter((param) => param.slug && param.slug.length > 0);
}

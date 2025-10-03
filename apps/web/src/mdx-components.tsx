import type { MDXComponents } from 'mdx/types';

import { Step, Steps } from 'fumadocs-ui/components/steps';
import defaultMdxComponents from 'fumadocs-ui/mdx';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Step,
    Steps,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;

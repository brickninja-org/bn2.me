/// <reference types="@brickninja-org-ui/types" />
/// <reference types="react/canary" />
/// <reference types="react-dom/canary" />

// TODO: this should not be necessary, because this is already defined in the above reference of @brickninja-org/ui/types
declare module '*.svg?svgr' {
  import React from 'react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

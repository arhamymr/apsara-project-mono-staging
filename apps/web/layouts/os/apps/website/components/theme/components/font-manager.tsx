// SectionFont.tsx

import * as React from 'react';

export const FONT_FAMILIES: {
  [key: string]: { family: string; url?: string };
} = {
  // System stacks (no URL needed)
  sans: { family: 'ui-sans-serif, system-ui, sans-serif' },
  serif: { family: "ui-serif, Georgia, Cambria, 'Times New Roman', serif" },
  mono: { family: "ui-monospace, Menlo, Monaco, 'Courier New', monospace" },

  // Google fonts (woff2 direct)
  inter: {
    family: 'Inter',
    url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iL9cCyjzrQ.woff2',
  },
  roboto: {
    family: 'Roboto',
    url: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.woff2',
  },
  poppins: {
    family: 'Poppins',
    url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9.woff2',
  },
  lato: {
    family: 'Lato',
    url: 'https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjxAwXiWtFCc.woff2',
  },
  montserrat: {
    family: 'Montserrat',
    url: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm459Wlhzg.woff2',
  },
  'open-sans': {
    family: 'Open Sans',
    url: 'https://fonts.gstatic.com/s/opensans/v34/mem8YaGs126MiZpBA-UFUK0Udc1UAw.woff2',
  },
  raleway: {
    family: 'Raleway',
    url: 'https://fonts.gstatic.com/s/raleway/v28/1Ptug8zYS_SKggPN4iEgvnHy.woff2',
  },
  nunito: {
    family: 'Nunito',
    url: 'https://fonts.gstatic.com/s/nunito/v25/XRXV3I6Li01BKofIMPy.woff2',
  },
  merriweather: {
    family: 'Merriweather',
    url: 'https://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhSvowK_l5-fCZM.woff2',
  },
  playfair: {
    family: 'Playfair Display',
    url: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXDTzYh3Z5lw.woff2',
  },
  'fira-code': {
    family: 'Fira Code',
    url: 'https://fonts.gstatic.com/s/firacode/v21/uU9NCBsR6Z2vfE9aq3c.woff2',
  },
  'source-code': {
    family: 'Source Code Pro',
    url: 'https://fonts.gstatic.com/s/sourcecodepro/v22/HI_XiYsKILxRpg3hIP6s.woff2',
  },
  'work-sans': {
    family: 'Work Sans',
    url: 'https://fonts.gstatic.com/s/worksans/v18/QGYsz_wNahGAdqQ43Rh_cqDpp_k.woff2',
  },
  rubik: {
    family: 'Rubik',
    url: 'https://fonts.gstatic.com/s/rubik/v28/iJWKBXyIfDnIV5PNhY1KTN7Z-Yh-WYi1U.woff2',
  },
  manrope: {
    family: 'Manrope',
    url: 'https://fonts.gstatic.com/s/manrope/v14/xn7gYHE41ni1AdIRggexSg.woff2',
  },
  ubuntu: {
    family: 'Ubuntu',
    url: 'https://fonts.gstatic.com/s/ubuntu/v20/4iCv6KVjbNBYlgoKcw72nU6AFw.woff2',
  },
  josefin: {
    family: 'Josefin Sans',
    url: 'https://fonts.gstatic.com/s/josefinsans/v25/Qw3aZQNVED7rKGKxtqIqX5EUCVw.woff2',
  },
} as const;

type Key = keyof typeof FONT_FAMILIES;

function injectFontFace(id: string, family: string, url?: string) {
  if (!url) return;
  const tagId = `font-face-${id}`;
  if (document.getElementById(tagId)) return;

  const style = document.createElement('style');
  style.id = tagId;
  style.textContent = `
    @font-face {
      font-family: ${JSON.stringify(family)};
      src: url(${JSON.stringify(url)}) format('woff2');
      font-weight: 100 900;
      font-style: normal;
      font-display: swap;
    }
  `;
  document.head.append(style);

  const preload = document.createElement('link');
  preload.rel = 'preload';
  preload.as = 'font';
  preload.type = 'font/woff2';
  preload.href = url;
  preload.crossOrigin = 'anonymous';
  document.head.append(preload);
}

export function SectionFont({
  typo,
  className,
  children,
}: React.PropsWithChildren<{ typo: Key; className?: string }>) {
  React.useEffect(() => {
    const { family, url } = FONT_FAMILIES[typo] ?? {};
    injectFontFace(typo, family, url);
  }, [typo]);

  return (
    <div data-typo={typo} className={`typography-scope ${className ?? ''}`}>
      {children}
    </div>
  );
}

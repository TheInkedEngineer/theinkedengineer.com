# Dynamic Open Graph & Twitter Images (Next.js App Router)

Purpose: Document options and a concrete implementation plan to generate OG/Twitter share images on the fly (no pre-generation), aligned with this repo’s design system.

## TL;DR
- Use file conventions per route: `opengraph-image.tsx` and `twitter-image.tsx` implemented with `ImageResponse` at the Edge.
- Centralize a reusable OG template (`lib/og/template.tsx`) using brand tokens and typography from `@/lib/design-system` and `@/lib/utils`.
- Add a small font loader for Edge-safe custom fonts.
- Optionally add a single API route (`app/api/og/route.ts`) for param-driven images.
- Wire via `generateMetadata()` only where you need cross-route URLs; otherwise file conventions auto-wire.

## Options
- File conventions (recommended)
  - Place `opengraph-image.{ts,tsx}` and `twitter-image.{ts,tsx}` under any route (supports dynamic segments like `app/blog/[slug]/`).
  - Each file returns an `ImageResponse` built from JSX. Runs on Edge by default.
- Central API endpoint
  - `app/api/og/route.ts` that accepts query params (e.g., `?title=…&cover=…`) and returns an `ImageResponse`.
  - Point `generateMetadata().openGraph.images` / `twitter.images` to that endpoint per page.
- Hybrid
  - Share a template/util across both file-convention routes and the API route to avoid duplication.

## Core APIs
- `ImageResponse` (Next.js): JSX → image rendering at the Edge.
  - `import { ImageResponse } from 'next/server'`
  - Common exports: `export const size = { width: 1200, height: 630 }`, `export const contentType = 'image/png'`, `export const runtime = 'edge'`.
- `generateMetadata` (Next.js): compute `openGraph` and `twitter` metadata for dynamic pages.
  - For co-located files, you usually don’t need to set `images` manually; Next wires them automatically.

## Capabilities
- Dynamic text & branding: read post/page data (e.g., MDX frontmatter/CMS) and compose title, subtitle, tags, dates, etc.
- External images: use `<img src="https://…" />` or CSS `backgroundImage`.
- Custom fonts: fetch `.ttf/.otf` via `new URL(..., import.meta.url)` and pass to `ImageResponse` `fonts: [{ name, weight, data }]`.
- Per-route overrides: each page can own its image logic by placing the file convention within that route folder.

## Constraints & Notes
- Edge runtime: avoid Node-only APIs; import only isomorphic modules. Fetch font files via `new URL()` or host in `public/`.
- Dimensions: standardize at `1200×630` (1.91:1). Twitter can reuse OG.
- Caching: Vercel caches responses. For param-based endpoints, consider versioned query params (e.g., `?v=hash`) for cache-busting. Scrapers also cache aggressively.
- Safety: clamp/sanitize user-provided query params to prevent layout breaks. Provide sensible fallbacks.

## Design System Alignment (per AGENTS.md)
- Use tokens/utilities from `@/lib/design-system` and `@/lib/utils` (e.g., `typography`, `spacing`, `cn`).
- Constrain colors to brand tokens; avoid ad‑hoc hex values. Match typography weights (main titles `font-black` style), spacing rhythm, and card radii where relevant.
- Keep background/foreground combos accessible; respect reduced motion.

## Recommended Approach for This Repo
1. Global defaults
   - Add `app/opengraph-image.tsx` and `app/twitter-image.tsx` that use a shared template and brand tokens.
2. Dynamic routes
   - Add `opengraph-image.tsx`/`twitter-image.tsx` to key dynamic routes (e.g., `app/blog/[slug]/`, `app/work/[slug]/`) to render per-item images using the page’s content.
3. Shared template
   - Create `lib/og/template.tsx` to centralize layout, colors, spacing, and type styles. Accept props: `title`, `subtitle`, `tagline`, `coverUrl`, `badge`, etc.
4. Font loader
   - Create `lib/og/fonts.ts` to load brand fonts at Edge and return a `fonts` array for `ImageResponse`.
5. Optional central API route
   - Add `app/api/og/route.ts` that mirrors the template but takes `searchParams`. Useful for one-off or external consumers.

## Implementation Checklist
- [ ] `lib/og/fonts.ts`: Edge-safe font fetcher.
- [ ] `lib/og/template.tsx`: brand-aligned JSX scene.
- [ ] `app/opengraph-image.tsx`: default site image via template (uses site title/subtitle).
- [ ] `app/twitter-image.tsx`: reuse the same template/props; or minor variant.
- [ ] `app/blog/[slug]/opengraph-image.tsx`: derives from post data.
- [ ] `app/blog/[slug]/twitter-image.tsx`: same as above.
- [ ] (Optional) `app/api/og/route.ts`: param-driven image for cross-route reuse.
- [ ] Validate with Facebook Sharing Debugger and Twitter Card Validator.

## File Stubs (skeletons)

### `lib/og/fonts.ts`
```ts
// Edge-safe font loader
export async function loadOgFonts() {
  const interBlack = await fetch(
    new URL('../../public/fonts/Inter-Black.ttf', import.meta.url)
  ).then((r) => r.arrayBuffer());

  return [
    { name: 'Inter', data: interBlack, weight: 900 as const, style: 'normal' as const },
  ];
}
```

### `lib/og/template.tsx`
```tsx
// Reusable composition for OG images
import { typography, spacing, colors } from '@/lib/design-system';
import { cn } from '@/lib/utils';

export type OgTemplateProps = {
  title: string;
  subtitle?: string;
  coverUrl?: string;
  badge?: string;
};

export function OgTemplate({ title, subtitle, coverUrl, badge }: OgTemplateProps) {
  // Note: in OG rendering, Tailwind classes are not available.
  // Use inline styles and tokens from the design system.
  return (
    <div
      style={{
        display: 'flex',
        width: '1200px',
        height: '630px',
        backgroundColor: colors.brandYellow,
        color: colors.brandBlack,
        padding: spacing.section, // ensure this is a numeric px value or translate appropriately
        justifyContent: 'space-between',
        alignItems: 'stretch',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
        {badge ? (
          <div
            style={{
              display: 'inline-flex',
              padding: '8px 16px',
              borderRadius: 9999,
              backgroundColor: colors.brandBlack,
              color: colors.brandYellow,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {badge}
          </div>
        ) : null}
        <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.05 }}>{title}</div>
        {subtitle ? (
          <div style={{ fontSize: 32, fontWeight: 500, opacity: 0.7 }}>{subtitle}</div>
        ) : null}
      </div>
      {coverUrl ? (
        <img
          src={coverUrl}
          alt=""
          style={{ width: 420, height: '100%', objectFit: 'cover', borderRadius: 24 }}
        />
      ) : null}
    </div>
  );
}
```

### `app/opengraph-image.tsx`
```tsx
import { ImageResponse } from 'next/server';
import { OgTemplate } from '@/lib/og/template';
import { loadOgFonts } from '@/lib/og/fonts';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const fonts = await loadOgFonts();
  return new ImageResponse(
    <OgTemplate title="The Inked Engineer" subtitle="Portfolio & Notes" badge="Live" />,
    { ...size, fonts }
  );
}
```

### `app/twitter-image.tsx`
```tsx
export { runtime, size, contentType, default } from './opengraph-image';
```

### `app/blog/[slug]/opengraph-image.tsx`
```tsx
import { ImageResponse } from 'next/server';
import { OgTemplate } from '@/lib/og/template';
import { loadOgFonts } from '@/lib/og/fonts';
import { getPostBySlug } from '@/lib/content'; // adjust to your content layer

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  const fonts = await loadOgFonts();
  return new ImageResponse(
    <OgTemplate
      title={post.title}
      subtitle={post.excerpt}
      coverUrl={post.coverImage}
      badge={post.status === 'published' ? 'Live' : 'In Progress'}
    />,
    { ...size, fonts }
  );
}
```

### Optional: `app/api/og/route.ts`
```tsx
import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/server';
import { OgTemplate } from '@/lib/og/template';
import { loadOgFonts } from '@/lib/og/fonts';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') || '').slice(0, 120);
  const subtitle = (searchParams.get('subtitle') || '').slice(0, 160);
  const coverUrl = searchParams.get('cover') || undefined;
  const badge = searchParams.get('badge') || undefined;

  const fonts = await loadOgFonts();

  return new ImageResponse(
    <OgTemplate title={title || 'The Inked Engineer'} subtitle={subtitle} coverUrl={coverUrl} badge={badge} />,
    { width: 1200, height: 630, fonts }
  );
}
```

## Metadata Wiring
- Co-located files auto-wire. For API-route driven images, set in `generateMetadata()`:
```ts
export async function generateMetadata() {
  const url = new URL('/api/og', process.env.NEXT_PUBLIC_SITE_URL);
  url.searchParams.set('title', 'My dynamic title');
  return {
    openGraph: { images: [url.toString()] },
    twitter: { images: [url.toString()], card: 'summary_large_image' },
  };
}
```

## Testing & Validation
- Use Facebook Sharing Debugger and Twitter Card Validator to refresh caches.
- Manually hit co-located endpoints: `/opengraph-image`, `/twitter-image`, or `/blog/my-post/opengraph-image` to preview.

## Open Questions
- Which routes need per-item OG images first (e.g., blog, work, notes)?
- Final font family/weights to embed for brand consistency?
- Do we want an API endpoint for external consumers (e.g., newsletters)?

## References
- Next.js – Open Graph Image Generation: https://nextjs.org/docs/app/api-reference/file-conventions/opengraph-image
- Next.js – ImageResponse API: https://nextjs.org/docs/app/api-reference/functions/image-response
- Next.js – Metadata API Overview: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Vercel – Open Graph Image Generation: https://vercel.com/docs/functions/og-image-generation
- Vercel Guide – Dynamic Text OG Image: https://vercel.com/docs/functions/og-image-examples/dynamic-text
- Vercel Guide – External Images in OG Image: https://vercel.com/docs/functions/og-image-examples/external-image
- Vercel Blog – Introducing @vercel/og: https://vercel.com/blog/introducing-vercel-og-image-generation

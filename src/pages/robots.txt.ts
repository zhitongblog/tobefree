import type { APIRoute } from 'astro';
import { SITE } from '../consts';

export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', SITE.url).href}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

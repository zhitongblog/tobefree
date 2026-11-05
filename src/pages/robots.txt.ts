import type { APIRoute } from 'astro';
import { SITE } from '../consts';

export const GET: APIRoute = () => {
  const sitemapUrl = new URL('sitemap-index.xml', SITE.url).href;
  const llmsUrl = new URL('llms.txt', SITE.url).href;
  const llmsFullUrl = new URL('llms-full.txt', SITE.url).href;

  const body = `# To Be Free — Free, Ad-Free Software Directory
# LLM Context: ${llmsUrl}
# LLM Full Corpus: ${llmsFullUrl}

User-agent: *
Allow: /

# Explicitly welcome search & AI answer engines (GEO)
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: DuckAssistBot
Allow: /

Sitemap: ${sitemapUrl}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

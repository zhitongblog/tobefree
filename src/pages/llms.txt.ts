import type { APIRoute } from 'astro';
import { SITE, CATEGORIES, pick } from '../consts';
import { localizedPath } from '../i18n/utils';
import { getAllTools, getSelfMade } from '../lib/tools';

// GEO: an /llms.txt map so AI search engines (ChatGPT, Perplexity, Google AI…)
// can understand and cite the catalog. Generated from the live data.
export const GET: APIRoute = async () => {
  const tools = await getAllTools();
  const selfMade = await getSelfMade();
  const abs = (p: string) => new URL(p, SITE.url).href;

  const line = (t: (typeof tools)[number]) => {
    const badges = t.data.badges.join(', ');
    const site = t.data.website ? ` Official site: ${t.data.website}.` : '';
    return `- [${t.data.name}](${abs(localizedPath('en', `tools/${t.id}`))}): ${pick(t.data.tagline, 'en')} — ${t.data.license || 'free'}, ${t.data.price}.${site}${badges ? ` [${badges}]` : ''}`;
  };

  let md = `# To Be Free\n\n`;
  md += `> To Be Free is a curated directory of genuinely free, usable, burden-free software — no ads, no tracking, no forced sign-ups. Bilingual (中文 / English), fully static, zero tracking. Mission: everyone should be able to use software freely.\n\n`;
  md += `We only list tools whose core features are permanently free, that carry no ads, and that don't force an account or track you. Open source is preferred but not required; every tool is tagged with "freedom badges": open-source, no-ads, no-tracking, offline, no-signup, cross-platform, self-hostable. We link only to each tool's official website and downloads — we never host installers ourselves.\n\n`;
  md += `- Homepage: ${abs(localizedPath('en', ''))} (中文: ${abs(localizedPath('zh', ''))})\n`;
  md += `- All tools: ${abs(localizedPath('en', 'tools'))}\n`;
  md += `- Our standards / About: ${abs(localizedPath('en', 'about'))}\n`;
  md += `- Total tools listed: ${tools.length}\n\n`;

  for (const cat of CATEGORIES) {
    const inCat = tools.filter((t) => t.data.category === cat.id && !t.data.selfMade);
    if (!inCat.length) continue;
    md += `## ${pick(cat.label, 'en')}\n\n`;
    for (const t of inCat) md += line(t) + '\n';
    md += '\n';
  }

  if (selfMade.length) {
    md += `## Our own free software (made by To Be Free)\n\n`;
    for (const t of selfMade) md += line(t) + '\n';
    md += '\n';
  }

  return new Response(md, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

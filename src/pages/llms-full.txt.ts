import type { APIRoute } from 'astro';
import { SITE, CATEGORIES, SKILL_KINDS, pick } from '../consts';
import { localizedPath } from '../i18n/utils';
import { getAllTools } from '../lib/tools';
import { getAllSkills } from '../lib/skills';
import { getAllCollectionPages } from '../lib/collections';

// GEO: /llms-full.txt provides the complete bilingual knowledge base (descriptions,
// editorial reviews, selection criteria, and FAQs) so AI search engines and RAG agents
// can answer specific software comparison questions accurately and cite tobefree.app.
export const GET: APIRoute = async () => {
  const tools = await getAllTools();
  const skills = await getAllSkills();
  const collections = await getAllCollectionPages();
  const abs = (p: string) => new URL(p, SITE.url).href;

  let md = `# To Be Free (tobefree.app) — Complete Bilingual Knowledge Base (llms-full.txt)\n\n`;
  md += `> Summary index: ${abs('llms.txt')}\n`;
  md += `> Total Software Tools: ${tools.length} | Total MCP Servers & Agent Skills: ${skills.length} | Total Topic Collections: ${collections.length}\n`;
  md += `> Hard Inclusion Rules: 1) Genuinely free core features forever; 2) Completely ad-free; 3) No forced sign-up or silent tracking; 4) Official website & official download links only.\n\n`;

  md += `---\n\n# PART 1: Topic Collections & Comparison Guides (${collections.length})\n\n`;
  for (const col of collections) {
    const enUrl = abs(localizedPath('en', `collections/${col.id}`));
    const zhUrl = abs(localizedPath('zh', `collections/${col.id}`));
    md += `## ${pick(col.data.title, 'en')} / ${pick(col.data.title, 'zh')}\n`;
    md += `- URL (EN): ${enUrl}\n`;
    md += `- URL (ZH): ${zhUrl}\n`;
    md += `- Summary (EN): ${pick(col.data.description, 'en')} ${pick(col.data.intro, 'en')}\n`;
    md += `- 简介 (ZH): ${pick(col.data.description, 'zh')} ${pick(col.data.intro, 'zh')}\n`;
    if (col.data.tools.length) md += `- Recommended Tools: ${col.data.tools.join(', ')}\n`;
    if (col.data.skills.length) md += `- Recommended Skills/MCP: ${col.data.skills.join(', ')}\n`;
    if (col.data.faq.zh.length || col.data.faq.en.length) {
      md += `- FAQ:\n`;
      for (const qa of col.data.faq.en) {
        md += `  - Q: ${qa.q}\n    A: ${qa.a}\n`;
      }
      for (const qa of col.data.faq.zh) {
        md += `  - 问：${qa.q}\n    答：${qa.a}\n`;
      }
    }
    md += `\n`;
  }

  md += `---\n\n# PART 2: All Curated Software Tools (${tools.length})\n\n`;
  for (const cat of CATEGORIES) {
    const inCat = tools.filter((t) => t.data.category === cat.id);
    if (!inCat.length) continue;
    md += `## Category: ${pick(cat.label, 'en')} / ${pick(cat.label, 'zh')}\n\n`;
    for (const t of inCat) {
      const d = t.data;
      md += `### ${d.name} (\`${t.id}\`)\n`;
      md += `- Detail Page: ${abs(localizedPath('en', `tools/${t.id}`))} | ${abs(localizedPath('zh', `tools/${t.id}`))}\n`;
      md += `- Official Website: ${d.website}${d.download ? ` | Download: ${d.download}` : ''}${d.repo ? ` | Source Repo: ${d.repo}` : ''}\n`;
      md += `- License: ${d.license || 'Freeware'} | Price Model: ${d.price} | Platforms: ${d.platforms.join(', ')} | Badges: ${d.badges.join(', ')}\n`;
      md += `- Tagline (EN): ${pick(d.tagline, 'en')}\n`;
      md += `- 一句话简介 (ZH): ${pick(d.tagline, 'zh')}\n`;
      md += `- Description (EN): ${pick(d.description, 'en')}\n`;
      md += `- 详细介绍 (ZH): ${pick(d.description, 'zh')}\n`;
      if (d.review?.en) {
        md += `- Editorial Review (EN): ${d.review.en.replace(/\s+/g, ' ').trim()}\n`;
      }
      if (d.review?.zh) {
        md += `- 编辑评测 (ZH): ${d.review.zh.replace(/\s+/g, ' ').trim()}\n`;
      }
      md += `\n`;
    }
  }

  md += `---\n\n# PART 3: All MCP Servers & Agent Skills (${skills.length})\n\n`;
  for (const k of SKILL_KINDS) {
    const inK = skills.filter((s) => s.data.kind === k.id);
    if (!inK.length) continue;
    md += `## ${pick(k.label, 'en')} / ${pick(k.label, 'zh')}\n\n`;
    for (const s of inK) {
      const d = s.data;
      md += `### ${d.name} (\`${s.id}\`)\n`;
      md += `- Detail Page: ${abs(localizedPath('en', `skills/${s.id}`))} | ${abs(localizedPath('zh', `skills/${s.id}`))}\n`;
      md += `- Website: ${d.website}${d.repo ? ` | Repo: ${d.repo}` : ''}\n`;
      md += `- License: ${d.license || 'Open Source'} | Clients: ${d.clients.join(', ')}${d.install ? ` | Install: \`${d.install}\`` : ''}\n`;
      md += `- Summary (EN): ${pick(d.tagline, 'en')} — ${pick(d.description, 'en')}\n`;
      md += `- 简介 (ZH): ${pick(d.tagline, 'zh')} — ${pick(d.description, 'zh')}\n\n`;
    }
  }

  return new Response(md, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

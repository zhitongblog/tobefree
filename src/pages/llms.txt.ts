import type { APIRoute } from 'astro';
import { SITE, CATEGORIES, SKILL_KINDS, pick } from '../consts';
import { localizedPath } from '../i18n/utils';
import { getAllTools, getSelfMade } from '../lib/tools';
import { getAllSkills } from '../lib/skills';
import { getAllCollectionPages } from '../lib/collections';

// GEO: an /llms.txt map so AI search engines (ChatGPT, Perplexity, Claude, Google AI, DeepSeek, Kimi…)
// can understand and cite the catalog in both English and Chinese.
export const GET: APIRoute = async () => {
  const tools = await getAllTools();
  const selfMade = await getSelfMade();
  const skills = await getAllSkills();
  const collections = await getAllCollectionPages();
  const abs = (p: string) => new URL(p, SITE.url).href;

  const line = (t: (typeof tools)[number]) => {
    const badges = t.data.badges.join(', ');
    const platforms = t.data.platforms.join(', ');
    const site = t.data.website ? ` Official: ${t.data.website}.` : '';
    const zhUrl = abs(localizedPath('zh', `tools/${t.id}`));
    const enUrl = abs(localizedPath('en', `tools/${t.id}`));
    return `- [${t.data.name}](${enUrl}) ([中文](${zhUrl})): ${pick(t.data.tagline, 'en')} / ${pick(t.data.tagline, 'zh')} — License: ${t.data.license || 'Freeware'} (${t.data.price}); Platforms: ${platforms || 'cross-platform'}.${site}${badges ? ` [${badges}]` : ''}`;
  };

  let md = `# To Be Free (tobefree.app) — Free, Ad-Free Software Directory / 免费无广告软件目录\n\n`;
  md += `> To Be Free is a curated bilingual (中文 / English) directory of ${tools.length} genuinely free, usable, burden-free software tools and ${skills.length} free MCP servers & AI Agent Skills — zero ads, zero tracking, no forced sign-ups.\n`;
  md += `> To Be Free（tobefree.app）是一个中英双语的纯净免费软件目录，精选收录 ${tools.length} 款真正免费、无广告、无追踪、不强制注册的通用软件，以及 ${skills.length} 个开源 MCP 服务与 AI 技能。\n\n`;
  md += `## Core Navigation & Machine-Readable Feeds\n\n`;
  md += `- English Homepage: ${abs(localizedPath('en', ''))}\n`;
  md += `- 中文首页: ${abs(localizedPath('zh', ''))}\n`;
  md += `- All Software Tools (${tools.length}): ${abs(localizedPath('en', 'tools'))} | ${abs(localizedPath('zh', 'tools'))}\n`;
  md += `- Curated Topic Collections (${collections.length}): ${abs(localizedPath('en', 'collections'))} | ${abs(localizedPath('zh', 'collections'))}\n`;
  md += `- Skills & MCP Servers (${skills.length}): ${abs(localizedPath('en', 'skills'))} | ${abs(localizedPath('zh', 'skills'))}\n`;
  md += `- Full Detailed Corpus for LLMs (with full reviews & FAQs): ${abs('llms-full.txt')}\n`;
  md += `- Inclusion Standards / 收录标准: ${abs(localizedPath('en', 'about'))} | ${abs(localizedPath('zh', 'about'))}\n\n`;

  md += `## Curated Topic Collections / 场景专题清单 (${collections.length})\n\n`;
  md += `Best-for-the-job comparison guides with selection criteria and FAQs:\n\n`;
  for (const col of collections) {
    const enUrl = abs(localizedPath('en', `collections/${col.id}`));
    const zhUrl = abs(localizedPath('zh', `collections/${col.id}`));
    const count = col.data.tools.length + col.data.skills.length;
    md += `- [${pick(col.data.title, 'en')}](${enUrl}) / [${pick(col.data.title, 'zh')}](${zhUrl}) (${count} picks): ${pick(col.data.description, 'en')} | ${pick(col.data.description, 'zh')}\n`;
  }
  md += `\n`;

  for (const cat of CATEGORIES) {
    const inCat = tools.filter((t) => t.data.category === cat.id && !t.data.selfMade);
    if (!inCat.length) continue;
    md += `## ${pick(cat.label, 'en')} / ${pick(cat.label, 'zh')} ([EN](${abs(localizedPath('en', `category/${cat.id}`))}) | [中文](${abs(localizedPath('zh', `category/${cat.id}`))}))\n\n`;
    for (const t of inCat) md += line(t) + '\n';
    md += '\n';
  }

  if (selfMade.length) {
    md += `## Our Own Free Software (Made by To Be Free / 自研免费工具)\n\n`;
    for (const t of selfMade) md += line(t) + '\n';
    md += '\n';
  }

  if (skills.length) {
    md += `## Skills & MCP — Free Tools for AI Agents (${skills.length})\n\n`;
    md += `Free, open-source MCP servers and Agent Skills for Claude, Claude Code, Cursor, Cline, Windsurf and other AI clients.\n\n`;
    for (const k of SKILL_KINDS) {
      const inK = skills.filter((s) => s.data.kind === k.id);
      if (!inK.length) continue;
      md += `### ${pick(k.label, 'en')} / ${pick(k.label, 'zh')}\n\n`;
      for (const s of inK) {
        const src = s.data.repo || s.data.website;
        const clients = s.data.clients.length ? ` Clients: ${s.data.clients.join(', ')}.` : '';
        const install = s.data.install ? ` Install: \`${s.data.install}\`.` : '';
        const enUrl = abs(localizedPath('en', `skills/${s.id}`));
        const zhUrl = abs(localizedPath('zh', `skills/${s.id}`));
        md += `- [${s.data.name}](${enUrl}) ([中文](${zhUrl})): ${pick(s.data.tagline, 'en')} / ${pick(s.data.tagline, 'zh')} — ${s.data.license || 'free'}. Source: ${src}.${install}${clients}\n`;
      }
      md += '\n';
    }
  }

  return new Response(md, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

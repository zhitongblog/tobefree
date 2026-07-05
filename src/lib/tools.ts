import { getCollection, type CollectionEntry } from 'astro:content';
import { locales } from '../i18n/utils';

export type Tool = CollectionEntry<'tools'>;

/** All tools, newest first. */
export async function getAllTools(): Promise<Tool[]> {
  const tools = await getCollection('tools');
  return tools.sort((a, b) =>
    a.data.added === b.data.added
      ? a.data.name.localeCompare(b.data.name)
      : a.data.added < b.data.added
        ? 1
        : -1,
  );
}

export async function getFeatured(): Promise<Tool[]> {
  return (await getAllTools()).filter((t) => t.data.featured && !t.data.selfMade);
}

/** Household-name tools shown in the home "popular" spotlight band. */
export async function getPopular(): Promise<Tool[]> {
  return (await getAllTools()).filter((t) => t.data.popular && !t.data.selfMade);
}

/** Third-party tools (everything except our own), newest first. */
export async function getThirdParty(): Promise<Tool[]> {
  return (await getAllTools()).filter((t) => !t.data.selfMade);
}

export async function getSelfMade(): Promise<Tool[]> {
  return (await getAllTools()).filter((t) => t.data.selfMade);
}

export function inCategory(tools: Tool[], category: string): Tool[] {
  return tools.filter((t) => t.data.category === category);
}

/** Same-category tools excluding the given one. */
export function related(tools: Tool[], tool: Tool, limit = 3): Tool[] {
  return tools
    .filter((t) => t.id !== tool.id && t.data.category === tool.data.category)
    .slice(0, limit);
}

/** getStaticPaths helper that emits one route per locale. */
export function localePaths() {
  return locales.map((lang) => ({ params: { lang }, props: { lang } }));
}

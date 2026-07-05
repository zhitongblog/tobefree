import { getCollection, type CollectionEntry } from 'astro:content';
import { locales } from '../i18n/utils';

export type Skill = CollectionEntry<'skills'>;

/** All skills/MCP entries — popular & featured first, then newest, then name. */
export async function getAllSkills(): Promise<Skill[]> {
  const items = await getCollection('skills');
  const rank = (s: Skill) => (s.data.popular ? 0 : s.data.featured ? 1 : 2);
  return items.sort((a, b) => {
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra - rb;
    if (a.data.added !== b.data.added) return a.data.added < b.data.added ? 1 : -1;
    return a.data.name.localeCompare(b.data.name);
  });
}

export async function getFeaturedSkills(): Promise<Skill[]> {
  return (await getAllSkills()).filter((s) => s.data.featured && !s.data.selfMade);
}

export async function getSelfMadeSkills(): Promise<Skill[]> {
  return (await getAllSkills()).filter((s) => s.data.selfMade);
}

export function byKind(items: Skill[], kind: string): Skill[] {
  return items.filter((s) => s.data.kind === kind);
}

export function relatedSkills(items: Skill[], item: Skill, limit = 3): Skill[] {
  return items
    .filter((s) => s.id !== item.id && s.data.kind === item.data.kind)
    .slice(0, limit);
}

export function skillLocalePaths() {
  return locales.map((lang) => ({ params: { lang }, props: { lang } }));
}

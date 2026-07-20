import { getCollection, type CollectionEntry } from 'astro:content';
import { locales } from '../i18n/utils';

export type CollectionPage = CollectionEntry<'collectionPages'>;

export async function getAllCollectionPages(): Promise<CollectionPage[]> {
  const pages = await getCollection('collectionPages');
  return pages.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    if (a.data.added !== b.data.added) return a.data.added < b.data.added ? 1 : -1;
    return a.data.title.en.localeCompare(b.data.title.en);
  });
}

export function collectionLocalePaths() {
  return locales.map((lang) => ({ params: { lang }, props: { lang } }));
}

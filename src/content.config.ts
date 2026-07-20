import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_IDS, BADGE_IDS, PLATFORM_IDS, PRICE_MODELS } from './consts';

const localized = z.object({
  zh: z.string(),
  en: z.string(),
});

const localizedList = z.object({
  zh: z.array(z.string()),
  en: z.array(z.string()),
});

const localizedFaq = z.object({
  zh: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  en: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
});

/** Optional URL that also accepts an empty string (treated as "not set"). */
const optionalUrl = z.preprocess(
  (v) => (v === '' || v == null ? undefined : v),
  z.string().url().optional(),
);

const tools = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/data/tools' }),
  schema: z.object({
    /** Display name (usually the same in both languages). */
    name: z.string(),
    /** One-line hook shown on cards. */
    tagline: localized,
    /** 1-2 sentence summary. */
    description: localized,
    /** Longer editorial "why we picked it" — supports Markdown. Optional. */
    review: localized.optional(),
    category: z.enum(CATEGORY_IDS),
    tags: z.array(z.string()).default([]),
    platforms: z.array(z.enum(PLATFORM_IDS)).default([]),
    /** Freedom badges: open-source / no-ads / no-tracking / offline ... */
    badges: z.array(z.enum(BADGE_IDS)).default([]),
    /** License string, e.g. "GPL-3.0", "MIT", "Freeware". */
    license: z.string().default(''),
    price: z.enum(PRICE_MODELS).default('free'),
    website: z.string().url(),
    /** Official downloads page (never a self-hosted installer). Optional. */
    download: optionalUrl,
    repo: optionalUrl,
    /** Highlight in the home "editor's picks" list. */
    featured: z.boolean().default(false),
    /** Show in the home "popular free software" spotlight band. */
    popular: z.boolean().default(false),
    /** Made by us — shown in the "自研" section. */
    selfMade: z.boolean().default(false),
    /** Brand accent color (hex) for the card avatar. */
    accent: z.string().default('#DB6A3F'),
    /** Fallback avatar initials, e.g. "OB". Defaults to first letters of name. */
    initials: z.string().optional(),
    /** ISO date added, e.g. "2026-07-05". */
    added: z.string(),
  }),
});

const skills = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/data/skills' }),
  schema: z.object({
    /** MCP server or Agent Skill. */
    kind: z.enum(['mcp', 'skill']),
    name: z.string(),
    tagline: localized,
    description: localized,
    review: localized.optional(),
    tags: z.array(z.string()).default([]),
    /** Compatible clients, e.g. Claude, Cursor, Cline, "Any MCP client". */
    clients: z.array(z.string()).default([]),
    /** Freedom badges (shared with tools). */
    badges: z.array(z.enum(BADGE_IDS)).default([]),
    license: z.string().default(''),
    website: z.string().url(),
    repo: optionalUrl,
    /** Short install/add snippet, e.g. `npx -y @modelcontextprotocol/server-git`. */
    install: z.string().default(''),
    featured: z.boolean().default(false),
    popular: z.boolean().default(false),
    /** Made by us — shown in the "自研" section. */
    selfMade: z.boolean().default(false),
    accent: z.string().default('#2E9E6B'),
    initials: z.string().optional(),
    added: z.string(),
  }),
});

const collectionPages = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/data/collections' }),
  schema: z.object({
    title: localized,
    description: localized,
    intro: localized,
    criteria: localizedList.default({ zh: [], en: [] }),
    tools: z.array(z.string()).default([]),
    skills: z.array(z.string()).default([]),
    faq: localizedFaq.default({ zh: [], en: [] }),
    featured: z.boolean().default(false),
    added: z.string(),
  }),
});

export const collections = { tools, skills, collectionPages };

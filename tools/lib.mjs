// Shared helpers for the local tooling (CLI / admin / MCP).
// The vocabulary below is read straight out of src/consts.ts at startup, so
// adding a category / badge / platform is a one-file change.

import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, '..');
export const TOOLS_DIR = join(ROOT, 'src', 'data', 'tools');

const CONSTS_SRC = readFileSync(join(ROOT, 'src', 'consts.ts'), 'utf8');

/**
 * Pull an `export const NAME = [...] as const;` array of `{ id, label }` entries
 * out of consts.ts. We only parse the shape we control, so a plain regex sweep
 * is enough — and it keeps this file from drifting out of sync again.
 */
function readVocab(name) {
  const block = CONSTS_SRC.match(new RegExp(`export const ${name} = \\[([\\s\\S]*?)\\n\\] as const;`));
  if (!block) throw new Error(`consts.ts: could not find "export const ${name}"`);
  const entries = [...block[1].matchAll(
    /\{\s*id:\s*'([^']+)'[^}]*?label:\s*\{\s*zh:\s*'([^']*)',\s*en:\s*'([^']*)'\s*\}/g,
  )].map((m) => ({ id: m[1], label: { zh: m[2], en: m[3] } }));
  if (!entries.length) throw new Error(`consts.ts: "${name}" parsed to an empty list`);
  return entries;
}

export const CATEGORIES = readVocab('CATEGORIES');
export const BADGES = readVocab('BADGES');
export const PLATFORMS = readVocab('PLATFORMS').map((p) => ({ id: p.id, label: p.label.en }));

export const PRICE_MODELS = (() => {
  const m = CONSTS_SRC.match(/export const PRICE_MODELS = \[([^\]]+)\] as const;/);
  if (!m) throw new Error('consts.ts: could not find "export const PRICE_MODELS"');
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
})();

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);
export const BADGE_IDS = BADGES.map((b) => b.id);
export const PLATFORM_IDS = PLATFORMS.map((p) => p.id);

/** Turn a tool name into a filesystem-safe slug. */
export function slugify(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'tool';
}

export function todayISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function listTools() {
  if (!existsSync(TOOLS_DIR)) return [];
  return readdirSync(TOOLS_DIR)
    .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
    .map((f) => {
      const slug = f.replace(/\.ya?ml$/, '');
      const data = yaml.load(readFileSync(join(TOOLS_DIR, f), 'utf8'));
      return { slug, file: f, data };
    });
}

/** Validate a tool object. Returns an array of error strings (empty = ok). */
export function validate(t) {
  const errs = [];
  const req = (cond, msg) => { if (!cond) errs.push(msg); };
  req(t.name, 'name is required');
  req(t.tagline?.zh && t.tagline?.en, 'tagline.zh and tagline.en are required');
  req(t.description?.zh && t.description?.en, 'description.zh and description.en are required');
  req(CATEGORY_IDS.includes(t.category), `category must be one of: ${CATEGORY_IDS.join(', ')}`);
  req(PRICE_MODELS.includes(t.price), `price must be one of: ${PRICE_MODELS.join(', ')}`);
  req(/^https?:\/\//.test(t.website || ''), 'website must be a valid URL');
  for (const b of t.badges || []) req(BADGE_IDS.includes(b), `unknown badge: ${b}`);
  for (const p of t.platforms || []) req(PLATFORM_IDS.includes(p), `unknown platform: ${p}`);
  return errs;
}

/** Build a normalized, ordered tool object from loose input. */
export function normalize(input) {
  const name = String(input.name || '').trim();
  const t = {
    name,
    accent: input.accent || '#DB6A3F',
    ...(input.initials ? { initials: input.initials } : {}),
    category: input.category,
    price: input.price || 'free',
    license: input.license || '',
    website: input.website || '',
    ...(input.download ? { download: input.download } : {}),
    ...(input.repo ? { repo: input.repo } : {}),
    featured: Boolean(input.featured),
    popular: Boolean(input.popular),
    selfMade: Boolean(input.selfMade),
    added: input.added || todayISO(),
    tags: input.tags || [],
    platforms: input.platforms || [],
    badges: input.badges || [],
    tagline: { zh: input.tagline?.zh || '', en: input.tagline?.en || '' },
    description: { zh: input.description?.zh || '', en: input.description?.en || '' },
  };
  if (input.review?.zh || input.review?.en) {
    t.review = { zh: input.review?.zh || '', en: input.review?.en || '' };
  }
  return t;
}

/** Write a tool to disk. Returns { slug, file }. */
export function writeTool(input, { overwrite = false } = {}) {
  const t = normalize(input);
  const errs = validate(t);
  if (errs.length) throw new Error('Validation failed:\n - ' + errs.join('\n - '));
  const slug = input.slug ? slugify(input.slug) : slugify(t.name);
  const file = join(TOOLS_DIR, `${slug}.yaml`);
  if (existsSync(file) && !overwrite) {
    throw new Error(`"${slug}.yaml" already exists. Pass overwrite to replace it.`);
  }
  if (!existsSync(TOOLS_DIR)) mkdirSync(TOOLS_DIR, { recursive: true });
  const body = yaml.dump(t, { lineWidth: -1, noRefs: true, forceQuotes: false });
  writeFileSync(file, body, 'utf8');
  return { slug, file };
}

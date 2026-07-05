// Shared helpers for the local tooling (CLI / admin / MCP).
// Vocabulary mirrors src/consts.ts — keep the two in sync when you add options.

import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, '..');
export const TOOLS_DIR = join(ROOT, 'src', 'data', 'tools');

export const CATEGORIES = [
  { id: 'productivity', label: { zh: '效率 · 笔记', en: 'Productivity' } },
  { id: 'creative', label: { zh: '创意 · 设计', en: 'Creative' } },
  { id: 'media', label: { zh: '音频 · 视频', en: 'Audio & Video' } },
  { id: 'dev', label: { zh: '开发 · 编程', en: 'Developer' } },
  { id: 'utility', label: { zh: '系统 · 实用', en: 'Utilities' } },
  { id: 'privacy', label: { zh: '隐私 · 安全', en: 'Privacy' } },
  { id: 'office', label: { zh: '办公 · 文档', en: 'Office' } },
];

export const BADGES = [
  { id: 'open-source', label: { zh: '开源', en: 'Open Source' } },
  { id: 'no-ads', label: { zh: '无广告', en: 'No Ads' } },
  { id: 'no-tracking', label: { zh: '无追踪', en: 'No Tracking' } },
  { id: 'offline', label: { zh: '离线可用', en: 'Offline' } },
  { id: 'no-signup', label: { zh: '无需注册', en: 'No Sign-up' } },
  { id: 'cross-platform', label: { zh: '跨平台', en: 'Cross-platform' } },
  { id: 'self-hostable', label: { zh: '可自建', en: 'Self-hostable' } },
];

export const PLATFORMS = [
  { id: 'windows', label: 'Windows' },
  { id: 'macos', label: 'macOS' },
  { id: 'linux', label: 'Linux' },
  { id: 'web', label: 'Web' },
  { id: 'ios', label: 'iOS' },
  { id: 'android', label: 'Android' },
  { id: 'cli', label: 'CLI' },
];

export const PRICE_MODELS = ['free', 'freemium'];

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

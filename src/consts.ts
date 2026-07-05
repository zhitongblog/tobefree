/**
 * Single source of truth for site-wide constants.
 * Shared by pages, i18n, the local admin, the CLI and the MCP server.
 */

export const SITE = {
  /** Production URL — keep in sync with SITE_URL in astro.config.mjs */
  url: 'https://tobefree.app',
  name: 'To Be Free',
  defaultLocale: 'zh' as const,
  locales: ['zh', 'en'] as const,
  /** GitHub repo used by the "submit a tool" flow; edit to your repo. */
  repo: 'https://github.com/zhitongblog/tobefree',
};

export type Locale = (typeof SITE.locales)[number];

export interface LocalizedText {
  zh: string;
  en: string;
}

/** Tool categories. `id` is used in URLs and data files. */
export const CATEGORIES = [
  { id: 'productivity', icon: '✍️', label: { zh: '效率 · 笔记', en: 'Productivity' } },
  { id: 'creative', icon: '🎨', label: { zh: '创意 · 设计', en: 'Creative' } },
  { id: 'media', icon: '🎬', label: { zh: '音频 · 视频', en: 'Audio & Video' } },
  { id: 'dev', icon: '⌨️', label: { zh: '开发 · 编程', en: 'Developer' } },
  { id: 'utility', icon: '🧰', label: { zh: '系统 · 实用', en: 'Utilities' } },
  { id: 'privacy', icon: '🛡️', label: { zh: '隐私 · 安全', en: 'Privacy' } },
  { id: 'office', icon: '📄', label: { zh: '办公 · 文档', en: 'Office' } },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];
export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [CategoryId, ...CategoryId[]];

/** The "freedom" badges — what makes a tool truly free & burden-free. */
export const BADGES = [
  { id: 'open-source', icon: '🔓', label: { zh: '开源', en: 'Open Source' } },
  { id: 'no-ads', icon: '🚫', label: { zh: '无广告', en: 'No Ads' } },
  { id: 'no-tracking', icon: '🕶️', label: { zh: '无追踪', en: 'No Tracking' } },
  { id: 'offline', icon: '📴', label: { zh: '离线可用', en: 'Offline' } },
  { id: 'no-signup', icon: '🎫', label: { zh: '无需注册', en: 'No Sign-up' } },
  { id: 'cross-platform', icon: '💠', label: { zh: '跨平台', en: 'Cross-platform' } },
  { id: 'self-hostable', icon: '🏠', label: { zh: '可自建', en: 'Self-hostable' } },
] as const;

export type BadgeId = (typeof BADGES)[number]['id'];
export const BADGE_IDS = BADGES.map((b) => b.id) as [BadgeId, ...BadgeId[]];

/** Supported platforms. */
export const PLATFORMS = [
  { id: 'windows', icon: '🪟', label: { zh: 'Windows', en: 'Windows' } },
  { id: 'macos', icon: '🍎', label: { zh: 'macOS', en: 'macOS' } },
  { id: 'linux', icon: '🐧', label: { zh: 'Linux', en: 'Linux' } },
  { id: 'web', icon: '🌐', label: { zh: '网页', en: 'Web' } },
  { id: 'ios', icon: '📱', label: { zh: 'iOS', en: 'iOS' } },
  { id: 'android', icon: '🤖', label: { zh: 'Android', en: 'Android' } },
  { id: 'cli', icon: '⌨️', label: { zh: '命令行', en: 'CLI' } },
] as const;

export type PlatformId = (typeof PLATFORMS)[number]['id'];
export const PLATFORM_IDS = PLATFORMS.map((p) => p.id) as [PlatformId, ...PlatformId[]];

/** Pricing model — we only accept genuinely free tools. */
export const PRICE_MODELS = ['free', 'freemium'] as const;
export type PriceModel = (typeof PRICE_MODELS)[number];

/** Kinds in the Skills & MCP module. */
export const SKILL_KINDS = [
  { id: 'mcp', icon: '🔌', label: { zh: 'MCP 服务', en: 'MCP Server' } },
  { id: 'skill', icon: '✨', label: { zh: '技能', en: 'Skill' } },
] as const;
export type SkillKind = (typeof SKILL_KINDS)[number]['id'];
export const skillKindById = Object.fromEntries(SKILL_KINDS.map((k) => [k.id, k]));

// Lookup helpers -------------------------------------------------------------

export const categoryById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
export const badgeById = Object.fromEntries(BADGES.map((b) => [b.id, b]));
export const platformById = Object.fromEntries(PLATFORMS.map((p) => [p.id, p]));

export function pick<T extends { zh: string; en: string }>(text: T, locale: Locale): string {
  return text[locale] ?? text.zh;
}

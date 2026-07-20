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
  /**
   * Cloudflare Web Analytics beacon token (privacy-friendly, cookieless).
   * Get it at: Cloudflare dashboard → Analytics & Logs → Web Analytics →
   * Add a site → copy the token. Set PUBLIC_CF_WEB_ANALYTICS_TOKEN at build time.
   */
  analytics: import.meta.env.PUBLIC_CF_WEB_ANALYTICS_TOKEN ?? '',
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

export const CATEGORY_SEO: Record<CategoryId, {
  title: LocalizedText;
  description: LocalizedText;
  intro: LocalizedText;
}> = {
  productivity: {
    title: {
      zh: '免费效率与笔记软件推荐',
      en: 'Free Productivity and Note-Taking Software',
    },
    description: {
      zh: '精选免费、无广告、少打扰的效率与笔记软件，适合写作、知识管理、待办、资料整理和日常办公。',
      en: 'A curated list of free, ad-free productivity and note-taking apps for writing, knowledge management, tasks and everyday work.',
    },
    intro: {
      zh: '这里收录适合长期使用的免费效率工具和笔记软件，重点看核心功能是否免费、是否少广告少追踪、是否方便迁移数据。适合想找 Notion、Evernote、传统待办和本地笔记替代方案的人。',
      en: 'These free productivity and note-taking tools are selected for durable everyday use: free core features, minimal ads or tracking, and practical data ownership. Start here when comparing alternatives to Notion, Evernote, classic task apps and local note systems.',
    },
  },
  creative: {
    title: {
      zh: '免费开源设计与创作软件推荐',
      en: 'Free Creative and Design Software',
    },
    description: {
      zh: '精选免费设计、绘画、修图、排版和创作工具，优先收录开源、无广告、可替代付费套件的软件。',
      en: 'Free design, drawing, photo editing, publishing and creative tools, with open-source and ad-free alternatives prioritized.',
    },
    intro: {
      zh: '从图片编辑、矢量设计到 3D 建模和排版，这里优先收录真正能完成作品的免费创作软件。适合寻找 Photoshop、Illustrator、InDesign、Figma 或商业创意套件替代品的用户。',
      en: 'From photo editing and vector design to 3D modeling and publishing, this category focuses on free creative software that can ship real work. It is useful when looking for alternatives to Photoshop, Illustrator, InDesign, Figma or commercial creative suites.',
    },
  },
  media: {
    title: {
      zh: '免费视频剪辑与音频工具推荐',
      en: 'Free Video, Audio and Media Tools',
    },
    description: {
      zh: '免费音频、视频、播放器、转码和剪辑工具合集，适合找无水印、无广告、跨平台媒体软件。',
      en: 'Free audio, video, player, transcoding and editing tools for users who want watermark-free, ad-free and cross-platform media software.',
    },
    intro: {
      zh: '这类工具最容易踩到水印、广告、捆绑安装和导出限制。这里优先列出核心能力免费、导出不恶心、适合日常剪辑、录制、播放、转码和媒体管理的软件。',
      en: 'Media tools often hide watermarks, ads, bundled installers or export limits. This list highlights software with genuinely useful free core features for editing, recording, playback, transcoding and media management.',
    },
  },
  dev: {
    title: {
      zh: '免费开发工具与编程软件推荐',
      en: 'Free Developer Tools and Programming Software',
    },
    description: {
      zh: '精选免费开发工具、代码编辑器、数据库客户端、API 调试、终端和编程效率软件。',
      en: 'Free developer tools for coding, terminals, database work, API debugging and programming workflows.',
    },
    intro: {
      zh: '开发工具要看可靠性、生态、跨平台和数据可控。这里收录免费的代码编辑器、终端、数据库客户端、API 调试工具和程序员日常会反复打开的软件。',
      en: 'Developer tools need reliability, ecosystem depth, cross-platform support and control over local data. This list covers free editors, terminals, database clients, API tools and everyday programming utilities.',
    },
  },
  utility: {
    title: {
      zh: '免费系统工具与实用软件推荐',
      en: 'Free System Utilities and Everyday Tools',
    },
    description: {
      zh: '免费系统增强、压缩解压、启动盘、搜索、截图和日常实用软件，优先无广告、无捆绑。',
      en: 'Free system utilities for compression, boot drives, search, screenshots and everyday maintenance, prioritizing ad-free and unbundled tools.',
    },
    intro: {
      zh: '系统工具不需要花哨，关键是稳定、安全、少打扰。这里收录压缩解压、文件搜索、截图、启动盘制作、系统增强等常用免费软件，尽量避开广告和捆绑安装。',
      en: 'Good utilities should be stable, safe and quiet. This category collects free tools for compression, file search, screenshots, boot media, system enhancement and everyday maintenance without noisy ads or bundles.',
    },
  },
  privacy: {
    title: {
      zh: '免费隐私安全软件推荐',
      en: 'Free Privacy and Security Software',
    },
    description: {
      zh: '精选免费密码管理、加密、隐私浏览、安全通信和去追踪工具，适合重视数据安全的用户。',
      en: 'Free password managers, encryption tools, private browsers, secure messaging apps and anti-tracking software.',
    },
    intro: {
      zh: '隐私安全工具最重要的是可信来源、透明机制和长期维护。这里收录密码管理、文件加密、隐私浏览、安全通信、广告与追踪拦截等免费工具。',
      en: 'Privacy and security tools need trustworthy sources, transparent behavior and long-term maintenance. This list covers free password managers, encryption apps, private browsers, secure messaging and tracking blockers.',
    },
  },
  office: {
    title: {
      zh: '免费办公与文档软件推荐',
      en: 'Free Office and Document Software',
    },
    description: {
      zh: '免费 Office、PDF、电子书、文献管理、文档编辑和阅读工具合集，适合学生、职场和个人使用。',
      en: 'Free office, PDF, ebook, reference management, document editing and reading tools for students, work and personal use.',
    },
    intro: {
      zh: '办公文档软件常见痛点是格式兼容、导出限制、广告和订阅。这里收录免费的 Office、PDF、电子书、文献管理和文档阅读工具，适合学习、工作和个人资料整理。',
      en: 'Office and document software often comes with compatibility pain, export limits, ads or subscriptions. This category collects free tools for office documents, PDFs, ebooks, references and reading workflows.',
    },
  },
};

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

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
  { id: 'ai', icon: '🤖', label: { zh: 'AI · 大模型', en: 'AI & LLM' } },
  { id: 'productivity', icon: '✍️', label: { zh: '效率 · 笔记', en: 'Productivity' } },
  { id: 'creative', icon: '🎨', label: { zh: '创意 · 设计', en: 'Creative' } },
  { id: 'media', icon: '🎬', label: { zh: '音频 · 视频', en: 'Audio & Video' } },
  { id: 'dev', icon: '⌨️', label: { zh: '开发 · 编程', en: 'Developer' } },
  { id: 'utility', icon: '🧰', label: { zh: '系统 · 实用', en: 'Utilities' } },
  { id: 'privacy', icon: '🛡️', label: { zh: '隐私 · 安全', en: 'Privacy' } },
  { id: 'office', icon: '📄', label: { zh: '办公 · 文档', en: 'Office' } },
  { id: 'browser', icon: '🌐', label: { zh: '浏览器 · 上网', en: 'Browsers' } },
  { id: 'network', icon: '📡', label: { zh: '下载 · 网络', en: 'Downloads & Network' } },
  { id: 'chat', icon: '💬', label: { zh: '通讯 · 会议', en: 'Chat & Meetings' } },
  { id: 'remote', icon: '🖥️', label: { zh: '远程 · 传输', en: 'Remote & Transfer' } },
  { id: 'selfhosted', icon: '🏠', label: { zh: '自建 · 服务器', en: 'Self-hosted' } },
  { id: 'learning', icon: '📚', label: { zh: '学习 · 科研', en: 'Learning & Science' } },
  { id: 'cad', icon: '📐', label: { zh: '工程 · CAD', en: 'Engineering & CAD' } },
  { id: 'finance', icon: '💰', label: { zh: '财务 · 记账', en: 'Finance' } },
  { id: 'gaming', icon: '🎮', label: { zh: '游戏 · 模拟器', en: 'Gaming' } },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];
export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [CategoryId, ...CategoryId[]];

export const CATEGORY_SEO: Record<CategoryId, {
  title: LocalizedText;
  description: LocalizedText;
  intro: LocalizedText;
}> = {
  ai: {
    title: {
      zh: '免费 AI 工具与本地大模型软件推荐',
      en: 'Free AI Tools and Local LLM Software',
    },
    description: {
      zh: '精选真正免费的 AI 工具：本地大模型运行器、开源对话客户端、AI 编程助手和图像生成工具，多数可离线运行、无需注册、数据留在本机。',
      en: 'Genuinely free AI tools: local LLM runners, open-source chat clients, AI coding assistants and image generation software — most run offline, need no account, and keep your data on your own machine.',
    },
    intro: {
      zh: '主流 AI 产品大多要订阅、要注册，还要把你的内容传到别人的服务器上。这里只收核心功能免费、不逼你注册的 AI 工具，优先开源、可离线运行、可自建。适合想在本机跑大模型、找 ChatGPT 或 Copilot 免费替代方案的人。',
      en: 'Most mainstream AI products want a subscription, an account, and your content on their servers. This category collects AI tools whose core features are free and that do not force a sign-up, prioritizing open source, offline capability and self-hosting. Start here to run models on your own machine or to find free alternatives to ChatGPT and Copilot.',
    },
  },
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
  browser: {
    title: {
      zh: '免费浏览器推荐：无广告、不追踪',
      en: 'Free Browsers Without Ads or Tracking',
    },
    description: {
      zh: '精选免费浏览器：默认拦截广告与追踪、不绑定账号、不上传浏览记录，覆盖隐私优先、可高度自定义和极端匿名等不同需求。',
      en: 'Free browsers that block ads and trackers by default, require no account, and do not upload your browsing history — from privacy-first defaults to highly customizable and fully anonymous options.',
    },
    intro: {
      zh: '浏览器是你每天用得最久的软件，也是被追踪得最狠的入口。这里收录默认就拦广告、不强制登录账号、不把浏览记录同步到厂商服务器的免费浏览器，从「装完就干净」到「极端匿名」都有。适合在找 Chrome 替代方案的人。',
      en: 'The browser is the software you use most and the surface where you get tracked hardest. This category collects free browsers that block ads out of the box, never force an account, and do not ship your history to a vendor — from clean-by-default to fully anonymous. Start here if you are looking for a Chrome replacement.',
    },
  },
  network: {
    title: {
      zh: '免费下载工具与网络软件推荐',
      en: 'Free Download Managers and Network Tools',
    },
    description: {
      zh: '免费的 BT 下载、多线程下载器、视频下载和组网工具，全部无广告、无限速、无「开会员提速」。',
      en: 'Free BitTorrent clients, multi-threaded download managers, video downloaders and networking tools — no ads, no throttling, no paid "speed boost".',
    },
    intro: {
      zh: '下载工具是国内软件生态里最脏的一块：限速、弹窗、捆绑、开会员才能满速。这里收录的下载器全部开源或免费无广告，不限速、不劫持、不装全家桶，另外附上几个自己搭内网的免费组网工具。',
      en: 'Download tools are where bundled installers, pop-ups and artificial speed limits are worst. Everything here is open source or genuinely free and ad-free: no throttling, no hijacking, no bundled extras — plus a few free tools for wiring your own devices together across networks.',
    },
  },
  chat: {
    title: {
      zh: '免费加密通讯与视频会议软件推荐',
      en: 'Free Encrypted Messaging and Video Meeting Apps',
    },
    description: {
      zh: '精选免费的端到端加密聊天、去中心化通讯和免注册视频会议软件，适合重视隐私和数据自主的用户。',
      en: 'Free end-to-end encrypted messengers, decentralized chat networks and no-signup video meeting tools for people who care about privacy.',
    },
    intro: {
      zh: '主流聊天软件把你的社交关系、位置和消息元数据都变成了商品。这里收录端到端加密、协议开放、可自建服务器的免费通讯工具，以及不用注册就能开的视频会议。重点看加密是否默认开启、服务器能不能自己搭、元数据留多少。',
      en: 'Mainstream chat apps turn your contacts, location and message metadata into a product. This category collects free messengers with end-to-end encryption, open protocols and self-hostable servers, plus video meetings you can start without an account. The things that matter: is encryption on by default, can you run your own server, and how much metadata is left behind.',
    },
  },
  remote: {
    title: {
      zh: '免费远程控制与文件传输工具推荐',
      en: 'Free Remote Desktop and File Transfer Tools',
    },
    description: {
      zh: '免费远程桌面、串流、局域网传输和设备投屏工具，无设备数限制、无商业用途弹窗、可自建中继服务器。',
      en: 'Free remote desktop, game streaming, local file transfer and screen mirroring tools — no device limits, no "commercial use detected" pop-ups, self-hostable relays.',
    },
    intro: {
      zh: '远程控制软件的免费版通常有三种坑：限设备数、误判「商业用途」封你、把画面转发经过厂商服务器。这里收录可以自建中继、不看广告、不限时长的远程与传输工具，也包括局域网内点对点直传文件的方案。',
      en: 'Free tiers of remote desktop software usually hide three traps: device caps, being flagged for "commercial use", and routing your screen through a vendor relay. This category collects remote and transfer tools you can point at your own relay, with no ads and no session timers — plus peer-to-peer file transfer that never leaves your LAN.',
    },
  },
  selfhosted: {
    title: {
      zh: '免费自建服务与家庭服务器软件推荐',
      en: 'Free Self-hosted Server Software',
    },
    description: {
      zh: '精选可自建的免费开源服务：网盘、相册、智能家居、密码库、全屋去广告和监控面板，数据完全留在自己的机器上。',
      en: 'Free open-source software you can host yourself: cloud storage, photo libraries, smart home hubs, password vaults, network-wide ad blocking and status monitoring — all on your own hardware.',
    },
    intro: {
      zh: '自建的意义不是省钱，是「服务不会某天被关掉，数据不会某天被涨价绑架」。这里收录一台旧电脑或 NAS 就能跑起来的开源服务：网盘、相册、智能家居、密码库、全屋去广告。大多有官方 Docker 镜像，一条命令起服务。',
      en: 'Self-hosting is not about saving money — it is about services that cannot be shut down and data that cannot be held hostage by a price hike. Everything here runs on an old PC or a NAS: cloud storage, photo libraries, smart home hubs, password vaults, network-wide ad blocking. Most ship official Docker images and come up with a single command.',
    },
  },
  learning: {
    title: {
      zh: '免费学习与科研软件推荐',
      en: 'Free Learning and Science Software',
    },
    description: {
      zh: '免费的记忆背诵、文献管理、数学几何、天文观星、地理信息和少儿编程软件，适合学生、教师和研究者。',
      en: 'Free software for spaced repetition, reference management, mathematics, astronomy, GIS and kids programming — for students, teachers and researchers.',
    },
    intro: {
      zh: '学习和科研软件的付费版往往贵得离谱，但这个领域恰恰是开源做得最扎实的地方——很多工具本来就诞生于大学和研究机构。这里收录背单词、管文献、画函数、看星空、做地图和给孩子入门编程的免费工具，多数可离线使用。',
      en: 'Academic software is often absurdly expensive, yet this is where open source is strongest — many of these tools were born inside universities and research institutes. This category covers spaced repetition, reference management, graphing, astronomy, GIS and kids programming, most of it usable entirely offline.',
    },
  },
  cad: {
    title: {
      zh: '免费 CAD 与工程设计软件推荐',
      en: 'Free CAD and Engineering Design Software',
    },
    description: {
      zh: '免费开源的三维建模、参数化设计、电路板设计、二维制图和家装设计软件，商用免费、无水印、无导出限制。',
      en: 'Free and open-source 3D modeling, parametric design, PCB layout, 2D drafting and home design software — free for commercial use, no watermarks, no export limits.',
    },
    intro: {
      zh: 'CAD 是正版软件最贵的领域之一，也是「个人版免费、商用就要授权」套路最多的地方。这里收录的工具全部开源，商业用途同样免费，导出没有水印和格式阉割，适合 3D 打印、电子硬件、机械设计和家装规划。',
      en: 'CAD is among the most expensive software categories, and the one with the most "free for personal use, license required for business" traps. Everything here is open source and equally free commercially, with no watermarked or crippled exports — suitable for 3D printing, electronics, mechanical design and home planning.',
    },
  },
  finance: {
    title: {
      zh: '免费记账与个人财务软件推荐',
      en: 'Free Accounting and Personal Finance Software',
    },
    description: {
      zh: '免费的个人记账、复式记账、预算管理和自建财务系统，数据存在本地或自己的服务器，不上传银行账号。',
      en: 'Free personal bookkeeping, double-entry accounting, budgeting and self-hosted finance tools that keep data on your machine and never ask for bank credentials.',
    },
    intro: {
      zh: '记账软件最不该做的事，就是把你的收支明细和银行账号传到别人的服务器上，然后按月收订阅费。这里收录数据存本地或自建服务器的免费记账工具，涵盖简单流水、信封预算和标准复式记账，导出格式开放，不会把你锁死。',
      en: 'The last thing a finance app should do is upload your transactions and bank logins to someone else\'s server and then bill you monthly. This category collects free bookkeeping tools that keep data local or on your own server, covering simple ledgers, envelope budgeting and proper double-entry accounting, with open export formats so you are never locked in.',
    },
  },
  gaming: {
    title: {
      zh: '免费游戏模拟器与游戏管理工具推荐',
      en: 'Free Game Emulators and Game Library Tools',
    },
    description: {
      zh: '免费开源的主机模拟器、掌机模拟器、老游戏运行环境和游戏库管理工具，无广告、无内购、不捆绑游戏平台。',
      en: 'Free open-source console and handheld emulators, classic game engines and library managers — no ads, no in-app purchases, no bundled storefronts.',
    },
    intro: {
      zh: '模拟器生态里山寨版和挂广告的「加强版」特别多，很多还是拿开源项目改个图标就上架收费。这里只收官方开源版本：主机与掌机模拟器、老游戏运行环境、跨平台游戏库管理。请自行准备合法拥有的游戏与 BIOS 文件。',
      en: 'The emulator world is full of ad-laden repackages — many are open-source projects reskinned and sold. This category lists only the official open-source builds: console and handheld emulators, engines that keep classic games playable, and cross-platform library managers. Bring your own legally obtained games and BIOS files.',
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

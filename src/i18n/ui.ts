export const languages: Record<string, string> = {
  zh: '中文',
  en: 'English',
};

export const defaultLang = 'zh';

export const ui = {
  zh: {
    'site.name': 'To Be Free',
    'site.tagline': '让每个人都能自由使用软件',
    'site.description': '收录真正免费、可用、无负担的工具 —— 无广告、无追踪、不逼你注册。',

    'nav.home': '首页',
    'nav.tools': '全部工具',
    'nav.selfmade': '自研',
    'nav.about': '关于',
    'nav.submit': '推荐工具',
    'nav.categories': '分类',

    'hero.title': '自由地使用软件',
    'hero.subtitle': '这里收录真正<em>免费、可用、无负担</em>的工具。不看广告、不被追踪、不用为了一个功能去注册十个账号。',
    'hero.cta.browse': '开始逛逛',
    'hero.cta.about': '我们的标准',
    'hero.stat.tools': '款精选工具',
    'hero.stat.free': '真免费',
    'hero.stat.opensource': '开源优先',

    'home.popular': '常用免费软件',
    'home.popular.sub': '大家最常用的那些，先从这里挑起',
    'home.featured': '编辑精选',
    'home.featured.sub': '每一款都亲自用过，值得放进你的工具箱',
    'home.selfmade': '我们自己做的',
    'home.selfmade.sub': '既然相信自由软件，我们也在造',
    'home.selfmade.more': '全部自研 →',
    'home.categories': '按分类浏览',
    'home.latest': '最近收录',
    'home.all': '查看全部工具',
    'home.all.n': '查看全部 {n} 款工具',

    'tools.title': '全部工具',
    'tools.count': '共 {n} 款',
    'tools.empty': '这个分类还没有工具，欢迎推荐。',

    'card.free': '免费',
    'card.freemium': '有免费版',
    'card.visit': '前往',
    'card.selfmade': '自研',

    'tool.why': '为什么推荐它',
    'tool.overview': '简介',
    'tool.details': '信息',
    'tool.platforms': '支持平台',
    'tool.license': '许可',
    'tool.category': '分类',
    'tool.tags': '标签',
    'tool.added': '收录于',
    'tool.visit': '访问官网',
    'tool.source': '源代码',
    'tool.back': '返回全部工具',
    'tool.related': '同类工具',

    'about.title': '关于 To Be Free',

    'submit.title': '推荐一款工具',
    'submit.intro': '发现了真正免费又好用的工具？告诉我们。我们只收录符合下面标准的工具。',
    'submit.cta': '在 GitHub 上提交',

    'footer.tagline': '自由地使用软件，不该是奢侈。',
    'footer.built': '用 Astro 构建，托管于 Cloudflare，纯静态、零追踪。',
    'footer.nav': '导航',
    'footer.principles': '我们的标准',
    'footer.opensource': '本站开源',

    'theme.toggle': '切换主题',
    'lang.switch': 'English',
    'search.placeholder': '搜索工具、分类、标签…',
    'search.empty': '没有找到匹配的工具',
  },
  en: {
    'site.name': 'To Be Free',
    'site.tagline': 'Software everyone can use freely',
    'site.description': 'A curated home for genuinely free, usable, no-strings tools — no ads, no tracking, no forced sign-ups.',

    'nav.home': 'Home',
    'nav.tools': 'All Tools',
    'nav.selfmade': 'Made by Us',
    'nav.about': 'About',
    'nav.submit': 'Suggest',
    'nav.categories': 'Categories',

    'hero.title': 'Use software, freely',
    'hero.subtitle': 'A curated home for tools that are <em>genuinely free, usable, and burden-free</em>. No ads, no tracking, no signing up for ten accounts just to use one feature.',
    'hero.cta.browse': 'Start Browsing',
    'hero.cta.about': 'Our Standards',
    'hero.stat.tools': 'curated tools',
    'hero.stat.free': 'truly free',
    'hero.stat.opensource': 'open-source first',

    'home.popular': 'Popular free software',
    'home.popular.sub': 'The ones everyone reaches for — start here',
    'home.featured': 'Editor’s Picks',
    'home.featured.sub': 'Each one used first-hand, worth a place in your toolbox',
    'home.selfmade': 'Made by Us',
    'home.selfmade.sub': 'We believe in free software — so we build it too',
    'home.selfmade.more': 'See all ours →',
    'home.categories': 'Browse by Category',
    'home.latest': 'Recently Added',
    'home.all': 'See all tools',
    'home.all.n': 'See all {n} tools',

    'tools.title': 'All Tools',
    'tools.count': '{n} tools',
    'tools.empty': 'No tools here yet — suggestions welcome.',

    'card.free': 'Free',
    'card.freemium': 'Free tier',
    'card.visit': 'Visit',
    'card.selfmade': 'Ours',

    'tool.why': 'Why we picked it',
    'tool.overview': 'Overview',
    'tool.details': 'Details',
    'tool.platforms': 'Platforms',
    'tool.license': 'License',
    'tool.category': 'Category',
    'tool.tags': 'Tags',
    'tool.added': 'Added',
    'tool.visit': 'Visit website',
    'tool.source': 'Source code',
    'tool.back': 'Back to all tools',
    'tool.related': 'Similar tools',

    'about.title': 'About To Be Free',

    'submit.title': 'Suggest a tool',
    'submit.intro': 'Found a tool that’s genuinely free and genuinely good? Tell us. We only list tools that meet the standards below.',
    'submit.cta': 'Submit on GitHub',

    'footer.tagline': 'Using software freely should not be a luxury.',
    'footer.built': 'Built with Astro, hosted on Cloudflare — fully static, zero tracking.',
    'footer.nav': 'Navigate',
    'footer.principles': 'Our Standards',
    'footer.opensource': 'This site is open source',

    'theme.toggle': 'Toggle theme',
    'lang.switch': '中文',
    'search.placeholder': 'Search tools, categories, tags…',
    'search.empty': 'No matching tools found',
  },
} as const;

export type UiKey = keyof (typeof ui)['zh'];

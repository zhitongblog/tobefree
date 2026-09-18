# To Be Free · 让每个人都能自由使用软件

> 收录真正**免费、可用、无负担**的工具 —— 无广告、无追踪、不逼你注册。

一个中英双语、纯静态、零追踪的免费软件目录站。用 [Astro](https://astro.build) 构建，
托管在 [Cloudflare Pages](https://pages.cloudflare.com)（免费）。

- **在线访问**：[tobefree.app](https://tobefree.app/zh/)
- **专题清单**：[免费软件专题](https://tobefree.app/zh/collections/) · [Free software collections](https://tobefree.app/en/collections/)
- **纯静态**：没有后端、没有数据库、没有运行成本。
- **数据驱动**：收录一个工具 = 加一个 YAML 文件，网站自动生成详情页、分类页、搜索、sitemap。
- **三种自助录入**：可视化后台 / CLI / MCP —— 日常加工具不需要写代码。

---

## 快速开始

```bash
npm install
npm run dev        # 本地预览 http://localhost:4321
npm run build      # 构建到 dist/
npm run preview    # 预览构建产物
```

## 收录一个工具（三选一，都不用写代码）

| 方式 | 命令 | 说明 |
|------|------|------|
| 🖥️ 可视化后台 | `npm run admin` | 浏览器打开表单，填完保存，实时预览。**日常首选** |
| ⌨️ CLI | `npm run cli add` | 交互式问答录入；`npm run cli list` / `validate` |
| 🤖 MCP | 见下方 `mcp.json` | 让 Claude 等 AI 直接"收录这个工具" |

三种方式最终都只是往 `src/data/tools/` 写一个 YAML 文件。加完：

```bash
npm run cli validate     # 可选：校验数据
git add . && git commit -m "add: 某工具" && git push
# → Cloudflare Pages 自动重新构建并部署
```

也可以手写一个 `src/data/tools/xxx.yaml`（字段见 `src/content.config.ts` 的 schema）。

## 收录标准

- **硬性（必须全满足）**：真免费（核心功能永久免费）· 完全无广告 · 无强制注册/追踪
- **加分（不强制开源）**：开源 · 跨平台 · 离线可用 · 可自建 —— 用徽章透明标注
- **链接策略**：只链官方网站与官方下载页，**绝不自己托管安装包**

详见站内 `/zh/about` 页。

## 热门专题

- [免费无广告软件推荐](https://tobefree.app/zh/collections/ad-free-free-software/)
- [Windows 免费软件推荐](https://tobefree.app/zh/collections/windows-free-software/)
- [免费开源软件推荐](https://tobefree.app/zh/collections/open-source-free-software/)
- [免费 PDF 工具推荐](https://tobefree.app/zh/collections/free-pdf-tools/)
- [免费笔记软件推荐](https://tobefree.app/zh/collections/free-note-taking-apps/)
- [MCP Server 推荐](https://tobefree.app/zh/collections/mcp-servers/)

## 项目结构

```
src/
  consts.ts            站点配置 + 分类/徽章/平台词表（单一数据源）
  content.config.ts    工具数据的 Zod schema（录入时自动校验）
  data/tools/*.yaml    每个工具一个文件 ← 你日常只动这里
  i18n/                中英文案与路由工具
  layouts/ components/ 布局与组件
  pages/[lang]/        中英双语页面（首页/全部/详情/分类/自研/关于/推荐）
tools/
  admin.mjs            本地可视化后台
  cli.mjs              命令行录入
  mcp-server.mjs       MCP server
  lib.mjs              三者共享的读写/校验逻辑
public/
  _headers             Cloudflare 安全与缓存头
```

## 部署到 Cloudflare Pages

详细图文步骤见 [`docs/DEPLOY.md`](docs/DEPLOY.md)。核心：

1. 把本仓库推到 GitHub。
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → 连接该 GitHub 仓库。
3. 构建命令 `npm run build`，输出目录 `dist`。
4. Pages 项目 → Custom domains → 绑定你的 `tobefree` 域名。

之后每次 `git push`，Cloudflare 自动构建部署。

## 让搜索引擎知道内容更新了

**Google** 走 Search Console，站点地图 `https://tobefree.app/sitemap-index.xml` 已提交，之后它会自己定期来读，不需要每次手动操作。

**Bing / Yandex / Seznam / Naver** 走 IndexNow —— 主动推送，不用等爬虫上门：

```bash
npm run build
npm run indexnow            # 只提交内容有变化的页面
npm run indexnow -- --dry   # 先看看会提交什么，不真发
npm run indexnow -- --all   # 强制全量提交
```

它读 `dist/` 里的站点地图，对每个页面的 HTML 算哈希，和 `.indexnow-state.json` 里的上一次记录比对，只推送真正变了的页面（Astro 给静态资源加的文件名哈希会被归一化掉，所以改个 CSS 不会导致 800 页全部重推）。

两个前提：

- 密钥文件 `public/08ee4dfc5d34346c272a60706af04ea3.txt` 必须已经部署上线，否则接口返回 403。所以顺序是**先 push 等部署完成，再跑 indexnow**。
- Google 不参与 IndexNow，它只补 Bing 那一侧，替代不了 Search Console。

换密钥的话，改 `tools/indexnow.mjs` 里的 `KEY` 并同步重命名 `public/` 下的密钥文件，脚本会检测到密钥变化并自动转为全量提交。

## 部署前记得改

- `src/consts.ts` 里的 `SITE.url`（改成你的真实域名）和 `SITE.repo`（你的 GitHub 仓库）。
- `astro.config.mjs` 里的 `SITE_URL`（与上面保持一致）。
- `tools/indexnow.mjs` 里的 `KEY` 和 `public/<KEY>.txt`（换成你自己生成的密钥，8–128 位 `a-zA-Z0-9-`）。

---

用 Astro 构建 · 托管于 Cloudflare · 纯静态 · 零追踪。

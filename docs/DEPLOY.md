# 部署到 Cloudflare Pages

你已经有域名和 Cloudflare 账号，所以最省心的是 **GitHub + Cloudflare Pages 自动部署**：
以后每次 `git push`，网站自动重新构建上线，零成本、零服务器。

---

## 一、部署前改两处配置

把域名换成你真实的（下面以 `tobefree.app` 为例，按你的实际域名改）：

1. `src/consts.ts`
   ```ts
   export const SITE = {
     url: 'https://tobefree.app',        // ← 改成你的域名
     repo: 'https://github.com/你的用户名/tobefree', // ← 改成你的仓库
     ...
   }
   ```
2. `astro.config.mjs`
   ```js
   const SITE_URL = 'https://tobefree.app'; // ← 与上面保持一致
   ```

## 二、推到 GitHub

```bash
# 在 D:\code\tobefree 里（已是独立 git 仓库）
git add .
git commit -m "init: To Be Free"
# 在 GitHub 新建一个空仓库 tobefree，然后：
git branch -M main
git remote add origin https://github.com/你的用户名/tobefree.git
git push -u origin main
```

## 三、在 Cloudflare 连接并部署

1. 登录 Cloudflare Dashboard → 左侧 **Workers & Pages**。
2. **Create application** → **Pages** → **Connect to Git**。
3. 授权并选择刚推上去的 `tobefree` 仓库。
4. 构建设置：
   | 项 | 值 |
   |----|----|
   | Framework preset | `Astro`（选不到就留 None） |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node version | 用环境变量 `NODE_VERSION` = `22`（可选） |
5. **Save and Deploy**，等 1~2 分钟，会给你一个 `xxx.pages.dev` 的临时地址，先打开确认没问题。

## 四、绑定你的域名

1. 进入这个 Pages 项目 → **Custom domains** → **Set up a custom domain**。
2. 输入 `tobefree.app`（和 `www.tobefree.app` 如果你也想要）。
3. 因为域名已经在 Cloudflare，它会自动帮你加好 DNS 记录（CNAME）。几分钟后 HTTPS 证书自动签发。
4. 建议在域名的 DNS 里把 `www` 或裸域做个跳转，保持单一主域（可在 Cloudflare Rules 里加一条重定向）。

完成。以后加工具只需：`git push` → Cloudflare 自动上线。

---

## 备选：不经过 GitHub，用 Wrangler 直接部署

适合你想手动、快速发一版：

```bash
npm install -g wrangler        # 或 npx wrangler
npm run build
npx wrangler pages deploy dist --project-name tobefree
```

首次会让你登录 Cloudflare，之后 `wrangler pages deploy dist` 一条命令即可发布。

---

## 说明

- `public/_headers` 已配置好安全响应头和静态资源长缓存，Cloudflare Pages 会自动应用。
- `robots.txt` 和 `sitemap-index.xml` 会在构建时自动生成，利于搜索引擎收录。
- 网站是纯静态的，Cloudflare Pages 免费额度（每月 500 次构建、无限请求）对个人站绰绰有余。

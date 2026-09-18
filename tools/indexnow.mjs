#!/usr/bin/env node
/**
 * IndexNow submitter.
 *
 * Reads the built sitemap in `dist/`, hashes each page's HTML, and submits only
 * the URLs whose content actually changed since the previous run. Participating
 * engines (Bing, Yandex, Seznam, Naver, …) share one endpoint; Google does not
 * take part, so this complements Search Console rather than replacing it.
 *
 *   npm run indexnow             submit changed pages only
 *   npm run indexnow -- --all    submit every page in the sitemap
 *   npm run indexnow -- --dry    print what would be sent, send nothing
 *
 * Run it after `npm run build` and after the deploy is live — the key file has
 * to be reachable on the production host or the endpoint answers 403.
 */

import { createHash } from 'node:crypto';
import { readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const STATE_FILE = path.join(ROOT, '.indexnow-state.json');

/** Must match the file served at https://<host>/<KEY>.txt */
const KEY = '08ee4dfc5d34346c272a60706af04ea3';
const ENDPOINT = process.env.INDEXNOW_ENDPOINT ?? 'https://api.indexnow.org/indexnow';
/** The spec caps a single request at 10,000 URLs. */
const BATCH_SIZE = 10000;

const args = new Set(process.argv.slice(2));
const submitAll = args.has('--all');
const dryRun = args.has('--dry') || args.has('--dry-run');

const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

function fail(message) {
  console.error(c.red(`✗ ${message}`));
  process.exit(1);
}

/** Collect <loc> values from the sitemap index and every sitemap it points at. */
async function readSitemapUrls() {
  const indexPath = path.join(DIST, 'sitemap-index.xml');
  let indexXml;
  try {
    indexXml = await readFile(indexPath, 'utf8');
  } catch {
    fail('没找到 dist/sitemap-index.xml —— 先跑 npm run build');
  }

  const parts = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (parts.length === 0) fail('sitemap-index.xml 里没有任何 <loc>');

  const urls = [];
  for (const part of parts) {
    const file = path.join(DIST, path.basename(new URL(part).pathname));
    const xml = await readFile(file, 'utf8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(m[1].trim());
  }
  return [...new Set(urls)];
}

/** Map a canonical URL back to the file Astro built for it. */
function distFileFor(url) {
  const pathname = new URL(url).pathname;
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  if (clean === '') return path.join(DIST, 'index.html');
  if (path.extname(clean)) return path.join(DIST, clean);
  return path.join(DIST, clean, 'index.html');
}

/**
 * Hash a page's meaningful content. Astro fingerprints asset filenames, so
 * those references are normalized away — otherwise an unrelated CSS rebuild
 * would mark all 800 pages as changed and trigger a pointless full resubmit.
 */
async function hashPage(file) {
  let html;
  try {
    html = await readFile(file, 'utf8');
  } catch {
    return null;
  }
  const normalized = html
    .replace(/\/_astro\/[^"'\s)]+/g, '/_astro/<hashed>')
    .replace(/\s+/g, ' ')
    .trim();
  return createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}

async function loadState() {
  try {
    return JSON.parse(await readFile(STATE_FILE, 'utf8'));
  } catch {
    return { key: KEY, submittedAt: null, pages: {} };
  }
}

/** The endpoint answers 403 when it cannot read the key file on the host. */
async function assertKeyIsLive(origin) {
  const keyUrl = `${origin}/${KEY}.txt`;
  let res;
  try {
    res = await fetch(keyUrl);
  } catch (err) {
    fail(`拿不到密钥文件 ${keyUrl} —— ${err.message}\n  部署上线之后再跑，或者加 --dry 先看看要提交什么。`);
  }
  if (!res.ok) {
    fail(`密钥文件 ${keyUrl} 返回 ${res.status} —— 确认 public/${KEY}.txt 已经部署。`);
  }
  const body = (await res.text()).trim();
  if (body !== KEY) {
    fail(`密钥文件内容对不上。期望 ${KEY}，实际拿到 "${body.slice(0, 40)}"`);
  }
  console.log(c.dim(`  密钥文件已就位 ${keyUrl}`));
}

async function submit(origin, host, urlList) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key: KEY,
      keyLocation: `${origin}/${KEY}.txt`,
      urlList,
    }),
  });

  const note = {
    200: '已接收',
    202: '已接收，密钥校验中',
    400: '请求格式有问题',
    403: '密钥无效或读不到密钥文件',
    422: 'URL 不属于该主机，或密钥与 URL 不匹配',
    429: '提交过于频繁，被限流',
  }[res.status] ?? '未知响应';

  return { status: res.status, ok: res.status === 200 || res.status === 202, note };
}

async function main() {
  try {
    await stat(DIST);
  } catch {
    fail('没有 dist/ 目录 —— 先跑 npm run build');
  }

  const urls = await readSitemapUrls();
  const origin = new URL(urls[0]).origin;
  const host = new URL(urls[0]).host;
  console.log(`站点 ${origin} · 站点地图里 ${urls.length} 个 URL`);

  const state = await loadState();
  const previous = state.key === KEY ? (state.pages ?? {}) : {};
  if (state.key && state.key !== KEY) {
    console.log(c.yellow('  密钥变了，本次按全量提交处理'));
  }

  const pages = {};
  const changed = [];
  let missing = 0;

  for (const url of urls) {
    const hash = await hashPage(distFileFor(url));
    if (hash === null) {
      missing++;
      continue;
    }
    pages[url] = hash;
    if (submitAll || previous[url] !== hash) changed.push(url);
  }

  if (missing > 0) {
    console.log(c.yellow(`  ${missing} 个 URL 在 dist/ 里找不到对应文件，已跳过`));
  }

  const firstRun = Object.keys(previous).length === 0;
  if (firstRun && !submitAll) {
    console.log(c.dim('  首次运行，没有历史记录，按全量提交'));
  }

  if (changed.length === 0) {
    console.log(c.green('✓ 没有页面发生变化，不需要提交'));
    return;
  }

  console.log(`有 ${c.yellow(String(changed.length))} 个页面需要提交：`);
  for (const url of changed.slice(0, 10)) console.log(c.dim(`  ${url}`));
  if (changed.length > 10) console.log(c.dim(`  … 另有 ${changed.length - 10} 个`));

  if (dryRun) {
    console.log(c.yellow('\n--dry 模式，没有真的发送。'));
    return;
  }

  await assertKeyIsLive(origin);

  let allOk = true;
  for (let i = 0; i < changed.length; i += BATCH_SIZE) {
    const batch = changed.slice(i, i + BATCH_SIZE);
    const { status, ok, note } = await submit(origin, host, batch);
    const line = `  提交 ${batch.length} 个 → HTTP ${status}（${note}）`;
    console.log(ok ? c.green(line) : c.red(line));
    if (!ok) allOk = false;
  }

  if (!allOk) {
    fail('有批次提交失败，状态文件不更新，修好之后可以重跑。');
  }

  await writeFile(
    STATE_FILE,
    JSON.stringify(
      { key: KEY, submittedAt: new Date().toISOString(), pages: sortKeys(pages) },
      null,
      2,
    ) + '\n',
    'utf8',
  );
  console.log(c.green(`✓ 已提交 ${changed.length} 个 URL，状态写入 .indexnow-state.json`));
}

function sortKeys(obj) {
  return Object.fromEntries(Object.keys(obj).sort().map((k) => [k, obj[k]]));
}

main().catch((err) => fail(err.stack ?? String(err)));

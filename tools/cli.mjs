#!/usr/bin/env node
// To Be Free — CLI for managing the tools catalog.
//   node tools/cli.mjs add        interactively add a tool
//   node tools/cli.mjs list       list all tools
//   node tools/cli.mjs validate   validate every tool file
//   node tools/cli.mjs help

import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import {
  CATEGORIES, BADGES, PLATFORMS, PRICE_MODELS,
  listTools, validate, writeTool,
} from './lib.mjs';

const rl = createInterface({ input: stdin, output: stdout });
const c = {
  b: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  accent: (s) => `\x1b[38;5;173m${s}\x1b[0m`,
};

async function ask(q, def = '') {
  const hint = def ? c.dim(` (${def})`) : '';
  const a = (await rl.question(`${q}${hint}: `)).trim();
  return a || def;
}
async function askMulti(q, options) {
  console.log(c.dim(q));
  options.forEach((o, i) => console.log(`  ${c.b(String(i + 1))}. ${o.id}  ${c.dim(labelOf(o))}`));
  const a = await ask('  选择编号(逗号分隔，可留空) / numbers');
  if (!a) return [];
  return a.split(',').map((s) => parseInt(s.trim(), 10) - 1).filter((i) => options[i]).map((i) => options[i].id);
}
function labelOf(o) {
  return o.label ? (o.label.zh ? `${o.label.zh} / ${o.label.en}` : o.label) : '';
}
async function askYesNo(q, def = false) {
  const a = (await ask(`${q} [y/n]`, def ? 'y' : 'n')).toLowerCase();
  return a.startsWith('y');
}

async function addFlow() {
  console.log(c.accent('\n🕊️  收录一款新工具 / Add a tool\n'));

  const name = await ask(c.b('工具名 / Name'));
  if (!name) { console.log(c.red('名字不能为空')); return; }

  const taglineZh = await ask('一句话简介（中文）');
  const taglineEn = await ask('Tagline (English)');
  const descZh = await ask('简介（中文，1-2 句）');
  const descEn = await ask('Description (English)');

  console.log(c.dim('\n分类 / Category:'));
  CATEGORIES.forEach((cat, i) => console.log(`  ${c.b(String(i + 1))}. ${cat.id}  ${c.dim(labelOf(cat))}`));
  const catIdx = parseInt(await ask('  选择编号'), 10) - 1;
  const category = CATEGORIES[catIdx]?.id || 'utility';

  const price = (await ask(`价格模式 ${c.dim('(' + PRICE_MODELS.join('/') + ')')}`, 'free'));
  const website = await ask(c.b('官网 URL'));
  const download = await ask('官方下载页 URL（可留空）');
  const repo = await ask('源代码 URL（可留空）');
  const license = await ask('许可 / License', 'Freeware');

  const platforms = await askMulti('\n支持平台 / Platforms:', PLATFORMS);
  const badges = await askMulti('\n自由徽章 / Badges:', BADGES);
  const tagsRaw = await ask('标签（逗号分隔）/ Tags');
  const tags = tagsRaw ? tagsRaw.split(',').map((s) => s.trim()).filter(Boolean) : [];

  const accent = await ask('品牌色 hex', '#DB6A3F');
  const featured = await askYesNo('设为编辑精选?', false);
  const popular = await askYesNo('放进首页"常用"广告位?', false);
  const selfMade = await askYesNo('这是你自研的软件?', false);

  const input = {
    name, category, price, website, download, repo, license,
    platforms, badges, tags, accent, featured, popular, selfMade,
    tagline: { zh: taglineZh, en: taglineEn },
    description: { zh: descZh, en: descEn },
  };

  try {
    const { slug, file } = writeTool(input);
    console.log(c.green(`\n✓ 已写入 ${slug}.yaml`));
    console.log(c.dim(`  ${file}`));
    console.log(c.dim('\n下一步: 运行 `npm run dev` 预览，或 `git add . && git commit && git push` 部署。'));
  } catch (e) {
    console.log(c.red(`\n✗ ${e.message}`));
  }
}

function listFlow() {
  const tools = listTools();
  console.log(c.accent(`\n🕊️  共 ${tools.length} 款工具\n`));
  for (const { slug, data } of tools) {
    const flags = [data.featured && '★精选', data.selfMade && '✦自研'].filter(Boolean).join(' ');
    console.log(`  ${c.b(data.name.padEnd(16))} ${c.dim(data.category.padEnd(13))} ${flags}`);
    console.log(`  ${c.dim(slug)}`);
  }
  console.log();
}

function validateFlow() {
  const tools = listTools();
  let bad = 0;
  for (const { slug, data } of tools) {
    const errs = validate(data);
    if (errs.length) {
      bad++;
      console.log(c.red(`✗ ${slug}`));
      errs.forEach((e) => console.log(`    ${e}`));
    }
  }
  if (bad === 0) console.log(c.green(`✓ ${tools.length} 款工具全部通过校验`));
  else console.log(c.red(`\n${bad} 款工具有问题`));
}

function help() {
  console.log(`
${c.accent('To Be Free CLI')}

  ${c.b('npm run cli')}            交互式添加工具 (= add)
  ${c.b('npm run cli add')}        交互式添加工具
  ${c.b('npm run cli list')}       列出所有工具
  ${c.b('npm run cli validate')}   校验所有工具数据

添加后运行 ${c.b('npm run dev')} 预览，或推送到 GitHub 让 Cloudflare 自动部署。
`);
}

const cmd = process.argv[2] || 'add';
try {
  if (cmd === 'add') await addFlow();
  else if (cmd === 'list') listFlow();
  else if (cmd === 'validate') validateFlow();
  else help();
} finally {
  rl.close();
}

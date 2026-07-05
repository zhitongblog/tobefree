#!/usr/bin/env node
// To Be Free — local visual admin. Run `npm run admin`, fill the form, hit save.
// Writes a YAML file into src/data/tools/. Never deployed; runs only on your machine.

import { createServer } from 'node:http';
import { exec } from 'node:child_process';
import {
  CATEGORIES, BADGES, PLATFORMS, PRICE_MODELS,
  listTools, writeTool,
} from './lib.mjs';

const PORT = 8788;

function json(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let b = '';
    req.on('data', (c) => (b += c));
    req.on('end', () => { try { resolve(b ? JSON.parse(b) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(PAGE);
      return;
    }
    if (req.method === 'GET' && req.url === '/api/vocab') {
      return json(res, 200, { CATEGORIES, BADGES, PLATFORMS, PRICE_MODELS });
    }
    if (req.method === 'GET' && req.url === '/api/tools') {
      const tools = listTools().map(({ slug, data }) => ({
        slug, name: data.name, category: data.category,
        featured: !!data.featured, selfMade: !!data.selfMade,
      }));
      return json(res, 200, tools);
    }
    if (req.method === 'POST' && req.url === '/api/tools') {
      const input = await readBody(req);
      try {
        const { slug, file } = writeTool(input, { overwrite: !!input.overwrite });
        return json(res, 200, { ok: true, slug, file });
      } catch (e) {
        return json(res, 400, { ok: false, error: e.message });
      }
    }
    res.writeHead(404); res.end('Not found');
  } catch (e) {
    json(res, 500, { ok: false, error: String(e) });
  }
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n  🕊️  To Be Free 管理后台已启动`);
  console.log(`  ➜  ${url}\n`);
  const opener = process.platform === 'win32' ? `start "" "${url}"`
    : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
  exec(opener, () => {});
});

const PAGE = `<!doctype html>
<html lang="zh-CN"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>To Be Free · 管理后台</title>
<style>
  :root{--bg:#fbf6ee;--surface:#fffdf9;--surface2:#faf1e4;--text:#2b2119;--soft:#6e5f51;--faint:#9c8b7a;
    --border:#e9ddca;--accent:#d96c3f;--accent-ink:#b0481f;--green:#4c7a5b;--green-soft:#e2efe4;--radius:14px}
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,-apple-system,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;
    background:var(--bg);color:var(--text);line-height:1.6}
  .wrap{max-width:1080px;margin:0 auto;padding:2rem 1.5rem 4rem;display:grid;grid-template-columns:1fr 340px;gap:2rem}
  header{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
  h1{font-size:1.5rem;margin:0;font-weight:700}.sub{color:var(--soft);font-size:.9rem}
  .count{color:var(--faint);font-size:.85rem}
  form{display:flex;flex-direction:column;gap:1.1rem}
  fieldset{border:1px solid var(--border);border-radius:var(--radius);padding:1.1rem 1.2rem;background:var(--surface)}
  legend{font-weight:700;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;color:var(--faint);padding:0 .4rem}
  label{display:block;font-size:.82rem;font-weight:600;color:var(--soft);margin:.6rem 0 .25rem}
  input[type=text],input[type=url],textarea,select{width:100%;font:inherit;padding:.55rem .7rem;border:1px solid var(--border);
    border-radius:9px;background:var(--surface2);color:var(--text)}
  textarea{min-height:64px;resize:vertical;font-size:.9rem}
  .row{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}
  .chips{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.4rem}
  .chip{font-size:.82rem;font-weight:600;color:var(--soft);background:var(--surface2);border:1px solid var(--border);
    border-radius:999px;padding:.3rem .7rem;cursor:pointer;user-select:none}
  .chip.on{color:#fff;background:var(--accent);border-color:var(--accent)}
  .flags{display:flex;gap:1.2rem;align-items:center}
  .flags label{display:flex;align-items:center;gap:.4rem;margin:0;cursor:pointer;font-size:.9rem}
  .flags input{width:auto}
  .btn{font:inherit;font-weight:700;border:0;border-radius:999px;padding:.7rem 1.4rem;cursor:pointer}
  .btn-primary{background:var(--accent);color:#fff}.btn-primary:hover{background:var(--accent-ink)}
  .actions{display:flex;gap:.8rem;align-items:center}
  #msg{font-size:.9rem;font-weight:600}
  aside{position:sticky;top:1.5rem;align-self:start}
  .previewhead{font-size:.8rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--faint);margin-bottom:.7rem}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:1.4rem;box-shadow:0 4px 14px rgba(90,60,30,.08)}
  .av{width:46px;height:46px;border-radius:13px;display:grid;place-items:center;color:#fff;font-weight:700;font-size:1.1rem}
  .ptop{display:flex;justify-content:space-between;align-items:center;margin-bottom:.8rem}
  .price{font-size:.7rem;font-weight:700;color:var(--green);background:var(--green-soft);padding:.22rem .55rem;border-radius:999px}
  .pname{font-size:1.2rem;font-weight:700;margin:.1rem 0 .3rem}.ptag{color:var(--soft);font-size:.9rem}
  .pbadges{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.9rem}
  .pbadge{font-size:.72rem;font-weight:600;color:var(--soft);background:var(--surface2);border:1px solid var(--border);padding:.18rem .5rem;border-radius:999px}
  .existing{margin-top:1.5rem;font-size:.85rem;color:var(--soft);max-height:220px;overflow:auto}
  .existing div{padding:.25rem 0;border-bottom:1px solid var(--border)}
  @media(max-width:820px){.wrap{grid-template-columns:1fr}aside{position:static}}
</style></head>
<body><div class="wrap">
  <header>
    <div><h1>🕊️ 收录一款工具</h1><div class="sub">填完点保存 → 生成 YAML → git push 部署</div></div>
    <div class="count" id="count"></div>
  </header>

  <form id="f">
    <fieldset><legend>基本 Basics</legend>
      <label>工具名 Name *</label><input type="text" id="name" required>
      <div class="row">
        <div><label>一句话简介（中文）*</label><input type="text" id="tagline_zh"></div>
        <div><label>Tagline (EN) *</label><input type="text" id="tagline_en"></div>
      </div>
      <div class="row">
        <div><label>简介（中文）*</label><textarea id="description_zh"></textarea></div>
        <div><label>Description (EN) *</label><textarea id="description_en"></textarea></div>
      </div>
    </fieldset>

    <fieldset><legend>分类与价格 Category</legend>
      <div class="row">
        <div><label>分类 Category *</label><select id="category"></select></div>
        <div><label>价格 Price</label><select id="price"></select></div>
      </div>
    </fieldset>

    <fieldset><legend>链接 Links（只填官方，不托管安装包）</legend>
      <label>官网 Website *</label><input type="url" id="website" placeholder="https://">
      <div class="row">
        <div><label>官方下载页（可选）</label><input type="url" id="download" placeholder="https://"></div>
        <div><label>源代码（可选）</label><input type="url" id="repo" placeholder="https://"></div>
      </div>
      <label>许可 License</label><input type="text" id="license" placeholder="GPL-3.0 / MIT / Freeware">
    </fieldset>

    <fieldset><legend>平台 Platforms</legend><div class="chips" id="platforms"></div></fieldset>
    <fieldset><legend>自由徽章 Badges</legend><div class="chips" id="badges"></div></fieldset>

    <fieldset><legend>更多 More</legend>
      <label>标签（逗号分隔）Tags</label><input type="text" id="tags" placeholder="notes, markdown, ...">
      <div class="row">
        <div><label>品牌色 Accent</label><input type="text" id="accent" value="#DB6A3F"></div>
        <div><label>头像字母 Initials（可选）</label><input type="text" id="initials" maxlength="3"></div>
      </div>
      <div class="row" style="margin-top:.7rem">
        <div><label>测评（中文，可选 · Markdown）</label><textarea id="review_zh"></textarea></div>
        <div><label>Review (EN, optional)</label><textarea id="review_en"></textarea></div>
      </div>
      <div class="flags" style="margin-top:.9rem">
        <label><input type="checkbox" id="featured"> ★ 编辑精选</label>
        <label><input type="checkbox" id="popular"> 🔥 常用广告位</label>
        <label><input type="checkbox" id="selfMade"> ✦ 自研软件</label>
      </div>
    </fieldset>

    <div class="actions">
      <button class="btn btn-primary" type="submit">保存工具</button>
      <span id="msg"></span>
    </div>
  </form>

  <aside>
    <div class="previewhead">实时预览</div>
    <div class="card">
      <div class="ptop"><div class="av" id="p_av" style="background:#DB6A3F">TB</div><span class="price" id="p_price">免费</span></div>
      <div class="pname" id="p_name">工具名</div>
      <div class="ptag" id="p_tag">一句话简介会显示在这里</div>
      <div class="pbadges" id="p_badges"></div>
    </div>
    <div class="previewhead" style="margin-top:1.5rem">已收录</div>
    <div class="existing" id="existing"></div>
  </aside>
</div>

<script>
let VOCAB;
const $ = (id) => document.getElementById(id);
const on = new Set(), onB = new Set();

async function boot(){
  VOCAB = await (await fetch('/api/vocab')).json();
  $('category').innerHTML = VOCAB.CATEGORIES.map(c=>'<option value="'+c.id+'">'+c.label.zh+' / '+c.label.en+'</option>').join('');
  $('price').innerHTML = VOCAB.PRICE_MODELS.map(p=>'<option value="'+p+'">'+p+'</option>').join('');
  $('platforms').innerHTML = VOCAB.PLATFORMS.map(p=>'<span class="chip" data-p="'+p.id+'">'+p.label+'</span>').join('');
  $('badges').innerHTML = VOCAB.BADGES.map(b=>'<span class="chip" data-b="'+b.id+'">'+b.label.zh+'</span>').join('');
  document.querySelectorAll('[data-p]').forEach(el=>el.onclick=()=>{el.classList.toggle('on');tog(on,el.dataset.p);});
  document.querySelectorAll('[data-b]').forEach(el=>el.onclick=()=>{el.classList.toggle('on');tog(onB,el.dataset.b);preview();});
  ['name','tagline_zh','price','accent','initials'].forEach(id=>$(id).addEventListener('input',preview));
  refresh(); preview();
}
function tog(set,v){ set.has(v)?set.delete(v):set.add(v); }
function preview(){
  const name=$('name').value||'工具名';
  $('p_name').textContent=name;
  $('p_tag').textContent=$('tagline_zh').value||'一句话简介会显示在这里';
  $('p_price').textContent=$('price').value==='free'?'免费':'有免费版';
  const ac=$('accent').value||'#DB6A3F'; $('p_av').style.background=ac;
  $('p_av').textContent=($('initials').value|| name.replace(/[^A-Za-z0-9一-龥]/g,'').slice(0,2)).toUpperCase();
  const labels={}; (VOCAB?.BADGES||[]).forEach(b=>labels[b.id]=b.label.zh);
  $('p_badges').innerHTML=[...onB].slice(0,4).map(b=>'<span class="pbadge">'+labels[b]+'</span>').join('');
}
async function refresh(){
  const t=await (await fetch('/api/tools')).json();
  $('count').textContent='已收录 '+t.length+' 款';
  $('existing').innerHTML=t.map(x=>'<div>'+(x.featured?'★ ':'')+(x.selfMade?'✦ ':'')+x.name+' · '+x.category+'</div>').join('');
}
$('f').addEventListener('submit',async(e)=>{
  e.preventDefault();
  const g=(id)=>$(id).value.trim();
  const input={
    name:g('name'),category:g('category'),price:g('price'),website:g('website'),
    download:g('download'),repo:g('repo'),license:g('license'),accent:g('accent'),initials:g('initials'),
    tags:g('tags')?g('tags').split(',').map(s=>s.trim()).filter(Boolean):[],
    platforms:[...on],badges:[...onB],
    featured:$('featured').checked,popular:$('popular').checked,selfMade:$('selfMade').checked,
    tagline:{zh:g('tagline_zh'),en:g('tagline_en')},
    description:{zh:g('description_zh'),en:g('description_en')},
    review:{zh:g('review_zh'),en:g('review_en')},
  };
  const msg=$('msg');
  const r=await fetch('/api/tools',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
  const d=await r.json();
  if(d.ok){ msg.style.color='#4c7a5b'; msg.textContent='✓ 已保存 '+d.slug+'.yaml'; $('f').reset(); on.clear(); onB.clear();
    document.querySelectorAll('.chip.on').forEach(c=>c.classList.remove('on')); refresh(); preview(); }
  else { msg.style.color='#b0481f'; msg.textContent='✗ '+d.error; }
});
boot();
</script>
</body></html>`;

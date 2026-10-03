#!/usr/bin/env node
// To Be Free — MCP server (stdio). Lets Claude / any MCP client browse and add
// tools in the catalog. Minimal newline-delimited JSON-RPC 2.0 implementation,
// no external dependencies.
//
// Register in Claude Code / Desktop (mcp.json):
//   { "mcpServers": { "tobefree": { "command": "node",
//     "args": ["D:/code/tobefree/tools/mcp-server.mjs"] } } }

import { createInterface } from 'node:readline';
import {
  CATEGORIES, BADGES, PLATFORMS, PRICE_MODELS,
  listTools, writeTool,
  SUPPORTER_KINDS, listSupporters, writeSupporter,
} from './lib.mjs';

const SERVER = { name: 'tobefree', version: '0.1.0' };
const PROTOCOL = '2024-11-05';

const TOOLS = [
  {
    name: 'list_tools',
    description: 'List all tools currently in the To Be Free catalog.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_vocabulary',
    description: 'Return the allowed categories, freedom badges, platforms and price models used by the catalog.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'add_tool',
    description:
      'Add a new tool to the To Be Free catalog. Only accept genuinely free, ad-free, burden-free tools. ' +
      'Writes a YAML file into src/data/tools/. tagline and description must be provided in both zh and en.',
    inputSchema: {
      type: 'object',
      required: ['name', 'category', 'website', 'tagline', 'description'],
      properties: {
        name: { type: 'string', description: 'Tool display name' },
        category: { type: 'string', enum: CATEGORIES.map((c) => c.id) },
        price: { type: 'string', enum: PRICE_MODELS, default: 'free' },
        website: { type: 'string', description: 'Official website URL' },
        download: { type: 'string', description: 'Official downloads page URL (optional, never self-hosted)' },
        repo: { type: 'string', description: 'Source code URL (optional)' },
        license: { type: 'string', description: 'e.g. GPL-3.0, MIT, Freeware' },
        platforms: { type: 'array', items: { type: 'string', enum: PLATFORMS.map((p) => p.id) } },
        badges: { type: 'array', items: { type: 'string', enum: BADGES.map((b) => b.id) } },
        tags: { type: 'array', items: { type: 'string' } },
        accent: { type: 'string', description: 'Brand color hex, e.g. #DB6A3F' },
        initials: { type: 'string', description: 'Avatar initials (optional)' },
        featured: { type: 'boolean', description: 'Editor’s pick — highlight on the home page' },
        popular: { type: 'boolean', description: 'Show in the home "popular free software" spotlight band' },
        selfMade: { type: 'boolean', description: 'Made by us' },
        tagline: {
          type: 'object', required: ['zh', 'en'],
          properties: { zh: { type: 'string' }, en: { type: 'string' } },
        },
        description: {
          type: 'object', required: ['zh', 'en'],
          properties: { zh: { type: 'string' }, en: { type: 'string' } },
        },
        review: {
          type: 'object', description: 'Optional editorial review (Markdown).',
          properties: { zh: { type: 'string' }, en: { type: 'string' } },
        },
      },
    },
  },
  {
    name: 'list_supporters',
    description: 'List everyone on the supporter wall (people who promoted or sponsored the site), newest first.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'add_supporter',
    description:
      'Add an approved promoter or sponsor to the supporter wall (src/data/supporters/). ' +
      'The wall is a thank-you only and must never influence tool inclusion or ranking. ' +
      'Promotion entries require a public proof link.',
    inputSchema: {
      type: 'object',
      required: ['name', 'kinds'],
      properties: {
        name: { type: 'string', description: 'Display name exactly as the supporter asked for it' },
        kinds: { type: 'array', minItems: 1, items: { type: 'string', enum: SUPPORTER_KINDS } },
        url: { type: 'string', description: 'Supporter homepage (optional)' },
        proof: { type: 'string', description: 'Public link to the promotion (required for promote)' },
        note: {
          type: 'object', description: 'Optional one-line note shown under the name',
          properties: { zh: { type: 'string' }, en: { type: 'string' } },
        },
        slug: { type: 'string', description: 'File name; use ASCII when the name is not Latin' },
        added: { type: 'string', description: 'YYYY-MM-DD, defaults to today' },
      },
    },
  },
];

function callTool(name, args = {}) {
  if (name === 'list_tools') {
    const tools = listTools().map(({ slug, data }) => ({
      slug, name: data.name, category: data.category,
      featured: !!data.featured, selfMade: !!data.selfMade, website: data.website,
    }));
    return text(JSON.stringify(tools, null, 2));
  }
  if (name === 'get_vocabulary') {
    return text(JSON.stringify({ CATEGORIES, BADGES, PLATFORMS, PRICE_MODELS }, null, 2));
  }
  if (name === 'add_tool') {
    const { slug, file } = writeTool(args);
    return text(`✓ Added "${args.name}" as ${slug}.yaml\n${file}\n\nRun \`npm run build\` to preview, then git push to deploy.`);
  }
  if (name === 'list_supporters') {
    return text(JSON.stringify(listSupporters().map(({ slug, data }) => ({ slug, ...data })), null, 2));
  }
  if (name === 'add_supporter') {
    const { slug, file } = writeSupporter(args);
    return text(`✓ Added "${args.name}" to the supporter wall as ${slug}.yaml\n${file}\n\nRun \`npm run build\` to preview, then git push to deploy.`);
  }
  throw new Error(`Unknown tool: ${name}`);
}

function text(t) {
  return { content: [{ type: 'text', text: t }] };
}

function handle(msg) {
  const { id, method, params } = msg;
  if (method === 'initialize') {
    return reply(id, { protocolVersion: PROTOCOL, capabilities: { tools: {} }, serverInfo: SERVER });
  }
  if (method === 'tools/list') {
    return reply(id, { tools: TOOLS });
  }
  if (method === 'tools/call') {
    try {
      return reply(id, callTool(params?.name, params?.arguments));
    } catch (e) {
      return reply(id, { content: [{ type: 'text', text: `Error: ${e.message}` }], isError: true });
    }
  }
  if (method === 'ping') return reply(id, {});
  // Notifications (no id) need no response.
  if (id === undefined || id === null) return null;
  return { jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } };
}

function reply(id, result) {
  return { jsonrpc: '2.0', id, result };
}

const rl = createInterface({ input: process.stdin });
rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    return;
  }
  const out = handle(msg);
  if (out) process.stdout.write(JSON.stringify(out) + '\n');
});

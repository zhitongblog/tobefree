// Cloudflare Pages Function for the site root ("/").
// A real server-side, flash-free 302 redirect to /zh/ or /en/,
// chosen from the visitor's Accept-Language header. Runs only on "/".
export function onRequest(context) {
  const { request } = context;
  const accept = (request.headers.get('accept-language') || '').toLowerCase();
  const primary = accept.split(',')[0].trim();
  const target = primary.startsWith('zh') ? '/zh/' : '/en/';
  return new Response(null, {
    status: 302,
    headers: {
      Location: target,
      'Cache-Control': 'no-store',
    },
  });
}

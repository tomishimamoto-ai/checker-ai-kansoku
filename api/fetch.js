export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('url');

  if (!target) {
    return new Response('url parameter required', { status: 400 });
  }

  // 許可するプロトコルのみ
  let parsedUrl;
  try {
    parsedUrl = new URL(target);
  } catch {
    return new Response('Invalid URL', { status: 400 });
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return new Response('Only http/https allowed', { status: 400 });
  }

  try {
    const res = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-Kansoku-Checker/1.0)',
      },
      redirect: 'follow',
    });

    const text = await res.text();

    return new Response(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    return new Response(`Fetch error: ${err.message}`, { status: 502 });
  }
}

/**
 * STELAR Hot 500 - OG Meta Handler
 */

export async function onRequest(context) {
    const { request, env } = context;

    try {
        const htmlResponse = await env.ASSETS.fetch(new Request(new URL('/', request.url)));
        let html = await htmlResponse.text();

        const title = "🔥 The STELAR Hot 500 | Real-Time Global Signals";
        const description = "🔥 The 500 most influential songs on the planet right now. Real-time chart data tracked via STELAR's proprietary signal engine.";
        const ogImage = `https://stelarmusic.pages.dev/hot500-og.png`;

        html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
        html = html.replace(/<meta name="description" content="[^"]*"/g, `<meta name="description" content="${description}"`);
        html = html.replace(/<meta property="og:title" content="[^"]*"/g, `<meta property="og:title" content="${title}"`);
        html = html.replace(/<meta property="og:description" content="[^"]*"/g, `<meta property="og:description" content="${description}"`);
        html = html.replace(/<meta property="og:image" content="[^"]*"/g, `<meta property="og:image" content="${ogImage}"`);
        html = html.replace(/<meta property="og:url" content="[^"]*"/g, `<meta property="og:url" content="https://stelarmusic.pages.dev/hot-500"`);
        html = html.replace(/<meta name="twitter:title" content="[^"]*"/g, `<meta name="twitter:title" content="${title}"`);
        html = html.replace(/<meta name="twitter:description" content="[^"]*"/g, `<meta name="twitter:description" content="${description}"`);
        html = html.replace(/<meta name="twitter:image" content="[^"]*"/g, `<meta name="twitter:image" content="${ogImage}"`);

        return new Response(html, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'public, max-age=3600' }
        });
    } catch (error) {
        return env.ASSETS.fetch(request);
    }
}

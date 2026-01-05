/**
 * STELAR Live Tours - OG Meta Handler
 */

export async function onRequest(context) {
    const { request, env } = context;

    try {
        const htmlResponse = await env.ASSETS.fetch(new Request(new URL('/', request.url)));
        let html = await htmlResponse.text();

        const title = "🎫 Live Tours | STELAR Global Routing";
        const description = "🎫 Track live tour dates and routing patterns for top artists. Integrated affiliate links for immediate access to global sonic events.";
        const ogImage = `https://stelarmusic.pages.dev/og-image.png`;

        html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
        html = html.replace(/<meta name="description" content="[^"]*"/g, `<meta name="description" content="${description}"`);
        html = html.replace(/<meta property="og:title" content="[^"]*"/g, `<meta property="og:title" content="${title}"`);
        html = html.replace(/<meta property="og:description" content="[^"]*"/g, `<meta property="og:description" content="${description}"`);
        html = html.replace(/<meta property="og:image" content="[^"]*"/g, `<meta property="og:image" content="${ogImage}"`);
        html = html.replace(/<meta property="og:url" content="[^"]*"/g, `<meta property="og:url" content="https://stelarmusic.pages.dev/tours"`);
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

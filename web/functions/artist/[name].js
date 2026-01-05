/**
 * STELAR Artist Page OG Handler
 * Injects dynamic meta tags for artist sharing
 * Copy: "Check out [Artist] on STELAR! Explore their full profile, top 50 songs, streaming trends, and more."
 */

export async function onRequest(context) {
    const { request, env, params } = context;
    const slug = params.name;
    const artistName = decodeURIComponent(slug.replace(/-/g, ' '));

    try {
        // Fetch rankings data
        const response = await env.ASSETS.fetch(new Request(new URL('/rankings.json', request.url)));
        if (!response.ok) return env.ASSETS.fetch(new Request(new URL('/', request.url)));

        const data = await response.json();

        // Find artist
        let artist = null;
        if (data.rankings) {
            for (const category of Object.values(data.rankings)) {
                artist = category.find(a =>
                    a.name?.toLowerCase() === artistName.toLowerCase() ||
                    a.name?.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
                );
                if (artist) break;
            }
        }

        if (!artist) return env.ASSETS.fetch(new Request(new URL('/', request.url)));

        // Get HTML shell
        const shellResponse = await env.ASSETS.fetch(new Request(new URL('/', request.url)));
        let html = await shellResponse.text();

        // Metadata
        const title = `${artist.name} | STELAR`;
        const description = `Check out ${artist.name} on STELAR! Explore their full profile, top 50 songs, streaming trends, and more.`;

        // OG Image URL
        let ogImageUrl = `https://stelarmusic.pages.dev/api/og?name=${encodeURIComponent(artist.name)}`;
        if (artist.avatar_url) {
            ogImageUrl += `&image=${encodeURIComponent(artist.avatar_url)}`;
        }

        // Inject meta tags
        html = html
            .replace(/<title>.*?<\/title>/g, `<title>${title}</title>`)
            .replace(/<meta property="og:title" content=".*?"/g, `<meta property="og:title" content="${title}"`)
            .replace(/<meta property="og:description" content=".*?"/g, `<meta property="og:description" content="${description}"`)
            .replace(/<meta property="og:image" content=".*?"/g, `<meta property="og:image" content="${ogImageUrl}"`)
            .replace(/<meta name="twitter:title" content=".*?"/g, `<meta name="twitter:title" content="${title}"`)
            .replace(/<meta name="twitter:description" content=".*?"/g, `<meta name="twitter:description" content="${description}"`)
            .replace(/<meta name="twitter:image" content=".*?"/g, `<meta name="twitter:image" content="${ogImageUrl}"`)
            .replace(/<meta name="description" content=".*?"/g, `<meta name="description" content="${description}"`);

        return new Response(html, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' }
        });

    } catch (e) {
        console.error('Artist OG Error:', e);
        return env.ASSETS.fetch(new Request(new URL('/', request.url)));
    }
}

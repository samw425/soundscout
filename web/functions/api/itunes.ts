export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const params = url.searchParams;

    // Use lookup if ID is provided, else use search
    const isLookup = params.has('id') || params.has('id');
    const endpoint = isLookup ? 'lookup' : 'search';

    // Construct target iTunes URL with ONLY whitelisted params to avoid 500s from bad query pasthrough
    const itunesUrl = new URL(`https://itunes.apple.com/${endpoint}`);

    // Whitelist params
    const allowed = ['term', 'entity', 'limit', 'id', 'country', 'media', 'attribute'];
    allowed.forEach(key => {
        if (params.has(key)) {
            itunesUrl.searchParams.set(key, params.get(key));
        }
    });

    try {
        const response = await fetch(itunesUrl.toString(), {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            cf: {
                cacheEverything: true,
                cacheTtl: 3600
            }
        });

        if (!response.ok) {
            return new Response(JSON.stringify({
                error: 'iTunes API error',
                status: response.status
            }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Proxy Logic Failure',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}

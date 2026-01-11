export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Use lookup if ID is provided, else use search
    const isLookup = searchParams.has('id');
    const endpoint = isLookup ? 'lookup' : 'search';

    // Construct target iTunes URL
    const itunesUrl = new URL(`https://itunes.apple.com/${endpoint}`);
    searchParams.forEach((value, key) => {
        itunesUrl.searchParams.set(key, value);
    });

    try {
        const response = await fetch(itunesUrl.toString(), {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch from iTunes', details: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

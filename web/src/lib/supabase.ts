/**
 * STELAR Data Layer
 * ======================
 * Fetches REAL artist data from our proprietary rankings.
 * 
 * Data Source: rankings.json (generated daily by Python scraper)
 * - 3000+ artists from Spotify Charts
 * - 15 categories with 150+ artists each
 * - Proprietary Power Score, Conversion Score, Arbitrage Signal
 */

// Types for our data model
export interface PowerIndexArtist {
    id: string;
    name: string;
    genre: string;
    country: string;
    city: string | null;
    spotify_id: string;
    label_name: string | null;
    is_independent: boolean;
    avatar_url: string | null;

    // Social handles
    tiktok_handle: string | null;
    instagram_handle: string | null;
    twitter_handle: string | null;
    youtube_channel: string | null;

    // Metrics
    monthlyListeners: number;
    tiktokFollowers: number;
    instagramFollowers: number;
    youtubeSubscribers: number;
    twitterFollowers: number;

    // Proprietary Scores
    powerScore: number;
    conversionScore: number;
    arbitrageSignal: number;
    growthVelocity: number;
    status: 'Viral' | 'Breakout' | 'Dominance' | 'Stable' | 'Conversion';

    // Ranking
    rank: number;
    chartRank: number;
    lastUpdated: string;
}

export interface RankingsData {
    generated_at: string;
    algorithm_version: string;
    data_source: string;
    total_artists: number;
    rankings: {
        global: PowerIndexArtist[];
        pop: PowerIndexArtist[];
        hip_hop: PowerIndexArtist[];
        r_and_b: PowerIndexArtist[];
        country: PowerIndexArtist[];
        afrobeats: PowerIndexArtist[];
        latin: PowerIndexArtist[];
        k_pop: PowerIndexArtist[];
        indie: PowerIndexArtist[];
        alternative: PowerIndexArtist[];
        electronic: PowerIndexArtist[];
        major: PowerIndexArtist[];
        indie_label: PowerIndexArtist[];
        radar: PowerIndexArtist[];
        arbitrage: PowerIndexArtist[];
        viral: PowerIndexArtist[];
        [key: string]: PowerIndexArtist[];
    };
}

// Cache for rankings data
let rankingsCache: RankingsData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// In-flight promise for deduplication
let activeFetchPromise: Promise<RankingsData | null> | null = null;

/**
 * Fetch the complete rankings data from our JSON file.
 * This contains 3000+ artists across 15 categories.
 * Optimized with caching and request deduplication.
 */
export async function fetchRankingsData(): Promise<RankingsData | null> {
    // 1. Check in-memory cache
    if (rankingsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
        return rankingsCache;
    }

    // 2. Check if a fetch is already in progress
    if (activeFetchPromise) {
        return activeFetchPromise;
    }

    // 3. Start new fetch
    activeFetchPromise = (async () => {
        try {
            // Cache-busting: Force fresh load with timestamp
            const response = await fetch(`/rankings.json?t=${Date.now()}`);
            if (!response.ok) {
                console.error('Failed to fetch rankings:', response.status);
                activeFetchPromise = null; // Clear on failure
                return null;
            }

            const data: RankingsData = await response.json();

            // Cache the data
            rankingsCache = data;
            cacheTimestamp = Date.now();
            activeFetchPromise = null; // Clear when done

            console.log(`[STELAR] Loaded ${data.total_artists} artists from ${data.data_source}`);
            console.log(`[STELAR] Algorithm version: ${data.algorithm_version}`);
            console.log(`[STELAR] Generated at: ${data.generated_at}`);

            return data;
        } catch (error) {
            console.error('Error fetching rankings:', error);
            activeFetchPromise = null; // Clear on error
            return null;
        }
    })();

    return activeFetchPromise;
}

/**
 * Get the timestamp of when rankings data was generated.
 * Returns ISO string or null if not loaded.
 */
export function getDataTimestamp(): string | null {
    return rankingsCache?.generated_at || null;
}

/**
 * Fetch artists for The Pulse.
 * Supports filtering by genre and category.
 */
export async function fetchPowerIndex(
    genre: string = 'All',
    category: string = 'global'
): Promise<PowerIndexArtist[]> {
    const data = await fetchRankingsData();

    if (!data) {
        console.error('No rankings data available');
        return [];
    }

    // Map genre to category key
    let categoryKey = category;

    if (genre !== 'All') {
        const genreMap: Record<string, string> = {
            'Pop': 'pop',
            'Hip Hop': 'hip_hop',
            'R&B': 'r_and_b',
            'Country': 'country',
            'Afrobeats': 'afrobeats',
            'Latin': 'latin',
            'K-Pop': 'k_pop',
            'Indie': 'indie',
            'Alternative': 'alternative',
            'Electronic': 'electronic',
        };
        categoryKey = genreMap[genre] || 'global';
    }

    const artists = data.rankings[categoryKey] || data.rankings.global;

    return artists;
}

/**
 * Fetch Radar - artists with high ignition scores.
 * These are the hidden gems about to break.
 */
export async function fetchRadar(): Promise<PowerIndexArtist[]> {
    const data = await fetchRankingsData();
    if (!data) return [];
    return data.rankings.radar || [];
}

/**
 * Fetch Arbitrage Signals - low conversion, high opportunity.
 */
export async function fetchArbitrageSignals(): Promise<PowerIndexArtist[]> {
    const data = await fetchRankingsData();
    if (!data) return [];
    return data.rankings.arbitrage || [];
}

/**
 * Fetch Viral artists - highest growth velocity.
 */
export async function fetchViralArtists(): Promise<PowerIndexArtist[]> {
    const data = await fetchRankingsData();
    if (!data) return [];
    return data.rankings.viral || [];
}

// Cache for ALL unique artists (deduplicated)
let allArtistsCache: PowerIndexArtist[] | null = null;

/**
 * Simple Levenshtein distance for typo tolerance
 * Returns true if strings are "close enough" (edit distance <= threshold)
 */
function isCloseMatch(str1: string, str2: string, threshold: number = 2): boolean {
    if (Math.abs(str1.length - str2.length) > threshold) return false;
    if (str1 === str2) return true;
    if (str1.length < 3 || str2.length < 3) return str1 === str2;

    // Quick check: do they share significant overlap?
    const shorter = str1.length < str2.length ? str1 : str2;
    const longer = str1.length < str2.length ? str2 : str1;

    // Check if shorter is a substantial substring
    if (longer.includes(shorter)) return true;

    // Check prefix match (handles "arianna" vs "ariana")
    const prefixLen = Math.min(3, shorter.length);
    if (shorter.slice(0, prefixLen) !== longer.slice(0, prefixLen)) return false;

    // Simple character-by-character comparison with tolerance
    let mismatches = 0;
    for (let i = 0; i < shorter.length; i++) {
        if (shorter[i] !== longer[i]) mismatches++;
        if (mismatches > threshold) return false;
    }
    return true;
}

/**
 * Fetch a single artist from iTunes API dynamically.
 * This ensures 100% coverage even if the artist isn't in our rankings.
 */
export async function fetchArtistFromiTunes(query: string): Promise<PowerIndexArtist | null> {
    try {
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=musicArtist&limit=1`);
        if (!response.ok) return null;

        const data = await response.json();
        if (!data.results || data.results.length === 0) return null;

        const artist = data.results[0];

        // Fetch artwork from their top album
        const albumResponse = await fetch(`https://itunes.apple.com/lookup?id=${artist.artistId}&entity=album&limit=1`);
        let avatarUrl = null;
        if (albumResponse.ok) {
            const albumData = await albumResponse.json();
            const album = albumData.results.find((r: any) => r.wrapperType === 'collection');
            if (album) {
                avatarUrl = album.artworkUrl100.replace('100x100', '600x600');
            }
        }

        // Return a PowerIndexArtist compatible object
        return {
            id: artist.artistId.toString(),
            name: artist.artistName,
            genre: artist.primaryGenreName,
            country: 'Global',
            city: null,
            spotify_id: artist.artistId.toString(), // Use iTunes ID as fallback
            label_name: 'Independent',
            is_independent: true,
            avatar_url: avatarUrl,
            tiktok_handle: null,
            instagram_handle: null,
            twitter_handle: null,
            youtube_channel: null,
            monthlyListeners: 0,
            tiktokFollowers: 0,
            instagramFollowers: 0,
            youtubeSubscribers: 0,
            twitterFollowers: 0,
            powerScore: 50,
            conversionScore: 50,
            arbitrageSignal: 0,
            growthVelocity: 0,
            status: 'Stable',
            rank: 0,
            chartRank: 0,
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        console.error('iTunes search failed:', error);
        return null;
    }
}

/**
 * Search ALL artists across all categories.
 */
export async function searchAllArtists(query: string): Promise<PowerIndexArtist[]> {
    const data = await fetchRankingsData();
    if (!data || !query.trim()) return [];

    // 1. Build the cache if it doesn't exist
    if (!allArtistsCache) {
        const allArtistsMap = new Map<string, PowerIndexArtist>();

        // Add main rankings
        Object.values(data.rankings).forEach(categoryArtists => {
            if (Array.isArray(categoryArtists)) {
                categoryArtists.forEach(artist => {
                    if (artist && artist.id && !allArtistsMap.has(artist.id)) {
                        allArtistsMap.set(artist.id, artist);
                    }
                });
            }
        });

        // Also add Old School legends to the search index
        try {
            const osResponse = await fetch('/oldschool.json');
            if (osResponse.ok) {
                const osData = await osResponse.json();
                if (osData.artists) {
                    osData.artists.forEach((artist: any) => {
                        const id = artist.id || `os-${artist.name.toLowerCase().replace(/\s+/g, '-')}`;
                        if (!allArtistsMap.has(id)) {
                            allArtistsMap.set(id, {
                                ...artist,
                                id: id,
                                spotify_id: artist.sources?.spotify?.split('/')?.pop() || id,
                                powerScore: artist.powerScore || 999
                            } as PowerIndexArtist);
                        }
                    });
                }
            }
        } catch (e) {
            console.error('Failed to index oldschool artists', e);
        }

        allArtistsCache = Array.from(allArtistsMap.values());
        console.log(`[STELAR] Search Index Built: ${allArtistsCache.length} unique artists.`);
    }

    const normalizedQuery = query.toLowerCase().trim();
    const strippedQuery = normalizedQuery.replace(/[^a-z0-9]/g, '');
    const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 1);

    // 2. Filter with enhanced matching
    const matches = (allArtistsCache || []).filter(artist => {
        if (!artist.name) return false;

        const nameLower = artist.name.toLowerCase();
        const nameStripped = nameLower.replace(/[^a-z0-9]/g, '');
        const nameWords = nameLower.split(/\s+/);

        if (nameLower.includes(normalizedQuery)) return true;
        if (nameStripped.includes(strippedQuery) || strippedQuery.includes(nameStripped)) return true;

        for (const queryWord of queryWords) {
            for (const nameWord of nameWords) {
                if (isCloseMatch(queryWord, nameWord, 2)) return true;
            }
        }

        if (artist.genre?.toLowerCase().includes(normalizedQuery)) return true;
        if (artist.country?.toLowerCase().includes(normalizedQuery)) return true;

        return false;
    });

    // 3. If no local matches, fall back to iTunes dynamic search
    if (matches.length === 0 && query.length > 2) {
        const dynamicArtist = await fetchArtistFromiTunes(query);
        if (dynamicArtist) return [dynamicArtist];
    }

    // 4. Sort by relevance
    matches.sort((a, b) => {
        const aNameLower = a.name.toLowerCase();
        const bNameLower = b.name.toLowerCase();

        const aExact = aNameLower.startsWith(normalizedQuery) ? 3 :
            aNameLower.includes(normalizedQuery) ? 2 : 0;
        const bExact = bNameLower.startsWith(normalizedQuery) ? 3 :
            bNameLower.includes(normalizedQuery) ? 2 : 0;

        if (aExact !== bExact) return bExact - aExact;
        return (b.powerScore || 0) - (a.powerScore || 0);
    });

    return matches.slice(0, 50);
}

/**
 * Get a single artist by ID.
 */
export async function getArtistById(id: string): Promise<PowerIndexArtist | null> {
    const data = await fetchRankingsData();
    if (!data) return null;

    // Check rankings
    for (const cat of Object.values(data.rankings)) {
        if (Array.isArray(cat)) {
            const found = cat.find(a => a.id === id);
            if (found) return found;
        }
    }

    // Check cache (includes oldschool)
    if (allArtistsCache) {
        const found = allArtistsCache.find(a => a.id === id);
        if (found) return found;
    }

    // Fallback to iTunes lookup if ID is numeric
    if (/^\d+$/.test(id)) {
        try {
            const res = await fetch(`https://itunes.apple.com/lookup?id=${id}&entity=musicArtist`);
            if (res.ok) {
                const itunesData = await res.json();
                if (itunesData.results?.[0]) {
                    return fetchArtistFromiTunes(itunesData.results[0].artistName);
                }
            }
        } catch (e) { }
    }

    return null;
}

/**
 * Get artists by label type.
 */
export async function fetchByLabelType(type: 'Major' | 'Indie'): Promise<PowerIndexArtist[]> {
    const data = await fetchRankingsData();
    if (!data) return [];
    return type === 'Major' ? data.rankings.major || [] : data.rankings.indie || [];
}

/**
 * Get all available categories.
 */
export function getCategories(): string[] {
    return [
        'global', 'pop', 'hip_hop', 'r_and_b', 'country', 'afrobeats',
        'latin', 'k_pop', 'indie', 'alternative', 'electronic',
        'major', 'independent', 'radar', 'arbitrage', 'viral'
    ];
}

/**
 * Get category display name.
 */
export function getCategoryDisplayName(key: string): string {
    const names: Record<string, string> = {
        'global': 'Global Top 200',
        'pop': 'Pop',
        'hip_hop': 'Hip Hop',
        'r_and_b': 'R&B',
        'country': 'Country',
        'afrobeats': 'Afrobeats',
        'latin': 'Latin',
        'k_pop': 'K-Pop',
        'indie': 'Indie',
        'alternative': 'Alternative',
        'electronic': 'Electronic',
        'major': 'Major Label',
        'independent': 'Independent',
        'radar': 'The Radar',
        'arbitrage': 'Arbitrage Signals',
        'viral': 'Viral'
    };
    return names[key] || key;
}

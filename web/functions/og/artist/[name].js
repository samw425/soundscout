/**
 * SoundScout Dynamic OG Image Generator
 * ======================================
 * Generates dynamic Open Graph images for artist profile sharing.
 * 
 * When someone shares: soundscout.pages.dev/artist/drake
 * The OG image will show Drake's profile info dynamically.
 */

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Check if this is an OG image request for an artist
        // Pattern: /og/artist/{artistName}
        if (url.pathname.startsWith('/og/artist/')) {
            const artistName = decodeURIComponent(url.pathname.replace('/og/artist/', ''));
            return generateArtistOGImage(artistName, env);
        }

        // For other requests, pass through to the static site
        return env.ASSETS.fetch(request);
    }
};

async function generateArtistOGImage(artistName, env) {
    // Fetch rankings data to get artist info
    const rankingsUrl = 'https://soundscout.pages.dev/rankings.json';

    try {
        const response = await fetch(rankingsUrl);
        const data = await response.json();

        // Search for artist across all categories
        let artist = null;
        for (const category of Object.values(data.rankings)) {
            const found = category.find(a =>
                a.name.toLowerCase() === artistName.toLowerCase() ||
                a.name.toLowerCase().includes(artistName.toLowerCase())
            );
            if (found) {
                artist = found;
                break;
            }
        }

        if (!artist) {
            // Return default OG image if artist not found
            return Response.redirect('https://soundscout.pages.dev/og-image.png', 302);
        }

        // Generate SVG-based OG image (1200x630)
        const svg = generateArtistSVG(artist);

        // Convert SVG to PNG using Cloudflare's image processing
        // For now, return SVG which works for most platforms
        return new Response(svg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=3600',
            }
        });

    } catch (error) {
        console.error('Error generating OG image:', error);
        return Response.redirect('https://soundscout.pages.dev/og-image.png', 302);
    }
}

function generateArtistSVG(artist) {
    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const statusColors = {
        'Viral': '#A855F7',
        'Breakout': '#FF3366',
        'Dominance': '#F59E0B',
        'Stable': '#64748B',
        'Conversion': '#22C55E'
    };

    const statusColor = statusColors[artist.status] || '#64748B';

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0A0A0F"/>
            <stop offset="100%" style="stop-color:#1A1A2E"/>
        </linearGradient>
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#FF3366"/>
            <stop offset="100%" style="stop-color:#A855F7"/>
        </linearGradient>
    </defs>
    
    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bgGrad)"/>
    
    <!-- Accent line -->
    <rect x="0" y="0" width="1200" height="4" fill="url(#accentGrad)"/>
    
    <!-- SoundScout Logo Area -->
    <text x="60" y="60" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" fill="#FF3366" letter-spacing="0.3em">SOUNDSCOUT</text>
    <text x="220" y="60" font-family="Inter, Arial, sans-serif" font-size="12" fill="#64748B" letter-spacing="0.2em">GLOBAL MUSIC</text>
    
    <!-- Artist Avatar Circle -->
    <circle cx="180" cy="315" r="120" fill="#1E1E2E" stroke="#334155" stroke-width="2"/>
    <text x="180" y="330" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="700" fill="#FF3366" text-anchor="middle">${artist.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</text>
    
    <!-- Artist Name -->
    <text x="340" y="260" font-family="Inter, Arial, sans-serif" font-size="52" font-weight="800" fill="#FFFFFF">${artist.name.toUpperCase()}</text>
    
    <!-- Genre & Country -->
    <text x="340" y="310" font-family="Inter, Arial, sans-serif" font-size="20" fill="#94A3B8">${artist.genre.toUpperCase()} • ${artist.country}</text>
    
    <!-- Status Badge -->
    <rect x="340" y="330" width="120" height="36" rx="18" fill="${statusColor}" opacity="0.2"/>
    <text x="400" y="355" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="700" fill="${statusColor}" text-anchor="middle">${artist.status.toUpperCase()}</text>
    
    <!-- Stats Row -->
    <g transform="translate(340, 400)">
        <!-- Monthly Listeners -->
        <text x="0" y="0" font-family="Inter, Arial, sans-serif" font-size="12" fill="#64748B" letter-spacing="0.1em">MONTHLY LISTENERS</text>
        <text x="0" y="35" font-family="JetBrains Mono, monospace" font-size="32" font-weight="700" fill="#FFFFFF">${formatNumber(artist.monthlyListeners)}</text>
        
        <!-- Power Score -->
        <text x="250" y="0" font-family="Inter, Arial, sans-serif" font-size="12" fill="#64748B" letter-spacing="0.1em">POWER SCORE</text>
        <text x="250" y="35" font-family="JetBrains Mono, monospace" font-size="32" font-weight="700" fill="#FF3366">${artist.powerScore}</text>
        
        <!-- Growth -->
        <text x="420" y="0" font-family="Inter, Arial, sans-serif" font-size="12" fill="#64748B" letter-spacing="0.1em">GROWTH</text>
        <text x="420" y="35" font-family="JetBrains Mono, monospace" font-size="32" font-weight="700" fill="#22C55E">+${artist.growthVelocity.toFixed(1)}%</text>
        
        <!-- Conversion -->
        <text x="600" y="0" font-family="Inter, Arial, sans-serif" font-size="12" fill="#64748B" letter-spacing="0.1em">CONVERSION</text>
        <text x="600" y="35" font-family="JetBrains Mono, monospace" font-size="32" font-weight="700" fill="#FFFFFF">${artist.conversionScore.toFixed(1)}%</text>
    </g>
    
    <!-- Bottom Bar -->
    <rect x="0" y="580" width="1200" height="50" fill="#0D0D12"/>
    <text x="60" y="612" font-family="Inter, Arial, sans-serif" font-size="14" fill="#64748B">soundscout.pages.dev</text>
    <text x="1140" y="612" font-family="Inter, Arial, sans-serif" font-size="14" fill="#64748B" text-anchor="end">Rank #${artist.rank} Globally</text>
</svg>`;
}

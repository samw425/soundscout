import { ImageResponse } from 'workers-og';

/**
 * STELAR OG Image Generator
 * Supports:
 * - Artist pages (?name=Artist&image=...)
 * - Track pages (?type=track&artist=Artist&song=SongName)
 */

export async function onRequest(context) {
    const { request } = context;
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type') || 'artist';
    const name = searchParams.get('name') || 'STELAR';
    const image = searchParams.get('image');
    const artist = searchParams.get('artist') || 'Unknown Artist';
    const song = searchParams.get('song') || 'Unknown Track';

    try {
        // Track-specific OG Image
        if (type === 'track') {
            return new ImageResponse(
                `<div style="display:flex;flex-direction:column;width:1200px;height:630px;background:linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);font-family:-apple-system, BlinkMacSystemFont, sans-serif;position:relative;overflow:hidden;justify-content:center;align-items:center;padding:60px">
                    
                    <!-- Play Button Circle -->
                    <div style="display:flex;width:120px;height:120px;border-radius:60px;background:linear-gradient(135deg, #FF4500 0%, #FF6B35 100%);justify-content:center;align-items:center;margin-bottom:40px;box-shadow:0 20px 60px rgba(255,69,0,0.4)">
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                    
                    <!-- Song Name -->
                    <div style="display:flex;color:white;font-size:72px;font-weight:900;letter-spacing:-0.03em;text-align:center;margin-bottom:16px;text-transform:uppercase">
                        ${song.length > 25 ? song.substring(0, 22) + '...' : song}
                    </div>
                    
                    <!-- Artist Name -->
                    <div style="display:flex;color:#888;font-size:32px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase">
                        by ${artist}
                    </div>
                    
                    <!-- STELAR Branding -->
                    <div style="display:flex;position:absolute;bottom:40px;right:60px;color:#555;font-size:18px;font-weight:900;letter-spacing:0.2em;font-family:Courier New, monospace">
                        STELAR
                    </div>
                    
                    <!-- Listen on STELAR CTA -->
                    <div style="display:flex;position:absolute;bottom:40px;left:60px;color:#555;font-size:14px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase">
                        Listen on STELAR
                    </div>
                </div>`,
                { width: 1200, height: 630 }
            );
        }

        // Default: Artist OG Image
        return new ImageResponse(
            `<div style="display:flex;flex-direction:row;width:1200px;height:630px;background:#000000;font-family:Times New Roman, serif;position:relative;overflow:hidden">
                ${image ? `
                <!-- Artist Image (Left Side - 45%) -->
                <div style="display:flex;width:500px;height:630px;position:relative;overflow:hidden;background:#111">
                    <img src="${image}" style="width:100%;height:100%;object-fit:cover" />
                </div>
                ` : ''}

                <!-- Content (Right Side - 55%) -->
                <div style="display:flex;flex-direction:column;flex:1;padding:60px 80px;justify-content:space-between;align-items:center;z-index:10;text-align:center">
                    
                    <!-- Branding Top -->
                    <div style="display:flex;flex-direction:column;align-items:center;margin-top:40px">
                        <span style="color:white;font-size:60px;font-weight:900;letter-spacing:0.1em;font-family:Courier New, monospace;text-transform:uppercase">STELAR</span>
                        
                        <div style="display:flex;color:#555;font-size:16px;font-weight:bold;letter-spacing:0.3em;text-transform:uppercase;margin-top:30px;font-family:sans-serif">
                            TRACK THE TOP. DISCOVER THE NEXT.
                        </div>
                    </div>

                    <!-- Artist Name (Center/Bottom) -->
                    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1">
                        <div style="display:flex;color:white;font-size:110px;font-weight:900;letter-spacing:-0.03em;line-height:0.9;text-transform:uppercase;text-align:center;text-shadow:0 0 40px rgba(255,255,255,0.1)">
                            ${name}
                        </div>
                    </div>
                </div>
            </div>`,
            { width: 1200, height: 630 }
        );
    } catch (e) {
        console.error("OG Error:", e);
        // Fallback to static image
        return Response.redirect('https://stelarmusic.pages.dev/og-image.png', 302);
    }
}


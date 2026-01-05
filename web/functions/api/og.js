import { ImageResponse } from 'workers-og';

/**
 * STELAR OG Image Generator
 * Matches branding: Dark background, orange icon, white text
 */

export async function onRequest(context) {
    const { request } = context;
    const { searchParams } = new URL(request.url);

    const name = searchParams.get('name') || 'STELAR';
    const image = searchParams.get('image');

    try {
        return new ImageResponse(
            `<div style="display:flex;flex-direction:row;width:1200px;height:630px;background:#050505;font-family:sans-serif;position:relative;overflow:hidden">
                <!-- Background Glow -->
                <div style="display:flex;position:absolute;top:-100px;right:-100px;width:500px;height:500px;background:rgba(255,69,0,0.15);border-radius:500px;filter:blur(100px)"></div>
                
                ${image ? `
                <!-- Artist Image -->
                <div style="display:flex;width:450px;height:630px;position:relative;overflow:hidden">
                    <img src="${image}" style="width:100%;height:100%;object-fit:cover" />
                    <div style="display:flex;position:absolute;inset:0;background:linear-gradient(to right, transparent 0%, #050505 100%)"></div>
                </div>
                ` : ''}

                <!-- Content -->
                <div style="display:flex;flex-direction:column;flex:1;padding:80px;justify-content:center;z-index:10">
                    <!-- Logo -->
                    <div style="display:flex;align-items:center;margin-bottom:50px">
                        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#FF4500" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="2" fill="#FF4500"></circle>
                            <path d="M16.24 7.76a6 6 0 0 1 0 8.49"></path>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                            <path d="M7.76 16.24a6 6 0 0 1 0-8.49"></path>
                            <path d="M4.93 19.07a10 10 0 0 1 0-14.14"></path>
                        </svg>
                        <span style="color:white;font-size:56px;font-weight:900;letter-spacing:0.05em;margin-left:20px">STELAR</span>
                    </div>
                    <div style="display:flex;color:#666;font-size:14px;font-weight:bold;letter-spacing:0.4em;text-transform:uppercase;margin-bottom:40px;margin-left:76px">
                        TRACK THE TOP. DISCOVER THE NEXT.
                    </div>

                    <!-- Artist Name -->
                    <div style="display:flex;color:white;font-size:90px;font-weight:900;letter-spacing:-0.02em;line-height:0.9;text-transform:uppercase;max-width:600px">${name}</div>
                </div>
            </div>`,
            { width: 1200, height: 630 }
        );
    } catch (e) {
        console.error("OG Error:", e);
        return Response.redirect('https://stelarmusic.pages.dev/og-image.png', 302);
    }
}

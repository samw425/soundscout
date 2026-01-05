import { useState, useEffect } from 'react';
import { ChevronDown, Radio } from 'lucide-react';

interface LandingPageProps {
    onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-[#050505] text-white flex flex-col font-sans">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF4500]/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/2 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-soft-light"></div>
            </div>

            {/* Content */}
            <div className={`relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>

                {/* Logo Lockup - Matching Reference */}
                <div className="mb-16 flex flex-col items-center">
                    <div className="flex items-center gap-5 mb-3">
                        <Radio className="w-16 h-16 text-[#FF4500] drop-shadow-[0_0_15px_rgba(255,69,0,0.5)]" />
                        <span className="text-6xl md:text-8xl font-black tracking-tight text-white">STELAR</span>
                    </div>
                    <span className="text-sm uppercase tracking-[0.4em] text-slate-500 font-bold">
                        TRACK THE TOP. DISCOVER THE NEXT.
                    </span>
                </div>

                {/* Enter Button */}
                <button
                    onClick={onEnter}
                    className="group flex flex-col items-center gap-5 transition-all focus:outline-none"
                    aria-label="Enter Site"
                >
                    <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-[#FF4500]/10 group-hover:border-[#FF4500]/30 transition-all">
                        <ChevronDown className="w-7 h-7 text-slate-500 group-hover:text-[#FF4500] animate-bounce" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-slate-600 group-hover:text-white transition-colors">Enter Site</span>
                </button>

                {/* Status */}
                <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                    <div className="flex items-center gap-3 text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em]">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        SYSTEM ONLINE
                    </div>
                </div>
            </div>
        </div>
    );
}

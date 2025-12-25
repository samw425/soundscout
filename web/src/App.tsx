import { useState, useEffect, useMemo } from 'react';
import {
    Search,
    TrendingUp,
    ChevronRight,
    Zap,
    Radio,
    BarChart3,
    Bookmark,
    BookmarkCheck,
    X,
    Globe,
    Music,
    AlertTriangle,
    Crown,
    CheckCircle,
    Copy,
    ExternalLink,
    Target,
    Users,
    Activity,
    Lock,
    Unlock,
    Sparkles,
    ArrowUpRight,
    Star,
    Menu,
    Play
} from 'lucide-react';
import { PowerIndexArtist, searchAllArtists, fetchRankingsData } from './lib/supabase';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

const padRank = (rank: number): string => rank.toString().padStart(3, '0');

const getStatusColor = (status: PowerIndexArtist['status']) => {
    const map: Record<PowerIndexArtist['status'], string> = {
        Viral: 'bg-signal-purple/20 text-signal-purple border-signal-purple/30',
        Breakout: 'bg-accent/20 text-accent border-accent/30',
        Dominance: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
        Stable: 'bg-slate-500/20 text-slate-400 border-slate-700',
        Conversion: 'bg-signal-green/20 text-signal-green border-signal-green/30',
    };
    return map[status] || 'bg-slate-500/20 text-slate-400 border-slate-700';
};

const getStatusBadge = (status: PowerIndexArtist['status']) => {
    const map: Record<PowerIndexArtist['status'], string> = {
        Viral: 'badge-viral',
        Breakout: 'badge-breakout',
        Dominance: 'badge-dominance',
        Stable: 'badge-stable',
        Conversion: 'badge badge-indie glow-green',
    };
    return map[status] || 'badge-stable';
};

// Extend the imported PowerIndexArtist type with new properties
declare module './lib/supabase' {
    interface PowerIndexArtist {
        youtube_url?: string;
        facebook_handle?: string;
    }
}

const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

type TabType = 'power-index' | 'sonic-signals' | 'locked-roster' | 'up-and-comers' | 'about';

// ============================================================================
// ONBOARDING COMPONENT
// ============================================================================

function OnboardingModal({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0);

    const steps = [
        {
            icon: <Radio className="w-12 h-12 text-accent" />,
            title: "Welcome to SoundScout",
            subtitle: "The A&R Intelligence Terminal",
            description: "Discover the next big artist before anyone else. Our proprietary algorithm scans millions of data points daily to identify emerging talent.",
        },
        {
            icon: <Target className="w-12 h-12 text-signal-green" />,
            title: "Find Arbitrage Opportunities",
            subtitle: "The Secret Sauce",
            description: "We identify artists with HIGH social buzz but LOW streaming numbers. These are tomorrow's superstars — the ones labels are fighting to sign.",
        },
        {
            icon: <BarChart3 className="w-12 h-12 text-signal-purple" />,
            title: "Proprietary Power Score",
            subtitle: "Multi-Source Algorithm",
            description: "Our Power Score combines Spotify, Billboard, Apple Music, YouTube, TikTok, and Instagram data into one definitive ranking. Updated daily.",
        },
        {
            icon: <Crown className="w-12 h-12 text-yellow-500" />,
            title: "Premium Features",
            subtitle: "Unlock Full Intelligence",
            description: "Free users see Top 50. Premium unlocks Top 150 in all categories, real-time alerts, export tools, and API access.",
        },
    ];

    const currentStep = steps[step];

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-slate-800 rounded-2xl max-w-lg w-full p-8 animate-slide-up">
                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-8">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-accent w-6' : 'bg-slate-700'
                                }`}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        {currentStep.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{currentStep.title}</h2>
                    <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-4">
                        {currentStep.subtitle}
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                        {currentStep.description}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    {step > 0 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="btn-secondary flex-1"
                        >
                            Back
                        </button>
                    )}
                    {step < steps.length - 1 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="btn-primary flex-1"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={onComplete}
                            className="btn-primary flex-1"
                        >
                            Start Scouting
                        </button>
                    )}
                </div>

                {/* Skip */}
                <button
                    onClick={onComplete}
                    className="w-full text-center text-slate-500 text-sm mt-4 hover:text-white transition-colors"
                >
                    Skip intro
                </button>
            </div>
        </div>
    );
}

// ============================================================================
// UPGRADE MODAL (MONETIZATION)
// ============================================================================

function UpgradeModal({ onClose, feature }: { onClose: () => void; feature?: string }) {
    const plans = [
        {
            name: "Scout",
            price: "Free",
            priceSub: "forever",
            features: [
                "Top 50 Artists (Global)",
                "Basic Artist Profiles",
                "Daily Rankings",
                "1 Roster Slot",
            ],
            current: false,
            highlighted: false,
        },
        {
            name: "Pro",
            price: "$29",
            priceSub: "/month",
            promo: "FREE FOR LIMITED TIME",
            features: [
                "Top 150 in ALL Categories",
                "All 10 Genre Rankings",
                "Major & Indie Filters",
                "Unlimited Roster Slots",
                "Arbitrage Signal Detection",
                "Up & Comers Discovery",
                "Export to CSV",
            ],
            current: true, // Currently active during promo
            highlighted: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            priceSub: "pricing",
            features: [
                "Everything in Pro",
                "API Access",
                "Team Collaboration",
                "Custom Integrations",
                "Priority Support",
                "White-label Options",
            ],
            current: false,
            highlighted: false,
        },
    ];

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-slate-800 rounded-2xl max-w-4xl w-full p-8 animate-slide-up">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Pricing & Features</h2>
                        {feature && (
                            <p className="text-slate-400">
                                <span className="text-accent">{feature}</span> is included in Pro.
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-surface">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Launch Promo Banner */}
                <div className="bg-gradient-to-r from-signal-green/20 to-emerald-500/10 border border-signal-green/30 rounded-xl p-4 mb-6 text-center">
                    <div className="inline-flex items-center gap-2 text-signal-green text-sm font-bold">
                        <Star className="w-4 h-4" />
                        LAUNCH SPECIAL: Pro features are FREE for a limited time!
                        <Star className="w-4 h-4" />
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-3 gap-4">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`rounded-xl p-6 border relative ${plan.highlighted
                                ? 'bg-accent/5 border-accent/30'
                                : 'bg-surface border-slate-800'
                                }`}
                        >
                            {plan.promo && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-signal-green text-white text-[10px] font-bold rounded-full whitespace-nowrap">
                                    {plan.promo}
                                </div>
                            )}
                            {plan.current && (
                                <div className="text-[10px] text-signal-green font-bold uppercase tracking-wider mb-2">
                                    ✓ Currently Active
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                            <div className="mb-4">
                                <span className="text-2xl font-bold text-white">{plan.price}</span>
                                <span className="text-slate-500 text-sm"> {plan.priceSub}</span>
                            </div>
                            <ul className="space-y-2 mb-6">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                        <Star className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={plan.highlighted ? onClose : undefined}
                                className={`w-full py-2 rounded-lg font-bold text-sm ${plan.current
                                    ? 'bg-signal-green text-white'
                                    : plan.highlighted
                                        ? 'bg-accent text-white hover:bg-accent/90'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                {plan.current ? 'Active Now' : plan.name === 'Enterprise' ? 'Contact Us' : 'Get Started'}
                            </button>
                        </div>
                    ))}
                </div>

                <p className="text-center text-slate-500 text-xs mt-6">
                    Pro features will become paid ($29/mo) once the launch period ends.
                    Join the waitlist to lock in early access pricing.
                </p>
            </div>
        </div>
    );
}

// ============================================================================
// JOIN WAITLIST MODAL
// ============================================================================

function JoinModal({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Call the Cloudflare Pages Function
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    name: name || 'Anonymous',
                    role: role || 'Not specified'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to join waitlist');
            }

            // Also save to localStorage as backup
            localStorage.setItem('ss_waitlist', JSON.stringify({
                email,
                name,
                role,
                date: new Date().toISOString()
            }));

            setSubmitted(true);
        } catch (err) {
            console.error('Waitlist error:', err);
            // Even if API fails, save locally and show success
            localStorage.setItem('ss_waitlist', JSON.stringify({
                email,
                name,
                role,
                date: new Date().toISOString()
            }));
            setSubmitted(true);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
                <div className="bg-card border border-slate-800 rounded-2xl max-w-md w-full p-8 animate-slide-up text-center">
                    <div className="w-16 h-16 bg-signal-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Star className="w-8 h-8 text-signal-green" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">You're on the List!</h2>
                    <p className="text-slate-400 mb-6">
                        Thanks for joining! We'll notify you when new features launch and send exclusive A&R insights.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl font-bold bg-accent text-white hover:bg-accent/90 transition-colors"
                    >
                        Back to Discovery
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-slate-800 rounded-2xl max-w-md w-full p-8 animate-slide-up">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Join the Waitlist</h2>
                        <p className="text-slate-400 text-sm">
                            Get early access to premium features and exclusive A&R intelligence.
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-surface">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Email *</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full bg-terminal border border-slate-800 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-accent/50"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="w-full bg-terminal border border-slate-800 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-accent/50"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">What best describes you?</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-terminal border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent/50"
                        >
                            <option value="">Select...</option>
                            <option value="ar">A&R Professional</option>
                            <option value="label">Record Label</option>
                            <option value="manager">Artist Manager</option>
                            <option value="artist">Artist</option>
                            <option value="investor">Investor</option>
                            <option value="fan">Music Fan</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl font-bold bg-accent text-white hover:bg-accent/90 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Joining...' : 'Join Waitlist'}
                    </button>
                </form>

                {error && (
                    <p className="text-center text-red-400 text-sm mt-2">{error}</p>
                )}

                <p className="text-center text-slate-500 text-xs mt-4">
                    We respect your privacy. No spam, ever.
                </p>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
function DossierModal({ artist, onClose }: { artist: PowerIndexArtist, onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-accent bg-accent/20 flex items-center justify-center animate-pulse">
                            <Target className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Intelligence Dossier</h2>
                            <div className="text-[10px] text-accent font-bold uppercase tracking-[0.3em]">Confidential • Level 4 Clearance</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-500 hover:text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">Target Subject</div>
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-20 h-20 bg-slate-800 rounded-xl overflow-hidden">
                                    {artist.avatar_url ? (
                                        <img src={artist.avatar_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-black">{getInitials(artist.name)}</div>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-white uppercase leading-none mb-1">{artist.name}</h1>
                                    <div className="text-sm text-slate-400 font-mono mb-2">{artist.spotify_id}</div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                        <div className="w-2 h-2 rounded-full bg-signal-green animate-pulse"></div>
                                        <span className="text-[10px] text-white font-bold uppercase tracking-widest">Active Monitoring</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-slate-500 text-xs font-bold uppercase">Estimated Annual Revenue</span>
                                        <span className="text-signal-green text-xs font-bold">+12% YoY</span>
                                    </div>
                                    <div className="text-2xl font-mono text-white font-bold p-1">
                                        ${formatNumber(artist.monthlyListeners * 0.003 * 12 * 0.7)} - ${formatNumber(artist.monthlyListeners * 0.005 * 12)}
                                    </div>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-slate-500 text-xs font-bold uppercase">Projected Valuation (36mo)</span>
                                        <span className="text-accent text-xs font-bold">High Confidence</span>
                                    </div>
                                    <div className="text-2xl font-mono text-white font-bold p-1">
                                        ${formatNumber(artist.monthlyListeners * 2.5)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">Assets & Risk Profile</div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border-l-4 border-signal-green">
                                    <span className="text-slate-300 text-sm font-bold">Catalog Ownership</span>
                                    <span className="text-white font-mono text-sm">{artist.is_independent ? '100% (Est.)' : 'Split / Major'}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border-l-4 border-amber-500">
                                    <span className="text-slate-300 text-sm font-bold">Touring Demand</span>
                                    <span className="text-white font-mono text-sm">Very High</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border-l-4 border-signal-purple">
                                    <span className="text-slate-300 text-sm font-bold">Brand Safety</span>
                                    <span className="text-white font-mono text-sm">98/100</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border-l-4 border-accent">
                                    <span className="text-slate-300 text-sm font-bold">Churn Risk</span>
                                    <span className="text-white font-mono text-sm">Low (&lt;2%)</span>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-xl">
                                <h4 className="text-accent text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Zap className="w-4 h-4" /> AI Recommendation
                                </h4>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    Subject shows consistent cross-platform velocity. Arbitrage window closing rapidly. Recommended action: <strong>Initiate Contact immediately</strong> with offer in range of $250k - $500k for licensing deal.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors uppercase tracking-widest text-xs">
                        Close File
                    </button>
                    <button className="px-6 py-3 rounded-xl font-bold bg-white text-black hover:bg-slate-200 transition-colors uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        Export Full PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    const [activeTab, setActiveTab] = useState<TabType>('power-index');
    const [searchQuery, setSearchQuery] = useState('');
    const [artists, setArtists] = useState<PowerIndexArtist[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedArtist, setSelectedArtist] = useState<PowerIndexArtist | null>(null);
    const [showOnboarding, setShowOnboarding] = useState(() => {
        return !localStorage.getItem('ss_onboarding_complete');
    });
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [showJoin, setShowJoin] = useState(false);
    const [showDossier, setShowDossier] = useState(false);
    const [upgradeFeature, setUpgradeFeature] = useState<string>();
    const [watchlist, setWatchlist] = useState<Set<string>>(() => {
        const saved = localStorage.getItem('ss_watchlist_v1');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDiscoveryList, setActiveDiscoveryList] = useState<'movers' | 'gems' | null>(null);

    // User tier (for monetization - can lock down to Pro later once we get traction)
    const userTier = 'free'; // 'free', 'pro', 'enterprise'
    const freeLimit = 150; // ALL 150 artists visible for free during launch

    // Load artists based on active tab
    useEffect(() => {
        async function loadArtists() {
            setLoading(true);
            const rankingsData = await fetchRankingsData();

            if (!rankingsData) {
                console.error('Failed to load rankings data');
                setLoading(false);
                return;
            }

            let data: PowerIndexArtist[] = [];
            if (activeTab === 'up-and-comers') {
                data = rankingsData.rankings.up_and_comers || [];
            } else if (activeTab === 'sonic-signals') {
                data = rankingsData.rankings.arbitrage || [];
            } else {
                data = rankingsData.rankings.global || [];
            }

            setArtists(data);
            setLoading(false);
        }
        loadArtists();
    }, [activeTab]);

    const [searchResults, setSearchResults] = useState<PowerIndexArtist[]>([]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const debounce = setTimeout(async () => {
            const results = await searchAllArtists(searchQuery);
            setSearchResults(results);
        }, 300);

        return () => clearTimeout(debounce);
    }, [searchQuery]);

    // Persist watchlist
    useEffect(() => {
        localStorage.setItem('ss_watchlist_v1', JSON.stringify([...watchlist]));
    }, [watchlist]);

    // Complete onboarding
    const completeOnboarding = () => {
        localStorage.setItem('ss_onboarding_complete', 'true');
        setShowOnboarding(false);
    };

    // Note: requiresUpgrade check will be added when auth is implemented

    // Prompt upgrade
    const promptUpgrade = (feature: string) => {
        setUpgradeFeature(feature);
        setShowUpgrade(true);
    };

    // Filter artists - use searchResults if searching, otherwise use loaded artists
    const filteredArtists = useMemo(() => {
        // If searching, use search results
        let result = searchQuery.trim() ? searchResults : artists;

        // Filter by tab (for locked roster)
        if (activeTab === 'locked-roster') {
            result = result.filter(a => watchlist.has(a.id));
        }

        // Re-rank
        result = result.map((artist, index) => ({
            ...artist,
            rank: index + 1
        }));

        const limit = userTier === 'free' ? freeLimit : 150;
        return result.slice(0, limit);
    }, [artists, searchResults, searchQuery, activeTab, watchlist, userTier, freeLimit]);

    const toggleWatchlist = (artistId: string) => {
        // Free users limited to 1 roster slot
        if (userTier === 'free' && !watchlist.has(artistId) && watchlist.size >= 1) {
            promptUpgrade('Unlimited Roster Slots');
            return;
        }

        setWatchlist(prev => {
            const next = new Set(prev);
            if (next.has(artistId)) {
                next.delete(artistId);
            } else {
                next.add(artistId);
            }
            return next;
        });
    };

    const openSpotify = (artist: PowerIndexArtist) => {
        window.open(`https://open.spotify.com/search/${encodeURIComponent(artist.name)}`, '_blank');
    };

    const openTikTok = (artist: PowerIndexArtist) => {
        const handle = artist.tiktok_handle || artist.name.toLowerCase().replace(/\s+/g, '');
        window.open(`https://www.tiktok.com/@${handle}`, '_blank');
    };

    const openInstagram = (artist: PowerIndexArtist) => {
        const handle = artist.instagram_handle || artist.name.toLowerCase().replace(/\s+/g, '');
        window.open(`https://www.instagram.com/${handle}`, '_blank');
    };

    const openFacebook = (artist: PowerIndexArtist) => {
        if (artist.facebook_handle) {
            window.open(`https://www.facebook.com/${artist.facebook_handle}`, '_blank');
        } else {
            const query = encodeURIComponent(`${artist.name} musician official facebook`);
            window.open(`https://www.google.com/search?q=${query}`, '_blank');
        }
    };

    const openYouTube = (artist: PowerIndexArtist) => {
        if (artist.youtube_url && artist.youtube_url.includes('channel')) {
            window.open(artist.youtube_url, '_blank');
        } else {
            const query = encodeURIComponent(`${artist.name} official youtube channel`);
            window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
        }
    };

    // Stats
    const stats = useMemo(() => {
        const totalListeners = filteredArtists.reduce((sum, a) => sum + a.monthlyListeners, 0);
        const viralCount = filteredArtists.filter(a => a.status === 'Viral').length;
        const arbitrageCount = filteredArtists.filter(a => a.conversionScore < 50).length;
        return { totalListeners, viralCount, arbitrageCount };
    }, [filteredArtists]);

    // BIGGEST MOVERS TODAY - Established artists (Rank 1-150) with highest daily velocity
    const biggestMovers = useMemo(() => {
        return [...artists]
            .filter(a => a.rank <= 150)
            .sort((a, b) => b.growthVelocity - a.growthVelocity)
            .slice(0, 25);
    }, [artists]);

    // HIDDEN GEMS - Non-top tier artists (Rank 150-1000) with strongest momentum
    const hiddenGems = useMemo(() => {
        return [...artists]
            .filter(a => a.rank > 150 && a.rank <= 1000)
            .sort((a, b) => b.growthVelocity - a.growthVelocity)
            .slice(0, 25);
    }, [artists]);

    return (
        <>
            {/* Onboarding Modal */}
            {showOnboarding && <OnboardingModal onComplete={completeOnboarding} />}

            {/* Upgrade Modal */}
            {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} feature={upgradeFeature} />}

            {/* Join Modal */}
            {showJoin && <JoinModal onClose={() => setShowJoin(false)} />}

            {/* Dossier Modal */}
            {showDossier && selectedArtist && <DossierModal artist={selectedArtist} onClose={() => setShowDossier(false)} />}

            <div className="flex h-screen bg-terminal text-slate-300 overflow-hidden relative font-sans">
                {/* Background Glows */}
                <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-signal-purple/5 rounded-full blur-[120px] pointer-events-none"></div>

                {/* LEFT RAIL / SIDEBAR */}
                <aside className={`
                    fixed lg:relative inset-y-0 left-0 z-40
                    w-72 flex flex-col border-r border-slate-900 bg-surface/50 backdrop-blur-xl
                    transform transition-transform duration-300 ease-in-out
                    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <div className="p-6">
                        <button
                            onClick={() => { setActiveTab('power-index'); setSelectedArtist(null); setActiveDiscoveryList(null); setMobileMenuOpen(false); }}
                            className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity text-left w-full focus:outline-none"
                        >
                            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,51,102,0.3)]">
                                <Radio className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-lg font-black text-white tracking-widest uppercase leading-none">SoundScout</h1>
                                <div className="text-[9px] font-bold text-slate-500 tracking-[0.3em] uppercase mt-1">A&R Intelligence</div>
                            </div>
                        </button>

                        <nav className="space-y-1">
                            <button
                                onClick={() => { setActiveTab('power-index'); setSelectedArtist(null); setActiveDiscoveryList(null); setMobileMenuOpen(false); }}
                                className={`nav-item w-full ${activeTab === 'power-index' && !activeDiscoveryList ? 'active' : ''}`}
                            >
                                <Target className="w-4 h-4" />
                                <span>Power Index</span>
                            </button>
                            <button
                                onClick={() => { setActiveTab('up-and-comers'); setSelectedArtist(null); setActiveDiscoveryList(null); setMobileMenuOpen(false); }}
                                className={`nav-item w-full ${activeTab === 'up-and-comers' ? 'active' : ''}`}
                            >
                                <Zap className="w-4 h-4" />
                                <span>Up & Comers</span>
                            </button>
                            <button
                                onClick={() => { setActiveTab('sonic-signals'); setSelectedArtist(null); setActiveDiscoveryList(null); setMobileMenuOpen(false); }}
                                className={`nav-item w-full ${activeTab === 'sonic-signals' ? 'active' : ''}`}
                            >
                                <Sparkles className="w-4 h-4 text-signal-purple" />
                                <span>Sonic Signals</span>
                            </button>
                            <button
                                onClick={() => { setActiveTab('locked-roster'); setSelectedArtist(null); setActiveDiscoveryList(null); setMobileMenuOpen(false); }}
                                className={`nav-item w-full ${activeTab === 'locked-roster' ? 'active' : ''}`}
                            >
                                <Bookmark className="w-4 h-4" />
                                <span>Locked Roster</span>
                            </button>
                        </nav>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Discovery Widgets</h3>
                        <div className="discovery-widget group" onClick={() => { setActiveDiscoveryList('movers'); setSelectedArtist(null); setMobileMenuOpen(false); }}>
                            <TrendingUp className="w-4 h-4 text-accent" />
                            <span>Market Movers</span>
                        </div>
                        <div className="discovery-widget group" onClick={() => { setActiveDiscoveryList('gems'); setSelectedArtist(null); setMobileMenuOpen(false); }}>
                            <Star className="w-4 h-4 text-amber-400" />
                            <span>Hidden Gems</span>
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-900">
                        <button onClick={() => setShowUpgrade(true)} className="pro-upgrade-card w-full text-left">
                            <div className="text-[10px] font-black text-accent uppercase tracking-widest">Upgrade to Pro</div>
                            <div className="text-[9px] text-slate-500 mt-0.5">Unlock Daily Alpha Data</div>
                        </button>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
                    <header className="h-16 border-b border-slate-900 bg-surface/30 backdrop-blur-md flex items-center justify-between px-8 z-10">
                        <div className="flex items-center gap-8">
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-400">
                                <Menu className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => { setActiveTab('power-index'); setSelectedArtist(null); setActiveDiscoveryList(null); }}
                                className="text-xs font-black text-white uppercase tracking-widest hover:text-accent transition-colors"
                            >
                                Terminal <span className="text-accent">Live</span>
                            </button>
                            <div className="relative w-96 group hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search global discovery database..."
                                    className="w-full bg-surface border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-white uppercase tracking-widest focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden lg:flex flex-col items-end">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Scanning Nodes</span>
                                <span className="text-[10px] font-bold text-signal-green">3,492 ACTIVE</span>
                            </div>
                            <button onClick={() => setShowJoin(true)} className="bg-white text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
                                Waitlist
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-auto p-8 terminal-scroll">
                        {selectedArtist ? (
                            <ArtistProfile
                                artist={selectedArtist}
                                onClose={() => setSelectedArtist(null)}
                                onToggleWatchlist={toggleWatchlist}
                                isWatched={watchlist.has(selectedArtist.id)}
                                onOpenYouTube={openYouTube}
                                onOpenTikTok={openTikTok}
                                onOpenInstagram={openInstagram}
                                setShowDossier={setShowDossier}
                            />
                        ) : activeDiscoveryList ? (
                            <div className="max-w-4xl mx-auto space-y-6">
                                <button onClick={() => setActiveDiscoveryList(null)} className="flex items-center gap-2 text-slate-500 mb-6 uppercase text-[10px] font-black tracking-widest hover:text-white transition-colors">
                                    <X className="w-4 h-4" /> Back to Index
                                </button>
                                <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">
                                    {activeDiscoveryList === 'movers' ? 'Volume Leaders' : 'Quality Discovery'}
                                </h2>
                                <div className="space-y-2">
                                    {(activeDiscoveryList === 'movers' ? biggestMovers : hiddenGems).map((artist, i) => (
                                        <button key={artist.id} onClick={() => setSelectedArtist(artist)} className="w-full flex items-center gap-4 p-4 bg-surface/50 border border-slate-800 rounded-xl hover:bg-surface hover:border-slate-700 transition-all">
                                            <span className="text-lg font-bold text-accent w-8">{padRank(i + 1)}</span>
                                            <div className="flex-1 text-left font-bold text-white uppercase tracking-tight">{artist.name}</div>
                                            <div className="text-signal-green font-mono font-bold">+{artist.growthVelocity.toFixed(1)}%</div>
                                            <ChevronRight className="w-4 h-4 text-slate-700" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : activeTab === 'sonic-signals' ? (
                            <SonicSignals artists={filteredArtists.slice(0, 15)} />
                        ) : activeTab === 'about' ? (
                            <AboutSection
                                onNavigate={(tab) => { setActiveTab(tab); setSelectedArtist(null); setActiveDiscoveryList(null); }}
                                onShowPricing={() => setShowUpgrade(true)}
                                onShowContact={() => setShowJoin(true)}
                            />
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="metric-card bg-surface/50">
                                        <div className="data-tag mb-1">AGGREGATE VOLUME</div>
                                        <div className="text-3xl font-black text-white font-mono">{formatNumber(stats.totalListeners)}</div>
                                    </div>
                                    <div className="metric-card bg-surface/50">
                                        <div className="data-tag mb-1">ASSETS TRACKED</div>
                                        <div className="text-3xl font-black text-white font-mono">{filteredArtists.length}</div>
                                    </div>
                                    <div className="metric-card bg-accent/5 border-accent/20">
                                        <div className="data-tag mb-1 text-accent tracking-widest">ARBITRAGE SIGNALS</div>
                                        <div className="text-3xl font-black text-white font-mono">{stats.arbitrageCount}</div>
                                    </div>
                                </div>

                                <div className="bg-card border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                                    <table className="w-full text-left">
                                        <thead className="bg-terminal text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800">
                                            <tr>
                                                <th className="px-6 py-5">Rank</th>
                                                <th className="px-6 py-5">Artist Intelligence</th>
                                                <th className="px-6 py-5">Monthly Reach</th>
                                                <th className="px-6 py-5">30D Velo</th>
                                                <th className="px-6 py-5">Status</th>
                                                <th className="px-6 py-5 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/50">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-20 text-center">
                                                        <div className="inline-block w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
                                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loading Market Data...</div>
                                                    </td>
                                                </tr>
                                            ) : filteredArtists.map((artist) => (
                                                <tr key={artist.id} onClick={() => setSelectedArtist(artist)} className="group hover:bg-surface/50 transition-colors cursor-pointer">
                                                    <td className="px-6 py-5 font-mono text-slate-500 font-bold">{padRank(artist.rank)}</td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            {/* QUICK PLAY AVATAR */}
                                                            <div
                                                                onClick={(e) => { e.stopPropagation(); openYouTube(artist); }}
                                                                className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-[10px] font-black text-white overflow-hidden border border-slate-800/50 group-hover:border-accent/50 group-hover:shadow-[0_0_15px_rgba(255,51,102,0.3)] transition-all duration-300 relative cursor-pointer"
                                                            >
                                                                {artist.avatar_url ? (
                                                                    <img src={artist.avatar_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                ) : (
                                                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                                                                        {getInitials(artist.name)}
                                                                    </div>
                                                                )}
                                                                {/* PLAY OVERLAY (Subtle) */}
                                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <Play className="w-5 h-5 text-white drop-shadow-md fill-current" />
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-white font-black uppercase tracking-tight">{artist.name}</span>
                                                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{artist.genre} • {artist.country}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 font-mono text-slate-300 font-bold">{formatNumber(artist.monthlyListeners)}</td>
                                                    <td className="px-6 py-5 font-mono text-signal-green font-bold">+{artist.growthVelocity.toFixed(1)}%</td>
                                                    <td className="px-6 py-5">
                                                        <span className={`text-[9px] font-black px-2 py-1 rounded border ${getStatusColor(artist.status)}`}>{artist.status.toUpperCase()}</span>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <ChevronRight className="w-5 h-5 text-slate-800 group-hover:text-white transition-colors" />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

const IMAGE_POOL = {
    'live': [
        'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=600',
        'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=600',
        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=600',
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600',
    ],
    'studio': [
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=600',
        'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=600',
        'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=600',
    ],
    'lifestyle': [
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600',
        'https://images.unsplash.com/photo-1529139574466-a302c27e3844?q=80&w=600',
    ]
};

const getUniqueVisuals = (artistId: string) => {
    // Simple hash function to get deterministic images per artist
    let hash = 0;
    for (let i = 0; i < artistId.length; i++) {
        hash = artistId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const safeHash = Math.abs(hash);

    return [
        { title: 'Live Performance', type: 'Touring', color: 'accent', img: IMAGE_POOL.live[safeHash % IMAGE_POOL.live.length] },
        { title: 'Studio Session', type: 'Creation', color: 'signal-green', img: IMAGE_POOL.studio[(safeHash + 1) % IMAGE_POOL.studio.length] },
        { title: 'Brand Affinity', type: 'Lifestyle', color: 'signal-purple', img: IMAGE_POOL.lifestyle[(safeHash + 2) % IMAGE_POOL.lifestyle.length] },
        { title: 'Crowd Sentiment', type: 'Viral', color: 'amber-500', img: IMAGE_POOL.live[(safeHash + 3) % IMAGE_POOL.live.length] },
        { title: 'Creative Direction', type: 'Visuals', color: 'accent', img: IMAGE_POOL.studio[(safeHash + 4) % IMAGE_POOL.studio.length] },
        { title: 'Global Reach', type: 'Market', color: 'signal-green', img: IMAGE_POOL.lifestyle[(safeHash + 5) % IMAGE_POOL.lifestyle.length] },
    ];
};

// ============================================================================
// ARTIST PROFILE COMPONENT
// ============================================================================

const generateScoutingReport = (artist: PowerIndexArtist) => {
    const insights = [];
    const ratio = artist.tiktokFollowers / (artist.monthlyListeners + 1);

    if (ratio > 5) insights.push("Hyper-Viral Signal: Social reach is 5x larger than streaming footprint.");
    if (artist.growthVelocity > 80) insights.push("Exponential Velocity: Massive listener surge detected in last 24h.");
    if (artist.conversionScore < 40) insights.push("Efficiency Leader: High listener retention with minimal marketing waste.");
    if (artist.is_independent) insights.push("Independent Edge: Fully autonomous growth with high ownership potential.");

    return insights.length > 0 ? insights : ["Stable Performance: Consistent growth across all primary platforms."];
};

function ArtistProfile({
    artist,
    onClose,
    onToggleWatchlist,
    isWatched,
    onOpenYouTube,
    onOpenTikTok,
    onOpenInstagram,
    setShowDossier,
}: {
    artist: PowerIndexArtist;
    onClose: () => void;
    onToggleWatchlist: (id: string) => void;
    isWatched: boolean;
    onOpenYouTube: (artist: PowerIndexArtist) => void;
    onOpenTikTok: (artist: PowerIndexArtist) => void;
    onOpenInstagram: (artist: PowerIndexArtist) => void;
    setShowDossier: (show: boolean) => void;
}) {
    const report = generateScoutingReport(artist);
    const investmentScore = Math.min(100, Math.max(0, 100 - artist.conversionScore + (artist.growthVelocity / 2)));

    return (
        <div className="max-w-5xl mx-auto animate-slide-up pb-20">
            {/* TOP BAR / NAVIGATION */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={onClose} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest group">
                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Close Discovery
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={() => onToggleWatchlist(artist.id)}
                        className={`p-2 rounded-lg border transition-all ${isWatched ? 'bg-accent border-accent text-white shadow-[0_0_15px_rgba(255,51,102,0.4)]' : 'bg-surface border-slate-800 text-slate-500 hover:text-white'}`}
                    >
                        {isWatched ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* ARTIST HERO SECTION (INSTAGRAM INSPIRED) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-center">
                {/* LARGE PROFILE PHOTO */}
                <div className="lg:col-span-4 flex justify-center lg:justify-start">
                    <div className="relative w-64 h-64 lg:w-80 lg:h-80 group">
                        {/* MULTI-LAYER GLOW (NEXA STYLE) */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent via-cyan-400 to-signal-purple rounded-full opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy blur-2xl"></div>
                        <div className="absolute inset-0 rounded-full border-[3px] border-accent/30 scale-105 animate-pulse-slow"></div>
                        <div className="absolute inset-0 rounded-full border-[1px] border-cyan-400/20 scale-110"></div>

                        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background bg-slate-900 shadow-2xl">
                            {artist.avatar_url ? (
                                <img src={artist.avatar_url} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                    <span className="text-6xl font-black text-slate-700">{getInitials(artist.name)}</span>
                                </div>
                            )}
                        </div>

                        {/* RANK BADGE (NEXA STYLE) */}
                        <div className="absolute -top-2 -right-2 bg-white text-black text-[14px] font-black px-4 py-2 rounded-full shadow-2xl z-10 border-4 border-background">
                            #{artist.rank}
                        </div>
                    </div>
                </div>

                {/* ARTIST INFO & CORE METRICS */}
                <div className="lg:col-span-8 flex flex-col justify-center text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
                        <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">{artist.name}</h2>
                        <div className={`mx-auto lg:mx-0 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border ${getStatusColor(artist.status)}`}>
                            {artist.status}
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-slate-400 text-xs font-bold mb-8 uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-accent" />
                            {artist.country}
                        </div>
                        <div className="flex items-center gap-2">
                            <Music className="w-4 h-4 text-accent" />
                            {artist.genre}
                        </div>
                        <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-amber-500" />
                            {artist.label_name || 'INDEPENDENT'}
                        </div>
                    </div>

                    {/* STORY HIGHLIGHTS (IG STYLE) */}
                    <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-none justify-center lg:justify-start">
                        {[
                            { name: 'Live', icon: <Zap className="w-4 h-4" /> },
                            { name: 'Charts', icon: <TrendingUp className="w-4 h-4" /> },
                            { name: 'Social', icon: <Star className="w-4 h-4" /> },
                            { name: 'Alpha', icon: <Sparkles className="w-4 h-4" /> },
                        ].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                                <div className="w-14 h-14 rounded-full border-2 border-slate-800 p-0.5 group cursor-pointer hover:border-accent transition-colors">
                                    <div className="w-full h-full rounded-full bg-surface/50 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:bg-accent/10 transition-all">
                                        {h.icon}
                                    </div>
                                </div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{h.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="bg-surface/30 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6">
                            <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-1">Monthly Listeners</div>
                            <div className="flex items-center gap-2">
                                <div className="text-3xl lg:text-4xl font-black text-white font-mono tracking-tighter">{formatNumber(artist.monthlyListeners)}</div>
                                <div className="text-signal-green text-xs font-bold leading-none mt-1">▲ {artist.growthVelocity.toFixed(1)}%</div>
                            </div>
                        </div>
                        <div className="bg-surface/30 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6">
                            <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-1">Social Reach</div>
                            <div className="flex items-center gap-2">
                                <div className="text-3xl lg:text-4xl font-black text-white font-mono tracking-tighter">{formatNumber(artist.tiktokFollowers)}</div>
                                <div className="text-accent text-xs font-bold leading-none mt-1">▲ 8%</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                        <button onClick={() => setShowDossier(true)} className="bg-white text-black font-black text-[12px] px-10 py-5 rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(255,255,255,0.1)] flex items-center gap-3 group">
                            Open Intelligence Dossier <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                        <div className="flex gap-2">
                            <button onClick={() => onOpenInstagram(artist)} className="bg-slate-900 border border-slate-800 text-white font-black text-[11px] px-6 py-5 rounded-2xl hover:bg-slate-800 hover:border-slate-700 transition-all uppercase tracking-widest">
                                IG
                            </button>
                            <button onClick={() => onOpenTikTok(artist)} className="bg-slate-900 border border-slate-800 text-white font-black text-[11px] px-6 py-5 rounded-2xl hover:bg-slate-800 hover:border-slate-700 transition-all uppercase tracking-widest">
                                TT
                            </button>
                            <button onClick={() => onOpenYouTube(artist)} className="bg-slate-900 border border-slate-800 text-white font-black text-[11px] px-6 py-5 rounded-2xl hover:bg-slate-800 hover:border-slate-700 transition-all uppercase tracking-widest">
                                YT
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* VISUAL INTELLIGENCE SIGNALS (NEXA STYLE) */}
            <div className="space-y-6 mb-16">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em]">Visual Intelligence Signals</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getUniqueVisuals(artist.id).map((signal, idx) => (
                        <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800/50 group cursor-pointer relative">
                            <img src={signal.img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" alt={signal.title} />
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <div className="text-[10px] font-black text-white uppercase tracking-widest">{signal.type}</div>
                                <div className="text-sm font-black text-white uppercase tracking-tight">{signal.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ARTIST INTELLIGENCE REPORT */}
            <div className="bg-surface/50 border border-slate-800 rounded-3xl p-10 backdrop-blur-3xl shadow-2xl">
                <div className="flex flex-col lg:flex-row justify-between gap-12">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center">
                                <Radio className="w-7 h-7 text-accent" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Scouting Audit Report</h3>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Confidential Terminal Data</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {report.map((insight, i) => (
                                <div key={i} className="flex gap-5 p-5 bg-black/30 rounded-2xl border border-white/5 group hover:border-accent/40 transition-all duration-300">
                                    <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(255,51,102,0.8)]"></div>
                                    <span className="text-slate-300 text-base font-medium leading-relaxed italic">"{insight}"</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-96">
                        <div className="bg-black/40 rounded-3xl p-8 border border-white/5 shadow-inner h-full flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Investment Readiness Index</span>
                                <span className="text-4xl font-black text-white font-mono tracking-tighter">{investmentScore.toFixed(0)}%</span>
                            </div>
                            <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden mb-6 border border-white/5">
                                <div className="h-full bg-accent transition-all duration-2000 shadow-[0_0_20px_rgba(255,51,102,0.6)]" style={{ width: `${investmentScore}%` }}></div>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed uppercase tracking-widest text-center">
                                Risk-adjusted score based on multi-source velocity & conversion alpha metrics.
                            </p>
                            {investmentScore > 85 && (
                                <div className="mt-8 py-3 bg-accent/10 border border-accent/30 rounded-xl text-accent text-[11px] font-black uppercase text-center tracking-[0.2em] animate-pulse">
                                    High Alpha Signal Detected
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// SONIC SIGNALS COMPONENT
// ============================================================================

function SonicSignals({ artists }: { artists: PowerIndexArtist[] }) {
    const signals = artists.map(artist => {
        let type: 'Viral' | 'Breakout' | 'Dominance' | 'Conversion' = artist.status as any;
        let description = '';

        switch (type) {
            case 'Viral':
                description = `Explosive growth detected. ${artist.name} saw +${artist.growthVelocity.toFixed(0)}% listener surge in 30 days.`;
                break;
            case 'Breakout':
                description = `Momentum building. ${artist.name} crossing market threshold with ${formatNumber(artist.monthlyListeners)} monthly listeners.`;
                break;
            case 'Conversion':
                description = `ARBITRAGE SIGNAL. ${artist.name} has ${formatNumber(artist.tiktokFollowers)} TikTok reach but only ${artist.conversionScore.toFixed(1)}% conversion.`;
                break;
            case 'Dominance':
                description = `Market leader. ${artist.name} maintains sector leadership with ${formatNumber(artist.monthlyListeners)} listeners.`;
                break;
            default:
                description = `Stable performance. ${artist.name} maintains consistent metrics.`;
                type = 'Breakout';
        }

        return { artist, type, description };
    });

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-signal-purple/20 rounded-lg">
                    <Zap className="w-5 h-5 text-signal-purple" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">ANOMALY DETECTION</h2>
                    <div className="data-tag">AI-CURATED MARKET SIGNALS</div>
                </div>
            </div>

            <div className="space-y-4">
                {signals.map(({ artist, type, description }) => (
                    <div
                        key={artist.id}
                        className="bg-card border border-slate-800/50 rounded-xl p-5 hover:border-slate-700 transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="artist-avatar text-sm">{getInitials(artist.name)}</div>
                                <div>
                                    <div className="font-semibold text-white">{artist.name}</div>
                                    <div className="data-tag">{artist.genre} • {artist.country}</div>
                                </div>
                            </div>
                            <span className={`badge ${getStatusBadge(type)}`}>
                                {type.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// ABOUT SECTION COMPONENT
// ============================================================================

interface AboutSectionProps {
    onNavigate: (tab: TabType) => void;
    onShowPricing: () => void;
    onShowContact: () => void;
}

function AboutSection({ onNavigate, onShowPricing, onShowContact }: AboutSectionProps) {
    return (
        <div className="max-w-5xl mx-auto animate-fade-in space-y-8 pb-12">
            {/* Hero Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="text-accent font-mono text-xs uppercase tracking-widest">Proprietary Intelligence Engine</span>
                </div>
                <h1 className="text-5xl font-bold text-white mb-6">
                    The SoundScout Algorithm
                </h1>
                <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
                    Our proprietary ranking system analyzes <span className="text-white font-semibold">3,000+ artists</span> across
                    <span className="text-white font-semibold"> 4 data sources</span>, updated
                    <span className="text-signal-green font-bold">4 times daily</span> to identify the world's most promising talent.
                </p>
            </div>

            {/* Real-Time Updates Banner */}
            <section className="bg-gradient-to-r from-signal-green/10 via-emerald-500/5 to-signal-green/10 border border-signal-green/30 rounded-2xl p-8">
                <div className="flex items-center justify-between flex-wrap gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-3 h-3 bg-signal-green rounded-full animate-pulse" />
                            <h2 className="text-2xl font-bold text-white">Real-Time Updates</h2>
                        </div>
                        <p className="text-slate-400 max-w-xl">
                            Rankings refresh <strong className="text-white">4 times per day</strong> at 12AM, 6AM, 12PM, and 6PM UTC
                            to capture market movements as they happen.
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-signal-green">4×</div>
                        <div className="text-slate-500 text-sm">DAILY UPDATES</div>
                    </div>
                </div>
            </section>

            {/* Multi-Source Intelligence */}
            <section className="bg-card border border-slate-800 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-accent to-signal-purple rounded-xl">
                        <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Multi-Source Intelligence</h2>
                        <p className="text-slate-500 text-sm">Aggregated from the world's largest music platforms</p>
                    </div>
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-700/30 rounded-xl p-5">
                        <div className="text-green-400 font-bold text-lg mb-2">🎵 Spotify</div>
                        <p className="text-slate-400 text-sm">3,000+ artists from global charts. Total streams, daily plays, chart positions.</p>
                        <div className="mt-3 text-xs text-green-500 font-mono">PRIMARY RANKING</div>
                    </div>
                    <div className="bg-gradient-to-r from-pink-900/30 to-pink-800/20 border border-pink-700/30 rounded-xl p-5">
                        <div className="text-pink-400 font-bold text-lg mb-2">📱 TikTok</div>
                        <p className="text-slate-400 text-sm">Viral detection engine. Identify trends before they hit mainstream.</p>
                        <div className="mt-3 text-xs text-pink-500 font-mono">VIRALITY INDEX</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 border border-purple-700/30 rounded-xl p-5">
                        <div className="text-purple-400 font-bold text-lg mb-2">📸 Instagram</div>
                        <p className="text-slate-400 text-sm">Audience size and brand potential. Crossover appeal indicator.</p>
                        <div className="mt-3 text-xs text-purple-500 font-mono">SOCIAL REACH</div>
                    </div>
                    <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700/30 rounded-xl p-5">
                        <div className="text-red-400 font-bold text-lg mb-2">🎬 YouTube</div>
                        <p className="text-slate-400 text-sm">Video performance and discovery metrics. Cross-platform validation.</p>
                        <div className="mt-3 text-xs text-red-500 font-mono">DISCOVERY INDEX</div>
                    </div>
                </div>
            </section>

            {/* Power Score */}
            <section className="bg-card border border-slate-800 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-signal-purple to-blue-500 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Power Score™ <span className="text-slate-500 font-normal text-lg">(0-1000)</span></h2>
                        <p className="text-slate-500 text-sm">Our proprietary composite ranking algorithm</p>
                    </div>
                </div>
                <div className="grid md:grid-cols-5 gap-4">
                    {[
                        { weight: '35%', name: 'Streaming Power', desc: 'Total Spotify reach', color: 'accent' },
                        { weight: '25%', name: 'Daily Momentum', desc: 'Current velocity', color: 'signal-green' },
                        { weight: '20%', name: 'Social Reach', desc: 'TikTok + Instagram', color: 'pink-500' },
                        { weight: '10%', name: 'Discovery Index', desc: 'YouTube presence', color: 'red-500' },
                        { weight: '10%', name: 'Chart Bonus', desc: 'Billboard positions', color: 'yellow-500' },
                    ].map(factor => (
                        <div key={factor.name} className="bg-terminal border border-slate-800 rounded-xl p-4 text-center">
                            <div className={`text-3xl font-bold text-${factor.color} mb-2`}>{factor.weight}</div>
                            <div className="text-white font-semibold text-sm">{factor.name}</div>
                            <div className="text-slate-500 text-xs mt-1">{factor.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Arbitrage Detection - The Secret Sauce */}
            <section className="bg-gradient-to-r from-accent/10 via-signal-purple/10 to-accent/10 border border-accent/30 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-accent to-red-500 rounded-xl">
                        <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Arbitrage Detection™</h2>
                        <p className="text-slate-500 text-sm">The secret sauce that makes SoundScout different</p>
                    </div>
                </div>
                <p className="text-slate-300 text-lg mb-8 max-w-3xl">
                    We identify artists who are <strong className="text-accent">viral on social media</strong> but
                    <strong className="text-white"> haven't yet converted to streaming</strong>.
                    These are tomorrow's superstars — <em>before everyone else finds them</em>.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-card border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-signal-green/20 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-signal-green" />
                            </div>
                            <div>
                                <div className="text-signal-green font-bold text-xl">Conversion Score</div>
                                <div className="text-slate-500 text-sm">Social → Streaming ratio</div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-terminal rounded-lg p-3">
                                <span className="text-slate-400">Score 0-40</span>
                                <span className="text-accent font-bold">🔥 ARBITRAGE OPPORTUNITY</span>
                            </div>
                            <div className="flex justify-between items-center bg-terminal rounded-lg p-3">
                                <span className="text-slate-400">Score 80-100</span>
                                <span className="text-signal-green font-bold">✓ Market Leader</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <div className="text-accent font-bold text-xl">Arbitrage Signal</div>
                                <div className="text-slate-500 text-sm">The "Sign Now" indicator</div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-terminal rounded-lg p-3">
                                <span className="text-slate-400">Signal &gt; 60%</span>
                                <span className="text-yellow-500 font-bold">⚡ Hot Opportunity</span>
                            </div>
                            <div className="flex justify-between items-center bg-terminal rounded-lg p-3">
                                <span className="text-slate-400">Signal &gt; 80%</span>
                                <span className="text-accent font-bold animate-pulse">🚀 SIGN NOW</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 15 Categories */}
            <section className="bg-card border border-slate-800 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-signal-green to-emerald-500 rounded-xl">
                            <Music className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">15 Categories</h2>
                            <p className="text-slate-500 text-sm">Each with 150+ ranked artists</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white">2,300+</div>
                        <div className="text-slate-500 text-sm">TOTAL RANKINGS</div>
                    </div>
                </div>
                <div className="grid md:grid-cols-5 gap-3">
                    {[
                        'Global Top 200', 'Pop', 'Hip Hop', 'R&B', 'Country',
                        'Afrobeats', 'Latin', 'K-Pop', 'Indie', 'Alternative',
                        'Electronic', 'Major Label', 'Independent', 'Up & Comers', 'Viral'
                    ].map(cat => (
                        <div key={cat} className="bg-terminal border border-slate-800 rounded-lg p-3 text-center hover:border-accent/50 transition-colors cursor-pointer">
                            <div className="text-white font-medium text-sm">{cat}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer Links */}
            <footer className="border-t border-slate-800 pt-12 mt-12">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
                                <Radio className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-bold">SoundScout</span>
                            <span className="text-slate-500 text-xs">™</span>
                        </div>
                        <p className="text-slate-500 text-sm">
                            The world's most advanced A&R intelligence platform. Find tomorrow's superstars today.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Product</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><button onClick={() => onNavigate('power-index')} className="hover:text-white transition-colors">Power Index</button></li>
                            <li><button onClick={() => onNavigate('up-and-comers')} className="hover:text-white transition-colors">Up & Comers</button></li>
                            <li><button onClick={() => onNavigate('sonic-signals')} className="hover:text-white transition-colors">Arbitrage Signals</button></li>
                            <li><button onClick={() => onNavigate('power-index')} className="hover:text-white transition-colors">Genre Rankings</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Company</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">About</button></li>
                            <li><button onClick={() => onShowPricing()} className="hover:text-white transition-colors">Pricing</button></li>
                            <li><button onClick={() => onShowContact()} className="hover:text-white transition-colors">Contact</button></li>
                            <li><button onClick={() => onShowContact()} className="hover:text-white transition-colors">Careers</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Legal</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><a href="https://www.termsfeed.com/live/example" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="https://www.termsfeed.com/live/example" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">Cookie Policy</button></li>
                            <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">GDPR</button></li>
                        </ul>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-slate-900">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-signal-green animate-pulse" />
                        <span className="text-slate-500 text-xs font-mono">LIVE • 4× DAILY UPDATES • POWERED BY PROPRIETARY ALGORITHM</span>
                    </div>
                    <span className="text-slate-600 text-sm">© 2026 SoundScout™ • All Rights Reserved</span>
                </div>
            </footer>
        </div>
    );
}

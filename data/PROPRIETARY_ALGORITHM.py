# STELAR PROPRIETARY RANKING ALGORITHM
# =====================================
# CONFIDENTIAL - Trade Secret Documentation
# Last Updated: January 2026

"""
This document defines the exact proprietary algorithms that power STELAR's
ranking engines: THE PULSE (major artists) and THE LAUNCHPAD (emerging talent).

These algorithms are unique intellectual property and form the core value
proposition of the STELAR platform.
"""

# =============================================================================
# DATA SOURCES (Updated Daily)
# =============================================================================
#
# 1. KWORB.NET - Spotify Monthly Listeners
#    Endpoint: https://kworb.net/spotify/listeners.html
#    Data: Real-time artist rankings by current Spotify monthly listeners
#    Update Frequency: Daily (typically 6 AM UTC)
#    Coverage: Top 2,500 artists globally
#
# 2. KWORB.NET - Daily Streams
#    Endpoint: https://kworb.net/spotify/artists.html
#    Data: Daily stream counts for enrichment
#    Use: Calculate growth velocity
#
# 3. BILLBOARD ARTIST 100
#    Endpoint: https://www.billboard.com/charts/artist-100/
#    Data: Industry-recognized top 100 artists
#    Use: Chart presence bonus for The Pulse
#
# 4. BILLBOARD EMERGING ARTISTS
#    Endpoint: https://www.billboard.com/charts/emerging-artists/
#    Data: Officially recognized up-and-coming talent
#    Use: Core signal for The Launchpad
#
# 5. SPOTIFY VIRAL 50 (via Kworb)
#    Data: Organic viral hits globally
#    Use: Buzz signal for Ignition Score
#
# 6. YOUTUBE MUSIC TRENDING
#    Endpoint: https://www.youtube.com/feed/trending?bp=4gINGgt5dG1hX2NoYXJ0cw%3D%3D
#    Data: Cross-platform heat validation
#    Use: Heat bonus for both engines
#
# 7. APPLE MUSIC (iTunes API)
#    Endpoint: https://itunes.apple.com/search
#    Data: Artist avatars, top songs, album artwork
#    Use: Profile enrichment

# =============================================================================
# ENGINE A: THE PULSE (Major Artists)
# =============================================================================
#
# PURPOSE: Rank established artists by streaming dominance and chart presence.
#          Answers: "Who is the biggest artist RIGHT NOW?"
#
# SELECTION CRITERIA:
#   - All artists in Kworb Monthly Listeners database
#   - Priority display for Billboard Artist 100 members
#
# POWER SCORE FORMULA (0-1000 points):
# ------------------------------------
#
# POWER_SCORE = BASE_SCORE + CHART_BONUS
#
# BASE_SCORE (from real-time Monthly Listeners):
#   │
#   ├── 100M+ listeners     → 1000 points (Maximum dominance)
#   ├── 50M-100M listeners  → 800 + (listeners - 50M) / 250,000
#   ├── 10M-50M listeners   → 500 + (listeners - 10M) / 133,333  
#   ├── 1M-10M listeners    → 200 + (listeners - 1M) / 30,000
#   └── <1M listeners       → max(50, listeners / 5000)
#
# CHART_BONUS (from industry chart presence):
#   │
#   ├── Billboard Artist 100 Rank 1-10    → +300 points
#   ├── Billboard Artist 100 Rank 11-50   → +150 points  
#   ├── Billboard Artist 100 Rank 51-100  → +100 points
#   ├── Spotify Viral 50 presence         → +250 points
#   └── YouTube Trending presence         → +200 points
#
# STATUS CLASSIFICATION:
#   │
#   ├── Power Score > 900 AND Billboard Top 10  → "Dominance"
#   ├── Power Score 700-900 OR Billboard        → "Established"
#   └── All others                               → "Stable"
#
# SORTING: Descending by Power Score (highest = #1)

# =============================================================================
# ENGINE B: THE LAUNCHPAD (Emerging Artists)
# =============================================================================
#
# PURPOSE: Identify pre-breakout, signable artists for A&R discovery.
#          Answers: "Who should we sign BEFORE they blow up?"
#
# SELECTION CRITERIA (must meet ANY):
#   1. Billboard Emerging Artists chart presence, OR
#   2. Spotify Viral 50 presence, OR
#   3. YouTube Music Trending, OR
#   4. Independent label + Under 50M listeners, OR
#   5. Growth velocity > 5% monthly, OR
#   6. Ignition Score > 5
#
# IGNITION SCORE FORMULA (0-100 points):
# --------------------------------------
#
# IGNITION_SCORE = VIRAL_SIGNAL + HEAT_SIGNAL + VELOCITY_BONUS + DISCOVERY_BONUS
#
# VIRAL_SIGNAL (0-30 points) - Organic buzz from Spotify Viral 50:
#   │
#   ├── Formula: (51 - viral_rank) × 0.6
#   ├── Viral #1  → 30 points
#   ├── Viral #25 → 15.6 points
#   └── Viral #50 → 0.6 points
#   └── Not on Viral 50 → 0 points
#
# HEAT_SIGNAL (0-25 points) - Cross-platform validation:
#   │
#   ├── YouTube Music Trending → +25 points
#   └── Not Trending           → 0 points
#
# VELOCITY_BONUS (0-25 points) - Growth momentum:
#   │
#   ├── Growth ≥ 100% monthly → 25 points (explosive)
#   ├── Growth ≥ 50% monthly  → 20 points (rapid)
#   ├── Growth ≥ 20% monthly  → 15 points (strong)
#   ├── Growth > 0% monthly   → velocity × 0.5
#   └── Negative growth       → 0 points
#
#   Velocity calculation:
#   velocity = (daily_listener_change / monthly_listeners) × 100 × 30
#
# DISCOVERY_BONUS (0-20 points) - Signability factors:
#   │
#   ├── Independent/Unsigned label → +10 points
#   ├── Listener tier bonus:
#   │   ├── <100K listeners (Micro)    → +10 points
#   │   ├── 100K-500K (Indie)          → +7 points
#   │   ├── 500K-1M (Breakout)         → +4 points
#   │   └── >1M (Already visible)      → 0 points
#
# WHY THIS FORMULA WORKS FOR A&R:
# --------------------------------
# │ Signal              │ Why It Matters                              │
# ├─────────────────────┼─────────────────────────────────────────────┤
# │ Viral presence      │ Organic buzz = real fans, not paid promo   │
# │ YouTube heat        │ Cross-platform = sticky, engaged audience  │
# │ Small + Growing     │ Cheaper to sign + momentum = opportunity   │
# │ Independent         │ Available to sign, no existing label deal  │
#
# SORTING: Descending by Ignition Score (highest discovery potential = #1)

# =============================================================================
# DATA REFRESH SCHEDULE
# =============================================================================
#
# DAILY REFRESH (via GitHub Actions):
#   - Trigger: 6:00 AM UTC daily
#   - Workflow: .github/workflows/daily-refresh.yml
#   - Process:
#     1. Pull fresh data from all sources
#     2. Run generate_rankings.py
#     3. Commit updated rankings.json to main branch
#     4. Cloudflare Pages auto-deploys on commit
#
# AVATAR ENRICHMENT:
#   - Top 500 artists get Apple Music avatars
#   - Cached locally between runs
#   - Updated when artist ranking changes significantly
#
# FAILURE HANDLING:
#   - If any source fails, cached data is preserved
#   - Partial updates still deployed
#   - Console output indicates which sources failed

# =============================================================================
# EXAMPLE CALCULATIONS
# =============================================================================
#
# THE PULSE EXAMPLE: Taylor Swift
# --------------------------------
# Monthly Listeners: 114,000,000
# Billboard Rank: #5
#
# BASE_SCORE: 1000 (>100M threshold)
# CHART_BONUS: +300 (Billboard Top 10)
# POWER_SCORE: min(1000, 1300) = 1000 (capped)
# STATUS: "Dominance"
#
# THE LAUNCHPAD EXAMPLE: Rising Indie Artist
# -------------------------------------------
# Monthly Listeners: 450,000
# Viral 50 Rank: #18
# YouTube Trending: Yes
# Label: Independent
# Daily Listener Change: +15,000 (33% velocity)
#
# VIRAL_SIGNAL: (51 - 18) × 0.6 = 19.8 points
# HEAT_SIGNAL: 25 points (YouTube Trending)
# VELOCITY_BONUS: 15 points (≥20%)
# DISCOVERY_BONUS: 10 (indie) + 7 (tier) = 17 points
#
# IGNITION_SCORE: 19.8 + 25 + 15 + 17 = 76.8 points
# STATUS: "Breakout"

# =============================================================================
# IMPLEMENTATION NOTES
# =============================================================================
#
# 1. All scores are computed fresh on each run (no stale data)
# 2. Rankings are deterministic given the same input data
# 3. Ties are broken by monthly listener count (higher = better)
# 4. Artists can appear in both Pulse AND Launchpad if criteria met
# 5. Genre classification uses artist name matching + fallback to "Pop"
# 6. Major label detection uses curated list in MAJOR_LABELS constant

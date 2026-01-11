# STELAR v2.0 Strategic Roadmap
*Last Updated: January 11, 2026*

---

## 🎯 Mission
Make STELAR the go-to destination for music fans who want to discover artists before they blow up.

---

## Current State Assessment

### ✅ What's Working
- Top 50 mainstream rankings ("The Pulse")
- Artist profile pages with images
- Track pages with embedded video playback
- OG images for social sharing (Twitter Player Cards)
- Hot 500 global chart

### 🔴 What's Broken
- **"The Launchpad"** - Not loading real emerging artist data
- **YouTube API reliability** - Occasional video failures despite 10-key rotation

### YouTube API Current Architecture
```
Location: stelar/web/functions/track/[[path]].js

Current Fallback Chain:
1. Hardcoded Popular Tracks (instant, 100% reliable) ✅
2. Cache in rankings.json (if pre-verified ID exists) ✅
3. YouTube API with 10-key rotation (~1000 searches/day)
4. HTML Scraper (zero-cost, regex from search page)
5. Invidious API (5 alternative instances)
6. Final fallback: listType=search embed
```

#### YouTube API Keys Location
All 10 keys are in `stelar/web/functions/track/[[path]].js` lines 31-42.

---

## Phase 1: Foundation Fixes (Week 1)

### 1.1 Rename "The Launchpad" → "The Radar" 🎯
**Why:** "Launchpad" is vague. "The Radar" = "you saw them first" energy.

**Files to modify:**
- `stelar/web/src/App.tsx` - Update component name and routes
- `stelar/web/functions/track/[[path]].js` - Update "Explore More" section (line 554)
- `stelar/web/src/components/` - Any Launchpad-specific components

---

### 1.2 Make "The Radar" Real 📡

**Data Sources for Emerging Artists:**
| Source | What It Shows | How to Get |
|--------|--------------|------------|
| Spotify Viral 50 | Real-time viral tracks | Kworb scrape |
| Spotify Discovery Mode | Labels pushing new artists | Kworb scrape |
| YouTube Trending Music | Breakout videos | YouTube API |
| TikTok Trending Sounds | Songs going viral on TikTok | Manual curation initially |
| SoundCloud Trending | Underground artists | API available |

**Ignition Score Formula** (proprietary composite):
```
ignition_score = 
  (viral_chart_position * 0.3) +
  (weekly_stream_growth_pct * 0.25) +
  (playlist_adds_this_week * 0.2) +
  (social_mentions_delta * 0.15) +
  (label_status_boost * 0.1)  // Independent = 1.5x multiplier
```

**Files to create/modify:**
- `stelar/data/generate_radar.py` - New script for emerging artists
- `stelar/web/public/radar.json` - New data file
- `stelar/web/src/App.tsx` - New Radar view component

---

### 1.3 Zero-Downtime YouTube Videos 🎥

**Current Issue:** Despite 10 keys + fallbacks, videos sometimes fail.

**Solution: Pre-cache Video IDs at Build Time**

1. During `generate_rankings.py` run, fetch video ID for each artist's top track
2. Store as `youtubeVideoId` field in `rankings.json`
3. Track page checks cache FIRST before any API calls

**Files to modify:**
- `stelar/data/generate_rankings.py` - Add YouTube ID prefetch
- `stelar/web/functions/track/[[path]].js` - Already has cache check (line 127-144) ✅

**Bonus:** Also add more hardcoded popular tracks to the `POPULAR_TRACKS` object (line 45-115).

---

## Phase 2: Stickiness Features (Week 2)

### 2.1 User Accounts 👤
- Google Sign-In (Firebase Auth or Supabase)
- Follow artists → Personalized feed
- "Alert me" when artist hits milestones (e.g., reaches Top 10)

### 2.2 Daily Rankings Update 📊
- Cron job to update rankings daily at 6am EST
- "What changed today?" section on homepage
- Green/Red arrows showing movement

### 2.3 Share & Save 💾
- Save songs to personal "Vault"
- Create shareable playlists
- "You discovered X artists before they hit Top 50" badge

---

## Phase 3: Growth & Monetization (Week 3-4)

### 3.1 SEO Optimization 🔍
- Optimize artist pages for "[Artist Name] ranking"
- Create landing pages for "top rising artists 2026"
- Schema markup for rich search results

### 3.2 Email Newsletter 📧
- Weekly "Top Movers" digest
- "Artist you follow just broke Top 10" alerts
- Send via Resend (already configured)

### 3.3 Ads Revenue 💰
**Phase A: Low Effort**
- Google AdSense integration
- Tasteful banner on Hot 500 page

**Phase B: Direct Deals**
- Reach out to record labels (they love exposure)
- Music gear brands (Fender, Roland, etc.)
- Streaming services (Spotify, Apple Music)

**Projected Revenue (with 100k MAU):**
- AdSense: $500-2000/month
- Direct sponsorships: $2000-10000/month

---

## Priority Order (What to Build First)

| Priority | Task | Impact | Effort |
|----------|------|--------|--------|
| 🔴 P0 | Fix "The Radar" with real data | High - core product | 4-6 hours |
| 🔴 P0 | Pre-cache video IDs in rankings.json | High - reliability | 2 hours |
| 🟡 P1 | Daily rankings cron job | Medium - freshness | 2 hours |
| 🟡 P1 | User accounts + Follow | High - stickiness | 8 hours |
| 🟢 P2 | Email newsletter | Medium - retention | 4 hours |
| 🟢 P2 | SEO optimization | High - growth | 4 hours |
| 🔵 P3 | Ads integration | Revenue | 2 hours |

---

## Technical Notes

### Video Reliability Chain (Current)
The track page (`[[path]].js`) already has a robust fallback chain:

```javascript
// Order of video ID resolution:
1. POPULAR_TRACKS object (hardcoded IDs for top songs) → instant
2. rankings.json cache (if youtubeVideoId exists) → fast
3. YouTube Data API with 10 keys (quota = 10 * 100 = 1000/day) → reliable
4. HTML Scraper (scrape YouTube search results) → free but slow
5. Invidious API (5 instances) → free, variable reliability
6. listType=search embed (last resort) → works but less precise
```

### Adding More Hardcoded Tracks
Expand `POPULAR_TRACKS` in `[[path]].js` with 100-200 more popular songs.
This guarantees instant playback for most common searches.

---

## Success Metrics

| Metric | Current | Target (30 days) | Target (90 days) |
|--------|---------|-----------------|-----------------|
| Daily Active Users | ~50 | 500 | 5,000 |
| Pages per Session | 2 | 4 | 6 |
| Avg Session Duration | 1 min | 3 min | 5 min |
| Social Shares/day | 5 | 50 | 200 |
| Newsletter Subs | 0 | 500 | 2,000 |

---

## Next Session Action Items

- [ ] Run STELAR dev server and verify current state
- [ ] Implement "The Radar" with real Spotify Viral data
- [ ] Pre-cache video IDs in generate_rankings.py
- [ ] Expand POPULAR_TRACKS with 100+ more songs
- [ ] Deploy and verify zero video failures

---

*Document maintained in `/stelar/ROADMAP.md`*

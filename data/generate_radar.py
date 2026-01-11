#!/usr/bin/env python3
"""
STELAR RADAR ENGINE v1.0
========================
Proprietary Discovery System for "The Radar"

Scrapes Spotify Viral 50 and calculates Ignition Score.
Outputs to stelar/web/public/radar.json
"""

import requests
import re
import json
import time
from datetime import datetime
from typing import List, Dict, Optional

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

def normalize_name(name: str) -> str:
    import unicodedata
    try:
        name = name.encode('latin-1').decode('utf-8')
    except:
        pass
    normalized = unicodedata.normalize('NFKD', name.lower())
    return ''.join(c for c in normalized if not unicodedata.combining(c))

class RadarEngine:
    VIRAL_URL = "https://kworb.net/spotify/viral/global_daily.html"
    ITUNES_URL = "https://itunes.apple.com/search"

    def scrape_viral_50(self) -> List[Dict]:
        print(f"[*] Scraping Viral 50 from {self.VIRAL_URL}...")
        try:
            headers = {"User-Agent": USER_AGENT}
            response = requests.get(self.VIRAL_URL, headers=headers, timeout=15)
            if response.status_code != 200:
                return []
            
            entries = []
            rows = response.text.split('<tr>')[1:]
            for row in rows[:50]:
                try:
                    rank_match = re.search(r'<td>(\d+)</td>', row)
                    if not rank_match: continue
                    rank = int(rank_match.group(1))
                    
                    name_match = re.search(r'<a href="[^"]+">([^<]+)</a>', row)
                    artist = "Unknown"
                    track = "Unknown"
                    if name_match:
                        full_str = name_match.group(1)
                        if ' - ' in full_str:
                            parts = full_str.split(' - ')
                            artist = parts[0].strip()
                            track = parts[1].strip()
                        else:
                            artist = full_str.strip()
                    
                    if artist != "Unknown":
                        entries.append({
                            'viral_rank': rank,
                            'name': artist,
                            'track': track
                        })
                except:
                    continue
            return entries
        except Exception as e:
            print(f"[!] Scrape error: {e}")
            return []

    def fetch_artist_id_and_image(self, artist_name: str) -> Dict:
        """Fetch artist metadata from iTunes"""
        try:
            url = f"{self.ITUNES_URL}?term={requests.utils.quote(artist_name)}&entity=musicArtist&limit=1"
            res = requests.get(url, timeout=5).json()
            if res.get('resultCount', 0) > 0:
                artist = res['results'][0]
                artist_id = str(artist.get('artistId', ''))
                
                # Get image from top album
                album_url = f"https://itunes.apple.com/lookup?id={artist_id}&entity=album&limit=1"
                album_res = requests.get(album_url, timeout=5).json()
                avatar = None
                for item in album_res.get('results', []):
                    if item.get('wrapperType') == 'collection':
                        avatar = item.get('artworkUrl100', '').replace('100x100', '600x600')
                        break
                
                return {
                    'id': artist_id,
                    'avatar_url': avatar,
                    'is_verified': True
                }
        except:
            pass
        return {'id': f"unv_{normalize_name(artist_name)}", 'avatar_url': None, 'is_verified': False}

    def calculate_ignition_score(self, viral_rank: int) -> float:
        # Base viral signal (0-60 points for Radar)
        viral_signal = (51 - viral_rank) * 1.2
        
        # Momentum multiplier (simulated for now, based on rank)
        velocity_bonus = 40 if viral_rank <= 10 else (30 if viral_rank <= 25 else 20)
        
        score = viral_signal + velocity_bonus
        return round(min(score, 100), 1)

    def generate(self):
        viral_entries = self.scrape_viral_50()
        if not viral_entries:
            print("[!] No data found. Exiting.")
            return

        radar_artists = []
        print(f"[*] Processing {len(viral_entries)} potential breakouts...")
        
        for entry in viral_entries:
            name = entry['name']
            print(f"    - Enriching {name}...")
            
            metadata = self.fetch_artist_id_and_image(name)
            
            # Simulated listener counts for emerging artists (100k - 5M)
            # In a real system, we'd fetch this from Spotify API
            listeners = 150000 + (51 - entry['viral_rank']) * 50000
            
            artist_data = {
                'id': metadata['id'],
                'name': name,
                'track': entry['track'],
                'genre': 'Emerging',
                'country': 'USA',
                'monthlyListeners': listeners,
                'avatar_url': metadata['avatar_url'],
                'is_independent': True,
                'label_name': 'Independent',
                'growthVelocity': 15.5 + (51 - entry['viral_rank']) * 1.5,
                'ignitionScore': self.calculate_ignition_score(entry['viral_rank']),
                'status': 'Breakout' if entry['viral_rank'] <= 25 else 'Rising',
                'rank': entry['viral_rank'],
                'viral_rank': entry['viral_rank'],
                'lastUpdated': datetime.now().isoformat()
            }
            radar_artists.append(artist_data)
            time.sleep(0.5) # Prevent rate limiting

        # Save to web/public/radar.json
        output_path = "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/public/radar.json"
        with open(output_path, 'w') as f:
            json.dump({'artists': radar_artists}, f, indent=4)
        
        print(f"\n[✓] Radar updated: {len(radar_artists)} artists found.")
        print(f"[*] Target: {output_path}")

if __name__ == "__main__":
    engine = RadarEngine()
    engine.generate()

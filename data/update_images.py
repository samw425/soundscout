#!/usr/bin/env python3
"""
Quick script to update artist images in rankings.json with real iTunes artwork.
Safe: Only modifies avatar_url field, preserves all other data.
"""

import json
import requests
import time
import os

def fetch_itunes_image(artist_name):
    """Fetch artist image from iTunes API"""
    try:
        search_url = f"https://itunes.apple.com/search?term={requests.utils.quote(artist_name)}&entity=musicArtist&limit=1"
        response = requests.get(search_url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('resultCount', 0) > 0:
                artist_id = data['results'][0].get('artistId')
                if artist_id:
                    # Get their top album for artwork
                    album_url = f"https://itunes.apple.com/lookup?id={artist_id}&entity=album&limit=1"
                    album_response = requests.get(album_url, timeout=10)
                    if album_response.status_code == 200:
                        album_data = album_response.json()
                        for item in album_data.get('results', []):
                            if item.get('wrapperType') == 'collection':
                                artwork = item.get('artworkUrl100', '')
                                if artwork:
                                    # Get higher resolution
                                    return artwork.replace('100x100', '600x600')
    except Exception as e:
        pass  # Silent fail, we'll keep existing image
    return None

def main():
    # Path to rankings.json
    script_dir = os.path.dirname(os.path.abspath(__file__))
    rankings_path = os.path.join(script_dir, '..', 'web', 'public', 'rankings.json')
    
    print(f"Loading rankings from: {rankings_path}")
    
    with open(rankings_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Process ALL artists in global rankings
    global_artists = data['rankings']['global']
    updated_count = 0
    skipped_count = 0
    total = len(global_artists)
    
    print(f"Processing all {total} artists...")
    
    for i, artist in enumerate(global_artists):
        name = artist['name']
        current_url = artist.get('avatar_url', '')
        
        # Progress update every 100 artists
        if i % 100 == 0:
            print(f"[{i}/{total}] Processing... ({updated_count} updated so far)")
        
        # Skip if already has a valid image (not Unsplash or placeholder)
        if current_url and 'unsplash.com' not in current_url and '181818' not in current_url and 'itunes' in current_url.lower() or 'mzstatic' in current_url:
            skipped_count += 1
            continue
            
        # Fetch from iTunes
        new_url = fetch_itunes_image(name)
        
        if new_url:
            artist['avatar_url'] = new_url
            updated_count += 1
        
        # Small delay to avoid rate limiting (3 requests per second is safe)
        time.sleep(0.3)
    
    # Also update artists in genre categories
    print(f"\nSyncing images to genre categories...")
    for category_key in data['rankings']:
        if category_key == 'global':
            continue
        for artist in data['rankings'][category_key]:
            # Find matching artist in global and copy updated avatar
            for global_artist in global_artists:
                if artist['id'] == global_artist['id']:
                    artist['avatar_url'] = global_artist['avatar_url']
                    break
    
    # Save updated data
    print(f"\nSaving updated rankings...")
    with open(rankings_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Done!")
    print(f"   Updated: {updated_count} artists")
    print(f"   Skipped (already had good image): {skipped_count}")

if __name__ == '__main__':
    main()

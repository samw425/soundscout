#!/usr/bin/env python3
"""
Update Old School legends with real artist images from iTunes.
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
        print(f"  Error fetching {artist_name}: {e}")
    return None

def main():
    # Path to oldschool.json
    script_dir = os.path.dirname(os.path.abspath(__file__))
    oldschool_path = os.path.join(script_dir, 'oldschool.json')
    web_path = os.path.join(script_dir, '..', 'web', 'public', 'oldschool.json')
    
    print(f"Loading Old School legends from: {oldschool_path}")
    
    with open(oldschool_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    artists = data.get('artists', [])
    updated_count = 0
    total = len(artists)
    
    print(f"Processing {total} legends...")
    
    for i, artist in enumerate(artists):
        name = artist['name']
        current_url = artist.get('avatar_url', '')
        
        print(f"[{i+1}/{total}] {name}...", end=' ')
        
        # Fetch from iTunes
        new_url = fetch_itunes_image(name)
        
        if new_url:
            artist['avatar_url'] = new_url
            updated_count += 1
            print(f"✓ Updated")
        else:
            print(f"✗ No image found")
        
        # Small delay to avoid rate limiting
        time.sleep(0.4)
    
    # Save updated data to both locations
    print(f"\nSaving updated legends...")
    
    with open(oldschool_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    with open(web_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Done!")
    print(f"   Updated: {updated_count} of {total} legends")

if __name__ == '__main__':
    main()

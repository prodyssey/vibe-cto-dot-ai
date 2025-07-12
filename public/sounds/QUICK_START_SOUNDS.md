# Quick Start: Getting Sounds for Your Adventure Game

## Option 1: Instant Generated Sounds (5 minutes)
1. Open `generate-sounds.html` in your browser
2. Click "Play" to preview each sound
3. Click "Download" to save the WAV files
4. Convert to MP3 using an online converter or ffmpeg

## Option 2: Kenney's Free Assets (10 minutes)
1. Go to https://kenney.nl/assets/interface-sounds
2. Download the pack (no account needed, CC0 license)
3. Extract and find these sounds:
   - `click1.ogg` → rename to `ui-click.mp3`
   - `switch3.ogg` → rename to `ui-hover.mp3`
   - `confirmation1.ogg` → rename to `success-chime.mp3`
   - `error8.ogg` → rename to `error-buzz.mp3`

## Option 3: Quick Freesound Downloads (15 minutes)
Create a free account at https://freesound.org, then download:

### UI Sounds:
1. **Button Hover**: https://freesound.org/sounds/256116/
   - Download → Rename to `ui-hover.mp3`
   
2. **Button Click**: https://freesound.org/sounds/608823/
   - Download → Rename to `ui-click.mp3`

3. **Whoosh**: https://freesound.org/sounds/467828/
   - Download → Rename to `whoosh.mp3`

4. **Success**: https://freesound.org/sounds/355833/
   - Download → Rename to `success-chime.mp3`

5. **Error**: https://freesound.org/sounds/351564/
   - Download → Rename to `error-buzz.mp3`

6. **Typewriter**: https://freesound.org/sounds/450606/
   - Download → Rename to `typewriter-key.mp3`

### Ambient/Music (Optional):
For testing, you can skip music initially or use:
- **Space Ambience**: https://freesound.org/sounds/462603/
- Generate simple ambient loops with the HTML tool

## Option 4: Create with Online Tools (20 minutes)

### Bfxr (Retro Sound Generator)
1. Go to https://www.bfxr.net/
2. Use these presets:
   - **Hover**: "Pickup/Coin" → Lower volume → Export
   - **Click**: "Hit/Hurt" → Shorten → Export  
   - **Success**: "Powerup" → Export
   - **Error**: "Random" → Find buzzy sound → Export
   - **Portal**: "Weird" → Find sci-fi sound → Export

### ChipTone (Alternative)
- https://sfbgames.itch.io/chiptone
- Similar to Bfxr but with more options

## File Checklist
Place these files in `/public/sounds/`:
- [ ] `ui-hover.mp3` (soft click/beep)
- [ ] `ui-click.mp3` (satisfying click)
- [ ] `whoosh.mp3` (transition sound)
- [ ] `portal-activate.mp3` (magical/sci-fi)
- [ ] `success-chime.mp3` (positive feedback)
- [ ] `error-buzz.mp3` (negative feedback)
- [ ] `typewriter-key.mp3` (single key press)
- [ ] `space-station-ambience.mp3` (optional)
- [ ] `music-main-theme.mp3` (optional)
- [ ] `music-ignition-forge.mp3` (optional)
- [ ] `music-launch-control.mp3` (optional)
- [ ] `music-interstellar.mp3` (optional)

## Test Your Sounds
1. Place files in `/public/sounds/`
2. Run your dev server
3. Open the adventure game
4. You should hear:
   - Music on the entry screen
   - Hover sounds on buttons (desktop only)
   - Click sounds on all interactions
   - Typewriter sounds during text animation
   - Portal selection sounds

## Troubleshooting
- **No sounds?** Check browser console for 404 errors
- **Too loud/quiet?** Adjust volumes in `SoundManager.ts`
- **Not loading?** Ensure files are in MP3 format
- **Mobile issues?** Sounds require user interaction first

## Production Recommendations
For a polished experience, consider:
1. Professional sound pack from Unity Asset Store or itch.io
2. Hire a sound designer on Fiverr ($50-200)
3. Use AI music generators like Soundraw or Mubert
4. Layer multiple sounds for richness
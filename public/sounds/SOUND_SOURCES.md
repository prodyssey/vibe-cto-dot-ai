# Free Sound Sources for VibeCTO Adventure Game

## Recommended Sound Libraries

### 1. Freesound.org (CC Licensed)
Free with account, various Creative Commons licenses

**UI Sounds:**
- Button hover: Search "soft click", "menu hover", "ui hover"
  - https://freesound.org/search/?q=ui+hover
- Button click: Search "button click", "menu select", "ui click"
  - https://freesound.org/search/?q=button+click
- Whoosh transition: Search "whoosh", "transition", "swipe"
  - https://freesound.org/search/?q=whoosh+transition

**Typewriter:**
- Search "typewriter single key"
  - https://freesound.org/search/?q=typewriter+key

### 2. Zapsplat.com
Free with account, standard license allows use in projects

**Space/Sci-fi Sounds:**
- Space station ambience
- Computer hum
- Portal activation sounds
- Success/error chimes

### 3. OpenGameArt.org
Specifically for games, various open licenses

**Background Music:**
- Sci-fi/space themed music tracks
- CC0 (Public Domain) options available
- Search tags: "space", "sci-fi", "ambient", "electronic"

### 4. Free Music Archive
CC Licensed music tracks

**Path-specific Music Suggestions:**
- Main Theme: Ambient electronic, mysterious
- Ignition: Upbeat, energetic, startup vibes
- Launch Control: Technical, focused, rhythmic
- Interstellar: Expansive, cosmic, ethereal

## Specific Recommendations

### UI Sounds Package
**Kenney.nl** (CC0 Public Domain)
- Interface Sounds Pack: https://kenney.nl/assets/interface-sounds
- Digital Audio Pack: https://kenney.nl/assets/digital-audio
- Free, no attribution required

### Space Ambience
**NASA Audio Collection** (Public Domain)
- Real space sounds: https://www.nasa.gov/audio-and-ringtones/
- Space station recordings
- Authentic and atmospheric

### Typewriter Sounds
**BBC Sound Effects** (Personal Use)
- https://sound-effects.bbcrewind.co.uk/
- Search "typewriter"
- High quality recordings

## Quick Generation Tools

### 1. sfxr/Bfxr (Generate retro sounds)
- https://www.bfxr.net/
- Great for UI sounds, beeps, clicks
- Export as WAV, convert to MP3

### 2. Chrome Music Lab
- https://musiclab.chromeexperiments.com/
- Create simple melodies and sounds

### 3. Audacity (Edit/Create)
- Generate tones
- Apply effects to create sci-fi sounds
- Combine and edit downloaded sounds

## License Compatibility

### Safe Licenses for Commercial Use:
1. **CC0** - Public Domain, no attribution
2. **CC BY** - Attribution required
3. **CC BY-SA** - Attribution + ShareAlike

### Avoid for Commercial Projects:
- CC BY-NC (Non-Commercial only)
- CC BY-ND (No Derivatives)

## Quick Sound List with Direct Suggestions

### Essential Sounds First:

1. **ui-hover.mp3**
   - Kenney Interface Sounds: "click_003.ogg" (soft)
   - Or generate with Bfxr: Pickup/Coin preset, modify

2. **ui-click.mp3**
   - Kenney Interface Sounds: "click_001.ogg"
   - Or Freesound #268108 "UI Click"

3. **whoosh.mp3**
   - Freesound #60009 "Whoosh"
   - Or generate: White noise + filter sweep

4. **typewriter-key.mp3**
   - Freesound #451660 "Typewriter single key"
   - Or record your own keyboard tap

5. **space-station-ambience.mp3**
   - NASA ISS recordings
   - Or layer: Low hum + occasional beeps
   - Freesound #135472 "Space station ambience"

## Conversion Tips

### MP3 Conversion:
```bash
# Using ffmpeg (if you have WAV/OGG files)
ffmpeg -i sound.wav -codec:a libmp3lame -b:a 128k sound.mp3

# Batch convert
for f in *.wav; do ffmpeg -i "$f" -codec:a libmp3lame -b:a 128k "${f%.wav}.mp3"; done
```

### Volume Normalization:
```bash
# Normalize to -3dB
ffmpeg -i input.mp3 -af loudnorm=I=-3:TP=-1:LRA=13 output.mp3
```

## Attribution Template

If using CC BY sounds, create `CREDITS.md`:

```markdown
# Sound Credits

## UI Sounds
- "Button Click" by [Author] (CC BY 3.0) via Freesound.org
- "Whoosh Transition" by [Author] (CC BY 3.0) via Freesound.org

## Music
- "Space Ambient" by [Author] (CC BY 3.0) via Free Music Archive
```

## Quick Start Pack

For immediate testing, use these CC0/Public Domain options:

1. **Kenney's Interface Sounds** (CC0)
   - Download: https://kenney.nl/assets/interface-sounds
   - Extract clicks and hovers

2. **Bfxr Generated** (Your creation)
   - UI sounds: Use "Pickup" preset
   - Error: Use "Hit" preset
   - Success: Use "Powerup" preset

3. **Simple Ambience** (Create yourself)
   - Record 30 seconds of quiet room tone
   - Add subtle filter in Audacity
   - Loop seamlessly

This should get you started quickly with properly licensed sounds!
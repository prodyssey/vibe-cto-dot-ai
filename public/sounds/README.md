# Adventure Game Sound Assets

This directory contains all sound effects and music for the VibeCTO adventure game.

## Required Sound Files

### UI Sounds
- `ui-hover.mp3` - Button hover sound (soft click or whoosh)
- `ui-click.mp3` - Button click sound (satisfying click)
- `whoosh.mp3` - Scene transition sound
- `portal-activate.mp3` - Portal selection sound (magical/sci-fi)

### Feedback Sounds
- `success-chime.mp3` - Success/completion sound
- `error-buzz.mp3` - Error/invalid action sound
- `typewriter-key.mp3` - Single typewriter keystroke

### Ambient Sounds
- `space-station-ambience.mp3` - Background ambience for space station
- `computer-hum.mp3` - Subtle computer/technology hum

### Background Music
- `music-main-theme.mp3` - Main menu/entry screen music
- `music-ignition-forge.mp3` - Ignition path music (energetic, startup vibe)
- `music-launch-control.mp3` - Launch Control path music (technical, focused)
- `music-interstellar.mp3` - Interstellar path music (expansive, cosmic)

## Sound Guidelines

### Volume Levels
- UI sounds: 0.2-0.5 (subtle feedback)
- Ambient sounds: 0.2-0.3 (background atmosphere)
- Music: 0.3-0.4 (not overpowering)

### File Format
- Use MP3 format for web compatibility
- Optimize file sizes (aim for < 100KB for UI sounds, < 1MB for music)
- 128kbps bitrate is sufficient for most sounds

### Recommended Sources
- Freesound.org (CC licensed sounds)
- Zapsplat.com (free with account)
- Create custom sounds with:
  - Audacity (free audio editor)
  - sfxr/Bfxr (retro game sounds)
  - GarageBand/Logic Pro (music creation)

## Implementation Status
- [ ] UI hover sound
- [ ] UI click sound
- [ ] Scene transition sound
- [ ] Portal activation sound
- [ ] Success chime
- [ ] Error buzz
- [ ] Typewriter keystroke
- [ ] Space station ambience
- [ ] Computer hum
- [ ] Main theme music
- [ ] Ignition path music
- [ ] Launch Control path music
- [ ] Interstellar path music

## Notes
- All sounds should loop seamlessly if marked with `loop: true`
- Consider using Web Audio API for more advanced sound processing
- Test sounds on both desktop and mobile devices
- Ensure sounds work with autoplay policies (user interaction required)
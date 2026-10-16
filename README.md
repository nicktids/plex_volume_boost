# Plex Volume Boost

A tiny Chrome extension that boosts the volume of the Plex web player (`app.plex.tv`) above 100%, like VLC's 200% volume. No ads, no tracking, no network requests.

## Features

- Slider from 100% to 500%
- One-click reset to 100%
- Badge on the toolbar icon shows the current boost
- Setting is remembered across reloads and browser restarts
- Only runs on `https://app.plex.tv/*`

## Install

1. Clone or download this repo.
2. Open `chrome://extensions`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select this folder.
5. Pin the extension from the puzzle-piece menu.

## Usage

Open a video on app.plex.tv, click the extension icon and drag the slider. Click **Reset to 100%** to go back to normal.

If a boost doesn't apply to a video that was already playing, reload the Plex tab.

## How it works

`content.js` routes the page's `<video>`/`<audio>` elements through a Web Audio `GainNode`. Nothing is rerouted until you first set a boost above 100%. The popup stores the boost in `chrome.storage.local`, and the content script picks up changes live.

Very high boost values will clip and distort on loud passages, just like VLC. Around 150–250% is usually the sweet spot.

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension manifest (MV3), only `storage` permission |
| `content.js` | Applies the gain to Plex's media elements |
| `popup.html` / `popup.js` | Slider + reset UI |

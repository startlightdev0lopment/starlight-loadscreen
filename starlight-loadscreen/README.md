# Starlight Loadscreen — FiveM

Cyan cinematic Vinewood loading screen recreated from the supplied reference.

## Installation

1. Copy `starlight-loadscreen` to `resources/[local]/starlight-loadscreen`.
2. In `server.cfg` add:

   ```cfg
   ensure starlight-loadscreen
   setr sv_showBusySpinnerOnLoadingScreen false
   ```

3. Stop or remove other active loadscreen resources (only one should be active).
4. Restart the server and **reconnect to test**; restarting a resource mid-session does not replay the player loading screen.

## What it does

- Displays the cinematic cyan Vinewood scene at any resolution.
- Updates the bottom progress line and percentage with FiveM's actual `loadProgress` / `loadFraction` messages.
- Leaves FiveM's default loading-screen lifecycle intact (no artificial timeout, forced exit or framework dependency).
- Shows an optional tiny status message using FiveM loading event data.
- Includes a top-left browser renderer FPS indicator, not the game's actual FPS.
- Styled `ESC CANCEL` prompt matches the reference image. It is a visual hint, not a custom key binding; FiveM controls loading/cancellation input.
- No dependencies, remote assets, videos, audio, or database setup.

## Customize

Edit `html/config.js` to change the text, accent color or optional status/FPS/hint visibility.
Replace `html/assets/vinewood.webp` to change the background image (recommended 16:9).
Edit `html/style.css` for sizes or layout changes.

## Preview / testing

Open `html/index.html?preview=1` in a browser to see an illustrative animated progress demo.
Opening the page without `?preview=1` will stay at 0% until FiveM sends a `loadProgress` message.
A browser-only preview is **not** a FiveM integration test; reconnect to a running server to test real progress.

## Notes

- Do not enable `loadscreen_manual_shutdown` unless you separately implement shutdown in your spawn scripts.
- If another loadscreen resource is enabled, its loading screen may take precedence.
- The engine may display its own cancellation interface; the hint is stylistic only and does not override engine input.

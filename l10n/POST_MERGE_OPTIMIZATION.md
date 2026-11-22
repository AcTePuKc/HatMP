# Performance review after the upstream merge

Static review on 2026-11-22. These are candidates for measurement and later work, not measured speedups.

1. **Scene image handlers (low risk).** `scripts/nav.js` around lines 250–255 attaches a `dragstart` handler to every image whenever a new layer is added. Register one delegated handler once. Check that dragging remains disabled in gameplay and enabled where the UI needs it.
2. **Save list refresh (moderate risk).** `scripts/saves.js` around lines 903–933 rereads all save metadata when changing a save tab or page. Measure this with many slots; if it matters, cache the list and invalidate on save/delete/import/edit.
3. **Room transition images (moderate risk).** `scripts/nav.js` around lines 46–69 rebuilds scene layers at every transition. Measure transition time and image decode; try targeted preload/decode for the likely next room with a bounded cache. Avoid preloading the whole game.
4. **Large animations (visual and compatibility risk).** The asset inventory includes about 946 MiB of GIF files. `images/room/24_spinTheBottle/024_blowey1.gif` alone is about 73 MiB. Test a few of the largest GIFs in a more compact format, preserving loops, transparency and offline `file://` playback.
5. **Startup scripts (high risk).** `index.html` loads all room scripts synchronously, about 7 MB of JavaScript across 247 files in this snapshot. Profile startup first; loading room scripts in groups or on demand may reduce parsing and memory, but must preserve global dependencies, save resume and offline `file://` behavior.

No game code was changed during this review. Benchmark representative hardware before prioritizing the larger changes.

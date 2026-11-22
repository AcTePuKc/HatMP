# Performance review after the upstream merge

Static review on 2026-11-22. These are candidates for measurement and later work, not measured speedups.

1. **Scene image handlers (low risk; fixed in the integration branch).** `scripts/nav.js` attached a `dragstart` handler to every image whenever a new layer was added. It now registers one delegated handler. A DOM smoke check confirmed that both existing and later images still reject dragging. Check unusual editor or upload surfaces in game before release.
2. **Save list refresh (moderate risk).** `scripts/saves.js` around lines 903–933 rereads all save metadata when changing a save tab or page. `getAllMeta()` reads the small metadata store, not entire save bodies, so measure this with many slots before adding a cache. If it matters, invalidate on save/delete/import/edit.
3. **Room transition images (moderate risk).** `scripts/nav.js` around lines 46–69 rebuilds scene layers at every transition. Measure transition time and image decode; try targeted preload/decode for the likely next room with a bounded cache. Avoid preloading the whole game.
4. **Large animations (visual and compatibility risk).** The asset inventory includes about 946 MiB of GIF files. `images/room/24_spinTheBottle/024_blowey1.gif` alone is about 73 MiB. Test a few of the largest GIFs in a more compact format, preserving loops, transparency and offline `file://` playback.
5. **Startup scripts (high risk).** `index.html` loads all room scripts synchronously, about 7 MB of JavaScript across 247 files in this snapshot. This loads code, not every room image. Profile startup first; loading room scripts in groups or on demand may reduce parsing and memory. `invoker.invoke()` and some direct `roomNNN` calls are synchronous, so a loader must preserve their behavior, save resume and offline `file://` use.

No game code was changed during the initial static review. The delegated image drag handler was implemented separately. Benchmark representative hardware before prioritizing the larger changes.

## Reproducible baseline (2026-11-22)

`node tools/perf-probe.js` opens the offline `startGame.html` in a fresh headless Chrome profile for each run. It does not use player saves. It measures navigation to the visible title, then creates a temporary game and enters Rooms 10, 28 and 250 without advancing game time. Numbers below are local measurements, not a promise for other hardware or JoiPlay.

| Integration branch, three runs | Median | Range |
| --- | ---: | ---: |
| Title visible | 266 ms | 264–285 ms |
| Room 10 build | 13 ms | 12.8–13.1 ms |
| Room 10 images ready | 29 ms | 27.5–30.1 ms |

With Chrome CPU throttled to 4× slower, the title was visible in 754–783 ms and Room 10's images were ready in 137–173 ms. Loading metadata for 500 synthetic slots took about 6–8 ms at normal speed (25–35 ms under 4× throttling); 2,000 slots took 20–24 ms in one normal-speed run. The first cold run and comparisons with the older release are affected by disk and OS caching, so avoid treating those differences as improvements from this branch.

**Decision:** defer lazy room-script loading and save-list caching. Neither is the measured bottleneck on this machine, and both add state and compatibility risk. Recheck on a slower target device if players report startup or save-list delays.

The largest GIF, `24_spinTheBottle/024_blowey1.gif` (73.4 MiB), and several other large Room 24 GIFs have no exact source references; dynamic filename construction must be ruled out before treating them as unused. A temporary conversion of the *referenced* `450_park/head.gif` preserved 41 animation frames and reduced the file from 20.0 MiB to 0.91 MiB as animated WebP at quality 80. This was a size experiment only: check transparency, appearance, loop timing and offline browser support before replacing a game asset.

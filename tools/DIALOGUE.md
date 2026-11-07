# Dialogue prototype checks

Open `dialogue-preview.html` directly from disk to try the shared dialogue renderer without loading a save or executing story callbacks. Use F11 for fullscreen, then compare Classic and Enhanced in Reading settings. The preview uses the same browser reading preferences as the game.

Check English, Spanish and Bulgarian with short and long passages, one and six choices, and text sizes of 85%, 100% and 150%. In Enhanced, the portrait's horizontal position must stay fixed when changing text size at the same window dimensions. Only the text's wrapping and the panel's required height should change.

Hide dialogue temporarily clears the panel to reveal the scene. Show dialogue or Escape restores it without advancing, replaying a callback or losing scroll position. Auto-skip stops when hiding. The overlay continues to block story clicks while inspecting the scene. A new passage or closing dialogue clears the temporary hidden state; it is never stored in preferences or saves.

Scene code can use `dialogue.hide()` and `dialogue.show()` for this same temporary presentation behaviour. Do not use `privateChat.kill()` to temporarily hide a passage: it clears the active dialogue and choices. Avoid untracked timers that could restore or hide a later scene.

Skip dialogue is a localized text button in the toolbar. The old artwork is no longer referenced by either game entry page or the preview; no image-sized gap is reserved beside choices.

Run the logic regression checks with:

```sh
npm ci --prefix tools
npm test --prefix tools
```

These tests cover callbacks, localization, preferences, history, scroll state, hiding/restoration and keyboard/auto-skip handling. They use jsdom, which does not measure visual layout. The user reported the visual check as passed on 26 October 2026, including the latest layout fixes.

Starting or restarting a game, loading a save, importing a save, and using History → Back now clear Recent dialogue before the new timeline renders. The open history/settings dialog closes, captured dialogue and pending auto-skip are discarded, and reading preferences remain unchanged. History is intentionally not saved or restored; after a rewind, it contains only passages displayed from that point onward. A missing save or invalid JSON rejected before loading does not clear the log.

## Player agreement preview

The preview uses the real `gender.isGirl()` resolver with isolated sample state. Enable **Player agreement sample**, switch EN/BG/ES and masculine/feminine/appearance, or enter a real translation key. Sample appearance changes affect only appearance mode. This never changes the game's pronoun preference or save data. Only `{me}` and `{name}` receive dummy values; other scene placeholders remain visible. See [the translation guide](../l10n/README.md#player-pronouns-and-grammatical-agreement).

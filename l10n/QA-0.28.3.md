# 0.28.3 localization QA

This is the active release check after merging upstream `81788c32`. Keep `lastTestedGameVersion` at `0.28.2` until the localized 0.28.3 build has been exercised in the game.

## Static checks completed

- `npm test --prefix tools`: dialogue, language packs, player forms, sidebar and timeline checks pass.
- `npm run l10n --prefix tools`: no BG/ES missing keys, manual placeholders or hard errors. This checks source-backed entries, not rendered wording.
- `npm run l10n:scan --prefix tools`: 281 files, 47 distinct static candidates, no parse errors. Keyed coverage now has no missing BG/ES keys. Four absent ES speaker keys found in this pass were added: `doofus`, `emily`, `freddy`, `frank`.

The 47 scanner candidates were traced to existing display paths:

| Candidates | Display path | Result |
| --- | --- | --- |
| `index.html` and `startGame.html` sidebar labels | `data-l10n` applies to headings and fixed labels; `stats.js`, `nav.js` and `clothes.js` replace changing stat, arousal and appearance text. | Source English remains in the HTML as the fallback. Verify layout and language switching in game. |
| “You have to unzip it!!!!” link | `#hideThisNoJavascript` has `display:none` in `style/global.css`. | Hidden diagnostic; no visible translation work. |
| `charisma.js` and `quickFight.js` result arrays | `charisma.resultText` and `quickFight.resultText` select a key for the chosen index before drawing it. | Array strings are English fallbacks, not raw displayed output. |
| `room353.js` reaction array | The selected reaction receives `room.353.chat.996.text.<group>.<index>` as its `l10nKey`. | Array strings are English fallbacks. |
| `nav.js` video element | Generated HTML markup with a dynamic media path. | No natural-language text to translate. |

## In-game checks still open

- Load an actual 0.28.2 save in the 0.28.3 build. Check room rendering, inventory, clothes, phone, character names, optional relationship forms and saving again. The static code path is `char.applyLoadedState` → `g/inv/cl/sc/gv/missy.load` → `char.finishLoadedState`; no actual save was supplied for this pass.
- Switch EN → BG → ES → EN after loading, including a custom character name and a custom relationship term. Check the direct-address vocative and long sidebar labels.
- Review the new Room 12, 16, 26 and 32 scenes in the game, especially the specific lines in [IN_GAME_QA.md](IN_GAME_QA.md). Check choices with both player appearances.
- Check the merged portrait layers, Room 28 dream conditions, Room 949 clothing reset and transitions noted in [MERGE_NOTES.md](MERGE_NOTES.md).
- Check text embedded in images and the planned clean button assets after the 0.28.3 text/runtime pass.

The browser automation gate blocked observation of the currently open local `file://` game tab. It permits only HTTP(S) tabs and explicitly forbids reaching the same tab through another browser route, so this pass did not claim in-game verification.

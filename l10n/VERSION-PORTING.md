# Porting the localization work to a newer game version

This is the handoff record for moving the localization branch onto newer developer releases. It records what exists in this checkout, where it lives, and a safe order for comparing it with a new source copy. It is not a claim that every change has been reviewed or that an upgrade has already been tested.

## Checkout snapshot

- Recorded: 2026-11-04.
- Branch: `feature/localization-foundation`.
- Branch HEAD: `3580b9965b70c7e4d869ace65b3aa78570db9d38` — `Add localization foundation and language packs`.
- Local `origin/master` ref at inspection: `c9ce235f65b53fdf3ef0c07d7994fbc072cf5887` — `Add Strength to phone cheats (#110)`. This was the local ref; it was not fetched as part of writing this note.
- Immediately before adding this log: 94 tracked paths modified and 15 untracked status entries. This log and its link in `l10n/README.md` were added after that count; the working changes remain uncommitted.
- The game source is a separate copy from the developer's release branch. Treat this record and Git's file-by-file diff as the porting aid; do not replace the v1.0 source tree wholesale with this checkout.

The reference point for local tracked edits is the branch HEAD above. Compare a new release against that commit and the working-tree changes. Git diffs do not include untracked files unless they are added to a commit or otherwise included deliberately.

## Developer update 0.28.3 — not yet compared

- The user reports that the developer updated the game to version 0.28.3 on 2026-11-01. At the time of this note, the release commit and source files had not been recorded or inspected in this checkout.
- The developer granted access to the game's PSD files so the user can prepare multilingual buttons and other artwork with embedded text. The user has not downloaded them yet; no PSD has been inspected or edited.
- It was unknown which of the localization runtime, UI, source corrections, or translation changes from this branch were adopted in 0.28.3. Once the 0.28.3 source became available locally, the comparison and merge were recorded in `MERGE_NOTES.md`.
- Continue text translation in this separate localization copy. Track image and button localization as a later asset task after the PSDs are available.

## Change groups

### Runtime localization and dialogue display

Core edits/additions:

- `scripts/localization.js` — locale loading, translation/fallback resolution, safe placeholders, source-key resolution, language selection, and dynamic relationship-term resolution.
- `scripts/l10n-format.js` — player masculine/feminine branch parsing and validation.
- `scripts/dialogue.js`, `scripts/chat.js`, `style/dialogue.css`, `style/global.css`, `index.html` — dialogue presentation modes, reading controls, centered choices, and their loading/styling.
- `scripts/char.js`, `scripts/global.js`, `scripts/inventory.js`, `scripts/supportingChar.js` — active player name/pronoun behavior, locale-aware character names, and relationship-term support.
- `startGame.html`, `scripts/phone.js` — initial setup preferences and the Phone → Relationships / reading-settings screens.
- `.gitignore` — excludes generated reports and local tool artifacts from source changes.

When porting, merge these against the v1.0 equivalents first. Check script inclusion order in `index.html`, save loading, old-save defaults, and every caller that formats chat text or choices. Keep the existing save fields intact; the added relationship forms are optional and fall back to existing values.

### Language packs and translation records

- `l10n/bg.js`, `l10n/es.js`, and `l10n/en.js` contain the Bulgarian, Spanish, and source-key catalogs. They use stable room/chat keys, dynamic placeholders, and `[[player:masculine|feminine]]` alternatives where required.
- `l10n/extraction-inventory.json` records source-discovered strings for coverage review.
- `l10n/README.md` documents translator conventions, gender agreement, custom relationship forms, QA workflow, and current progress.

Port catalog entries by key, not by line number. Re-run source extraction against v1.0: keys may have been added, removed, renamed, or changed in context. Preserve the English source text supplied by v1.0 unless a source correction in the next section is intentionally carried forward.

### Room-script localization and source changes

These room scripts have local edits. Most changes add translated keys, dynamic-name values, gender branches, or stable localization keys; some also correct source wording. Compare the diff for each room with the new scene before carrying it over:

`room000`, `room002`, `room004`, `room005`, `room007`–`room014`, `room018`, `room020`, `room023`–`room028`, `room030`, `room031`, `room032`, `room040`, `room041`, `room050`–`room055`, `room057`, `room058`, `room075`, `room077`, `room078`, `room100`–`room103`, `room125`, `room150`–`room152`, `room154`, `room155`, `room170`–`room178` (except `room172`, which is unchanged), `room180`–`room186`, `room193`, `room195`–`room201`, `room228`, `room375`, `room400`, `room455`, `room481`, `room589`, `room602`, and `room775`.

Key-specific QA status and the exact next translation key are in the progress note in `l10n/README.md`. The current work is incomplete: the latest full source scan recorded 9,198 untranslated keys per locale across this checkout on 2026-11-04. Rooms 0–200 are covered, and Rooms 213–252 have also been translated; the next key in room order is `room.300.chat.0.text`. These historical counts describe this checkout before source extraction against developer version 0.28.3.

### Intentional English-source/content corrections to review with v1.0

These edits change the local English game text as well as its translations. They should be reviewed as product/content changes before carrying them into a release:

- Room 14 chat 49 replaces the “your father” reference with “some of my previous partners.”
- Room 14 chat 74 changes “your wife” to “your partner.”
- Room 14 chat 54 corrects the duplicated/malformed wording around “up her ass.”
- Other previously recorded source corrections and removals are listed in the Room 0–200 and Room 52–200 progress notes in `l10n/README.md`; inspect their source diffs individually rather than copying whole room files.

This is a targeted list, not a complete inventory of every source typo correction. Use the room-script diff as the authoritative record of source wording changes.

### Private localization and dialogue tools

New files in the working tree:

- `tools/check-l10n.js`, `tools/l10n-checker.js`, `tools/package.json`, `tools/package-lock.json` — offline catalog/source checker and dependencies.
- `tools/dialogue-preview.html`, `tools/dialogue-preview.js`, `tools/DIALOGUE.md` — dialogue-format preview and implementation notes.
- `tools/TRANSLATION_CHECKS.md`, `tools/test-l10n.js`, `tools/test-l10n-player.js`, `tools/test-dialogue.js`; `tools/test-phone-guides.js` is modified — local QA helpers.
- `scripts/dialogue.js` and `scripts/l10n-format.js` are runtime files, not private tools; carry them only with the runtime changes above.

These tools are not automatically part of the public game release. Decide separately whether translator-facing documentation/checks should ship. The untracked `tools/tools/reports/room25.*` and `room26.*` files are generated reports, not runtime source.

## Suggested v1.0 port sequence

1. Keep a clean copy of the v1.0 source and record its commit/version before merging.
2. Diff the runtime files listed above against v1.0. Port the localization resolver and formatter first, then chat/dialogue UI, then setup/phone preferences and relationship forms. Keep save compatibility and script load order intact.
3. Re-run string extraction on the v1.0 room scripts. Reconcile old keys with the new source; do not assume a missing old key means the scene was removed without checking the v1.0 code.
4. Merge the three catalogs by stable key. Review changed English context and re-check placeholders, markup, and both player branches. Carry the source/content corrections separately after review.
5. Port room-script placeholder/key edits onto the v1.0 versions by hunks. Avoid replacing whole room files, since that would overwrite the developer's new gameplay changes.
6. Run the checker documented in `tools/TRANSLATION_CHECKS.md`, review all new source keys, then manually inspect changed scenes in-game. Update `l10n/README.md` and this file with the v1.0 base, ported files, unresolved conflicts, and next exact key.

## Current handoff point

- Rooms 213–252 are translated in BG/ES; Room 252 also has explicit keys for runtime-selected order/response and gift lines; next key is `room.300.chat.0.text`.
- Latest checker result on 2026-11-04: 0 errors; 9,198 source keys remain untranslated per locale across this checkout.
- At the time of this note, no comparison or merge with developer version 0.28.3, conflict resolution, commit, or push had been performed. See `MERGE_NOTES.md` for the subsequent merge.

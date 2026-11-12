# Change inventory for the future version merge

Snapshot: 2026-11-08. Comparison: tracked working tree (including staged and unstaged changes) against `c9ce235f` — the parent of the first localization commit `3580b996`. This is a useful local comparison point, **not a verified merge base for the future version**. Local HEAD at snapshot: `640a826f`. No newer release was fetched or compared.

This is a file-level index, not a list of confirmed fixes. A changed file can contain translations, source edits, refactoring, gameplay fixes or a mixture. The counts only measure the diff against that comparison point. Review actual hunks and the newer version before making decisions. Some translations are catalog-only and do not change their room script.

Tracked paths in this comparison: **206**; room scripts: **161**; other paths: **45**. The “uncommitted” column means the file had staged or unstaged changes against HEAD at snapshot time. It does not indicate who made the change.

Untracked files are not included in the table: `l10n/MERGE_NOTES.md`, this inventory, and generated reports under `tools/tools/reports/` were present or being created. The workspace-private `LOCAL_TRANSLATION_REVIEW.md` is intentionally excluded from Git and must not be uploaded; preserve it locally and consult its guidance when needed.

The six deleted phone button image paths shown below need investigation against their callers and the new assets before any merge decision. Their presence here does not imply that deletion should be repeated.

Existing contextual records: [MERGE_NOTES.md](MERGE_NOTES.md), [VERSION-PORTING.md](VERSION-PORTING.md) (historical snapshot), and [README.md](README.md).

## Shared systems, assets, catalogs and tools

| Path | Added | Removed | Uncommitted at snapshot |
| --- | ---: | ---: | :---: |
| `.gitignore` | 1 | 0 |  |
| `images/room/999_phone/bAdmin.png` | - | - |  |
| `images/room/999_phone/bBack.png` | - | - |  |
| `images/room/999_phone/bHormone.png` | - | - |  |
| `images/room/999_phone/bMap.png` | - | - |  |
| `images/room/999_phone/bStats.png` | - | - |  |
| `images/room/999_phone/bStatsx.png` | - | - |  |
| `index.html` | 7 | 1 |  |
| `l10n/README.md` | 244 | 0 | yes |
| `l10n/VERSION-PORTING.md` | 89 | 0 |  |
| `l10n/bg.js` | 16511 | 0 | yes |
| `l10n/en.js` | 3519 | 0 | yes |
| `l10n/es.js` | 16411 | 0 | yes |
| `l10n/extraction-inventory.json` | 5118 | 0 |  |
| `l10n/languages.js` | 7 | 0 |  |
| `scripts/char.js` | 35 | 11 |  |
| `scripts/chat.js` | 62 | 18 |  |
| `scripts/clothes.js` | 17 | 3 |  |
| `scripts/dialogue.js` | 323 | 0 |  |
| `scripts/gamevariables.js` | 7 | 2 |  |
| `scripts/global.js` | 1 | 0 |  |
| `scripts/inventory.js` | 120 | 49 |  |
| `scripts/l10n-format.js` | 52 | 0 |  |
| `scripts/localization.js` | 552 | 0 |  |
| `scripts/map.js` | 28 | 0 | yes |
| `scripts/nav.js` | 44 | 12 |  |
| `scripts/phone.js` | 988 | 325 | yes |
| `scripts/saves.js` | 47 | 27 |  |
| `scripts/supportingChar.js` | 146 | 37 | yes |
| `startGame.html` | 20 | 14 |  |
| `style/dialogue.css` | 172 | 0 |  |
| `style/global.css` | 356 | 0 |  |
| `tools/DIALOGUE.md` | 26 | 0 |  |
| `tools/TRANSLATION_CHECKS.md` | 70 | 0 |  |
| `tools/check-l10n.js` | 65 | 0 |  |
| `tools/dialogue-preview.html` | 53 | 0 |  |
| `tools/dialogue-preview.js` | 48 | 0 |  |
| `tools/extract-l10n.js` | 61 | 0 |  |
| `tools/l10n-checker.js` | 283 | 0 |  |
| `tools/package-lock.json` | 544 | 0 |  |
| `tools/package.json` | 13 | 0 |  |
| `tools/test-dialogue.js` | 230 | 0 |  |
| `tools/test-l10n-player.js` | 148 | 0 | yes |
| `tools/test-l10n.js` | 119 | 0 |  |
| `tools/test-phone-guides.js` | 68 | 0 |  |

## Room scripts

| Path | Added | Removed | Uncommitted at snapshot |
| --- | ---: | ---: | :---: |
| `scripts/room/room000.js` | 1 | 0 |  |
| `scripts/room/room001.js` | 32 | 19 |  |
| `scripts/room/room002.js` | 279 | 26 | yes |
| `scripts/room/room003.js` | 13 | 18 |  |
| `scripts/room/room004.js` | 48 | 14 |  |
| `scripts/room/room005.js` | 6 | 3 |  |
| `scripts/room/room007.js` | 124 | 66 |  |
| `scripts/room/room008.js` | 116 | 53 |  |
| `scripts/room/room009.js` | 13 | 4 |  |
| `scripts/room/room010.js` | 59 | 50 |  |
| `scripts/room/room011.js` | 28 | 18 |  |
| `scripts/room/room012.js` | 24 | 16 |  |
| `scripts/room/room013.js` | 171 | 113 |  |
| `scripts/room/room014.js` | 94 | 93 |  |
| `scripts/room/room015.js` | 7 | 6 |  |
| `scripts/room/room016.js` | 63 | 41 |  |
| `scripts/room/room017.js` | 11 | 6 |  |
| `scripts/room/room018.js` | 4 | 2 |  |
| `scripts/room/room020.js` | 2 | 1 |  |
| `scripts/room/room021.js` | 7 | 7 |  |
| `scripts/room/room023.js` | 224 | 79 |  |
| `scripts/room/room024.js` | 6 | 3 |  |
| `scripts/room/room025.js` | 40 | 28 |  |
| `scripts/room/room026.js` | 95 | 62 |  |
| `scripts/room/room027.js` | 9 | 5 |  |
| `scripts/room/room028.js` | 23 | 11 |  |
| `scripts/room/room030.js` | 2 | 1 |  |
| `scripts/room/room031.js` | 5 | 8 |  |
| `scripts/room/room032.js` | 25 | 15 |  |
| `scripts/room/room040.js` | 44 | 22 |  |
| `scripts/room/room041.js` | 9 | 4 |  |
| `scripts/room/room050.js` | 8 | 4 |  |
| `scripts/room/room051.js` | 21 | 0 |  |
| `scripts/room/room052.js` | 10 | 5 |  |
| `scripts/room/room053.js` | 7 | 0 |  |
| `scripts/room/room054.js` | 9 | 5 |  |
| `scripts/room/room055.js` | 1 | 0 |  |
| `scripts/room/room057.js` | 2 | 0 |  |
| `scripts/room/room058.js` | 85 | 82 |  |
| `scripts/room/room075.js` | 5 | 2 |  |
| `scripts/room/room077.js` | 2 | 1 |  |
| `scripts/room/room078.js` | 5 | 2 |  |
| `scripts/room/room100.js` | 7 | 1 |  |
| `scripts/room/room101.js` | 63 | 34 |  |
| `scripts/room/room102.js` | 13 | 8 |  |
| `scripts/room/room103.js` | 17 | 5 |  |
| `scripts/room/room125.js` | 55 | 21 |  |
| `scripts/room/room150.js` | 26 | 6 |  |
| `scripts/room/room151.js` | 2 | 0 |  |
| `scripts/room/room152.js` | 17 | 13 |  |
| `scripts/room/room154.js` | 7 | 1 |  |
| `scripts/room/room155.js` | 2 | 0 |  |
| `scripts/room/room170.js` | 85 | 28 |  |
| `scripts/room/room171.js` | 22 | 20 |  |
| `scripts/room/room173.js` | 16 | 17 |  |
| `scripts/room/room174.js` | 34 | 6 |  |
| `scripts/room/room175.js` | 7 | 1 |  |
| `scripts/room/room176.js` | 40 | 7 |  |
| `scripts/room/room177.js` | 21 | 5 |  |
| `scripts/room/room178.js` | 8 | 3 |  |
| `scripts/room/room180.js` | 20 | 12 |  |
| `scripts/room/room181.js` | 50 | 31 |  |
| `scripts/room/room182.js` | 62 | 34 |  |
| `scripts/room/room183.js` | 22 | 13 |  |
| `scripts/room/room184.js` | 7 | 4 |  |
| `scripts/room/room185.js` | 10 | 8 |  |
| `scripts/room/room186.js` | 8 | 6 |  |
| `scripts/room/room193.js` | 20 | 12 |  |
| `scripts/room/room195.js` | 1 | 1 |  |
| `scripts/room/room196.js` | 46 | 18 |  |
| `scripts/room/room197.js` | 5 | 1 |  |
| `scripts/room/room198.js` | 15 | 4 |  |
| `scripts/room/room199.js` | 3 | 1 |  |
| `scripts/room/room200.js` | 96 | 57 |  |
| `scripts/room/room201.js` | 7 | 4 |  |
| `scripts/room/room203.js` | 53 | 41 |  |
| `scripts/room/room204.js` | 4 | 2 |  |
| `scripts/room/room205.js` | 9 | 9 |  |
| `scripts/room/room206.js` | 4 | 2 |  |
| `scripts/room/room207.js` | 6 | 2 |  |
| `scripts/room/room209.js` | 16 | 12 |  |
| `scripts/room/room211.js` | 25 | 14 |  |
| `scripts/room/room212.js` | 4 | 3 |  |
| `scripts/room/room213.js` | 6 | 5 |  |
| `scripts/room/room215.js` | 17 | 12 |  |
| `scripts/room/room216.js` | 4 | 3 |  |
| `scripts/room/room217.js` | 6 | 6 |  |
| `scripts/room/room218.js` | 6 | 3 |  |
| `scripts/room/room220.js` | 2 | 1 |  |
| `scripts/room/room221.js` | 2 | 1 |  |
| `scripts/room/room222.js` | 7 | 3 |  |
| `scripts/room/room223.js` | 8 | 5 |  |
| `scripts/room/room226.js` | 16 | 9 |  |
| `scripts/room/room228.js` | 3 | 1 |  |
| `scripts/room/room250.js` | 8 | 5 |  |
| `scripts/room/room251.js` | 19 | 18 |  |
| `scripts/room/room252.js` | 185 | 74 |  |
| `scripts/room/room300.js` | 29 | 18 |  |
| `scripts/room/room301.js` | 56 | 40 |  |
| `scripts/room/room303.js` | 1 | 1 |  |
| `scripts/room/room304.js` | 6 | 3 |  |
| `scripts/room/room310.js` | 7 | 5 |  |
| `scripts/room/room315.js` | 18 | 9 |  |
| `scripts/room/room316.js` | 90 | 66 |  |
| `scripts/room/room318.js` | 149 | 94 |  |
| `scripts/room/room320.js` | 15 | 1 |  |
| `scripts/room/room321.js` | 142 | 98 |  |
| `scripts/room/room322.js` | 280 | 191 |  |
| `scripts/room/room325.js` | 144 | 76 |  |
| `scripts/room/room326.js` | 7 | 1 | yes |
| `scripts/room/room327.js` | 32 | 14 |  |
| `scripts/room/room328.js` | 92 | 51 | yes |
| `scripts/room/room329.js` | 41 | 23 | yes |
| `scripts/room/room330.js` | 6 | 3 | yes |
| `scripts/room/room350.js` | 33 | 19 | yes |
| `scripts/room/room351.js` | 2 | 1 | yes |
| `scripts/room/room352.js` | 23 | 11 | yes |
| `scripts/room/room353.js` | 21 | 6 | yes |
| `scripts/room/room354.js` | 36 | 13 | yes |
| `scripts/room/room375.js` | 4 | 2 |  |
| `scripts/room/room376.js` | 1 | 1 | yes |
| `scripts/room/room400.js` | 15 | 1 |  |
| `scripts/room/room401.js` | 38 | 31 |  |
| `scripts/room/room402.js` | 6 | 4 | yes |
| `scripts/room/room403.js` | 37 | 23 | yes |
| `scripts/room/room404.js` | 12 | 7 | yes |
| `scripts/room/room405.js` | 10 | 4 | yes |
| `scripts/room/room406.js` | 18 | 10 | yes |
| `scripts/room/room407.js` | 30 | 20 | yes |
| `scripts/room/room408.js` | 21 | 5 | yes |
| `scripts/room/room450.js` | 13 | 2 | yes |
| `scripts/room/room451.js` | 29 | 6 | yes |
| `scripts/room/room452.js` | 10 | 0 | yes |
| `scripts/room/room455.js` | 8 | 4 |  |
| `scripts/room/room456.js` | 7 | 6 | yes |
| `scripts/room/room460.js` | 20 | 0 | yes |
| `scripts/room/room461.js` | 18 | 9 | yes |
| `scripts/room/room475.js` | 3 | 0 | yes |
| `scripts/room/room476.js` | 30 | 19 | yes |
| `scripts/room/room477.js` | 10 | 5 | yes |
| `scripts/room/room478.js` | 9 | 6 | yes |
| `scripts/room/room479.js` | 6 | 1 | yes |
| `scripts/room/room481.js` | 12 | 9 |  |
| `scripts/room/room482.js` | 8 | 4 |  |
| `scripts/room/room484.js` | 4 | 2 |  |
| `scripts/room/room485.js` | 1 | 9 |  |
| `scripts/room/room488.js` | 2 | 1 |  |
| `scripts/room/room500.js` | 17 | 10 |  |
| `scripts/room/room501.js` | 2 | 0 |  |
| `scripts/room/room503.js` | 4 | 0 |  |
| `scripts/room/room586.js` | 1 | 0 |  |
| `scripts/room/room588.js` | 2 | 2 |  |
| `scripts/room/room589.js` | 5 | 4 |  |
| `scripts/room/room602.js` | 11 | 1 |  |
| `scripts/room/room775.js` | 43 | 17 |  |
| `scripts/room/room901.js` | 5 | 0 |  |
| `scripts/room/room903.js` | 23 | 3 |  |
| `scripts/room/room910.js` | 3 | 3 |  |
| `scripts/room/room911.js` | 2 | 0 |  |
| `scripts/room/room950.js` | 2 | 0 |  |
| `scripts/room/room958.js` | 10 | 1 |  |

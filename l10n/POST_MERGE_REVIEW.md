# Post-merge source issue review (0.28.3)

The source bug notes in `MERGE_NOTES.md` and `README.md` are being checked against the merged 0.28.3 branch. A source observation alone does not settle the intended game rule; check the rendered route before changing prices, rewards or story conditions.

The concise, shareable list of confirmed local gameplay fixes is in [UPSTREAM_BUG_REPORTS.md](UPSTREAM_BUG_REPORTS.md).

| Room | 0.28.3 finding | Decision | Remaining check |
| --- | --- | --- | --- |
| 250 | The active Jeffery envelope branch skipped Holly's button and navigation. | Fixed locally; see `MERGE_NOTES.md` and focused test. | Old-save scene; compare the developer's later patch. |
| 479 | The repeat ledge entry at chat 49 pointed to absent chat 999, while the first entry proceeds through chat 50 with the same `ledge2` callback. | Corrected the repeat choice to chat 50. | Verify the repeat scene's image and dialogue transition in game. |
| 486 | The Room 12 mask dispatch calls absent chat 10012. The separate `1012` branch only assigns an unused array; there is no complete instruction to reuse. | Open; the intended Room 12 prompt is missing in 0.28.3. | Inspect Room 12 and compare later upstream content before authoring a prompt. |
| 527 | The `zoey10` callback blocks players below piss level 2, but chat 6's choice says level 4. | Corrected EN/BG/ES requirement text to level 2. | Check the choice at levels 1 and 2 in game. |
| 552 | Chat 7's `reset` callback had no handler. | Added a return to Room 552, which rebuilds the changing room after the encounter. | Confirm the ending and overlay cleanup in game. |
| 628 | Entry checks for $10 but does not deduct it. `g.internal.c > 5` tests a field never initialized in this room. | Open; both are present in 0.28.3. The intended price and guarantee counter need confirmation. | Play first and repeat ball tosses, then decide the money and counter rules. |
| 650 | Charlie's envelope route checked `haskey` instead of returned property `hasKey`. | Fixed locally; see `MERGE_NOTES.md`. | Confirm both clue branches in game. |
| 725 | Each drink stores `levels.beer()` as `g.internal.b`; the warning checked `g.internal.nextOneDrunk`. | Corrected the warning check to `g.internal.b.nextOneDrunk`. | Verify the warning at the drink threshold in game. |
| 902 | The upstream room still has a misspelled `resest` dialogue handler and two callers; chat 23 calls `reset` without a dialogue handler. | Already standardized to `reset` in our pre-merge work. No `resest` remains in the merged branch. | Verify the student-ID and locker return choices in game. |
| 951 | Chat 3's closed-mouth choice calls missing `boxa0`; no matching image exists. Chats 10–11 have no incoming reference in this room. | Open; the intended visual or missing branch cannot be inferred. | Check both box variants and compare the next upstream patch. |
| 953 | Chat 21's provider confirmation called `e17`, undoing `eman` by resetting the rank to `Sissy?`. Chat 25 called missing `xend`, although `xend.webp` exists. | Kept the provider rank through a visual-only callback and added the supplied farewell image to the image handler. Removed a duplicate rank assignment in `e17`. | Play both rank choices and the farewell path. |
| 954 | The lone-route police button was registered to Room 228, whose button handler has no `t29` case. | Registered both police buttons to Room 954 and added its click route to chat 53 with the existing `t29` image. | Try the button and dialogue choice in the lone route. |
| 954, other branches | Chat 21's punishment choices share a destination and image; chat 78 repeats the beam action text after chat 77. | Open; the intended alternatives and wording are unclear from source. | Review these branches in game and compare the next upstream patch. |
| 956 | The `room954` callback sends `g.pass = "pussy"`, which Room 954 cannot handle; no current dialogue choice calls this callback. Chat 28 goes to 30, leaving chat 29 without an incoming route in this room. | Open; the invalid handoff is dormant in this version, and the intended dialogue sequence needs context. | Check the transformation ending in game and compare later upstream routes before changing either branch. |
| 726 | The $20 drink path checks funds but has no deduction in `lostgirl3_1`. | Open; still present in 0.28.3. The subsequent dialogue and intended payer need review. | Play the offer with sufficient and insufficient funds. |
| 910 | Name change dialogue states $100 and one change; `changeit` swaps names without a deduction and the one-change gate is commented out. | Open; still present in 0.28.3. | Check intended repeat behavior and whether the charge should occur on confirmation. |
| 751 | The fortune repeats the same `totalDaysWorked === 0` branch three times; relationship and side-event selections have empty handlers, as does the daily-complete branch. | Open; 0.28.3 still contains these unfinished paths. | Review the fortune and menus in game, then compare the next upstream release. |

Other source issue notes remain in `MERGE_NOTES.md` and `IN_GAME_QA.md`; this table records the first reviewed batch, not a claim that the backlog is closed.

# Post-merge source issue review (0.28.3)

The source bug notes in `MERGE_NOTES.md` and `README.md` are being checked against the merged 0.28.3 branch. A source observation alone does not settle the intended game rule; check the rendered route before changing prices, rewards or story conditions.

| Room | 0.28.3 finding | Decision | Remaining check |
| --- | --- | --- | --- |
| 250 | The active Jeffery envelope branch skipped Holly's button and navigation. | Fixed locally; see `MERGE_NOTES.md` and focused test. | Old-save scene; compare the developer's later patch. |
| 552 | Chat 7's `reset` callback had no handler. | Added a return to Room 552, which rebuilds the changing room after the encounter. | Confirm the ending and overlay cleanup in game. |
| 628 | Entry checks for $10 but does not deduct it. `g.internal.c > 5` tests a field never initialized in this room. | Open; both are present in 0.28.3. The intended price and guarantee counter need confirmation. | Play first and repeat ball tosses, then decide the money and counter rules. |
| 650 | Charlie's envelope route checked `haskey` instead of returned property `hasKey`. | Fixed locally; see `MERGE_NOTES.md`. | Confirm both clue branches in game. |
| 725 | Each drink stores `levels.beer()` as `g.internal.b`; the warning checked `g.internal.nextOneDrunk`. | Corrected the warning check to `g.internal.b.nextOneDrunk`. | Verify the warning at the drink threshold in game. |
| 726 | The $20 drink path checks funds but has no deduction in `lostgirl3_1`. | Open; still present in 0.28.3. The subsequent dialogue and intended payer need review. | Play the offer with sufficient and insufficient funds. |
| 910 | Name change dialogue states $100 and one change; `changeit` swaps names without a deduction and the one-change gate is commented out. | Open; still present in 0.28.3. | Check intended repeat behavior and whether the charge should occur on confirmation. |

Other source issue notes remain in `MERGE_NOTES.md` and `IN_GAME_QA.md`; this table records the first reviewed batch, not a claim that the backlog is closed.

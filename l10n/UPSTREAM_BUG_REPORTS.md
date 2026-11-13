# Bug reports for FapForce5 — 0.28.3

This is the shareable list of **gameplay code fixes made after the 0.28.3 merge**. Update it when another confirmed fix is committed. These are local fixes on `feature/localization-0.28.3`; none has been sent from this workspace. The base developer commit reviewed here is `81788c32` (`v 0.28.3 update`). Recheck each issue against the next developer patch before carrying the local fix forward.

## Ready to report: Naked Beaver interaction disappears (Room 250)

**Observed:** A Discord player using JoiPlay showed the Naked Beaver with Holly visible but no interaction button. They said this followed the cult letter and may involve an older save. The developer said he found a likely cause and plans a fix in the November release; his exact fix is not available in this checkout.

**Reproduction state:** Enter Room 250 during the day, while clothed, with `missy.getenvelope("jeffery").active === true`. The game's Room 250 `main` takes an empty branch and never creates `hollyStand` or the room navigation. This state explains the screenshot independently of whether the save is old. The save itself has not been inspected here.

**Local fix:** Let the ordinary room setup draw Holly and navigation while the envelope is active. Clicking Holly opens chat 26, which offers the route to Jeffery. The old fallback also called `missy.envelope("jeffery")` as a function even though `missy.envelope` is an array; this invalid call was removed. Commit `1e360158`, `scripts/room/room250.js`.

**Verification:** A focused source-driven test covers the active-envelope button, navigation and chat 26, plus the normal post-case conversation. Still needs an old-save in-game check.

## Source-confirmed fixes; reproduce in game before sending

| Room | Developer 0.28.3 code | Expected symptom | Local fix |
| --- | --- | --- | --- |
| 650, Charlie/cult letter | Callback `cx` checks `.haskey`, while `missy.getenvelope()` returns `.hasKey`. | The clue-bearing dialogue branch at chat 64 cannot be selected. | Changed the property to `.hasKey` in `scripts/room/room650.js`, commit `dbb95ef9`. |
| 552, changing room | Chat 7's final choice calls `reset`, but `room552.chatcatch` has no `reset` case. | The encounter ends without rebuilding the changing room. | Added `reset` → `char.room(552)` in `scripts/room/room552.js`, commit `40e2cba9`. |
| 725, club bar | Drinks save `levels.beer()` under `g.internal.b`, while chat 1000 checks `g.internal.nextOneDrunk`. | The warning before another drink/passout does not appear when the flag is true. | Read `g.internal.b.nextOneDrunk` in `scripts/room/room725.js`, commit `40e2cba9`. |
| 902, girls' locker room | The source has two dialogue choices calling `resest` and a matching misspelled handler, while chat 23 calls `reset` without a dialogue callback handler. | Chat 23's return action does nothing. The duplicate reset spelling also makes the routes easy to diverge. | Standardized the dialogue handler and both `resest` callers to `reset` before the 0.28.3 merge; the old `resest` trigger is absent from our branch. This change was included in the pre-merge localization checkpoint `cd833ba5`. |

All four conditions above are present in developer commit `81788c32`. Automated tests cover the Room 552 return and Room 725 warning; Room 650's property name and Room 902's dialogue callbacks were checked against their handlers.

## Open observations, not yet reports

Room 628's $10 payment and unused counter, Room 726's $20 drink, and Room 910's name-change price/limit still need the intended rules confirmed. Room 525's Chef route has missing dialogue and empty handlers. Their status and checks are in [POST_MERGE_REVIEW.md](POST_MERGE_REVIEW.md). Do not send these as established fixes yet.

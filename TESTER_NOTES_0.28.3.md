# Hermaphrodity 0.28.3 — Bulgarian and European Spanish test build

This is an **unofficial test build** based on the game's 0.28.3 update. It adds Bulgarian and European Spanish language packs, interface options, and a number of fixes. The translations have passed automated checks, but they still need playtesting. Please report text, layout, and save issues with a screenshot, the selected language, and the room or scene if you know it.

Extract the complete game archive, open `startGame.html`, and select a language on the title screen. Keep the extracted `images`, `scripts`, `style`, and `l10n` folders beside that file.

## What you can test

- **Languages:** Select English, Bulgarian, or European Spanish on the title screen or in the phone settings. Dialogue, choices, character names, many location names, map schedules, phone guides, inventory text, status panels, and interface messages have translations. Player-renamed names should remain as entered.
- **Dialogue display:** Choose between the original Classic layout and a new Enhanced layout. Reading settings include text size, background opacity, and line spacing. You can hide dialogue, skip it, and review up to 80 recent passages from the current play session. Reading preferences are stored in the browser.
- **Player wording:** Bulgarian and Spanish lines can change grammatical gender according to the player's pronoun setting (male, female, or appearance). Some lines also use the player's chosen name and renamed characters.
- **Relationship words:** The new-game screen and Phone → Characters/Relationships let you edit the names and optional grammatical forms used for the landlady and the two co-tenants. Bulgarian offers suggestions for some forms, but you can override them. Older saves may need these optional fields filled in manually for natural wording.
- **Glossary and French lines:** A small glossary explains a few story terms. Zoey's French phrases have inline translations in the three supported languages.
- **Image buttons and sidebar:** Many action images now show translated text without changing their click targets. The sidebar headings and longer descriptions have been adjusted to fit Bulgarian and Spanish. Some English text baked into artwork is still present.
- **Continue and refresh:** The title screen has a Continue button. In the same browser tab it first tries to resume the last visited room; otherwise it uses the newest compatible manual or automatic save. F5 resumes at the **entrance to the current room**, so dialogue and actions since entering that room may need to be replayed. During the intro or character setup, F5 returns to the title screen.
- **Return to title:** Phone → Settings → Main Menu returns to the title without deleting save slots. Continue can take you back into the game. New Game starts a fresh game and clears the current tab's unsaved room checkpoint.

## Scene fixes worth checking

These changes were checked against the game's code; the affected paths still need real playtesting.

| Room | What to try |
| --- | --- |
| 10, bedroom | The background layers should appear together when the room loads. |
| 250, Naked Beaver | After the cult letter, Holly and the room navigation should remain clickable. |
| 404–407, optician and makeup | Check dialogue progression, insufficient-funds messages, lens prices, and overlapping action buttons. |
| 479 | The repeated ledge route should advance instead of pointing to a missing dialogue. |
| 486 | The Room 9 action should remove the correct button after use. |
| 487 | Each of the five partner choices should enter the selected character's scene. |
| 501 | Check who speaks the corrected line and whether the purse action is labeled correctly. |
| 527 | Zoey's bathroom requirement should say level 2, matching the actual check. |
| 552 | The encounter's final choice should return to the changing room. |
| 650 | Charlie's clue dialogue should work when the required key is held. |
| 725 | The warning before another drink should appear at the relevant threshold. |
| 902 | The locker-room return choices should lead back correctly. |
| 953 | The selected cult rank should remain selected, and the farewell image should appear. |
| 954 | The police image button should open its dialogue. |

## Please check especially

1. Load an older save, then save and reload it in this build.
2. Switch English → Bulgarian → Spanish → English during play, including after renaming a character.
3. Check long choices, image-button labels, sidebar text, and the phone on different screen sizes.
4. Try F5 in a normal room, during character setup, and after returning to the title through the phone.
5. Report any untranslated English text that is **not** part of an image, plus any wording that does not match the player's selected form.

The test branch is `feature/localization-0.28.3` at <https://github.com/AcTePuKc/HatMP/tree/feature/localization-0.28.3>. This document describes the current branch; it is not a claim that every scene or old save has been verified in game.

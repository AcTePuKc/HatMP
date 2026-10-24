# HatMP language packs

Language packs are JavaScript files named for their locale, such as `es.js` or `pt-BR.js`. Each file registers a JSON-shaped data object in `window.HatMPLocales`; it should contain data only, with no executable translation logic. Add the locale and its native display name to `languages.js` so it appears in the game's language selectors.

Packs use `.js` so the game can load them as regular scripts when opened directly from disk (`file://`), where browsers restrict fetching separate JSON files. Since a script can execute code, language pack contributions should be reviewed before they are included in a release.

## Pack format

```js
window.HatMPLocales = window.HatMPLocales || {};
window.HatMPLocales.es = {
  "_meta": {
    "locale": "es",
    "nativeName": "Español",
    "direction": "ltr",
    "author": "Translator name",
    "translator": "Translator name",
    "packVersion": "0.1.0",
    "targetGameVersion": "0.28.2",
    "lastTestedGameVersion": "0.28.2",
    "fallbackLocale": "en",
    "completeness": "partial"
  },
  "strings": {
    "ui.language": "Idioma"
  },
  "names": {
    "lola": { "source": "Lola", "display": "Лола" },
    "eva": { "source": "Eva", "display": "Ева" }
  },
  "terms": {
    "landlady": {
      "display": "Casera",
      "lower": "casera"
    },
    "coTenant": {
      "plural": "Compañeras de piso",
      "pluralLower": "compañeras de piso",
      "singular": "Compañera de piso",
      "singularLower": "compañera de piso"
    }
  }
};
```

The game loads the selected pack and uses English for any missing key. A game-version mismatch is reported in the browser console; it does not prevent the pack from loading. Update `packVersion` when publishing a revised pack and `lastTestedGameVersion` after checking it against a game build.

## Character names

Use the `names` section for locale-specific spellings or transliterations of proper names. Each entry needs the game's canonical source spelling and the spelling to show in that locale. The shared `sc.n("lola")` helper applies the selected spelling wherever the game asks it for that character's display name, including name lists. A player-customized name is kept as entered. Names written directly into a sentence as literal text must be moved to a translation key and placeholder before this mapping can affect them. Translate titles or relationship words as part of a character's display label only when that whole label is the character's canonical name; use `terms` for role words that appear in dialogue and need grammatical forms.

Use explicit descriptive `l10nKey` values on translated chat entries and choices, such as `lola.massage.opening` and `lola.massage.begin`. The runtime can derive a room/chat key as a fallback while migrating old content, but new translated lines should have explicit IDs so moving dialogue within a room does not break translations. Put the entire sentence in the translation and use `{placeholder}` tokens for character names or changing values so translators can move them to fit their language.

## Character phone guides

Phone guide strings use stable character and mission IDs rather than array positions. Use `phone.characterGuide.<characterId>.<missionId>.title` and `.description`, with tasks keyed by their task ID as `.task.<taskId>`. Ending mission IDs begin with `ending_` in localization keys (for example, source mission `*wife` uses `ending_wife`). Missing keys fall back to the original English guide text, so packs can translate a few guides at a time. Keep the English source strings in `en.js` alongside each translated batch. Guide source strings and translations can use `{characterId}` placeholders (such as `{lola}` or `{landlord}`); the phone guide renderer supplies the current localized or player-customized character term.

## Player-entered relationship words

Room 2 lets the player choose what to call the landlady and what Lola and Eva are to them. Locale `terms` provide starting suggestions only. The player's edits take precedence and are saved with the game, so a language pack cannot replace a custom choice. The landlady field collects one word or form of address; capitalization can be derived, but grammatical forms cannot. Its hover hint explains that players should choose a form that reads naturally in sentences. The co-tenant relationship asks for both plural and singular forms; the game must not guess a singular by stripping a suffix. Existing code that calls `sc.n("el")` or `sc.el()` gets the singular form. New translated sentences that refer to both people should request `sc.els()` for the plural form.

Capitalization and lowercasing can be derived with locale-aware text operations. Grammatical forms such as singular, plural, or case cannot be guessed reliably. When localizing sentences that use these values, translate the complete sentence and pass the exact needed form as a placeholder. If a language needs more forms, the game must collect or otherwise obtain them rather than guessing by adding or removing suffixes.

## Other character term forms

Use `strings` for complete sentences and `terms` for recurring character labels or role words that need different forms in a sentence. Form names are chosen by the language pack; common examples include `display`, `lower`, `plural`, `pluralLower`, or a language-specific form such as `possessive`. Do not build translated sentences by adding suffixes to a term in JavaScript. Player-entered co-tenant singular and plural forms may be typed in ordinary lowercase; use `sc.el("capitalize")` or `sc.els("capitalize")` at sentence starts and `sc.el("lower")` or `sc.els("lower")` where lowercase is required. The default calls preserve the player's entered casing.

When a translated line needs a particular form for a code-defined term, request that form in the game code and pass the returned text as a normal placeholder:

```js
var jobTitle = l10n.characterTerm("jobTitle", "lower", currentTitle, "Foreman");
l10n.t("dialogue.job.intro", "She works as a {title}.", { title: jobTitle });
```

`characterTerm` uses the selected pack's form, then English, then the source value. It compares the current value with the source default so a player's custom label is preserved. A custom label can be lowercased on request; other inflected forms cannot be inferred reliably, so use it as entered unless the player provides those forms separately. Keep proper names as ordinary placeholders; use term forms for role words such as `Landlady` or `Co-Tenant`.

The introductory screen is a good reference for long translated text. Chat bubbles wrap naturally and the dialogue panel can scroll when the translated text is taller. Keep intentional paragraph breaks; do not copy English line breaks into a translation when the language needs different wrapping.

## Map labels

Map destination labels have room for one line only. Keep them short and prefer a familiar place name over a full descriptive phrase. As a working limit at the current map size, aim for **up to 15 Latin characters** or **up to 14 Cyrillic characters**, including spaces. These are approximate character budgets, not strict width guarantees: Cyrillic letters, accents, capitalization, and other scripts can take more horizontal space. For reference, Spanish `Entrada de PI` (13 characters) fits with a little room left, while Bulgarian `Входът на Миси` (14 characters) is close to the available width. If a language uses wider glyphs, use a shorter label. Check labels in the running game and shorten any that look cramped or trigger smaller text.

## Text embedded in images

Keep the original artwork and move embedded interface text into localization keys. For flat backgrounds, use `phone.addLocalizedPanelText` to cover the source label and draw translated text at the same logical game coordinates. For interactive text controls, use `phone.addLocalizedButton` so the existing room event name and click behavior are retained. Match the cover color to the image, keep it away from artwork, and make sure long translations fit or wrap within the available area. Check each language in the running game because OCR and source-image inspection cannot confirm visual alignment.

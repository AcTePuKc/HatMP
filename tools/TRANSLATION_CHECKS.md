# Translation checks

The checker reads language packs and game source without running them or editing translations. It produces a searchable, offline HTML report and a JSON report. Translators can open the HTML report in a browser without installing anything. To generate a fresh report, install Node.js and the development dependencies once:

```sh
npm ci --prefix tools
```

Run commands from the HatMP game folder:

```sh
# Check every language pack (including English).
npm run l10n --prefix tools

# Check one language, or a comma-separated list.
npm run l10n --prefix tools -- --locale bg,es

# Review a small batch, e.g. the dialogue controls or one room.
npm run l10n --prefix tools -- --locale bg --prefix dialogue.
npm run l10n --prefix tools -- --locale es --prefix room.13.

# Check source-only keys too (this is already enabled by default).
npm run l10n --prefix tools -- --locale bg --prefix room.13.

# Check catalog entries only, without scanning source-only keys.
npm run l10n --prefix tools -- --locale bg --catalog-only

# Keep a separate report for this batch (paths are relative to your current directory).
npm run l10n --prefix tools -- --locale bg --prefix dialogue. --out tools/reports/dialogue-bg
```

The default output is `tools/reports/l10n-report.html` and `tools/reports/l10n-report.json`. Each run replaces those generated files, unless `--out` names a different report. Generated reports are excluded from Git. They contain game text, including possible spoilers; they are review documents rather than player-facing pages.

## Reading the report

- **Errors:** likely breakages, including invalid JavaScript, duplicate keys, values that are not strings, broken markup, and unexpected placeholder names. Each entry gives a file, line and key. Expand “Compare source and translation” to see the exact text and source location. Pack structure errors can prevent checks of the rest of that pack.
- **Review items:** missing/empty translations, keys repeated across the root and `strings` sections, or source placeholders omitted in translation. Missing translations normally fall back to English. A missing placeholder might be an intentional pronoun or grammatical rewrite: review it before changing the wording.
- **Unverified/source notes:** the source is dynamic, ambiguous, or was not found by the static scanner. These keys are not automatically wrong or obsolete. Check them in the running game. The report hides these notes initially; choose “Everything” or “Unverified/source notes” to see them.

Search by a key prefix, text, filename or message. Filter by language or severity. Exit code 0 means no errors were found (review items may remain); 1 means errors were found; 2 means the checker could not run. A report from the existing working catalogs may contain errors predating this tool. It never fixes or rewrites translations automatically.

## Placeholders and grammatical forms

Keep placeholder names such as `{me}` intact. Translators may change their order and repeat them. `{els}` and `{els:pluralDefinite}` have the same base name for comparison, so a grammatical form does not create a false mismatch. The runtime supports form suffixes for `el`, `els` and `landlady` only. The checker does not determine which grammatical form a sentence needs or validate every custom form name.

For complete literal source strings, the checker compares placeholder names. When a source string is built dynamically but declares `l10nValues`, it checks for unexpected names against that declaration without requiring every available value to appear. The shared relationship-form placeholders are also recognized. An intentionally omitted source placeholder produces a review item, not a hard error.

Player agreement uses `[[player:masculine|feminine]]`, for example `Estoy [[player:listo|lista]].` It can contain words, phrases, whole sentences, placeholders, or markup. Both alternatives are required and nesting is unsupported. The same parser is shared by the runtime and checker. Malformed syntax is a `player-branch` error; valid branches are expanded into complete masculine and feminine messages before checking HTML and placeholders. A defect in only the feminine alternative is reported as such. A neutral translation is checked against both alternatives of a branched English source. See the [translator guide](../l10n/README.md#player-pronouns-and-grammatical-agreement) for scope, escaping, fallback, and migration guidance.

The checker cannot infer missing agreement in an otherwise ordinary sentence. A clean report means the marked alternatives are structurally valid, not that every gender-sensitive line has been found or translated correctly.

Values inside `strings` must be strings. For example:

```js
"example.greeting": "Hello, {me}!"
```

Do not replace that value with an object such as `{ text: "Hello, {me}!", values: ["me"] }`. The game supplies values in its source code; the catalog holds the translated sentence.

## Coverage and limits

English catalog entries are the primary reference. Where English has no catalog entry, the checker also reads literal `l10n.t` calls, explicit dialogue `l10nKey` values, and room dialogue arrays returned through `array[chatID]`. Both the modern `strings` section and legacy root-level string keys are supported with runtime-style precedence. The checker cannot discover every dynamically constructed key, control-flow branch, source interpolation or image label.

The default missing-key list includes both English catalog keys and statically discovered source keys. This makes untranslated rooms visible even before their English strings have been extracted into `en.js`. The HTML and JSON reports summarize missing source keys by room or scope. Empty and punctuation-only strings are omitted because they do not contain translatable wording. Add `l10nIgnore: true` to an individual dialogue entry or choice only when its value is intentionally non-translatable (for example, a player-defined outfit name or a dead placeholder). Do not use it to hide untranslated prose. Use `--prefix room.12.` to review a single room, or `--catalog-only` when you deliberately want to inspect catalog entries without the source inventory. Source discovery is static and cannot catch every key assembled dynamically at runtime; a clean report does not prove that all in-game text was found.

HTML checks detect parser errors and missing/misnested required closing tags. Optional HTML endings, such as `p` and `li`, are allowed. These checks do not certify HTML safety, translation quality, glossary consistency, or visual fit. Check long text, large font settings, custom character names and choice layouts in the game or `dialogue-preview.html` as well.

## Testing the checker

`npm test --prefix tools` includes fixtures for missing and duplicate keys, malformed packs, non-string values, valid and invalid placeholders, grammatical forms, broken HTML, source-only fallback text, report filters, and safe display of HTML-looking translation text.

// Static analysis only: never execute a language pack or a room script.
const fs = require('node:fs');
const path = require('node:path');
const acorn = require('acorn');
const parse5 = require('parse5');
const messageFormat = require('../scripts/l10n-format');

function walk(node, visit) {
    if (!node || typeof node !== 'object') return;
    if (node.type) visit(node);
    for (const [key, value] of Object.entries(node)) {
        if (key === 'loc') continue;
        if (Array.isArray(value)) value.forEach(child => walk(child, visit));
        else if (value && typeof value === 'object') walk(value, visit);
    }
}
function member(node) {
    if (!node) return '';
    if (node.type === 'Identifier') return node.name;
    if (node.type !== 'MemberExpression') return '';
    const key = node.computed ? node.property.value : node.property.name;
    return typeof key === 'string' ? member(node.object) + '.' + key : '';
}
function propertyName(prop) { return prop.computed ? undefined : (prop.key.name ?? prop.key.value); }
function property(node, key) {
    return node?.type === 'ObjectExpression' ? node.properties.find(p => p.type === 'Property' && propertyName(p) === key)?.value : undefined;
}
function literal(node) {
    if (node?.type === 'Literal' && typeof node.value === 'string') return node.value;
    if (node?.type === 'TemplateLiteral' && !node.expressions.length) return node.quasis[0].value.cooked;
    if (node?.type === 'BinaryExpression' && node.operator === '+') {
        const left = literal(node.left), right = literal(node.right);
        if (left !== undefined && right !== undefined) return left + right;
    }
}
const tokens = value => new Set(Array.from(value.matchAll(/\{([a-zA-Z0-9_]+)(?::([a-zA-Z0-9_]+))?\}/g), m => m[1]));
const voidTags = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
const optionalTags = new Set('html head body p li dt dd rt rp optgroup option colgroup thead tbody tfoot tr td th'.split(' '));

function markupProblems(value) {
    if (!/<\/?[a-zA-Z!]/.test(value)) return [];
    const issues = new Set();
    const fragment = parse5.parseFragment(value, {
        sourceCodeLocationInfo: true,
        onParseError: error => issues.add('HTML parser: ' + error.code)
    });
    function inspect(node) {
        if (node.tagName && !voidTags.has(node.tagName) && !optionalTags.has(node.tagName) &&
            node.sourceCodeLocation?.startTag && !node.sourceCodeLocation.endTag)
            issues.add('Missing closing </' + node.tagName + '> tag');
        (node.childNodes || []).forEach(inspect);
        if (node.content) inspect(node.content);
    }
    inspect(fragment);
    // The HTML parser silently discards unmatched closing tags; report those too.
    const stack = [];
    for (const match of value.matchAll(/<!--[^]*?-->|<\/?([a-zA-Z][\w:-]*)\b(?:"[^"]*"|'[^']*'|[^'">])*>/g)) {
        if (!match[1]) continue;
        const tag = match[1].toLowerCase();
        if (voidTags.has(tag) || optionalTags.has(tag)) continue;
        if (match[0].startsWith('</')) {
            if (stack.at(-1) !== tag) issues.add('Unmatched or misnested </' + tag + '> tag');
            const at = stack.lastIndexOf(tag);
            if (at >= 0) stack.splice(at);
        } else stack.push(tag);
    }
    return [...issues];
}

function readPack(file, locale, add) {
    const source = fs.readFileSync(file, 'utf8');
    let tree;
    try { tree = acorn.parse(source, { ecmaVersion: 'latest', locations: true }); }
    catch (error) { add({ severity: 'error', type: 'syntax', locale, file, line: error.loc?.line || 1, key: '', message: error.message }); return null; }
    const records = new Map();
    function data(node, trail = []) {
        if (node.type === 'Literal' && (node.value === null || ['string', 'number', 'boolean'].includes(typeof node.value))) return node.value;
        if (node.type === 'ArrayExpression') return node.elements.map((entry, index) => {
            if (!entry) throw new Error('Sparse arrays are not supported at line ' + node.loc.start.line);
            return data(entry, [...trail, String(index)]);
        });
        if (node.type === 'UnaryExpression' && ['-', '+'].includes(node.operator) && node.argument.type === 'Literal' && typeof node.argument.value === 'number')
            return node.operator === '-' ? -node.argument.value : node.argument.value;
        if (node.type !== 'ObjectExpression') throw new Error('Pack values must be plain data; unsupported ' + node.type + ' at line ' + node.loc.start.line);
        const result = Object.create(null), seen = new Set();
        for (const prop of node.properties) {
            if (prop.type !== 'Property' || prop.computed || prop.method || prop.kind !== 'init') throw new Error('Unsupported executable or computed property at line ' + prop.loc.start.line);
            const key = String(propertyName(prop));
            if (seen.has(key)) add({ severity: 'error', type: 'duplicate-key', locale, file, line: prop.loc.start.line, key: trail.length === 1 && trail[0] === 'strings' ? key : [...trail, key].join('.'), message: 'Duplicate key: the later value hides the earlier one.' });
            seen.add(key);
            result[key] = data(prop.value, [...trail, key]);
            if (trail.length === 0 || (trail.length === 1 && trail[0] === 'strings'))
                records.set([...trail, key].join('\0'), { file, line: prop.loc.start.line, key, value: result[key] });
        }
        return result;
    }
    let pack;
    try {
        for (const statement of tree.body) {
            const assignment = statement.type === 'ExpressionStatement' && statement.expression;
            const target = assignment?.type === 'AssignmentExpression' && assignment.operator === '=' ? member(assignment.left) : '';
            if (target === 'window.HatMPLocales') {
                const rhs = assignment.right;
                if (!(rhs.type === 'LogicalExpression' && rhs.operator === '||' && member(rhs.left) === target && rhs.right.type === 'ObjectExpression' && rhs.right.properties.length === 0))
                    throw new Error('Unexpected registry initialization; packs must contain data only.');
            } else if (target === 'window.HatMPLocales.' + locale && !pack) pack = data(assignment.right);
            else throw new Error('Unexpected statement at line ' + statement.loc.start.line + '; packs must contain data only.');
        }
        if (!pack || !pack.strings || typeof pack.strings !== 'object' || Array.isArray(pack.strings) || pack._meta?.locale !== locale)
            throw new Error('Expected matching _meta.locale and a strings object.');
    } catch (error) { add({ severity: 'error', type: 'pack-format', locale, file, line: 1, key: '', message: error.message }); return null; }
    const entries = new Map();
    for (const [key, value] of Object.entries(pack)) if (typeof value === 'string') entries.set(key, records.get(key));
    for (const [key, value] of Object.entries(pack.strings)) {
        const record = records.get('strings\0' + key);
        if (typeof value !== 'string') {
            add({ ...record, severity: 'error', type: 'value-type', locale, message: 'Translation must be a string.' });
            continue;
        }
        if (entries.has(key)) add({ ...record, severity: 'warning', type: 'shadowed-key', locale, message: 'This key also exists at pack root. The strings value normally takes priority; consolidate it.' });
        // Match the runtime's truthy fallback behaviour.
        if (value || !entries.has(key)) entries.set(key, record);
    }
    return { entries, pack };
}

function sourceReferences(root) {
    const refs = new Map(), diagnostics = [];
    const files = [];
    const ignored = node => property(node, 'l10nIgnore')?.type === 'Literal' && property(node, 'l10nIgnore').value === true;
    function collect(dir) {
        if (!fs.existsSync(dir)) return;
        for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
            if (item.isDirectory()) collect(path.join(dir, item.name));
            else if (item.name.endsWith('.js') && !item.name.startsWith('jquery')) files.push(path.join(dir, item.name));
        }
    }
    function record(key, textNode, valuesNode, file) {
        if (!key || !textNode) return;
        const value = literal(textNode);
        const allowed = valuesNode?.type === 'ObjectExpression' ? valuesNode.properties.filter(p => p.type === 'Property').map(propertyName).filter(Boolean) : null;
        const ref = { key, value, allowed, file, line: textNode.loc.start.line };
        if (!refs.has(key)) refs.set(key, ref);
        else if (refs.get(key).value !== value) refs.set(key, { ...ref, value: undefined, allowed: null, ambiguous: true });
    }
    collect(path.join(root, 'scripts'));
    for (const file of files) {
        let tree;
        try { tree = acorn.parse(fs.readFileSync(file, 'utf8'), { ecmaVersion: 'latest', locations: true }); }
        catch (error) { diagnostics.push({ severity: 'warning', type: 'source-scan', locale: 'source', key: '', file, line: error.loc?.line || 1, message: 'Source comparison skipped for this file: ' + error.message }); continue; }
        walk(tree, node => {
            if (node.type === 'CallExpression' && member(node.callee) === 'l10n.t') record(literal(node.arguments[0]), node.arguments[1], node.arguments[2], file);
            if (node.type === 'ObjectExpression' && !ignored(node)) record(literal(property(node, 'l10nKey')), property(node, 'text'), property(node, 'l10nValues'), file);
            if (node.type !== 'AssignmentExpression' || !/^room\d+\.chat$/.test(member(node.left))) return;
            const room = member(node.left).match(/^room(\d+)/)[1];
            const indexed = new Set();
            walk(node.right, child => {
                const arg = child.type === 'ReturnStatement' && child.argument;
                if (arg?.type === 'MemberExpression' && arg.computed && arg.object.type === 'Identifier' && arg.property.name === 'chatID') indexed.add(arg.object.name);
            });
            walk(node.right, child => {
                if (child.type !== 'VariableDeclarator' || !indexed.has(child.id.name) || child.init?.type !== 'ArrayExpression') return;
                child.init.elements.forEach((entry, index) => {
                    if (entry?.type !== 'ObjectExpression' || !property(entry, 'speaker') || ignored(entry)) return;
                    const prefix = 'room.' + room + '.chat.' + index;
                    const textNode = property(entry, 'text');
                    if (!(textNode?.type === 'CallExpression' && member(textNode.callee) === 'l10n.t'))
                        record(literal(property(entry, 'l10nKey')) || prefix + '.text', textNode, property(entry, 'l10nValues'), file);
                    const buttons = property(entry, 'button');
                    if (buttons?.type === 'ArrayExpression') buttons.elements.forEach((button, choice) => {
                        const buttonText = property(button, 'text');
                        if (button?.type === 'ObjectExpression' && !ignored(button) && !(buttonText?.type === 'CallExpression' && member(buttonText.callee) === 'l10n.t'))
                            record(literal(property(button, 'l10nKey')) || prefix + '.choice.' + choice, buttonText, property(button, 'l10nValues'), file);
                    });
                });
            });
        });
    }
    return { refs, diagnostics };
}

function needsTranslation(value) {
    // Empty dialogue slots and punctuation-only choices carry no translatable words.
    return !(typeof value === 'string' && (!value.trim() || /^[\p{P}\p{S}\s]+$/u.test(value.trim())));
}

function check(root, options = {}) {
    const issues = [], add = issue => issues.push(issue);
    const selected = options.locales || fs.readdirSync(path.join(root, 'l10n')).filter(f => /^[a-z]{2,3}(?:-[A-Z]{2})?\.js$/.test(f)).map(f => f.slice(0, -3));
    const catalogs = new Map();
    for (const locale of new Set(['en', ...selected])) {
        const file = path.join(root, 'l10n', locale + '.js');
        if (!fs.existsSync(file)) { add({ severity: 'error', type: 'missing-pack', locale, file, line: 1, key: '', message: 'Language pack does not exist.' }); continue; }
        const pack = readPack(file, locale, add);
        if (pack) catalogs.set(locale, pack);
    }
    const english = catalogs.get('en')?.entries || new Map();
    if (!selected.includes('en')) for (const [key, record] of english) {
        const expanded = messageFormat.variants(record.value);
        if (expanded.error) add({ ...record, locale: 'en', severity: 'error', type: 'player-branch', message: expanded.error });
    }
    const sources = sourceReferences(root);
    sources.diagnostics.forEach(add);
    const summaries = [];
    const matches = key => !options.prefix || key.startsWith(options.prefix);
    for (const locale of selected) {
        const catalog = catalogs.get(locale);
        if (!catalog) continue;
        let missing = 0, compared = 0, dynamic = 0, noReference = 0, sourceOnly = 0;
        const keys = new Set([...english.keys(), ...catalog.entries.keys()]);
        // Scan source-only keys by default so whole rooms cannot be silently omitted
        // merely because their English entries have not yet been extracted to en.js.
        if (options.includeSource !== false) for (const key of sources.refs.keys()) keys.add(key);
        for (const key of keys) {
            if (!matches(key)) continue;
            const translated = catalog.entries.get(key);
            const reference = english.get(key) || sources.refs.get(key);
            const source = reference?.value;
            if (!needsTranslation(source)) continue;
            if (!translated || !translated.value.trim()) {
                missing++;
                add({ severity: 'warning', type: 'missing', locale, file: translated?.file || path.join(root, 'l10n', locale + '.js'), line: translated?.line || 1, key, source, referenceFile: reference?.file, referenceLine: reference?.line, message: 'Missing or empty translation; the game falls back to English/source text.' });
                continue;
            }
            const base = { ...translated, locale, source, referenceFile: reference?.file, referenceLine: reference?.line };
            const expanded = messageFormat.variants(translated.value);
            if (expanded.error) {
                add({ ...base, severity: 'error', type: 'player-branch', message: expanded.error + ' The game will use fallback text.' });
                continue;
            }
            const referenceVariants = source === undefined ? null : messageFormat.variants(source);
            const verifiable = reference && (source !== undefined || reference.allowed) && !referenceVariants?.error;
            if (locale !== 'en') {
                if (!verifiable) {
                    noReference++;
                    add({ ...base, severity: 'info', type: 'unverified-source', message: 'No valid, unambiguous English text or placeholder list could be read statically. Check this key in the game; it is not necessarily obsolete.' });
                } else {
                    if (!english.has(key)) sourceOnly++;
                    if (source === undefined) dynamic++; else compared++;
                }
            }
            // Check complete rendered alternatives, not fragments: tags and placeholders
            // can surround a branch or occur in only one grammatical construction.
            // A neutral translation must also be checked against both source variants.
            const alternatives = expanded.branched ? expanded.variants : referenceVariants?.branched ?
                referenceVariants.variants.map(v => ({ name: v.name, text: translated.value })) : expanded.variants;
            for (const variant of alternatives) {
                const addVariant = issue => add({ ...base, ...issue, variant: variant.name,
                    message: (variant.name ? variant.name + ' alternative: ' : '') + issue.message });
                for (const message of markupProblems(variant.text)) addVariant({ severity: 'error', type: 'markup', message });
                for (const match of variant.text.matchAll(/\{([a-zA-Z0-9_]+):([a-zA-Z0-9_]+)\}/g)) {
                    if (!['el', 'els', 'landlady'].includes(match[1])) addVariant({ severity: 'error', type: 'placeholders', message: 'Unsupported form placeholder ' + match[0] + '. The runtime supports form suffixes only for el, els and landlady.' });
                }
                if (locale === 'en' || !verifiable) continue;
                const sourceText = referenceVariants && (referenceVariants.variants.find(v => v.name === variant.name) || referenceVariants.variants[0]).text;
                const actual = tokens(variant.text);
                const expected = sourceText != null ? tokens(sourceText) : new Set(reference.allowed);
                const declared = new Set(sources.refs.get(key)?.allowed || []);
                const formNames = new Set(Array.from(variant.text.matchAll(/\{(el|els|landlady):[a-zA-Z0-9_]+\}/g), match => match[1]));
                const extra = [...actual].filter(name => !expected.has(name) && !declared.has(name) && !formNames.has(name));
                const absent = sourceText == null ? [] : [...expected].filter(name => !actual.has(name));
                if (extra.length || absent.length) addVariant({ severity: extra.length ? 'error' : 'warning', type: 'placeholders', message: [absent.length ? 'Source placeholders omitted: ' + absent.join(', ') : '', extra.length ? 'Unexpected placeholders: ' + extra.join(', ') : ''].filter(Boolean).join('. ') + (extra.length ? '. Check spelling and the values supplied by the game.' : '. Review whether the omission or grammatical rephrasing is intentional. Placeholder order and grammatical form suffixes may change.') });
            }
        }
        const sourceKeys = options.includeSource === false ? [] : [...sources.refs.keys()].filter(key => matches(key) && needsTranslation(sources.refs.get(key)?.value));
        const sourceMissing = sourceKeys.filter(key => {
            const translated = catalog.entries.get(key);
            return !translated || !translated.value.trim();
        });
        const missingByScope = {};
        for (const key of sourceMissing) {
            const room = key.match(/^room\.(\d+)\./);
            const scope = room ? 'room.' + Number(room[1]) : key.split('.').slice(0, 2).join('.');
            missingByScope[scope] = (missingByScope[scope] || 0) + 1;
        }
        summaries.push({ locale, keys: [...catalog.entries.keys()].filter(matches).length, missing, compared, dynamic, sourceOnly, sourceKeys: sourceKeys.length, sourceMissing: sourceMissing.length, missingByScope, noReference });
    }
    const filtered = issues.filter(i => (!i.key || matches(i.key)) && (selected.includes(i.locale) || i.locale === 'source' || i.locale === 'en'));
    return { generatedAt: new Date().toISOString(), root, options, summaries, issues: filtered,
        counts: Object.fromEntries(['error', 'warning', 'info'].map(level => [level, filtered.filter(i => i.severity === level).length])) };
}

module.exports = { check, markupProblems, readPack, tokens, sourceReferences };

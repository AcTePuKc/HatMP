#!/usr/bin/env node
// Inventory likely visible source strings that do not go through l10n.t.
// This is a static heuristic, not proof that a branch is reachable or untranslated.
const fs = require('node:fs');
const path = require('node:path');
const acorn = require('acorn');
const parse5 = require('parse5');
const { readPack, sourceReferences } = require('./l10n-checker');

function member(node) {
    if (!node) return '';
    if (node.type === 'Identifier') return node.name;
    if (node.type === 'CallExpression') return member(node.callee) + '()';
    if (node.type !== 'MemberExpression') return '';
    const key = node.computed ? node.property.value : node.property.name;
    return typeof key === 'string' ? member(node.object) + '.' + key : '';
}
function prop(obj, name) {
    return obj?.type === 'ObjectExpression' ? obj.properties.find(p => p.type === 'Property' && !p.computed && (p.key.name ?? p.key.value) === name)?.value : undefined;
}
function textExpression(node) {
    if (!node || node.type === 'CallExpression' && member(node.callee) === 'l10n.t') return null;
    if (node.type === 'Literal' && typeof node.value === 'string') return { text: node.value, dynamic: false };
    if (node.type === 'TemplateLiteral') return { text: node.quasis.map((q, i) => q.value.cooked + (i < node.expressions.length ? '{…}' : '')).join(''), dynamic: !!node.expressions.length };
    if (node.type === 'BinaryExpression' && node.operator === '+') {
        const flatten = n => n.type === 'BinaryExpression' && n.operator === '+' ? [...flatten(n.left), ...flatten(n.right)] : [n];
        const parts = flatten(node);
        let found = false, dynamic = false;
        const text = parts.map(n => {
            if (n.type === 'Literal' && typeof n.value === 'string') { found = true; return n.value; }
            dynamic = true; return '{…}';
        }).join('');
        return found ? { text, dynamic } : null;
    }
    return null;
}
function looksVisible(text) {
    const clean = text.replace(/\{…\}/g, '').replace(/<[^>]*>/g, '').trim();
    return /[A-Za-z]{2}/.test(clean) && !/^(?:noop|true|false|null|undefined)$/i.test(clean) &&
        !/^(?:https?:|\.\/|#|[\w/-]+\.(?:png|jpe?g|webp|gif|svg|css|js|mp3))$/i.test(clean);
}
function scanFile(file, root) {
    const source = fs.readFileSync(file, 'utf8');
    const tree = acorn.parse(source, { ecmaVersion: 'latest', locations: true });
    const findings = [], seen = new Set();
    function record(node, kind, confidence) {
        const value = textExpression(node);
        if (!value || !looksVisible(value.text)) return;
        const id = node.start + ':' + node.end;
        if (seen.has(id)) return;
        seen.add(id);
        findings.push({ file: path.relative(root, file).replace(/\\/g, '/'), line: node.loc.start.line,
            kind, confidence: value.dynamic ? 'review' : confidence, text: value.text, dynamic: value.dynamic });
    }
    function visit(node) {
        if (!node || typeof node !== 'object') return;
        if (node.type === 'CallExpression') {
            const target = member(node.callee);
            if (target === 'l10n.t') return; // Fallbacks are already connected to localization.
            if (/^(?:g\.popUpNotice|g\.popUpNoticeBottom|rape\.message|nav\.tmod)$/.test(target)) {
                const arg = target === 'nav.tmod' ? node.arguments[1] : node.arguments[0];
                if (arg?.type === 'ArrayExpression') arg.elements.forEach(n => record(n, target, 'direct'));
                else record(arg, target, 'direct');
            }
            if (/\.(?:text|html)$/.test(target)) record(node.arguments[0], target, 'review');
            if (/^(?:nav\.t|nav\.button)$/.test(target)) {
                const obj = node.arguments[0];
                if (!prop(obj, 'l10nKey') && !prop(obj, 'textKey')) record(prop(obj, 'text'), target + '.text', 'direct');
                if (!prop(obj, 'titleKey')) record(prop(obj, 'title'), target + '.title', 'direct');
            }
            if (/\.(?:push|unshift)$/.test(target) && /(?:msg|message|dialog|text)$/i.test(target.replace(/\.(?:push|unshift)$/, '')))
                node.arguments.forEach(n => record(n, 'text-array', 'review'));
        }
        if (node.type === 'ObjectExpression') {
            const message = prop(node, 'message');
            if (message && (prop(node, 'complete') || prop(node, 'speaker') || prop(node, 's'))) record(message, 'dialogue.message', 'direct');
            const short = prop(node, 'm');
            if (short && (prop(node, 'n') || prop(node, 's'))) record(short, 'dialogue.m', 'direct');
        }
        if (node.type === 'VariableDeclarator' && node.init?.type === 'ArrayExpression' && /(?:msg|message|dialog|text|talk)$/i.test(node.id.name || ''))
            node.init.elements.forEach(n => record(n, 'text-array', 'review'));
        if (node.type === 'AssignmentExpression' && node.right?.type === 'ArrayExpression' && /(?:msg|message|dialog|text|talk)$/i.test(member(node.left)))
            node.right.elements.forEach(n => record(n, 'text-array', 'review'));
        for (const [key, value] of Object.entries(node)) {
            if (key === 'loc') continue;
            if (Array.isArray(value)) value.forEach(visit);
            else if (value && typeof value === 'object') visit(value);
        }
    }
    visit(tree);
    return findings;
}
function scanHtml(file, root) {
    const source = fs.readFileSync(file, 'utf8');
    const tree = parse5.parse(source, { sourceCodeLocationInfo: true });
    const findings = [], relative = path.relative(root, file).replace(/\\/g, '/');
    function record(text, line, kind) {
        if (!line || !looksVisible(text)) return;
        findings.push({ file: relative, line, kind, confidence: 'review', text: text.replace(/\s+/g, ' ').trim(), dynamic: false });
    }
    function visit(node, translated = false) {
        const tag = node.tagName;
        if (['script', 'style', 'template'].includes(tag)) return;
        const attrs = Object.fromEntries((node.attrs || []).map(a => [a.name, a.value]));
        const textTranslated = translated || Object.prototype.hasOwnProperty.call(attrs, 'data-l10n');
        if (node.nodeName === '#text' && !textTranslated) record(node.value, node.sourceCodeLocation?.startLine, 'html.text');
        for (const name of ['title', 'placeholder', 'aria-label']) {
            if (attrs[name] && !Object.prototype.hasOwnProperty.call(attrs, 'data-l10n-' + name))
                record(attrs[name], node.sourceCodeLocation?.attrs?.[name]?.startLine || node.sourceCodeLocation?.startLine, 'html.' + name);
        }
        if (tag === 'input' && ['button', 'submit', 'reset'].includes((attrs.type || '').toLowerCase()) && attrs.value && !attrs['data-l10n-value'] && !attrs['data-l10n'])
            record(attrs.value, node.sourceCodeLocation?.attrs?.value?.startLine, 'html.value');
        (node.childNodes || []).forEach(child => visit(child, textTranslated));
    }
    visit(tree);
    return findings;
}
function scanRoomLocations(root, locales) {
    const file = path.join(root, 'scripts', 'global.js');
    if (!fs.existsSync(file)) return [];
    const source = fs.readFileSync(file, 'utf8');
    const tree = acorn.parse(source, { ecmaVersion: 'latest', locations: true });
    const packs = new Map(locales.map(locale => {
        const catalogFile = path.join(root, 'l10n', locale + '.js');
        return [locale, fs.existsSync(catalogFile) ? readPack(catalogFile, locale, () => {})?.entries : null];
    }));
    const findings = [], seen = new Set();
    function visit(node) {
        if (!node || typeof node !== 'object') return;
        if (node.type === 'ObjectExpression') {
            const roomId = prop(node, 'roomID');
            const name = prop(node, 'name');
            if (roomId?.type === 'Literal' && Number.isInteger(roomId.value) && name?.type === 'Literal' && typeof name.value === 'string') {
                const key = 'location.room.' + roomId.value;
                const missing = locales.filter(locale => !packs.get(locale)?.get(key)?.value?.trim());
                if (missing.length && !seen.has(key) && looksVisible(name.value)) {
                    seen.add(key);
                    findings.push({ file: 'scripts/global.js', line: name.loc.start.line, kind: 'nav.location.' + key,
                        confidence: 'direct', text: name.value, dynamic: false, missingLocales: missing });
                }
            }
        }
        for (const [key, value] of Object.entries(node)) {
            if (key === 'loc') continue;
            if (Array.isArray(value)) value.forEach(visit);
            else if (value && typeof value === 'object') visit(value);
        }
    }
    visit(tree);
    return findings;
}
function filesUnder(dir) {
    if (!fs.existsSync(dir)) return [];
    if (fs.statSync(dir).isFile()) return dir.endsWith('.js') ? [dir] : [];
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? filesUnder(path.join(dir, e.name)) : e.name.endsWith('.js') && !e.name.endsWith('.min.js') && !e.name.startsWith('jquery') ? [path.join(dir, e.name)] : []);
}
function buildCoverage(root, locales) {
    const diagnostics = [], catalogs = new Map(), localeDir = path.join(root, 'l10n');
    const installed = fs.existsSync(localeDir) ? fs.readdirSync(localeDir).filter(f => /^[a-z]{2,3}(?:-[A-Z]{2})?\.js$/.test(f)).map(f => f.slice(0, -3)) : [];
    for (const locale of new Set(['en', ...installed, ...locales])) {
        const file = path.join(localeDir, locale + '.js');
        if (!fs.existsSync(file)) { catalogs.set(locale, null); continue; }
        const pack = readPack(file, locale, issue => diagnostics.push(issue));
        catalogs.set(locale, pack?.entries || null);
    }
    const sources = sourceReferences(root);
    diagnostics.push(...sources.diagnostics);
    const english = catalogs.get('en') || new Map(), keys = new Set([...english.keys(), ...sources.refs.keys()]);
    // Include locale-only keys too: many dynamic keys cannot be discovered from source syntax.
    for (const catalog of catalogs.values()) if (catalog) for (const key of catalog.keys()) keys.add(key);
    const inventory = [], exact = new Map();
    for (const key of keys) {
        const en = english.get(key)?.value;
        const source = sources.refs.get(key)?.value;
        const value = en ?? source;
        if (typeof value === 'string' && (!value.trim() || /^[\p{P}\p{S}\s]+$/u.test(value.trim()) ||
            /^room\.\d+\.chat\.\d+\.text$/.test(key) && /^noop$/i.test(value.trim()))) continue;
        const ref = sources.refs.get(key);
        const item = { key, english: en ?? null, source: source ?? null,
            sourceLocation: ref ? { file: path.relative(root, ref.file).replace(/\\/g, '/'), line: ref.line } : null,
            ambiguous: !!ref?.ambiguous, languages: {} };
        for (const locale of locales) {
            const catalog = catalogs.get(locale);
            const translated = catalog?.get(key)?.value;
            item.languages[locale] = !catalog ? 'pack-missing-or-invalid' : !translated?.trim() ? 'missing' :
                typeof value === 'string' && translated.trim() === value.trim() ? 'same-as-source' : 'present';
        }
        inventory.push(item);
        for (const original of new Set([en, source])) {
            if (typeof original !== 'string' || !original.trim()) continue;
            const text = original.trim();
            if (!exact.has(text)) exact.set(text, new Set());
            exact.get(text).add(key);
        }
    }
    inventory.sort((a, b) => a.key.localeCompare(b.key));
    const byKey = new Map(inventory.map(item => [item.key, item]));
    const summary = Object.fromEntries(locales.map(locale => {
        const counts = { present: 0, 'same-as-source': 0, missing: 0, 'pack-missing-or-invalid': 0 };
        for (const item of inventory) counts[item.languages[locale]]++;
        return [locale, counts];
    }));
    const englishSummary = {
        catalogued: inventory.filter(item => item.english !== null).length,
        sourceOnly: inventory.filter(item => item.english === null && item.source !== null).length,
        dynamicOrUnknown: inventory.filter(item => item.english === null && item.source === null).length
    };
    const translationsFor = key => Object.fromEntries(locales.map(locale => [locale, catalogs.get(locale)?.get(key)?.value ?? null]));
    return { inventory, exact, byKey, summary, englishSummary, diagnostics, translationsFor };
}
function scan(root, target = 'all', locales = ['bg', 'es']) {
    const findings = [], errors = [];
    const files = target === 'all' ? [...filesUnder(path.join(root, 'scripts')), ...['index.html', 'startGame.html'].map(f => path.join(root, f)).filter(fs.existsSync)] :
        (target.toLowerCase().endsWith('.html') && fs.existsSync(path.resolve(root, target)) ? [path.resolve(root, target)] : filesUnder(path.resolve(root, target)));
    for (const file of files) {
        try { findings.push(...(file.endsWith('.html') ? scanHtml(file, root) : scanFile(file, root))); }
        catch (e) { errors.push({ file: path.relative(root, file).replace(/\\/g, '/'), message: e.message }); }
    }
    if (target === 'all' || /global\.js$/i.test(target)) findings.push(...scanRoomLocations(root, locales));
    const groups = new Map();
    for (const f of findings) {
        const id = f.text.trim();
        if (!groups.has(id)) groups.set(id, { text: id, occurrences: [] });
        groups.get(id).occurrences.push({ file: f.file, line: f.line, kind: f.kind, confidence: f.confidence, dynamic: f.dynamic });
    }
    const coverage = buildCoverage(root, locales);
    const entries = [...groups.values()].sort((a, b) => b.occurrences.length - a.occurrences.length || a.occurrences[0].file.localeCompare(b.occurrences[0].file) || a.occurrences[0].line - b.occurrences[0].line);
    for (const entry of entries) {
        entry.possibleMatches = [...(coverage.exact.get(entry.text) || [])].sort().map(key => ({ ...coverage.byKey.get(key), translations: coverage.translationsFor(key) }));
    }
    return { generatedAt: new Date().toISOString(), target, locales, filesScanned: files.length, occurrences: findings.length,
        unique: entries.length, entries, keyedCoverage: { summary: coverage.summary, englishSummary: coverage.englishSummary, keys: coverage.inventory, diagnostics: coverage.diagnostics }, errors };
}
function markdown(report) {
    return '# Possible unlocalized text\n\nStatic candidates, not confirmed missing translations. Inspect context and reachability; `{…}` denotes a dynamic expression. Identical strings are grouped. Existing `l10n.t` fallbacks are excluded. Exact-text matches are suggestions, not proof that a candidate is connected or has the same meaning. `same-as-source` can be a valid translation. Missing or invalid language packs are reported separately. Full keyed coverage is in the JSON file.\n\n' +
        `Files: ${report.filesScanned}; occurrences: ${report.occurrences}; distinct texts: ${report.unique}; parse errors: ${report.errors.length}.\n\n` +
        `## Existing keyed coverage\n\nEnglish catalog: ${report.keyedCoverage.englishSummary.catalogued}; source-only literal: ${report.keyedCoverage.englishSummary.sourceOnly}; dynamic or unknown: ${report.keyedCoverage.englishSummary.dynamicOrUnknown}. Source-only does not necessarily mean broken: the game can use the source fallback.\n\n` + Object.entries(report.keyedCoverage.summary).map(([locale, counts]) => `- ${locale}: present ${counts.present}; same as source ${counts['same-as-source']}; missing ${counts.missing}; missing/invalid pack ${counts['pack-missing-or-invalid']}.`).join('\n') + '\n\n' +
        report.entries.map((e, i) => `## ${i + 1}. ${e.occurrences.length} occurrence(s)\n\n\`\`\`text\n${e.text.replace(/```/g, '\\`\\`\\`')}\n\`\`\`\n\n` + e.occurrences.map(o => `- ${o.file}:${o.line} — ${o.kind}, ${o.confidence}`).join('\n') + '\n' +
            (e.possibleMatches.length ? '\nPossible existing keys (verify context and connection):\n' + e.possibleMatches.map(m => `- ${m.key}: ` + Object.entries(m.languages).map(([l, state]) => `${l}=${state}` + (m.translations[l] !== null ? ` — ${m.translations[l].replace(/\s+/g, ' ').replace(/`/g, '\\`')}` : '')).join('; ')).join('\n') + '\n' : '\nNo exact existing source-key match found.\n')).join('\n') +
        (report.errors.length ? '\n## Files not parsed\n\n' + report.errors.map(e => `- ${e.file}: ${e.message}`).join('\n') + '\n' : '');
}
function englishProposals(report) {
    return report.keyedCoverage.keys.filter(item => item.english === null && item.source !== null && !item.ambiguous)
        .map(item => ({ key: item.key, source: item.source, location: item.sourceLocation }));
}
function main(args) {
    const root = path.resolve(__dirname, '..');
    let target = 'all', locales = ['bg', 'es'], proposals = false, output = path.join(root, 'tools', 'reports', 'unlocalized-candidates');
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--path' && args[i + 1]) target = args[++i];
        else if (args[i] === '--en-proposals') proposals = true;
        else if (args[i] === '--locale' && args[i + 1]) {
            locales = args[++i].split(',');
            if (!locales.every(l => /^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(l))) throw new Error('Use locale codes such as bg,es,it,de,ru,fr.');
            locales = [...new Set(locales)];
        }
        else if (args[i] === '--out' && args[i + 1]) output = path.resolve(root, args[++i]).replace(/\.(?:json|md)$/i, '');
        else if (args[i] === '--help') { console.log('Usage: node tools/scan-unlocalized.js [--locale bg,es,it,de,ru,fr] [--path scripts/file.js] [--en-proposals] [--out path/report]'); return; }
        else throw new Error('Unknown or incomplete option: ' + args[i]);
    }
    const report = scan(root, target, locales); fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output + '.json', JSON.stringify(report, null, 2) + '\n');
    fs.writeFileSync(output + '.md', markdown(report));
    if (proposals) {
        const entries = englishProposals(report);
        fs.writeFileSync(output + '.en-proposals.json', JSON.stringify({ note: 'Review context, runtime behavior, placeholders and duplicates before adding to en.js. This file changes no catalog.', entries }, null, 2) + '\n');
        console.log(`${entries.length} English source proposals: ${output}.en-proposals.json`);
    }
    console.log(`${report.filesScanned} files, ${report.occurrences} candidate occurrences, ${report.unique} distinct texts, ${report.errors.length} parse errors.`);
    for (const [locale, counts] of Object.entries(report.keyedCoverage.summary))
        console.log(`${locale}: ${counts.present} present, ${counts['same-as-source']} same as source, ${counts.missing} missing, ${counts['pack-missing-or-invalid']} missing/invalid pack.`);
    console.log('Markdown: ' + output + '.md\nJSON: ' + output + '.json');
    if (report.errors.length || report.keyedCoverage.diagnostics.some(d => d.severity === 'error')) process.exitCode = 1;
}
if (require.main === module) { try { main(process.argv.slice(2)); } catch (e) { console.error(e.message); process.exitCode = 2; } }
module.exports = { scan, scanFile, markdown, englishProposals };

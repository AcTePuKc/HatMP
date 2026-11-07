const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const { check, markupProblems } = require('./l10n-checker');
const { renderReport } = require('./check-l10n');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hatmp-l10n-'));
try {
    fs.mkdirSync(path.join(root, 'l10n'));
    fs.mkdirSync(path.join(root, 'scripts', 'room'), { recursive: true });
    function pack(locale, strings, tail = '') {
        fs.writeFileSync(path.join(root, 'l10n', locale + '.js'), `window.HatMPLocales = window.HatMPLocales || {};
window.HatMPLocales.${locale} = { "_meta": {"locale":"${locale}"}, "strings": ${strings} ${tail} };`);
    }
    pack('en', JSON.stringify({ 'ui.welcome': 'Welcome {me}, meet {els}.', 'ui.missing': 'Missing', 'ui.empty': 'Empty', 'ui.object': 'Value', 'ui.html': '<b>Hello</b>', 'ui.order': '{name} has {amount}.', 'ui.good': '<br>Good', 'ui.duplicate': 'Duplicate', 'ui.shadow': 'Shadow' }));
    pack('es', `{
        "ui.welcome": "Hola {me}, conoce a {els:pluralDefinite}.",
        "ui.empty": "",
        "ui.object": {"text":"Incorrect shape", "values":["me"]},
        "ui.html": "<b>Hola</i>",
        "ui.order": "{amount} para {nmae}",
        "ui.good": "<p>Uno<p>Dos<br>",
        "ui.duplicate": "First", "ui.duplicate": "Second",
        "ui.shadow": "Preferred",
        "unknown.key": "No reference {mystery}",
        "room.1.chat.0.text": "Hola {person}",
        "room.1.chat.0.choice.0": "Ir {unexpected}",
        "room.1.chat.1.text": "Hola {person}",
        "runtime.literal": "Hola {name}",
        "runtime.dynamic": "Hola {typo}"
    }`, ', "ui.shadow": "Legacy"');
    fs.writeFileSync(path.join(root, 'scripts', 'room', 'room001.js'), `
        room1.chat = function(chatID) {
            var cArray = [{speaker:'test', text:'Hello {person}', button:[{text:'Go',chatID:-1}]},
                {speaker:'test',text:'Hello '+ sc.n('person'),l10nValues:{person:sc.n('person')},button:[]}];
            return cArray[chatID];
        };
        l10n.t('runtime.literal','Hello {name}',{name:sc.n('person')});
        l10n.t('runtime.dynamic', makeGreeting(), {person:sc.n('person')});
        l10n.t('runtime.sourceOnly','Only in source');
    `);
    const report = check(root, { locales: ['es'] });
    const has = (key, type) => report.issues.some(i => i.key === key && i.type === type);
    assert.ok(has('ui.missing', 'missing'));
    assert.ok(has('ui.empty', 'missing'));
    assert.ok(has('ui.object', 'value-type'));
    assert.ok(has('ui.duplicate', 'duplicate-key'));
    assert.ok(has('ui.shadow', 'shadowed-key'));
    assert.ok(has('ui.html', 'markup'));
    assert.ok(has('ui.order', 'placeholders'));
    assert.ok(has('room.1.chat.0.choice.0', 'placeholders'));
    assert.ok(has('runtime.dynamic', 'placeholders'));
    assert.ok(has('unknown.key', 'unverified-source'));
    for (const key of ['ui.welcome', 'ui.good', 'runtime.literal', 'room.1.chat.0.text', 'room.1.chat.1.text']) assert.ok(!report.issues.some(i => i.key === key), key + ' should pass');
    assert.ok(!has('runtime.sourceOnly', 'missing'));
    const inventory = check(root, { locales: ['es'], includeSource: true, prefix: 'runtime.' });
    assert.ok(inventory.issues.some(i => i.key === 'runtime.sourceOnly' && i.type === 'missing'));
    assert.ok(inventory.issues.every(i => !i.key || i.key.startsWith('runtime.')));
    assert.deepEqual(markupProblems('1 < 2 and 3 > 2'), []);
    assert.deepEqual(markupProblems('<abbr title="a > b">word</abbr><br/>'), []);
    assert.ok(markupProblems('<span title="broken>text').length);
    assert.ok(markupProblems('text</strong>').length);

    pack('en', JSON.stringify({
        'branch.good': 'Ready {me}.', 'branch.bad': 'Ready.', 'branch.html': 'Ready.',
        'branch.tokens': 'Ready {me}.', 'branch.omitted': 'Ready {me}.', 'branch.form': 'Ready.',
        'branch.splitMarkup': 'Ready.', 'branch.source': '[[player:{man}|{woman}]]',
        'branch.neutral': '[[player:{man}|{woman}]]', 'branch.invalidSource': '[[player:bad]]'
    }));
    pack('es', JSON.stringify({
        'branch.good': '[[player:<b>Listo {me}</b>|<i>{me} está lista</i>]].',
        'branch.bad': '[[player:Listo|]]',
        'branch.html': '[[player:<b>Listo</b>|<b>Lista</i>]]',
        'branch.tokens': '[[player:Listo {me}|Lista {typo}]]',
        'branch.omitted': '[[player:Listo {me}|Lista]]',
        'branch.form': '[[player:Listo|Lista {me:invented}]]',
        'branch.splitMarkup': '[[player:<b>|<i>]]Ready[[player:</b>|</i>]]',
        'branch.source': '[[player:{man}|{woman}]]',
        'branch.neutral': '{man}', 'branch.invalidSource': 'Lista'
    }));
    const branches = check(root, { locales: ['es'] });
    const branchIssues = key => branches.issues.filter(i => i.key === key);
    for (const key of ['branch.good', 'branch.splitMarkup', 'branch.source']) assert.deepEqual(branchIssues(key), [], key);
    assert.ok(branchIssues('branch.bad').some(i => i.type === 'player-branch'));
    assert.ok(branchIssues('branch.invalidSource').some(i => i.type === 'player-branch' && i.locale === 'en'));
    for (const key of ['branch.html', 'branch.tokens', 'branch.form']) {
        assert.ok(branchIssues(key).some(i => i.severity === 'error' && i.variant === 'feminine'), key);
        assert.ok(!branchIssues(key).some(i => i.variant === 'masculine'), key);
    }
    assert.ok(branchIssues('branch.omitted').some(i => i.severity === 'warning' && i.variant === 'feminine'));
    assert.ok(branchIssues('branch.neutral').some(i => i.type === 'placeholders' && i.variant === 'feminine'));

    // Hostile or malformed packs are diagnosed without executing them.
    fs.writeFileSync(path.join(root, 'l10n', 'bg.js'), 'globalThis.checkerExecuted = true;');
    assert.ok(check(root, { locales: ['bg'] }).issues.some(i => i.type === 'pack-format'));
    assert.equal(globalThis.checkerExecuted, undefined);
    fs.writeFileSync(path.join(root, 'l10n', 'bg.js'), 'window.HatMPLocales.bg = {');
    assert.ok(check(root, { locales: ['bg'] }).issues.some(i => i.type === 'syntax'));

    // Report values are displayed as text, never interpreted as translated HTML.
    report.issues.push({ severity: 'error', type: 'markup', locale: 'es', key: '<script>globalThis.reportExecuted=1</script>', file: path.join(root, 'l10n/es.js'), line: 1, value: '</pre><script>globalThis.reportExecuted=1</script>', message: 'Report escaping fixture' });
    const dom = new JSDOM(renderReport(report), { runScripts: 'dangerously' });
    const doc = dom.window.document;
    assert.equal(dom.window.reportExecuted, undefined);
    assert.equal(doc.querySelectorAll('script').length, 1);
    doc.getElementById('search').value = 'Report escaping fixture';
    doc.getElementById('search').dispatchEvent(new dom.window.Event('input'));
    assert.equal([...doc.querySelectorAll('article')].filter(n => !n.hidden).length, 1);
    doc.getElementById('severity').value = 'warning';
    doc.getElementById('severity').dispatchEvent(new dom.window.Event('input'));
    assert.equal([...doc.querySelectorAll('article')].filter(n => !n.hidden).length, 0);
    dom.window.close();
    console.log('Passed translation syntax, data shape, duplicates, missing keys, placeholders, grammatical forms, markup, source fallbacks, filtering and safe offline report checks.');
} finally {
    const resolved = path.resolve(root), temp = path.resolve(os.tmpdir()) + path.sep;
    if (!resolved.startsWith(temp) || !path.basename(resolved).startsWith('hatmp-l10n-')) throw new Error('Refusing to remove unexpected fixture path');
    fs.rmSync(resolved, { recursive: true, force: true });
}

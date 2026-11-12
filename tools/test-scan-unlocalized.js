const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { scan, markdown, englishProposals } = require('./scan-unlocalized');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hatmp-unlocalized-'));
try {
    fs.mkdirSync(path.join(root, 'scripts'));
    fs.mkdirSync(path.join(root, 'l10n'));
    function pack(locale, entries) {
        fs.writeFileSync(path.join(root, 'l10n', locale + '.js'), `window.HatMPLocales = window.HatMPLocales || {}; window.HatMPLocales.${locale} = {"_meta":{"locale":"${locale}"},"strings":${JSON.stringify(entries)}};`);
    }
    pack('en', { 'example.reuse': 'Repeated line', 'example.same': 'Go', 'example.missing': 'Missing key', 'example.noMatch': 'Unrelated' });
    pack('es', { 'example.reuse': 'Línea repetida', 'example.same': 'Go', 'source.only': 'Solo en el código', 'spanish.only': 'Texto sin fuente estática' });
    fs.writeFileSync(path.join(root, 'scripts', 'sample.js'), `
        // g.popUpNotice('Not real');
        const rows = [{n:'x',m:'Repeated line'}, {s:'x',m:'Repeated line'}, {s:'x',m:l10n.t('known','Already localized')}];
        const stripMsg = ['A random line', l10n.t('known','Already localized')];
        stripMsg.push('Another random line');
        g.popUpNotice('Direct notice');
        g.popUpNotice('Hello ' + sc.n('me'));
        g.popUpNotice(l10n.t('name','Name') + ' was found');
        l10n.t('source.only', 'Only in source');
        l10n.t('ambiguous', 'First source');
        l10n.t('ambiguous', 'Second source');
        nav.t({text:'Direct label'});
        nav.button({title:'Already localized title', titleKey:'button.title'});
        nav.button({title:'Untranslated title'});
        const no = {n:'value', m:'ui/icon.png'};
    `);
    fs.writeFileSync(path.join(root, 'index.html'), '<title>Page title</title><p>Visible text</p><p data-l10n="ui.key">Translated <b>child</b></p><button title="Tooltip">Go</button><input placeholder="Search" data-l10n-placeholder="ui.search"><script>Unseen code</script>');
    const result = scan(root, 'all', ['es', 'it']);
    const byText = text => result.entries.find(e => e.text === text);
    assert.equal(result.filesScanned, 2);
    assert.equal(result.errors.length, 0);
    assert.equal(byText('Repeated line').occurrences.length, 2);
    assert.equal(byText('Repeated line').possibleMatches[0].key, 'example.reuse');
    assert.equal(byText('Repeated line').possibleMatches[0].languages.es, 'present');
    assert.equal(byText('Repeated line').possibleMatches[0].translations.es, 'Línea repetida');
    assert.equal(byText('Repeated line').possibleMatches[0].languages.it, 'pack-missing-or-invalid');
    assert.equal(byText('Go').possibleMatches[0].languages.es, 'same-as-source');
    assert.equal(result.keyedCoverage.keys.find(k => k.key === 'example.missing').languages.es, 'missing');
    assert.equal(result.keyedCoverage.keys.find(k => k.key === 'source.only').languages.es, 'present');
    assert.equal(result.keyedCoverage.keys.find(k => k.key === 'source.only').english, null);
    assert.equal(result.keyedCoverage.keys.find(k => k.key === 'spanish.only').languages.it, 'pack-missing-or-invalid');
    assert.equal(result.keyedCoverage.keys.find(k => k.key === 'spanish.only').source, null);
    assert.ok(englishProposals(result).some(e => e.key === 'known' && e.source === 'Already localized'));
    assert.ok(!englishProposals(result).some(e => e.key === 'example.reuse'));
    assert.ok(!englishProposals(result).some(e => e.key === 'ambiguous'));
    assert.equal(byText('Direct notice').possibleMatches.length, 0);
    for (const text of ['A random line', 'Another random line', 'Direct notice', 'Direct label', 'Untranslated title']) assert.ok(byText(text), text);
    for (const text of ['Already localized', 'Already localized title', 'Not real', 'ui/icon.png']) assert.ok(!byText(text), text);
    for (const text of ['Page title', 'Visible text', 'Tooltip', 'Go']) assert.ok(byText(text), text);
    for (const text of ['Translated', 'child', 'Search', 'Unseen code']) assert.ok(!byText(text), text);
    assert.equal(byText('Hello {…}').occurrences[0].confidence, 'review');
    assert.equal(byText('{…} was found').occurrences[0].confidence, 'review');
    assert.ok(markdown(result).includes('scripts/sample.js:'));
    console.log('Passed unlocalized scanner grouping, localized fallbacks, dynamic text and source location checks.');
} finally {
    const resolved = fs.realpathSync(root);
    if (path.dirname(resolved) !== fs.realpathSync(os.tmpdir()) || !path.basename(resolved).startsWith('hatmp-unlocalized-'))
        throw new Error('Refusing to remove an unexpected test directory: ' + resolved);
    fs.rmSync(resolved, { recursive: true, force: true });
}

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const format = require('../scripts/l10n-format');
const source = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

(async () => {
    for (const text of ['[[player:ready]]', '[[player:|ready]]', '[[player:ready| ]]', '[[player:a|b|c]]',
        '[[npc:a|b]]', '[[player:a|b]', '[[player:a|[[player:b|c]]]]', 'ready ]]', '[[player:a|b]] ]]']) {
        assert.ok(format.parse(text).error, text);
    }
    assert.deepEqual(format.variants('[[player:<b>Ready|<i>Ready]][[player:</b>|</i>]]').variants,
        [{ name: 'masculine', text: '<b>Ready</b>' }, { name: 'feminine', text: '<i>Ready</i>' }]);
    assert.equal(format.render(format.parse('[[player:A &#124; B|C]]'), false), 'A &#124; B');
    const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://hatmp.test/', runScripts: 'outside-only' });
    const w = dom.window, warnings = [];
    w.console.warn = text => warnings.push(text);
    for (const file of ['l10n/languages.js', 'l10n/en.js', 'l10n/bg.js', 'l10n/es.js', 'scripts/l10n-format.js', 'scripts/localization.js']) w.eval(source(file));
    await w.l10n.ready;
    w.HatMPLocales.en.strings['test.early'] = '[[player:He|She]] is ready.';
    assert.equal(w.l10n.t('test.early'), 'He is ready.', 'Startup before gender module is safe');

    let pronouns = 'm', appearance = 1, reads = 0;
    w.gv = { get: key => { assert.equal(key, 'pronouns'); return pronouns; } };
    w.cl = { c: { chest: 0, hairLength: 0 }, appearance: () => { reads++; return appearance; } };
    w.sc = { el: form => form === 'singularDefinite' ? 'сънаемателката' : 'сънаемателка' };
    w.eval(source('scripts/gender.js'));
    const fixtures = {
        'test.word': 'Estoy [[player:listo|lista]], {me}.',
        'test.multiple': '[[player:Готов|Готова]] и [[player:уморен|уморена]].',
        'test.sentence': '[[player:<b>{me}</b> está listo.|Está lista <b>{me}</b>.]]',
        'test.form': '[[player:Готов|Готова]] за {el:singularDefinite}.',
        'test.literal': 'A story-fixed woman; {me}.',
        'test.bad': '[[player:one|]]',
        'test.source': '[[player:one]]',
        'test.allBad': '[[player:one]]',
        'test.object': { text: 'Wrong shape' },
        'test.legacy': '[[player:old|older]]'
    };
    Object.assign(w.HatMPLocales.es.strings, fixtures);
    w.HatMPLocales.es['test.root'] = '[[player:root m|root f]]';
    w.HatMPLocales.en.strings['test.bad'] = 'English [[player:man|woman]], {me}.';
    w.HatMPLocales.en.strings['test.object'] = 'Safe English';
    w.HatMPLocales.en.strings['test.allBad'] = '[[player:bad]]';
    await w.l10n.setLanguage('es');
    const punctuation = w.l10n.chatEntry({ speaker: 'npc', text: 'Hello', button: [{ text: '...', chatID: -1, callback: '' }] }, 999999, 999999);
    assert.equal(punctuation.button[0].text, '...', 'Missing punctuation translation must retain the source button text');
    assert.equal(w.l10n.t('test.word', '', { me: '<Alex>' }), 'Estoy listo, &lt;Alex&gt;.');
    appearance = 2;
    assert.equal(w.l10n.t('test.word', '', { me: 'Alex' }), 'Estoy listo, Alex.');
    assert.equal(reads, 0, 'Explicit masculine must ignore appearance');
    pronouns = 'f'; appearance = 1;
    assert.equal(w.l10n.t('test.word', '', { me: 'Alex' }), 'Estoy lista, Alex.');
    assert.equal(reads, 0, 'Explicit feminine must ignore appearance');
    assert.equal(w.l10n.t('test.multiple'), 'Готова и уморена.');
    assert.equal(w.l10n.t('test.sentence', '', { me: 'Alex' }), 'Está lista <b>Alex</b>.');
    assert.equal(w.l10n.t('test.form'), 'Готова за сънаемателката.');
    assert.equal(w.l10n.t('test.root'), 'root f');
    assert.equal(w.l10n.t('test.literal', '', { me: '[[player:raw|value]]' }), 'A story-fixed woman; [[player:raw|value]].', 'Do not interpret player-entered syntax');
    assert.equal(w.l10n.t('test.bad', 'Source', { me: 'Alex' }), 'English woman, Alex.');
    assert.equal(w.l10n.chatEntry({ text: 'Source', l10nKey: 'test.bad', button: [] }, 1, 1).textLanguage, 'en');
    assert.equal(w.l10n.t('test.source', 'Source [[player:ready|ready too]]'), 'Source ready too');
    assert.equal(w.l10n.t('test.allBad', '[[player:bad]]'), 'test.allBad');
    assert.equal(w.l10n.t('test.object'), 'Safe English');
    const count = warnings.length;
    w.l10n.t('test.bad'); w.l10n.t('test.source'); w.l10n.t('test.allBad', '[[player:bad]]'); w.l10n.t('test.object');
    assert.equal(warnings.length, count, 'Diagnostics are logged once per invalid message');

    pronouns = 'a';
    for (const [look, chest, hair, feminine] of [[0, 0, 0, false], [1, 0, 0, false], [2, 0, 0, true],
        [3, 0, 0, true], [5, 0, 4, false], [5, 2, 1, false], [5, 2, 2, true], [5, 3, 0, true]]) {
        appearance = look; w.cl.c.chest = chest; w.cl.c.hairLength = hair;
        assert.equal(w.l10n.t('test.word', '', { me: 'Alex' }), 'Estoy ' + (feminine ? 'lista' : 'listo') + ', Alex.', 'Appearance mode: ' + [look, chest, hair]);
    }
    pronouns = 'm';
    const raw = { speaker: 'npc', l10nKey: 'test.word', text: 'Ready {me}', l10nValues: { me: 'Alex' },
        button: [{ text: 'Continue', l10nKey: 'test.multiple', chatID: 4, callback: 'keep-me' }] };
    const male = w.l10n.chatEntry(raw, 1, 1);
    pronouns = 'f';
    const female = w.l10n.chatEntry(raw, 1, 1);
    assert.equal(male.text, 'Estoy listo, Alex.');
    assert.equal(female.text, 'Estoy lista, Alex.');
    assert.equal(female.button[0].text, 'Готова и уморена.');
    assert.equal(raw.button[0].text, 'Continue');
    assert.equal(female.button[0].callback, 'keep-me');
    assert.equal(female.button[0].chatID, 4);
    assert.equal(female.speaker, 'npc', 'The selector is the player, not the current speaker');

    // First real migrated lines, checked in both packs and both player modes.
    for (const [locale, busy, ready] of [['bg', ['зает', 'заета'], ['готов', 'готова']], ['es', ['ocupado', 'ocupada'], ['listo', 'lista']]]) {
        await w.l10n.setLanguage(locale);
        for (let mode = 0; mode < 2; mode++) {
            pronouns = mode ? 'f' : 'm';
            assert.ok(w.l10n.t('room.13.chat.170.choice.1').includes(busy[mode]));
            assert.ok(w.l10n.t('phone.characterGuide.landlord.sissy.task.1').includes(ready[mode]));
            assert.ok(!w.l10n.t('room.13.chat.170.choice.1').includes('[['));
        }
        const npcLine = w.l10n.t('room.23.myDare.noMore');
        pronouns = 'm';
        assert.equal(w.l10n.t('room.23.myDare.noMore'), npcLine, 'NPC self-description must not follow player preference');
    }
    // Definite lowercase must use the chosen definite form, not the uninflected label.
    await w.l10n.setLanguage('bg');
    const vocativeFunction = source('scripts/supportingChar.js').match(/sc\.suggestBulgarianVocative = function \(value\) \{[\s\S]*?\n\};/);
    assert.ok(vocativeFunction, 'Bulgarian vocative suggestion exists');
    w.eval(vocativeFunction[0]);
    const landladyFunction = source('scripts/supportingChar.js').match(/sc\.landlady = function \(form\) \{[\s\S]*?\n\};/);
    assert.ok(landladyFunction, 'Landlady form resolver exists');
    w.eval(landladyFunction[0]);
    let landlady = { display: 'Landlady' };
    w.sc.get = () => landlady;
    assert.equal(w.sc.landlady('definiteLower'), 'хазайката');
    assert.equal(w.sc.landlady('vocative'), 'хазайке');
    assert.ok(w.l10n.t('room.26.chat.151.choice.0').includes('хазайке'));
    landlady = { display: 'Леля', relationshipForms: { definite: 'Лелята', vocative: 'лельо' } };
    assert.equal(w.sc.landlady('definiteLower'), 'лелята');
    assert.equal(w.sc.landlady('vocative'), 'лельо');
    assert.equal(w.sc.landlady('vocativeCapitalized'), 'Лельо');
    assert.ok(w.l10n.t('room.26.chat.167.text', '', { lola: 'Лола' }).includes('Лола, лельо'));
    assert.ok(w.l10n.t('room.350.chat.21.choice.0').includes('лелята'));
    landlady = { display: 'Леля', relationshipForms: {} };
    assert.equal(w.sc.landlady('definiteLower'), 'леля');
    assert.equal(w.sc.landlady('vocative'), 'лельо');
    landlady = { display: 'Майка', relationshipForms: {} };
    assert.equal(w.sc.landlady('vocative'), 'майко');
    dom.window.close();
    // Exercise the standalone translator page using its actual script order and controls.
    const previewHTML = source('tools/dialogue-preview.html');
    const preview = new JSDOM(previewHTML.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, ''),
        { url: 'https://hatmp.test/', runScripts: 'outside-only', pretendToBeVisual: true });
    const p = preview.window, doc = p.document;
    for (const match of previewHTML.matchAll(/<script src="([^"]+)"/g))
        p.eval(fs.readFileSync(path.resolve(__dirname, match[1]), 'utf8'));
    const settle = () => new Promise(resolve => setTimeout(resolve, 40));
    await p.l10n.ready; await settle();
    doc.getElementById('preview_length').value = '1';
    doc.getElementById('preview_agreement').checked = true;
    doc.getElementById('preview_language').value = 'es';
    doc.getElementById('preview_language').dispatchEvent(new p.Event('change'));
    await settle();
    const passage = () => doc.getElementById('room_footerSpeach').textContent;
    assert.ok(passage().includes('cansado'));
    doc.getElementById('preview_pronouns').value = 'f';
    doc.getElementById('preview_pronouns').dispatchEvent(new p.Event('change'));
    assert.ok(passage().includes('cansada'));
    doc.getElementById('preview_key').value = 'room.13.chat.170.choice.1';
    doc.getElementById('preview_next').click();
    assert.equal(passage(), 'Ah, estoy ocupada... con cosas.');
    doc.getElementById('preview_pronouns').value = 'a';
    doc.getElementById('preview_appearance').value = '1';
    doc.getElementById('preview_next').click();
    assert.equal(passage(), 'Ah, estoy ocupado... con cosas.');
    doc.getElementById('preview_appearance').value = '2';
    doc.getElementById('preview_appearance').dispatchEvent(new p.Event('change'));
    assert.equal(passage(), 'Ah, estoy ocupada... con cosas.');
    assert.equal(p.localStorage.getItem('hatmp.language'), 'es');
    assert.equal(p.localStorage.length, 1, 'Preview must not write player state or saves');
    preview.window.close();
    console.log('Passed player agreement: words, sentences, markup, placeholders, fallback, choices, m/f/appearance rules, and migrated BG/ES lines.');
})().catch(error => { console.error(error); process.exitCode = 1; });

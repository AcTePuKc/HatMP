const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const source = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

(async () => {
    const dom = new JSDOM('<div id="room-buttons"></div>', {
        url: 'https://hatmp.test/', runScripts: 'outside-only'
    });
    const w = dom.window;
    for (const file of ['scripts/jquery-4.0.0.min.js', 'l10n/languages.js', 'l10n/en.js',
        'l10n/bg.js', 'l10n/es.js', 'scripts/l10n-format.js', 'scripts/localization.js'])
        w.eval(source(file));
    await w.l10n.ready;
    await w.l10n.setLanguage('bg');
    const characters = [
        { name: 'me', display: 'Alex', setName: false },
        { name: 'landlord', display: 'Landlady', image: 'mom.png', setName: true },
        { name: 'el', display: 'Co-Tenant', singularDisplay: 'Co-Tenant', setName: false },
        { name: 'lola', display: 'Lola', setName: true, image: 'lola.png' },
        { name: 'eva', display: 'Eva', setName: true, image: 'eva.png' }
    ];
    w.sc = {
        char: characters,
        i: name => characters.findIndex(character => character.name === name),
        get(name) { return characters[this.i(name)]; },
        n(name) { return this.get(name).display; },
        suggestBulgarianVocative: () => ''
    };
    w.g = { ratio: 1, char: characters };
    w.gv = { get: () => 'a' };
    w.dialogue = { getPreferences: () => ({ mode: 'enhanced' }) };
    w.phone = {};
    const phoneSource = source('scripts/phone.js');
    w.eval(phoneSource.match(/phone\.suggestBulgarianDefinite = function \(value, plural\) \{[\s\S]*?\n\};/)[0]);
    w.invoker = { registerRoom() {} };
    w.eval(source('scripts/room/room002.js'));
    w.room2.chatcatch('init');
    const $ = w.$;
    $('#room_002sa').val('Приятелки').trigger('input');
    assert.equal($('#room_002saSingular').val(), 'Приятелка');
    assert.equal($('#room_002RelationshipForm_singularDefinite').val(), 'Приятелката');
    assert.equal($('#room_002RelationshipForm_pluralDefinite').val(), 'Приятелките');
    $('#room_002RelationshipForm_pluralDefinite').val('моите приятелки').trigger('input');
    $('#room_002sa').val('Съквартирантки').trigger('input');
    assert.equal($('#room_002saSingular').val(), 'Съквартирантка');
    assert.equal($('#room_002RelationshipForm_singularDefinite').val(), 'Съквартирантката');
    assert.equal($('#room_002RelationshipForm_pluralDefinite').val(), 'моите приятелки');
    $('#room_002ClearAllNames').trigger('click');
    $('#room_002sa').val('Сестри').trigger('input');
    assert.equal($('#room_002saSingular').val(), 'Сестра');
    assert.equal($('#room_002RelationshipForm_singularDefinite').val(), 'Сестрата');
    assert.equal($('#room_002RelationshipForm_pluralDefinite').val(), 'Сестрите');
    dom.window.close();
    console.log('Passed Bulgarian character setup suggestions and manual override.');
})().catch(error => { console.error(error); process.exitCode = 1; });

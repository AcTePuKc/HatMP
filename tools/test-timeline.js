const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const source = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

(async () => {
    const dom = new JSDOM('<div id="room_left_map"></div>', { url: 'https://hatmp.test/', runScripts: 'outside-only' });
    const w = dom.window;
    w.console.warn = () => {};
    for (const file of ['scripts/jquery-4.0.0.min.js', 'l10n/languages.js', 'l10n/en.js', 'l10n/bg.js', 'l10n/es.js', 'scripts/l10n-format.js', 'scripts/localization.js']) w.eval(source(file));
    await w.l10n.ready;
    const rooms = {13: "Girl's Room", 25: 'Dining Room', 900: 'College', 901: 'Pool', 400: 'Mall'};
    w.g = { dt: new w.Date(2026, 10, 9), gethourdecimal: () => 10, roomID: 13, fr: id => ({ name: rooms[id] || 'Room ' + id }) };
    w.gv = { get: () => 0 };
    w.sc = { n: name => name === 'tiffany' ? 'Ти & X' : name, getMission: () => ({ inProgress: false, notStarted: true }), taskGetStep: () => 0 };
    const supporting = source('scripts/supportingChar.js');
    w.eval(supporting.slice(supporting.indexOf('sc.getTimeline = function'), supporting.indexOf('sc.selectButtonPosition = function')));
    const lola = w.sc.getTimeline('lola');
    const eva = w.sc.getTimeline('eva');
    assert.equal(lola.roomID, 900);
    assert.equal(lola.thisRoom, false);
    assert.equal(lola.subList.find(row => row.current).room, 'College');
    assert.ok(eva.subList.some(row => row.roomId === 400));
    for (const [lang, college, pool, mall, named, girlsRoom] of [
        ['bg', 'Университет', 'Басейн', 'Мол', 'Стаята на Ти &amp; X', 'Тяхната стая'],
        ['es', 'Universidad', 'Piscina', 'Centro comercial', 'Habitación de Ти &amp; X', 'Su habitación'],
        ['en', 'College', 'Pool', 'Mall', "Ти &amp; X's Room", "Girl's Room"]
    ]) {
        await w.l10n.setLanguage(lang);
        assert.equal(w.sc.timelineLocation(lola.subList.find(row => row.roomId === 900)), college);
        assert.equal(w.sc.timelineLocation(lola.subList.find(row => row.roomId === 901)), pool);
        assert.equal(w.sc.timelineLocation(eva.subList.find(row => row.roomId === 400)), mall);
        assert.equal(w.sc.timelineLocation(lola.subList.find(row => row.roomId === 13)), girlsRoom);
        assert.equal(w.sc.timelineLocation({ roomId: 54, room: "Tiffany's Room" }), named);
        assert.equal(w.sc.timelineLocation({ roomId: null, room: 'Unknown location' }), 'Unknown location');
    }
    await w.l10n.setLanguage('bg');
    const mapRows = [];
    w.char = { clearMapPanel: () => {}, addMapText: (left, top, text) => mapRows.push(text), friendlyTime: hour => String(hour) };
    const charSource = source('scripts/char.js');
    w.eval(charSource.slice(charSource.indexOf('char.map = function'), charSource.indexOf('char.friendlyTime = function')));
    w.char.map();
    assert.ok(mapRows.includes('9 до 14 - Университет *'));
    assert.ok(mapRows.includes('14 - 17 - Мол'));
    const phoneRows = [];
    w.nav = { t: row => phoneRows.push(row.text) };
    const phoneSource = source('scripts/phone.js');
    const start = phoneSource.indexOf('    var thisTimeline = sc.getTimeline(name);');
    const end = phoneSource.indexOf('    if (name === "me")', start);
    assert.ok(start >= 0 && end > start);
    w.eval('(function (name) {\n' + phoneSource.slice(start, end) + '\n})')('lola');
    assert.ok(phoneRows.includes('9:00 14:00 Университет'));
    dom.window.close();
    console.log('Passed timeline locations, custom names, language changes and unchanged schedule data.');
})().catch(error => { console.error(error); process.exitCode = 1; });

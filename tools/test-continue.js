const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const source = file => fs.readFileSync(path.join(root, file), 'utf8');
const dom = new JSDOM('<div id="room-buttons"></div><div class="room-left"></div><div id="room_footer"></div><div class="room-topper"></div>', {
    url: 'https://hatmp.test/startGame.html', runScripts: 'outside-only'
});
const w = dom.window;
w.eval(source('scripts/jquery-4.0.0.min.js'));
w.document.createElement('canvas').getContext = () => ({ measureText: () => ({ width: 100 }) });
const createElement = w.document.createElement.bind(w.document);
w.document.createElement = tag => {
    const element = createElement(tag);
    if (tag === 'canvas')
        element.getContext = () => ({ measureText: () => ({ width: 100 }) });
    return element;
};
w.g = { roomID: 1, ratio: 1, version: 28.3, versionText: '0.28.3' };
w.l10n = { t: (key, fallback) => fallback, addSelector() {} };
w.nav = { button() {}, t() {} };
w.invoker = { registerRoom() {} };
w.phone = { build() { throw new Error('The load menu should not open'); } };
w.eval(source('scripts/saves.js'));
w.eval(source('scripts/room/room001.js'));

const valid = roomID => JSON.stringify({ version: 28.3, g: { roomID, roomMap: [] } });
w.saves.folder.init = async () => {};
w.saves.getAllMeta = async () => ({
    '1': { version: 28.3, saveDt: '2026-11-11T09:00:00Z' },
    'auto-2': { version: 28.3, saveDt: '2026-11-12T09:00:00Z' },
    '2': { version: 28.3, saveDt: '2026-11-13T09:00:00Z' },
    '3': { version: 29, saveDt: '2026-11-14T09:00:00Z' }
});
w.saves.getData = async key => key === '2' ? '{broken' : valid(7);

(async () => {
    assert.equal(await w.saves.findLatestSave(), 'auto-2', 'Skip corrupt and newer saves');
    const loaded = [];
    w.saves.load = async key => { loaded.push(key); return true; };
    w.room1.main();
    await new Promise(resolve => setTimeout(resolve, 0));
    const button = w.document.querySelector('[data-name="continue"]');
    assert.equal(button.textContent, 'Continue');
    assert.equal(button.style.left, '802px');
    w.room1.btnclick('continue');
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.deepEqual(loaded, ['auto-2']);
    w.document.getElementById('room-buttons').replaceChildren();
    w.saves.findLatestSave = async () => null;
    w.room1.main();
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(w.document.querySelector('[data-name="continue"]'), null);
    console.log('Passed newest-save selection and conditional title button.');
})().catch(err => { console.error(err); process.exitCode = 1; });

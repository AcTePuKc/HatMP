const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '..', 'scripts/supportingChar.js'), 'utf8');
const start = source.indexOf('sc.select = function');
const end = source.indexOf('sc.swimgirl = function', start);
assert.ok(start > -1 && end > start);
const document = new JSDOM('<div id="room-buttons"></div>').window.document;
let language = 'bg';
const labels = { 'ui.cancel': 'Отказ', 'ui.back': 'Назад', 'room.22.action.pee': 'Пикай' };
const context = {
    sc: {
        selectButtonPosition: index => ({ left: index * 620, top: 0 }),
        drawSelectionButton: button => {
            const image = document.createElement('img');
            image.dataset.name = button.name;
            image.src = button.image;
            document.getElementById('room-buttons').appendChild(image);
        }
    },
    document,
    g: { ratio: 1 },
    l10n: { t: (key, fallback) => language === 'en' ? fallback : (labels[key] || fallback), getLanguage: () => language }
};
vm.createContext(context);
vm.runInContext(source.slice(start, end), context);

context.sc.selectLocalizedLabel('peex', '22_toilet/icon_peex.png', 0, 'room.22.action.pee', 'Piss', '', { width: 330, fontSize: 24 });
assert.equal(document.querySelector('img[data-name="peex"]').getAttribute('aria-label'), 'Пикай');
assert.equal(document.querySelector('div[data-name="peex"]').textContent, 'Пикай');
context.sc.selectCancel('leave', 2);
assert.equal(document.querySelector('div[data-name="leave"]').textContent, 'Отказ');
context.sc.selectBack('back', 3);
assert.equal(document.querySelector('div[data-name="back"]').textContent, 'Назад');
language = 'en';
context.sc.selectCancel('english', 4);
assert.equal(document.querySelector('div[data-name="english"]'), null);
assert.equal(document.querySelector('img[data-name="english"]').title, 'Cancel');
console.log('Passed disabled pee and shared Cancel/Back selection labels.');

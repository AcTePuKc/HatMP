const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const routes = [];
const context = {
    char: { room: id => routes.push(id) },
    g: { internal: { n: 'beer', b: { passout: false, nextOneDrunk: true } } },
    l10n: { t: (key, fallback) => fallback },
    invoker: { registerRoom() {} }
};
vm.createContext(context);
for (const room of [552, 725])
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', `scripts/room/room${room}.js`), 'utf8'), context);

context.room552.chatcatch('reset');
assert.deepEqual(routes, [552], 'The changing-room ending must return to its room');
const warning = context.room725.chat(1000);
assert.equal(warning.l10nKey, 'room.725.drinkResult.drunk');
context.g.internal.b.nextOneDrunk = false;
assert.notEqual(context.room725.chat(1000).l10nKey, 'room.725.drinkResult.drunk');
console.log('Passed changing-room reset and club drink warning routes.');

const backgrounds = [];
const buttons = [];
const dialogue = [];
const ranks = new Map();
const cult = {
    g: { pass: 'lone' },
    gv: { set: (key, value) => ranks.set(key, value), get: key => ranks.get(key) },
    nav: {
        bg: image => backgrounds.push(image),
        button: (button, room) => buttons.push({ button, room }),
        modbutton() {}, killall() {}
    },
    chat: (id, room) => dialogue.push({ id, room }),
    sc: { modLevel() {}, n: name => name },
    invoker: { registerRoom() {} }
};
vm.createContext(cult);
for (const room of [953, 954])
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', `scripts/room/room${room}.js`), 'utf8'), cult);

cult.room953.chatcatch('eman');
cult.room953.chatcatch(cult.room953.chat(21).button[0].callback);
assert.equal(ranks.get('cultRank'), 'Cum Supplier', 'Provider answer must keep the provider rank');
cult.room953.chatcatch('xend');
assert.equal(backgrounds.at(-1), '953_chaple/xend.webp', 'The farewell should show its supplied image');

cult.room954.main();
assert.equal(buttons.at(-1).room, 954, 'The police button must dispatch to Room 954');
cult.room954.btnclick('t29');
assert.equal(backgrounds.at(-1), '954_torture/t29.jpg');
assert.deepEqual(dialogue.at(-1), { id: 53, room: 954 });
console.log('Passed cult-rank, farewell and police-button routes.');

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

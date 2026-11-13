const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const buttons = [];
const chats = [];
const navigation = [];
let envelopeActive = true;
const context = {
    g: { isNight: () => false },
    cl: { isLewd: () => false },
    sc: { getMission: () => ({ fail: true }) },
    missy: {
        getenvelope: () => ({ active: envelopeActive }),
        activecase: () => ({ caseId: 22 }),
        cases: Array.from({ length: 15 }, () => ({ complete: true }))
    },
    gv: { get: () => 0 },
    nav: {
        button: button => buttons.push(button.name),
        buildnav: rooms => navigation.push(rooms)
    },
    chat: (id, room) => chats.push([id, room]),
    invoker: { registerRoom() {} }
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'scripts/room/room250.js'), 'utf8'), context);

context.room250.main();
assert.ok(buttons.includes('hollyStand'), 'Active envelope must still draw Holly');
assert.equal(navigation.length, 1, 'Active envelope must still draw the map');
context.room250.btnclick('hollyStand');
assert.deepEqual(chats.pop(), [26, 250], 'Active envelope must offer the Jeffery route');

envelopeActive = false;
context.room250.btnclick('hollyStand');
assert.deepEqual(chats.pop(), [22, 250], 'Completed diner case keeps its normal dialogue');
console.log('Passed Naked Beaver active-envelope navigation and Holly dialogue.');

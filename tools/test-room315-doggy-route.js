const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const chats = [];
let doggyStatus = 101;
let doggyTaskFailed = false;
const context = {
    g: { gethourdecimal: () => 12 },
    sc: {
        getMission: (name, mission) => mission === '*doggy'
            ? { inProgress: doggyStatus === 1 }
            : { inProgress: false },
        getMissionTask: () => ({ fail: doggyTaskFailed }),
        taskGetStep: () => 1,
        completeMissionTask() {}
    },
    nav: { kill() {}, bg() {} },
    chat: (id, room) => chats.push([id, room]),
    invoker: { registerRoom() {} }
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'scripts/room/room315.js'), 'utf8'), context);

context.room315.btnclick('door');
assert.deepEqual(chats.pop(), [18, 315], 'A completed doggy mission must not block the next Janice story');
doggyStatus = 1;
context.room315.btnclick('door');
assert.deepEqual(chats.pop(), [33, 315], 'An active doggy mission offers the new Room 324 route');
doggyTaskFailed = true;
context.room315.btnclick('door');
assert.deepEqual(chats.pop(), [18, 315], 'Rejecting the doggy route must not trap the player at the door');
console.log('Passed Janice post-cult door routing for completed, active and rejected missions.');

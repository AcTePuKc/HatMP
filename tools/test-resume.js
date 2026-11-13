const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const files = name => fs.readFileSync(path.join(__dirname, '..', 'scripts', name), 'utf8');
const storage = new Map();
const loaded = [];
const resume = {
    document: { addEventListener() {} },
    sessionStorage: {
        getItem: key => storage.get(key) || null,
        setItem: (key, value) => storage.set(key, value),
        removeItem: key => storage.delete(key)
    },
    g: { version: 28.3, roomID: 1, newLoad: true },
    char: {
        applyLoadedState: state => { loaded.push(state); return state.version; },
        finishLoadedState: (version, options) => loaded.push({ version, options })
    },
    console
};
vm.createContext(resume);
vm.runInContext(files('saves.js'), resume);
assert.equal(resume.saves.restoreResume(), false, 'A fresh tab should show the menu');
const state = { version: 28.3, g: { roomID: 7, roomMap: [] } };
resume.saves.rememberResume(JSON.stringify(state));
assert.equal(resume.saves.restoreResume(), true);
assert.equal(loaded[0].g.roomID, 7);
assert.equal(loaded[1].options.restoreRoom, true);
resume.saves.clearResume();
assert.equal(resume.saves.restoreResume(), false, 'Starting a new game clears the checkpoint');
resume.saves.rememberResume(JSON.stringify({ version: 28.3, g: { roomID: 2, roomMap: [] } }));
assert.equal(resume.saves.restoreResume(), false, 'Character setup must return to the title after F5');
assert.equal(storage.size, 0);
const titleCalls = [];
resume.char.room = (...args) => titleCalls.push(args);
resume.phone = { close: () => titleCalls.push('phone closed') };
resume.saves.rememberResume(JSON.stringify(state));
resume.saves.returnToTitle();
assert.equal(resume.saves.shouldAutoResume(), false, 'An intentional title visit survives refresh');
assert.equal(resume.saves.getResumeData() !== null, true, 'The room checkpoint remains available to Continue');
assert.deepEqual(titleCalls, ['phone closed', [1, true]]);
assert.equal(resume.saves.restoreResume(), true);
assert.equal(resume.saves.shouldAutoResume(), true, 'Continuing enables refresh restore again');
resume.saves.rememberResume('{broken');
assert.equal(resume.saves.restoreResume(), false, 'A broken checkpoint must fall back to the menu');
assert.equal(storage.size, 0);

const calls = [];
const $ = () => ({ ready() {}, is: () => false, show() {} });
const room = {
    $, document: {},
    g: {
        roomChange: [], roomID: 7, prevRoom: 5, internal: { phase: 2 },
        dt: new Date('2026-11-13T10:00:00Z'), skipNextRoomSave: false,
        prevview: null
    },
    cl: { cockDisplay() {}, energydisplay() {} },
    nav: { buildRoom: () => calls.push('render') },
    phone: { clear() {}, preservedMenuOverlay: null },
    console
};
vm.createContext(room);
vm.runInContext(files('char.js'), room);
room.menu.makeSaves = () => calls.push('checkpoint');
room.char.updateRoomActionButtons = () => {};
room.char.currentMenuPanel = () => 'body';
room.char.room(7, true);
assert.equal(room.g.dt.toISOString(), '2026-11-13T10:00:00.000Z');
assert.equal(room.g.prevRoom, 5);
assert.equal(room.g.internal.phase, 2);
assert.deepEqual(calls, ['checkpoint', 'render']);
console.log('Passed refresh checkpoint, invalid fallback and no-time-advance restoration.');

// npm ci --prefix tools && npm test --prefix tools
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const source = file => fs.readFileSync(path.join(root, file), 'utf8');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function game(stored) {
    const html = source('tools/dialogue-preview.html').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
    const dom = new JSDOM(html, { url: 'https://hatmp.test/', runScripts: 'outside-only', pretendToBeVisual: true });
    const w = dom.window;
    if (stored !== undefined) w.localStorage.setItem('hatmp.dialogue', stored);
    w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    w.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new w.Event('close')); };
    w.g = { version: "28.2", ratio: 1, roomID: -1, skipChat: false, error: () => {} };
    w.sc = { char: [{ name: 'test', image: 'rand.png' }], n: () => 'Test speaker' };
    w.calls = [];
    w.invoker = { invoke: (...args) => { w.calls.push(args); return w.nextEntry; } };
    for (const file of ['scripts/jquery-4.0.0.min.js', 'l10n/languages.js', 'l10n/en.js', 'l10n/es.js', 'l10n/bg.js', 'scripts/l10n-format.js', 'scripts/localization.js', 'scripts/chat.js', 'scripts/dialogue.js']) w.eval(source(file));
    // jsdom has no layout engine: use display state only for game visibility checks.
    w.$.expr.pseudos.visible = node => node.isConnected && !node.closest('[style*="display: none"], [style*="display:none"]');
    await w.l10n.ready;
    await delay(30);
    return dom;
}
function entry(count = 1, text = 'First paragraph.<br>Second paragraph.') {
    return { speaker: 'test', text, button: Array.from({ length: count }, (_, i) => ({ text: 'Choice ' + i, chatID: -1, callback: 'picked-' + i })) };
}
function key(w, type, keyCode, repeat = false, target = w.document.body) {
    const e = new w.KeyboardEvent(type, { keyCode, which: keyCode, key: keyCode === 32 ? ' ' : String.fromCharCode(keyCode), code: keyCode === 32 ? 'Space' : 'Digit' + (keyCode - 48), repeat, bubbles: true, cancelable: true });
    target.dispatchEvent(e);
    return e;
}

(async () => {
    const dom = await game('{broken');
    const w = dom.window, d = w.document;
    const box = d.querySelector('.room-chatBox');
    const reader = d.getElementById('dialogue_reader');
    assert.equal(w.dialogue.getPreferences().mode, 'enhanced');
    w.privateChat.makeChat(entry(6), 1, -99);
    assert.equal(w.privateChat.visibleButtons().length, 6);
    assert.equal(d.querySelectorAll('.dialogue-actions').length, 1);
    assert.equal(d.getElementById('room_chatskip').style.display, 'none');
    for (const mode of ['classic', 'enhanced', 'classic', 'enhanced']) {
        w.dialogue.setPreferences({ mode, size: 130 });
        assert.equal(box.dataset.dialogueMode, mode);
        assert.equal(w.privateChat.visibleButtons().length, 6);
        assert.equal(w.calls.length, 0, 'Switching layouts must not execute story code');
    }
    assert.equal(JSON.parse(w.localStorage.getItem('hatmp.dialogue')).size, 130);
    w.dialogue.setPreferences({ size: -10, opacity: 'bad', spacing: '<script>' });
    assert.equal(w.dialogue.getPreferences().size, 100);
    assert.equal(w.dialogue.getPreferences().opacity, 85);
    assert.equal(w.dialogue.getPreferences().spacing, 'comfortable');

    reader.scrollTop = 300; box.scrollTop = 200;
    w.privateChat.makeChat(entry(2), 2, -99);
    assert.equal(reader.scrollTop, 0); assert.equal(box.scrollTop, 0);
    reader.scrollTop = 70; w.dialogue.resize();
    assert.equal(reader.scrollTop, 70, 'Resize must preserve reading position');
    w.dialogue.setPreferences({ mode: 'classic' });
    assert.equal(d.getElementById('room_chatBtn0').style.width, '50%');
    w.g.ratio = 0.5; w.dialogue.resize();
    assert.equal(d.getElementById('room_chatBtn0').style.width, '50%', 'Classic choices use the full row without an image gutter');
    assert.ok(d.querySelector('.dialogue-controls-right #room_chatskip'));
    assert.ok(d.querySelector('#room_chatskip .dialogue-icon-symbol'));
    assert.equal(d.querySelector('#room_chatskip').getAttribute('aria-label'), 'Skip dialogue');
    assert.equal(d.querySelector('#room_chatskip img'), null);

    w.dialogue.setPreferences({ mode: 'enhanced' });
    const long = entry(2); long.button[0].text = 'A'.repeat(110);
    w.privateChat.makeChat(long, 3, -99);
    assert.ok(d.getElementById('room_chatBtn0').classList.contains('dialogue-choice-long'));
    assert.equal(d.getElementById('room_chatBtn0').querySelector('.dialogue-choice-label').textContent, 'A'.repeat(110));
    w.dialogue.open('history');
    const historyBefore = d.querySelectorAll('.dialogue-history-entry').length;
    assert.equal(w.calls.length, 0);
    key(w, 'keydown', 49); key(w, 'keyup', 49);
    assert.equal(w.calls.length, 0, 'Modal must block story hotkeys');
    d.getElementById('dialogue_dialog').close();

    // Live language changes must not re-run room entry handlers or add duplicate history.
    await w.l10n.setLanguage('bg');
    assert.equal(d.getElementById('room_footerSpeach').lang, 'en', 'Untranslated source text is English');
    w.dialogue.open('history');
    assert.equal(d.querySelectorAll('.dialogue-history-entry').length, historyBefore);
    d.getElementById('dialogue_dialog').close();
    for (const locale of ['en', 'es', 'bg']) {
        await w.l10n.setLanguage(locale);
        const localized = entry(); localized.l10nKey = 'dialogue.previewText';
        localized.button[0].l10nKey = 'dialogue.previewContinue';
        w.privateChat.makeChat(localized, 4, -99);
        assert.equal(d.getElementById('room_footerSpeach').lang, locale);
        assert.equal(d.getElementById('room_chatBtn0').lang, locale);
        assert.equal(d.getElementById('room_footerSpeach').textContent.includes('{'), false);
    }
    assert.equal(w.calls.length, 0);

    // Inspecting artwork must never advance a choice, lose reading position or add history.
    w.dialogue.open('history');
    const historyBeforeHiding = d.querySelectorAll('.dialogue-history-entry').length;
    d.getElementById('dialogue_dialog').close();
    for (const mode of ['classic', 'enhanced']) {
        w.dialogue.setPreferences({ mode, size: 85 });
        reader.scrollTop = 120; box.scrollTop = 45;
        w.g.skipChat = true; w.privateChat.updateSkipButton(1);
        d.querySelector('[data-l10n="dialogue.hide"]').click();
        assert.equal(w.dialogue.isHidden(), true);
        assert.equal(box.inert, true);
        assert.equal(w.g.skipChat, false);
        assert.equal(w.privateChat.visibleButtons().length, 0);
        assert.equal(d.activeElement, d.querySelector('.dialogue-reveal'));
        key(w, 'keydown', 32); key(w, 'keyup', 32);
        key(w, 'keydown', 49); key(w, 'keyup', 49);
        key(w, 'keyup', 83);
        d.getElementById('room_chatBtn0').click();
        w.privateChat.skipChat();
        await delay(140);
        assert.equal(w.calls.length, 0, 'Hidden dialogue must block choices, hotkeys and pending skip');
        d.querySelector('.dialogue-reveal').click();
        assert.equal(w.dialogue.isHidden(), false);
        assert.equal(box.inert, false);
        assert.equal(reader.scrollTop, 120);
        assert.equal(box.scrollTop, 45);
        w.dialogue.hide();
        const escape = new w.KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true });
        d.dispatchEvent(escape);
        assert.equal(w.dialogue.isHidden(), false);
        assert.equal(escape.defaultPrevented, true);
        w.dialogue.open('history');
        assert.equal(d.querySelectorAll('.dialogue-history-entry').length, historyBeforeHiding);
        d.getElementById('dialogue_dialog').close();
    }
    w.dialogue.hide();
    w.privateChat.makeChat(entry(2), 3, -99);
    assert.equal(w.dialogue.isHidden(), false, 'A new story passage must restore the dialogue');
    w.dialogue.hide();
    w.privateChat.kill();
    assert.equal(w.dialogue.isHidden(), false, 'Closing or leaving a scene clears temporary hiding');

    // A held key must not advance; a deliberate key press selects exactly once.
    w.privateChat.makeChat(entry(2), 5, -99);
    key(w, 'keydown', 49, true); assert.equal(w.calls.length, 0);
    key(w, 'keydown', 49); key(w, 'keyup', 49);
    assert.equal(w.calls.length, 1);
    assert.equal(w.calls[0][1], 'chatcatch');
    assert.equal(w.calls[0][2], 'picked-0');
    assert.equal(w.g.suppressChatChoiceKeyup, true);
    w.privateChat.makeChat(entry(), 6, -99);
    key(w, 'keydown', 32, true); assert.equal(w.calls.length, 1);
    key(w, 'keydown', 32); key(w, 'keyup', 32);
    assert.equal(w.calls.length, 2);

    w.privateChat.makeChat(entry(), 7, -99);
    w.g.skipChat = true; w.privateChat.updateSkipButton(1);
    w.dialogue.open('settings');
    await delay(140);
    assert.equal(w.calls.length, 2, 'Opening settings must cancel queued auto-skip');
    assert.equal(w.g.skipChat, false);
    d.getElementById('dialogue_dialog').close();
    w.g.skipChat = true; w.privateChat.updateSkipButton(1); w.privateChat.kill();
    await delay(140);
    assert.equal(w.calls.length, 2, 'Closing dialogue must cancel queued auto-skip');

    w.dialogue.clearHistory();
    for (let i = 0; i < 85; i++) w.privateChat.makeChat(entry(0, 'Passage ' + i), i, -99);
    w.dialogue.open('history');
    assert.equal(d.querySelectorAll('.dialogue-history-entry').length, 80);
    assert.equal(d.querySelector('.dialogue-history-entry p').textContent, 'Passage 5');
    // Exercise the real initializer and save/import entry points with unrelated rendering stubbed.
    const ready = w.$.fn.ready;
    w.$.fn.ready = function () { return this; };
    w.eval(source('scripts/char.js'));
    w.$.fn.ready = ready;
    w.eval(source('scripts/global.js'));
    w.eval(source('scripts/saves.js'));
    w.g.roomMapInit = () => { w.g.roomMap = []; };
    w.gv = { init: () => {}, load: () => {} };
    w.cl = { init: () => {}, load: () => {}, wearSavedOutfit: () => {} };
    w.inv = { load: () => {} }; w.missy = { load: () => {} }; w.pic = { load: () => {} };
    w.sc.load = () => {}; w.m = { createFmap: () => {} }; w.fame = { moanAnimateStop: () => {} };
    w.char.showGameShell = () => {};
    w.char.finishLoadedState = () => w.privateChat.makeChat(entry(0, 'New timeline'), 0, -99);
    const save = JSON.stringify({ version: 28.2, g: { roomID: 7, dt: '2026-10-26T12:00:00.000Z', roomMap: [] } });
    const prefsBeforeReset = w.localStorage.getItem('hatmp.dialogue');
    function assertNewTimeline() {
        assert.equal(w.dialogue.isOpen(), false);
        w.dialogue.open('history');
        assert.equal(d.querySelectorAll('.dialogue-history-entry').length, 1);
        assert.equal(d.querySelector('.dialogue-history-entry p').textContent, 'New timeline');
        d.getElementById('dialogue_dialog').close();
        assert.equal(w.localStorage.getItem('hatmp.dialogue'), prefsBeforeReset);
    }
    w.saves.getData = async () => save;
    await w.saves.load('1');
    assertNewTimeline();
    w.privateChat.makeChat(entry(0, 'Discarded branch'), 1, -99);
    w.dialogue.hide();
    w.char.import(save); // The sidebar Back handler uses this same entry point.
    assert.equal(w.dialogue.isHidden(), false);
    assertNewTimeline();
    const imported = d.createElement('textarea'); imported.id = 'room_export_data'; imported.value = save; d.body.appendChild(imported);
    w.privateChat.makeChat(entry(0, 'Another save'), 2, -99);
    w.char.import(null);
    assertNewTimeline();
    w.saves.getData = async () => null;
    assert.equal(await w.saves.load('missing'), false);
    assertNewTimeline();
    assert.throws(() => w.char.import('{broken'));
    assertNewTimeline();
    w.g.skipChat = true; w.privateChat.updateSkipButton(1);
    w.dialogue.open('history');
    w.char.initGame();
    assert.equal(w.dialogue.isOpen(), false);
    assert.equal(w.privateChat.currentEntry, null);
    assert.equal(w.privateChat.skipTimer, null);
    assert.equal(w.g.skipChat, false);
    w.dialogue.open('history');
    assert.equal(d.querySelectorAll('.dialogue-history-entry').length, 0);
    assert.equal(w.localStorage.getItem('hatmp.dialogue'), prefsBeforeReset);
    await w.l10n.setLanguage('bg');
    const speech = d.getElementById('room_footerSpeach');
    speech.textContent = 'Bonjour! Ma maison est ta maison. Au revoir.';
    w.privateChat.addFrenchTranslations({ speaker: 'zoey' }, 501);
    const phrases = speech.querySelectorAll('.french-phrase');
    assert.equal(phrases.length, 3);
    assert.equal(speech.textContent, 'Bonjour! Ma maison est ta maison. Au revoir.');
    phrases[1].click();
    assert.equal(speech.querySelector('.french-translation').textContent, 'Моят дом е и твой дом');
    assert.equal(phrases[1].getAttribute('aria-expanded'), 'true');
    phrases[1].click();
    assert.equal(speech.querySelector('.french-translation'), null);
    speech.textContent = 'Bonjour';
    w.privateChat.addFrenchTranslations({ speaker: 'someone-else' }, 501);
    assert.equal(speech.querySelector('.french-phrase'), null);
    const settings = w.localStorage.getItem('hatmp.dialogue');
    dom.window.close();
    const restored = await game(settings);
    assert.equal(restored.window.dialogue.getPreferences().mode, 'enhanced');
    restored.window.close();
    console.log('Passed dialogue modes, callbacks, three languages, fallback language, scroll, resize, history, preferences and keyboard/timer regression checks.');
})().catch(error => { console.error(error); process.exitCode = 1; });

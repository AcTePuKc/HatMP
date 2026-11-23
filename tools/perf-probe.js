// Measure the offline game in a fresh headless Chrome profile without touching player saves.
// Usage: node tools/perf-probe.js [--root PATH] [--runs 3] [--rooms 10,28,250] [--actions 456:cop2] [--save-slots 500] [--cpu-rate 4] [--trace-nav] [--smoke-route] [--smoke-tony]
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');

const args = process.argv.slice(2);
function option(name, fallback) {
    const at = args.indexOf(name);
    return at < 0 ? fallback : args[at + 1];
}
const root = path.resolve(option('--root', path.resolve(__dirname, '..')));
const runs = Math.max(1, Math.min(10, Number(option('--runs', '3')) || 3));
const rooms = String(option('--rooms', '10,28,250')).split(',').map(Number).filter(Number.isInteger);
const actions = String(option('--actions', '')).split(',').filter(Boolean).map(entry => {
    const split = entry.indexOf(':');
    return { room: Number(entry.slice(0, split)), name: entry.slice(split + 1) };
}).filter(action => Number.isInteger(action.room) && action.name);
const saveSlots = Math.max(0, Math.min(2000, Number(option('--save-slots', '0')) || 0));
const cpuRate = Math.max(1, Math.min(10, Number(option('--cpu-rate', '1')) || 1));
const traceNav = args.includes('--trace-nav');
const smokeRoute = args.includes('--smoke-route');
const smokeTony = args.includes('--smoke-tony');
const chrome = option('--chrome', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe');
const entry = path.join(root, 'startGame.html');
if (!fs.existsSync(chrome) || !fs.existsSync(entry)) throw new Error('Chrome or startGame.html not found');

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function launch() {
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'hatmp-perf-'));
    const proc = spawn(chrome, [
        '--headless=new', '--no-first-run', '--no-default-browser-check',
        '--disable-extensions', '--disable-background-networking',
        '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'
    ], { stdio: 'ignore', windowsHide: true });
    const portFile = path.join(profile, 'DevToolsActivePort');
    let port = null;
    for (let i = 0; i < 100; i++) {
        if (fs.existsSync(portFile)) {
            port = Number(fs.readFileSync(portFile, 'utf8').split(/\r?\n/)[0]);
            break;
        }
        if (proc.exitCode !== null) break;
        await delay(100);
    }
    if (!port) {
        proc.kill();
        throw new Error('Chrome DevTools did not start');
    }
    return { proc, profile, port };
}

async function connect(port) {
    let pages;
    for (let i = 0; i < 30; i++) {
        try {
            pages = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
            if (pages.some(page => page.type === 'page')) break;
        } catch (_) { }
        await delay(100);
    }
    const page = pages && pages.find(item => item.type === 'page');
    if (!page) throw new Error('Chrome page target not found');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
        ws.addEventListener('open', resolve, { once: true });
        ws.addEventListener('error', reject, { once: true });
    });
    let nextId = 0;
    const pending = new Map();
    const listeners = new Map();
    const pageErrors = [];
    ws.addEventListener('message', event => {
        const message = JSON.parse(event.data);
        if (message.method === 'Runtime.exceptionThrown')
            pageErrors.push(message.params.exceptionDetails.text || 'Uncaught exception');
        if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error')
            pageErrors.push(message.params.args.map(arg => arg.value || arg.description || '').join(' '));
        if (message.id) {
            const task = pending.get(message.id);
            pending.delete(message.id);
            if (task) message.error ? task.reject(new Error(message.error.message)) : task.resolve(message.result);
        } else if (listeners.has(message.method)) {
            for (const listener of listeners.get(message.method)) listener(message.params);
        }
    });
    function send(method, params = {}) {
        const id = ++nextId;
        return new Promise((resolve, reject) => {
            pending.set(id, { resolve, reject });
            ws.send(JSON.stringify({ id, method, params }));
        });
    }
    function once(method, timeoutMs = 30000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => { remove(); reject(new Error('Timed out waiting for ' + method)); }, timeoutMs);
            const handler = value => { clearTimeout(timer); remove(); resolve(value); };
            function remove() { listeners.get(method)?.delete(handler); }
            if (!listeners.has(method)) listeners.set(method, new Set());
            listeners.get(method).add(handler);
        });
    }
    async function evaluate(expression, awaitPromise = false) {
        const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise });
        if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || 'Page evaluation failed');
        return response.result.value;
    }
    return { ws, send, once, evaluate, pageErrors };
}

async function measure(run) {
    const browser = await launch();
    let cdp;
    try {
        cdp = await connect(browser.port);
        await cdp.send('Page.enable');
        await cdp.send('Runtime.enable');
        await cdp.send('Performance.enable');
        if (cpuRate > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpuRate });
        const loaded = cdp.once('Page.loadEventFired', 60000);
        await cdp.send('Page.navigate', { url: pathToFileURL(entry).href });
        await loaded;
        let titleReady = false;
        for (let i = 0; i < 100; i++) {
            titleReady = await cdp.evaluate('!!document.querySelector("[data-name=start]")');
            if (titleReady) break;
            await delay(100);
        }
        const startup = await cdp.evaluate(`(() => {
            const n = performance.getEntriesByType('navigation')[0];
            return {
                ready: !!document.querySelector('[data-name=start]'),
                domContentLoadedMs: n.domContentLoadedEventEnd - n.startTime,
                loadMs: n.loadEventEnd - n.startTime,
                titleReadyMs: performance.now(),
                scriptTags: document.scripts.length,
                images: document.images.length,
                imagesLoaded: [...document.images].filter(img => img.complete && img.naturalWidth > 0).length
            };
        })()`);
        const metrics = await cdp.send('Performance.getMetrics');
        for (const metric of metrics.metrics) {
            if (['JSHeapUsedSize', 'ScriptDuration', 'TaskDuration', 'LayoutDuration'].includes(metric.name))
                startup[metric.name] = metric.value;
        }
        if (traceNav) await cdp.evaluate(`(() => {
            window.__navTrace = {};
            const wrap = (object, name, label) => {
                const original = object[name];
                object[name] = function (...args) {
                    const begin = performance.now();
                    try { return original.apply(this, args); }
                    finally {
                        const traceLabel = label === '$.is' ? label + ':' + String(args[0]) + ':' +
                            (this[0]?.id || this[0]?.className || 'unknown') : label;
                        const item = window.__navTrace[traceLabel] || { calls: 0, ms: 0 };
                        item.calls++;
                        item.ms += performance.now() - begin;
                        window.__navTrace[traceLabel] = item;
                    }
                };
            };
            for (const name of ['bg', 'button', 'buildnav', 'bars', 'buildclock']) wrap(nav, name, 'nav.' + name);
            wrap(char, 'syncVisibleRoomShortcutTitles', 'char.syncShortcutTitles');
            wrap(invoker, 'invoke', 'invoker.invoke');
            wrap(room10, 'main', 'room10.main');
            wrap(room10, 'btnclick', 'room10.btnclick');
            wrap(room10, 'showWhenLoaded', 'room10.showWhenLoaded');
            wrap(cl, 'hasoutfit', 'cl.hasoutfit');
            wrap(sc, 'getTimeline', 'sc.getTimeline');
            wrap(sc, 'getMission', 'sc.getMission');
            wrap(inv, 'has', 'inv.has');
            wrap(inv, 'createElements', 'inv.createElements');
            wrap(room401, 'main', 'room401.main');
            wrap(l10n, 't', 'l10n.t');
            for (const name of ['show', 'hide', 'append', 'html', 'is', 'css']) wrap($.fn, name, '$.' + name);
        })()`);
        const transitions = [];
        for (const room of rooms) {
            const result = await cdp.evaluate(`(async () => {
                try {
                    if (!window.__perfGameInit) { char.initGame(); window.__perfGameInit = true; }
                    const begin = performance.now();
                    char.room(${room}, true);
                    const builtMs = performance.now() - begin;
                    const imgs = [...document.querySelectorAll('#room-background img, #room-buttons img')];
                    await Promise.race([
                        Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(resolve => {
                            img.addEventListener('load', resolve, {once:true});
                            img.addEventListener('error', resolve, {once:true});
                        }))),
                        new Promise(resolve => setTimeout(resolve, 10000))
                    ]);
                    return { room: ${room}, renderedRoom: g.roomID, builtMs, imagesReadyMs: performance.now() - begin,
                        images: imgs.length, loaded: imgs.filter(img => img.complete && img.naturalWidth > 0).length,
                        shortcutTitles: ${traceNav} ? [...document.querySelectorAll('#room-buttons .rom-event')]
                            .map(button => button.title).filter(title => title && title.includes('Shortcut:')) : undefined,
                        trace: window.__navTrace ? structuredClone(window.__navTrace) : undefined };
                } catch (error) { return { room: ${room}, error: String(error) }; }
            })()`, true);
            transitions.push(result);
            if (traceNav) await cdp.evaluate('window.__navTrace = {}');
        }
        for (const action of actions) {
            const result = await cdp.evaluate(`(async () => {
                try {
                    char.room(${action.room}, true);
                    const begin = performance.now();
                    invoker.invoke(${action.room}, 'btnclick', ${JSON.stringify(action.name)});
                    const imgs = [...document.querySelectorAll('#room-buttons img')];
                    await Promise.race([
                        Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(resolve => {
                            img.addEventListener('load', resolve, {once:true});
                            img.addEventListener('error', resolve, {once:true});
                        }))),
                        new Promise(resolve => setTimeout(resolve, 10000))
                    ]);
                    return { room: ${action.room}, action: ${JSON.stringify(action.name)}, elapsedMs: performance.now() - begin,
                        images: imgs.map(img => ({ src: img.getAttribute('src'), loaded: img.complete && img.naturalWidth > 0 })) };
                } catch (error) { return { room: ${action.room}, action: ${JSON.stringify(action.name)}, error: String(error) }; }
            })()`, true);
            transitions.push(result);
        }
        let route = null;
        if (smokeRoute) {
            route = await cdp.evaluate(`(async () => {
                try {
                    if (!window.__perfGameInit) { char.initGame(); window.__perfGameInit = true; }
                    const visited = [];
                    const clickRoom = destination => {
                        const button = document.querySelector('#room_footer .room-changeRoomBtn[data-roomid="' + destination + '"]');
                        if (!button) throw new Error('Missing navigation button for Room ' + destination);
                        button.click();
                        visited.push(g.roomID);
                        if (g.roomID !== destination) throw new Error('Navigation did not enter Room ' + destination);
                    };
                    cl.c.shirt = 'g';
                    cl.c.pants = 'j';
                    char.room(10, true);
                    visited.push(g.roomID);
                    clickRoom(11);
                    clickRoom(10);
                    $('#room_footer').hide();
                    $('#room_chatOverlay').show();
                    nav.buildnav([11], true);
                    const footerHiddenDuringDialogue = document.getElementById('room_footer').style.display === 'none';
                    $('#room_chatOverlay').hide();
                    nav.buildnav([11], true);
                    const footerRestoredAfterDialogue = document.getElementById('room_footer').style.display !== 'none';
                    const imgs = [...document.querySelectorAll('#room-background img, #room-buttons img')];
                    await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(resolve => {
                        img.addEventListener('load', resolve, {once:true});
                        img.addEventListener('error', resolve, {once:true});
                    })));
                    return { visited, footerHiddenDuringDialogue, footerRestoredAfterDialogue,
                        images: imgs.length, loaded: imgs.filter(img => img.complete && img.naturalWidth > 0).length,
                        visibleLayers: ['room-background', 'room-buttons'].every(id => {
                            const element = document.getElementById(id);
                            return element && element.getClientRects().length > 0;
                        }) };
                } catch (error) { return { error: String(error), room: g.roomID,
                    footer: [...document.querySelectorAll('#room_footer .room-changeRoomBtn')].map(button => button.dataset.roomid),
                    outfit: cl.hasoutfit('public') }; }
            })()`, true);
        }
        let tonyScene = null;
        if (smokeTony) {
            tonyScene = await cdp.evaluate(`(async () => {
                try {
                    if (!window.__perfGameInit) { char.initGame(); window.__perfGameInit = true; }
                    char.room(601, true);
                    const entries = {};
                    for (const language of ['en', 'bg', 'es']) {
                        if (!await l10n.setLanguage(language)) throw new Error('Could not load ' + language);
                        entries[language] = [50, 52, 53, 54, 55, 56].map(id => {
                            const entry = l10n.chatEntry(room601.chat(id), id, 601);
                            return { id, text: sc.replaceChat(entry.text), choices: entry.button.map(b => sc.replaceChat(b.text)) };
                        });
                    }
                    const branches = [];
                    const originalGet = missy.getenvelope, originalSet = missy.setenvelope, originalChat = window.chat;
                    try {
                        for (const hasKey of [true, false]) {
                            let called = null, completed = null;
                            missy.getenvelope = () => ({ hasKey });
                            missy.setenvelope = name => { completed = name; };
                            window.chat = id => { called = id; };
                            room601.chatcatch('missy8');
                            branches.push({ hasKey, called, completed });
                        }
                    } finally { missy.getenvelope = originalGet; missy.setenvelope = originalSet; window.chat = originalChat; }
                    return { entries, branches };
                } catch (error) { return { error: String(error) }; }
            })()`, true);
        }
        let saveMeta = null;
        if (saveSlots > 0) {
            saveMeta = await cdp.evaluate(`(async () => {
                const count = ${saveSlots};
                const db = await saves.openDb();
                if (!db) return { error: 'IndexedDB unavailable' };
                await new Promise((resolve, reject) => {
                    const tx = db.transaction(['meta'], 'readwrite');
                    const store = tx.objectStore('meta');
                    for (let i = 0; i < count; i++) {
                        store.put({ version: g.version, savename: 'Benchmark ' + i,
                            saveDt: new Date().toISOString(), room: 'Test room',
                            thumb: { bg: './images/room/10_myroom/bg.jpg', layers: [] } }, 'perf-' + i);
                    }
                    tx.oncomplete = resolve;
                    tx.onerror = () => reject(tx.error);
                });
                const samples = [];
                for (let i = 0; i < 5; i++) {
                    const start = performance.now();
                    const list = await saves.getAllMeta();
                    samples.push({ ms: performance.now() - start, slots: Object.keys(list).length });
                }
                return { requestedSlots: count, samples };
            })()`, true);
        }
        return { run, cpuRate, startup, transitions, route, tonyScene, saveMeta, pageErrors: cdp.pageErrors.slice(0, 10) };
    } finally {
        cdp?.ws.close();
        browser.proc.kill();
        await delay(200);
        const tempRoot = path.resolve(os.tmpdir()) + path.sep;
        if (!path.resolve(browser.profile).startsWith(tempRoot)) throw new Error('Unsafe profile cleanup path');
        fs.rmSync(browser.profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    }
}

(async () => {
    const results = [];
    for (let run = 1; run <= runs; run++) {
        const result = await measure(run);
        results.push(result);
        console.log(JSON.stringify(result));
        if (smokeRoute && (result.route?.error || !result.route?.visibleLayers ||
            !result.route?.footerHiddenDuringDialogue || !result.route?.footerRestoredAfterDialogue ||
            result.route.loaded !== result.route.images || result.pageErrors.length > 0))
            throw new Error('Room 10 → 11 → 10 browser route failed');
        if (smokeTony && (result.tonyScene?.error || result.pageErrors.length ||
            result.tonyScene?.branches?.some(b => b.called !== (b.hasKey ? 55 : 56) || b.completed !== 'tony') ||
            ['bg', 'es'].some(lang => result.tonyScene?.entries?.[lang]?.some((entry, i) =>
                entry.text === result.tonyScene.entries.en[i].text))))
            throw new Error('Room 601 Tony scene browser check failed');
    }
    console.error('Measured ' + results.length + ' fresh Chrome profiles from ' + root);
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const source = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

(async () => {
    for (const entry of ['index.html', 'startGame.html']) {
        const dom = new JSDOM(source(entry), { url: 'https://hatmp.test/', runScripts: 'outside-only' });
        const w = dom.window;
        w.console.warn = () => {};
        for (const file of ['scripts/jquery-4.0.0.min.js', 'l10n/languages.js', 'l10n/en.js', 'l10n/bg.js', 'l10n/es.js', 'scripts/l10n-format.js', 'scripts/localization.js']) w.eval(source(file));
        await w.l10n.ready;
        w.g = { ratio: 0.5, makeCss: () => 'width:75px;height:75px;' };
        w.char = {};
        const charSource = source('scripts/char.js');
        w.eval(charSource.slice(charSource.indexOf('char.applyScaledShellStyles = function'), charSource.indexOf('char.clearMapPanel = function')));
        w.char.applyScaledShellStyles({ leftMenuWidth: 300, menuBoxWidth: 290, menuBoxHeight: 88, menuBoxImgWidth: 290, menuBoxImgHeight: 88, resizeHeight: 4, graphBarHeight: 15 });
        assert.equal(w.document.querySelector('#room_left_graph').style.getPropertyValue('--stats-scale'), '0.5');
        assert.equal(w.document.querySelector('#room_left_graph').style.getPropertyValue('--stats-min-height'), '44px');
        w.gv = { st: [{}], get: key => ({ money: 100, energy: 80, maxenergy: 160, hormone: 80 })[key] };
        w.levels = {
            st: [{ n: 'fitness', d: 'Fitness', c: 20, l: 15, display: true }, { n: 'stripper', d: 'Stripping', c: 0, l: 3, display: true }, { n: 'whore', d: 'Whore', c: 0, l: 0, display: true }],
            getPointsCapForLevel: () => 100,
            desc: (name, level) => name === 'fitness' ? { count: level, txt: '60 Energy Boost' } : { count: -1, txt: 'not found' }
        };
        w.eval(source('scripts/clothes.js'));
        w.cl.c = {};
        w.cl.appearance = () => 3;
        w.eval(source('scripts/stats.js'));
        const text = selector => w.document.querySelector(selector).textContent;
        for (const [lang, title, energy, fitness, hormone, appearance] of [
            ['bg', 'Трансформация', 'Енергия', 'Физическа форма 15', 'Възможна трансформация', 'Секси'],
            ['es', 'Transformación', 'Energía', 'Forma física 15', 'Transformación posible', 'Sexy'],
            ['en', 'Trans', 'Energy', 'Fitness 15', 'Transformation Possible', 'Sexy']
        ]) {
            await w.l10n.setLanguage(lang);
            assert.equal(text('[data-l10n="stats.section.transformation"]'), title, entry + ' ' + lang);
            assert.equal(text('[data-l10n="stats.label.energy"]'), energy, entry + ' ' + lang);
            assert.equal(text('.rl-levelheader[data-name="fitness"]'), fitness, entry + ' ' + lang);
            assert.equal(text('.rl-level[data-name="hormone"]'), hormone, entry + ' ' + lang);
            assert.equal(text('#rl_appearance'), appearance, entry + ' ' + lang);
            assert.equal(w.document.querySelector('#char_charDisplay img').title, appearance, entry + ' ' + lang);
            assert.equal(text('.rl-level[data-name="stripper"]'), '', entry + ' stripper');
            assert.equal(text('.rl-level[data-name="whore"]'), '', entry + ' whore');
        }
        dom.window.close();
    }
    console.log('Passed sidebar sections, stat refresh, appearance, missing descriptions and BG/ES/EN language switching in both entry pages.');
})().catch(error => { console.error(error); process.exitCode = 1; });

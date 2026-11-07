// Run with: node tools/test-phone-guides.js
// Uses the real guide, character, clock, and localization code with drawing stubbed.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

async function createGame(locale, clock) {
    const context = vm.createContext({
        console, window: {}, invoker: { registerRoom: () => {} },
        $: () => ({ on: () => {} }),
        localStorage: { getItem: () => locale },
        document: { documentElement: {}, querySelectorAll: () => [] },
        g: {
            version: '28.2', startDate: new Date(2026, 9, 23), dt: new Date(2026, 9, 23, 12),
            gethourdecimal: () => 12,
            getRooms: id => ({ name: 'Room ' + id }),
            fr: id => ({ name: 'Room ' + id })
        }
    });
    for (const file of ['l10n/languages.js', 'l10n/en.js', 'l10n/bg.js', 'l10n/es.js',
        'scripts/l10n-format.js', 'scripts/localization.js', 'scripts/gamevariables.js', 'scripts/nav.js',
        'scripts/supportingChar.js', 'scripts/phone.js']) {
        vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
    }
    await context.l10n.ready;
    context.gv.st.find(entry => entry.n === 'clock24').t = clock;
    context.drawn = [];
    context.nav.t = item => context.drawn.push(item);
    context.nav.button = item => context.drawn.push(item);
    context.nav.killbuttonStartsWith = () => {};
    for (const method of ['clear', 'backbutton', 'showPanel', 'addLocalizedPanelText', 'addStatBar'])
        context.phone[method] = () => {};
    return context;
}

(async () => {
    let cases = 0;
    for (const locale of ['en', 'bg', 'es']) {
        for (const clock of ['12', '24']) {
            const game = await createGame(locale, clock);
            console.log('Checking Elijah:', locale, clock + 'h');
            game.i = -123;
            assert.equal(game.gv.get('clock24'), clock);
            assert.equal(game.i, -123, 'Setting lookup must not change a caller\'s counter');
            const before = JSON.stringify([game.sc.char, game.sc.charMission, game.gv.st]);
            vm.runInContext("phone.characterSelect('elijah')", game, { timeout: 1000 });
            const buttons = game.drawn.filter(item => item.type === 'zbtn').map(item => item.name);
            assert.deepEqual(buttons, ['phone_charsel_elijah_elijah', 'phone_charsel_elijah_betray']);
            for (const mission of game.sc.charMission.find(entry => entry.name === 'elijah').mission) {
                game.drawn.length = 0;
                vm.runInContext('phone.handlePrefixAction(' + JSON.stringify('phone_charsel_elijah_' + mission.missionName) + ')', game, { timeout: 1000 });
                const tasks = game.drawn.filter(item => item.font === 24);
                assert.equal(tasks.length, mission.task.filter(task => task.show).length);
                assert.equal(new Set(tasks.map(item => item.top)).size, tasks.length);
                const expectedTasks = mission.task.filter(task => task.show).map(task =>
                    game.phone.characterGuideText('elijah', mission.missionName,
                        'task.' + (task.localizationId ?? task.id), task.txt));
                tasks.forEach((item, index) => assert.ok(item.text.includes(expectedTasks[index])));
            }
            assert.equal(JSON.stringify([game.sc.char, game.sc.charMission, game.gv.st]), before,
                'Opening guides must not change game progress');
            cases++;
        }
    }
    console.log('Passed ' + cases + ' Elijah guide cases, including both expanded mission lists.');
})().catch(error => { console.error(error); process.exitCode = 1; });

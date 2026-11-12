var charisma = {};

charisma.getStats = function (charismaLevel) {
    var myCharisma = levels.get("charisma").l;
    var baseRoll = 12 + charismaLevel;
    var appearance = cl.appearance();
    var rollNeeded = baseRoll - myCharisma - appearance;
    
    
    var stat = g.getSingleRoll(rollNeeded);
    return { n: stat, txt: l10n.t("charisma.chanceLabel", "[Charisma Roll: {chance}%] ", { chance: stat }), baseRoll: baseRoll, rollNeeded: rollNeeded, myCharisma: myCharisma, appearance: appearance };
};

charisma.getIntel = function (charismaLevel) {
    var myCharisma = levels.get("pi").l;
    var baseRoll = 12 + charismaLevel;
    var rollNeeded = baseRoll - myCharisma;


    var stat = g.getSingleRoll(rollNeeded);
    return { n: stat, txt: l10n.t("charisma.intelligenceChanceLabel", "[Intelligence Roll: {chance}%] ", { chance: stat }), baseRoll: baseRoll, rollNeeded: rollNeeded, myCharisma: myCharisma, appearance: 0 };
};

charisma.drawOverlayShell = function () {
    nav.button({
        "type": "img",
        "name": "quickfight",
        "left": 0,
        "top": 0,
        "width": 1920,
        "height": 1080,
        "image": "1002_quickfight/black20Alpha.png"
    }, 1);
    nav.button({
        "type": "img",
        "name": "quickfight",
        "left": 1597,
        "top": 147,
        "width": 306,
        "height": 712,
        "image": "227_fight/menu.png"
    }, 1);
    nav.button({
        "type": "btn",
        "name": "charismaRoll",
        "left": 760,
        "top": 300,
        "width": 400,
        "height": 100,
        "image": "1002_quickfight/roll.png"
    }, 1);
};

charisma.drawStatLine = function (row, text) {
    nav.t({
        type: "img",
        name: "quickfight",
        left: 1660,
        top: 280 + (row * 50) + 12,
        font: 20,
        hex: "#ffffff",
        text: text
    }, 1);
};

charisma.drawRollSummary = function (title, stat, primaryLabel, secondaryLabel, totalLabel) {
    nav.t({
        type: "zimg",
        name: "quickfight",
        left: 1620,
        top: 180,
        font: 30,
        hex: "#ffffff",
        text: title
    }, 1);
    charisma.drawStatLine(0, primaryLabel + stat.myCharisma);
    if (secondaryLabel !== null)
        charisma.drawStatLine(1, secondaryLabel + stat.appearance);
    if (totalLabel !== null)
        charisma.drawStatLine(2, totalLabel + (stat.myCharisma + stat.appearance));
    charisma.drawStatLine(4, l10n.t("charisma.baseRoll", "Base Roll Needed : {value}", { value: stat.baseRoll }));
    charisma.drawStatLine(5, l10n.t("charisma.adjustedRoll", "Adjusted Roll Needed : {value}", { value: stat.rollNeeded }));
    charisma.drawStatLine(6, l10n.t("charisma.chance", "Chance: {value}%", { value: stat.n }));
};

charisma.init = function (charismaLevel, btnPressWin, btnPressLost, roomID) {
    trophy.add(49);
    var stat = charisma.getStats(charismaLevel);
    charisma.drawOverlayShell();
    charisma.drawRollSummary(l10n.t("charisma.title", "Charisma"), stat, l10n.t("charisma.yours", "Your Charisma: "), l10n.t("charisma.bonus", "Sexy Bonus: "), l10n.t("charisma.total", "Total Charisma: "));
    

    g.fight = {
        myCharisma: stat.myCharisma,
        appearance: stat.appearance,
        baseRoll: stat.baseRoll,
        rollNeeded: stat.rollNeeded,
        aftermath: null,
        btnPressWin: btnPressWin,
        btnPressLost: btnPressLost,
        prob: stat.n,
        roomID: roomID
    };
};

charisma.drawRoll = function () {
    nav.killbutton("charismaRoll");
    var mydice, enemydice, myTotal, enemyTotal;
    myTotal = 0;
    mydice = new Array();
    enemydice = new Array();
    var winText = ["You're a winner!", "You're so sexy", "Smooth talker", "Way to go!", "You're excellent", "Awesome!", "You're amazing!"];
    var loseText = ["You fucked up", "Loser!", "Ah shit!", "Blubber butt", "That was stupid", "Whoops", "Oh shit", "Lost", "You lost. Sad."];
    nav.t({
        type: "img",
        name: "quickfight",
        left: 1350,
        top: 150,
        font: 40,
        hex: "#ffffff",
        text: l10n.t("charisma.myRoll", "My Roll")
    }, 1);
    nav.button({
        "type": "img",
        "name": "quickfight",
        "left": 575,
        "top": 340,
        "width": 700,
        "height": 400,
        "image": "1002_quickfight/titleBox.png"
    }, 1);
    while (myTotal === g.fight.rollNeeded || myTotal === 0) {
        myTotal = 0;
        nav.killbutton("quickfightdice");
        for (var i = 0; i < 5; i++) {
            var myTemp = Math.floor(Math.random() * 6) + 1;
            myTotal += myTemp;

            nav.button({
                "type": "img",
                "name": "quickfightdice",
                "left": 1350,
                "top": 200 + (i * 160),
                "width": 150,
                "height": 150,
                "image": "1001_rand/dice" + myTemp + ".png"
            }, 1);
        }
    }

    nav.t({
        type: "img",
        name: "quickfight",
        left: 640,
        top: 380,
        font: 30,
        hex: "#ffffff",
        text: l10n.t("charisma.resultRoll", "Me<br/>Roll: {value}<br/>", { value: myTotal })
    }, 1);
    nav.t({
        type: "img",
        name: "quickfight",
        left: 1050,
        top: 380,
        font: 30,
        hex: "#ffffff",
        text: l10n.t("charisma.neededRoll", "Needed</br>Roll: {value}", { value: g.fight.rollNeeded })
    }, 1);

    if (myTotal > g.fight.rollNeeded) {
        trophy.add(50);
        g.fight.aftermath = "win";
        gv.mod("energy", -5);
        nav.t({
            type: "img",
            name: "quickfight",
            left: 800,
            top: 600,
            font: 30,
            hex: "#ffffff",
            text: charisma.resultText("win", winText)
        }, 1);
        nav.button({
            "type": "btn",
            "name": "charismaComplete",
            "left": 725,
            "top": 800,
            "width": 400,
            "height": 100,
            "image": "1002_quickfight/won.png"
        }, 1);
    }
    else {
        g.fight.aftermath = "lose";
        gv.set("energy", 0);
        nav.t({
            type: "img",
            name: "quickfight",
            left: 800,
            top: 600,
            font: 30,
            hex: "#ffffff",
            text: charisma.resultText("lose", loseText)
        }, 1);
        nav.button({
            "type": "btn",
            "name": "charismaComplete",
            "left": 725,
            "top": 800,
            "width": 400,
            "height": 100,
            "image": "1002_quickfight/lost.png"
        }, 1);
    }
};

charisma.resultText = function (outcome, choices) {
    const index = Math.floor(Math.random() * choices.length);
    return l10n.t("charisma.result." + outcome + "." + index, choices[index]);
};

charisma.complete = function () {
    nav.killbutton("quickfight");
    nav.killbutton("quickfightdice");
    nav.killbutton("charismaComplete");
    var name;
    var roomId = g.fight.roomID;
    if (g.fight.appearance !== -999)
        levels.mod("charisma", 20);
    if (g.fight.aftermath === "win")
        name = g.fight.btnPressWin;
    else
        name = g.fight.btnPressLost;

    g.fight = null;
    invoker.invoke(roomId, "btnclick", name);
};

charisma.itelInit = function (intelLevel, btnPressWin, btnPressLost, roomID) {
    let stat = charisma.getIntel(intelLevel);
    charisma.drawOverlayShell();
    charisma.drawRollSummary(l10n.t("charisma.intelligence", "Intelligence"), stat, l10n.t("charisma.yourIntelligence", "Your Intelligence: "), null, null);


    g.fight = {
        myCharisma: stat.myCharisma,
        appearance: -999,
        baseRoll: stat.baseRoll,
        rollNeeded: stat.rollNeeded,
        aftermath: null,
        btnPressWin: btnPressWin,
        btnPressLost: btnPressLost,
        prob: stat.n,
        roomID: roomID
    };
};

//Room name
var room321 = {};
room321.main = function () {
    char.changeMenu("hide", false, true);
    daily.set("janiceWebcam");
    g.internal = {
        chat: new Array(),
        button: "main",
        viewers: 0,
        ticks: 0,
        excitement: 0,
        money: 0,
        currentpose: 0,
        maxviews: 50,
        fame: 3
    };
    
    let btnList = [
        {
            "type": "img",
            "name": "fb",
            "left": 0,
            "top": 0,
            "width": 1920,
            "height": 1080,
            "image": "58_camwhore/fg.png"
        }
    ];
    $.each(btnList, function (i, v) {
        nav.button(v, 321);
    });
    if (g.pass === "pass322") {
        g.pass = null;
        nav.bg("321_whorechat/doggy0.jpg");
        if (sc.getMissionTask("janice", "dog-x", 5).notStarted) {
            sc.completeMissionTask("janice", "dog-x", 5);
        }
        chat(26, 321);
    }
    else if (sc.getSecret("janice").secretOut) {
        g.internal.maxviews = 20000;
        switch (sc.taskGetStep("janice", "femdom")) {
            case 2:
                g.internal.fame = 5;
                nav.bg("321_whorechat/w1_0.jpg");
                g.internal.maxviews = 20;
                sc.completeMissionTask("janice", "femdom", 2);
                sc.completeMissionTask("janice", "webcam", 4);
                chat(8, 321);
                break;
            case 3:
                g.internal.fame = 7;
                g.internal.excitement = 8;
                nav.bg("321_whorechat/w1_0.jpg"); 
                g.internal.maxviews = 500;
                sc.completeMissionTask("janice", "femdom", 3);
                chat(8, 321);
                break;
            case 4:
                if (inv.has("straponSmall")) {
                    sc.completeMissionTask("janice", "femdom", 4);
                    sc.completeMissionTask("janice", "webcam", 5);
                    cl.nude()
                    inv.use("straponSmall");
                    g.internal.fame = 7;
                    g.internal.excitement = 8;
                    nav.bg("321_whorechat/strappose.jpg");
                    zcl.bj(350, 900, .35, "", true);
                    nav.killbutton("fg");
                    nav.button({
                        "type": "img",
                        "name": "fb",
                        "left": 0,
                        "top": 0,
                        "width": 1920,
                        "height": 1080,
                        "image": "58_camwhore/fg.png"
                    }, 321);
                    g.internal.maxviews = 500;
                    
                    chat(15, 321);
                    daily.set("janiceWebcam");
                }
                else {
                    nav.kill();
                    nav.bg("316_livingroom/talk.jpg");
                    chat(16, 321);
                }
                break;
            case 5:
                nav.kill();
                nav.bg("316_livingroom/talk.jpg");
                chat(22, 321);
                break;
            default:
                cl.nude();
                if (sc.getMissionTask("janice", "webcam", 6).notStarted) {
                    sc.completeMissionTask("janice", "webcam", 6);
                    nav.bg("321_whorechat/strappose.jpg");
                    chat(23, 321);
                }
                else {
                    g.internal.button = "main";
                    invoker.invokeCurrent("btnclick", "buttons");
                    nav.bg("321_whorechat/wait_" + gender.pronoun("f") + ".jpg");
                }
                break;
        }
    }
    else if (sc.getMission("janice", "webcam").notStarted) {
        sc.startMission("janice", "webcam");
        sc.completeMissionTask("janice", "webcam", 0);
        nav.bg("321_whorechat/w1_0.jpg");
        chat(0, 321);
    }
    else {
        cl.nude();
        nav.bg("321_whorechat/wait_" + gender.pronoun("m") + ".jpg");
        g.internal.button = "main";
        invoker.invokeCurrent("btnclick", "buttons");
    }
    g.roomTimeout = setTimeout(function () { room321.gameloop(); }, 800);
};

room321.gameloop = function () {
    let fame = sc.taskGetStep("janice", "webcam");
    g.internal.ticks++;

    if (g.internal.ticks > 50) {
        g.internal.viewers += g.rand(-2, 2);
    }
    else {
        g.internal.viewers += g.rand(-1, g.internal.excitement + fame);
        if (g.internal.ticks < 6 && g.internal.ticks % 2 === 0) {
            room321.sidechat(null);
        }
        else if (g.internal.ticks % 2 === 0 && g.rand(0, 3) === 0) {
            room321.sidechat(null);
        }

        if (g.internal.viewers > 1 && g.internal.ticks % 3 === 0) {
            g.internal.money += Math.ceil((g.internal.viewers * (fame + g.internal.excitement + g.internal.currentpose)) / g.rand(50, 200));
        }
    }

    if (g.internal.viewers < 5)
        g.internal.viewers = g.rand(5, 15);

    if (g.internal.viewers > g.internal.maxviews)
        g.internal.maxviews = g.rand(g.internal.maxviews - 20, g.internal.maxviews + 20);

    if(g.internal.excitement > 40)
        g.internal.excitement = 40;

    nav.killbutton("viewers");
    nav.t({
        type: "zimg",
        name: "viewers",
        left: 580,
        top: 1000,
        font: 40,
        hex: "#ffffff",
        text: "Viewers: " + g.internal.viewers + ". Tips $" + g.internal.money
    }, 321);

    g.roomTimeout = setTimeout(function () { room321.gameloop(); }, 800);
};

room321.btnclick = function (name) {
    switch (name) {
        case "buttons":
            g.internal.ticks = 0;
            var butList = new Array();
            nav.killbuttonStartsWith("icon_");
            if (g.internal.button === "main")
                butList = [
                    { img: "button_show.png", txt: "icon_show" },
                    { img: "button_chat.png", txt: "icon_chat" },
                    { img: "button_wait.png", txt: "icon_wait" },
                    { img: "button_quit.png", txt: "icon_quit" },
                ];
            else if (g.internal.button === "chat") {
                butList = [
                    { img: "button_chat_tips.png", txt: "icon_chattips" },
                    { img: "button_chat_flirt.png", txt: "icon_chatflirt" },
                    { img: "button_chat_insult.png", txt: "icon_chatInsult" },
                    { img: "button_back.png", txt: "icon_main" },
                ];
            }
            else if (g.internal.button === "show") {
                if (sc.getMissionTask("janice", "webcam", 6).complete) {
                    butList = [
                        { img: "button_eatpussy.png", txt: "icon_eatpussy" },
                        { img: "button_show_strap.png", txt: "icon_suckdildo" },
                        { img: "button_fuck.png", txt: "icon_anal" },
                        { img: "button_back.png", txt: "icon_main" }
                    ];
                }
                else {
                    butList = [
                        { img: "button_eatpussy.png", txt: "icon_eatpussy" },
                        { img: "button_getsucked.png", txt: "icon_suckdick" },
                        { img: "button_fuck.png", txt: "icon_fuck" },
                        { img: "button_back.png", txt: "icon_main" }
                    ];
                }
            }
            else if (g.internal.button === "strap") {
                butList = [
                    { img: "button_strap.png", txt: "icon_strap" },
                    { img: "button_back.png", txt: "icon_mainRedraw" }
                ];
            }
            else if (g.internal.button === "getsucked1") {
                if (sc.getMissionTask("janice", "webcam", 6).complete) {
                    butList = [
                        { img: "button_getsucked1.png", txt: "icon_suckdildo" },
                        { img: "button_back.png", txt: "icon_mainRedraw" }
                    ];
                }
                else {
                    butList = [
                        { img: "button_getsucked1.png", txt: "icon_suckdick" },
                        { img: "button_back.png", txt: "icon_main" }
                    ];
                }
                
            }
            else if (g.internal.button === "suckdick2") {
                butList = [
                    { img: "button_show_cum.png", txt: "icon_suckdick2" }
                ];
            }
            else if (g.internal.button === "suckdick3") {
                butList = [
                    { img: "button_next.png", txt: "icon_suckdick3" }
                ];
            }
            else if (g.internal.button === "sissygasm") {
                butList = [
                    { img: "button_show_cum.png", txt: "icon_sissygasm" }
                ];
            }
            else if (g.internal.button === "fuckcum") {
                butList = [
                    { img: "button_show_cum.png", txt: "icon_fuckcum" }
                ];
            }
            else if (g.internal.button === "quit") {
                butList = [
                    { img: "button_quit.png", txt: "icon_quit" },
                ];
            }
            else if (g.internal.button === "femdom0") {
                butList = [
                    { img: "button_next.png", txt: "icon_femdom0" }
                ];
            }
            for (let i = 0; i < butList.length; i++) {
                nav.button({
                    "type": "btn",
                    "name": butList[i].txt,
                    "left": 580 + ((i % 4) * 320),
                    "top": 820 + (Math.floor(i / 4) * 86),
                    "width": 300,
                    "height": 72,
                    "image": "58_camwhore/" + butList[i].img
                }, 321);
            }
            break;
        case "icon_strap":
            g.internal.viewers += 20;
            gv.mod("arousal", 35);
            if (gv.get("arousal") > 95){
                g.internal.button = "sissygasm";
                invoker.invokeCurrent("btnclick", "buttons");
                return;
            }
            else {
                room321.sidechat("w1_0");
                g.internal.excitement += 50;
            }
            break;
        case "icon_sissygasm":
            sc.modLevel("janice", 20, 10);
            levels.anal(2, true, "f", false, "janice");
            zcl.amazon(150, 700, .7, "", false);
            nav.killbutton("fb");
            nav.button({
                "type": "img",
                "name": "fb",
                "left": 0,
                "top": 0,
                "width": 1920,
                "height": 1080,
                "image": "321_whorechat/strapfuck2.png"
            }, 321);
            g.internal.button = "quit";
            invoker.invokeCurrent("btnclick", "buttons");
            break;
        case "icon_mainRedraw":
            zcl.kill();
            nav.killbutton("fb");
            nav.button({
                "type": "img",
                "name": "fb",
                "left": 0,
                "top": 0,
                "width": 1920,
                "height": 1080,
                "image": "58_camwhore/fg.png"
            }, 321);
            nav.bg("321_whorechat/wait_" + gender.pronoun("m") + ".jpg");
            g.internal.button = "main";
            invoker.invokeCurrent("btnclick", "buttons");
            break;
        case "icon_main":
            g.internal.button = "main";
            invoker.invokeCurrent("btnclick", "buttons");
            break;
        case "icon_chat":
            g.internal.button = "chat";
            invoker.invokeCurrent("btnclick", "buttons");
            return;
        case "icon_show":
            g.internal.button = "show";
            invoker.invokeCurrent("btnclick", "buttons");
            break;
        case "icon_chattips":
            g.internal.button = "main";
            invoker.invokeCurrent("btnclick", "buttons");
            nav.bg("321_whorechat/wait_" + gender.pronoun("m") + ".jpg");
            g.internal.money += 2;
            room321.sidechat("tips");
            break;
        case "icon_chatflirt":
            g.internal.button = "main";
            invoker.invokeCurrent("btnclick", "buttons");
            nav.bg("321_whorechat/wait_" + gender.pronoun("m") + ".jpg");
            g.internal.money += 4;
            room321.sidechat("flirt");
            break;
        case "icon_chatInsult":
            g.internal.button = "main";
            invoker.invokeCurrent("btnclick", "buttons");
            nav.bg("321_whorechat/wait_" + gender.pronoun("m") + ".jpg");
            g.internal.money += 4;
            room321.sidechat("insult");
            break;
        case "icon_wait":
            g.internal.button = "main";
            invoker.invokeCurrent("btnclick", "buttons");
            nav.bg("321_whorechat/wait_" + gender.pronoun("f") + ".jpg");
            room321.sidechat(null);
            break;
        case "icon_suckdildo":
            if (!daily.get("icon_suckdildo_321")) {
                daily.set("icon_suckdildo_321");
                levels.oral(3, "f", "janice");
            }
            g.internal.excitement++;
            gv.mod("arousal", 10);
            nav.bg("321_whorechat/bg.jpg");
            zcl.bj(150, 600, .7, "open", true);
            nav.killbutton("fb");
            nav.button({
                "type": "img",
                "name": "fb",
                "left": 0,
                "top": 0,
                "width": 1920,
                "height": 1080,
                "image": "321_whorechat/strapsuck.png"
            }, 321);
            g.internal.button = "getsucked1";
            invoker.invokeCurrent("btnclick", "buttons");
            break;
        case "icon_suckdick":
            g.internal.excitement++;
            nav.bg("321_whorechat/bj0.jpg");
            gv.mod("arousal", 25);
            if (gv.get("arousal") < 90)
                g.internal.button = "getsucked1";
            else
                g.internal.button = "suckdick2";
            invoker.invokeCurrent("btnclick", "buttons");
            break;
        case "icon_suckdick2":
            g.internal.excitement++;
            nav.bg("321_whorechat/bj1.jpg");
            g.internal.button = "suckdick3";
            invoker.invokeCurrent("btnclick", "buttons");
            break;
        case "icon_suckdick3":
            g.internal.excitement++;
            sc.completeMissionTask("janice", "webcam", 2);
            nav.bg("321_whorechat/bj2.jpg");
            levels.gotbj("f", "janice");
            room321.sidechat("suckeddick");
            g.internal.button = "quit";
            invoker.invokeCurrent("btnclick", "buttons");
            break;
        case "icon_anal":
            nav.bg("321_whorechat/anal1.jpg");
            chat(25, 321);
            break;
        case "icon_fuck":
            if (sc.getMissionTask("janice", "webcam", 3).notStarted) {
                g.internal.excitement += 4;
                sc.completeMissionTask("janice", "webcam", 3);
                chat(3, 321);
            }
            else {
                g.internal.excitement += 2;
                nav.bg("321_whorechat/bg.jpg");
                nav.killbutton("fb");
                nav.button({
                    "type": "img",
                    "name": "fuck",
                    "left": 545,
                    "top": 28,
                    "width": 1356,
                    "height": 763,
                    "image": "321_whorechat/bitch_1_0.gif" 
                }, 321);
                nav.button({
                    "type": "img",
                    "name": "fb",
                    "left": 0,
                    "top": 0,
                    "width": 1920,
                    "height": 1080,
                    "image": "58_camwhore/fg.png"
                }, 321);
                room321.sidechat(null);
                g.internal.button = "fuckcum";
                invoker.invokeCurrent("btnclick", "buttons");
            }
            break;
        case "icon_fuckcum":
            nav.killbutton("fuck");
            levels.fuckpussy("janice");
            nav.bg("321_whorechat/fuckcum.jpg");
            sc.modLevel("janice", 50);
            g.internal.button = "quit";
            invoker.invokeCurrent("btnclick", "buttons");
            break;
        case "icon_eatpussy":
            gv.mod("arousal", 15);
            sc.completeMissionTask("janice", "webcam", 1);
            nav.bg("321_whorechat/eatpussy_" + gender.pronoun("f") + ".jpg");
            if (!daily.get("janiceEatPussy")) {
                levels.oral(3, "f", "janice");
                daily.set("janiceEatPussy");
            }
            if (g.internal.excitement < 30)
                g.internal.excitement += 2;
            g.internal.button = "main";
            invoker.invokeCurrent("btnclick", "buttons");
            break;
        case "icon_quit":
            cl.undo();
            sc.modLevel("janice", g.internal.money, 10);
            clearTimeout(g.roomTimeout);
            char.addtime(90);
            char.room(316);
            break;
        case "icon_femdom0":
            nav.killbutton("icon_femdom0");
            nav.bg("321_whorechat/look.jpg");
            chat(10, 321);
            break;
        default:
            break;
    }
};

room321.chatcatch = function (callback) {
    switch (callback) {
        case "w1_0":
            room321.sidechat("w1_0");
            if (gender.pronoun("f") === "f") {
                sc.modSecret("janice", 100);
                chat(5, 321);
            }
            else {
                nav.bg("321_whorechat/clothes.jpg");
                chat(1, 321);
            }
            break;
        case "w1_1":
            nav.bg("321_whorechat/titties.jpg");
            room321.sidechat("tits");
            break;
        case "straightLoop":
            if (cl.c.chastity === null) {
                cl.nude();
                nav.bg("321_whorechat/wait_" + gender.pronoun("m") + ".jpg");
                g.internal.button = "main";
                invoker.invokeCurrent("btnclick", "buttons");
            }
            else {
                nav.bg("321_whorechat/chastity.jpg");
                sc.modSecret("janice", 100);
                chat(7, 321);
            }
            break;
        case "fuck":
            invoker.invokeCurrent("btnclick", "icon_fuck");
            break;
        case "femdom_makeup":
            nav.bg("321_whorechat/femdom_makeup.jpg");
            nav.killbutton("fb");
            zcl.displayMain(-50, 300, .45, "mirror", false);
            nav.button({
                "type": "img",
                "name": "fb",
                "left": 0,
                "top": 0,
                "width": 1920,
                "height": 1080,
                "image": "58_camwhore/fg.png"
            }, 321);
            break;
        case "femdom_eatpussy":
            zcl.kill();
            nav.bg("321_whorechat/eatpussy_" + gender.pronoun("f") + ".jpg");
            g.internal.button = "femdom0";
            invoker.invokeCurrent("btnclick", "buttons");
            break;
        case "femdom_message0":
            room321.sidechat("femdom_message0");
            break;
        case "femdom_message1":
            nav.bg("321_whorechat/chastity.jpg");
            room321.sidechat("femdom_message1");
            break;
        case "femdom_message2":
            room321.sidechat("femdom_message2");
            break;
        case "room0a":
            cl.undo();
            nav.killall();
            nav.bg("316_livingroom/talk.jpg");
            daily.set("janice");
            break;
        case "room0":
            sc.modLevel("janice", 25, 10);
            char.addtime(60);
            clearTimeout(g.roomTimeout);
            char.room(0);
            break;
        case "randchat":
            room321.sidechat(null);
            room321.sidechat(null);
            room321.sidechat(null);
            break;
        case "suck":
            nav.bg("321_whorechat/bg.jpg");
            zcl.bj(150, 600, .7, "open", true);
            nav.killbutton("fb");
            nav.button({
                "type": "img",
                "name": "fb",
                "left": 0,
                "top": 0,
                "width": 1920,
                "height": 1080,
                "image": "321_whorechat/strapsuck.png"
            }, 321);
            break;
        case "straponfuck":
            nav.bg("321_whorechat/strapfuckBg.jpg");
            zcl.amazon(150, 700, .7, "", false);
            nav.killbutton("fb");
            nav.button({
                "type": "img",
                "name": "fb",
                "left": 0,
                "top": 0,
                "width": 1920,
                "height": 1080,
                "image": "321_whorechat/strapfuck.png"
            }, 321);
            break;
        case "straponfuck1":
            nav.bg("321_whorechat/strapfuckBg.jpg");
            zcl.amazon(150, 700, .7, "", false);
            nav.killbutton("fb");
            nav.button({
                "type": "img",
                "name": "fb",
                "left": 0,
                "top": 0,
                "width": 1920,
                "height": 1080,
                "image": "321_whorechat/strapfuck1.png"
            }, 321);
            g.internal.button = "strap";
            invoker.invokeCurrent("btnclick", "buttons");
            break;
        case "leave":
            invoker.invokeCurrent("btnclick", "icon_quit");
            break;
        case "room316":
            clearTimeout(g.roomTimeout);
            char.addtime(60);
            char.room(316);
            break;
        case "begin":
            invoker.invokeCurrent("btnclick", "buttons");
            break;
        case "doggy1":
        case "doggy2":
            room321.sidechat(callback);
            g.internal.viewers += g.rand(40, 90);
            nav.bg("321_whorechat/" + callback + ".jpg");
            break;
        case "doggy3":
        case "doggy4":
        case "doggy5":
        case "doggy6":
        case "doggy7":
        case "doggy8":
        case "doggy9":
        case "doggy10":
            nav.bg("321_whorechat/" + callback + ".jpg");
            room321.sidechat("");
            room321.sidechat("doggyloop");
            g.internal.excitement += 20;
            break;
        case "doggyEnd":
            char.addtime(120);
            sc.modLevel("janice", 4, 10);
            clearTimeout(g.roomTimeout);
            levels.swallowCum("m", "dog");
            char.settime(19, 30);
            char.room(322);
            break;
        default:
            break;
    }
};

room321.chat = function (chatID) {
    var cArray = [
        {
            chatID: 0,
            speaker: "janice",
            l10nKey: "room.321.chat.0.text",
            text: "Hey everyone! I've brought my friend with me on my stream! So excited! " +
                "Let's meet him!",
            button: [
                { chatID: -1, l10nKey: "room.321.chat.0.choice.0", text: "...", callback: "w1_0" }
            ]
        },
        {
            chatID: 1,
            speaker: "janice",
            l10nKey: "room.321.chat.1.text",
            l10nValues: { me: sc.n("me") },
            text: "I know what you boys want! Free titties! {me}, take my bra off! Show the men my titties!",
            button: [
                { chatID: 2, l10nKey: "room.321.chat.1.choice.0", text: "...", callback: "w1_1" }
            ]
        },
        {
            chatID: 2,
            speaker: "janice",
            l10nKey: "room.321.chat.2.text",
            text: "I knew you boys would like that. Now let's strip down and put on a show! ",
            button: [
                { chatID: -1, l10nKey: "room.321.chat.2.choice.0", text: "...", callback: "straightLoop" }
            ]
        },
        {
            chatID: 3,
            speaker: "janice",
            l10nKey: "room.321.chat.3.text",
            text: "Ready to see me fuck my friend for the first... er I mean lose my " +
                "virginity live on camera??",
            button: [
                { chatID: 4, l10nKey: "room.321.chat.3.choice.0", text: "Oh yeah!", callback: "" }
            ]
        },
        {
            chatID: 4,
            speaker: "janice",
            l10nKey: "room.321.chat.4.text",
            text: "Keep those tips coming! I'm going to get fucked! ",
            button: [
                { chatID: -1, l10nKey: "room.321.chat.4.choice.0", text: "...", callback: "fuck" }
            ]
        },
        {
            chatID: 5,
            speaker: "janice",
            l10nKey: "room.321.chat.5.text",
            text: "Huh? Looks like the men in the chat think you're a girl. ",
            button: [
                { chatID: 6, l10nKey: "room.321.chat.5.choice.0", text: "Well....", callback: "" }
            ]
        },
        {
            chatID: 6,
            speaker: "janice",
            l10nKey: "room.321.chat.6.text",
            text: "*ugh* He's not a girl! Never mind, I'm too flustered. We'll try again " +
                "later. I'm just going to end this show.",
            button: [
                { chatID: 6, l10nKey: "room.321.chat.6.choice.0", text: "Oh....", callback: "leave" }
            ]
        },
        {
            chatID: 7,
            speaker: "janice",
            l10nKey: "room.321.chat.7.text",
            text: "Is that a chastity cage? Why would you wear a chastity cage to my " +
                "web show! I need a real man to fuck me so I can make some money and " +
                "you show up like a little girl with that thing on! Damn it! My show " +
                "is ruined. Just ruined! Let me turn this off!",
            button: [
                { chatID: -1, l10nKey: "room.321.chat.7.choice.0", text: "I'm so sorry...", callback: "leave" }
            ]
        },
        {
            chatID: 8,
            speaker: "janice",
            l10nKey: "room.321.chat.8.text",
            text: "Hello all my sexy fans! I brought a femboy to play with! I know how " +
                "much you guys love a sexy girl like me playing with a femboy! Take a " +
                "look at my femboy's makeup. I did it myself! Show the horny men your " +
                "makeup femboy! ",
            button: [
                { chatID: 9, l10nKey: "room.321.chat.8.choice.0", text: "[Show the horny men your face]", callback: "femdom_makeup" }
            ]
        },
        {
            chatID: 9,
            speaker: "janice",
            l10nKey: "room.321.chat.9.text",
            text: "Isn't he a sexy boy! My sexy little femboy! Do you want to watch " +
                "my femboy eat my pussy? I know you do! ",
            button: [
                { chatID: -1, l10nKey: "room.321.chat.9.choice.0", text: "[Eat her pussy]", callback: "femdom_eatpussy" }
            ]
        },
        {
            chatID: 10,
            speaker: "janice",
            l10nKey: "room.321.chat.10.text",
            text: "Huh. That didn't make a lot of views. What do you guys want? ",
            button: [
                { chatID: 11, l10nKey: "room.321.chat.10.choice.0", text: "...", callback: "femdom_message0" }
            ]
        },
        {
            chatID: 11,
            speaker: "janice",
            l10nKey: "room.321.chat.11.text",
            text: "Twekle98 says to Show the femboy's ass? ... huh. Femboy come here and " +
                "show them your butt. ",
            button: [
                { chatID: 12, l10nKey: "room.321.chat.11.choice.0", text: "...", callback: "femdom_message1" }
            ]
        },
        {
            chatID: 12,
            speaker: "janice",
            l10nKey: "room.321.chat.12.text",
            text: "You want me to fuck his ass Jim? I have a vagina. How am I supposed " +
                "to fuck his ass? I don't think you guys know how a girl works.",
            button: [
                { chatID: 13, l10nKey: "room.321.chat.12.choice.0", text: "...", callback: "femdom_message2" }
            ]
        },
        {
            chatID: 13,
            speaker: "janice",
            l10nKey: "room.321.chat.13.text",
            text: "A strap-on? Huh? I guess I could do that, but I don't have " +
                "one of those. Hmmmmm.... I guess I need one of those. We'll be back " +
                "later. Make sure to keep supporting me!",
            button: [
                { chatID: 14, l10nKey: "room.321.chat.13.choice.0", text: "...", callback: "room0a" }
            ]
        },
        {
            chatID: 14,
            speaker: "janice",
            l10nKey: "room.321.chat.14.text",
            text: "Hey baby. Could you run down to the store for me and get a strap-on? " +
                "That show was a bust and I need my money to eat this week. Plus you know " +
                "what guys want better than me. Get something cute though. I don't want " +
                "some big ugly thing or some weird shape. ",
            button: [
                { chatID: -1, l10nKey: "room.321.chat.14.choice.0", text: "Yeah sure.", callback: "room0" }
            ]
        },
        {
            chatID: 15,
            speaker: "janice",
            l10nKey: "room.321.chat.15.text",
            text: "Hey guys! I'm back with my little femboy and a cute little strap on! " +
                "What should I have my little femboy do?",
            button: [
                { chatID: 17, l10nKey: "room.321.chat.15.choice.0", text: "...", callback: "randchat" }
            ]
        },
        {
            chatID: 16,
            speaker: "janice",
            l10nKey: "room.321.chat.16.text",
            text: "We need a strap-on to play first!",
            button: [
                { chatID: -1, l10nKey: "room.321.chat.16.choice.0", text: "...", callback: "room316" }
            ]
        },
        {
            chatID: 17,
            speaker: "janice",
            l10nKey: "room.321.chat.17.text",
            text: "I know! Let's have my femboy suck my strap-on! I've always wanted to " +
                "see what it's like to get a blow job!",
            button: [
                { chatID: 18, l10nKey: "room.321.chat.17.choice.0", text: "[Suck her strap-on]", callback: "suck" }
            ]
        },
        {
            chatID: 18,
            speaker: "janice",
            l10nKey: "room.321.chat.18.text",
            text: "Hahaha! My little femboy loves sucking on my dick! Suck it femboy! ",
            button: [
                { chatID: 19, l10nKey: "room.321.chat.18.choice.0", text: "[Keep sucking]", callback: "suck" }
            ]
        },
        {
            chatID: 19,
            speaker: "janice",
            l10nKey: "room.321.chat.19.text",
            text: "So group, what should we do next? Should I take my femboy's virginity " +
                "live on camera? I think my little femboy needs to get fucked! ",
            button: [
                { chatID: 20, l10nKey: "room.321.chat.19.choice.0", text: "[Keep sucking]", callback: "straponfuck" }
            ]
        },
        {
            chatID: 20,
            speaker: "janice",
            l10nKey: "room.321.chat.20.text",
            text: "Oh... This is different... I hope you all like this. Be sure to donate. ",
            button: [
                { chatID: 21, l10nKey: "room.321.chat.20.choice.0", text: "*moan*", callback: "" }
            ]
        },
        {
            chatID: 21,
            speaker: "janice",
            l10nKey: "room.321.chat.21.text",
            text: "Oh. I guess we've had sex now. Ummm. I guess the stream is over. Come " +
                "back later. Ok.",
            button: [
                { chatID: -1, l10nKey: "room.321.chat.21.choice.0", text: "*moan*", callback: "leave" }
            ]
        },
        {
            chatID: 22,
            speaker: "janice",
            l10nKey: "room.321.chat.22.text",
            text: "We need to talk first. ",
            button: [
                { chatID: -1, l10nKey: "room.321.chat.22.choice.0", text: "oh. ok", callback: "room316" }
            ]
        },
        {
            chatID: 23,
            speaker: "janice",
            l10nKey: "room.321.chat.23.text",
            text: "Ok everyone I would like to re-introduce my pussy free femboy! After our " +
                "last show I realized what a complete loser he is and almost ended things with him! " +
                "But he said I could fuck other guys if I would just stay with him. So here we are, " +
                "the sexy girl with a big ass and her pussy free femboy!",
            button: [
                { chatID: 24, l10nKey: "room.321.chat.23.choice.0", text: "Hey!", callback: "" }
            ]
        },
        {
            chatID: 24,
            speaker: "janice",
            l10nKey: "room.321.chat.24.text",
            text: "Aww is the pussy free femboy mad? Chat, should we shut his loser " +
                "face with a dick in the mouth, or in the ass? Hahaha!",
            button: [
                { chatID: -1, l10nKey: "room.321.chat.24.choice.0", text: "Hey!", callback: "begin" }
            ]
        },
        {
            chatID: 25,
            speaker: "janice",
            l10nKey: "room.321.chat.25.text",
            text: "I'm going to shove my cute little dildo in my pussy free femboy. " +
                "This is so hot. I wish I had a real man right now to put his alpha " +
                "dick in my sopping wet pussy, but I guess fucking my femboy will have to do. ",
            button: [
                { chatID: -1, l10nKey: "room.321.chat.25.choice.0", text: "Mmmm please put it in me", callback: "straponfuck1" }
            ]
        },
        {
            chatID: 26,
            speaker: "janice",
            l10nKey: "room.321.chat.26.text",
            text: "Hello all you perverts! Welcome back to my show! So what should we start with?",
            button: [
                { chatID: 27, l10nKey: "room.321.chat.26.choice.0", text: "....", callback: "doggy1" }
            ]
        },
        {
            chatID: 27,
            speaker: "janice",
            l10nKey: "room.321.chat.27.text",
            text: "Yeah Jim, it's peanut butter time! ",
            button: [
                { chatID: 28, l10nKey: "room.321.chat.27.choice.0", text: "....", callback: "doggy2" }
            ]
        },
        {
            chatID: 28,
            speaker: "janice",
            l10nKey: "room.321.chat.28.text",
            l10nValues: { dog: sc.n("dog") },
            text: "Come here {dog}. Time for your treat!",
            button: [
                { chatID: 29, l10nKey: "room.321.chat.28.choice.0", text: "....", callback: "doggy3" }
            ]
        },
        {
            chatID: 29,
            speaker: "janice",
            l10nKey: "room.321.chat.29.text",
            text: "Oh yeah, just like that! Best tongue there is!",
            button: [
                { chatID: 30, l10nKey: "room.321.chat.29.choice.0", text: "....", callback: "doggy4" }
            ]
        },
        {
            chatID: 30,
            speaker: "janice",
            l10nKey: "room.321.chat.30.text",
            text: "Fuck! Right there! Yeah yeah yeah. Let me get on my knees so you can really lick my clit!",
            button: [
                { chatID: 31, l10nKey: "room.321.chat.30.choice.0", text: "....", callback: "doggy5" }
            ]
        },
        {
            chatID: 31,
            speaker: "janice",
            l10nKey: "room.321.chat.31.text",
            text: "Good doggy! Just keep licking like that! ",
            button: [
                { chatID: 32, l10nKey: "room.321.chat.31.choice.0", text: "....", callback: "doggy6" }
            ]
        },
        {
            chatID: 32,
            speaker: "janice",
            l10nKey: "room.321.chat.32.text",
            text: "Ooof... Not like that. Oh maybe... Should we? It does feel good...",
            button: [
                { chatID: 33, l10nKey: "room.321.chat.32.choice.0", text: "....", callback: "doggy7" }
            ]
        },
        {
            chatID: 33,
            speaker: "janice",
            l10nKey: "room.321.chat.33.text",
            text: "Owie owie owie! Gentle! That knot is so god damned big!!!! fffffff",
            button: [
                { chatID: 34, l10nKey: "room.321.chat.33.choice.0", text: "....", callback: "doggy8" }
            ]
        },
        {
            chatID: 34,
            speaker: "janice",
            l10nKey: "room.321.chat.34.text",
            text: "*huf* *huf* *huf* Please just finish.. please hurry it's stretching me out...",
            button: [
                { chatID: 35, l10nKey: "room.321.chat.34.choice.0", text: "....", callback: "doggy9" }
            ]
        },
        {
            chatID: 35,
            speaker: "janice",
            l10nKey: "room.321.chat.35.text",
            text: "I can feel the doggy cum filling my womb! I wonder if I'm going to have a litter of " +
                "puppies.... hmmm.... oh. It's leaking.. Quick! Bitch! Get over here!",
            button: [
                { chatID: 36, l10nKey: "room.321.chat.35.choice.0", text: "....", callback: "doggy10" }
            ]
        },
        {
            chatID: 36,
            speaker: "janice",
            l10nKey: "room.321.chat.36.text",
            text: "There's so much puppy batter! I don't think I've ever had a bigger load in me. " +
                "Drink it all up so I don't get it on the rug. That's my good girl.",
            button: [
                { chatID: -1, l10nKey: "room.321.chat.36.choice.0", text: "*slurp* *suck* *gulp*", callback: "doggyEnd" }
            ]
        },
    ];
    if (cArray.length > chatID && chatID > -1)
        return cArray[chatID];
    else
        return [];
};

room321.sidechat = function (metalk) {
    function pushSidechat(key, user, txt, hex) {
        g.internal.chat.push({ user: user, txt: l10n.t("room.321.sidechat." + key, txt), hex: hex });
    }

    if (metalk !== null) {
        switch (metalk) {
            case "w1_0":
                if (gender.pronoun("f") === "f") {
                    pushSidechat("w1_0.female.0", "shakey998", "Sweet! Love two chick shows!", "#0a457d");
                    pushSidechat("w1_0.female.1", "XXKillstreakXX", "I would fuck you both!", "#05193b");
                    pushSidechat("w1_0.female.2", "BigDick420", "Hot I'm rubbing my cock", "#a12336");
                    pushSidechat("w1_0.female.3", "AssLicker", "Dykes are hot!", "#a33329");
                }
                else {
                    pushSidechat("w1_0.male.0", "shakey998", "Lucky man!", "#0a457d");
                    pushSidechat("w1_0.male.1", "XXKillstreakXX", "Fuck yeah! fuck that slut", "#05193b");
                    pushSidechat("w1_0.male.2", "BigDick420", "Hot I'm rubbin' my cock", "#a12336");
                    pushSidechat("w1_0.male.3", "AssLicker", "Drop the dude! Play with your pussy!", "#a33329");
                }
                break;
            case "tits":
                pushSidechat("tits.0", "Mr. T", "ARF GRRR RUFF! Love those tits baby", "#0a457d");
                pushSidechat("tits.1", "Firak", "Beautiful fuckin' tits!", "#05193b");
                pushSidechat("tits.2", "Tit lover", "That's what I came for!", "#095440");
                break;
            case "tips":
                pushSidechat("tips.0", "Janice", "Hey boys! Show me love in those tips!", "#4b1559");
                pushSidechat("tips.1", "Firak", "For you anything!", "#05193b");
                break;
            case "flirt":
                pushSidechat("flirt.0", "Janice", "❤️ you all. Need all your dicks!", "#4b1559");
                pushSidechat("flirt.1", "Firak", "Drop that loser! We'll double stuff you", "#05193b");
                pushSidechat("flirt.2", "BigDick420", "I need to be balls deep in that pussy", "#a12336");
                break;
            case "insult":
                pushSidechat("insult.0", "Janice", "I need a real man to fuck me!", "#4b1559");
                pushSidechat("insult.1", "Firak", "I'm so hard for you bby", "#05193b");
                pushSidechat("insult.2", "BigDick420", "🥵 ❤️❤️❤️ I'm in love!", "#a12336");
                break;
            case "suckeddick":
                pushSidechat("suckeddick.0", "Janice", "Aren't I great cock sucker!", "#4b1559");
                pushSidechat("suckeddick.1", "Janice", "I would suck each of you if you were here", "#4b1559");
                pushSidechat("suckeddick.2", "Janice", "MMmm. I need a manly dick!", "#4b1559");
                pushSidechat("suckeddick.3", "TitsMcGee", "I want to cum down your throat", "#e39e1e");
                pushSidechat("suckeddick.4", "CallMeDaddy", "Daddy want's to fuck your face bby girl", "#910d12");
                break;
            case "femdom_message0":
                pushSidechat("femdom_message0.0", "Twekle98", "Show the femboy's ass!", "#34e5eb");
                pushSidechat("femdom_message0.1", "Jim", "Bend your femboy over and fuck him!", "#0d915a");
                pushSidechat("femdom_message0.2", "Daddy", "I love a sexy femboy butt bby. Let's see it!", "#13914a");
                pushSidechat("femdom_message0.3", "Fufu Faroo", "Show us his butt", "#474c61");
                pushSidechat("femdom_message0.4", "BigD", "I want to see his ass too!", "#475a61");
                pushSidechat("femdom_message0.5", "Al", "BUTT BUTT BUTT BUTT", "#1d6640");

                break;
            case "femdom_message1":
                pushSidechat("femdom_message1.0", "shakey998", "MMmmm sexy femboy.", "#0a457d");
                pushSidechat("femdom_message1.1", "Jim", "I said bend your femboy over and fuck his ass!", "#0d915a");
                pushSidechat("femdom_message1.2", "Jim", "Bend your femboy over and fuck him!", "#1d6640");
                pushSidechat("femdom_message1.3", "Jim", "Oh yeah. I want to see you fuck him too", "#283b31");
                pushSidechat("femdom_message1.4", "Jim", "Make him your bitch!", "#0d915a");
                break;
            case "femdom_message2":
                pushSidechat("femdom_message2.0", "HighTower894", "Get a strap-on bby girl", "#1a1701");
                pushSidechat("femdom_message2.1", "Jim", "Fuck him with a strapon!", "#0d915a");
                pushSidechat("femdom_message2.2", "XXyoungbloodXX", "STRAPON!!!!!", "#475b73");
                pushSidechat("femdom_message2.3", "GreyHairs", "Fist that ass!", "#4a5e5d");
                pushSidechat("femdom_message2.4", "Romeo", "🍆🍑 get a strapon girl", "#1aba45");
                pushSidechat("femdom_message2.5", "Jim", "STRAP ATTACK!!!!", "#0d915a");
                pushSidechat("femdom_message2.6", "Jim", "Strap-ons are so sexy!", "#0d915a");
                break;
            case "doggy1":
                pushSidechat("doggy1.0", "HighTower894", "Who's the gimp???", "#1a1701");
                pushSidechat("doggy1.1", "Jim", "Peanut butter time!", "#0d915a");
                break;
            case "doggy2":
                pushSidechat("doggy2.0", "XXyoungbloodXX", "I want to lick that peanutbutter girl", "#475b73");
                pushSidechat("doggy2.1", "Daddy", "Love a doggy slut!", "#13914a");
                break;
            case "doggyloop":
                var carray = [
                    { key: "doggyloop.0", user: "Firak", txt: "Oh yeah! Fuck that puppy breeding hole!", hex: "#05193b" },
                    { key: "doggyloop.1", user: "XXyoungbloodXX", txt: "Love a girl that knows she's a bitch", hex: "#475b73" },
                    { key: "doggyloop.2", user: "Daddy", txt: "Love a doggy slut!", hex: "#13914a" },
                    { key: "doggyloop.3", user: "GreyHairs", txt: "Oooo fill that pussy with puppies", hex: "#4a5e5d" },
                    { key: "doggyloop.4", user: "Jim", txt: "Knotty slut", hex: "#0d915a" },
                    { key: "doggyloop.5", user: "BigD", txt: "I want next!", hex: "#475a61" },
                    { key: "doggyloop.6", user: "Mr. T", txt: "ARF GRRR RUFF! Breed that hole", hex: "#0a457d" },
                    { key: "doggyloop.7", user: "BigDick420", txt: "Hot I'm strokin' my cock", hex: "#a12336" },
                    { key: "doggyloop.8", user: "AssLicker", txt: "Love a breeding bitch", hex: "#a33329" },
                    { key: "doggyloop.9", user: "HighTower894", txt: "Momma! I need you", hex: "#1a1701" }
                ];
                var doggyMessage = carray[g.rand(0, carray.length)];
                pushSidechat(doggyMessage.key, doggyMessage.user, doggyMessage.txt, doggyMessage.hex);
                break;
        }
    }
    else {
        let sidechat = [
            { user: "shakey998", txt: "Hey beautiful", hex: "#0a457d" },
            { user: "XXKillstreakXX", txt: "Hi pretty girl", hex: "#05193b" },
            { user: "XXKillstreakXX", txt: "You're all losers!", hex: "#05193b" },
            { user: "tylie", txt: "Who's a naughty girl!", hex: "#6c2287" },
            { user: "Jim", txt: "So hot damn I love stroking it <3", hex: "#0d915a" },
            { user: "Daddy", txt: "You're both so hot", hex: "#13914a" },
            { user: "Jesus", txt: "hola niña bonita", hex: "#6476ed" },
            { user: "Daddy6969", txt: "Show me your pussy!", hex: "#e33419" },
            { user: "Hornydad69", txt: "Love those nipples", hex: "#d9d21a" },
            { user: "XXxGamerBxXX", txt: "Play with your cunt bitch", hex: "#5448a1" },
            { user: "sharky-59564", txt: "Dance for us slut!", hex: "#302e3b" },
            { user: "LilFucker4206969", txt: "Fuck that slut.", hex: "#ff3300" },
            { user: "Twekle98", txt: "Shake that ass! Shake for daddy", hex: "#34e5eb" },
            { user: "TitsMcGee", txt: "Spread your legs. Show Daddy that pussy", hex: "#e39e1e" },
            { user: "Roxy420", txt: "Daddy like", hex: "#8a8346" },
            { user: "DirtyDaddy69", txt: "You two just need to fuck", hex: "#22633e" },
            { user: "HighTower894", txt: "You look like this ho I know", hex: "#1a1701" },
            { user: "BigDick420", txt: "Hot I'm jackin' my cock", hex: "#a12336" },
            { user: "Grandpa", txt: "You like older men? I like you :)", hex: "#4a515e" },
            { user: "Grandpa", txt: "I want to put you over my lap bby girl", hex: "#4a515e" },
            { user: "Pisslover", txt: "Piss all over him. I want to see a river", hex: "#d3d622" },
            { user: "AssLicker", txt: "Spread your butthole! Show me that starfish", hex: "#a33329" },
            { user: "Sissy69", txt: "I love your look", hex: "#df70e0" },
            { user: "Sissy69", txt: "Play with his cock bby", hex: "#df70e0" },
            { user: "CallMeDaddy", txt: "I'm going to suck that clitty", hex: "#910d12" },
            { user: "CallMeDaddy", txt: "I want to fuck you so bad lil girl", hex: "#910d12" },
            { user: "CallMeDaddy", txt: "Put on a show for daddy", hex: "#910d12" },
            { user: "GreyHairs", txt: "Fuck the slut", hex: "#4a5e5d" },
            { user: "XXyoungbloodXX", txt: "I think I'm in love", hex: "#475b73" },
            { user: "XXyoungbloodXX", txt: "You dirty fucking whore", hex: "#475b73" },
            { user: "XXyoungbloodXX", txt: "I want to drink your pussy juice", hex: "#475b73" },
            { user: "AssLicker", txt: "MMmmmm so lickable", hex: "#a33329" },
            { user: "Grandpa", txt: "🍆🍑💦 I want you both!", hex: "#4a515e" },
            { user: "Grandpa", txt: "🥵 ❤️❤️❤️ I'm in love!", hex: "#4a515e" },
            { user: "Grandpa", txt: "🍌 Suck his cock", hex: "#4a515e" },
            { user: "BigDick420", txt: "💕 I'm going to wife you", hex: "#a12336" },
            { user: "sharky-59564", txt: "🥪 Get back to the kitchen! hehe", hex: "#302e3b" },
            { user: "Twekle98", txt: "I so want to nut in that butt!", hex: "#34e5eb" },
            { user: "Jim", txt: "I'm cumming! Fuck you're hot!", hex: "#0d915a" },
            { user: "Daddy", txt: "Show daddy your cum hole bby girl", hex: "#13914a" },
            { user: "LilFucker4206969", txt: "I'm going to fist rape you", hex: "#ff3300" },
            { user: "LilFucker4206969", txt: "I'm going to make you my rape slave", hex: "#ff3300" },
            { user: "XXyoungbloodXX", txt: "Marry me baby", hex: "#475b73" },
            { user: "CallMeDaddy", txt: "Perfect ass for spanking.", hex: "#910d12" },
            { user: "Romeo", txt: "My heart has found its match", hex: "#1aba45" },
            { user: "Romeo", txt: "Marry me, please!!!!", hex: "#1aba45" },
            { user: "Romeo", txt: "❤️🧡💛💚💙💜", hex: "#1aba45" },
            { user: "Romeo", txt: "🥰🔥🔥🥰 My passion is you", hex: "#1aba45" },
        ];
        for (let i = 0; i < g.rand(1, 3); i++) {
            var sidechatMessage = sidechat[g.rand(0, sidechat.length)];
            pushSidechat("base." + sidechat.indexOf(sidechatMessage), sidechatMessage.user, sidechatMessage.txt, sidechatMessage.hex);
        }
    }

    if (g.internal.chat.length > 12)
        g.internal.chat.splice(0, g.internal.chat.length - 12);
    nav.killbutton("sidechat");
    for (let i = 0; i < g.internal.chat.length; i++) {
        nav.t({
            type: "zimg",
            name: "sidechat",
            left: 80,
            top: 100 + (i * 70),
            font: 24,
            hex: g.internal.chat[i].hex,
            text: g.internal.chat[i].user
        }, 321);
        nav.t({
            type: "zimg",
            name: "sidechat",
            left: 80,
            top: 134 + (i * 70),
            font: 20,
            hex: "#000000",
            text: g.internal.chat[i].txt
        }, 321);
    }
};

invoker.registerRoom(321, room321);

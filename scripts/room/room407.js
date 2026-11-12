////Room name
//var room407 = {};
//room407.main = function () {
//    g.pass = "makeup";
//    char.room(401);
//};


//Tattoo name
var room407 = {};
room407.selectOption = function (name, image, index) {
    var labels = {
        makeup_natural: "Natural", makeup_blush: "Blush", makeup_blushheavy: "Heavy Blush",
        makeup_clown: "Clown face", makeup_brown: "Dark tan", makeup_orange: "Orange", makeup_white: "Geisha",
        eyeliner_light: "Light", eyeliner_black: "Black", eyeliner_purple: "Purple", eyeliner_pink: "Pink",
        eyeliner_green: "Emerald", eyeliner_blue: "Sapphire", eyeliner_rainbow: "Rainbow",
        lipstick_red: "Red", lipstick_pink: "Pink", lipstick_purple: "Purple", lipstick_blue: "Blue", lipstick_black: "Black"
    };
    sc.selectLocalizedLabel(name, image, index, "room.407.option." + name, labels[name]);
};
room407.main = function () {
    nav.button({
        "type": "btn",
        "name": "airwrecka",
        "left": 858,
        "top": 34,
        "width": 438,
        "height": 1046,
        "image": "407_makeup/worker.png"
    }, 407);
    var navList = [400];
    nav.buildnav(navList);
};

room407.btnclick = function (name) {
    switch (name) {
        case "airwrecka":
            if (!qdress.st[5].ach) {
                chat(4, 407);
            }
            else {
                if (cl.c.makeup === null)
                    chat(0, 407);
                else
                    chat(1, 407);
            }
            break;
        case "makeup":
            nav.killall();
            room407.selectOption("makeup_natural", "27_mirror/icon_natural.png", 0);
            room407.selectOption("makeup_blush", "27_mirror/icon_blush.png", 1);
            room407.selectOption("makeup_blushheavy", "27_mirror/icon_blushheavy.png", 2);
            room407.selectOption("makeup_clown", "27_mirror/icon_clown.png", 3);
            room407.selectOption("makeup_brown", "27_mirror/icon_brown.png", 4);
            room407.selectOption("makeup_orange", "27_mirror/icon_orange.png", 5);
            room407.selectOption("makeup_white", "27_mirror/icon_white.png", 6);
            sc.selectCancel("reset", 7);
            break;
        case "makeup_natural":
        case "makeup_blush":
        case "makeup_blushheavy":
        case "makeup_clown":
        case "makeup_brown":
        case "makeup_orange":
        case "makeup_white":
            g.internal.m = name.replace("makeup_", "");
            invoker.invokeCurrent("btnclick", "eyeshadow");
            break;
        case "eyeshadow":
            nav.killall();
            room407.selectOption("eyeliner_light", "27_mirror/icon_eye_light.png", 0);
            room407.selectOption("eyeliner_black", "27_mirror/icon_eye_black.png", 1);
            room407.selectOption("eyeliner_purple", "27_mirror/icon_eye_purple.png", 2);
            room407.selectOption("eyeliner_pink", "27_mirror/icon_eye_pink.png", 3);
            room407.selectOption("eyeliner_green", "27_mirror/icon_eye_green.png", 4);
            room407.selectOption("eyeliner_blue", "27_mirror/icon_eye_blue.png", 5);
            room407.selectOption("eyeliner_rainbow", "27_mirror/icon_eye_rainbow.png", 6);
            sc.selectCancel("makeup", 7);
            break;
        case "eyeliner_light":
        case "eyeliner_black":
        case "eyeliner_purple":
        case "eyeliner_pink":
        case "eyeliner_green":
        case "eyeliner_blue":
        case "eyeliner_rainbow":
            g.internal.e = name.replace("eyeliner_", "");
            invoker.invokeCurrent("btnclick", "lipstick")
            break;
        case "lipstick":
            nav.killall();
            room407.selectOption("lipstick_red", "27_mirror/icon_lipstick_red.png", 0);
            room407.selectOption("lipstick_pink", "27_mirror/icon_lipstick_pink.png", 1);
            room407.selectOption("lipstick_purple", "27_mirror/icon_lipstick_purple.png", 2);
            room407.selectOption("lipstick_blue", "27_mirror/icon_lipstick_blue.png", 3);
            room407.selectOption("lipstick_black", "27_mirror/icon_lipstick_black.png", 4);
            sc.selectCancel("eyeshadow", 5);
            break;
        case "lipstick_red":
        case "lipstick_pink":
        case "lipstick_purple":
        case "lipstick_blue":
        case "lipstick_black":
            levels.mod("makeup", 60);
            g.internal.l = name.replace("lipstick_", "");
            cl.c.makeup = g.internal.m;
            cl.c.lipstick = g.internal.l;
            cl.c.pissface = g.internal.e;
            cl.display();
            nav.killall();
            gv.mod("money", -60);
            nav.bg("407_makeup/mirror.jpg");
            zcl.displayMirror();
            chat(3, 407);
            break;
        case "reset":
            char.room(407);
            break;
        default:
            break;
    }
};

room407.chatcatch = function (callback) {
    var i;
    switch (callback) {
        case "leave":
            char.room(400);
            break;
        case "buy":
            g.pass = "makeup";
            char.room(401);
            break;
        case "puton":
            if (gv.get("money") < 60) {
                chat(2, 407);
            }
            else {
                nav.killall();
                nav.bg("407_makeup/bg2.jpg");
                g.internal = { l: null, e: null, m: "n" };
                
                invoker.invokeCurrent("btnclick", "makeup");
            }
            break;
        default:
            break;
    }
};

invoker.registerRoom(407, room407);

room407.chat = function (chatID) {
    var cArray = [
        {
            chatID: 0,
            speaker: "!airwrecka",
            text: "*blech* You look hideous darling. Simply disgusting.",
            button: [
                { chatID: -1, text: "Can I buy some make up?", callback: "buy" },
                { chatID: -1, text: "Can you put on my makeup? [$60]", callback: "puton" },
            ]
        },
        {
            chatID: 1,
            speaker: "!airwrecka",
            text: "*ugh* What do you want?",
            button: [
                { chatID: -1, text: "Can I buy some make up?", callback: "buy" },
                { chatID: -1, text: "Can you put on my makeup? [$60]", callback: "puton" },
            ]
        },
        {
            chatID: 2,
            speaker: "thinking",
            text: "I don't have $60.",
            button: [
                { chatID: -1, text: "...", callback: "" },
            ]
        },
        {
            chatID: 3,
            speaker: "!airwrecka",
            text: "You look so vapid! Love it!",
            button: [
                { chatID: -1, text: "Can I buy some make up?", callback: "buy" },
                { chatID: -1, text: "Can you put on my makeup? [$60]", callback: "puton" },
                { chatID: -1, text: "[Return to the mall]", callback: "leave" },
            ]
        },
        {
            chatID: 4,
            speaker: "!airwrecka",
            text: "*blech* You look hideous darling. Simply disgusting.",
            button: [
                { chatID: -1, text: "Can I buy some make up?", callback: "buy" },
            ]
        },
    ];
    if (cArray.length > chatID && chatID > -1)
        return cArray[chatID];
    else
        return [];
};

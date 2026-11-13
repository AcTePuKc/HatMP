//Girl GloryHole Broom
var room1 = {};
room1.continueKey = null;
room1.renderToken = 0;
room1.main = function () {
    var renderToken = ++room1.renderToken;
    room1.continueKey = null;
    var btnList = [
        {
            "type": "btn",
            "name": "patron",
            "left": 852,
            "top": 375,
            "width": 217,
            "height": 51,
            "image": "1_startScreen/become_a_patron_button.png"
        }
    ];

    //var navList = [0];

    $('.room-left').hide();
    $('#room_footer').hide();
    $(".room-topper").hide();

    function addTextButton(name, key, fallback, left, top, width, height) {
        var label = l10n.t(key, fallback);
        var button = document.createElement("button");
        button.type = "button";
        button.className = "room-btn rom-event start-screen-game-button";
        button.dataset.name = name;
        button.dataset.room = "1";
        button.setAttribute("aria-label", label);
        button.textContent = label;
        button.style.left = (left * g.ratio) + "px";
        button.style.top = (top * g.ratio) + "px";
        button.style.width = (width * g.ratio) + "px";
        button.style.height = (height * g.ratio) + "px";

        var measure = document.createElement("canvas").getContext("2d");
        var fontSize = 48 * g.ratio;
        measure.font = "bold " + fontSize + "px Arial";
        var availableWidth = (width - 8) * g.ratio;
        var textWidth = measure.measureText(label).width;
        if (textWidth > availableWidth)
            fontSize *= availableWidth / textWidth;
        button.style.fontSize = fontSize + "px";
        document.getElementById("room-buttons").appendChild(button);
    }

    addTextButton("start", "start.menu.startGame", "Start Game", 322, 375, 316, 45);
    addTextButton("load", "start.menu.loadGame", "Load Game", 1280, 375, 321, 46);
    if (saves.getResumeData()) {
        room1.continueKey = "__resume__";
        addTextButton("continue", "start.menu.continue", "Continue", 802, 325, 316, 46);
    }
    else {
        saves.findLatestSave().then(function (key) {
            if (!key || g.roomID !== 1 || renderToken !== room1.renderToken)
                return;
            room1.continueKey = key;
            addTextButton("continue", "start.menu.continue", "Continue", 802, 325, 316, 46);
        }).catch(function (err) {
            console.warn("Unable to find a save to continue.", err);
        });
    }

    $.each(btnList, function (i, v) {
        nav.button(v, 1);
    });

    nav.t({
        type: "zimg",
        name: "version",
        left: 1450,
        top: 80,
        font: 20,
        hex: "#ffffff",
        stroke: "black",
        text: g.versionText + "<br/>" + l10n.t("start.versionNote", "The last release before the next release")
    }, 1);

    l10n.addSelector("title-language-selector", 40, 130, 320);

};

room1.btnclick = function (name) {
    switch (name) {
        case "start":
            saves.clearResume();
            g.pass = "";
            g.newLoad = false;
            char.initGame();
            dreams.add("work");
            $('.room-left').show();
            $('#room_footer').show();
            $(".room-topper").show();
            char.room(3);
            break;
        case "help":
            char.room(2);
            break;
        case "load":
            g.newLoad = true;
            phone.build("save");
            break;
        case "continue":
            if (room1.continueKey) {
                if (room1.continueKey === "__resume__") {
                    if (!saves.restoreResume())
                        phone.build("save");
                }
                else {
                    saves.load(room1.continueKey).then(function (loaded) {
                        if (!loaded)
                            phone.build("save");
                    }).catch(function (err) {
                        console.warn("Unable to continue the last save.", err);
                        phone.build("save");
                    });
                }
            }
            break;
        case "patron":
            window.open("https://www.patreon.com/FF5", '_blank');
            break;
        case "charismaRoll":
            charisma.drawRoll();
            break;
        case "charismaComplete":
            charisma.complete();
            break;
        default:
            break;
    }
};

room1.chatcatch = function (callback) {
    switch (callback) {
        
        
        default:
            break;
    }
};

room1.chat = function (chatID) {
    var cArray = [
        {
            chatID: 0,
            speaker: "me",
            text: "",
            button: [
                { chatID: 1, text: "", callback: "" }
            ]
        }
    ];
    return cArray[chatID];
};

invoker.registerRoom(1, room1);

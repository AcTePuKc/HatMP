//Room name
var room320 = {};
room320.main = function () {
    if (gv.get("janiceDatr") !== null) {
        nav.buildnav([318]);
    }
    else {
        if (cl.hasoutfit("public") === null) {
            var navList = [0];
            nav.buildnav(navList);
        }
        else {
            chat(999, 320);
        }
    }
};

room320.btnclick = function (name) {
    switch (name) {
        case "":
            break;
        default:
            break;
    }
};

room320.chatcatch = function (callback) {
    switch (callback) {
        case "nap_1hour":
            break;
        default:
            break;
    }
};

room320.chat = function (chatID) {
    if (chatID === 999) {
        var missingClothing = String(cl.hasoutfit("public")).replace(/<[^>]*>/g, "").trim();
        var missingClothingKey = {
            "shirt": "room.316.missing.shirt",
            "pants": "room.316.missing.pants",
            "shirt and pants": "room.316.missing.shirtAndPants",
            "underwear": "room.316.missing.underwear",
            "boy's underwear": "room.316.missing.boysUnderwear",
            "Can't wear a bra": "room.316.missing.bra",
            "bra": "room.316.missing.bra"
        }[missingClothing];
        if (missingClothingKey)
            missingClothing = l10n.t(missingClothingKey, missingClothing);
        return {
            chatID: 999,
            speaker: "thinking",
            l10nKey: "room.320.chat.999.text",
            l10nValues: { missing: missingClothing },
            text: "I'm missing my {missing}.",
            button: []
        };
    }
    else {
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
        if (cArray.length > chatID && chatID > -1)
            return cArray[chatID];
        else
            return [];
    }
};

invoker.registerRoom(320, room320);

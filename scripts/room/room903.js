//Boys lockerroom
var room903 = {};
room903.localizedMissingClothing = function (clothing) {
    var itemKeys = {
        "shirt": "shirt",
        "pants": "pants",
        "underwear": "underwear",
        "panties": "panties",
        "bra": "bra",
        "boy's underwear": "boysUnderwear",
        "Can't wear a bra": "cannotWearBra"
    };
    var items = Array.isArray(clothing) ? clothing : [clothing];
    return items.map(function (item) {
        var key = itemKeys[item];
        return key ? l10n.t("room.903.outfit." + key, item) : item;
    }).join(", ");
};

room903.main = function () {
    //var btnList = [
    //    {
    //        "type": "btn",
    //        "name": "name",
    //        "left": 1741,
    //        "top": 618,
    //        "width": 130,
    //        "height": 252,
    //        "image": "903_folder/hole.png"
    //    }
    //];
    
    //$.each(btnList, function (i, v) {
    //    nav.button(v, 903);
    //});
    var haso = cl.hasoutfit("public");
    if (haso === null) {
        var navList = [0, 901];
        nav.buildnav(navList);
    }
    else {
        g.internal = haso;
        chat(999, 903);
    }
};

room903.btnclick = function (name) {
    switch (name) {
        case "":
            break;
        default:
            break;
    }
};

room903.chatcatch = function (callback) {
    switch (callback) {
        case "leave":
            char.room(901);
            break;
        default:
            break;
    }
};

room903.chat = function (chatID) {
    if (chatID === 999) {
        return {
            chatID: 999,
            speaker: "thinking",
            l10nKey: "room.903.locker.warning",
            text: "I can't go out like this: {outfit}.",
            l10nValues: { outfit: room903.localizedMissingClothing(g.internal) },
            button: [{ chatID: -1, l10nKey: "room.903.locker.getDressed", text: "Get Dressed", callback: "" }]
        };
    }
    else {
        var cArray = [
            {
                chatID: 0,
                speaker: "random",
                l10nKey: "room.903.locker.intruder",
                text: "AAAAAAAAAaaaaaaaaaaaaaaaaa WHAT ARE YOU DOING IN HERE! GET OUT!!!!",
                button: [{ chatID: -1, l10nKey: "room.903.locker.apology", text: "Oh crap! I'm not a dirty pervert! Sorry", callback: "leave" }]
            },
        ];
        if (cArray.length > chatID && chatID > -1)
            return cArray[chatID];
        else
            return [];
    }
};

invoker.registerRoom(903, room903);

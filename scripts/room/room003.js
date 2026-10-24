//Room name
var room3 = {};
room3.main = function () {
    $('#room_footer').hide();
    $('.room-left').hide();

    $("#room-background").html('<div class="intro-body"><div class="intro-top">' +
        l10n.t("intro.title", "Hermaphrodity") + '</div>' +
        '<div class="intro-bottom">' + l10n.t("intro.subtitle", "and the Mystery of the Missing Specimens") + '</div>' +
        l10n.t("intro.browserWarning", "It won\'t play in incognito mode in some browsers.") + '<br/>' +
        l10n.t("intro.fullScreen", "This game is best viewed full screen. To make your browser full screen, press the {key} key. To exit full screen, press the {key} key again.", { key: "F11" }) + '<br/>' +
        l10n.t("intro.adultWarning", "This game contains themes and images that are not suitable for minors.") + '<br/><br/>' +
        l10n.t("intro.fiction", "This is a work of fiction. Names, characters, businesses, places, events, locales, and incidents are either the products of the author\'s imagination or used in a fictitious manner. Any resemblance to actual persons, living or dead, or actual events is purely coincidental.") + '<br/>' +
        l10n.t("intro.adultsOnly", "All characters are over the age of 18.") + '<br/>' +
        l10n.t("intro.beasts", "All beasts are ancient mystical beasts from the pits of hell.") + '<br/>' +
        l10n.t("intro.instructions", "Click {next} to play the game. Press {exit} to exit.", { next: l10n.t("intro.next", "Next"), exit: l10n.t("intro.exit", "Exit Game (Underage)") }) + '<br/>' +
        l10n.t("intro.farewell", "Happy Fapping!") + '<br/>' +
        '<button style="width:49%; margin-right:1%;" class="intro-button" onclick="invoker.invoke(3, \'btnclick\', 0)">' + l10n.t("intro.next", "Next") + '</button>' +
        '<button style="width:49%;" class="intro-button" onclick="invoker.invoke(3, \'btnclick\', 1)">' + l10n.t("intro.exit", "Exit Game (Underage)") + '</button>' +
        '</div>');
};

room3.btnclick = function (name) {
    switch (name) {
        case 0:
            char.room(2);
            break;
        case 1:
            window.open("https://google.com", "_self");
            break;
        default:
            break;
    }
};

room3.chatcatch = function (callback) {
    switch (callback) {
        case "nap_1hour":
            break;
        default:
            break;
    }
};

room3.chat = function (chatID) {
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
};

invoker.registerRoom(3, room3);

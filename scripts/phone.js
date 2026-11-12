var phone = {};
var room9999 = {};
phone.characterOffset = 0;
phone.achievementCategory = 0;
phone.achievementPage = 0;
phone.preservedMenuOverlay = null;
//var pic = {};

phone.mainButtons = function () {
    return [
        { n: "phone_save", key: "phone.button.save", fallback: "Save", icon: "./images/room/999_phone/bSave.png", crop: 195, aspect: 1.25, x: 0, y: 0 },
        { n: "phone_rel", key: "phone.button.characters", fallback: "Characters", icon: "./images/room/999_phone/bRelationships.png", crop: 195, aspect: 1.25, x: 1, y: 0 },
        { n: "phone_contacts", key: "phone.button.contacts", fallback: "Contacts", icon: "./images/room/999_phone/bContacts.png", crop: 195, aspect: 1.25, x: 2, y: 0 },
        { n: "phone_pic", key: "phone.button.pictures", fallback: "Pictures", icon: "./images/room/999_phone/bPic.png", crop: 195, aspect: 1.25, x: 3, y: 0 },
        { n: "phone_time", key: "phone.button.passTime", fallback: "Pass Time", icon: "./images/room/999_phone/bTime.png", crop: 195, aspect: 1.25, x: 0, y: 1 },
        { n: "phone_purity", key: "phone.button.purity", fallback: "Purity", icon: "./images/room/999_phone/bPurity.png", crop: 195, aspect: 1.25, x: 1, y: 1 },
        { n: "phone_ach", key: "phone.button.achievements", fallback: "Achievements", icon: "./images/room/999_phone/bAch.png", crop: 195, aspect: 1.25, x: 2, y: 1 },
        { n: "phone_settings", key: "phone.button.settings", fallback: "Settings", icon: "./images/room/999_phone/bSettings.png", crop: 195, aspect: 1.25, x: 3, y: 1 },
        { n: "phone_cheat", key: "phone.button.cheats", fallback: "Cheats", icon: "./images/room/999_phone/bCheat.png", crop: 195, aspect: 1.25, x: 0, y: 2 },
        { n: "phone_help", key: "phone.button.help", fallback: "Help", icon: "./images/room/999_phone/bHelp.png", crop: 195, aspect: 1.25, x: 1, y: 2 },
        { n: "phone_patron", key: "phone.button.support", fallback: "Support", icon: "./images/room/999_phone/bPatron.png", crop: 195, aspect: 1.25, x: 2, y: 2 },
        { n: "phone_thankyou", key: "phone.button.thanks", fallback: "Thank You", icon: "./images/room/999_phone/bPatreon.png", crop: 195, aspect: 1.25, x: 3, y: 2 }
    ];
};

phone.addMenuButton = function (button, left, top, width, height, showLabel) {
    var label = l10n.t(button.key, button.fallback);
    var control = document.createElement("button");
    control.type = "button";
    control.className = "room-btn rom-event room-zindex phone-menu-button";
    control.dataset.name = button.n;
    control.dataset.room = "9999";
    control.setAttribute("aria-label", showLabel
        ? label
        : l10n.t("phone.button.backTo", "Back to {section}", { section: label }));
    control.style.left = (left * g.ratio) + "px";
    control.style.top = (top * g.ratio) + "px";
    control.style.width = (width * g.ratio) + "px";
    control.style.height = (height * g.ratio) + "px";

    var icon = document.createElement("span");
    icon.className = "phone-menu-button-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.style.backgroundImage = "url('" + button.icon + "')";
    icon.style.backgroundSize = (width * g.ratio) + "px " + ((button.aspect || 1) * width * g.ratio) + "px";
    icon.style.height = ((button.crop / 200) * width * g.ratio) + "px";
    control.appendChild(icon);

    if (showLabel) {
        var text = document.createElement("span");
        text.className = "phone-menu-button-label";
        text.textContent = label;
        var measure = document.createElement("canvas").getContext("2d");
        var fontSize = 20 * g.ratio;
        measure.font = "bold " + fontSize + "px Arial";
        var maxWidth = (width - 8) * g.ratio;
        var textWidth = measure.measureText(label).width;
        if (textWidth > maxWidth)
            fontSize *= maxWidth / textWidth;
        text.style.fontSize = fontSize + "px";
        control.appendChild(text);
    }
    document.getElementById("room-buttons").appendChild(control);
};

phone.addLocalizedPanelText = function (name, key, fallback, left, top, width, height, options = {}) {
    var label = options.values ? l10n.t(key, fallback, options.values) : l10n.t(key, fallback);
    var panelText = document.createElement("div");
    panelText.className = "room-img room-zindex phone-localized-panel-text";
    panelText.dataset.name = "phone_localized_" + name;
    panelText.dataset.room = "9999";
    panelText.textContent = label;
    panelText.style.left = (left * g.ratio) + "px";
    panelText.style.top = (top * g.ratio) + "px";
    panelText.style.width = (width * g.ratio) + "px";
    panelText.style.height = (height * g.ratio) + "px";
    panelText.style.backgroundColor = options.background || "#131313";
    panelText.style.color = options.color || "#ffffff";
    panelText.style.fontSize = (options.font || 28) * g.ratio + "px";
    panelText.style.lineHeight = options.lineHeight || "1.2";
    panelText.style.textAlign = options.align || "left";
    panelText.style.justifyContent = options.align === "center" ? "center" : "flex-start";
    panelText.style.alignItems = "center";
    panelText.style.whiteSpace = options.wrap ? "normal" : "nowrap";
    panelText.style.padding = ((options.padding || 0) * g.ratio) + "px";

    if (!options.wrap) {
        var measure = document.createElement("canvas").getContext("2d");
        var fontSize = (options.font || 28) * g.ratio;
        measure.font = fontSize + "px Arial";
        var availableWidth = Math.max(0, (width - (options.padding || 0) * 2) * g.ratio);
        var textWidth = measure.measureText(label).width;
        if (textWidth > availableWidth)
            panelText.style.fontSize = (fontSize * availableWidth / textWidth) + "px";
    }

    document.getElementById("room-buttons").appendChild(panelText);
    return panelText;
};

phone.addLocalizedButton = function (name, key, fallback, left, top, width, height, active, style = "setting") {
    var label = l10n.t(key, fallback);
    var button = document.createElement("button");
    button.type = "button";
    button.className = "room-btn rom-event room-zindex phone-text-button phone-text-button-" + style +
        (active ? " is-active" : "");
    button.dataset.name = name;
    button.dataset.room = "9999";
    button.setAttribute("aria-label", label);
    button.style.left = (left * g.ratio) + "px";
    button.style.top = (top * g.ratio) + "px";
    button.style.width = (width * g.ratio) + "px";
    button.style.height = (height * g.ratio) + "px";

    var text = document.createElement("span");
    text.textContent = label;
    var measure = document.createElement("canvas").getContext("2d");
    var fontSize = 20 * g.ratio;
    measure.font = fontSize + "px Arial";
    var maxWidth = (width - 16) * g.ratio;
    var textWidth = measure.measureText(label).width;
    if (textWidth > maxWidth)
        fontSize *= maxWidth / textWidth;
    text.style.fontSize = fontSize + "px";
    button.appendChild(text);
    document.getElementById("room-buttons").appendChild(button);
    return button;
};

phone.addPageArrowButton = function (name, direction, key, fallback, left, top, enabled) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "room-btn rom-event room-zindex phone-achievement-page-control" +
        (direction === "previous" ? " is-previous" : " is-next");
    button.dataset.name = name;
    button.dataset.room = "9999";
    var label = l10n.t(key, fallback);
    button.setAttribute("aria-label", label);
    button.title = label;
    button.disabled = !enabled;
    button.style.left = (left * g.ratio) + "px";
    button.style.top = (top * g.ratio) + "px";
    button.style.width = (48 * g.ratio) + "px";
    button.style.height = (50 * g.ratio) + "px";
    button.innerHTML = '<svg viewBox="0 0 48 32" width="100%" height="100%" aria-hidden="true"><path d="M2 2 L16 16 L2 30 Z M16 2 L30 16 L16 30 Z M30 2 L44 16 L30 30 Z" fill="currentColor"/></svg>';
    document.getElementById("room-buttons").appendChild(button);
    return button;
};

phone.addAchievementCopy = function (name, text, left, top, width, height, fontSize, color) {
    var copy = document.createElement("div");
    copy.className = "room-img room-zindex phone-achievement-copy";
    copy.dataset.name = name;
    copy.dataset.room = "9999";
    copy.textContent = text;
    copy.style.left = (left * g.ratio) + "px";
    copy.style.top = (top * g.ratio) + "px";
    copy.style.width = (width * g.ratio) + "px";
    copy.style.height = (height * g.ratio) + "px";
    copy.style.fontSize = (fontSize * g.ratio) + "px";
    copy.style.lineHeight = "1.05";
    copy.style.color = color;
    copy.style.whiteSpace = "normal";
    copy.style.overflow = "hidden";
    copy.style.display = "-webkit-box";
    copy.style.webkitBoxOrient = "vertical";
    copy.style.webkitLineClamp = "2";

    document.getElementById("room-buttons").appendChild(copy);
    return copy;
};

phone.findMainButton = function (name) {
    return phone.mainButtons().find(function (button) {
        return button.n === name;
    }) || null;
};

phone.getAchievementGroups = function (index) {
    switch (index) {
        case 0: return ["panties", "bra"];
        case 1: return ["oral", "anal", "vaginal"];
        case 2: return ["fuck"];
        case 3: return ["event", "school", "pinkroom"];
        case 4: return ["end"];
        default: return [];
    }
};

phone.showAchievementGroup = function (index) {
    phone.achievementCategory = index;
    phone.achievementPage = 0;
    invoker.invoke(9999, "btnclick", "phone_ach_draw");
};

phone.isOpen = function () {
    return $('[data-name="phonex_reserve"]:visible').length > 0;
};

phone.close = function () {
    if (!phone.isOpen())
        return false;

    phone.clear(true);
    phone.restoreMenuOverlay();
    $("#title-language-selector").show();
    return true;
};

phone.handleSaveMenuAction = function (name) {
    let slotId;

    if (name === "phone_save_load_cancel") {
        phone.saveMenu();
        return true;
    }

    if (name.startsWith("phone_save_replace_verify_")) {
        slotId = name.replace("phone_save_replace_verify_", "");
        saves.write(slotId).then(phone.saveMenu);
        return true;
    }

    if (name.startsWith("phone_save_load_verify_")) {
        slotId = name.replace("phone_save_load_verify_", "");
        chat(-1, 0);
        saves.load(slotId);
        return true;
    }

    if (name.startsWith("phone_save_delete_verify_")) {
        slotId = name.replace("phone_save_delete_verify_", "");
        saves.remove(slotId).then(phone.saveMenu);
        return true;
    }

    return false;
};

phone.handleSettingsAction = function (name) {
    if (name.startsWith("phone_setting_diff")) {
        gv.set("difficulty", parseInt(name.replace("phone_setting_diff", "")));
        phone.settings();
        return true;
    }

    if (name.startsWith("phone_setting_clock")) {
        gv.set("clock24", name.replace("phone_setting_clock", ""));
        nav.buildclock();
        phone.settings();
        return true;
    }

    if (name === "phone_setting_encM" || name === "phone_setting_encF" ||
        name === "phone_setting_encBeast" || name === "phone_setting_encMyth") {
        gv.set(name.replace("phone_setting_", ""), !gv.get(name.replace("phone_setting_", "")));
        phone.settings();
        return true;
    }

    if (name === "phone_setting_d_on") {
        gv.set("transformation", "voluntary");
        phone.settings();
        return true;
    }

    if (name === "phone_setting_d_off") {
        gv.set("transformation", "voluntaryoff");
        phone.settings();
        return true;
    }

    if (name === "phone_setting_d_auto") {
        gv.set("transformation", "forced");
        phone.settings();
        return true;
    }

    if (name === "phone_setting_m" || name === "phone_setting_f" || name === "phone_setting_a") {
        gv.set("pronouns", name.replace("phone_setting_", ""));
        phone.settings();
        return true;
    }

    return false;
};

phone.handlePrefixAction = function (name) {
    if (name.startsWith("phone_photo_")) {
        phone.clear(false);
        var imgName = name.replace("phone_photo_", "");
        for (var i = 0; i < pic.master.length; i++) {
            if (pic.master[i].name === imgName) {
                nav.button({
                    "type": "zimg",
                    "name": "phone_photo_",
                    "left": 451,
                    "top": 155,
                    "width": 1185,
                    "height": 815,
                    "image": "999_phone/pic/" + pic.master[i].image,
                }, 9999);
            }
            phone.backbutton("phone_pic");
        }
        return true;
    }

    if (name.startsWith("phone_charselect_")) {
        phone.characterSelect(name.replace("phone_charselect_", ""));
        return true;
    }

    if (name.startsWith("phone_modtime")) {
        var modTime = name.replace("phone_modtime_", "");
        if (modTime === "x") {
            char.addtime(58);
            char.room(g.roomID);
        }
        else {
            var timeHour = parseInt(modTime);
            if (timeHour === 0)
                g.dt.setDate(g.dt.getDate() + 1);
            char.settime(parseInt(modTime), 0);
            char.room(g.roomID);
        }
        return true;
    }

    if (name.startsWith("phone_charsel_")) {
        nav.killbuttonStartsWith("phone_charsel_");
        var charstep1 = name.replace("phone_charsel_", "");
        var varstep2 = charstep1.split("_");
        var ch = sc.getMission(varstep2[0], varstep2[1]);
        var selectedMission = sc.charMission[ch.i].mission[ch.j];
        var roomList = "";
        nav.t({
            type: "zimg",
            name: "phone_charsel_" + sc.charMission[ch.i].name + "_" + sc.charMission[ch.i].mission[ch.j].missionName,
            "left": 850,
            "top": 250,
            font: 30,
            hex: "#ffffff",
            text: phone.characterGuideText(varstep2[0], varstep2[1], "title", selectedMission.title) +
                " [" + phone.characterGuideStatus(sc.mStatus(selectedMission.mStatus)) + "]"
        }, 9999);
        nav.t({
            type: "zimg",
            name: "phone_charsel_",
            "left": 900,
            "top": 300,
            font: 20,
            hex: "#ffffff",
            text: phone.characterGuideText(varstep2[0], varstep2[1], "description", selectedMission.desc)
        }, 1);
        nav.button({
            "type": "zbtn",
            "name": "phone_charselect_" + varstep2[0],
            "left": 800,
            "top": 250,
            "width": 40,
            "height": 40,
            "image": "999_phone/char_down.png",
        }, 9999);
        let taskcounter = 0;
        for (let i = 0; i < sc.charMission[ch.i].mission[ch.j].task.length; i++) {
            if (sc.charMission[ch.i].mission[ch.j].task[i].show) {
                var taskRoomId = sc.charMission[ch.i].mission[ch.j].task[i].roomId;
                var taskRoom = g.getRooms(taskRoomId);
                roomList = " @: " + l10n.t("location.room." + taskRoomId, taskRoom ? taskRoom.name : "");
                var tcolor = "#ffffff";
                var mstatus;
                switch (sc.mStatus(sc.charMission[ch.i].mission[ch.j].task[i].mStatus)) {
                    case "Failed": tcolor = "#cc3333"; mstatus = " ✘ "; break;
                    case "Completed": tcolor = "#33cc33"; mstatus = " ☑ "; break;
                    case "Not Started": tcolor = "#999999"; mstatus = " ☐ "; break;
                    default: tcolor = "#ffffff"; mstatus = " ";
                }
                nav.t({
                    type: "zimg",
                    name: "phone_charsel_",
                    "left": 910,
                    "top": 350 + (taskcounter * 40),
                    font: 24,
                    hex: tcolor,
                    text: mstatus + phone.characterGuideText(varstep2[0], varstep2[1],
                        "task." + (sc.charMission[ch.i].mission[ch.j].task[i].localizationId !== undefined
                            ? sc.charMission[ch.i].mission[ch.j].task[i].localizationId
                            : sc.charMission[ch.i].mission[ch.j].task[i].id),
                        sc.charMission[ch.i].mission[ch.j].task[i].txt) + roomList
                }, 1);
                taskcounter++;
            }
        }
        return true;
    }

    if (name.startsWith("phone_cheatmod")) {
        if (name === "phone_cheatmod_money") {
            gv.mod("money", 100);
            phone.cheat();
            $('#char_alert').hide();
        }
        else if (name === "phone_cheatmod_on") {
            gv.set("cheatMode", true);
            phone.cheat();
        }
        else {
            var cheatLevel = name.replace("phone_cheatmod_level_", "");
            levels.mod(cheatLevel, 100);
            phone.cheat();
            $('#char_alert').hide();
        }
        return true;
    }

    if (name.startsWith("phone_charRename_")) {
        var charrename = name.replace("phone_charRename_", "");
        var enteredName = $(".room-img[data-name='phone_charRenameDisplay']").val();
        sc.setcharname(charrename, phone.normalizeCharacterName(charrename, enteredName));
        phone.characterSelect(charrename);
        g.popUpNoticeBottom(l10n.t("phone.character.renamed", "{name} has been renamed.", { name: sc.n(charrename) }));
        return true;
    }

    if (name.startsWith("phone_purity_")) {
        let purid = parseInt(name.replace("phone_purity_", ""));
        nav.killbuttonStartsWith("phone_purity");
        phone.backbutton("phone_purity");
        phone.showPanel("999_phone/purity_bg.jpg", "phone_purity");
        phone.addLocalizedPanelText("purity_title", "phone.button.purity",
            "Purity", 610, 870, 350, 55, { font: 30, background: "#606060" });
        phone.addPurityText({
            left: 500,
            top: 200,
            font: 60,
            hex: "#000000",
            text: l10n.t("phone.purity.overview." + sex.st[purid].type, sex.st[purid].d),
            stroke: "white",
            zindex: 1
        });
        phone.addPurityDetailRow(300, l10n.t("phone.purity.names.boys", "Boys: "), sex.st[purid].ent[0], 1);
        phone.addPurityDetailRow(350, l10n.t("phone.purity.names.girls", "Girls: "), sex.st[purid].ent[1], 1);
        phone.addPurityDetailRow(400, l10n.t("phone.purity.names.nonbinary", "Non-binary: "), sex.st[purid].ent[2], 1);
        phone.addPurityNamesColumnHeaders();
        phone.addPurityNames(sex.st[purid], 1);
        return true;
    }

    return false;
};

phone.changeCharacterPage = function (delta) {
    phone.characterOffset = Math.max(0, phone.characterOffset + delta);
    phone.characters();
};

phone.openExternal = function (url) {
    window.open(url, "_blank");
};

phone.help = function (page) {
    if (page === "glossary")
        return phone.helpGlossary();

    phone.clear(false);
    $('#room-buttons').append('<div class="room-img resize" data-name="phone_help_bg" style="position:absolute; z-index:2; ' +
        g.makeCss(815, 1185, 155, 451) + ' background:#111114;"></div>');
    $('#room-buttons').append('<div class="room-img resize" data-name="phone_help_inner" style="position:absolute; z-index:2; ' +
        g.makeCss(735, 1095, 195, 496) + ' background:#19191d; border:2px solid #2f3140; border-radius:18px;"></div>');

    nav.t({
        type: "zimg",
        name: "phone_help",
        left: 550,
        top: 225,
        font: 42,
        hex: "#ffffff",
        text: l10n.t("phone.help.title", "Keyboard Shortcuts")
    }, 9999);

    nav.t({
        type: "zimg",
        name: "phone_help",
        left: 550,
        top: 325,
        font: 26,
        hex: "#ffffff",
        text: l10n.t("phone.help.inventory", "I  -  Open or close inventory")
    }, 9999);
    nav.t({
        type: "zimg",
        name: "phone_help",
        left: 550,
        top: 385,
        font: 26,
        hex: "#ffffff",
        text: l10n.t("phone.help.advance", "Space  -  Advance single-step dialog or Next scenes")
    }, 9999);
    nav.t({
        type: "zimg",
        name: "phone_help",
        left: 550,
        top: 445,
        font: 26,
        hex: "#ffffff",
        text: l10n.t("phone.help.autoSkip", "S  -  Toggle chat auto-skip when available")
    }, 9999);
    nav.t({
        type: "zimg",
        name: "phone_help",
        left: 550,
        top: 505,
        font: 26,
        hex: "#ffffff",
        text: l10n.t("phone.help.choices", "1-9  -  Pick visible chat choices by order")
    }, 9999);
    nav.t({
        type: "zimg",
        name: "phone_help",
        left: 550,
        top: 565,
        font: 26,
        hex: "#ffffff",
        text: l10n.t("phone.help.saveMenu", "Middle Click Phone  -  Open save menu")
    }, 9999);
    nav.t({
        type: "zimg",
        name: "phone_help",
        left: 550,
        top: 625,
        font: 26,
        hex: "#ffffff",
        text: l10n.t("phone.help.closePhone", "Esc  -  Close phone")
    }, 9999);
    nav.t({
        type: "zimg",
        name: "phone_help",
        left: 550,
        top: 695,
        font: 22,
        hex: "#ffd7f5",
        text: l10n.t("phone.help.directClicks", "Some scenes still require direct clicks.")
    }, 9999);

    nav.localizedTextButton("phone_help_glossary", "phone.help.glossary", "Glossary",
        550, 735, 360, 68, 9999, "setting");
    phone.addHelpLink(830);
};

phone.helpGlossary = function () {
    phone.clear(false);
    $('#room-buttons').append('<div class="room-img resize" data-name="phone_help_bg" style="position:absolute; z-index:2; ' +
        g.makeCss(815, 1185, 155, 451) + ' background:#111114;"></div>');
    $('#room-buttons').append('<div class="room-img resize" data-name="phone_help_inner" style="position:absolute; z-index:2; ' +
        g.makeCss(735, 1095, 195, 496) + ' background:#19191d; border:2px solid #2f3140; border-radius:18px;"></div>');

    nav.t({
        type: "zimg",
        name: "phone_help_glossary",
        left: 550,
        top: 225,
        font: 42,
        hex: "#ffffff",
        text: l10n.t("phone.help.glossary", "Glossary")
    }, 9999);
    var glossaryIntro = document.createElement("div");
    glossaryIntro.setAttribute("data-name", "phone_help_glossary_intro");
    glossaryIntro.style.position = "absolute";
    glossaryIntro.style.left = (550 * g.ratio) + "px";
    glossaryIntro.style.top = (285 * g.ratio) + "px";
    glossaryIntro.style.width = (980 * g.ratio) + "px";
    glossaryIntro.style.color = "#ffd7f5";
    glossaryIntro.style.fontFamily = "Arial, sans-serif";
    glossaryIntro.style.fontSize = (22 * g.ratio) + "px";
    glossaryIntro.style.lineHeight = "1.2";
    glossaryIntro.style.textShadow = "2px 2px 5px #000";
    glossaryIntro.style.zIndex = "3";
    glossaryIntro.textContent = l10n.t("phone.help.glossaryIntro", "Story terms and abbreviations. Some entries contain spoilers.");
    $('#room-buttons').append(glossaryIntro);

    var glossaryList = document.createElement("div");
    glossaryList.setAttribute("data-name", "phone_help_glossary_list");
    glossaryList.style.position = "absolute";
    glossaryList.style.zIndex = "3";
    glossaryList.style.left = (550 * g.ratio) + "px";
    glossaryList.style.top = (355 * g.ratio) + "px";
    glossaryList.style.width = (980 * g.ratio) + "px";
    glossaryList.style.height = (385 * g.ratio) + "px";
    glossaryList.style.boxSizing = "border-box";
    glossaryList.style.overflowY = "auto";
    glossaryList.style.paddingRight = (8 * g.ratio) + "px";
    glossaryList.style.color = "#ffffff";
    glossaryList.style.fontFamily = "Arial, sans-serif";
    glossaryList.style.textShadow = "2px 2px 5px #000";

    l10n.glossaryEntries().forEach(function (entry) {
        var section = document.createElement("section");
        section.style.marginBottom = (16 * g.ratio) + "px";
        section.style.paddingBottom = (10 * g.ratio) + "px";
        section.style.borderBottom = "1px solid #45414a";
        var title = document.createElement("div");
        title.textContent = entry.term;
        title.style.fontSize = (34 * g.ratio) + "px";
        title.style.fontWeight = "bold";
        title.style.marginBottom = (7 * g.ratio) + "px";
        var description = document.createElement("div");
        description.textContent = entry.description;
        description.style.fontSize = (30 * g.ratio) + "px";
        description.style.lineHeight = "1.25";
        description.style.overflowWrap = "anywhere";
        section.appendChild(title);
        section.appendChild(description);
        glossaryList.appendChild(section);
    });
    $('#room-buttons').append(glossaryList);

    nav.localizedTextButton("phone_help_shortcuts", "phone.help.shortcuts", "Keyboard Shortcuts",
        550, 735, 360, 68, 9999, "setting");
    phone.addHelpLink(830);
};

phone.addHelpLink = function (top) {
    var guideLinkText = l10n.t("phone.help.gameGuide", "Stuck? The guide is one click away!");
    var guideLinkFont = 26;
    var guideLinkMeasure = document.createElement("canvas").getContext("2d");
    guideLinkMeasure.font = guideLinkFont * g.ratio + "px Arial";
    var guideLinkTextWidth = guideLinkMeasure.measureText(guideLinkText).width;
    var guideLinkWidth = Math.min(520, Math.max(360, (guideLinkTextWidth / g.ratio) + 64));
    var guideLinkMaxTextWidth = (guideLinkWidth - 48) * g.ratio;
    if (guideLinkTextWidth > guideLinkMaxTextWidth) {
        guideLinkFont *= guideLinkMaxTextWidth / guideLinkTextWidth;
        guideLinkMeasure.font = guideLinkFont * g.ratio + "px Arial";
        guideLinkTextWidth = guideLinkMeasure.measureText(guideLinkText).width;
    }

    $('#room-buttons').append('<div class="room-img resize" data-name="phone_help_site" style="position:absolute; z-index:2; ' +
        g.makeCss(68, guideLinkWidth, top, 550) + ' background:#1f3a8a; border:2px solid #ffffff; border-radius:12px;"></div>');
    nav.button({
        "type": "zbtn",
        "name": "phone_help_site",
        "left": 550,
        "top": top,
        "width": guideLinkWidth,
        "height": 68,
        "image": "1002_quickfight/black20Alpha.png",
    }, 9999);
    nav.t({
        type: "zbtn",
        name: "phone_help_site",
        left: 550 + ((guideLinkWidth * g.ratio - guideLinkTextWidth) / (2 * g.ratio)),
        top: top + 20,
        font: guideLinkFont,
        hex: "#ffffff",
        text: guideLinkText
    }, 9999);
};

phone.drawAchievements = function () {
    phone.clear(false);
    var groups = phone.getAchievementGroups(phone.achievementCategory);
    phone.showPanel("999_phone/Achievements_bg.jpg");
    phone.addLocalizedPanelText("achievements_title", "phone.button.achievements",
        "Achievements", 610, 870, 1000, 55, { font: 30, background: "#000000" });
    phone.drawAchievementTabs();

    let newAchList = trophy.st
        .filter(item => groups.includes(item.group))
        .sort((a, b) => {
            const indexA = groups.indexOf(a.group);
            const indexB = groups.indexOf(b.group);

            if (indexA !== indexB)
                return indexA - indexB;

            return a.o - b.o;
        });

    const pageSize = 12;
    const pageCount = Math.max(1, Math.ceil(newAchList.length / pageSize));
    phone.achievementPage = Math.max(0, Math.min(phone.achievementPage, pageCount - 1));
    const pageStart = phone.achievementPage * pageSize;
    const pageAchievements = newAchList.slice(pageStart, pageStart + pageSize);

    for (let i = 0; i < pageAchievements.length; i++)
        phone.addAchievementCard(pageAchievements[i], i);

    if (pageCount > 1) {
        nav.tcenter({
            type: "zimg",
            name: "phone_",
            left: 1250,
            width: 250,
            top: 155,
            font: 20,
            hex: "#ffffff",
            text: l10n.t("phone.achievements.page", "Page {page} of {pages}", {
                page: phone.achievementPage + 1,
                pages: pageCount
            })
        }, 9999);
        phone.addPageArrowButton("phone_ach_page_prev", "previous", "phone.achievements.previous",
            "Previous page", 1490, 165, phone.achievementPage > 0);
        phone.addPageArrowButton("phone_ach_page_next", "next", "phone.achievements.next",
            "Next page", 1545, 165, phone.achievementPage < pageCount - 1);
    }
};

phone.build = function (selection = null) {
    $("#title-language-selector").hide();
    phone.clear(true);
    phone.captureMenuOverlay();
    inv.close(phone.preservedMenuOverlay !== null);
    var btnList = phone.mainButtons();

    nav.button({
        "type": "zimg",
        "name": "phonex_reserve",
        "left": 0,
        "top": 0,
        "width": 1920,
        "height": 1080,
        "image": "999_phone/" + inv.get(inv.phone).image,
    }, 9999);
    var homePanel = document.createElement("div");
    homePanel.className = "room-img room-zindex phone-home-panel";
    homePanel.dataset.name = "phonex_home_panel";
    homePanel.dataset.room = "9999";
    homePanel.style.left = (451 * g.ratio) + "px";
    homePanel.style.top = (155 * g.ratio) + "px";
    homePanel.style.width = (1185 * g.ratio) + "px";
    homePanel.style.height = (815 * g.ratio) + "px";
    document.getElementById("room-buttons").appendChild(homePanel);
    nav.button({
        "type": "zbtn",
        "name": "phonex_power",
        "left": 1662,
        "top": 181,
        "width": 90,
        "height": 90,
        "image": "999_phone/power.png",
    }, 9999);
    nav.button({
        "type": "zbtn",
        "name": "phonex_menu",
        "left": 1662,
        "top": 375,
        "width": 90,
        "height": 75,
        "image": "999_phone/hamburger.png",
    }, 9999);
    $.each(btnList, function (i, v) {
        phone.addMenuButton(v, 475 + (v.x * 300), 180 + (v.y * 260), 200, 250, true);
    });

    if (selection !== null) {
        if (selection === "save") {
            invoker.invoke(9999, "btnclick", "phone_save");
            nav.killbutton("phonex_menu");
        }
        else if (selection === "time") {
            invoker.invoke(9999, "btnclick", "phone_time");
            nav.killbutton("phonex_menu");
        }
        else {
            invoker.invoke(9999, "btnclick", selection);
            nav.killbutton("phonex_menu");
        }
    }
};

phone.captureMenuOverlay = function () {
    var overlay = $('#room-menuButtons');

    if (phone.preservedMenuOverlay !== null)
        return;

    if (inv.isOpen || !overlay.is(":visible") || overlay.children().length === 0) {
        phone.preservedMenuOverlay = null;
        return;
    }

    phone.preservedMenuOverlay = {
        background: overlay.css('background'),
        children: overlay.children().detach()
    };
    overlay.hide().html('');
};

phone.restoreMenuOverlay = function () {
    var overlay = $('#room-menuButtons');

    if (phone.preservedMenuOverlay === null)
        return false;

    overlay.html('');
    if (phone.preservedMenuOverlay.background)
        overlay.css('background', phone.preservedMenuOverlay.background);
    overlay.append(phone.preservedMenuOverlay.children);
    overlay.show();
    phone.preservedMenuOverlay = null;
    return true;
};

phone.clear = function (clearAll) {
    nav.killbuttonStartsWith("phone_");
    if (clearAll)
        nav.killbuttonStartsWith("phonex_");
};

phone.backbutton = function (icon) {
    var button = phone.findMainButton(icon);
    if (button !== null) {
        phone.addMenuButton(button, 1662, 525, 90, 112, false);
    }
};

phone.showSaveConfirmDialog = function (config) {
    nav.button({
        "type": "zimg",
        "name": config.overlayName,
        "left": 0,
        "top": 0,
        "width": 1920,
        "height": 1080,
        "image": "999_phone/verify.png",
    }, 9999);

    nav.t({
        type: "zimg",
        name: "phone_",
        left: config.promptLeft,
        top: 400,
        font: 30,
        hex: "#ffffff",
        text: config.promptText
    }, 1);
    var labelText = config.labelText !== undefined
        ? config.labelText
        : $("[data-name='phone_save_load_name_" + config.slotId + "']").text();
    var labelFontSize = 30 * g.ratio;
    var labelMeasure = document.createElement("canvas").getContext("2d");
    labelMeasure.font = labelFontSize + "px Arial";
    var labelWidth = labelMeasure.measureText(labelText).width;
    var confirmLabel = document.createElement("div");
    confirmLabel.className = "room-img room-zindex resize-font";
    confirmLabel.dataset.name = "phone_save_confirm_label";
    confirmLabel.dataset.room = "9999";
    confirmLabel.textContent = labelText;
    confirmLabel.style.left = (960 * g.ratio - labelWidth / 2) + "px";
    confirmLabel.style.top = (450 * g.ratio) + "px";
    confirmLabel.style.width = "auto";
    confirmLabel.style.height = "auto";
    confirmLabel.style.fontSize = labelFontSize + "px";
    confirmLabel.style.color = "#ffffff";
    confirmLabel.style.whiteSpace = "nowrap";
    document.getElementById("room-buttons").appendChild(confirmLabel);
    var confirmButton = phone.addLocalizedButton(
        config.confirmName, config.confirmKey, config.confirmFallback,
        650, 600, 250, 100, true, config.confirmStyle || "action");
    var cancelButton = phone.addLocalizedButton(
        "phone_save_load_cancel", "save.confirm.button.cancel", "Cancel",
        1030, 600, 250, 100, false, config.cancelStyle || "setting");
    confirmButton.querySelector("span").style.fontSize = (32 * g.ratio) + "px";
    cancelButton.querySelector("span").style.fontSize = (32 * g.ratio) + "px";
};

phone.showPanel = function (image, name = "phone_") {
    nav.button({
        "type": "zimg",
        "name": name,
        "left": 451,
        "top": 155,
        "width": 1185,
        "height": 815,
        "image": image,
    }, 9999);
};

phone.addCharacterCard = function (character, row, column) {
    const top = 180 + (row * 220);
    const left = 485 + (column * 190);
    const displayName = sc.n(character.name);

    $('#room-buttons').append('<div class="room-img resize" data-name="phone_char_bg" ' +
        'style="position: absolute; background: ' + character.hex + '; z-index:2; ' +
        g.makeCss(150, 150, top, left) + '">' +
        '</div>');

    privateChat.speakerButton({
        "type": "zbtn",
        "name": "phone_charselect_" + character.name,
        "left": left,
        "top": top,
        "width": 150,
        "height": 150,
        "image": "../speaker/" + character.image,
    }, character.name, 9999);

    nav.t({
        type: "zimg",
        name: "phone_char_",
        "left": left,
        "top": top + 150,
        font: displayName.length < 20 ? 20 : 12,
        hex: "#ffffff",
        text: displayName,
    }, 1);

    $('#room-buttons').append('<div class="resize room-img" data-name="phone_char_" data-room="999" style=" ' +
        g.makeCss(5, ((character.l > 10 ? 10 : character.l) * 15), top + 180, left) +
        '  background: #00ff00; border-radius:100px; z-index:2" ></div>');

    nav.t({
        type: "zimg",
        name: "phone_char_",
        "left": left,
        "top": top + 185,
        font: 20,
        hex: "#ffc2ff",
        text: character.secret > 99 ? l10n.t("phone.character.secretKnown", "They know") : (character.secret === 0 ? "" : l10n.t("phone.character.secretSuspicious", "Suspicious")),
    }, 1);
};

phone.normalizeCharacterName = function (name, value) {
    var enteredName = String(value == null ? "" : value);
    var character = sc.get(name);
    if (typeof l10n === "undefined" || !character)
        return enteredName;

    var sourceDefault = name === "landlord"
        ? "Landlady"
        : l10n.characterNameSource(name, character.display);
    var localizedDefault = name === "landlord"
        ? l10n.characterTerm("landlady", "display", sourceDefault, sourceDefault)
        : l10n.characterName(name, sourceDefault);

    return enteredName === localizedDefault ? sourceDefault : enteredName;
};

phone.addStatBar = function (config) {
    nav.t({
        type: "zimg",
        name: config.name || "phone_",
        "left": config.left,
        "top": config.top,
        font: config.font || 30,
        hex: config.hex || "#ffffff",
        text: config.label
    }, 1);

    $('#room-buttons').append('<div class="room-img" data-name="phone_charbar" style="position: absolute; bottom: 1%; background: #2d2d40; ' +
        g.makeCss(config.height || 10, config.width, config.top + (config.barOffsetTop || 20), config.left) + ' z-index:2;">' +
        '<div style="background: ' + config.barColor + '; border-radius: 20px; height: ' + g.ratio * (config.height || 10) + 'px; width: ' + config.value + '%;" class="resize-height rl-bar"></div>' +
        '</div>');
};

phone.addPurityText = function (config) {
    nav.t({
        type: config.type || "zimg",
        name: config.name || "phone_purity",
        left: config.left,
        top: config.top,
        font: config.font || 24,
        hex: config.hex || "#ffffff",
        text: config.text,
        stroke: config.stroke
    }, config.zindex || 9999);
};

phone.addPurityColumnHeaders = function (left, top, hex, labels) {
    for (let i = 0; i < labels.length; i++) {
        phone.addPurityText({
            left: left + (i * 50),
            top: top,
            hex: hex,
            text: labels[i]
        });
    }
};

phone.addPurityNamesColumnHeaders = function () {
    const labels = [
        l10n.t("phone.purity.names.boys", "Boys: "),
        l10n.t("phone.purity.names.girls", "Girls: "),
        l10n.t("phone.purity.names.nonbinary", "Non-binary: ")
    ];
    for (let i = 0; i < labels.length; i++) {
        phone.addPurityText({
            left: 1100 + (i * 150),
            top: 180,
            hex: "#ffffff",
            text: labels[i]
        });
    }
};

phone.addPurityFirstTime = function (left, top, day, hex, zindex = 9999) {
    phone.addPurityText({
        left: left,
        top: top,
        hex: hex,
        text: day === null ? "" : l10n.t("phone.purity.firstTime", "First time: Day {day}", { day: day }),
        zindex: zindex
    });
};

phone.addPurityDetailRow = function (top, label, entry, zindex = 9999) {
    phone.addPurityText({
        left: 500,
        top: top,
        hex: "#000000",
        text: label,
        zindex: zindex
    });
    phone.addPurityText({
        left: 650,
        top: top,
        hex: "#000000",
        text: entry.c,
        zindex: zindex
    });
    phone.addPurityFirstTime(750, top, entry.day, "#000000", zindex);
};

phone.addPurityNames = function (purity, zindex = 9999) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < purity.ent[i].names.length; j++) {
            phone.addPurityText({
                left: 1100 + (i * 150),
                top: 210 + (j * 25),
                font: 20,
                text: g.trunc(purity.ent[i].names[j], 15),
                zindex: zindex
            });
        }
    }
};

phone.addPurityOverviewRow = function (purity, top, color, labelLeft, countLefts) {
    phone.addPurityText({
        type: "zbtn",
        name: "phone_purity_" + purity.id,
        left: labelLeft,
        top: top,
        hex: color,
        text: l10n.t("phone.purity.overview." + purity.type, purity.d)
    });
    for (let i = 0; i < 3; i++) {
        phone.addPurityText({
            type: "zbtn",
            name: "phone_purity_" + purity.id,
            left: countLefts[i],
            top: top,
            hex: color,
            text: purity.ent[i].c
        });
    }
};

phone.addPuritySummaryLine = function (top, text) {
    const left = 900;
    const maxWidth = 1636 - left - 36;
    let font = 28;
    const measure = document.createElement("canvas").getContext("2d");
    measure.font = (font * g.ratio) + "px Arial";
    const textWidth = measure.measureText(text).width;
    const availableWidth = maxWidth * g.ratio;
    if (textWidth > availableWidth)
        font *= availableWidth / textWidth;

    phone.addPurityText({
        left: left,
        top: top,
        font: font,
        text: text
    });
};

phone.addPurityStatLine = function (top, text) {
    const availableWidth = (1636 - 1100 - 36) * g.ratio;
    const font = 24;
    const measure = document.createElement("canvas").getContext("2d");
    measure.font = (font * g.ratio) + "px Arial";
    const textWidth = measure.measureText(text).width;
    phone.addPurityText({
        type: "zbtn",
        left: 1100,
        top: top,
        font: textWidth > availableWidth ? font * availableWidth / textWidth : font,
        text: text
    });
};

phone.addAchievementTab = function (name, left, text) {
    nav.t({
        type: "zbtn",
        name: name,
        left: left,
        top: 800,
        font: 30,
        hex: "#ffffff",
        text: text
    }, 9999);
};

phone.drawAchievementTabs = function () {
    phone.addAchievementTab("phone_ach", 550, l10n.t("phone.achievements.tab.clothing", "Clothing"));
    phone.addAchievementTab("phone_ach1", 750, l10n.t("phone.achievements.tab.sex", "Sex"));
    phone.addAchievementTab("phone_ach2", 950, l10n.t("phone.achievements.tab.events", "Events"));
    phone.addAchievementTab("phone_ach3", 1150, l10n.t("phone.achievements.tab.other", "Other"));
    phone.addAchievementTab("phone_ach4", 1350, l10n.t("phone.achievements.tab.endings", "Endings"));
};

phone.addAchievementCard = function (achievement, index) {
    const left = (index % 3 * 380) + 485;
    const top = 230 + (Math.floor(index / 3) * 100);
    const achieved = achievement.ach;
    const title = sc.replace(l10n.t(
        "phone.achievements.item." + achievement.id + ".title", achievement.title));
    const description = achieved
        ? sc.replace(l10n.t("phone.achievements.item." + achievement.id + ".description", achievement.display))
        : l10n.t("phone.achievements.notAchieved", "Not Achieved");

    nav.button({
        "type": "zimg",
        "name": "phone_",
        "left": left,
        "top": top,
        "width": 350,
        "height": 84,
        "image": achieved ? "999_phone/ach/" + achievement.img : "999_phone/ach/x.webp",
    }, 9999);

    phone.addAchievementCopy("phone_achievement_title_" + achievement.id, title,
        left + 95, top + 5, 240, 42, 20, "#ffffff");
    phone.addAchievementCopy("phone_achievement_description_" + achievement.id, description,
        left + 95, top + 47, 240, 34, 16, "#cccccc");
};

phone.saveMenu = function () {
    phone.clear(false);
    phone.showPanel("999_phone/save_bg.jpg");
    saves.renderScreen();
};

phone.settings = function () {
    phone.clear(false);
    
    var difficulty = gv.get("difficulty");
    var clock24 = gv.get("clock24");
    let encM = gv.get("encM");
    let encF = gv.get("encF");
    let encBeast = gv.get("encBeast");
    let encMyth = gv.get("encMyth");
    let transformation = gv.get("transformation");
    let pronouns = gv.get("pronouns");

    phone.showPanel("999_phone/settingbg.jpg");
    phone.addLocalizedPanelText("settings_difficulty", "phone.settings.label.difficulty", "Difficulty", 600, 222, 500, 50, { font: 30 });
    phone.addLocalizedPanelText("settings_clock", "phone.settings.label.clock", "Clock", 600, 345, 500, 50, { font: 30 });
    phone.addLocalizedPanelText("settings_encounters", "phone.settings.label.encounters", "Encounters", 600, 469, 500, 50, { font: 30 });
    phone.addLocalizedPanelText("settings_transformations", "phone.settings.label.transformations", "Transformations", 600, 592, 500, 50, { font: 30 });
    phone.addLocalizedPanelText("settings_identity", "phone.settings.label.identity", "Identity", 600, 716, 500, 50, { font: 30 });
    phone.addLocalizedPanelText("settings_title", "phone.settings.label.title", "Settings", 620, 863, 300, 60, {
        font: 32,
        background: "#000000"
    });
    var settings = [
        { y: 0, x: 0, b: 3, n: "diff0", key: "phone.settings.option.easy", label: "Easy", active: difficulty === 0 },
        { y: 0, x: 1, b: 3, n: "diff1", key: "phone.settings.option.normal", label: "Normal", active: difficulty === 1 },
        { y: 0, x: 2, b: 3, n: "diff2", key: "phone.settings.option.hard", label: "Hard", active: difficulty === 2 },
        { y: 1, x: 0, b: 2, n: "clock12", key: "phone.settings.option.clock12", label: "12 Hour Clock", active: clock24 === "12" },
        { y: 1, x: 1, b: 2, n: "clock24", key: "phone.settings.option.clock24", label: "24 Hour Clock", active: clock24 === "24" },
        { y: 2, x: 0, b: 4, n: "encM", key: "phone.settings.option.men", label: "Men", active: encM },
        { y: 2, x: 1, b: 4, n: "encF", key: "phone.settings.option.women", label: "Women", active: encF },
        { y: 2, x: 2, b: 4, n: "encBeast", key: "phone.settings.option.beasts", label: "Beasts", active: encBeast },
        { y: 2, x: 3, b: 4, n: "encMyth", key: "phone.settings.option.mythical", label: "Mythical", active: encMyth },
        { y: 3, x: 0, b: 3, n: "d_on", key: "phone.settings.option.on", label: "On", active: transformation === "voluntary" },
        { y: 3, x: 1, b: 3, n: "d_off", key: "phone.settings.option.off", label: "Off", active: transformation === "voluntaryoff" },
        { y: 3, x: 2, b: 3, n: "d_auto", key: "phone.settings.option.auto", label: "Auto", active: transformation === "forced" },
        { y: 4, x: 0, b: 3, n: "m", key: "phone.settings.option.masculine", label: "Masculine", active: pronouns === "m" },
        { y: 4, x: 1, b: 3, n: "f", key: "phone.settings.option.feminine", label: "Feminine", active: pronouns === "f" },
        { y: 4, x: 2, b: 3, n: "a", key: "phone.settings.option.appearance", label: "Appearance", active: pronouns === "a" },
    ];
    $.each(settings, function (i, v) {
        phone.addLocalizedButton("phone_setting_" + v.n, v.key, v.label,
            925 + (v.x * (600/v.b)), 220 + (v.y * 125), 600/v.b, 50, v.active);
    });

    l10n.addSelector("phone_language_selector", 925, 810, 500);
    var readingButton = document.createElement("button");
    readingButton.type = "button";
    readingButton.className = "room-img resize phone-text-button phone-text-button-setting is-active";
    readingButton.dataset.name = "phone_dialogue_settings";
    var readingLabel = l10n.t("dialogue.settings", "Reading settings");
    readingButton.setAttribute("aria-label", readingLabel);
    readingButton.style.cssText = "position:absolute; z-index:3; " + g.makeCss(50, 600, 907, 925) +
        "font-size:" + (20 * g.ratio) + "px;";
    readingButton.textContent = readingLabel;
    readingButton.addEventListener("click", function () { dialogue.open("settings"); });
    document.getElementById("room-buttons").appendChild(readingButton);
}

phone.pictures = function () {
    phone.clear(false);

    phone.showPanel("999_phone/pics_bg.jpg");
    phone.addLocalizedPanelText("pictures_title", "phone.button.pictures",
        "Pictures", 610, 870, 1000, 55, { font: 30, background: "#111111" });
    var c = 0;
    for (var i = 0; i < pic.master.length; i++) {
        if (pic.master[i].entry) {
            nav.button({
                "type": "zbtn",
                "name": "phone_photo_" + pic.master[i].name,
                "left": 485 + ((c % 7) * 160),
                "top": 200 + (Math.floor(c / 7) * 160),
                "width": 150,
                "height": 150,
                "image": "999_phone/pic/" + pic.master[i].thumb,
            }, 9999);
            c++;
        }
    }
};

phone.characters = function () {
    phone.clear(false);
    phone.showPanel("999_phone/rel_bg.jpg");
    phone.addLocalizedPanelText("relationships_title", "phone.section.relationships",
        "Relationships", 610, 870, 430, 55, { font: 30, background: "#111111" });
    phone.addLocalizedButton("phone_relationship_terms_edit", "phone.relationshipTerms.edit",
        "Edit relationship terms", 1060, 872, 360, 52, true, "setting");
    
    let j = 0;
    let i;
    let showCharcterCounter = 0;
    for (i = 0; i < sc.char.length; i++) {
        if (sc.char[i].show) {
            if (showCharcterCounter >= phone.characterOffset && j < 18) {
                phone.addCharacterCard(sc.char[i], Math.floor(j / 6), j % 6);
                j++;
            }
            showCharcterCounter++;
        }
    }
    let prevexists = phone.characterOffset > 0;
    let nextexist = showCharcterCounter > phone.characterOffset + 18;
    if (prevexists) {
        phone.addPageArrowButton("phone_rel_prev", "previous", "phone.characters.previous",
            "Previous characters", 1490, 880, true);
    }
    if (nextexist) {
        phone.addPageArrowButton("phone_rel_next", "next", "phone.characters.next",
            "Next characters", 1545, 880, true);
    }
};

// Conservative suggestions for single lowercase Bulgarian nouns; users can override them.
phone.suggestBulgarianDefinite = function (value, plural) {
    var word = String(value || "").trim();
    if (word.length > 78 || !/^[а-яѝ]+$/.test(word)) return "";
    var last = word.charAt(word.length - 1);
    if (plural && (last === "и" || last === "е")) return word + "те";
    if (last === "а" || last === "я") return word + "та";
    return "";
};

phone.relationshipTermsEditor = function (section) {
    phone.clear(false);
    phone.showPanel("999_phone/rel_bg.jpg");

    var editingLandlady = section === "landlady";
    var useBulgarianSuggestions = l10n.getLanguage() === "bg";
    phone.addLocalizedPanelText("relationships_title", "phone.section.relationships",
        "Relationships", 610, 870, 1000, 55, { font: 30, background: "#111111" });
    phone.addLocalizedButton("phone_relationship_terms_cotenants", "phone.relationshipTerms.cotenantsTab",
        "Lola and Eva", 560, 140, 390, 55, !editingLandlady, "setting");
    phone.addLocalizedButton("phone_relationship_terms_landlady", "phone.relationshipTerms.landladyTab",
        "Landlady", 980, 140, 390, 55, editingLandlady, "setting");
    var content = document.createElement("div");
    content.className = "room-img room-zindex resize phone-relationship-editor-scroll";
    content.dataset.name = "phone_relationship_editor";
    content.dataset.room = "9999";
    content.style.left = (560 * g.ratio) + "px";
    content.style.top = (215 * g.ratio) + "px";
    content.style.width = (980 * g.ratio) + "px";
    content.style.height = (545 * g.ratio) + "px";
    content.style.overflowY = "auto";
    content.style.overflowX = "hidden";
    content.style.boxSizing = "border-box";
    content.style.padding = (8 * g.ratio) + "px " + (18 * g.ratio) + "px";
    content.style.background = "rgba(17,17,17,.35)";
    content.style.color = "#ffffff";
    content.style.fontFamily = "Arial, sans-serif";
    content.style.zIndex = "9999";
    document.getElementById("room-buttons").appendChild(content);

    function addSectionTitle(key, fallback, values) {
        var title = document.createElement("div");
        title.className = "phone-relationship-editor-title";
        title.textContent = l10n.t(key, fallback, values);
        content.appendChild(title);
    }

    function addTermInput(id, labelKey, fallback, value) {
        var label = document.createElement("label");
        label.className = "phone-relationship-editor-field";
        label.textContent = l10n.t(labelKey, fallback);
        var input = document.createElement("input");
        input.type = "text";
        input.id = id;
        input.name = id;
        input.className = "phone-relationship-term-input";
        input.dataset.name = id;
        input.dataset.room = "9999";
        input.value = value;
        input.maxLength = 80;
        input.autocomplete = "off";
        input.setAttribute("aria-label", label.textContent);
        label.appendChild(input);
        content.appendChild(label);
        return input;
    }

    // Saved custom forms and anything edited in this session are always manual.
    function bindBulgarianSuggestion(baseInput, formInput, formId, hasSavedForm) {
        if (!useBulgarianSuggestions || !baseInput || !formInput) return;
        var manual = !!hasSavedForm;
        formInput.addEventListener("input", function () { manual = true; });
        baseInput.addEventListener("input", function () {
            if (!manual && l10n.getLanguage() === "bg")
                formInput.value = formId === "vocative"
                    ? sc.suggestBulgarianVocative(baseInput.value)
                    : phone.suggestBulgarianDefinite(baseInput.value, formId === "pluralDefinite");
        });
    }

    var extraForms = l10n.characterTermForms(editingLandlady ? "landlady" : "coTenant");
    if (editingLandlady) {
        var initialLandladyName = sc.n("landlord");
        var initialLandladyForms = {};
        addSectionTitle("phone.relationshipTerms.landladyTitle", "How do you refer to {landlady}?",
            { landlady: sc.n("landlord") });
        var landladyInput = addTermInput("phone_landlady_relationship", "setup.landladyRelationship",
            "What do you call her?", initialLandladyName);
        extraForms.forEach(function (form) {
            var value = sc.get("landlord").relationshipForms && sc.get("landlord").relationshipForms[form.id];
            initialLandladyForms[form.id] = sc.landlady(form.id);
            var formInput = addTermInput("phone_landlady_form_" + form.id, "relationship.form." + form.id,
                form.label, typeof value === "string" ? value : initialLandladyForms[form.id]);
            formInput.title = l10n.t("phone.relationshipTerms.landladyHelp", "Enter the form used in dialogue.");
            if (form.id === "definite" || form.id === "vocative")
                bindBulgarianSuggestion(landladyInput, formInput, form.id, typeof value === "string");
        });
        $("#phone_landlady_relationship").on("input", function () {
            if (useBulgarianSuggestions && l10n.getLanguage() === "bg") return;
            if ($(this).val() !== initialLandladyName) {
                extraForms.forEach(function (form) {
                    if (!sc.get("landlord").relationshipForms || typeof sc.get("landlord").relationshipForms[form.id] !== "string") {
                        var field = $("#phone_landlady_form_" + form.id);
                        if (field.val() === initialLandladyForms[form.id]) field.val("");
                    }
                });
            }
            else {
                extraForms.forEach(function (form) {
                    var field = $("#phone_landlady_form_" + form.id);
                    if (!field.val()) field.val(initialLandladyForms[form.id]);
                });
            }
        });
        var landladyHelp = document.createElement("p");
        landladyHelp.className = "phone-relationship-editor-help";
        landladyHelp.textContent = l10n.t("phone.relationshipTerms.landladyHelp",
            "Use the additional field when a line needs a different grammatical form. Old saves keep their current name unless you edit it.");
        content.appendChild(landladyHelp);
    }
    else {
        var initialCoTenantPlural = sc.els();
        var initialCoTenantSingular = sc.el();
        var initialCoTenantForms = {};
        addSectionTitle("phone.relationshipTerms.title", "Relationship with {lola} and {eva}",
            { lola: sc.n("lola"), eva: sc.n("eva") });
        var pluralInput = addTermInput("phone_relationship_plural", "phone.relationshipTerms.plural",
            "For both of them (plural)", initialCoTenantPlural);
        var singularInput = addTermInput("phone_relationship_singular", "phone.relationshipTerms.singular",
            "For one of them (singular)", initialCoTenantSingular);
        extraForms.forEach(function (form) {
            var value = sc.get("el").relationshipForms && sc.get("el").relationshipForms[form.id];
            initialCoTenantForms[form.id] = form.id.indexOf("plural") === 0 ? sc.els(form.id) : sc.el(form.id);
            var coTenantFormInput = addTermInput("phone_relationship_form_" + form.id, "relationship.form." + form.id,
                form.label, typeof value === "string" ? value : initialCoTenantForms[form.id]);
            if (form.id === "singularDefinite")
                coTenantFormInput.title = l10n.t("phone.relationshipTerms.singularDefiniteHelp", "Example: co-tenant → the co-tenant.");
            else if (form.id === "pluralDefinite")
                coTenantFormInput.title = l10n.t("phone.relationshipTerms.pluralDefiniteHelp", "Example: co-tenants → the co-tenants.");
            if (form.id === "singularDefinite" || form.id === "pluralDefinite")
                bindBulgarianSuggestion(form.id === "pluralDefinite" ? pluralInput : singularInput,
                    coTenantFormInput, form.id, typeof value === "string");
        });
        $("#phone_relationship_plural, #phone_relationship_singular").on("input", function () {
            if (useBulgarianSuggestions && l10n.getLanguage() === "bg") return;
            var usesInitialTerms = $("#phone_relationship_plural").val() === initialCoTenantPlural &&
                $("#phone_relationship_singular").val() === initialCoTenantSingular;
            extraForms.forEach(function (form) {
                var field = $("#phone_relationship_form_" + form.id);
                var hasSavedForm = sc.get("el").relationshipForms &&
                    typeof sc.get("el").relationshipForms[form.id] === "string";
                if (!usesInitialTerms && !hasSavedForm && field.val() === initialCoTenantForms[form.id])
                    field.val("");
                else if (usesInitialTerms && !field.val())
                    field.val(initialCoTenantForms[form.id]);
            });
        });
        var coTenantHelp = document.createElement("p");
        coTenantHelp.className = "phone-relationship-editor-help";
        coTenantHelp.textContent = l10n.t("phone.relationshipTerms.help",
            "These forms are used when the game refers to them together or individually. Existing saves keep their current terms until you change them here.");
        content.appendChild(coTenantHelp);
    }

    phone.addLocalizedButton(editingLandlady ? "phone_relationship_terms_save_landlady" : "phone_relationship_terms_save",
        "phone.relationshipTerms.save", "Save", 700, 790, 260, 65, true, "setting");
    phone.addLocalizedButton("phone_relationship_terms_back", "phone.relationshipTerms.back",
        "Back", 1060, 790, 260, 65, false, "setting");
};

phone.saveRelationshipTerms = function (section) {
    if (section === "landlady") {
        var name = g.cleanText($("#phone_landlady_relationship").val() || "").trim();
        if (!name) {
            g.popUpNoticeBottom(l10n.t("setup.landladyRequired", "Enter what you call her."));
            return;
        }
        var defaultName = l10n.characterTerm("landlady", "display", "Landlady", "Landlady");
        var forms = {};
        var existingForms = sc.get("landlord").relationshipForms || {};
        l10n.characterTermForms("landlady").forEach(function (form) {
            var value = g.cleanText($("#phone_landlady_form_" + form.id).val() || "").trim();
            var currentValue = sc.landlady(form.id);
            if (value && (value !== currentValue || typeof existingForms[form.id] === "string"))
                forms[form.id] = value;
        });
        sc.get("landlord").display = name === defaultName ? "Landlady" : name;
        sc.get("landlord").relationshipForms = forms;
        g.popUpNoticeBottom(l10n.t("phone.relationshipTerms.saved", "Relationship terms saved."));
        phone.characters();
        return;
    }
    var plural = g.cleanText($("#phone_relationship_plural").val() || "").trim();
    var singular = g.cleanText($("#phone_relationship_singular").val() || "").trim();
    if (!plural || !singular) {
        g.popUpNoticeBottom(l10n.t("phone.relationshipTerms.required", "Enter both forms."));
        return;
    }

    var defaultPlural = l10n.characterTerm("coTenant", "plural", "Co-Tenant", "Co-Tenant");
    var defaultSingular = l10n.characterTerm("coTenant", "singular", "Co-Tenant", "Co-Tenant");
    var relationshipForms = {};
    var existingRelationshipForms = sc.get("el").relationshipForms || {};
    l10n.characterTermForms("coTenant").forEach(function (form) {
        var value = g.cleanText($("#phone_relationship_form_" + form.id).val() || "").trim();
        var currentValue = form.id.indexOf("plural") === 0 ? sc.els(form.id) : sc.el(form.id);
        if (value && (value !== currentValue || typeof existingRelationshipForms[form.id] === "string"))
            relationshipForms[form.id] = value;
    });
    sc.get("el").display = plural === defaultPlural ? "Co-Tenant" : plural;
    sc.get("el").singularDisplay = singular === defaultSingular ? "Co-Tenant" : singular;
    sc.get("el").relationshipForms = relationshipForms;
    g.popUpNoticeBottom(l10n.t("phone.relationshipTerms.saved", "Relationship terms saved."));
    phone.characters();
};

phone.characterGuideText = function (characterId, missionName, field, fallback) {
    var missionKey = missionName.startsWith("*") ? "ending_" + missionName.slice(1) : missionName;
    var characterValues = {};
    sc.char.forEach(function (character) {
        characterValues[character.name] = sc.n(character.name);
    });
    characterValues.time = nav.convertTime(20, 0);
    return l10n.t("phone.characterGuide." + characterId + "." + missionKey + "." + field,
        fallback, characterValues);
};

phone.characterGuideStatus = function (status) {
    var statusKey = String(status).toLowerCase().replace(/\s+/g, "");
    return l10n.t("phone.characterGuide.status." + statusKey, status);
};

phone.drawMainStory = function () {
    const s = sc.mainStory.status();
    const characterValues = { missy: sc.n("missy"), p: sc.n("p") };
    const currentStepText = s.current < 0 ? "" : l10n.t("phone.mainStory.step." + s.steps[s.current].id,
        s.steps[s.current].txt, characterValues);
    const header = s.current < 0
        ? l10n.t("phone.mainStory.complete", "All steps complete")
        : l10n.t("phone.mainStory.next", "Next: {step}", { step: currentStepText });
    nav.t({ type: "zimg", name: "phone_charsel_", left: 700, top: 180, font: 30, hex: "#FF76FF", text: g.linebreak(header, 50) }, 1);
    let top = 400;
    if (s.caseTxt !== "") {
        const characterValues = { missy: sc.n("missy"), p: sc.n("p"), tiffany: sc.n("tiffany"), martha: sc.n("martha"), ralph: sc.n("ralph"), bill: sc.n("!bill"), bimbo: sc.n("bimbo"), elijah: sc.n("elijah"), rachel: sc.n("rachel"), dale: sc.n("dale") };
        const caseHint = l10n.t("phone.mainStory.case." + s.caseKey, s.caseTxt, characterValues);
        const currentCase = l10n.t("phone.mainStory.currentCase", "Current case: {case}", { case: caseHint });
        nav.t({ type: "zimg", name: "phone_charsel_", left: 700, top: 280, font: 20, hex: "#ffffff", text: g.linebreak(currentCase, 70) }, 1);
        top = 400;
    }
    const measure = document.createElement("canvas").getContext("2d");
    const maxStepWidth = 480;
    const availableHeight = 460;
    const renderedSteps = s.steps.map(function (step, index) {
        const stepText = l10n.t("phone.mainStory.step." + step.id, step.txt, characterValues);
        const text = (index + 1) + ". " + stepText;
        return { text: text, lines: [] };
    });
    let stepFont = 24;
    for (let attempt = 0; attempt < 3; attempt++) {
        measure.font = stepFont + "px Arial";
        renderedSteps.forEach(function (step) {
            const words = step.text.split(/\s+/);
            let line = "";
            step.lines = [];
            words.forEach(function (word) {
                const candidate = line ? line + " " + word : word;
                if (line && measure.measureText(candidate).width > maxStepWidth) {
                    step.lines.push(line);
                    line = word;
                }
                else {
                    line = candidate;
                }
            });
            if (line)
                step.lines.push(line);
        });
        const columns = [[0, 9], [9, renderedSteps.length]];
        const tallestColumn = Math.max.apply(null, columns.map(function (range) {
            let lines = 0;
            for (let i = range[0]; i < range[1]; i++)
                lines += renderedSteps[i].lines.length;
            return lines * (stepFont + 3) + Math.max(0, range[1] - range[0] - 1) * 4;
        }));
        if (tallestColumn <= availableHeight || stepFont <= 16)
            break;
        stepFont = Math.max(16, stepFont * availableHeight / tallestColumn);
    }
    const columns = [
        { start: 0, end: 9, markerLeft: 500, textLeft: 540 },
        { start: 9, end: renderedSteps.length, markerLeft: 1050, textLeft: 1090 }
    ];
    columns.forEach(function (column) {
        let currentTop = top;
        for (let i = column.start; i < column.end; i++) {
            let marker = "";
            let color = "#999999";
            if (i === s.current) {
                marker = "▶";
                color = "#FF76FF";
            }
            else if (s.steps[i].done) {
                marker = "☑";
                color = "#33cc33";
            }
            nav.t({ type: "zimg", name: "phone_charsel_", left: column.markerLeft, top: currentTop, font: stepFont, hex: color, text: marker }, 1);
            nav.t({ type: "zimg", name: "phone_charsel_", left: column.textLeft, top: currentTop, font: stepFont, hex: color, text: renderedSteps[i].lines.join("<br/>") }, 1);
            currentTop += renderedSteps[i].lines.length * (stepFont + 3) + 4;
        }
    });
};
phone.characterSelect = function (name) {
    phone.clear(false);
    phone.backbutton("phone_rel");

    var thisChar = sc.get(name);
    var canRename = thisChar.setName || (name === "ralph" && thisChar.display !== "Ralph");
    var isMainStory = name === "mainstory";

    phone.showPanel("999_phone/rel_bg.jpg");
    phone.addLocalizedPanelText("relationships_title", "phone.section.relationships",
        "Relationships", 610, 870, 1000, 55, { font: 30, background: "#111111" });

    privateChat.speakerButton({
        "type": "zimg",
        "name": "phone_",
        "left": 500,
        "top": 170,
        "width": isMainStory ? 180 : 250,
        "height": isMainStory ? 180 : 250,
        "image": "../speaker/" + thisChar.image,
    }, name, 9999);
    var displayName = sc.n(name);
    if (!canRename) {
        nav.t({
            type: "zimg",
            name: "phone_",
            "left": 500,
            "top": isMainStory ? 365 : 425,
            font: isMainStory ? 30 : 40,
            hex: "#ffffff",
            text: displayName
        }, 1);
    }
    else {
        nav.inputbox({
            "type": "zimg",
            "name": "phone_charRenameDisplay",
            "left": 500,
            "top": 425,
            "width": 250,
            "height": 30,
            "title": displayName,
        }, 9999);
        phone.addLocalizedButton("phone_charRename_" + thisChar.name,
            "phone.character.rename", "Rename", 500, 480, 250, 50, true, "setting");
    }
    
    if (name === "mainstory") {
        phone.drawMainStory();
        return;
    }

    var characterLevelText = sc.levelName(sc.i(name));
    var levelMatch = /^Level\s+(-?\d+)$/i.exec(characterLevelText);
    if (levelMatch)
        characterLevelText = l10n.t("phone.character.level", "Level {level}", { level: levelMatch[1] });
    nav.t({
        type: "zimg",
        name: "phone_",
        "left": 500,
        "top": 540,
        font: 30,
        hex: "#ffffff",
        text: characterLevelText
    }, 1);
    phone.addStatBar({
        left: 500,
        top: 580,
        font: 14,
        hex: "#aaaaaa",
        label: l10n.t("phone.character.levelProgress", "Till Next Level"),
        width: 250,
        value: thisChar.c,
        barColor: "#FF76FF"
    });
    phone.addStatBar({
        left: 500,
        top: 620,
        label: l10n.t("phone.character.secret", "Secret:"),
        width: 250,
        value: thisChar.secret,
        barColor: "#189000",
        barOffsetTop: 30
    });
    var thisTimeline = sc.getTimeline(name);
    
    for (let i = 0; i < thisTimeline.subList.length; i++) {
        nav.t({
            type: "zimg",
            name: "phone_",
            "left": 500,
            "top": 680 + (i*22),
            font: 20,
            hex: thisTimeline.subList[i].current ? "#FF76FF" : "#ffffff",
            text: thisTimeline.subList[i].hstart + ":00 " + thisTimeline.subList[i].hend + ":00 " + sc.timelineLocation(thisTimeline.subList[i])
        }, 1);
    }
    if (name === "me") {
            var locked = '<span style="color:#cc3333">' + l10n.t("phone.player.locked", "Locked") + '</span>';
            var unlocked = '<span style="color:#33cc33">' + l10n.t("phone.player.unlocked", "Unlocked") + '</span>';
            var metxt =
                l10n.t("phone.player.cupSize", "Cup size: {size}", { size: cl.cupsize() }) + "<br/>" +
                l10n.t("phone.player.assSize", "Ass: {size}", { size: cl.buttsize() }) + "<br/>" +
                l10n.t("phone.player.lipsSize", "Lips: {size}", { size: cl.lipsize() }) + "<br/>" +
                l10n.t("phone.player.cockSize", "Cock: {size}", { size: cl.cocksize() }) + "<br/><br/>" +
                l10n.t("phone.player.wearPanties", "Wear panties") + ": " + (qdress.st[0].ach ? unlocked : locked) + "<br/>" +
                l10n.t("phone.player.wearBra", "Wear bra") + ": " + (qdress.st[1].ach ? unlocked : locked) + "<br/>" +
                l10n.t("phone.player.buyDildos", "Buy dildos") + ": " + (qdress.st[2].ach ? unlocked : locked) + "<br/>" +
                l10n.t("phone.player.crossDress", "Cross dress in public") + ": " + (qdress.st[3].ach ? unlocked : locked) + "<br/>" +
                l10n.t("phone.player.wearEarrings", "Wear earrings") + ": " + (qdress.st[4].ach ? unlocked : locked) + "<br/>" +
                l10n.t("phone.player.seduceMen", "Seduce men") + ": " + (qdress.st[24].ach ? unlocked : locked) + "<br/>" +
                l10n.t("phone.player.buySexyClothes", "Buy sexy clothes") + ": " + (qdress.st[7].ach ? unlocked : locked) + "<br/>" +
                l10n.t("phone.player.wearMakeup", "Wear makeup") + ": " + (qdress.st[5].ach ? unlocked : locked) + "<br/>" +
                l10n.t("phone.player.buyBimboClothes", "Buy bimbo clothes") + ": " + (qdress.st[8].ach ? unlocked : locked) + "<br/>" +
                l10n.t("phone.player.stripper", "Work as a stripper") + ": " + (qdress.st[25].ach ? unlocked : locked) + "<br/>" +
                l10n.t("phone.player.optionalUnderwear", "Panties and bra are optional") + ": " + (qdress.st[9].ach ? unlocked : locked) + "<br/>" +
                l10n.t("phone.player.whore", "Work as a whore") + ": " + (qdress.st[23].ach ? unlocked : locked) + "<br/>" +
                l10n.t("phone.player.lewdInPublic", "Lewd in public") + ": " + (qdress.st[10].ach ? unlocked : locked) + "<br/>";
            var playerHint;
            if (!sissy.st[0].ach) {
                playerHint = l10n.t("phone.player.unlockHint", "To unlock and grow, prove to {missy} that you deserve it. Keep working.", { missy: sc.n("missy") });
            } else {
                playerHint = l10n.t("phone.player.growHint", "Gain Sissy Points to unlock and grow.");
            }
            nav.t({
                type: "zimg",
                name: "phone_charselx",
                "left": 850,
                "top": playerHint.includes("<br") ? 260 : 240,
                font: 30,
                hex: "#ffffff",
                text: metxt
            }, 9999);
        if (!sissy.st[0].ach) {
            nav.t({
                type: "zimg",
                name: "phone_charselx",
                "left": 850,
                "top": 180,
                font: 30,
                hex: "#ffffff",
                text: playerHint
            }, 9999);
        }
        else {
            nav.t({
                type: "zimg",
                name: "phone_charselx",
                "left": 850,
                "top": 180,
                font: 30,
                hex: "#ffffff",
                text: playerHint
            }, 9999);
        }
    }
    if (name === "missy") {
        var sissySchoolInvite = l10n.t("phone.missy.school.invite", "Attend Sissy School Monday–Thursday.");
        var mmood = missy.get("mood");
        var mmoodtxt = "";
        let mtxt;

        if (gv.get("cultEscape") === null) {
            if (!sissy.st[17].ach)
                sissySchoolInvite = g.linebreak(l10n.t("phone.missy.school.notYet", "You haven't earned a place at Sissy School yet. The easiest way is to work and complete cases."), 50);
            else if (sissy.st[21].ach)
                sissySchoolInvite = g.linebreak(l10n.t("phone.missy.school.passed", "Congratulations on passing and proving yourself a true sissy! Visit the school for extra training; just take the elevator."), 50);

            if (mmood > 70)
                mmoodtxt = l10n.t("phone.missy.mood.adore", "Loves her little {sissy}.", { sissy: gender.pronoun("sissy") });
            else if (mmood > 30)
                mmoodtxt = l10n.t("phone.missy.mood.good", "Good {sissy}, but do better.", { sissy: gender.pronoun("sissy") });
            else if (mmood > 0)
                mmoodtxt = l10n.t("phone.missy.mood.ok", "You're okay. Try harder.");
            else if (mmood > -30)
                mmoodtxt = l10n.t("phone.missy.mood.disappointed", "Disappointed in her {sissy}.", { sissy: gender.pronoun("sissy") });
            else
                mmoodtxt = l10n.t("phone.missy.mood.angry", "Angry at her {sissy}.", { sissy: gender.pronoun("sissy") });

            mtxt =
                l10n.t("phone.missy.mood.label", "Mood") + ": " + mmoodtxt + "<br/>" +
                l10n.t("phone.missy.weeklyPay", "Weekly Pay: ${amount}", { amount: missy.get("weeklyPay") }) + "<br/><hr/>" +
                l10n.t("phone.missy.currentCase", "Current case") + ": <br/>" +
                g.linebreak(missy.activecase().txt, 50) + "<hr />" +
                l10n.t("phone.missy.school.title", "Sissy School") + ": <br/>" +
                sissySchoolInvite;
        }
        else {
            mtxt = l10n.t("phone.missy.free", "{missy} is free!", { missy: sc.n("missy") });
        }
        
        nav.t({
            type: "zimg",
            name: "phone_charselx",
            "left": 850,
            "top": 180,
            font: 30,
            hex: "#ffffff",
            text: mtxt
        }, 9999);
    }
    if ((name === "p" || name === "martha") && !sissy.st[21].ach) {
        switch (name) {
            case "p":
                var ptxt = l10n.t("phone.p.pinkRoom", "Pink Room: <br/>You must graduate from Sissy School first.");
                nav.t({
                    type: "zimg",
                    name: "phone_charselx",
                    "left": 850,
                    "top": 180,
                    font: 30,
                    hex: "#ffffff",
                    text: ptxt
                }, 9999);
                break;
            case "martha":
                if (gv.get("sissySchoolClass") === "finalx") {
                    var m1txtss = l10n.t("phone.martha.final.title", "Sissy School Final!") + "<br/>" +
                        l10n.t("phone.martha.final.daysLeft", "Days left: {days}", { days: future.get("sissyfinal") }) + "<br/>" +
                        l10n.t("phone.martha.final.friday", "1. Friday Night: Strip at the strip club") + "<br/>" +
                        l10n.t("phone.martha.final.saturday", "2. Saturday Night: Visit the Pink Room at {missy}'s before {time}",
                            { missy: sc.n("missy"), time: nav.convertTime(18, 0) }) + "<br/>" +
                        l10n.t("phone.martha.final.fastFood", "3. At the fast food restaurant get a boy's phone number.") + "<br/>" +
                        l10n.t("phone.martha.final.creampies", "4. Get as many creampies as you can!");
                    nav.t({
                        type: "zimg",
                        name: "phone_charselx",
                        "left": 850,
                        "top": 180,
                        font: 26,
                        hex: "#ffffff",
                        text: m1txtss
                    }, 9999);
                }
                else {
                    var m1txt = l10n.t("phone.martha.classes.completed", "Classes completed:") + "<br/>";
                    var m2txt = l10n.t("phone.martha.classes.notTaken", "Classes not taken:") + "<br/>";
                    var c1 = new Array();
                    var c2 = new Array();
                    for (let mi = 0; mi < 8; mi++) {
                        c1.push("");
                        c2.push("");
                    }
                    for (let mi = 0; mi < sissy.st.length; mi++) {
                        if (sissy.st[mi].active && sissy.st[mi].y > 0 && sissy.st[mi].y < 7) {
                            if (sissy.st[mi].ach)
                                c1[sissy.st[mi].y] += l10n.t("phone.martha.class." + sissy.st[mi].id, sissy.st[mi].name) + ", ";
                            else {
                                c2[sissy.st[mi].y] += l10n.t("phone.martha.class." + sissy.st[mi].id, sissy.st[mi].name) + ", ";
                            }
                        }
                    }
                    for (let mi = 1; mi < 7; mi++) {
                        if (c1[mi].length > 0) {
                            c1[mi] = c1[mi].replace(/,\s*$/, "");
                            m1txt += g.linebreak(c1[mi], 38) + "<br/>";
                        }
                        if (c2[mi].length > 0) {
                            c2[mi] = c2[mi].replace(/,\s*$/, "");
                            m2txt += g.linebreak(c2[mi], 38) + "<br/>";
                        }
                    }

                    nav.t({
                        type: "zimg",
                        name: "phone_charselx",
                        "left": 850,
                        "top": 180,
                        font: 26,
                        hex: "#ffffff",
                        text: m1txt + "<br /><br />" + m2txt
                    }, 9999);
                }
                break;
        }
    }
    else {
        for (let i = 0; i < sc.charMission.length; i++) {
            if (sc.charMission[i].name === thisChar.name) {
                for (let j = 0; j < sc.charMission[i].mission.length; j++) {
                    var tcolor = "#ffffff";
                    var mstatus;
                    switch (sc.mStatus(sc.charMission[i].mission[j].mStatus)) {
                        case "Failed": tcolor = "#cc3333"; mstatus = " [" + phone.characterGuideStatus("Failed") + "]"; break;
                        case "Completed": tcolor = "#33cc33"; mstatus = " ☑"; break;
                        case "Not Started": tcolor = "#999999"; mstatus = ""; break;
                        case "Closed": tcolor = "#3e3e5c"; mstatus = ""; break;
                        default: tcolor = "#ffffff"; mstatus = "";
                    }
                    
                    if (sc.charMission[i].mission[j].missionName.startsWith("*")) {
                        if (tcolor === "#999999")
                            tcolor = "#444444";
                        nav.t({
                            type: "zimg",
                            name: "phone_charsel_",
                            "left": 850,
                            "top": 180 + (j * 80),
                            font: 30,
                            hex: tcolor,
                            text: phone.characterGuideText(sc.charMission[i].name,
                                sc.charMission[i].mission[j].missionName, "title",
                                sc.charMission[i].mission[j].title) + mstatus
                        }, 9999);
                        nav.t({
                            type: "zimg",
                            name: "phone_charsel_",
                            "left": 1500,
                            "top": 180 + (j * 80),
                            font: 10,
                            hex: tcolor,
                            text: l10n.t("phone.characterGuide.ending", "Ending")
                        }, 9999);
                        nav.t({
                            type: "zimg",
                            name: "phone_charsel_",
                            "left": 900,
                            "top": 220 + (j * 80),
                            font: 20,
                            hex: "#999999",
                            text: phone.characterGuideText(sc.charMission[i].name,
                                sc.charMission[i].mission[j].missionName, "description",
                                sc.charMission[i].mission[j].desc)
                        }, 1);
                    }
                    else {
                        nav.t({
                            type: "zimg",
                            name: "phone_charsel_",
                            "left": 850,
                            "top": 180 + (j * 80),
                            font: 30,
                            hex: tcolor,
                            text: phone.characterGuideText(sc.charMission[i].name,
                                sc.charMission[i].mission[j].missionName, "title",
                                sc.charMission[i].mission[j].title) + mstatus
                        }, 9999);
                        nav.t({
                            type: "zimg",
                            name: "phone_charsel_",
                            "left": 900,
                            "top": 220 + (j * 80),
                            font: 20,
                            hex: "#999999",
                            text: phone.characterGuideText(sc.charMission[i].name,
                                sc.charMission[i].mission[j].missionName, "description",
                                sc.charMission[i].mission[j].desc)
                        }, 1);
                        nav.t({
                            type: "zimg",
                            name: "phone_charsel_",
                            "left": 900,
                            "top": 220 + (j * 80),
                            font: 20,
                            hex: "#ffffff",
                            text: phone.characterGuideText(sc.charMission[i].name,
                                sc.charMission[i].mission[j].missionName, "description",
                                sc.charMission[i].mission[j].desc)
                        }, 1);
                    }
                    
                    nav.button({
                        "type": "zbtn",
                        "name": "phone_charsel_" + sc.charMission[i].name + "_" + sc.charMission[i].mission[j].missionName,
                        "left": 800,
                        "top": 180 + (j * 80),
                        "width": 40,
                        "height": 40,
                        "image": "999_phone/char_left.png",
                    }, 9999);
                }
            }
        }
    }
}

phone.thankyou = function () {
    phone.clear(false);

    phone.showPanel("999_phone/thankyou_bg.jpg");
    phone.addLocalizedPanelText("thankyou_message", "phone.thankyou.message",
        "Thank you. This is a list of people who have helped keep the game going. There are many more. If you've contributed and would like to be added, let me know. Thanks!",
        616, 840, 1000, 125, { font: 23, wrap: true, padding: 4, lineHeight: "1.2" });
    var l = [
        "Arothiel", "Asako", "Discretlysinful (Aaron M )",
        "Fuck you Arin",
        "geebster",
        "John R. (AngryJ)", "Krueschen", "Kylie V.", "Merchanto", "Orrin",
        "Rachel",
        "reverseclipse",
        "SirGuren (Contributor)", "SOLISTS", "WendyJ", "Wild86willie"
    ];
    $.each(l, function (i, v) {
        nav.t({
            type: "zimg",
            name: "phone_",
            left: 475,
            top: 180 + (i * 28),
            font: 25,
            hex: "#ffffff",
            text: v
        }, 1);
    });
    
};

phone.passtime = function () {
    phone.clear(false);

    var currentTime = g.gethourdecimal();
    var bgnum = 4;
    if (currentTime >= 20)
        bgnum = 4;
    else if (currentTime >= 17)
        bgnum = 3;
    else if (currentTime >= 9)
        bgnum = 2;
    else if (currentTime >= 6)
        bgnum = 1;

    phone.showPanel("999_phone/time_bg_" + bgnum + ".jpg");
    var timeTitle = phone.addLocalizedPanelText("time_title", "phone.button.passTime",
        "Pass the time", 610, 870, 430, 55, { font: 30, background: "#252045" });
    timeTitle.style.borderRadius = (6 * g.ratio) + "px";
    timeTitle.style.textShadow = "1px 2px 3px #000";
    phone.addLocalizedPanelText("current_time", "phone.time.current", "Current time: {time}",
        451, 190, 1185, 60, {
            font: 40,
            align: "center",
            background: "transparent",
            values: { time: nav.friendlyTime() }
        });

    if (g.passtime.includes(g.roomID)) {

        var time = [9, 12, 17, 18, 20, 0];
        var clock = gv.get("clock24");
        var active;
        var timeButtonLeft = 451 + ((1185 - 250) / 2);

        for (i = 0; i < time.length; i++) {
            if (currentTime < 7)
                active = false;
            else
                active = (currentTime < time[i]) || time[i] === 0;

            nav.button({
                "type": active ? "zbtn" : "zimg",
                "name": "phone_modtime_" + time[i],
                "left": timeButtonLeft,
                "top": 300 + (i * 70),
                "width": 250,
                "height": 50,
                "image": "999_phone/time_" + time[i] + "_" + clock + "_" + (active ? "active" : "inactive") + ".png",
            }, 9999);
        }
        active = currentTime > 6.9 || currentTime < 2;
        nav.button({
            "type": active ? "zbtn" : "zimg",
            "name": "phone_modtime_x",
            "left": timeButtonLeft,
            "top": 750,
            "width": 250,
            "height": 50,
            "image": "999_phone/time_1hour_" + (active ? "active" : "inactive") + ".png",
        }, 9999);
    }
    else {
        phone.addLocalizedPanelText("cannot_pass_time", "phone.time.cannotPass",
            "Can't pass the time in this room.", 451, 300, 1185, 60,
            { font: 40, align: "center", background: "transparent" });
    }
};

phone.cheat = function () {
    phone.clear(false);

    if (gv.get("cheatMode")) {
        phone.showPanel("999_phone/cheat_bg.jpg");
        phone.addLocalizedPanelText("cheats_title", "phone.cheats.title",
            "Cheats — a thank you to my patrons", 610, 870, 1000, 55, { font: 30 });
        var moneyBadge = phone.addLocalizedPanelText("cheats_money_badge", "phone.cheats.moneyLabel",
            "Money", 568, 293, 66, 66, { font: 14, align: "center", background: "#131313" });
        moneyBadge.style.border = "2px solid #24b724";
        moneyBadge.style.borderRadius = "50%";
        moneyBadge.style.color = "#35d42a";
        moneyBadge.style.fontWeight = "bold";

        // The strength row has no icon in the original cheat background.
        // Add a matching badge so the custom strength cheat has the same cue as the other stats.
        var strengthBadge = document.createElement("div");
        strengthBadge.className = "room-img room-zindex phone-cheat-strength-badge";
        strengthBadge.dataset.name = "phone_localized_cheats_strength_badge";
        strengthBadge.dataset.room = "9999";
        strengthBadge.setAttribute("aria-hidden", "true");
        strengthBadge.style.left = (568 * g.ratio) + "px";
        strengthBadge.style.top = (753 * g.ratio) + "px";
        strengthBadge.style.width = (66 * g.ratio) + "px";
        strengthBadge.style.height = (66 * g.ratio) + "px";
        strengthBadge.innerHTML = '<svg viewBox="0 0 66 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><circle cx="33" cy="33" r="26" fill="#131313" stroke="#e68731" stroke-width="2.5"/><g fill="none" stroke="#e68731" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M23 26v14M18 29v8M43 26v14M48 29v8M23 33h20"/></g></svg>';
        document.getElementById("room-buttons").appendChild(strengthBadge);

        var levelToMod = ["fitness", "charisma", "strength"];

        nav.t({
            type: "zimg",
            name: "phone_cheatmod",
            left: 650,
            top: 300,
            font: 40,
            hex: "#ffffff",
            text: l10n.t("phone.cheats.moneyLabel", "Money") + ": $" + gv.get("money")
        }, 1);

        nav.button({
            "type": "zbtn",
            "name": "phone_cheatmod_money",
            "left": 1200,
            "top": 300,
            "width": 250,
            "height": 50,
            "image": "999_phone/cheat_money.png",
        }, 9999);

        for (var i = 0; i < levelToMod.length; i++) {
            var l = levels.st[levels.i(levelToMod[i])];
            nav.t({
                type: "zimg",
                name: "phone_cheatmod",
                left: 650,
                top: 300 + ((i + 1) * 155),
                font: 40,
                hex: "#ffffff",
                text: l10n.t("phone.cheats.stat." + levelToMod[i], l.d) + " " +
                    l10n.t("phone.cheats.level", "Level") + ": " + l.l
            }, 1);

            nav.button({
                "type": "zbtn",
                "name": "phone_cheatmod_level_" + levelToMod[i],
                "left": 1200,
                "top": 300 + ((i + 1) * 155),
                "width": 250,
                "height": 50,
                "image": "999_phone/cheat_stats.png",
            }, 9999);
        }
    }
    else {
        phone.showPanel("999_phone/cheat_bg1.jpg");
        phone.addLocalizedPanelText("cheats_title", "phone.cheats.title",
            "Cheats — a thank you to my patrons", 610, 870, 1000, 55, { font: 30 });
        phone.addLocalizedPanelText("cheats_explanation", "phone.cheats.explanation",
            "This cheat menu is my way of thanking everyone for their generous support. The game is designed to be played without cheats enabled, so you won't miss anything if you leave them off.",
            690, 270, 760, 230, { font: 30, wrap: true, align: "center", padding: 12, lineHeight: "1.2" });
        phone.addLocalizedButton("phone_cheatmod_on", "phone.cheats.patreonButton",
            "I support the game on Patreon", 651, 600, 800, 100, true, "action");
    }
};

phone.purity = function () {
    phone.clear(false);
    let penisvirgin = sex.getvirgin(27);
    let oralvirgin = sex.getvirgin(29);
    let pussyvirgin = sex.getvirgin(28);
    let analvirgin = sex.getvirgin(26);

    phone.showPanel("999_phone/purity_bg.jpg", "phone_purity");
    phone.addLocalizedPanelText("purity_title", "phone.button.purity",
        "Purity", 610, 870, 350, 55, { font: 30, background: "#606060" });
    var purityHeaders = [
        l10n.t("phone.purity.header.boy", "Boy"),
        l10n.t("phone.purity.header.girl", "Girl"),
        l10n.t("phone.purity.header.nonbinary", "NB")
    ];
    phone.addPurityColumnHeaders(850, 170, "#000", purityHeaders);
    phone.addPurityColumnHeaders(1450, 170, "#fff", purityHeaders);
    
    let subcount, domcounter, l, t, col, lm, lf, ln;
    subcount = domcounter = 0;
    
    for (let i = 0; i < sex.st.length; i++) {
        if (i < 26 || i > 29) {
            if (sex.st[i].subdom === "sub") {
                l = 500;
                t = (subcount * 30) + 210;
                col = "#000000";
                lm = 850;
                lf = 900;
                ln = 950;
                subcount++;
            }
            else {
                l = 1100;
                t = (domcounter * 30) + 210;
                col = "#ffffff";
                lm = 1450;
                lf = 1500;
                ln = 1550;
                domcounter++;
            }

            phone.addPurityOverviewRow(sex.st[i], t, col, l, [lm, lf, ln]);
        }
    }
    let penisVirginTxt, analVirginTxt, pussyVirginTxt, oralVirginTxt;
    if (penisvirgin.virgin) {
        if (cl.c.cock === 5)
            penisVirginTxt = l10n.t("phone.purity.summary.penisUnused", "Lost your penis and never used it.");
        else
            penisVirginTxt = l10n.t("phone.purity.summary.virgin", "Virgin");
    }
    else {
        penisVirginTxt = l10n.t("phone.purity.summary.penisLost",
            "Penis virginity lost to {who} on day {day}.", {
                who: sc.replace(penisvirgin.who), day: penisvirgin.day
            });
    }

    if (oralvirgin.virgin) {
        oralVirginTxt = l10n.t("phone.purity.summary.oralNone", "Haven't performed oral on anyone.");
    }
    else {
        if (oralvirgin.gender === "f")
            oralVirginTxt = l10n.t("phone.purity.summary.firstCunnilingus",
                "First cunnilingus on {who} on day {day}.", {
                    who: sc.replace(oralvirgin.who), day: oralvirgin.day
                });
        else
            oralVirginTxt = l10n.t("phone.purity.summary.firstCock",
                "First cock sucked: {who}, day {day}.", {
                    who: sc.replace(oralvirgin.who), day: oralvirgin.day
                });
    }

    if (cl.c.cock === 5) {
        if (pussyvirgin.virgin)
            pussyVirginTxt = l10n.t("phone.purity.summary.pussyNever", "Never been fucked in your pussy.");
        else
            pussyVirginTxt = l10n.t("phone.purity.summary.pussyLost",
                "Lost your pussy virginity to {who} on day {day}.", {
                    who: sc.replace(pussyvirgin.who), day: pussyvirgin.day
                });
    }
    else {
        pussyVirginTxt = l10n.t("phone.purity.summary.noPussy", "No pussy.");
    }

    if (analvirgin.virgin)
        analVirginTxt = l10n.t("phone.purity.summary.analNever", "Never been fucked up your ass.");
    else
        analVirginTxt = l10n.t("phone.purity.summary.analLost",
            "Lost your anal virginity to {who} on day {day}.", {
                who: sc.replace(analvirgin.who), day: analvirgin.day
            });

    phone.addPuritySummaryLine(840, penisVirginTxt);
    phone.addPuritySummaryLine(870, analVirginTxt);
    phone.addPuritySummaryLine(900, oralVirginTxt);
    phone.addPuritySummaryLine(930, pussyVirginTxt);

    domcounter = 13;
    if (cl.c.cock === 5) {
        phone.addPurityStatLine((domcounter * 30) + 240, l10n.t("phone.purity.stats.pussy", "Times you played with your pussy: {count}", { count: gv.get("masturbate_pussy") }));
    }
    domcounter++;
    phone.addPurityStatLine((domcounter * 30) + 240, l10n.t("phone.purity.stats.penis", "Times you played with your penis: {count}", { count: gv.get("masturbate_dick") }));
    domcounter++;
    phone.addPurityStatLine((domcounter * 30) + 240, l10n.t("phone.purity.stats.vibrator", "Times you used a vibrator on your penis: {count}", { count: gv.get("masturbate_vibrator") }));
    domcounter++;
    phone.addPurityStatLine((domcounter * 30) + 240, l10n.t("phone.purity.stats.dildoOral", "Times you sucked on a dildo: {count}", { count: gv.get("masturbate_oral") }));
    domcounter++;
    phone.addPurityStatLine((domcounter * 30) + 240, l10n.t("phone.purity.stats.fingerAnal", "Times you slid your finger into your anus: {count}", { count: gv.get("masturbate_finger") }));
    domcounter++;
    phone.addPurityStatLine((domcounter * 30) + 240, l10n.t("phone.purity.stats.dildoFuck", "Times you fucked a dildo: {count}", { count: gv.get("masturbate_dildo") }));
};

room9999.btnclick = function (name) {
    if (phone.handlePrefixAction(name))
        return;
    else {
        if (phone.handleSaveMenuAction(name))
            return;

        if (phone.handleSettingsAction(name))
            return;

        switch (name) {
            case "phonex_power":
                phone.close();
                break;
            case "phonex_menu":
                phone.clear(true);
                phone.build();
                break;
            case "phone_save":
                phone.saveMenu();
                break;
            case "phone_rel":
                phone.characters();
                break;
            case "phone_rel_next":
                phone.changeCharacterPage(18);
                break;
            case "phone_rel_prev":
                phone.changeCharacterPage(-18);
                break;
            case "phone_relationship_terms_edit":
                phone.relationshipTermsEditor();
                break;
            case "phone_relationship_terms_cotenants":
                phone.relationshipTermsEditor("cotenants");
                break;
            case "phone_relationship_terms_landlady":
                phone.relationshipTermsEditor("landlady");
                break;
            case "phone_relationship_terms_save":
                phone.saveRelationshipTerms();
                break;
            case "phone_relationship_terms_save_landlady":
                phone.saveRelationshipTerms("landlady");
                break;
            case "phone_relationship_terms_back":
                phone.characters();
                break;
            case "phone_settings":
                phone.settings();
                break;
            case "phone_pic":
                phone.pictures();
                break;
            case "phone_cheat":
                phone.cheat();
                break;
            case "phone_help":
                phone.help();
                break;
            case "phone_help_glossary":
                phone.help("glossary");
                break;
            case "phone_help_shortcuts":
                phone.help("shortcuts");
                break;
            case "phone_help_site":
                phone.openExternal("http://fapforce5.com");
                break;
            case "phone_patron":
                phone.openExternal("https://www.patreon.com/FF5");
                break;
            case "phone_thankyou":
                phone.thankyou();
                break;
            case "phone_contacts":
                phone.clear(false);
                phone.showPanel("999_phone/call_bg.jpg");
                phone.addLocalizedPanelText("contacts_wip_title", "phone.contacts.wip.title",
                    "Work in progress.", 451, 510, 1185, 45,
                    { font: 30, align: "center", background: "#111111" });
                phone.addLocalizedPanelText("contacts_wip_message", "phone.contacts.wip.message",
                    "More to come later.", 451, 550, 1185, 45,
                    { font: 30, align: "center", background: "#111111" });
                phone.addLocalizedPanelText("contacts_title", "phone.button.contacts",
                    "Contacts", 610, 870, 350, 55,
                    { font: 30, background: "#111111" });
                break;
            case "phone_ach":
                phone.showAchievementGroup(0);
                break;
            case "phone_ach1":
                phone.showAchievementGroup(1);
                break;
            case "phone_ach2":
                phone.showAchievementGroup(2);
                break;
            case "phone_ach3":
                phone.showAchievementGroup(3);
                break;
            case "phone_ach4":
                phone.showAchievementGroup(4);
                break;
            case "phone_ach_page_prev":
                phone.achievementPage = Math.max(0, phone.achievementPage - 1);
                phone.drawAchievements();
                break;
            case "phone_ach_page_next":
                phone.achievementPage++;
                phone.drawAchievements();
                break;
            case "phone_ach_draw":
                phone.drawAchievements();
                break;
            case "phone_time":
                phone.passtime();
                break;
            case "phone_save_import":
                char.showExportDialog({
                    data: '',
                    showLoad: true,
                    showLoadFile: true,
                    showSaveFile: false,
                    showExportText: false,
                    showImportText: true
                });
                break;
            case "phone_purity":
                phone.purity();
                break;
            default:
                break;
        }
    }
};

invoker.registerRoom(9999, room9999);

$(document).on('keyup', function (e) {
    if (e.which !== 27 || e.altKey || e.ctrlKey || e.metaKey)
        return;
    if (char.isTypingTarget(e.target))
        return;
    if ($('#room_export').is(":visible"))
        return;

    if (phone.close())
        e.preventDefault();
});

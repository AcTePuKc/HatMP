//Zoey bedroom
var room502 = {};
room502.main = function () {
    var btnList = new Array();
    if (g.pass === "endSleepyTime") {
        if (sc.getTimeline("zoey").thisRoom) {
            nav.button({
                "type": "btn",
                "name": "bed",
                "left": 568,
                "top": 77,
                "width": 751,
                "height": 927,
                "image": "502_bedroom/bedZoey.png",
                "night": "502_bedroom/bedNZoey.png"
            }, 502);
        }
        g.pass = "";
        chat(0, 502);
    }
    else if (inv.has("tifgift")) {
        nav.bg("502_bedroom/502_zoeyRoom.jpg")
        chat(2, 502);
    }
    else {
        btnList = [
            {
                "type": "btn",
                "name": "dresser",
                "left": 1192,
                "top": 0,
                "width": 541,
                "height": 426,
                "image": "502_bedroom/dresser.png",
                "night": "502_bedroom/dresserN.png"
            }];
        if (sc.getTimeline("zoey").thisRoom) {
            nav.bg("502_bedroom/bedroomZoey.jpg", "502_bedroom/bedroomnightZoey.jpg");
            btnList.push({
                "type": "btn",
                "name": "bed",
                "left": 568,
                "top": 77,
                "width": 751,
                "height": 927,
                "image": "502_bedroom/bedZoey.png",
                "night": "502_bedroom/bedNZoey.png"
            });
        }
        else {
            btnList.push({
                "type": "btn",
                "name": "bed",
                "left": 568,
                "top": 77,
                "width": 751,
                "height": 927,
                "image": "502_bedroom/bed.png",
                "night": "502_bedroom/bedN.png"
            });
        }

        $.each(btnList, function (i, v) {
            nav.button(v, 502);
        });
        var canGotOut = cl.hasoutfit("public");
        if (canGotOut === null) {
            nav.buildnav([501, 503, 0]);
        }
        else {
            g.pass = "I'm missing my " + canGotOut + ". I need to get dressed before I go out. ";
            chat(999, 502);
        }
    }

    


    //if (sc.getstep("zoey") === 12) {
    //    nav.bg("502_bedroom/s1.jpg");
    //    chat(23, 502);
    //}
    //else {
    //    var btnList = [
    //        {
    //            "type": "btn",
    //            "name": "dresser",
    //            "left": 1192,
    //            "top": 0,
    //            "width": 541,
    //            "height": 426,
    //            "image": "502_bedroom/dresser.png",
    //            "night": "502_bedroom/dresserN.png"
    //        }];
    //    if (sc.zoey().thisRoom) {
    //        nav.bg("502_bedroom/bedroomZoey.jpg", "502_bedroom/bedroomnightZoey.jpg");
    //        btnList.push({
    //            "type": "btn",
    //            "name": "bed",
    //            "left": 568,
    //            "top": 77,
    //            "width": 751,
    //            "height": 927,
    //            "image": "502_bedroom/bedZoey.png",
    //            "night": "502_bedroom/bedNZoey.png"
    //        });
    //    }
    //    else {
    //        btnList.push({
    //            "type": "btn",
    //            "name": "bed",
    //            "left": 568,
    //            "top": 77,
    //            "width": 751,
    //            "height": 927,
    //            "image": "502_bedroom/bed.png",
    //            "night": "502_bedroom/bedN.png"
    //        });
    //    }

    //    $.each(btnList, function (i, v) {
    //        nav.button(v, 502);
    //    });
    //    if (g.pass === "endSleepyTime") {
    //        g.pass = "";
    //        chat(0, 502);
    //    }
    //    else if (inv.has("tifgift")) {
    //        chat(2, 502);
    //    }
    //    else {
    //        var canGotOut = cl.hasoutfit("public");
    //        if (canGotOut === null) {
    //            var navList = [501, 503, 0];
    //            nav.buildnav(navList);
    //        }
    //        else {
    //            g.internal = canGotOut;
    //            g.pass = "";
    //            g.pass = "I'm missing my " + canGotOut + ". I need to get dressed before I go out. ";
    //            chat(999, 502);
    //        }
    //    }
    //}
};

room502.btnclick = function (name) {
    switch (name) {
        case "dresser":
            g.pass = 502;
            char.room(8);
            break;
        case "bed":
            var zoeystepx = sc.taskGetStep("zoey", "sex");
            if (zoeystepx === 1 && future.get("zoeySex0") === -1) {
                if (g.gethourdecimal() < 25)
                    char.addDays(1);
                char.settime(3, 15);
                nav.killall();
                cl.wearSavedOutfit(5);
                nav.bg("502_bedroom/zoeySex0" + gender.pronoun("f") + ".jpg");
                chat(13, 502);
            }
            else {
                g.pass = 502;
                char.room(28);
            }
            //else if (zoeystepx === 10) {
            //    if (g.dt.getHours() > 6)
            //        g.dt.setDate(g.dt.getDate() + 1);
            //    g.dt = new Date(g.dt.getFullYear(), g.dt.getMonth(), g.dt.getDate(), 3, 7, 0, 0);
            //    nav.killall();
            //    cl.c.shoes = cl.saveOutfit[4].shoes;
            //    cl.c.socks = cl.saveOutfit[4].socks;
            //    cl.c.pants = cl.saveOutfit[4].pants;
            //    cl.c.panties = cl.saveOutfit[4].panties;
            //    cl.c.bra = cl.saveOutfit[4].bra;
            //    cl.c.shirt = cl.saveOutfit[4].shirt;
            //    cl.c.dress = cl.saveOutfit[4].dress;
            //    cl.c.swimsuit = cl.saveOutfit[4].swimsuit;
            //    cl.c.accessories = cl.saveOutfit[4].accessories;
            //    cl.c.pj = cl.saveOutfit[4].pj;
            //    cl.display();
            //    nav.bg("502_bedroom/single1.jpg");
            //    chat(13, 502);
            //}
            //else {
            //    g.pass = 502;
            //    char.room(28);
            //}
            break;
        case "zoeySex":
            if (g.internal > 5) {
                nav.killall();
                chat(15, 502);
            }
            else {
                nav.bg("502_bedroom/zoeySex" + g.internal + ".jpg");
            }
            g.internal++;
            break;
        default:
            break;
    }
};

room502.chatcatch = function (callback) {
    switch (callback) {
        case "zoeySex6":
        case "zoeySex7":
            nav.bg("502_bedroom/" + callback + ".jpg");
            break;
        case "zoeySex8":
            sc.modLevel("zoey", 40, 7);
            sc.completeMissionTask("zoey", "sex", 1);
            g.pass = 502;
            char.room(28);
            break;
        case "sleep":
            g.pass = 502;
            char.room(28);
            break;
        case "newday":
            char.room(502);
            break;
        case "zoeySex1":
            nav.bg("502_bedroom/zoeySex1" + gender.pronoun("f") + ".jpg");
            break;
        case "zoeySex2":
            nav.bg("502_bedroom/zoeySex2.jpg");
            g.internal = 3;
            nav.next("zoeySex");
            break;
        case "o0":
        case "o1":
        case "o2":
        case "o3":
        case "o4":
            var thisEntry = parseInt(callback[1]);
            cl.c.shoes = cl.saveOutfit[thisEntry].shoes;
            cl.c.socks = cl.saveOutfit[thisEntry].socks;
            cl.c.pants = cl.saveOutfit[thisEntry].pants;
            cl.c.panties = cl.saveOutfit[thisEntry].panties;
            cl.c.bra = cl.saveOutfit[thisEntry].bra;
            cl.c.shirt = cl.saveOutfit[thisEntry].shirt;
            cl.c.dress = cl.saveOutfit[thisEntry].dress;
            cl.c.swimsuit = cl.saveOutfit[thisEntry].swimsuit;
            cl.c.accessories = cl.saveOutfit[thisEntry].accessories;
            cl.c.pj = cl.saveOutfit[thisEntry].pj;
            cl.display();
            char.room(502);
            break;
        case "o5":
            char.room(502);
            break;
        case "overLook1":
            nav.bg("502_bedroom/overlook1.jpg");
            break;
        case "overLook2":
            nav.bg("502_bedroom/overlook2.jpg");
            break;
        case "overLook3":
            nav.bg("502_bedroom/overlook3.jpg");
            break;
        case "overLook4":
            nav.bg("502_bedroom/overlook4.jpg");
            break;
        case "overLook5":
            nav.bg("502_bedroom/overlook5.jpg");
            break;
        case "leave11":
            nav.room(501);
            break;
        case "lick2":
            nav.bg("502_bedroom/eat1.jpg");
            break;
        case "room501":
            nav.room(501);
            break;
        case "tellZoey":
            nav.bg("502_bedroom/eat3.jpg");
            break;
        case "chloeGone":
            nav.bg("502_bedroom/eat4.jpg");
            break;
        case "chloeGoneSleep":
            nav.bg("502_bedroom/overlook.jpg");
            break;
        case "chloeGoneSleepBlack":
            nav.bg("24_spinTheBottle/black.jpg");
            break;
        case "chloeGoneSleepReset":
            g.pass = 502;
            char.room(28);
            break;
        case "newClothing":
            nav.button({
                "type": "img",
                "name": "newClothing",
                "left": 905,
                "top": 183,
                "width": 423,
                "height": 646,
                "image": "502_bedroom/newClothing.png"
            }, 502);
            break;
        case "killnewClothing":
            nav.killbutton("newClothing");
            cl.add("shirt", "r");
            cl.add("pants", "k");
            cl.add("shoes", "fb");
            inv.update("tifgift", false, null);
            nav.bg("502_bedroom/tifgift.jpg");
            zcl.displayMain(120, 1000, .11, "clothes", false);
            break;
        case "dressup":
            cl.nude();
            nav.killbutton("zoey");
            zcl.displayMain(120, 1000, .11, "clothes", false);
            break;
        case "dressup1":
            cl.c.shirt = "r";
            cl.c.panties = "w";
            cl.c.pants = "k";
            cl.c.shoes = "fb";
            cl.display();
            zcl.displayMain(120, 1000, .11, "clothes", false);
            break;
        case "zoeyLeave":
            nav.room(502);
            break;
        case "wake1":
            nav.bg("502_bedroom/overlook1.jpg");
            break;
        case "talk":
            nav.bg("502_bedroom/talk.jpg");
            break;
        case "wakeEnd":
            char.room(502);
            break;
        case "single2":
            nav.bg("502_bedroom/single2.jpg");
            break;
        case "single3":
            nav.bg("502_bedroom/single3.jpg");
            break;
        case "single4":
            nav.bg("502_bedroom/single4.jpg");
            break;
        case "single5":
            nav.bg("502_bedroom/single5.jpg");
            break;
        case "single6":
            nav.bg("502_bedroom/single6.jpg");
            break;
        case "single7":
            nav.bg("502_bedroom/single7.jpg");
            break;
        case "singleReset":
            nav.killall();
            nav.bg("502_bedroom/bedroomnight.jpg");
            g.pass = 502;
            char.room(28);
            break;
        case "s2":
            nav.bg("502_bedroom/s2.jpg");
            zcl.displayMain(100, 800, .18, "", false);
            nav.button({
                "type": "img",
                "name": "zoey",
                "left": 573,
                "top": 27,
                "width": 1153,
                "height": 1053,
                "image": "502_bedroom/s2.png"
            }, 502);
            break;
        case "s3":
            nav.killall();
            nav.bg("502_bedroom/s3.jpg");
            break;
        case "s4":
            nav.killall();
            nav.bg("502_bedroom/s4.jpg");
            break;
        case "s5":
            nav.bg("502_bedroom/s5.jpg");
            break;
        case "s6":
            nav.bg("502_bedroom/s6.jpg");
            break;
        case "s7":
            nav.bg("502_bedroom/s7.jpg");
            break;
        case "s8":
            nav.bg("502_bedroom/s8.jpg");
            break;
        case "s9":
            nav.bg("502_bedroom/s9.jpg");
            break;
        case "s10":
            nav.bg("502_bedroom/s10.jpg");
            break;
        case "s11":
            nav.bg("502_bedroom/s11.jpg");
            break;
        case "s12":
            nav.bg("502_bedroom/s12.jpg");
            break;
        case "s13":
            nav.bg("502_bedroom/s13.jpg");
            break;
        case "s14":
            //sc.setstep("zoey", 13);
            scc.modLevel("zoey", 20, 5);
            //scc.love("zoey", 10, 100);
            char.addtime(60);
            char.room(502);
            break;
        default:
            break;
    }
};

room502.chat = function (chatID) {
    var cArray;
    if (chatID === 999) {
        var match = String(g.pass).match(/^I'm missing my (.*?)\. I need to get dressed before I go out\. ?$/);
        if (!match)
            return { chatID: 11, speaker: "me", text: g.pass, l10nIgnore: true, button: [] };
        var missing = match[1].replace(/<[^>]*>/g, "").trim();
        var keys = { "shirt": "room.316.missing.shirt", "pants": "room.316.missing.pants", "shirt and pants": "room.316.missing.shirtAndPants", "underwear": "room.316.missing.underwear", "boy's underwear": "room.316.missing.boysUnderwear", "Can't wear a bra": "room.316.missing.bra", "bra": "room.316.missing.bra" };
        return { chatID: 11, speaker: "me", text: g.pass, l10nKey: "room.502.missing", l10nValues: { missing: keys[missing] ? l10n.t(keys[missing], missing) : missing }, button: [] };
    }
    else {
        cArray = [
            {
                chatID: 0,
                speaker: "me",
                text: "What to wear.",
                button: [
                    { chatID: -1, l10nIgnore: true, text: '<img src="./images/general/shirt.png" /> ' + cl.saveOutfit[0].name, callback: "o0" },
                    { chatID: -1, l10nIgnore: true, text: '<img src="./images/general/shirt.png" /> ' + cl.saveOutfit[1].name, callback: "o1" },
                    { chatID: -1, l10nIgnore: true, text: '<img src="./images/general/shirt.png" /> ' + cl.saveOutfit[2].name, callback: "o2" },
                    { chatID: -1, l10nIgnore: true, text: '<img src="./images/general/shirt.png" /> ' + cl.saveOutfit[3].name, callback: "o3" },
                    { chatID: -1, l10nIgnore: true, text: '<img src="./images/general/shirt.png" /> ' + cl.saveOutfit[4].name, callback: "o4" },
                    { chatID: -1, text: "Get Up", callback: "o5" }
                ]
            },
            {
                chatID: 1,
                speaker: "zoey",
                text: "So what happened?",
                button: [
                    { chatID: 2, text: "Tell the truth", callback: "" },
                    { chatID: 5, text: "Lie", callback: "" }
                ]
            },
            {
                chatID: 2,
                speaker: "me",
                text: "Time to check what's in the bag.",
                button: [
                    { chatID: 3, text: "[Open Bag From " + sc.n("tiffany") + "]", l10nValues: { tiffany: sc.n("tiffany") }, callback: "newClothing" }
                ]
            },
            {
                chatID: 3,
                speaker: "me",
                text: "What the hell am I supposed to do with this? It's women's office clothing!",
                button: [
                    { chatID: 4, text: "...", callback: "killnewClothing" }
                ]
            },
            {
                chatID: 4,
                speaker: "zoey",
                text: "Zut alors!!! Is that a skirt and blouse! They are so pretty!",
                button: [
                    { chatID: 5, text: "I.. uh.... no?", callback: "" }
                ]
            },
            {
                chatID: 5,
                speaker: "zoey",
                text: "You know, I guess I have always known you were a crossdresser, that is why we are such good friends!",
                button: [
                    { chatID: 6, text: "Whaaa, no I'm not a ", callback: "" }
                ]
            },
            {
                chatID: 6,
                speaker: "zoey",
                text: "oh ma petite amie tu es si mignonne. It is Ok, I bet you look so pretty in your outfit! Let me see! Let me see! ",
                button: [
                    { chatID: 7, text: "Ok, promise not to laugh?", callback: "" },
                    { chatID: 12, text: "Oh, I don't know.. I wasn't going to wear it..", callback: "" }
                ]
            },
            {
                chatID: 7,
                speaker: "zoey",
                text: "I would never laugh at you, I am really excited to see you dress up!",
                button: [
                    { chatID: 8, text: "ok, here goes [dress up]", callback: "dressup" }
                ]
            },
            {
                chatID: 8,
                speaker: "zoey",
                text: "Oh putain! I never knew that you had a pénis géant! How have you been hiding that item? ",
                button: [
                    { chatID: 9, text: "Do you want to touch it?", callback: "" }
                ]
            },
            {
                chatID: 9,
                speaker: "zoey",
                text: "Hmmmm non. I admire its beauty, but I am not in love with the penis. Now show me your pretty clothes!",
                button: [
                    { chatID: 10, text: "It was worth a try [Put on girls clothes]", callback: "dressup1" }
                ]
            },
            {
                chatID: 10,
                speaker: "zoey",
                text: "You are sooo pretty! I love it! Your cute little mamelons are almost poking out! I am proud you can be your true self!",
                button: [
                    { chatID: 11, text: "No, I have to do this..", callback: "" }
                ]
            },
            {
                chatID: 11,
                speaker: "zoey",
                text: "It is ok. I will leave you to get dressed. Imagine such a large penis under that tiny skirt! You are too cute.",
                button: [
                    { chatID: -1, text: "See ya " + sc.n("zoey"), l10nValues: { zoey: sc.n("zoey") }, callback: "zoeyLeave" }
                ]
            },
            {
                chatID: 12,
                speaker: "zoey",
                text: "It is ok. I know you are shy, but you will look sexy in those clothes",
                button: [
                    { chatID: -1, text: "See ya " + sc.n("zoey"), l10nValues: { zoey: sc.n("zoey") }, callback: "zoeyLeave" }
                ]
            },
            {
                chatID: 13,
                speaker: "me",
                text: "**Snore** **Snort** huh? ",
                button: [
                    { chatID: 14, text: "...", callback: "zoeySex1" }
                ]
            },
            {
                chatID: 14,
                speaker: "me",
                text: "That came from the living room.... I guess I should check it out. Probably " +
                    "just " + sc.n("zoey") + " throwing her controller at the TV again. ", l10nValues: { zoey: sc.n("zoey") },
                button: [
                    { chatID: -1, text: "[Check out noise]", callback: "zoeySex2" }
                ]
            },
            {
                chatID: 15,
                speaker: "stormy",
                text: "Oh shit! F-f-f-f-fuck! I'm cumming! ",
                button: [
                    { chatID: 16, text: "...", callback: "zoeySex6" }
                ]
            },
            {
                chatID: 16,
                speaker: "stormy",
                text: "Fuck that was hot. I've never cum to an audience before. I'll have to " +
                    "get you to watch us again. " + sc.n("zoey") + " you can get your cuddles " +
                    "from dish washer. " + gender.pronoun("he") + " looks cuddly. Laters! ", l10nValues: { zoey: sc.n("zoey"), subject: gender.pronoun("he") },
                button: [
                    { chatID: 17, text: "Bye. ", callback: "zoeySex7" }
                ]
            },
            {
                chatID: 17,
                speaker: "zoey",
                text: "I am such a mess of wet and smells, but I am too tired to shower. Please " +
                    "help me to bed? Can you cuddle me till we sleep? Je me sens comme la petite mort. ",
                button: [
                    { chatID: -1, text: "Sure. Let's get some sleep. ", callback: "zoeySex8" }
                ]
            },











            {
                chatID: 14,
                speaker: "zoey",
                text: "c'est trop amusant! You are so dirty!", l10nKey: "room.502.legacy.14.text",
                button: [
                    { chatID: 15, text: "Hmm?", l10nKey: "room.502.legacy.14.choice.0", callback: "single3" }
                ]
            },
            {
                chatID: 15,
                speaker: "zoey",
                text: "You taste amazing! Je pourrais te manger toute la nuit!", l10nKey: "room.502.legacy.15.text",
                button: [
                    { chatID: 16, text: "....", l10nKey: "room.502.legacy.15.choice.0", callback: "" }
                ]
            },
            {
                chatID: 16,
                speaker: "stormy",
                text: "HHhhmmmMMmmmm ", l10nKey: "room.502.legacy.16.text",
                button: [
                    { chatID: 17, text: "...", l10nKey: "room.502.legacy.16.choice.0", callback: "single4" }
                ]
            },
            {
                chatID: 17,
                speaker: "stormy",
                text: "Huh?", l10nKey: "room.502.legacy.17.text",
                button: [
                    { chatID: 18, text: "Oh hi", l10nKey: "room.502.legacy.17.choice.0", callback: "single5" }
                ]
            },
            {
                chatID: 18,
                speaker: "zoey",
                text: "Oh.." + sc.n("me") + " sorry we were so loud, we get carried away sometimes... This is my friend " + sc.n("stormy") + ".", l10nKey: "room.502.legacy.18.text", l10nValues: { me: sc.n("me"), stormy: sc.n("stormy") },
                button: [
                    { chatID: 19, text: "That's ok, Please continue..", l10nKey: "room.502.legacy.18.choice.0", callback: "single6" }
                ]
            },
            {
                chatID: 19,
                speaker: "stormy",
                text: "The pervy roommate I've heard so much about. " + sc.n("zoey") + " says you like to watch. So what do you think?", l10nKey: "room.502.legacy.19.text", l10nValues: { zoey: sc.n("zoey") },
                button: [
                    { chatID: 20, text: "I uhhh. what?", l10nKey: "room.502.legacy.19.choice.0", callback: "" }
                ]
            },
            {
                chatID: 20,
                speaker: "zoey",
                text: "Oh " + sc.n("stormy") + "! Tu as promis. You would not say anything if he caught us!", l10nKey: "room.502.legacy.20.text", l10nValues: { stormy: sc.n("stormy") },
                button: [
                    { chatID: 21, text: "Wait, what did you tell her? You are the one that's always naked!", l10nKey: "room.502.legacy.20.choice.0", callback: "" }
                ]
            },
            {
                chatID: 21,
                speaker: "zoey",
                text: "Haha I know. Well, I think that's the end of our fun for the night. Au revoir " + sc.n("stormy") + ". Next time we'll " +
                    "go to your house!", l10nKey: "room.502.legacy.21.text", l10nValues: { stormy: sc.n("stormy") },
                button: [
                    { chatID: 22, text: "You don't have to leave.", l10nKey: "room.502.legacy.21.choice.0", callback: "single7" }
                ]
            },
            {
                chatID: 22,
                speaker: "stormy",
                text: "You are a perv! I love it! But I'm going to get going. I'm sure I'll see you again. " + sc.n("me") + ". " + sc.n("zoey") +
                    " I'll see you again soon!", l10nKey: "room.502.legacy.22.text", l10nValues: { me: sc.n("me"), zoey: sc.n("zoey") },
                button: [
                    { chatID: -1, text: "Bye " + sc.n("stormy") + " good night " + sc.n("zoey") + ".", l10nKey: "room.502.legacy.22.choice.0", l10nValues: { stormy: sc.n("stormy"), zoey: sc.n("zoey") }, callback: "singleReset" }
                ]
            },
            {
                chatID: 23,
                speaker: "stormy",
                text: "So, are you down?", l10nKey: "room.502.legacy.23.text",
                button: [
                    { chatID: 24, text: "Down?", l10nKey: "room.502.legacy.23.choice.0", callback: "" }
                ]
            },
            {
                chatID: 24,
                speaker: "zoey",
                text: "Mort de rire, hahaha. He is as you say, down. Pull down your pants and show her your appareil de chasteté. ", l10nKey: "room.502.legacy.24.text",
                button: [
                    { chatID: 25, text: "Sure", l10nKey: "room.502.legacy.24.choice.0", callback: "s2" }
                ]
            },
            {
                chatID: 25,
                speaker: "stormy",
                text: "I'm so wet right now! I've always wanted my own cuck, and you are such a cute cuck! Ever since you caught us " +
                    "I haven't been able to get it out of my mind. It's just so naughty! ", l10nKey: "room.502.legacy.25.text",
                button: [
                    { chatID: 26, text: "...", l10nKey: "room.502.legacy.25.choice.0", callback: "" }
                ]
            },
            {
                chatID: 26,
                speaker: "zoey",
                text: "You have caught me twice now, so what is a third time? ", l10nKey: "room.502.legacy.26.text",
                button: [
                    { chatID: 27, text: "...", l10nKey: "room.502.legacy.26.choice.0", callback: "" }
                ]
            },
            {
                chatID: 27,
                speaker: "stormy",
                text: "So, do you bring the handcuffs? ", l10nKey: "room.502.legacy.27.text",
                button: [
                    { chatID: 28, text: "I did [Hand them over]", l10nKey: "room.502.legacy.27.choice.0", callback: "s3" }
                ]
            },
            {
                chatID: 28,
                speaker: "stormy",
                text: "Come here my cuck!", l10nKey: "room.502.legacy.28.text",
                button: [
                    { chatID: 29, text: "Huh!", l10nKey: "room.502.legacy.28.choice.0", callback: "s4" }
                ]
            },
            {
                chatID: 29,
                speaker: "stormy",
                text: "I'm going to lock you up so you don't try anything.", l10nKey: "room.502.legacy.29.text",
                button: [
                    { chatID: 30, text: "Ouch, that hurts", l10nKey: "room.502.legacy.29.choice.0", callback: "s5" }
                ]
            },
            {
                chatID: 30,
                speaker: "stormy",
                text: "Sooo... What should we start with first?", l10nKey: "room.502.legacy.30.text",
                button: [
                    { chatID: 31, text: "...", l10nKey: "room.502.legacy.30.choice.0", callback: "" }
                ]
            },
            {
                chatID: 31,
                speaker: "zoey",
                text: "Tu sais ce que je veux.", l10nKey: "room.502.legacy.31.text",
                button: [
                    { chatID: 32, text: "...", l10nKey: "room.502.legacy.31.choice.0", callback: "s6" }
                ]
            },
            {
                chatID: 32,
                speaker: "stormy",
                text: "mmmMMMmmmmm slurp lick slobber", l10nKey: "room.502.legacy.32.text",
                button: [
                    { chatID: 33, text: "...", l10nKey: "room.502.legacy.32.choice.0", callback: "s7" }
                ]
            },
            {
                chatID: 33,
                speaker: "zoey",
                text: "ooOOOOOoooo fuck yes!", l10nKey: "room.502.legacy.33.text",
                button: [
                    { chatID: 34, text: "...", l10nKey: "room.502.legacy.33.choice.0", callback: "s8" }
                ]
            },
            {
                chatID: 34,
                speaker: "zoey",
                text: "Nom nom nom", l10nKey: "room.502.legacy.34.text",
                button: [
                    { chatID: 35, text: "...", l10nKey: "room.502.legacy.34.choice.0", callback: "s9" }
                ]
            },
            {
                chatID: 35,
                speaker: "stormy",
                text: "OOoooo yeah! You like what you see cuck!", l10nKey: "room.502.legacy.35.text",
                button: [
                    { chatID: 36, text: "...", l10nKey: "room.502.legacy.35.choice.0", callback: "s10" }
                ]
            },
            {
                chatID: 36,
                speaker: "stormy",
                text: "I love you way you lust after us. ", l10nKey: "room.502.legacy.36.text",
                button: [
                    { chatID: 37, text: "...", l10nKey: "room.502.legacy.36.choice.0", callback: "" }
                ]
            },
            {
                chatID: 37,
                speaker: "zoey",
                text: "I want to do the soixante-neuf again. I love that so much", l10nKey: "room.502.legacy.37.text",
                button: [
                    { chatID: 38, text: "...", l10nKey: "room.502.legacy.37.choice.0", callback: "s11" }
                ]
            },
            {
                chatID: 38,
                speaker: "stormy",
                text: "Oh fuck! Oh fuck, oh fuck, oh fuck. I'm going to cum again all over your face!", l10nKey: "room.502.legacy.38.text",
                button: [
                    { chatID: 39, text: "...", l10nKey: "room.502.legacy.38.choice.0", callback: "" }
                ]
            },
            {
                chatID: 39,
                speaker: "zoey",
                text: "Oh ouiiii. Je viens aussi. ", l10nKey: "room.502.legacy.39.text",
                button: [
                    { chatID: 40, text: "...", l10nKey: "room.502.legacy.39.choice.0", callback: "s12" }
                ]
            },
            {
                chatID: 40,
                speaker: "stormy",
                text: "Does our little cuck want a taste? I'll be you do. You can smell the sex coming from my pussy can't you. " + 
                    "just reach your tongue out and have a taste. ", l10nKey: "room.502.legacy.40.text",
                button: [
                    { chatID: 41, text: "[Try to lick her pussy]", l10nKey: "room.502.legacy.40.choice.0", callback: "s13" }
                ]
            },
            {
                chatID: 41,
                speaker: "zoey",
                text: "He has had enough. I'm going to free him. " + sc.n("me") + ", merci de nous faire plaisir. ", l10nKey: "room.502.legacy.41.text", l10nValues: { me: sc.n("me") },
                button: [
                    { chatID: 42, text: "Oh yeah, sure. ", l10nKey: "room.502.legacy.41.choice.0", callback: "" }
                ]
            },
            {
                chatID: 42,
                speaker: "zoey",
                text: "I will return the favor, but it is late and I am tired now. Good night everyone. ", l10nKey: "room.502.legacy.42.text",
                button: [
                    { chatID: -1, text: "Bonne nuit", l10nKey: "room.502.legacy.42.choice.0", callback: "s14" }
                ]
            },
        ];
        if (cArray.length > chatID && chatID > -1)
            return cArray[chatID];
        else
            return [];
    }
};

invoker.registerRoom(502, room502);

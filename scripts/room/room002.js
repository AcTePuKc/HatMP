//Girl GloryHole Broom
var room2 = {};

room2.main = function () {
    g.newLoad = false;
    $('#room_footer').hide();
    $('.menu-tab').show();
    $('.room-topper').hide();
    nav.killall();
    $('.room-left').hide();
    invoker.invokeCurrent("chatcatch", "init");

};

room2.btnclick = function (name) {
    if (name === "click") {
        nav.button({
            "type": "btn",
            "name": "click1",
            "left": 0,
            "top": 0,
            "width": 1920,
            "height": 1080,
            "image": "1_startScreen/chapter1.jpg"
        }, 2);
    }
    else if (name === "click1") {
        $('.room-left').show();
        $('#room_footer').show();
        $(".room-topper").show();
        $('.hide-start').show();
        char.room(7);
    }
};

room2.chatcatch = function (callback) {
    if (callback === "doit") {
        var charName = $('<div/>').text($('#room_002Name').val()).html().trim();
        var ma = $('<div/>').text($('#room_002ma').val()).html().trim();
        var sisRel = $('<div/>').text($('#room_002sa').val()).html().trim();
        var girlName = $('<div/>').text($('#room_002gn').val()).html().trim();
        var localizedGirlName = l10n.characterName("girlname", "Scarlett");

        sc.setcharname("landlord", ma);
        sc.setcharname("el", sisRel);
        sc.setcharname("me", charName.length === 0 ? "Alex" : charName);
        gv.set("girlname", girlName.length === 0 || girlName === localizedGirlName
            ? l10n.characterNameSource("girlname", "Scarlett")
            : girlName);
    }
    else if (callback === "proceed") {
        nav.button({
            "type": "btn",
            "name": "click1",
            "left": 0,
            "top": 0,
            "width": 1920,
            "height": 1080,
            "image": "1_startScreen/chapter1.jpg"
        }, 2);
    }
    else if (callback === "init") {
        function setupCharacterName(character) {
            if (character.name === "landlord")
                return l10n.characterTerm("landlady", "display", character.display, "Landlady");
            if (character.name === "el")
                return l10n.characterTerm("coTenant", "plural", character.display, "Co-Tenant");
            return l10n.characterName(character.name, character.display);
        }

        function sourceDefaultName(character) {
            if (character.name === "landlord")
                return "Landlady";
            if (character.name === "el")
                return "Co-Tenant";
            return l10n.characterNameSource(character.name, character.display);
        }

        function defaultCharacterName(character) {
            var sourceName = sourceDefaultName(character);
            if (character.name === "landlord")
                return l10n.characterTerm("landlady", "display", sourceName, sourceName);
            if (character.name === "el")
                return l10n.characterTerm("coTenant", "plural", sourceName, sourceName);
            return l10n.characterName(character.name, sourceName);
        }

        function savedCharacterName(character, value) {
            var localizedDefault = defaultCharacterName(character);
            return value === localizedDefault ? sourceDefaultName(character) : value;
        }

        function defaultCoTenantPlural() {
            return l10n.characterTerm("coTenant", "plural", "Co-Tenant", "Co-Tenant");
        }

        function defaultCoTenantSingular() {
            return l10n.characterTerm("coTenant", "singular", "Co-Tenant", "Co-Tenant");
        }

        function setupCoTenantSingular() {
            var singular = sc.get("el").singularDisplay || "Co-Tenant";
            return l10n.characterTerm("coTenant", "singular", singular, "Co-Tenant");
        }

        function savedCoTenantSingular(value) {
            var localizedDefault = defaultCoTenantSingular();
            return value === localizedDefault ? "Co-Tenant" : value;
        }

        function defaultGirlName() {
            return l10n.characterName("girlname", "Scarlett");
        }

        function savedGirlName(value) {
            return value === defaultGirlName()
                ? l10n.characterNameSource("girlname", "Scarlett")
                : value;
        }

        var tempLine = '<div class="intro-wrapper"><div style="height:' + (800 * g.ratio) + 'px;" class="intro-wrapper-sub">' +
            '<div class="intro-wrapper-full"><div class="intro-wrapper-left"><img src="images/speaker/me.png"/></div><div class="intro-wrapper-right">' + l10n.t("setup.playerName", "Your Name") + '<br /><input type="text" id="char_-1" data-name="-1" /></div></div>' +
            '<div class="intro-wrapper-full"><div class="intro-wrapper-left"><img src="images/speaker/me_girl.png"/></div><div class="intro-wrapper-right">' + l10n.t("setup.girlyName", "Girly Name") + '<br /><input type="text" id="room_002gn"/></div></div>' +
            '<div class="intro-wrapper-full"><div class="intro-wrapper-left"><img src="images/speaker/lolaEva.png"/></div><div class="intro-wrapper-right"><span id="room_002RelationshipLabel">' + l10n.t("setup.relationship", "Relationship with {lola} and {eva}", { lola: sc.n('lola'), eva: sc.n('eva') }) + '</span><br /><input type="text" id="room_002sa"/><br />' + l10n.t("setup.relationshipSingular", "What do you call one of them?") + '<br /><input type="text" id="room_002saSingular"/><div id="room_002saError" role="alert"></div><details id="room_002RelationshipAdvanced"><summary>' + l10n.t("setup.relationshipAdvanced", "More grammatical forms (optional)") + '</summary><div id="room_002RelationshipForms"></div></details></div></div>';
            

        $.each(sc.char, function (i, v) {
            if (v.setName && v.name !== "me") {
                var addClass = v.name === "landlord" ? "" : " intro-hide";
                var relationshipPrompt = v.name === "landlord"
                    ? '<div>' + l10n.t("setup.landladyRelationship", "What do you call her?") + '</div>'
                    : "";
                var relationshipError = v.name === "landlord" ? '<div id="room_002landladyError" role="alert"></div>' : "";
                var landladyForms = v.name === "landlord"
                    ? '<details id="room_002LandladyAdvanced"><summary>' + l10n.t("setup.relationshipAdvanced", "More grammatical forms (optional)") + '</summary><div id="room_002LandladyFormFields"></div></details>'
                    : "";
                tempLine = tempLine.concat('<div class="intro-wrapper-full' + addClass + '"><div class="intro-wrapper-left"><img src="images/speaker/' + sc.char[i].image + '"/></div><div class="intro-wrapper-right">' + relationshipPrompt + '<input class="room2-getName" type="text" id="char_' + i + '" data-name="' + i + '" />' + relationshipError + landladyForms + '</div></div>');
            }
        });

        tempLine = tempLine.concat('</div><div class="intro-wrapper-sub">' +
            '<button type="button" id="room_002SetAllNames">' + l10n.t("setup.viewAllNames", "View All Names") + '</button>' +
            '<button type="button" id="room_002ClearAllNames">' + l10n.t("setup.restoreNames", "Restore All Names") + '</button>' +
            '<div class="intro-difficulty">' +
            '<button class="intro-changeDiff" type="button" data-toggle="-1"> &lt; </button>' + 
            '<div id="intro_diff" data-diff="1">' + l10n.t("setup.difficulty.normal", "Normal") + '</div>' +
            '<button class="intro-changeDiff float-right" type="button" data-toggle="1"> &gt; </button></div>' + 
            '<section class="intro-preferences" aria-labelledby="room_002PreferencesTitle">' +
            '<h3 id="room_002PreferencesTitle">' + l10n.t("setup.preferences.title", "Optional preferences") + '</h3>' +
            '<div class="intro-preference-group"><div class="intro-preference-label">' + l10n.t("dialogue.mode", "Dialogue layout") + '</div>' +
            '<div class="intro-preference-options" data-setting="dialogueMode" role="group" aria-label="' + l10n.t("dialogue.mode", "Dialogue layout") + '">' +
            '<button type="button" class="intro-preference-option" data-value="classic" aria-pressed="false">' + l10n.t("dialogue.classic", "Classic") + '</button>' +
            '<button type="button" class="intro-preference-option" data-value="enhanced" aria-pressed="false">' + l10n.t("dialogue.enhanced", "Enhanced") + '</button></div></div>' +
            '<div class="intro-preference-group"><div class="intro-preference-label">' + l10n.t("setup.preferences.clock", "Clock format") + '</div>' +
            '<div class="intro-preference-options" data-setting="clock24" role="group" aria-label="' + l10n.t("setup.preferences.clock", "Clock format") + '">' +
            '<button type="button" class="intro-preference-option" data-value="12" aria-pressed="false">' + l10n.t("phone.settings.option.clock12", "12 Hour Clock") + '</button>' +
            '<button type="button" class="intro-preference-option" data-value="24" aria-pressed="false">' + l10n.t("phone.settings.option.clock24", "24 Hour Clock") + '</button></div></div>' +
            '<div class="intro-preference-group"><div class="intro-preference-label">' + l10n.t("setup.preferences.pronouns", "Narration pronouns") + '</div>' +
            '<div class="intro-preference-options intro-pronoun-options" data-setting="pronouns" role="group" aria-label="' + l10n.t("setup.preferences.pronouns", "Narration pronouns") + '">' +
            '<button type="button" class="intro-preference-option" data-value="m" aria-pressed="false">' + l10n.t("phone.settings.option.masculine", "Masculine") + '</button>' +
            '<button type="button" class="intro-preference-option" data-value="f" aria-pressed="false">' + l10n.t("phone.settings.option.feminine", "Feminine") + '</button>' +
            '<button type="button" class="intro-preference-option" data-value="a" aria-pressed="false">' + l10n.t("phone.settings.option.appearance", "Appearance") + '</button></div></div>' +
            '<p>' + l10n.t("setup.preferences.help", "Appearance follows your character’s current look. You can change these preferences later in Phone Settings.") + '</p>' +
            '</section>' +
            '<button type="button" id="room_002SetName">' + l10n.t("setup.saveNamesStart", "Save Names and Start") + '</button>');

        $('#room-buttons').html(tempLine + "</div>");
        var relationshipFormDefaults = {};
        var relationshipFormManual = {};
        var relationshipHasLocalizedDefaults =
            setupCharacterName(sc.get("el")) === defaultCoTenantPlural() &&
            setupCoTenantSingular() === defaultCoTenantSingular();
        l10n.characterTermForms("coTenant").forEach(function (form) {
            relationshipFormDefaults[form.id] = form.suggested;
            var label = l10n.t("relationship.form." + form.id, form.label);
            var helpKey = form.id === "singularDefinite"
                ? "phone.relationshipTerms.singularDefiniteHelp"
                : "phone.relationshipTerms.pluralDefiniteHelp";
            var help = l10n.t(helpKey, "Enter the form used in dialogue.");
            var value = sc.get("el").relationshipForms && sc.get("el").relationshipForms[form.id];
            relationshipFormManual[form.id] = typeof value === "string";
            if (typeof value !== "string") value = relationshipHasLocalizedDefaults ? form.suggested : "";
            var field = $('<label class="intro-relationship-extra"></label>').text(label + " ").attr("title", help);
            $('<input type="text" maxlength="80" autocomplete="off" />')
                .attr("id", "room_002RelationshipForm_" + form.id)
                .attr("title", help)
                .val(value).appendTo(field);
            $('#room_002RelationshipForms').append(field);
            field.find("input").on("input", function () { relationshipFormManual[form.id] = true; });
        });
        if (!l10n.characterTermForms("coTenant").length)
            $('#room_002RelationshipAdvanced').hide();
        var landladyFormDefaults = {};
        var landladyFormManual = {};
        var landladyUsesLocalizedDefault = setupCharacterName(sc.get("landlord")) === defaultCharacterName(sc.get("landlord"));
        l10n.characterTermForms("landlady").forEach(function (form) {
            landladyFormDefaults[form.id] = form.suggested;
            var value = sc.get("landlord").relationshipForms && sc.get("landlord").relationshipForms[form.id];
            landladyFormManual[form.id] = typeof value === "string";
            if (typeof value !== "string") value = landladyUsesLocalizedDefault ? form.suggested : "";
            var field = $('<label class="intro-relationship-extra"></label>')
                .text(l10n.t("relationship.form." + form.id, form.label) + " ");
            $('<input type="text" maxlength="80" autocomplete="off" />')
                .attr("id", "room_002LandladyForm_" + form.id)
                .attr("title", l10n.t("setup.landladyRelationshipHelp", "Enter the form used in dialogue."))
                .val(value).appendTo(field);
            $('#room_002LandladyFormFields').append(field);
            field.find("input").on("input", function () { landladyFormManual[form.id] = true; });
        });
        if (!l10n.characterTermForms("landlady").length)
            $('#room_002LandladyAdvanced').hide();
        function selectIntroPreference(setting, value) {
            $('.intro-preference-options[data-setting="' + setting + '"] .intro-preference-option').each(function () {
                var active = String($(this).attr('data-value')) === String(value);
                $(this).toggleClass('active', active).attr('aria-pressed', active ? 'true' : 'false');
            });
        }

        $('.intro-preference-option').on('click', function () {
            var group = $(this).closest('.intro-preference-options');
            var setting = group.attr('data-setting');
            var value = $(this).attr('data-value');
            selectIntroPreference(setting, value);
            if (setting === "dialogueMode" && typeof dialogue !== "undefined")
                dialogue.setPreferences({ mode: value });
        });

        selectIntroPreference("clock24", gv.get("clock24") === "24" ? "24" : "12");
        var currentPronouns = gv.get("pronouns");
        selectIntroPreference("pronouns", currentPronouns === "m" || currentPronouns === "f" ? currentPronouns : "a");
        var currentDialogueMode = typeof dialogue !== "undefined" ? dialogue.getPreferences().mode : "enhanced";
        selectIntroPreference("dialogueMode", currentDialogueMode);

        $('#char_' + sc.i("landlord")).attr("title",
            l10n.t("setup.landladyRelationshipHelp",
                "Enter the word or form of address you want used for her (for example, Landlady, Ma’am, or her name). The game can adjust capitalization, but not grammatical forms, so choose a form that reads naturally in sentences."));

        $('#char_-1').val($("<textarea/>").html(sc.n("me")).val());
        $.each(sc.char, function (i, v) {
            $('#char_' + i).val($("<textarea/>").html(setupCharacterName(v)).val());
        });

        $('#room_002sa').val($("<textarea/>").html(setupCharacterName(sc.get("el"))).val());
        $('#room_002saSingular').val($("<textarea/>").html(setupCoTenantSingular()).val());
        $('#room_002gn').val($("<textarea/>").html(l10n.characterName("girlname", gv.get("girlname"))).val());

        function refreshRelationshipLabel() {
            function currentDisplayName(name) {
                var index = sc.char.findIndex(function (character) { return character.name === name; });
                var input = index >= 0 ? $('#char_' + index) : $();
                var value = input.length ? String(input.val()).trim() : "";
                return value || sc.n(name);
            }

            var currentLola = currentDisplayName("lola");
            var currentEva = currentDisplayName("eva");
            $('#room_002RelationshipLabel').html(l10n.t("setup.relationship", "Relationship with {lola} and {eva}", {
                lola: currentLola,
                eva: currentEva
            }));
            $('#room_002sa, #room_002saSingular').attr("title",
                l10n.t("setup.relationshipHelp",
                    "The first field is the plural form for both {lola} and {eva}; the second is the singular form for one of them. Lowercase is fine. The game can adjust capitalization, but cannot infer grammatical forms.", {
                        lola: currentLola,
                        eva: currentEva
                    }));
        }

        $('.room2-getName').on('input change', refreshRelationshipLabel);
        refreshRelationshipLabel();
        var singularEdited = setupCoTenantSingular() !== defaultCoTenantSingular();
        function suggestedCoTenantSingular(plural) {
            if (l10n.getLanguage() !== "bg") return "";
            var word = String(plural || "").trim();
            if (!/^[а-яѝ]+$/.test(word)) return "";
            if (word.endsWith("ки")) return word.slice(0, -2) + "ка";
            if (word.endsWith("тели")) return word.slice(0, -1);
            return "";
        }
        function refreshOptionalRelationshipForms(pluralChanged) {
            var plural = String($('#room_002sa').val()).trim();
            var singularInput = $('#room_002saSingular');
            if (pluralChanged && !singularEdited)
                singularInput.val(plural === defaultCoTenantPlural()
                    ? defaultCoTenantSingular() : suggestedCoTenantSingular(plural));
            var singular = String(singularInput.val()).trim();
            l10n.characterTermForms("coTenant").forEach(function (form) {
                var input = $('#room_002RelationshipForm_' + form.id);
                if (relationshipFormManual[form.id]) return;
                var base = form.id === "pluralDefinite" ? plural : singular;
                var defaultBase = form.id === "pluralDefinite" ? defaultCoTenantPlural() : defaultCoTenantSingular();
                input.val(base === defaultBase ? form.suggested :
                    l10n.getLanguage() === "bg" ? phone.suggestBulgarianDefinite(base, form.id === "pluralDefinite") : "");
            });
            var landlordInput = $('#char_' + sc.i("landlord"));
            var landladyUsesDefault = landlordInput.val() === defaultCharacterName(sc.get("landlord"));
            l10n.characterTermForms("landlady").forEach(function (form) {
                var input = $('#room_002LandladyForm_' + form.id);
                if (landladyFormManual[form.id]) return;
                input.val(landladyUsesDefault ? form.suggested : l10n.getLanguage() === "bg"
                    ? form.id === "vocative" ? sc.suggestBulgarianVocative(landlordInput.val())
                        : phone.suggestBulgarianDefinite(landlordInput.val(), false)
                    : "");
            });
        }
        refreshOptionalRelationshipForms($('#room_002sa').val() !== defaultCoTenantPlural());
        $('#char_' + sc.i("landlord")).on('input change', function () {
            $('#room_002landladyError').text("");
            refreshOptionalRelationshipForms();
        });

        $('#room_002sa').on('input change', function () {
            $('#room_002saError').text("");
            refreshOptionalRelationshipForms(true);
        });
        $('#room_002saSingular').on('input change', function () {
            singularEdited = true;
            refreshOptionalRelationshipForms();
        });
        
        $('.intro-changeDiff').on('click', function () {
            var currentDiff = parseInt($('#intro_diff').data('diff'));
            var changeDiff = parseInt($(this).data('toggle'));
            currentDiff = currentDiff + changeDiff;
            if (currentDiff > 2)
                currentDiff = 2;
            if (currentDiff < 0)
                currentDiff = 0;
            $('#intro_diff').data('diff', currentDiff);
            switch (currentDiff) {
                case 0:
                    $('#intro_diff').text(l10n.t("setup.difficulty.easy", "Easy - Like Sunday Morning"));
                    break;
                case 1:
                    $('#intro_diff').text(l10n.t("setup.difficulty.normal", "Normal"));
                    break;
                case 2:
                    $('#intro_diff').text(l10n.t("setup.difficulty.hard", "Hard.. heheh you said 'hard'"));
                    break;
                default:
                    $('#intro_diff').text(l10n.t("setup.difficulty.error", "ERROR"));
                    break;
            }
        });

        $('#room_002SetAllNames').on('click', function () {
            if ($('.intro-hide').first().is(":visible")) {
                $('.intro-hide').slideUp("fast");
                $('#room_002SetAllNames').text(l10n.t("setup.viewAllNames", "View All Names"));
            }
            else {
                $('.intro-hide').slideDown("fast");
                $('#room_002SetAllNames').text(l10n.t("setup.hideNames", "Hide Names"));
            }
            refreshRelationshipLabel();
        });

        $('#room_002ClearAllNames').on('click', function () {
            $.each(g.char, function (i, v) {
                $('#char_' + i).val($("<textarea/>").html(defaultCharacterName(v)).val());
            });

            $('#char_-1').val($("<textarea/>").html(sc.n("me")).val());
            $('#room_002sa').val($("<textarea/>").html(defaultCoTenantPlural()).val());
            $('#room_002saSingular').val($("<textarea/>").html(defaultCoTenantSingular()).val());
            singularEdited = false;
            l10n.characterTermForms("coTenant").forEach(function (form) {
                relationshipFormManual[form.id] = false;
                $('#room_002RelationshipForm_' + form.id).val(form.suggested);
            });
            l10n.characterTermForms("landlady").forEach(function (form) {
                landladyFormManual[form.id] = false;
                $('#room_002LandladyForm_' + form.id).val(form.suggested);
            });
            $('#room_002gn').val($("<textarea/>").html(defaultGirlName()).val());
            $('#room_002landladyError').text("");
            $('#room_002saError').text("");
            refreshRelationshipLabel();
            refreshOptionalRelationshipForms();
        });

        $("#room_002SetName").on('click', function () {
            var landladyValue = g.cleanText($('#char_' + sc.i("landlord")).val());
            var coTenantPlural = g.cleanText($('#room_002sa').val());
            var coTenantSingular = g.cleanText($('#room_002saSingular').val());
            if (landladyValue.length === 0) {
                $('#room_002landladyError').text(l10n.t("setup.landladyRequired", "Enter what you call her."));
                return;
            }
            $('#room_002landladyError').text("");
            if (coTenantPlural.length === 0 || coTenantSingular.length === 0) {
                $('#room_002saError').text(l10n.t("setup.relationshipFormsRequired", "Enter both the plural and singular forms."));
                return;
            }
            $('#room_002saError').text("");

            $(".rl-change").show();
            $('.room2-getName').each(function () {
                var entry = $(this).data('name');
                sc.char[entry].display = savedCharacterName(sc.char[entry], g.cleanText($(this).val()));
            });

            sc.setcharname("me", g.cleanText($('#char_-1').val()));
            sc.setcharname("el", savedCharacterName(sc.get("el"), coTenantPlural));
            sc.get("el").singularDisplay = savedCoTenantSingular(coTenantSingular);
            var relationshipForms = {};
            l10n.characterTermForms("coTenant").forEach(function (form) {
                var value = g.cleanText($('#room_002RelationshipForm_' + form.id).val() || "").trim();
                var defaultValue = relationshipFormDefaults[form.id];
                if (value && value !== defaultValue)
                    relationshipForms[form.id] = value;
            });
            sc.get("el").relationshipForms = relationshipForms;
            var landladyForms = {};
            l10n.characterTermForms("landlady").forEach(function (form) {
                var value = g.cleanText($('#room_002LandladyForm_' + form.id).val() || "").trim();
                if (value && value !== landladyFormDefaults[form.id])
                    landladyForms[form.id] = value;
            });
            sc.get("landlord").relationshipForms = landladyForms;
            gv.set("girlname", savedGirlName(g.cleanText($('#room_002gn').val())));

            var thisDiff = parseInt($("#intro_diff").data('diff'));
            gv.set("difficulty", isNaN(thisDiff) ? 1 : ((thisDiff < 0) ? 0 : ((thisDiff > 2) ? 2 : thisDiff)));
            var selectedClockFormat = $('.intro-preference-options[data-setting="clock24"] .active').attr('data-value');
            gv.set("clock24", selectedClockFormat === "24" ? "24" : "12");
            var selectedPronouns = $('.intro-preference-options[data-setting="pronouns"] .active').attr('data-value');
            gv.set("pronouns", selectedPronouns === "m" || selectedPronouns === "f" ? selectedPronouns : "a");
            nav.killall();
            nav.button({
                "type": "img",
                "name": "click",
                "left": 0,
                "top": 0,
                "width": 1920,
                "height": 1080,
                "image": "1_startScreen/help.jpg"
            }, 2);
            chat(0, 2);
            //$('#room_002Start').click(function () {
            //    $('.room-left').show();
            //    $('#room_footer').show();
            //    $(".room-topper").show();
            //    $('.hide-start').show();
            //    char.room(7);
            //});

        });
    }
};

room2.chat = function(chatID){
    var cArray = [
        {
            chatID: 0,
            speaker: "thinking",
            l10nKey: "release.notice.body",
            text: "This release ends after the Sissy School final.",
            button: [
                { chatID: -1, l10nKey: "release.notice.continue", text: "Next release around October", callback: "proceed" }
            ]
        },
    ];
    if (cArray.length > chatID && chatID > -1)
        return cArray[chatID];
    else
        return [];
};

invoker.registerRoom(2, room2);

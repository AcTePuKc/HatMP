var privateChat = {};

privateChat.skipTimer = null;
privateChat.currentEntry = null;

// Zoe's French is part of her voice. These translations are independent of the glossary.
privateChat.frenchPhrases = [
    [/Elle s['’]excuse auprès de ma chatte/gi, 'excuse', 'She is apologizing to my pussy'],
    [/quand une personne est ivre, elle a la langue bien pendue/gi, 'drunk', 'When someone is drunk, their tongue loosens'],
    [/merci de nous faire plaisir/gi, 'pleasure', 'Thank you for giving us pleasure'],
    [/Ma maison est ta maison/gi, 'house', 'My home is your home'],
    [/ma foufoune/gi, 'myPussy', 'my pussy'],
    [/une zouz/gi, 'girl', 'a girl'],
    [/Oh là là/gi, 'ohLaLa', 'Oh my'],
    [/Mon dieu/gi, 'myGod', 'My God'],
    [/Au revoir/gi, 'goodbye', 'Goodbye'],
    [/Bonjour/gi, 'hello', 'Hello'],
    [/Arrête/gi, 'stop', 'Stop'],
    [/Merci/gi, 'thanks', 'Thank you'],
    [/\bfoufoune\b/gi, 'pussy', 'pussy'],
    [/\bfini\b/gi, 'finished', 'finished'],
    [/\boui\b/gi, 'yes', 'yes']
];

privateChat.addFrenchTranslations = function (entry, roomID) {
    if (String(entry.speaker).toLowerCase() !== 'zoey' || [500, 501, 502, 526].indexOf(Number(roomID)) === -1) return;
    var root = document.getElementById('room_footerSpeach');
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [], node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(function (textNode) {
        var text = textNode.nodeValue, matches = [];
        privateChat.frenchPhrases.forEach(function (phrase) {
            phrase[0].lastIndex = 0;
            var match;
            while ((match = phrase[0].exec(text))) matches.push({ start: match.index, end: match.index + match[0].length, phrase: phrase });
        });
        matches.sort(function (a, b) { return a.start - b.start || b.end - a.end; });
        if (!matches.length) return;
        var fragment = document.createDocumentFragment(), offset = 0;
        matches.forEach(function (match) {
            if (match.start < offset) return;
            fragment.appendChild(document.createTextNode(text.slice(offset, match.start)));
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'french-phrase';
            button.lang = 'fr';
            button.textContent = text.slice(match.start, match.end);
            button.setAttribute('aria-expanded', 'false');
            button.dataset.translation = l10n.t('french.' + match.phrase[1], match.phrase[2]);
            fragment.appendChild(button);
            offset = match.end;
        });
        fragment.appendChild(document.createTextNode(text.slice(offset)));
        textNode.replaceWith(fragment);
    });
};

privateChat.closeFrenchTranslation = function () {
    $('.french-phrase[aria-expanded="true"]').attr('aria-expanded', 'false').removeAttr('aria-describedby');
    $('.french-translation').remove();
};

privateChat.showFrenchTranslation = function (button) {
    privateChat.closeFrenchTranslation();
    $('.french-phrase').not(button).data('pinned', false);
    var tip = document.createElement('span');
    tip.className = 'french-translation';
    tip.id = 'french-translation-current';
    tip.setAttribute('role', 'tooltip');
    tip.lang = l10n.getLanguage();
    tip.textContent = button.dataset.translation;
    button.after(tip);
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-describedby', tip.id);
};

$(document).on('mouseenter focusin', '.french-phrase', function () {
    if (this.getAttribute('aria-expanded') !== 'true') privateChat.showFrenchTranslation(this);
}).on('mouseleave focusout', '.french-phrase', function () {
    if (!$(this).data('pinned') && !$(this).is(':focus') && !$(this).is(':hover')) privateChat.closeFrenchTranslation();
}).on('click', '.french-phrase', function (event) {
    event.stopPropagation();
    var pinned = !$(this).data('pinned');
    $('.french-phrase').data('pinned', false);
    $(this).data('pinned', pinned);
    if (pinned) { privateChat.stopSkipping(); privateChat.showFrenchTranslation(this); }
    else privateChat.closeFrenchTranslation();
}).on('click', function (event) {
    if (!$(event.target).closest('.french-phrase, .french-translation').length) {
        $('.french-phrase').data('pinned', false);
        privateChat.closeFrenchTranslation();
    }
}).on('keydown', '.french-phrase', function (event) {
    if (event.key === 'Escape') {
        $(this).data('pinned', false);
        privateChat.closeFrenchTranslation();
        event.stopPropagation();
    }
});

privateChat.stopSkipping = function () {
    clearTimeout(privateChat.skipTimer);
    privateChat.skipTimer = null;
    g.skipChat = false;
};

privateChat.resetButtons = function () {
    $('.room-chatBtnClick').html('').hide().data('chatid', 0).data('roomid', 0).data('callback', '');
};

privateChat.hideOverlay = function () {
    privateChat.stopSkipping();
    if (typeof dialogue !== "undefined") dialogue.show(false);
    privateChat.currentEntry = null;
    $('#room_chatOverlay').hide();
    $('#room_footerSpeach').html("");
    $('#room_chatSpeaker').html('');
    $('#room_footer').show();
};

privateChat.close = function () {
    privateChat.hideOverlay();
    privateChat.resetButtons();
    g.skipChat = false;
};

privateChat.setButton = function (index, text, chatID, roomID, callback, language) {
    $('#room_chatBtn' + index)
        .html('<span class="dialogue-shortcut" aria-hidden="true">' + (index + 1) + '</span><span class="dialogue-choice-label">' + text + '</span>')
        .data('chatid', chatID)
        .data('roomid', roomID)
        .data('callback', callback)
        .attr('title', l10n.t('dialogue.shortcut', 'Shortcut: {number}', { number: index + 1 }))
        .attr('lang', language || l10n.getLanguage())
        .show();
};

privateChat.updateSkipButton = function (buttonCount) {
    clearTimeout(privateChat.skipTimer);
    $("#room_chatskip").toggle(buttonCount === 1);
    if (g.skipChat && buttonCount === 1) {
        privateChat.skipTimer = setTimeout(function () {
            privateChat.skipChat();
        }, 100);
    }
    else if (buttonCount !== 1) privateChat.stopSkipping();
};

privateChat.visibleButtons = function () {
    if (typeof dialogue !== "undefined" && dialogue.isHidden()) return $();
    return $('.room-chatBtnClick:visible');
};

privateChat.selectButtonByIndex = function (index) {
    var buttons = privateChat.visibleButtons();
    if (index < 0 || index >= buttons.length)
        return false;

    buttons.eq(index).trigger('click');
    return true;
};

privateChat.getShortcutIndexFromEvent = function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
        return null;

    if (e.which >= 49 && e.which <= 57)
        return e.which - 49;

    if (e.which >= 97 && e.which <= 105)
        return e.which - 97;

    if (e.code && e.code.startsWith("Digit")) {
        var digitIndex = parseInt(e.code.replace("Digit", ""), 10) - 1;
        return digitIndex >= 0 && digitIndex < 9 ? digitIndex : null;
    }

    if (e.code && e.code.startsWith("Numpad")) {
        var numpadIndex = parseInt(e.code.replace("Numpad", ""), 10) - 1;
        return numpadIndex >= 0 && numpadIndex < 9 ? numpadIndex : null;
    }

    return null;
};

privateChat.isTypingTarget = function (target) {
    if (!target)
        return false;

    var tagName = target.tagName ? target.tagName.toLowerCase() : "";
    return tagName === "input" || tagName === "textarea" || tagName === "select" || target.isContentEditable;
};

privateChat.canHandleSpace = function (target) {
    return $('#room_chatOverlay').is(":visible") &&
        !$('#room_export').is(":visible") &&
        !(typeof dialogue !== "undefined" && (dialogue.isOpen() || dialogue.isHidden())) &&
        !$(target).closest('button, a, summary').length &&
        !privateChat.isTypingTarget(target);
};

function chat(chatID, roomID) {

    if (chatID !== -1) {
        privateChat.makeChat(invoker.invoke(roomID, "chat", chatID), chatID, roomID);
    }
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
    else if (document.selection) {
        document.selection.empty();
    }
}

privateChat.kill = function(){
    privateChat.hideOverlay();
    privateChat.resetButtons();
};

privateChat.makeChat = function (entry, chatID, roomID, record) {
    if (entry !== null) {
        clearTimeout(privateChat.skipTimer);
        privateChat.currentEntry = { entry: entry, chatID: chatID, roomID: roomID };
        entry = l10n.chatEntry(entry, chatID, roomID);
        var thisSpeaker = privateChat.speakerInfo(entry.speaker);
        $('#room_footer').hide();
        if (!$('#room_chatOverlay').is(":visible")) {
            $('#room_chatOverlay').show();
            //$('#char_charDisplay').hide();
        }
        var counter = 0;
        privateChat.resetButtons();
        $('#room_footerSpeach').html(entry.text).attr('lang', entry.textLanguage || l10n.getLanguage());
        if (entry.text && entry.text.indexOf("data-glossary-id") !== -1)
            l10n.applyGlossaryMarkup(document.getElementById("room_footerSpeach"));
        $('#room_chatSpeaker').html('<img src="' + thisSpeaker.img + '" /><br/>' + (thisSpeaker.name === "Random" ? "" : thisSpeaker.name));
        if (entry.button.length === 0) {
            privateChat.setButton(0, l10n.t("chat.button.close", "Close"), -1, roomID, '');
            counter = 1;
        }
        else {
            $.each(entry.button, function (i, v) {
                privateChat.setButton(i, v.text, v.chatID, roomID, v.callback, v.textLanguage);
                counter++;
            });
        }
        counter = (counter === 0 ? counter = 1 : counter);
        $('.room-chatBtn').css('width', (100 / counter) + '%');
        privateChat.updateSkipButton(counter);
        if (typeof dialogue !== "undefined") dialogue.onEntry(entry, thisSpeaker, record);
        else $('.room-chatBox').scrollTop(0);
        privateChat.addFrenchTranslations(entry, roomID);
    }
    else {
        g.error("chat", "chatID:" + chatID + " roomID: " + roomID);
        $('#room_footer').show();
    }
}

privateChat.refreshLanguage = function () {
    var current = privateChat.currentEntry;
    if (!current || !$('#room_chatOverlay').is(":visible")) return;
    privateChat.stopSkipping();
    // Re-render the captured entry, never invoke a room's chat handler twice.
    privateChat.makeChat(current.entry, current.chatID, current.roomID, false);
};

privateChat.images = function (charName) {
    charName = charName.toLowerCase();
    for (var i = 0; i < sc.char.length; i++) {
        if (sc.char[i].name === charName) {
            return "./images/speaker/" + sc.char[i].image;
        }
    }
    return "";
};

privateChat.speakerInfo = function (charName) {
    charName = charName.toLowerCase();
    if (charName[0] === "!") {
        var getTrivial = sc.trivial(charName);
        return {
            img: "./images/speaker/trivial/" + getTrivial.image,
            name: sc.n(charName)
        };
    }
    else if (charName[0] === "*") {
        return {
            img: "./images/room/1004_rape" + rape.char.chat,
            name: rape.char.displayName
        };
    }
    else {
        for (var i = 0; i < sc.char.length; i++) {
            if (sc.char[i].name === charName) {
                if (charName === "me" && g.roomID > 175 && g.roomID < 250 && sissy.st[9].ach) {
                    return {
                        img: "./images/speaker/" + sc.char[i].image,
                        name: "Sissy Trainee"
                    };
                }
                else {
                    return {
                        img: "./images/speaker/" + sc.char[i].image,
                        name: charName === "thinking" ? l10n.t("speaker.thinking", "Thinking") : sc.n(charName)
                    };
                }
            }
        }
        return {
            img: "./images/speaker/rand.png", name: ""
        };
    }
};

privateChat.skipChat = function () {
    if (typeof dialogue !== "undefined" && (dialogue.isOpen() || dialogue.isHidden())) {
        privateChat.stopSkipping();
        return;
    }
    var buttons = privateChat.visibleButtons();
    if (buttons.length === 1) {
        buttons.eq(0).trigger('click');
    }
    else if (buttons.length > 1) {
        g.skipChat = false;
    }
};

$(document).ready(function () {
    $(document).on('keydown', function (e) {
        if (e.repeat || (e.originalEvent && e.originalEvent.repeat)) {
            if (privateChat.canHandleSpace(e.target) && (e.which === 32 || privateChat.getShortcutIndexFromEvent(e) !== null))
                e.preventDefault();
            return;
        }
        if (e.which === 32) {//space bar
            if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
            if (!privateChat.canHandleSpace(e.target))
                return;

            if (privateChat.visibleButtons().length === 1) {
                g.suppressSpaceAdvanceKeyup = true;
                e.preventDefault();
                privateChat.skipChat();
            }
        }

        var shortcutIndex = privateChat.getShortcutIndexFromEvent(e);
        if (shortcutIndex === null)
            return;
        if (!privateChat.canHandleSpace(e.target))
            return;

        if (shortcutIndex < privateChat.visibleButtons().length) {
            g.suppressChatChoiceKeyup = true;
            privateChat.selectButtonByIndex(shortcutIndex);
            e.preventDefault();
        }
    });

    $(document).on('keyup', function (e) {
        if (e.which === 32) {//space bar
            if (!privateChat.canHandleSpace(e.target))
                return;

            if (privateChat.visibleButtons().length === 1)
                e.preventDefault();
        }
        else if (privateChat.getShortcutIndexFromEvent(e) !== null) {
            if (privateChat.canHandleSpace(e.target))
                e.preventDefault();
        }
        else if(e.which === 83){
            if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && privateChat.canHandleSpace(e.target) && $("#room_chatskip").is(":visible")) {
                if (g.skipChat) {
                    privateChat.stopSkipping();
                }
                else {
                    g.skipChat = true;
                    privateChat.skipChat();
                }
            }
        }
    });

    $("#room_chatskip").on('click', function () {
        g.skipChat = true;
        privateChat.skipChat();
    });

    $('.room-chatBtnClick').on('click', function () {
        if (typeof dialogue !== "undefined" && (dialogue.isHidden() || dialogue.isOpen())) return;
        var roomID = $(this).data('roomid');
        var chatID = $(this).data('chatid');
        var callback = $(this).data('callback');

        if (chatID < 0) {
            privateChat.close();
            //$('#char_charDisplay').show();
        }
        else
            chat(chatID, roomID);
        if (callback !== '')
            invoker.invoke(roomID, "chatcatch", callback);

    });
});

/* Reading preferences and presentation shared by both dialogue layouts. */
var dialogue = (function () {
    var defaults = { mode: "enhanced", size: 100, opacity: 85, spacing: "comfortable" };
    var preferences = Object.assign({}, defaults);
    var storageKey = "hatmp.dialogue";
    var history = [];
    var box, reader, actions, more, modal, content, heading, closeButton, overlay, revealButton;
    var hideButton, skipButton, historyButton, settingsButton, settingsGear, toolbar;
    var utilityLeft, utilityRight;
    var hidden = false;
    var returnFocus = null;
    var currentPage = "settings";
    var frame = 0;

    function normalize(value) {
        value = value && typeof value === "object" ? value : {};
        return {
            mode: value.mode === "classic" ? "classic" : "enhanced",
            size: [85, 100, 115, 130, 150].includes(Number(value.size)) ? Number(value.size) : 100,
            opacity: [65, 75, 85, 95, 100].includes(Number(value.opacity)) ? Number(value.opacity) : 85,
            spacing: value.spacing === "compact" ? "compact" : "comfortable"
        };
    }
    try { preferences = normalize(JSON.parse(localStorage.getItem(storageKey))); }
    catch (error) { /* Reading controls also work without storage. */ }

    function t(key, fallback) { return l10n.t("dialogue." + key, fallback); }
    function element(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }
    function button(key, fallback, action) {
        var node = element("button", "dialogue-control", t(key, fallback));
        node.type = "button";
        node.dataset.l10n = "dialogue." + key;
        node.addEventListener("click", action);
        return node;
    }
    function pageNavigation() {
        var navigation = element("nav", "dialogue-page-nav");
        navigation.dataset.l10nAriaLabel = "dialogue.navigation";
        navigation.setAttribute("aria-label", t("navigation", "Reading menu"));
        var settingsLink = button("settings", "Reading settings", function () { open("settings"); });
        var historyLink = button("history", "Recent dialogue", function () { open("history"); });
        navigation.append(settingsLink, historyLink);
        return navigation;
    }
    function setActionButtonView(node, key, label, symbol, compact) {
        if (!node) return;
        node.setAttribute("data-l10n-aria-label", "dialogue." + key);
        node.removeAttribute("data-l10n-title");
        node.removeAttribute("title");
        node.setAttribute("aria-label", t(key, label));
        if (compact) {
            node.removeAttribute("data-l10n");
            var icon = element("span", "dialogue-icon-symbol", symbol);
            icon.setAttribute("aria-hidden", "true");
            var tooltip = element("span", "dialogue-icon-tooltip", t(key, label));
            tooltip.dataset.l10n = "dialogue." + key;
            tooltip.setAttribute("aria-hidden", "true");
            node.replaceChildren(icon, tooltip);
        }
        else {
            node.dataset.l10n = "dialogue." + key;
            node.textContent = t(key, label);
        }
    }
    function isOpen() { return !!(modal && modal.open); }

    function show(focus) {
        if (!box) return;
        hidden = false;
        delete overlay.dataset.dialogueHidden;
        box.inert = false;
        revealButton.hidden = true;
        if (focus !== false) hideButton.focus({ preventScroll: true });
    }
    function hide() {
        if (!box || !privateChat.currentEntry || isOpen()) return;
        privateChat.stopSkipping();
        hidden = true;
        overlay.dataset.dialogueHidden = "true";
        box.inert = true;
        revealButton.hidden = false;
        revealButton.focus({ preventScroll: true });
    }

    function apply() {
        if (!box) return;
        box.dataset.dialogueMode = preferences.mode;
        box.dataset.dialogueSpacing = preferences.spacing;
        box.style.setProperty("--reading-scale", preferences.size / 100);
        box.style.setProperty("--reading-opacity", preferences.opacity / 100);
        setActionButtonView(hideButton, "hide", "Hide dialogue", "◉", preferences.mode === "classic");
        setActionButtonView(skipButton, "skip", "Skip dialogue", ">>", preferences.mode === "classic");
        if (toolbar && utilityLeft && utilityRight) {
            if (preferences.mode === "classic") {
                toolbar.replaceChildren(historyButton, settingsButton);
                utilityLeft.replaceChildren(settingsGear);
                utilityRight.replaceChildren(hideButton, skipButton);
            }
            else {
                toolbar.replaceChildren(hideButton, skipButton, historyButton, settingsButton);
                utilityLeft.replaceChildren();
                utilityRight.replaceChildren();
            }
        }
        resize();
    }
    function setPreferences(value) {
        preferences = normalize(Object.assign({}, preferences, value));
        try { localStorage.setItem(storageKey, JSON.stringify(preferences)); }
        catch (error) { /* Keep the preference for this session. */ }
        apply();
    }

    function updateOverflow() {
        if (!reader) return;
        more.hidden = preferences.mode !== "enhanced" || reader.scrollHeight <= reader.clientHeight + reader.scrollTop + 2;
    }
    function resize() {
        if (!box) return;
        var choices = Array.from(actions.querySelectorAll(".room-chatBtnClick"))
            .filter(function (node) { return node.style.display !== "none"; });
        if (preferences.mode === "classic") {
            choices.forEach(function (node) {
                node.style.width = (100 / choices.length) + "%";
            });
        }
        else {
            choices.forEach(function (node) { node.style.removeProperty("width"); });
            // A longer sentence gets the entire row; all labels remain intact.
            choices.forEach(function (node) {
                node.classList.toggle("dialogue-choice-long", node.textContent.trim().length > 70);
            });
        }
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(updateOverflow);
    }

    function onEntry(entry, speaker, record) {
        if (!box) return;
        if (record !== false) show(false);
        reader.scrollTop = 0;
        box.scrollTop = 0;
        if (record !== false) {
            // Capture displayed text, never callbacks or re-evaluated room code.
            var text = document.getElementById("room_footerSpeach").cloneNode(true);
            text.querySelectorAll("br").forEach(function (node) { node.replaceWith(document.createTextNode("\n")); });
            text.querySelectorAll("p, div, li").forEach(function (node) { node.appendChild(document.createTextNode("\n")); });
            history.push({ speaker: speaker.name === "Random" ? "" : speaker.name,
                text: text.textContent, language: entry.textLanguage || l10n.getLanguage() });
            if (history.length > 80) history.shift();
        }
        resize();
    }

    function field(key, fallback, values) {
        var label = element("label", "dialogue-setting");
        label.appendChild(element("span", "", t(key, fallback)));
        var select = element("select");
        select.name = key;
        values.forEach(function (item) {
            var option = element("option", "", item[1]);
            option.value = item[0];
            select.appendChild(option);
        });
        select.value = preferences[key];
        select.addEventListener("change", function () {
            var update = {}; update[key] = select.value; setPreferences(update);
        });
        label.appendChild(select);
        content.appendChild(label);
    }
    function renderSettings() {
        heading.textContent = t("settings", "Reading settings");
        content.replaceChildren();
        content.appendChild(pageNavigation());
        field("mode", "Dialogue layout", [["enhanced", t("enhanced", "Enhanced")], ["classic", t("classic", "Classic")]]);
        content.appendChild(element("p", "dialogue-hint", t("modeHelp", "Enhanced keeps choices below the scrolling text. Classic keeps the original layout. Size applies to both; background and spacing apply to Enhanced.")));
        field("size", "Text size", [85, 100, 115, 130, 150].map(function (value) { return [value, value + "%"]; }));
        field("opacity", "Background opacity", [65, 75, 85, 95, 100].map(function (value) { return [value, value + "%"]; }));
        field("spacing", "Line spacing", [["comfortable", t("comfortable", "Comfortable")], ["compact", t("compact", "Compact")]]);
        content.appendChild(element("p", "dialogue-hint", t("saved", "Changes apply immediately and are remembered in this browser, separately from game saves.")));
        content.appendChild(button("reset", "Reset reading settings", function () { setPreferences(defaults); renderSettings(); }));
    }
    function renderHistory() {
        heading.textContent = t("history", "Recent dialogue");
        content.replaceChildren();
        content.appendChild(pageNavigation());
        content.appendChild(element("p", "dialogue-hint", t("historyHelp", "The last 80 passages from this play session. Reading history does not replay choices or change the story.")));
        if (!history.length) content.appendChild(element("p", "", t("empty", "Dialogue will appear here as you play.")));
        history.forEach(function (entry) {
            var item = element("article", "dialogue-history-entry");
            item.appendChild(element("strong", "", entry.speaker));
            var text = element("p", "", entry.text);
            text.lang = entry.language;
            item.appendChild(text);
            content.appendChild(item);
        });
    }
    function open(page) {
        if (!modal) return;
        privateChat.stopSkipping();
        currentPage = page === "history" ? "history" : "settings";
        if (currentPage === "history") renderHistory(); else renderSettings();
        closeButton.textContent = t("close", "Back to game");
        if (!isOpen()) { returnFocus = document.activeElement; modal.showModal(); }
        closeButton.focus();
        content.scrollTop = currentPage === "history" ? content.scrollHeight : 0;
    }

    function resetSession() {
        history = [];
        // Loading another timeline also invalidates any captured entry and skip timer.
        privateChat.kill();
        if (modal) {
            returnFocus = null;
            if (isOpen()) modal.close();
            content.replaceChildren();
        }
    }

    function init() {
        box = document.querySelector(".room-chatBox");
        if (!box) return;
        overlay = document.getElementById("room_chatOverlay");
        revealButton = button("show", "Show dialogue", function () { show(); });
        revealButton.classList.add("dialogue-reveal");
        revealButton.hidden = true;
        overlay.appendChild(revealButton);
        reader = box.querySelector(".room-speachGroup");
        reader.id = "dialogue_reader";
        reader.tabIndex = 0;
        reader.setAttribute("role", "region");
        reader.dataset.l10nAriaLabel = "dialogue.passage";
        reader.setAttribute("aria-label", t("passage", "Dialogue"));
        toolbar = element("div", "dialogue-toolbar");
        hideButton = button("hide", "Hide dialogue", hide);
        hideButton.classList.add("dialogue-icon-hide");
        toolbar.appendChild(hideButton);
        skipButton = document.getElementById("room_chatskip");
        skipButton.classList.add("dialogue-icon-skip");
        toolbar.appendChild(skipButton);
        historyButton = button("history", "Recent dialogue", function () { open("history"); });
        historyButton.classList.add("dialogue-secondary");
        toolbar.appendChild(historyButton);
        settingsButton = button("settings", "Reading settings", function () { open("settings"); });
        settingsButton.classList.add("dialogue-secondary");
        toolbar.appendChild(settingsButton);
        box.insertBefore(toolbar, reader);
        more = button("more", "More text below ↓", function () {
            reader.scrollTop += Math.max(40, reader.clientHeight * 0.8); updateOverflow(); reader.focus();
        });
        more.classList.add("dialogue-more"); more.hidden = true;
        box.appendChild(more);
        var footer = element("div", "dialogue-actions");
        utilityLeft = element("div", "dialogue-controls-left");
        utilityRight = element("div", "dialogue-controls-right");
        settingsGear = element("button", "dialogue-control dialogue-settings-gear", "⚙︎");
        settingsGear.type = "button";
        settingsGear.setAttribute("data-l10n-aria-label", "dialogue.settings");
        settingsGear.setAttribute("aria-label", t("settings", "Reading settings"));
        settingsGear.removeAttribute("title");
        var gearIcon = element("span", "dialogue-icon-symbol", "⚙︎");
        gearIcon.setAttribute("aria-hidden", "true");
        var gearTooltip = element("span", "dialogue-icon-tooltip", t("settings", "Reading settings"));
        gearTooltip.dataset.l10n = "dialogue.settings";
        gearTooltip.setAttribute("aria-hidden", "true");
        settingsGear.replaceChildren(gearIcon, gearTooltip);
        settingsGear.addEventListener("click", function () { open("settings"); });
        actions = element("div", "dialogue-choices");
        box.querySelectorAll(".room-chatBtnClick").forEach(function (node) { actions.appendChild(node); });
        footer.append(utilityLeft, actions, utilityRight);
        box.appendChild(footer);
        reader.addEventListener("scroll", updateOverflow, { passive: true });
        if (typeof ResizeObserver !== "undefined") new ResizeObserver(updateOverflow).observe(reader);
        window.addEventListener("resize", resize);

        modal = element("dialog", "dialogue-dialog"); modal.id = "dialogue_dialog";
        modal.setAttribute("aria-labelledby", "dialogue_heading");
        var header = element("div", "dialogue-dialog-header");
        heading = element("h2"); heading.id = "dialogue_heading";
        closeButton = button("close", "Back to game", function () { modal.close(); });
        header.append(heading, closeButton);
        content = element("div", "dialogue-dialog-content");
        modal.append(header, content); document.body.appendChild(modal);
        modal.addEventListener("close", function () { if (returnFocus && returnFocus.isConnected) returnFocus.focus(); });
        // Keep game hotkeys out of a modal, including the keyup after Escape closes it.
        var swallowed = new Set();
        document.addEventListener("keydown", function (event) {
            if (hidden && event.key === "Escape") {
                swallowed.add(event.code || event.key);
                event.preventDefault();
                event.stopImmediatePropagation();
                show();
                return;
            }
            if (!isOpen()) return;
            swallowed.add(event.code || event.key);
            event.stopImmediatePropagation();
        }, true);
        document.addEventListener("keyup", function (event) {
            if (!isOpen() && !swallowed.has(event.code || event.key)) return;
            swallowed.delete(event.code || event.key);
            event.stopImmediatePropagation();
        }, true);
        document.addEventListener("hatmp:languagechange", function () {
            if (privateChat.refreshLanguage) privateChat.refreshLanguage();
            if (isOpen()) open(currentPage);
            resize();
        });
        apply();
    }
    $(document).ready(init);
    return { open: open, isOpen: isOpen, onEntry: onEntry, resize: resize,
        hide: hide, show: show, isHidden: function () { return hidden; },
        resetSession: resetSession,
        setPreferences: setPreferences, getPreferences: function () { return Object.assign({}, preferences); },
        clearHistory: function () { history = []; }, normalize: normalize };
})();

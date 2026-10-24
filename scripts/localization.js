/* Localization loader and shared translation helpers. */
var l10n = (function () {
    var storageKey = "hatmp.language";
    var languageList = Array.isArray(window.HatMPLanguageList) ? window.HatMPLanguageList : [];
    var languages = languageList.filter(function (language) {
        return language && typeof language.locale === "string" &&
            /^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(language.locale) &&
            typeof language.nativeName === "string";
    }).map(function (language) {
        return { code: language.locale, name: language.nativeName };
    });
    var catalogs = {};
    var loading = {};
    var bundledLocales = window.HatMPLocales || {};
    var current = "en";

    function validateCatalog(code, catalog) {
        if (!catalog || !catalog.strings || typeof catalog.strings !== "object" || Array.isArray(catalog.strings))
            throw new Error("Invalid language pack: " + code);
        if (!catalog._meta || catalog._meta.locale !== code)
            throw new Error("Language pack metadata does not match its filename: " + code);
        if (catalog.names !== undefined) {
            if (!catalog.names || typeof catalog.names !== "object" || Array.isArray(catalog.names))
                throw new Error("Invalid language pack character names: " + code);
            Object.keys(catalog.names).forEach(function (characterId) {
                var name = catalog.names[characterId];
                if (!name || typeof name !== "object" || Array.isArray(name) ||
                    typeof name.source !== "string" || typeof name.display !== "string")
                    throw new Error("Invalid localized name for " + characterId + " in language pack " + code);
            });
        }
        if (catalog.terms !== undefined) {
            if (!catalog.terms || typeof catalog.terms !== "object" || Array.isArray(catalog.terms))
                throw new Error("Invalid language pack terms: " + code);
            Object.keys(catalog.terms).forEach(function (termKey) {
                var forms = catalog.terms[termKey];
                if (!forms || typeof forms !== "object" || Array.isArray(forms))
                    throw new Error("Invalid term forms for " + termKey + " in language pack " + code);
                Object.keys(forms).forEach(function (form) {
                    if (typeof forms[form] !== "string")
                        throw new Error("Invalid " + form + " form for " + termKey + " in language pack " + code);
                });
            });
        }
        catalogs[code] = catalog;
        var language = languages.find(function (item) { return item.code === code; });
        if (language && catalog._meta.nativeName)
            language.name = catalog._meta.nativeName;
        var targetVersion = catalog._meta.targetGameVersion;
        if (targetVersion && typeof g !== "undefined" &&
            String(targetVersion).replace(/^0\./, "") !== String(g.version))
            console.warn("Language pack " + code + " targets game " + targetVersion +
                "; current game version is " + g.version + ". Missing strings will use English.");
        return catalog;
    }

    function loadCatalog(code) {
        if (catalogs[code])
            return Promise.resolve(catalogs[code]);
        if (!languages.some(function (language) { return language.code === code; }))
            return Promise.reject(new Error("Language is not listed in the language list: " + code));
        if (loading[code])
            return loading[code];

        try {
            if (bundledLocales[code])
                return Promise.resolve(validateCatalog(code, bundledLocales[code]));
        } catch (error) {
            return Promise.reject(error);
        }

        loading[code] = new Promise(function (resolve, reject) {
            var script = document.createElement("script");
            script.src = "./l10n/" + code + ".js";
            script.onload = function () {
                try {
                    var loaded = window.HatMPLocales && window.HatMPLocales[code];
                    resolve(validateCatalog(code, loaded));
                } catch (error) {
                    reject(error);
                } finally {
                    delete loading[code];
                }
            };
            script.onerror = function () {
                delete loading[code];
                reject(new Error("Could not load language pack: " + code));
            };
            document.head.appendChild(script);
        });
        return loading[code];
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            return {
                "&": "&amp;", "<": "&lt;", ">": "&gt;",
                '"': "&quot;", "'": "&#39;"
            }[character];
        });
    }

    function translate(key, fallback, values) {
        var selected = catalogs[current] && catalogs[current].strings;
        var english = catalogs.en && catalogs.en.strings;
        var message = (selected && selected[key]) || (english && english[key]) || fallback || key;
        if (values) {
            message = message.replace(/\{([a-zA-Z0-9_]+)\}/g, function (token, name) {
                return Object.prototype.hasOwnProperty.call(values, name)
                    ? escapeHtml(values[name])
                    : token;
            });
        }
        return message;
    }

    function decodeHtml(value) {
        var decoder = document.createElement("textarea");
        decoder.innerHTML = String(value);
        return decoder.value;
    }

    var staticTranslationsQueued = false;
    function applyStaticTranslations() {
        if (document.readyState === "loading") {
            if (!staticTranslationsQueued) {
                staticTranslationsQueued = true;
                document.addEventListener("DOMContentLoaded", function () {
                    staticTranslationsQueued = false;
                    applyStaticTranslations();
                }, { once: true });
            }
            return;
        }
        document.querySelectorAll("[data-l10n-title]").forEach(function (element) {
            var key = element.getAttribute("data-l10n-title");
            var values = null;
            var params = element.getAttribute("data-l10n-title-params");
            if (params) {
                try {
                    values = JSON.parse(params);
                }
                catch (error) {
                    values = null;
                }
            }
            element.title = decodeHtml(translate(key, element.getAttribute("title") || key, values));
        });
        document.querySelectorAll("[data-l10n-aria-label]").forEach(function (element) {
            var key = element.getAttribute("data-l10n-aria-label");
            element.setAttribute("aria-label", translate(key, element.getAttribute("aria-label") || key));
        });
        document.querySelectorAll("[data-l10n]").forEach(function (element) {
            var key = element.getAttribute("data-l10n");
            element.textContent = translate(key, element.textContent || key);
        });
    }

    function changeCase(value, mode) {
        var text = String(value);
        try {
            if (mode === "lower")
                return text.toLocaleLowerCase(current);
            if (mode === "upper")
                return text.toLocaleUpperCase(current);
            var characters = Array.from(text);
            for (var i = 0; i < characters.length; i++) {
                var upper = characters[i].toLocaleUpperCase(current);
                var lower = characters[i].toLocaleLowerCase(current);
                if (upper !== lower) {
                    characters[i] = upper;
                    break;
                }
            }
            return characters.join("");
        }
        catch (error) {
            if (mode === "lower")
                return text.toLowerCase();
            if (mode === "upper")
                return text.toUpperCase();
            return text.charAt(0).toUpperCase() + text.slice(1);
        }
    }

    function caseMode(form) {
        if (form === "lower" || /Lower$/.test(form))
            return "lower";
        if (form === "upper" || /Upper$/.test(form))
            return "upper";
        if (form === "capitalize" || /Capitalized$/.test(form))
            return "capitalize";
        return "";
    }

    function baseCaseForm(form, mode) {
        if (form === "capitalize" || form === "upper" || form === "lower")
            return "display";
        if (mode === "lower")
            return form.slice(0, -"Lower".length);
        if (mode === "upper")
            return form.slice(0, -"Upper".length);
        return form.slice(0, -"Capitalized".length);
    }

    function characterTerm(name, form, currentName, sourceDefault) {
        var value = currentName == null ? "" : String(currentName);
        var mode = caseMode(form);
        if (sourceDefault !== undefined && value !== String(sourceDefault)) {
            if (mode)
                return changeCase(value, mode);
            return value;
        }

        var selectedTerms = catalogs[current] && catalogs[current].terms;
        var englishTerms = catalogs.en && catalogs.en.terms;
        var localizedForms = selectedTerms && selectedTerms[name];
        var englishForms = englishTerms && englishTerms[name];
        if (localizedForms && typeof localizedForms[form] === "string")
            return localizedForms[form];
        if (englishForms && typeof englishForms[form] === "string")
            return englishForms[form];
        if (mode) {
            var baseForm = baseCaseForm(form, mode);
            var caseValue = (localizedForms && localizedForms[baseForm]) || (englishForms && englishForms[baseForm]) || value;
            return changeCase(caseValue, mode);
        }
        return value;
    }

    function characterName(name, currentName) {
        var value = currentName == null ? "" : String(currentName);
        var comparableValue = value.replace(/[’‘]/g, "'");
        var selectedNames = catalogs[current] && catalogs[current].names;
        var englishNames = catalogs.en && catalogs.en.names;
        var localizedName = selectedNames && selectedNames[name];
        var englishName = englishNames && englishNames[name];
        var sourceDefault = (englishName && englishName.source) || (localizedName && localizedName.source);

        var isDefaultName = sourceDefault !== undefined && comparableValue === String(sourceDefault).replace(/[’‘]/g, "'");
        if (!isDefaultName) {
            isDefaultName = Object.keys(catalogs).some(function (code) {
                var names = catalogs[code] && catalogs[code].names;
                var knownName = names && names[name];
                return knownName && (comparableValue === knownName.source.replace(/[’‘]/g, "'") ||
                    comparableValue === knownName.display.replace(/[’‘]/g, "'"));
            });
        }

        if (!isDefaultName)
            return value;
        if (localizedName && typeof localizedName.display === "string")
            return localizedName.display;
        if (englishName && typeof englishName.display === "string")
            return englishName.display;
        return value;
    }

    function characterNameSource(name, fallback) {
        var englishNames = catalogs.en && catalogs.en.names;
        var localizedNames = catalogs[current] && catalogs[current].names;
        var englishName = englishNames && englishNames[name];
        var localizedName = localizedNames && localizedNames[name];
        if (englishName && typeof englishName.source === "string")
            return englishName.source;
        if (localizedName && typeof localizedName.source === "string")
            return localizedName.source;
        return fallback == null ? "" : String(fallback);
    }

    function syncSelectors() {
        document.querySelectorAll(".game-language-select").forEach(function (select) {
            select.replaceChildren();
            languages.forEach(function (language) {
                var option = document.createElement("option");
                option.value = language.code;
                option.textContent = language.name;
                option.selected = language.code === current;
                select.appendChild(option);
            });
            select.value = current;
            select.setAttribute("aria-label", translate("ui.language", "Language"));
        });
        document.querySelectorAll(".game-language-label").forEach(function (label) {
            label.textContent = translate("ui.language", "Language");
        });
    }

    function addSelector(id, left, top, width) {
        var parent = document.getElementById("room-buttons");
        if (!parent)
            return;

        var existing = document.getElementById(id);
        if (existing)
            existing.remove();

        var wrapper = document.createElement("div");
        wrapper.id = id;
        wrapper.className = "game-language-control";
        wrapper.setAttribute("data-name", id);
        wrapper.style.left = (left * g.ratio) + "px";
        wrapper.style.top = (top * g.ratio) + "px";
        wrapper.style.width = (width * g.ratio) + "px";
        wrapper.style.fontSize = (18 * g.ratio) + "px";

        var label = document.createElement("label");
        label.className = "game-language-label";
        label.htmlFor = id + "_select";
        label.textContent = translate("ui.language", "Language");

        var select = document.createElement("select");
        select.id = id + "_select";
        select.name = id + "_select";
        select.className = "game-language-select";
        select.style.minHeight = (38 * g.ratio) + "px";
        select.setAttribute("aria-label", label.textContent);
        select.addEventListener("change", function () {
            setLanguage(select.value);
        });

        wrapper.appendChild(label);
        wrapper.appendChild(select);
        parent.appendChild(wrapper);
        syncSelectors();
    }

    function refreshCurrentView() {
        if (typeof phone !== "undefined" && phone.isOpen && phone.isOpen()) {
            phone.settings();
            return;
        }
        if (typeof g !== "undefined" && g.roomID === 1 && typeof nav !== "undefined") {
            nav.buildRoom();
            return;
        }
        if (typeof g !== "undefined" && g.roomID === 3 && typeof invoker !== "undefined")
            invoker.invoke(3, "main");
    }

    function setLanguage(code) {
        if (!languages.some(function (language) { return language.code === code; }))
            return Promise.resolve(false);

        return loadCatalog(code).then(function () {
            current = code;
            try { localStorage.setItem(storageKey, current); }
            catch (error) { /* Language selection still works for this session. */ }
            document.documentElement.lang = current;
            document.documentElement.dir = (catalogs[current]._meta && catalogs[current]._meta.direction) || "ltr";
            applyStaticTranslations();
            syncSelectors();
            refreshCurrentView();
            return true;
        }).catch(function (error) {
            console.warn(error.message);
            syncSelectors();
            return false;
        });
    }

    function localizeChatEntry(entry, chatID, roomID) {
        if (!entry)
            return entry;

        var copy = Object.assign({}, entry);
        var prefix = "room." + roomID + ".chat." + chatID;
        var textKey = entry.l10nKey || (prefix + ".text");
        copy.text = entry.text
            ? translate(textKey, entry.text, entry.l10nValues)
            : entry.text;
        copy.button = (entry.button || []).map(function (button, index) {
            var localizedButton = Object.assign({}, button);
            var key = button.l10nKey || (prefix + ".choice." + index);
            if (button.text)
                localizedButton.text = translate(key, button.text, button.l10nValues);
            return localizedButton;
        });
        return copy;
    }

    var storedLanguage = "en";
    try { storedLanguage = localStorage.getItem(storageKey) || "en"; }
    catch (error) { /* Use English when storage is unavailable. */ }

    var ready = Promise.resolve().then(function () {
        if (!languages.some(function (language) { return language.code === "en"; }))
            throw new Error("The language list must include English.");
        return loadCatalog("en");
    }).catch(function (error) {
        console.warn(error.message);
    }).then(function () {
        if (storedLanguage !== "en" && languages.some(function (language) { return language.code === storedLanguage; }))
            return loadCatalog(storedLanguage).then(function () {
                current = storedLanguage;
            }).catch(function (error) {
                console.warn(error.message);
                current = "en";
            });
    }).then(function () {
        document.documentElement.lang = current;
        document.documentElement.dir = (catalogs[current] && catalogs[current]._meta && catalogs[current]._meta.direction) || "ltr";
        applyStaticTranslations();
    });

    return {
        ready: ready,
        t: translate,
        characterTerm: characterTerm,
        characterName: characterName,
        characterNameSource: characterNameSource,
        setLanguage: setLanguage,
        addSelector: addSelector,
        chatEntry: localizeChatEntry,
        getLanguage: function () { return current; }
    };
})();

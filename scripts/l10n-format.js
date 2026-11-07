/* Shared, data-only translation grammar for the browser and offline checker. */
(function (root, factory) {
    var api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    else root.HatMPMessageFormat = api;
}(typeof window !== "undefined" ? window : globalThis, function () {
    "use strict";

    // One selector, always referring to the player. Branches cannot be nested.
    function parse(text) {
        if (typeof text !== "string") return { error: "Translation must be a string." };
        var parts = [], position = 0, branched = false;
        while (position < text.length) {
            var open = text.indexOf("[[", position);
            var close = text.indexOf("]]", position);
            if (close !== -1 && (open === -1 || close < open))
                return { error: "Unexpected ]] outside a player branch." };
            if (open === -1) { parts.push(text.slice(position)); break; }
            parts.push(text.slice(position, open));
            if (close === -1) return { error: "Player branch is missing its closing ]]." };
            var body = text.slice(open + 2, close);
            if (body.indexOf("[[") !== -1) return { error: "Player branches cannot be nested." };
            if (body.indexOf("player:") !== 0)
                return { error: "Unknown branch selector; use [[player:masculine|feminine]]." };
            var alternatives = body.slice(7).split("|");
            if (alternatives.length !== 2 || !alternatives[0].trim() || !alternatives[1].trim())
                return { error: "Player branch needs exactly two nonempty alternatives: masculine|feminine. Use &#124; for a literal pipe." };
            parts.push({ masculine: alternatives[0], feminine: alternatives[1] });
            branched = true;
            position = close + 2;
        }
        return { parts: parts, branched: branched };
    }

    function render(parsed, feminine) {
        if (parsed.error) throw new Error(parsed.error);
        return parsed.parts.map(function (part) {
            return typeof part === "string" ? part : part[feminine ? "feminine" : "masculine"];
        }).join("");
    }

    function variants(text) {
        var parsed = parse(text);
        if (parsed.error) return parsed;
        var masculine = render(parsed, false);
        return { branched: parsed.branched, variants: parsed.branched ?
            [{ name: "masculine", text: masculine }, { name: "feminine", text: render(parsed, true) }] :
            [{ name: "", text: masculine }] };
    }

    return { parse: parse, render: render, variants: variants };
}));

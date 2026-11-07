/* Test scene: no save loading, room evaluation, or story callbacks. */
var g = { ratio: 1, roomID: -1, skipChat: false, error: console.error };
var sc = { char: [{ name: "preview", image: "rand.png" }], n: function () { return "Alexandra-María Александра"; } };
var invoker = { invoke: function () { throw new Error("Preview must not execute story callbacks."); } };
// Read-only sample state for the real gender.isGirl() resolver. Never load a save.
var gv = { get: function (key) { return key === "pronouns" ? document.getElementById("preview_pronouns").value : undefined; } };
var cl = { c: { chest: 0, hairLength: 0 }, appearance: function () { return Number(document.getElementById("preview_appearance").value); } };

$(document).ready(function () {
    l10n.ready.then(function () {
        var sequence = 0;
        // Register after the shared renderer's ready handlers have initialized.
        setTimeout(function () {
            function render() {
                privateChat.stopSkipping();
                g.ratio = Math.min(innerWidth / 1920, innerHeight / 1080);
                var count = Number(document.getElementById("preview_choices").value);
                var paragraphs = Number(document.getElementById("preview_length").value);
                var customKey = document.getElementById("preview_key").value.trim();
                var textKey = customKey || (document.getElementById("preview_agreement").checked ? "dialogue.previewAgreement" : "dialogue.previewText");
                // Unknown placeholders remain visible so translators know what needs context.
                var text = l10n.t(textKey, customKey || "Sample dialogue.", { me: "Alex", name: "Alex" });
                var textLanguage = l10n.chatEntry({ text: "Sample dialogue.", l10nKey: textKey, button: [] }, -1, -1).textLanguage;
                var expanded = document.getElementById("preview_expand").checked;
                if (expanded) {
                    var extra = document.createElement("div");
                    extra.innerHTML = text;
                    extra.textContent = extra.textContent.slice(0, Math.floor(extra.textContent.length / 2));
                    text += " " + extra.innerHTML;
                }
                privateChat.makeChat({ speaker: "preview", text: Array(paragraphs).fill(text).join("<br><br>"),
                    button: Array.from({ length: count }, function (_, index) {
                        return { text: index % 3 === 0 ? l10n.t("dialogue.previewChoice", "Look around.") : l10n.t("dialogue.previewContinue", "Continue"), chatID: -1, callback: "" };
                    }) }, sequence++, -1);
                document.getElementById("room_footerSpeach").lang = textLanguage;
                document.querySelector("#room_chatSpeaker img").src = "../images/speaker/rand.png";
                document.getElementById("preview_status").textContent = innerWidth + " × " + innerHeight + " — passage " + sequence;
            }
            document.getElementById("preview_language").value = l10n.getLanguage();
            document.getElementById("preview_language").addEventListener("change", async function (event) { await l10n.setLanguage(event.target.value); render(); });
            ["preview_length", "preview_choices", "preview_expand", "preview_agreement", "preview_pronouns", "preview_appearance", "preview_key"].forEach(function (id) { document.getElementById(id).addEventListener("change", render); });
            document.getElementById("preview_next").addEventListener("click", render);
            document.getElementById("preview_settings").addEventListener("click", function () { dialogue.open("settings"); });
            window.addEventListener("resize", function () { g.ratio = Math.min(innerWidth / 1920, innerHeight / 1080); dialogue.resize(); document.getElementById("preview_status").textContent = innerWidth + " × " + innerHeight + " — passage " + sequence; });
            render();
        }, 0);
    });
});

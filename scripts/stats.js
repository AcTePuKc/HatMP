var sstat = {};

sstat.hormoneText = function (hormone) {
    if (hormone > 75)
        return l10n.t("stats.hormone.transform", "Transformation Possible");
    if (hormone > 50)
        return l10n.t("stats.hormone.feminine", "Little bit feminine");
    return l10n.t("stats.hormone.masculine", "Masculine");
};

sstat.updateLevelBar = function (stat) {
    var barWidth = (stat.c / levels.getPointsCapForLevel(stat)) * 100;
    var levelDesc = levels.desc(stat.n, stat.l);
    $(".rl-levelheader[data-name='" + stat.n + "']").text(l10n.t("stats.name." + stat.n, stat.d) + " " + stat.l);
    $(".rl-bar[data-name='" + stat.n + "']").css({ width: barWidth + "%" });
    $(".rl-level[data-name='" + stat.n + "']").text(sstat.levelDescription(stat, levelDesc));
};

sstat.levelDescription = function (stat, levelDesc) {
    // The source uses this sentinel when a talent has no description.
    if (levelDesc.count === -1 && levelDesc.txt === "not found")
        return "";
    if (stat.n === "fitness")
        return l10n.t("stats.description.fitness", "{amount} Energy Boost", { amount: stat.l * 4 });
    if (stat.n === "fame")
        return l10n.t("stats.description.fame", "{amount}x chance of rape ", { amount: stat.l });
    if (stat.n === "xdress")
        return !sissy.st[0].ach
            ? l10n.t("stats.description.xdress.locked", "Unlock Sissy School")
            : l10n.t("stats.description.xdress.points", "Points: {amount}", { amount: stat.l });
    if (levelDesc.count > 0) {
        var index = Math.min(stat.l, levelDesc.count - 1);
        var description = l10n.t("stats.description." + stat.n + "." + index, levelDesc.txt);
        if (stat.n === "sub" && (index === 1 || index === 2))
            description = description.replace(/\{missy\}/g, function () { return sc.n("missy"); });
        return description;
    }
    return levelDesc.txt;
};

document.addEventListener("hatmp:languagechange", function () {
    if (typeof gv !== "undefined" && Array.isArray(gv.st) && gv.st.length &&
        typeof levels !== "undefined" && Array.isArray(levels.st) && levels.st.length) {
        sstat.updateGraph();
        if (typeof cl !== "undefined" && cl.c && typeof cl.energydisplay === "function")
            cl.energydisplay();
        if (typeof char !== "undefined" && typeof char.map === "function" && $("#room_left_map").is(":visible"))
            char.map();
    }
});

sstat.makeGraph = function () {
    sstat.updateGraph();
};

sstat.updateGraph = function () {
    $("#char_money").text("$" + gv.get("money"));

    let i;
    var energy = gv.get("energy");
    var maxenergy = gv.get("maxenergy");
    var energyPercentage = (energy / maxenergy) * 100;
    $(".rl-bar[data-name='energy']").css({ width: energyPercentage + "%" });
    $(".rl-level[data-name='energy']").text(energy + "/" + maxenergy);

    let hormone = gv.get("hormone");
    $(".rl-bar[data-name='hormone']").css({ width: hormone + "%" });
    $(".rl-level[data-name='hormone']").text(sstat.hormoneText(hormone));

    for (i = 0; i < levels.st.length; i++) {
        if (levels.st[i].display)
            sstat.updateLevelBar(levels.st[i]);
    }
};

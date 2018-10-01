"use strict";

function CharacterCreator()
{
    // var container;

    // function init()
    // {
    //     container = select("#cc-container");

    //     var nameInput = createInput();
    //     nameInput.parent(select("#cc-name-text"));

    // }

    // I/O:
    let nameInput;
    let strMinusButton, strPlusButton, 
        dexMinusButton, dexPlusButton, 
        intMinusButton, intPlusButton, 
        conMinusButton, conPlusButton, 
        resetPointsButton, 
        createCharacterButton;

    let pointsLeftWarning;
    
    function init()
    {
        nameInput = createInput();
        nameInput.parent("character-creator-name-text");
        nameInput.style("float", "right");

        strMinusButton = createStatButton(strMinusButton, "str", "-", -1);
        strPlusButton = createStatButton(strPlusButton, "str", "+", 1);

        dexMinusButton = createStatButton(dexMinusButton, "dex", "-", -1);
        dexPlusButton = createStatButton(dexPlusButton, "dex", "+", 1);

        intMinusButton = createStatButton(intMinusButton, "int", "-", -1);
        intPlusButton = createStatButton(intPlusButton, "int", "+", 1);

        conMinusButton = createStatButton(conMinusButton, "con", "-", -1);
        conPlusButton = createStatButton(conPlusButton, "con", "+", 1);

        resetPointsButton = createButton("Reset");
        resetPointsButton._pInst = _p5;
        resetPointsButton.mousePressed(function () {resetStatsToDefault()})
        resetPointsButton.parent("character-creator-points-button");
        resetPointsButton.class("reset-button");

        createCharacterButton = createButton("Create");
        createCharacterButton._pInst = _p5;
        createCharacterButton.mousePressed(function () {createCharacter()})
        createCharacterButton.parent("character-create-button");
        createCharacterButton.class("create-character-button");
    }

    function createStatButton(button, stat, label, delta)
    {
        button = createButton(label);
        button._pInst = _p5;
        button.mousePressed(function () {modifyStat(stat, delta)});
        button.parent("character-creator-stats-buttons");
        button.class("stat-button");

        return button;
    }

    function modifyStat(statToModify, delta)
    {
        var curStatValue = parseInt(document.getElementById("character-creator-" + statToModify + "-stat").innerText);
        var pointsRemaining = parseInt(document.getElementById("character-creator-points-remaining").innerText);

        var newStatValue = curStatValue + delta;

        if (newStatValue >= 1 && pointsRemaining >= 0)
        {
            if (pointsRemaining > 0)
                document.getElementById("character-creator-" + statToModify + "-stat").innerText = newStatValue;

            document.getElementById("character-creator-points-remaining").innerText = pointsRemaining - delta;

            var newPointsRemaining = pointsRemaining - delta;
            if (newPointsRemaining < 0)
                document.getElementById("character-creator-points-remaining").innerText = 0

        }
    }

    function getRemainingPoints()
    {
        return parseInt(document.getElementById("character-creator-points-remaining").innerText);
    }

    function resetStatsToDefault()
    {
        document.getElementById("character-creator-" + "str" + "-stat").innerText = 5;
        document.getElementById("character-creator-" + "dex" + "-stat").innerText = 5;
        document.getElementById("character-creator-" + "int" + "-stat").innerText = 5;
        document.getElementById("character-creator-" + "con" + "-stat").innerText = 5;

        document.getElementById("character-creator-points-remaining").innerText = 10;
    }

    function createCharacter()
    {
        if (getRemainingPoints() == 0)
        {
            player.stats["Strength"] = parseInt(document.getElementById("character-creator-" + "str" + "-stat").innerText);
            player.stats["Dexterity"] = parseInt(document.getElementById("character-creator-" + "dex" + "-stat").innerText);
            player.stats["Intelligence"] = parseInt(document.getElementById("character-creator-" + "int" + "-stat").innerText);
            player.stats["Constitution"] = parseInt(document.getElementById("character-creator-" + "con" + "-stat").innerText);
    
            player.name = nameInput.value();
    
            document.getElementById("character-creator-container").style.display = "none";
            narrative.init();
        }
        else
        {
            if (typeof(pointsLeftWarning) == "undefined")
            {
                pointsLeftWarning = createElement("p", "*You need to spend all points before proceeding.");
                pointsLeftWarning.parent("cc-warning-text");
            }
        }
    }

    return {
        init,
    }

}
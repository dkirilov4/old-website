"use strict";

function Narrative()
{
    var choices;
    var c1, c2, c3, c4, c5;
    var c1_label, c2_label, c3_label, c4_label, c5_label;
    var narrative_story_inner, narrative_text;

    var submitButton;
    var accuseButton;
    var accuseInput;

    var curVertex;

    var vertices = [];
    var edges = [];
    var numEdges = 0;
    
    // Story knowledge:
    var affairKnown = false;
    var businessCallKnown = false;
    var waitOutsideKnown = false;

    function addVertex(vertex, text, choice_options)
    {
        var node = {id: vertex, text: text, choice_options}

        vertices.push(node);
        edges[vertex] = [];
    }

    function addEdge(v1, v2)
    {
        edges[v1].push(v2);
        numEdges++;
    }

    function printStory()
    {
        console.log(vertices.map(function(vertex) {
            return (vertex + " -> " + edges[vertex.id].join(', ')).trim();
        }, this).join(" | "));
    }

    function init()
    {
        document.getElementById("narrative-container").style.display = "inline";

        accuseInput = createInput();
        accuseInput.parent("narrative-accuse-button");
        accuseInput.id("accuse-input");
        
        // Set Up References:
        narrative_story_inner = select("#narrative-story-inner").elt;
        narrative_text = select("#narrative-text").elt;
        choices = document.getElementById("choices");
        c1 = document.getElementById("c1");
        c2 = document.getElementById("c2");
        c3 = document.getElementById("c3");
        c4 = document.getElementById("c4");
        c5 = document.getElementById("c5");
        c1_label = document.getElementById("c1-label");
        c2_label = document.getElementById("c2-label");
        c3_label = document.getElementById("c3-label");
        c4_label = document.getElementById("c4-label");
        c5_label = document.getElementById("c5-label");

        c1.checked = true;

        // Set Up Narrative:
        curVertex = 1;

        narrative.addVertex(1, "You arrive at the Fantasia restaurant after receiving a 9-1-1 call regarding a homicide victim.\n\n The victim's name is Manuel Parker - 39 year old male. He was the owner and the chef of the restaurant. The cause of death appears to be a stab wound through the heart, however the murder weapon is nowhere to be found. The estimated time of death is between 10:00 pm and 12:00 pm. What do you do?",
            ["Question any witnesses/restaurant staff."]);

        narrative.addVertex(2, "You decide to investigate the crime scene.",
            ["c1", "c2"]);

        narrative.addVertex(3, "You decide to question any potential witnesses as well as the restaurant staff.\n\n You quickly obtain a list of all people who have access to the building: \n -Laura Ross: one of the restaurant's cooks \n -George McGregor: one of the restaurant's cooks \n -Joseph Thomas: the cleaner \n -Rosa Kail: a waitress at the restaurant \n -Alicia Penn: a waitress at the restaurant\n\n Who do you want to question?",
            ["Laura", "George", "Joseph", "Rosa", "Alicia"]);

        // Laura
        narrative.addVertex(4, "You decide to question Laura, one of the restaurant's assistant cooks. What do you want to know?",
            ["What time she left the restaurant", "How well she got along with the victim", "Does she know of anyone who would want to hurt the victim"]);
        narrative.addVertex(5, "You ask Laura to tell you what time she left the restaurant last night. \n\n She tells you that she left shortly after the restaurant closes - around 9:30 pm and went to the nearest bar to blow some steam off. She claims that she was at the bar until late", 
            ["Ask another questsion.", "Question someone else"])
        narrative.addVertex(6, "You ask Laura to tell you how well she got along with the victim. \n\n She mentions that in recent months things have been rather rough between then and that she had recently received a notice for her removal from the restaurant because she has been taking too many off days. She says she was seriously upset, but not enough to kill the chef.", 
            ["Ask another questsion.", "Question someone else"])
        narrative.addVertex(7, "You ask if Laura knows of anyone who would want to hurt the victim \n\n She says that Rosa, the waitress has been having troubles with the chef that he would always yell at her for everything, but nothing outside of that.", 
            ["Ask another questsion.", "Question someone else"])

        narrative.addVertex(8, "You decide to question someone else. Who do you want to question?",
            ["Laura", "George", "Joseph", "Rosa", "Alicia"]);

        // George
        narrative.addVertex(9, "You decide to question George, one of the restaurant's assistant cooks. What do you want to know?",
            ["What time he left the restaurant", "How well he got along with the victim", "Does he know of anyone who would want to hurt the victim"]);
        narrative.addVertex(10, "You ask George to tell you what time he left the restaurant last night. \n\n He tells you that he left as soon as the restaurant closed, and went straight home. He claims that he saw Laura leave a little before him.", 
            ["Ask another questsion.", "Question someone else"])
        narrative.addVertex(11, "You ask George to tell you how well she got along with the victim. \n\n He claims that things were well off between them and that there were no tensions.", 
            ["Ask another questsion.", "Question someone else"])
        narrative.addVertex(12, "You ask if George knows of anyone who would want to hurt the victim \n\n George claims that it's possible that Alicia might have wanted to hurt him. He says that they apparently had an affair.", 
            ["Ask another questsion.", "Question someone else"])

        narrative.addVertex(13, "You decide to question someone else. Who do you want to question?",
        ["Laura", "George", "Joseph", "Rosa", "Alicia"]);

        // Joseph
        narrative.addVertex(14, "You decide to question Joseph, the guy in charge of cleaning. What do you want to know?",
            ["What time he left the restaurant", "How well he got along with the victim", "Does he know of anyone who would want to hurt the victim"]);
        narrative.addVertex(15, "You ask Joseph to tell you what time he left the restaurant last night. \n\n He tells you that he finished his shift around 10:00, and then drove straight home. He claims he saw Alicia waiting in her car outside the restaurant. He also saw the chef go outside and talk to her. He claims he left before seeing the chef return back to the restaurant.", 
            ["Ask another questsion.", "Question someone else"])
        narrative.addVertex(16, "You ask Joseph to tell you how well she got along with the victim. \n\n He claims he didn't really talk much to the chef and that there weren't any problems between them.", 
            ["Ask another questsion.", "Question someone else"])
        narrative.addVertex(17, "You ask if Joseph knows of anyone who would want to hurt the victim \n\n Joseph says that he overheard the victim talking to George on the phone regarding some business meeting later that night before leaving, and that the conversation sounded somewhat heated.", 
            ["Ask another questsion.", "Question someone else"])

        narrative.addVertex(18, "You decide to question someone else. Who do you want to question?",
        ["Laura", "George", "Joseph", "Rosa", "Alicia"]);

        // Rosa
        narrative.addVertex(19, "You decide to question Rosa, one of the restaurant's assistant cooks. What do you want to know?",
            ["What time she left the restaurant", "How well she got along with the victim", "Does she know of anyone who would want to hurt the victim"]);
        narrative.addVertex(20, "You ask Rosa to tell you what time she left the restaurant last night. \n\n She tells you she left shortly after her shift was over - around 9:15. She says she left a little after George left.", 
            ["Ask another questsion.", "Question someone else"])
        narrative.addVertex(21, "You ask Rosa to tell you how well she got along with the victim. \n\n She mentions that she didn't like the chef, but there is no way she would ever hurt him. She claims her family can vouch for her whereabouts at 9:30 as she was home doing some school work.", 
            ["Ask another questsion.", "Question someone else"])
        narrative.addVertex(22, "You ask if Rosa knows of anyone who would want to hurt the victim \n\n She says she keeps to herself mainly and doesn't know about anyone who would want to hurt the owner.", 
            ["Ask another questsion.", "Question someone else"])

        narrative.addVertex(23, "You decide to question someone else. Who do you want to question?",
            ["Laura", "George", "Joseph", "Rosa", "Alicia"]);

        // Alicia
        narrative.addVertex(24, "You decide to question Rosa, one of the restaurant's assistant cooks. What do you want to know?",
            ["What time she left the restaurant", "How well she got along with the victim", "Does she know of anyone who would want to hurt the victim"]);
        narrative.addVertex(25, "You ask Rosa to tell you what time she left the restaurant last night. \n\n She tells you she left shortly after her shift was over", 
            ["Ask another questsion.", "Question someone else"])
        narrative.addVertex(26, "You ask Rosa to tell you how well she got along with the victim. \n\n She mentions that she has great relations with the chef and that there is no reason she would ever harm him.", 
            ["Ask another questsion.", "Question someone else"])
        narrative.addVertex(27, "You ask if Rosa knows of anyone who would want to hurt the victim \n\n She says that Rosa often got yelled at and argued with the chef, so maybe she did it.", 
            ["Ask another questsion.", "Question someone else"])

        narrative.addVertex(28, "You decide to question someone else. Who do you want to question?",
            ["Laura", "George", "Joseph", "Rosa", "Alicia"]);

        // Hidden Branches:
        narrative.addVertex(29, "You ask George what he was discussing with the ownder last night over the phone. \n\n He seems a little unsettled that you bring this up, but answers regardless. George claims that he wanted to branch off and create his own restuarant, but the owner wanted to keep him as a chef, and so they made a deal to split profits in order for George to stay. Manuel was refusing to pay what he promised, and so George had called him to discuss that. He claims that they were supposed to meet today to discuss that.", 
            ["Ask another questsion.", "Question someone else"])

        narrative.addVertex(30, "You ask Alicia about the affair she was having with the victim \n\n Alicia seems very unsettled that you bring this up, and asks you to keep quite if possible so that his wife doesn't find out. She would rather avoid any drama she can. She says that her and the ownder fell in love in the restaurant and were on getting married one day after he divorced his wife. She claims she never would have wanted to harm him.", 
        ["Ask another questsion.", "Question someone else"])

        narrative.addVertex(31, "You ask Alicia why she was outside the restaurant until late \n\n Alicia claims she was waiting for Manuel to finish work so that they would go out after, but he claimed he had to meet with George in the restaurant later, and so she should go home until he is done.", 
        ["Ask another questsion.", "Question someone else"])

        narrative.addEdge(1, 3);
        narrative.addEdge(1, 3);
        
        // Laura:
        narrative.addEdge(3, 4);

        narrative.addEdge(4, 5)
        narrative.addEdge(5, 4)

        narrative.addEdge(4, 6)
        narrative.addEdge(6, 4)

        narrative.addEdge(4, 7)
        narrative.addEdge(7, 4)

        narrative.addEdge(5, 8)
        narrative.addEdge(6, 8)
        narrative.addEdge(7, 8)

        narrative.addEdge(8, 4)
        narrative.addEdge(8, 9)
        narrative.addEdge(8, 14)
        narrative.addEdge(8, 19)
        narrative.addEdge(8, 24)

        // George:
        narrative.addEdge(3, 9)

        narrative.addEdge(9, 10)
        narrative.addEdge(10, 9)

        narrative.addEdge(9, 11)
        narrative.addEdge(11, 9)

        narrative.addEdge(9, 12)
        narrative.addEdge(12, 9)

        narrative.addEdge(10, 13)
        narrative.addEdge(11, 13)
        narrative.addEdge(12, 13)

          // Hidden Branch 1:
          narrative.addEdge(9, 29)
          narrative.addEdge(29, 9)

          narrative.addEdge(29, 13)

        narrative.addEdge(13, 4)
        narrative.addEdge(13, 9)
        narrative.addEdge(13, 14)
        narrative.addEdge(13, 19)
        narrative.addEdge(13, 24)

        // Joseph:
        narrative.addEdge(3, 14)

        narrative.addEdge(14, 15)
        narrative.addEdge(15, 14)

        narrative.addEdge(14, 16)
        narrative.addEdge(16, 14)

        narrative.addEdge(14, 17)
        narrative.addEdge(17, 14)

        narrative.addEdge(15, 18)
        narrative.addEdge(16, 18)
        narrative.addEdge(17, 18)

        narrative.addEdge(18, 4)
        narrative.addEdge(18, 9)
        narrative.addEdge(18, 14)
        narrative.addEdge(18, 19)
        narrative.addEdge(18, 24)

        // Rosa:
        narrative.addEdge(3, 19)

        narrative.addEdge(19, 20)
        narrative.addEdge(20, 19)

        narrative.addEdge(19, 21)
        narrative.addEdge(21, 19)

        narrative.addEdge(19, 22)
        narrative.addEdge(22, 19)

        narrative.addEdge(20, 23)
        narrative.addEdge(21, 23)
        narrative.addEdge(22, 23)

        narrative.addEdge(23, 4)
        narrative.addEdge(23, 9)
        narrative.addEdge(23, 14)
        narrative.addEdge(23, 19)
        narrative.addEdge(23, 24)


        // Alicia:
        narrative.addEdge(3, 24)

        narrative.addEdge(24, 25)
        narrative.addEdge(25, 24)

        narrative.addEdge(24, 26)
        narrative.addEdge(26, 24)

        narrative.addEdge(24, 27)
        narrative.addEdge(27, 24)

        narrative.addEdge(25, 28)
        narrative.addEdge(26, 28)
        narrative.addEdge(27, 28)

        narrative.addEdge(28, 4)
        narrative.addEdge(28, 9)
        narrative.addEdge(28, 14)
        narrative.addEdge(28, 19)
        narrative.addEdge(28, 24)

            // Hidden Branch 1:
            narrative.addEdge(24, 30)
            narrative.addEdge(30, 24)

            narrative.addEdge(30, 28)

            narrative.addEdge(24, 31)
            narrative.addEdge(31, 24)

            narrative.addEdge(31, 28)

        narrative_text.innerText = vertices[curVertex-1].text;
        createSubmitButton();
        createAccuseButton();
        hideAllChoices();
        updateChoices();
    }

    function update()
    {
        if (curVertex == 12 && !affairKnown)
        {
            console.log("AFFAIR UNLOCK")
            vertices[23].choice_options.push("Ask about the affair she was having with Manuel")
            affairKnown = true;
        }

        if (curVertex == 17 && !businessCallKnown)
        {
            console.log("BUSINESS UNLOCK");
            vertices[8].choice_options.push("Ask what he talking about on the phone with the victim last night")
            businessCallKnown = true;
        }
        if (curVertex == 14 && !waitOutsideKnown)
        {
            console.log("WAIT OUTSIDE UNLOCK")
            vertices[23].choice_options.push("Ask why she was waiting outside in her car")
            waitOutsideKnown = true;
        }
    }

    function updateChoices()
    {
        var numChoices = vertices[curVertex-1].choice_options.length;
        //console.log("Choices: " + numChoices);
            
        if (numChoices >= 1)
        {
            //console.log("1 Choice")
            c1.value = edges[curVertex][0]
            c1_label.childNodes[0].nodeValue = vertices[curVertex-1].choice_options[0]

            c1.style.display = "inline-block"
            c1_label.style.display = "block"
        }
        
        if (numChoices >= 2)
        {
            //console.log("2 Choices")
            c2.value = edges[curVertex][1]
            c2_label.childNodes[0].nodeValue = vertices[curVertex-1].choice_options[1]

            c2.style.display = "inline-block"
            c2_label.style.display = "block"
        }

        if (numChoices >= 3)
        {
            //console.log("3 Choices")
            c3.value = edges[curVertex][2]
            c3_label.childNodes[0].nodeValue = vertices[curVertex-1].choice_options[2]

            c3.style.display = "inline-block"
            c3_label.style.display = "block"
        }

        if (numChoices >= 4)
        {
            //console.log("4 Choices")
            c4.value = edges[curVertex][3]
            c4_label.childNodes[0].nodeValue = vertices[curVertex-1].choice_options[3]

            c4.style.display = "inline-block"
            c4_label.style.display = "block"
        }

        if (numChoices >= 5)
        {
            //console.log("3 Choices")
            c5.value = edges[curVertex][4]
            c5_label.childNodes[0].nodeValue = vertices[curVertex-1].choice_options[4]

            c5.style.display = "inline-block"
            c5_label.style.display = "block"
        }
    }

    function createSubmitButton()
    {
        submitButton = createButton("Submit");
        submitButton._pInst = _p5;
        submitButton.mousePressed(function () {submitChoice(getSelectedRadio().value)});
        submitButton.parent("narrative-choice-submit");
        submitButton.class("submit-button");
    }

    function createAccuseButton()
    {
        accuseButton = createButton("Accuse");
        accuseButton._pInst = _p5;
        accuseButton.mousePressed(function () {accuseKiller(accuseInput.elt.value)});
        accuseButton.parent("narrative-accuse-button");
        accuseButton.class("accuse-button");
    }

    function accuseKiller(name)
    {
        var nameLower = name.toLowerCase();
        document.getElementById("narrative-container").style.display = "none";

        if (nameLower == "george" || nameLower == "george mcgregor")
        {
            var v = document.getElementById("win-ending-container");
            v.style.display = "inline-block";
            v.children[0].children[0].innerText = "You successfully identified the killer!"
        }
        else if (nameLower == "laura" || nameLower == "laura ross" || nameLower == "joseph" || nameLower == "joseph thomas" || nameLower == "rosa" || nameLower == "rosa kail" || name == "alicia" || name == "alicia penn")
        {
            var v = document.getElementById("lose-ending-1-container");
            v.style.display = "inline-block";
            v.children[0].children[0].innerText = "You attempt to take " + name + " to court, however there doesn't seem to be enough evidence. Your arrest failed."
        }
        else
        {
            var v = document.getElementById("lose-ending-2-container");
            v.style.display = "inline-block";
            v.children[0].children[0].innerText = "You attempt to take \"" + name + "\" to court, however no one has ever heard of them. Perhaps it's time to retire?"
        }
    }

    function getSelectedRadio()
    {
        var selectedRadio;
        var radios = document.getElementsByName("radgroup");

        for (var i = 0; i < radios.length; i++)
        {
            if (radios[i].checked)
            {
                selectedRadio = radios[i];
                break;
            }
        }

        return selectedRadio;
    }

    function hideAllChoices()
    {
        c1.style.display = "none"
        c2.style.display = "none"
        c3.style.display = "none"
        c4.style.display = "none"
        c5.style.display = "none"

        c1_label.style.display = "none"
        c2_label.style.display = "none"
        c3_label.style.display = "none"
        c4_label.style.display = "none"
        c5_label.style.display = "none"
    }

    function submitChoice(value)
    {
        curVertex = value;

        if (curVertex <= vertices.length)
        {
            console.log("@ Node: ", curVertex);
            // Hide All Choices:
            hideAllChoices();

            // Change Story Text:
            narrative_text.innerText = vertices[curVertex-1].text;

            // Change Choice Text + Show Proper Choices:
            

            updateChoices();
            

            // Select First Choice
            c1.checked = true;
        }
        else
        {
            console.log("Finish!");
        }

    }

    return {
        init,
        addVertex,
        addEdge,
        printStory,
        curVertex,
        update,

        vertices,
        edges
    }
}
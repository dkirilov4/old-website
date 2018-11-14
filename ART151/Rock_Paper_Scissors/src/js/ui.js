//const ALPHABET_LOWER = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
//const ALPHABET_UPPER = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

//const ALPHABET_CODES_LOWER = [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122]
//const ALPHABET_CODES_UPPER = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]

const GESTURES = ["rock", "paper", "scissors"];
const LABELS  = [0, 1, 2];

var examples = {"rock": 0, "paper": 0, "scissors": 0}
  
class UI
{

  init()
  {
    // this.createTitle();
    this.createGesturesGuide();
    this.createGameInterface();
    this.createVSInterface();
    this.createModelInterface();
  }

  createTitle()
  {
    var svg = d3.select("#title")
      .style("background-color", "white")
      .append("svg")
      .attr("width", outerWidth)
      .attr("height", 100);

    var line = svg.append("rect")
      .attr("x", "0")
      .attr("y", 94)
      .attr("width", outerWidth)
      .attr("height", 6)
      .attr("fill", "#f26422");
  }

  createGesturesGuide()
  {
    var size = 200;
    //var size = Math.min(outerWidth / 26, 77);
    var margin = {left: 10, right: 10, top: 10, bottom: 10}
    
    var labelOffset = size / 8;
    
    var svg = d3.select("#gestures")
      .style("background-color", "white")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")

    var unselectedImgsGroup = svg.append("g");
    
    var unselectedImgs = unselectedImgsGroup.selectAll("image")
      .data(GESTURES)
      .enter()
      .append("svg:image")
      .classed("gesture-unselected", true)
      .attr("xlink:href", function(d) { return "./assets/" + d + "-icon-grey.png"})
      .attr("id", function(d) { return "gesture-" + d + "-unselected"})
      .attr("y", function(d, i) { return i * (size + 10) + margin.top})
      .attr("x", function() { return (select("#gestures").width / 2) - size / 2})
      .attr("width", size)
      .attr("height", size)
      .attr("display", "inline")
      .on("click", function(d, i) {
        tf.tidy(() => {
          const img = webcam.capture();
          console.log("Training Code: " + GESTURES[i]);
          controllerDataset.addExample(decapitatedMobilenet.predict(img), LABELS[i]);
        })

        examples[d]++;
        select("#" + d + "-examples").elt.innerHTML = examples[d];
      });

    var selectedImgsGroup = svg.append("g");
    
    var selectedImgs = selectedImgsGroup.selectAll("image")
      .data(GESTURES)
      .enter()
      .append("svg:image")
      .classed("gesture-selected", true)
      .attr("xlink:href", function(d) { return "./assets/" + d + "-icon-orange.png"})
      .attr("id", function(d) { return "gesture-" + d + "-selected"})
      .attr("y", function(d, i) { return i * (size + 10) + margin.top})
      .attr("x", function() { return (select("#gestures").width / 2) - size / 2})
      .attr("width", size)
      .attr("height", size)
      .attr("display", "none");

    var labels = svg.append("g").selectAll("text")
      .data(GESTURES)
      .enter()
      .append("text")
      .attr("id", function(d) { return d + "-examples"})
      .text( function(d) { return examples[d]; })
      .attr("y", function(d, i) { return i * (size + 10) + margin.top * 2})
      .attr("x", function() { return (select("#gestures").width / 2) + size / 2})
      .style("text-anchor", "middle")
  }

  createModelInterface()
  {
    // Learning Rate:
    var learningRateParent = createElement("div")
      .id("model-input")
      .parent("#model-interface");

    createP("Learning Rate:").parent(learningRateParent)

    var learningRateDiv = createElement("div")
      .class("dropdown-select")
      .parent(learningRateParent);

    var learningRateSelect = createSelect()
      .id("learning-rate-select")
      .parent(learningRateDiv);

      learningRateSelect.option("0.00001");
      learningRateSelect.option("0.0001");
      learningRateSelect.option("0.001");
      learningRateSelect.option("0.003");

      learningRateSelect.selected("0.00001")

      // Batch Size:
      var batchSizeParent = createElement("div")
        .id("model-input")
        .parent("#model-interface");

      createP("Batch Size:").parent(batchSizeParent)

      var batchSizeDiv = createElement("div")
      .class("dropdown-select")
      .parent(batchSizeParent);

      var batchSizeSelect = createSelect()
      .id("batch-size-select")
      .parent(batchSizeDiv);

      batchSizeSelect.option("0.05");
      batchSizeSelect.option("0.1");
      batchSizeSelect.option("0.4");
      batchSizeSelect.option("1");

      batchSizeSelect.selected("1");

      // Epochs
      var epochsParent = createElement("div")
        .id("model-input")
        .parent("#model-interface");

      createP("Epochs:").parent(epochsParent)
      var epochsDiv = createElement("div")
      .class("dropdown-select")
      .parent(epochsParent);

      var epochsSelect = createSelect()
      .id("epochs-select")
      .parent(epochsDiv);

      epochsSelect.option("10");
      epochsSelect.option("20");
      epochsSelect.option("40");

      epochsSelect.selected("40");

      // Hidden Units
      var hiddenUnitsParent = createElement("div")
        .id("model-input")
        .parent("#model-interface");

      createP("Hidden Units:").parent(hiddenUnitsParent)
      var hiddenUnitsDiv = createElement("div")
      .class("dropdown-select")
      .parent(hiddenUnitsParent);

      var hiddenUnitsSelect = createSelect()
      .id("hidden-units-select")
      .parent(hiddenUnitsDiv);

      hiddenUnitsSelect.option("10");
      hiddenUnitsSelect.option("100");
      hiddenUnitsSelect.option("200");

      hiddenUnitsSelect.selected("200")

      
      d3.selectAll("#model-input").select(".dropdown-select")
        .style("transform", "translate(50%, 0px)");
        
      // Breaks
      createElement("br").parent("#model-interface");
      createElement("br").parent("#model-interface");
      createElement("br").parent("#model-interface");

      // d3.selectAll("#model-input").select("p")
      //   .style("transform", "translate(30%, 0px)");

  }

  createGameInterface()
  {
    var parent = select("#computer-box");
    var margin = {left: 10, right: 10, top: 10, bottom: 10}
    var size = Math.min(parent.width, parent.height) - margin.top - margin.bottom;

    var svg = d3.select("#computer-box")
      .style("background-color", "white")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%");

    var handImgGroup = svg.append("g");
  
    var handImgs = handImgGroup.selectAll("image")
      .data(GESTURES)
      .enter()
      .append("svg:image")
      .classed("computer-hand", true)
      .attr("xlink:href", function(d) { return "./assets/" + d + "-icon-grey.png"})
      .attr("id", function(d) { return "gesture-" + d + "-unselected"})
      .attr("x", function(d, i) {
        if (parent.height >= parent.width)
          return margin.left;
        else
          return ((parent.width / 2) - size / 2);
      })
      .attr("y", function() {
          if (parent.height >= parent.width)
            return margin.top;
          else
            return ((parent.height / 2) - size / 2);
        })
      .attr("width", size)
      .attr("height", size)
      .style("display", "none")
    

    var playButton = createButton("Shoot").class("button").parent("#score").mouseClicked(() => {
      d3.selectAll(".computer-hand").style("display", "none");
      document.getElementById("win-lose").innerHTML = "";

      setTimeout(() => {
        var rand = Math.floor(Math.random() * GESTURES.length)
        cpuHand = GESTURES[rand];

        d3.selectAll(".computer-hand")._groups[0][rand].style.display = "inline"
      }, 4000);

      countdownShoot();
    });

    playButton.elt.style.width = (select("#score").width - 30) + "px";
    playButton.elt.style.height = (select("#score").height - 20) + "px";



  }

  createVSInterface()
  {
    var parent = select("#vs-box");

    var svg = d3.select("#vs-box")
      .style("background-color", "white")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%");

    svg.append("text")
      .attr("id", "ready-training")
      .text( function(d) { return ""; })
      .attr("y", function(d, i) { return 50})
      .attr("x", function() { return parent.width / 2})
      .style("fill", "#f26422")
      .style("text-anchor", "middle")

    svg.append("text")
      .text( function(d) { return "VS"; })
      .attr("y", function(d, i) { return parent.height / 4})
      .attr("x", function() { return parent.width / 2})
      .style("text-anchor", "middle")

    svg.append("text")
      .attr("id", "timer")
      .text( function(d) { return ""; })
      .attr("y", function(d, i) { return parent.height / 2})
      .attr("x", function() { return parent.width / 2})
      .style("text-anchor", "middle")

      svg.append("text")
      .attr("id", "win-lose")
      .text( function(d) { return ""; })
      .attr("y", function(d, i) { return parent.height / 3})
      .attr("x", function() { return parent.width / 2})
      .style("text-anchor", "middle")
  }



  predictClass(classID)
  {
    d3.selectAll(".gesture-selected[display=inline]").attr("display", "none")
    d3.select("#gesture-" + GESTURES[classID] + "-selected").attr("display", "inline")

    playerHand = GESTURES[classID];
  }

  getEpochs()
  {
    return Number(select("#epochs-select").selected())
  }

  getBatchSize()
  {
    return Number(select("#batch-size-select").selected())
  }

  getHiddenUnits()
  {
    return Number(select("#hidden-units-select").selected())
  }

  getLearningRate()
  {
    return Number(select("#learning-rate-select").selected())
  }
}



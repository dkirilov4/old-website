
/* Color Palette: 
 *  Light-Grey: #e6e7e8
 *  Dark-Grey:  #5d5e61
 *  Orange:     #f26422
*/
const NUM_CLASSES = 3;

const ui = new UI();
const controllerDataset = new ControllerDataset(NUM_CLASSES);

let webcam;

let decapitatedMobilenet;
let model;

let predictButton;
let trainButton;
let saveButton;
let loadButton;

var canvas;

var playerHand = "rock";
var cpuHand = "rock";

function preload()
{
  // Load MobileNet:
  init();

  // Webcam:
  var capture = createCapture(VIDEO);
  canvas = createCanvas(100, 100).id("canvas");

  webcam = new Webcam(capture, canvas);

  // Load Data:

  // Train:
}

async function init()
{
  decapitatedMobilenet = await loadMobilenet();
}

async function train() {
  model = tf.sequential({
    layers: [
      tf.layers.flatten({
        inputShape: decapitatedMobilenet.outputs[0].shape.slice(1)
      }),
      tf.layers.dense({
        units: ui.getHiddenUnits(),
        activation: "relu",
        kernelInitializer: "varianceScaling",
        useBias: true
      }),
      tf.layers.dense({
        units: NUM_CLASSES,
        kernelInitializer: 'varianceScaling',
        useBias: false,
        activation: 'softmax'
      })
    ]
  });

  const optimizer = tf.train.adam(ui.getLearningRate());

  model.compile({optimizer: optimizer, loss: 'categoricalCrossentropy'});

  const batchSize =
      Math.floor(controllerDataset.activations.shape[0] * ui.getBatchSize());
      
  var numDots = 1;
  model.fit(controllerDataset.activations, controllerDataset.labels, {
    batchSize,
    epochs: ui.getEpochs(),
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        console.log('Loss: ' + logs.loss.toFixed(5));

        if (numDots > 3)
          numDots = 1;

        var dots = "";
        for (var i = 0; i < numDots; i++)
          dots += ".";

        document.getElementById("ready-training").innerHTML = dots;
        numDots++;
      },
      onTrainEnd: () => {
        document.getElementById("ready-training").innerHTML = "Ready";
      }
    }
  })
}

var isPredicting = false;
async function predict()
{
  console.log("Predicting...");

  while (isPredicting)
  {
    const predictedClass = tf.tidy(() => {
      const img = webcam.capture();

      const embeddings = decapitatedMobilenet.predict(img);

      const predictions = model.predict(embeddings);

      return predictions.as1D().argMax();
    });

    const classID = (await predictedClass.data())[0]
    predictedClass.dispose();

    ui.predictClass(classID);

    await tf.nextFrame();
  }

}

var t;
var timeLeft;
function countdownShoot()
{
  timeLeft = 4;
  
  t = setInterval(myTimer, 1000);
}


function myTimer() {
  document.getElementById("timer").innerHTML = --timeLeft;

  if (timeLeft <= 0)
  {
    document.getElementById("timer").innerHTML = "Shoot!";
    checkWinner();
    clearInterval(t);
  }
}

function checkWinner()
{
  if (cpuHand == playerHand)
    document.getElementById("win-lose").innerHTML = "Draw";
  else if ((playerHand == "rock" && cpuHand == "scissors") ||
           (playerHand == "paper" && cpuHand == "rock") ||
           (playerHand == "scissors" && cpuHand == "paper"))
    document.getElementById("win-lose").innerHTML = "Win";
  else
    document.getElementById("win-lose").innerHTML = "Lose";
}

function setup()
{
  ui.init();

  trainButton = createButton("Train").class("button").parent("#model-interface").mouseClicked(() => {
    console.log("Training...");

    isPredicting = false;
    train();
  });

  trainButton.elt.style.float = "left"

  predictButton = createButton("Predict").class("button").parent("#model-interface").mouseClicked(() => {
    isPredicting = true;
    predict();
  });

  predictButton.elt.style.float = "right"
  predictButton.elt.style.transform = "translate(-10px, 0)"

  webcam.init();
}

async function saveTFModel()
{
  const saveResult = await model.save("downloads://sign-language");
}

async function loadTFModel()
{
  const jsonUpload = document.getElementById('json-upload');
  const weightsUpload = document.getElementById('weights-upload');

  model = await tf.loadModel(
    tf.io.browserFiles([jsonUpload.files[0], weightsUpload.files[0]]));
}

function draw()
{
  webcam.show();
}

// Load MobileNet: 
async function loadMobilenet() {
  const mobilenet = await tf.loadModel(
    'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

  const layer = mobilenet.getLayer('conv_pw_13_relu');

  return tf.model({inputs: mobilenet.inputs, outputs: layer.output});
}

// Load Data:
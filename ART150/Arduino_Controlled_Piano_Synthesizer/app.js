'use strict';

// Johnny Five:
const five = require('johnny-five');
var argv = require("minimist")(process.argv.slice(2), {
  default: {
    show: 1
  }
});

//
// Express Server:
//
const express = require('express');

const app = express();
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html')
});

const server = require('http').createServer(app);

// Socket IO:
const io = require('socket.io')(server);

//
// "Sketch":
//
var board, button1, button2;

board = new five.Board();

board.on("ready", function() 
{
  console.log('Arduino is ready.');

  // Set Up Button:
  var touchpad;

  if (argv.show === 1) {
    touchpad = new five.Touchpad({
      controller: "MPR121",
      sensitivity: {
        press: 0.10,
        release: 0.05,
      },
    });
  }

  if (argv.show === 2) {
    touchpad = new five.Touchpad({
      controller: "MPR121",
      sensitivity: {
        press: 0.10,
        release: 0.05,
      },
      keys: [
        ["!", "@", "#"],
        ["$", "%", "^"],
        ["&", "-", "+"],
        ["_", "=", ":"]
      ]
    });
  }

  if (argv.show === 3) {
    touchpad = new five.Touchpad({
      controller: "MPR121",
      sensitivity: {
        press: 0.10,
        release: 0.05,
      },
      keys: ["!", "@", "#", "$", "%", "^", "&", "-", "+", "_", "=", ":"]
    });
  }

  ["press"].forEach(function(eventType) {
    touchpad.on(eventType, function(data) {
      console.log("Event: %s, Target: %s", eventType, data.which);
      io.emit("pressed", data.which)
    });
  });

  ["release"].forEach(function(eventType) {
    touchpad.on(eventType, function(data) {
      console.log("Event: %s, Target: %s", eventType, data.which);
      io.emit("released", data.which)
    });
  });
  // button1 = new five.Button(2);
  // button2 = new five.Button(3);

  // board.repl.inject({
  //   button: button1,
  //   button: button2
  // });

  // button1.on("down", function() {
  //   io.emit("down1", "message hello 1")
  //   console.log("down 1");
  // });

  // button2.on("down", function() {
  //   io.emit("down2", "message hello 2")
  //   console.log("down 2");
  // });

  // // Listen to Socket:
  // io.on("connection", function(client) {
  //   client.on("join", function(handshake) {
  //     console.log(handshake);
  //   })
  // });

  // Send Sockets:
  

  // "Press" Event:

//   // Every time a 'rgb' event is sent, listen to it and grab its new values for each individual colour
//     client.on('rgb', function(data) {
//       state.red = data.color === 'red' ? data.value : state.red;
//       state.green = data.color === 'green' ? data.value : state.green;
//       state.blue = data.color === 'blue' ? data.value : state.blue;

//       // Set the new colors
//       setStateColor(state);

//       client.emit('rgb', data);
//       client.broadcast.emit('rgb', data);
//     });

//     // Turn on the RGB LED
//     led.on();
//   });
});

function changeRectangleColor()
{
    d3.select(d3n.document.querySelector("#key")).style("fill", "red");
}

const port = process.env.PORT || 8080;

server.listen(port);
console.log(`Server listening on http://localhost:${port}`);
"use strict";

let _p5 = new p5();

let characterCreator = new CharacterCreator();

let player = new Player();

let narrative = new Narrative();

var img, ymin = -10, ymax = 10, y = 0, yspeed = 0.1;
var soundtrack;

function preload()
{
    soundtrack = loadSound('data/soundtrack.mp3');
}

function setup()
{
    let canvas = _p5.createCanvas(windowWidth, 100);
    canvas.position(0, innerHeight - 200);
    // canvas.style("z-index", -1);
    
    _p5.background(200, 200, 200, 0);

    img = loadImage("data/police_tape_2.png");

    document.getElementById("win-ending-container").style.display = "none";
    document.getElementById("lose-ending-1-container").style.display = "none";
    document.getElementById("lose-ending-2-container").style.display = "none";
    //document.getElementById("character-creator-container").style.display = "none";
    narrative.init();
    //document.getElementById("narrative-container").style.display = "none";
    //characterCreator.init();

    soundtrack.play();
}

function draw()
{
    narrative.update();

    image(img, y, 0, innerWidth, 100)
    // console.log(y);
    bounce();
}

function bounce()
{
    y += yspeed;
    if (y > ymax || y < ymin)
    {
        yspeed *= -1;
    }
}

function windowResized()
{
    _p5.createCanvas(windowWidth, windowHeight);
    _p5.background(200, 200, 200);
}
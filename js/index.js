const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let gameOn = false;

const arrowLeft = new Image();
arrowLeft.src ='./assets/staticLeft.png';
const arrowUp = new Image();
arrowUp.src ='./assets/staticUp.png';
const arrowDown = new Image();
arrowDown.src ='./assets/staticDown.png';
const arrowRight = new Image();
arrowRight.src ='./assets/staticRight.png';

class Note {
    constructor(){
        this.x = 0;
        this.y =0 ;
    }

    updatePosition(){
        this.y -= 20;
    }

    draw(){

    }
}

function animationLoop(){
  
    // draw placeholder arrows

    // update and draw moving arrows
}

function startGame(){

    if(!gameOn){
        gameOn = true;
        // start audio
        const audioElement = new Audio("./assets/Vitas - 7th Element (2002) _D.mp3.mp3");
        audioElement.play();
    }

}


window.onload = function() {
    document.getElementById("start-button").onclick = function() {
        startGame();
    }
}
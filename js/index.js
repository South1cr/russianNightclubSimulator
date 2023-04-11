const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.height = window.innerHeight;

let score = 0;
let streak = 0;
let gameOn = false;
let muted = false;
let animationInterval;
const audioElement = new Audio("./assets/Vitas - 7th Element (2002) _D.mp3.mp3");

let leftArrowIsPressed = false;
let upArrowIsPressed = false;
let downArrowIsPressed = false;
let rightArrowIsPressed = false;

const arrowLeft = new Image();
arrowLeft.src = './assets/staticLeft.png';
const greenLeft = new Image();
greenLeft.src = './assets/greenLeft.png';
const arrowUp = new Image();
arrowUp.src = './assets/staticUp.png';
const greenUp = new Image();
greenUp.src = './assets/greenUp.png';
const arrowDown = new Image();
arrowDown.src = './assets/staticDown.png';
const greenDown = new Image();
greenDown.src = './assets/greenDown.png';
const arrowRight = new Image();
arrowRight.src = './assets/staticRight.png';
const greenRight = new Image();
greenRight.src = './assets/greenRight.png';
/*
const arrowLeftDynamic = new Image()
arrowLeftDynamic.src = './assets/leftArrowDynamic.png'
const arrowUpDynamic = new Image();
arrowUpDynamic.src = "./assets/arrowBlue.gif";
*/
const notesArray = [];

const leftArrowPos = 1.5 * (canvas.width / 8);
const upArrowPos = 2.75 * (canvas.width / 8);
const downArrowPos = 4.0 * (canvas.width / 8);
const rightArrowPos = 5.25 * (canvas.width / 8);

const arrowWidth = 75;
const arrowHeight = 75;
const inputPadding = 15;
const maxNotes = 12;

function handleKeyPress(e) {
    switch (e.keyCode) {
        case 37:
            leftArrowIsPressed = !leftArrowIsPressed;
            break;
        case 38:
            upArrowIsPressed = !upArrowIsPressed;
            break;
        case 39:
            rightArrowIsPressed = !rightArrowIsPressed;
            break;
        case 40:
            downArrowIsPressed = !downArrowIsPressed;
            break;
    }
}

class Note {

    constructor(direction) {

        switch (direction) {
            case 'left':
                this.x = leftArrowPos;
                this.img = arrowLeft;
                this.secondaryImg = greenLeft;
                break;
            case 'up':
                this.x = upArrowPos;
                this.img = arrowUp;
                this.secondaryImg = greenUp;
                break;
            case 'down':
                this.x = downArrowPos;
                this.img = arrowDown;
                this.secondaryImg = greenDown;
                break;
            case 'right':
                this.x = rightArrowPos;
                this.img = arrowRight;
                this.secondaryImg = greenRight;
                break;
        }

        this.validated = false;
        this.y = 0;
        this.direction = direction;
    }

    updatePosition() {
        this.y += 2;
    }

    draw() {
        ctx.drawImage(this.validated ? this.secondaryImg : this.img, this.x, this.y, arrowWidth, arrowHeight)
    }
}

function createNote() {
    if(!gameOn){
        return;
    }
    let directions = ['left', 'up', 'down', 'right'];
    let noteDirection = directions[Math.floor(Math.random() * directions.length)]
    let randomSeed = Math.floor(Math.random() * 2.2)
    notesArray.push(new Note(noteDirection))
    if(notesArray.length > maxNotes){
        randomSeed *= 4;
    }
    setTimeout(() => {
        createNote()
    }, randomSeed*1000)       
    
}

function validateNote(note) {
    switch (note.direction) {
        case 'left':
            return leftArrowIsPressed;
        case 'up':
            return upArrowIsPressed;
        case 'down':
            return downArrowIsPressed;
        case 'right':
            return rightArrowIsPressed;
    }
}

function updateScore(){
    document.getElementById('score').innerHTML= score;
}

function animationLoop() {
    // clear rect
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // draw placeholder arrows
    ctx.drawImage(arrowLeft, leftArrowPos, canvas.height - arrowHeight, leftArrowIsPressed ? 4 + arrowWidth : arrowWidth, leftArrowIsPressed ? 4 + arrowHeight : arrowHeight)
    ctx.drawImage(arrowUp, upArrowPos, canvas.height - arrowHeight, upArrowIsPressed ? 4 + arrowWidth : arrowWidth, upArrowIsPressed ? 4 + arrowHeight : arrowHeight)
    ctx.drawImage(arrowDown, downArrowPos, canvas.height - arrowHeight, downArrowIsPressed ? 4 + arrowWidth : arrowWidth, downArrowIsPressed ? 4 + arrowHeight : arrowHeight)
    ctx.drawImage(arrowRight, rightArrowPos, canvas.height - arrowHeight, rightArrowIsPressed ? 4 + arrowWidth : arrowWidth, rightArrowIsPressed ? 4 + arrowHeight : arrowHeight)
    // update and draw moving arrows
    notesArray.forEach((note, i, arr) => {
        note.updatePosition();
        note.draw();
        if (note.y > canvas.height - arrowHeight - inputPadding && note.y < canvas.height - arrowHeight + inputPadding) {
            if (note.validated === false && validateNote(note)) { // start checking 10 pixels before
                note.validated = true;
                score += 100;
                streak +=1;
                updateScore();
            }
        }
        if (note.y > canvas.height) { // clear the note
            if (note.validated === false) {
                score -= 50;
                streak = 0;
                updateScore();
            }
            arr.splice(i, 1);
        }
    })

}

function pauseGame() {
    audioElement.pause();
    clearInterval(animationInterval);
    gameOn = false;
}

function startGame() {

    const startButton = document.getElementById("start-button");

    if (!gameOn) {
        gameOn = true;

        startButton.innerHTML = `
         <i class="fa-solid fa-pause"></i>
        `
        // start audio

        audioElement.play();

        animationInterval = setInterval(() => {
            animationLoop();
        }, 16);

        createNote();

    } else {
        startButton.innerHTML = `
        <i class="fa-solid fa-play"></i>
       `
        pauseGame();
    }

}

window.onload = function () {
    document.getElementById("start-button").onclick = startGame;
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("keyup", handleKeyPress);
}
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.height = window.innerHeight;

let score = 0;
let streak = 0;
let scoreMultiplier = 1;
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
const purpleLeft = new Image();
purpleLeft.src = './assets/purpleLeft.png';
const arrowUp = new Image();
arrowUp.src = './assets/staticUp.png';
const greenUp = new Image();
greenUp.src = './assets/greenUp.png';
const purpleUp = new Image();
purpleUp.src = './assets/purpleUp.png';
const arrowDown = new Image();
arrowDown.src = './assets/staticDown.png';
const greenDown = new Image();
greenDown.src = './assets/greenDown.png';
const purpleDown = new Image();
purpleDown.src = './assets/purpleDown.png';
const arrowRight = new Image();
arrowRight.src = './assets/staticRight.png';
const greenRight = new Image();
greenRight.src = './assets/greenRight.png';
const purpleRight = new Image();
purpleRight.src = './assets/purpleRight.png';

const arrowsArray = [];
const combosArray = [];

const arrowWidth = 110;
const arrowHeight = 110;
const inputPadding = 15;
const maxArrows = 4;

const leftArrowPos = 0;
const upArrowPos = 100;
const downArrowPos = 200;
const rightArrowPos = 298;

function handleKeyDown(e) {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
    switch (e.keyCode) {
        case 37:
            decrementScore()
            leftArrowIsPressed = true;
            break;
        case 38:
            decrementScore()
            upArrowIsPressed = true;
            break;
        case 39:
            decrementScore()
            rightArrowIsPressed = true;
            break;
        case 40:
            decrementScore()
            downArrowIsPressed = true;
            break;
    }
}


function handleKeyUp(e) {
    switch (e.keyCode) {
        case 37:
            leftArrowIsPressed = false;
            break;
        case 38:
            upArrowIsPressed = false;
            break;
        case 39:
            rightArrowIsPressed = false;
            break;
        case 40:
            downArrowIsPressed = false;
            break;
    }
}

class ArrowSprite {

    constructor(direction) {
        switch (direction) {
            case 'left':
                this.x = leftArrowPos;
                this.img = purpleLeft;
                this.secondaryImg = greenLeft;
                break;
            case 'up':
                this.x = upArrowPos;
                this.img = purpleUp;
                this.secondaryImg = greenUp;
                break;
            case 'down':
                this.x = downArrowPos;
                this.img = purpleDown;
                this.secondaryImg = greenDown;
                break;
            case 'right':
                this.x = rightArrowPos;
                this.img = purpleRight;
                this.secondaryImg = greenRight;
                break;
        }

        this.validated = false;
        this.y = 0;
        this.direction = direction;
    }

    updatePosition() {
        if(this.validated){
            this.y += 1;
        } else {
            this.y += 2;
        }
    }

    draw() {
        ctx.drawImage(this.validated ? this.secondaryImg : this.img, this.x, this.y, arrowWidth, arrowHeight)
    }
}

function createArrowSprite() {
    if(!gameOn){
        return;
    }
    let directions = ['left', 'up', 'down', 'right'];
    let arrowDirection = directions[Math.floor(Math.random() * directions.length)]
    let randomSeed = Math.floor(Math.random() * 2.2)
    if(arrowsArray.length < maxArrows){
        arrowsArray.push(new ArrowSprite(arrowDirection))
    }
    setTimeout(() => {
        createArrowSprite()
    }, randomSeed*1000)       
    
}  

class ScoreSprite {
    constructor(score, xPos){
        this.score = score;
        this.x=  xPos + arrowWidth / 2;
        this.y = canvas.height - arrowHeight * 1.5;
    }

    updatePosition(){
        this.y += .5;
    }

    draw(){
        ctx.fillStyle = '#eef577';
        ctx.font = '28px sans-serif';
        ctx.fillText(`${this.score}`, this.x, this.y);
    }   
}

function createScoreSprite(score, xPos){
    combosArray.push(new ScoreSprite(score, xPos));
}

function decrementScore(arrow){
    /*if(arrow){
        createScoreSprite(-100, arrow.x)
    }*/
    if(score > 0){
        score -= 100;
    }
}

function validateArrow(direction) {
    switch (direction) {
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

function animationLoop() {
    // clear rect
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // draw combo and score 
    ctx.fillStyle = '#eef577';
    ctx.font = '26px sans-serif';
    ctx.fillText(`Combo: ${scoreMultiplier}X  Score: ${score}`, 90, 30);
    // draw placeholder arrows
    ctx.drawImage(arrowLeft, leftArrowPos, canvas.height - arrowHeight * 1.5, leftArrowIsPressed ? 4 + arrowWidth : arrowWidth, leftArrowIsPressed ? 4 + arrowHeight : arrowHeight)
    ctx.drawImage(arrowUp, upArrowPos, canvas.height - arrowHeight * 1.5, upArrowIsPressed ? 4 + arrowWidth : arrowWidth, upArrowIsPressed ? 4 + arrowHeight : arrowHeight)
    ctx.drawImage(arrowDown, downArrowPos, canvas.height - arrowHeight * 1.5, downArrowIsPressed ? 4 + arrowWidth : arrowWidth, downArrowIsPressed ? 4 + arrowHeight : arrowHeight)
    ctx.drawImage(arrowRight, rightArrowPos, canvas.height - arrowHeight * 1.5, rightArrowIsPressed ? 4 + arrowWidth : arrowWidth, rightArrowIsPressed ? 4 + arrowHeight : arrowHeight)
    // update and draw moving arrows
    arrowsArray.forEach((arrow, i, arr) => {
        arrow.updatePosition();
        arrow.draw();
        if (arrow.y > canvas.height - (arrowHeight * 1.5) - inputPadding && arrow.y < canvas.height - (arrowHeight * 1.5) + inputPadding) {
            if (arrow.validated === false && validateArrow(arrow.direction)) { // start checking 10 pixels before
                arrow.validated = true;
                score += 100 + 100 * scoreMultiplier;
                streak +=1;
                createScoreSprite(100 * scoreMultiplier, arrow.x)
                if(streak > 10){
                    scoreMultiplier = 3;
                } else if(streak > 5){
                    scoreMultiplier = 2;
                } else {
                    scoreMultiplier = 1;
                }
            }
        }
        if (arrow.y > canvas.height) { // clear the arrow
            if (arrow.validated === false) {
                decrementScore(arrow)
                scoreMultiplier = 1;
                streak = 0;
            }
            arr.splice(i, 1);
        }
    })

    // handle combo text
    combosArray.forEach((combo, i, arr) => {
        combo.updatePosition();
        combo.draw();
        if (combo.y > canvas.height) { // clear the combo
            arr.splice(i, 1);
        }
    })

}

function pauseGame() {
    audioElement.pause();
    clearInterval(animationInterval);
    gameOn = false;
}

function muteGame(){

    const muteButton = document.getElementById("mute-button");

    if(muted){
        muteButton.innerHTML = `
        <i class="fa-solid fa-volume-xmark"></i>
       `;   
       audioElement.volume = 1;
       muted = false;
    } else {
        muteButton.innerHTML = `
        <i class="fa-solid fa-volume-high"></i>
       `;   
       audioElement.volume = 0;
        muted = true;
    }

}

function resetGame(){
    window.location.reload();
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
        }, 4);

        createArrowSprite();

    } else {
        startButton.innerHTML = `
        <i class="fa-solid fa-play"></i>
       `
        pauseGame();
    }

}

window.onload = function () {
    document.getElementById("start-button").onclick = startGame;
    document.getElementById("mute-button").onclick = muteGame;
    document.getElementById("reset-button").onclick = resetGame;
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
}
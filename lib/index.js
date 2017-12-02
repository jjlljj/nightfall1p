const Player1 = require('./Player1.js');
const Arrow = require('./Arrow.js'); 
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const Background = require('./Background.js');

let background = new Background();
let player1 = new Player1(ctx, 150, canvas.height/3,  background.platforms);
let Bodies = [player1];



function gameLoop() {
  draw();
  update();
  requestAnimationFrame(gameLoop);
}

function update() {
  let allArrows = player1.arrows;

  if (player1.isColliding(allArrows)) {
    player1.lives --;
    console.log(player1.lives)
    console.log('dead')
  }
  player1.update(); 
  player1.move(keyboarder);
}

// global arrows array
// pass global arrows array to 
// if (player1.isColliding(arrowsarray)) {
//  player2 lives --, player1 regen, until 0 }
// player2.isColliding(arrowsarray
// 


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  player1.draw();
}

function Keyboarder() {
  this.keyState = {};
  window.onkeydown = (e) => this.keyState[e.keyCode] = true;
  window.onkeyup = (e) => this.keyState[e.keyCode] = false;
}

Keyboarder.prototype.isDown = function(keyCode) {
    return this.keyState[keyCode] === true;
}

window.addEventListener('keydown', (event) => {
  if (event.keyCode === 188) {
    player1.arrow(player1);
  }
});

const keyboarder = new Keyboarder();
background.createBackground();
gameLoop();


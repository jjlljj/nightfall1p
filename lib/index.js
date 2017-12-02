const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const Player1 = require('./Player1.js');
const Player2 = require('./Player2.js');
const Arrow = require('./Arrow.js'); 
const Background = require('./Background.js');
const Keyboarder = require('./Keyboarder.js');

const keyboarder = new Keyboarder();
let background = new Background();
let player1 = new Player1(ctx, 150, canvas.height/3, background.platforms);
let player2 = new Player2(ctx, canvas.width - 150, canvas.height/3, background.platforms);
let Bodies = [player1, player2];

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  updateScreen();
  requestAnimationFrame(gameLoop);
}

function updateScreen() {
  let allArrows = player1.arrows;

  if (player1.isColliding(allArrows)) {
    player1.lives --;
    console.log(player1.lives, 'dead');
  }
  player1.update(); 
  player1.move(keyboarder);
  player2.update();
  player2.move(keyboarder);
}

background.createBackground();
gameLoop();


const Player = require('./Player.js');
const Arrow = require('./Arrow.js'); 
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const Background = require('./Background.js');

let background = new Background();
let disPlayer = new Player(150, canvas.height/3,  background.platforms);
let Bodies = [disPlayer];

function gameLoop() {
  draw(disPlayer);
  update();
  requestAnimationFrame(gameLoop);
}

function update() {
  disPlayer.update();
  disPlayer.move(keyboarder);
}

function draw(player) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);
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
    disPlayer.arrow(disPlayer);
  }
});

const keyboarder = new Keyboarder();
background.createBackground();
gameLoop();




const Player = require('./Player.js');
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const Background = require('./background.js');



<<<<<<< HEAD
let background = new Background();
let disPlayer = new Player(100, 100);
=======
let disPlayer = new Player(150, canvas.height - 40);
>>>>>>> f8646a19647044fc9fabdb1f97ae4e9b4bb611dc
console.log(disPlayer)

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
  ctx.fillRect(player.x, player.y, player.w, player.h);
}


function Keyboarder() {
  this.keyState = {};
  window.onkeydown = (e) => this.keyState[e.keyCode] = true;
  window.onkeyup = (e) => this.keyState[e.keyCode] = false;
}

Keyboarder.prototype.isDown = function(keyCode) {
    return this.keyState[keyCode] === true;
}

const keyboarder = new Keyboarder();
background.createBackground();
gameLoop();




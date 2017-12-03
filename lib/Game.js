const Player1 = require('./Player1.js');
const Player2 = require('./Player2.js');
const Powerup = require('./Powerup.js');
const Arrow = require('./Arrow.js'); 
const Background = require('./Background.js');
const Keyboarder = require('./Keyboarder.js');

class Game {
  constructor() {
    
    const canvas = document.getElementById('screen');
    const ctx = canvas.getContext('2d');
    const canvas2 = document.getElementById('background');
    const ctx2 = canvas2.getContext('2d');
    const canvas3 = document.getElementById('backdrop');
    const ctx3 = canvas3.getContext('2d');

    const keyboarder = new Keyboarder();
    let background = new Background(ctx2, ctx3);
  
    background.createBackground();
    setTimeout(() => background.drawBackground(), 200); 
    let player1 = new Player1(ctx, 175, 100, background.platforms, keyboarder);
    let player2 = new Player2(ctx, 785, 100, background.platforms, keyboarder);
    
    let Bodies = [player1, player2];

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      updateScreen();
      playerLives();
      requestAnimationFrame(gameLoop);
    }

    function playerLives() {
      ctx.fillStyle = 'red';
      if (player1.lives === 3) {
        ctx.fillRect(10, 10, 10, 10);
        ctx.fillRect(30, 10, 10, 10);
        ctx.fillRect(50, 10, 10, 10);
      } else if (player1.lives === 2) {
        ctx.fillRect(10, 10, 10, 10);
        ctx.fillRect(30, 10, 10, 10);
      } else if (player1.lives == 1) {
        ctx.fillRect(10, 10, 10, 10);
      }

      if (player2.lives === 3) {
        ctx.fillRect(canvas.width - 60, 10, 10, 10);
        ctx.fillRect(canvas.width - 40, 10, 10, 10);
        ctx.fillRect(canvas.width - 20, 10, 10, 10);
      } else if (player2.lives === 2) {
        ctx.fillRect(canvas.width - 40, 10, 10, 10);
        ctx.fillRect(canvas.width - 20, 10, 10, 10);
      } else if (player2.lives == 1) {
        ctx.fillRect(canvas.width - 20, 10, 10, 10);
      }
    }

    function updateScreen() {
      let allArrows = player1.arrows.concat(player2.arrows);

      if (player1.isColliding(allArrows)) {
        player1.hit();
      }
      if (player2.isColliding(allArrows)) {
        player2.hit();
      }
      player1.update(); 
      player2.update();
    }

    function callPowerup() {
      const powerup = new Powerup;
      powerup.draw();
    }

    setTimeout(() => gameLoop(), 450); 
  }
}

module.exports = Game;
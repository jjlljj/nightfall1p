const Player1 = require('./Player1.js');
const Player2 = require('./Player2.js');
const Powerup = require('./Powerup.js');
const Arrow = require('./Arrow.js'); 
const Background = require('./Background.js');
const Keyboarder = require('./Keyboarder.js');

class Game {
  constructor() {
    let canPowerup = true;
    let powerupInterval = Math.random() * 7000 + 2000;
    let powerup;

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
      renderAttributes();
      updatePowerup();
      requestAnimationFrame(gameLoop);
    }

    function renderAttributes() {
      //life rendering
      ctx.fillStyle = 'red';
      for (var i = 0; i < player1.lives; i++) {
        let pos = 10 + (i * 20);
        ctx.fillRect(pos, 10, 10, 10);
      }
      for (var i = 0; i < player2.lives; i++) {
        let pos = canvas.width - 20 - (i * 20);
        ctx.fillRect(pos, 10, 10, 10);
      }
      //arrow rendering
      ctx.fillStyle = 'blue';
      for (var i = 0; i < player1.quiver; i++) {
        let pos = 10 + (i * 20);
        ctx.fillRect(pos, 30, 5, 20);
      }
      for (var i = 0; i < player2.quiver; i++) {
        let pos = canvas.width - 15 - (i * 20);
        ctx.fillRect(pos, 30, 5, 20);
      }
      //speed rendering
      ctx.fillStyle = 'yellow';
      for (var i = 0; i < player1.upgradeSpeed; i++) {
        let pos = 10 + (i * 20);
        ctx.fillRect(pos, 60, 10, 10);
      }
      for (var i = 0; i < player2.upgradeSpeed; i++) {
        let pos = canvas.width - 15 - (i * 20);
        ctx.fillRect(pos, 60, 10, 10);
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
      setTimeout(() => {
        powerup = new Powerup;
        player1.powerup = powerup;
        player2.powerup = powerup;
      }, powerupInterval);
    }

    function updatePowerup() {
      if (canPowerup) {
        callPowerup();
        canPowerup = false;
      }
      if(powerup !== undefined) {
        powerup.draw();
      }
      if(player1.collectPowerup || player2.collectPowerup) {
        powerup = undefined;
        player1.powerup = undefined;
        player2.powerup = undefined;
        player1.collectPowerup = false;
        player2.collectPowerup = false;
        powerupInterval = Math.random() * 10000 + 10000;
        canPowerup = true;
      }
    }

    setTimeout(() => gameLoop(), 450); 
  }
}

module.exports = Game;
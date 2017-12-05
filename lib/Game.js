const Player1 = require('./Player1.js');
const Player2 = require('./Player2.js');
const Enemy = require('./Enemy.js');
const Powerup = require('./Powerup.js');
const Arrow = require('./Arrow.js'); 
const Background = require('./Background.js');
const Keyboarder = require('./Keyboarder.js');

class Game {
  constructor() {
    let canPowerup = true;
    let powerupInterval = Math.random() * 7000 + 2000;
    let powerup;
    let generateEnemy = false;
    let enemyGenTiming = 3500;

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

    let enemies = []
    let allArrows = []

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      updateScreen();
      updatePowerup();
      requestAnimationFrame(gameLoop);
    }

    function updateScreen() {
      allArrows = player1.arrows.concat(player2.arrows);
      if (player1.isColliding(allArrows) || player1.isColliding(enemies) && !player1.invincible) {
        player1.hit();
        player1.upgradeSpeed = 0;
        player1.upgradeQuiver = 0;
        player1.quiver = 3;
      }
      if (player2.isColliding(allArrows) || player2.isColliding(enemies) && !player2.invincible) {
        player2.hit();
        player2.upgradeSpeed = 0;
        player2.upgradeQuiver = 0;
        player2.quiver = 3;
      }
      player1.update(); 
      player2.update();
      updateEnemies()
    }

    function updateEnemies() {
      if (!generateEnemy) {
          setTimeout(() => {
          generateEnemy = true;
        }, enemyGenTiming)
      } else if (Math.random()>.996) {
        //monster noise here...
        console.log('monster')
        enemies.push(new Enemy(ctx, background.platforms))
        generateEnemy = false;
      }

      enemies.forEach((enemy, index) => {
        enemy.update()
        if (enemy.isColliding(allArrows) && !enemy.dead) {
          enemy.dead = true;
          let thisEnemy = [enemy]
          player1.arrows = player1.arrows.filter(arrow => {
            return !arrow.isColliding(thisEnemy)    
          })
          player2.arrows = player2.arrows.filter(arrow => {
            return !arrow.isColliding(thisEnemy)    
          })

          setTimeout(() => {
            enemies = enemies.filter(enemy => !enemy.dead)
          }, 900);
          console.log('kill')
        } 
      });
    }

    function callPowerup() {
      setTimeout(() => {
        powerup = new Powerup(ctx);
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
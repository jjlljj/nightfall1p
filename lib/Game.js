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

    let enemies = [];
    let allArrows = [];
    //this.gameLoop = this.gameLoop.bind(this);
    function gameLoop() {
      if (player1.lives > 0 && player2.lives > 0 && !keyboarder.isDown(32)) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = 1;
        updateScreen();
        updatePowerup();
        requestAnimationFrame(gameLoop);
      } else if (player1.lives === 0 || player2.lives === 0){
        gameOverScreen();
        keyboarder.keyState[32] = false;
          if (keyboarder.isDown(78)) { //78 = N
            newGame();
          }
        requestAnimationFrame(gameLoop)
      } else if (keyboarder.isDown(32)) {
        displayControls();
        requestAnimationFrame(gameLoop)
      } 
    } 

    function newGame() {
      player1 = new Player1(ctx, 175, 100, background.platforms, keyboarder);
      player2 = new Player2(ctx, 785, 100, background.platforms, keyboarder);
      enemies = [];
      allArrows = [];
      powerup = undefined;
      canPowerup = true;
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

    function gameOverScreen() {
      ctx.fillStyle = 'rgba(236, 236, 236, 0.7)';
      ctx.font = "bold 70pt Tahoma";
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', 500, 250);
      ctx.font = "italic bold 40pt Tahoma";
      if (player1.lives === 0) {
        ctx.fillText('Player 2 Wins!', 500, 420);
      } else {
        ctx.fillText('Player 1 Wins!', 500, 420);
      }
      ctx.font = 'italic 20pt Tahoma'
      ctx.fillText('Press [N] for new game', 500, 550);
    }

    function displayControls() {
      ctx.globalAlpha = 0.025;
      ctx.fillStyle = 'rgba(100, 100, 100, .2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(236, 236, 236, 0.7)';
      ctx.font = "bold 30pt Tahoma";
      ctx.textAlign = 'center';
      ctx.fillText('controls', 500, 50);
      ctx.fillText('Player 1', 250, 100);
      ctx.fillText('Left: A', 250, 200);
      ctx.fillText('Right: D', 250, 300);
      ctx.fillText('Jump: W', 250, 400);
      ctx.fillText('Shoot: Shift', 250, 500);
      ctx.fillText('Player 2', 750, 100);
      ctx.fillText('Left: [', 750, 200);
      ctx.fillText('Right: \\', 750, 300);
      ctx.fillText('Jump: =', 750, 400);
      ctx.fillText('Shoot: P', 750, 500);
      ctx.fillText('Press [spacebar] to play', 500, 600);
    }

    setTimeout(() => gameLoop(), 450); 
  }
}

module.exports = Game;
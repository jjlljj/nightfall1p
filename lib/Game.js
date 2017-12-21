const Player = require('./Player.js');
const Enemy = require('./Enemy.js');
const Powerup = require('./Powerup.js');
const Background = require('./Background.js');
const Boss = require('./Boss.js');
const Ninja = require('./Ninja.js');
const Mage = require('./Mage.js');
const Eye = require('./Eye.js');

class Game {
  constructor(canvas, canvas2, canvas3, ctx, ctx2, ctx3, keyboarder, player1Character, player2Character) {
    this.canPowerup = true;
    this.powerupInterval = Math.random() * 700 + 2000;
    this.powerup;
    this.generateEnemy = false;
    this.enemyGenTiming = 3500;

    this.canvas = canvas;
    this.canvas2 = canvas2;
    this.canvas3 = canvas3;
    this.ctx = ctx;
    this.ctx2 = ctx2;
    this.ctx3 = ctx3;
    
    this.keyboarder = keyboarder;
    this.background = new Background(this.ctx2, this.ctx3, 'level1');

  
  
    this.background.createBackground();
    setTimeout(() => this.background.drawBackground(), 200); 

    this.player1 = new player1Character(this.ctx, 175, 100, 
      this.background.platforms, this.keyboarder, 'player1');
    this.player2 = new player2Character(this.ctx, 785, 100, 
      this.background.platforms, this.keyboarder, 'player2');
    this.player1Character = player1Character;
    this.player2Character = player2Character;
    this.boss = new Boss(this.ctx, this.background.platforms, 
      this.player1, this.player2);

    this.enemies = [];
    this.allArrows = [];
    this.generateMonsterChance;
    this.canUsePortal = false;
    this.numberEyeSpawn = 4;
    this.randomX;
    this.randomY;
  }
  
  gameLoop() {
    this.gameLoop = this.gameLoop.bind(this)
    if (this.player1.lives > 0 
      && this.player2.lives > 0 
      && !this.keyboarder.isDown(32)) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.globalAlpha = 1;
      this.updateScreen();
      this.updatePowerup();
      requestAnimationFrame(this.gameLoop);
    } else if (this.player1.lives === 0 || this.player2.lives === 0) {
      this.gameOverScreen();
      this.keyboarder.keyState[32] = false;
      if (this.keyboarder.isDown(78)) {
        this.newGame();
      }
      requestAnimationFrame(this.gameLoop)
    } else if (this.keyboarder.isDown(32)) {
      this.displayControls();
      requestAnimationFrame(this.gameLoop)
    } 
  } 

  newGame() {
    this.player1 = new this.player1Character(this.ctx, 175, 100, 
      this.background.platforms, this.keyboarder, 'player1');
    this.player2 = new this.player2Character(this.ctx, 785, 100, 
      this.background.platforms, this.keyboarder, 'player2');
    this.enemies = [];
    this.allArrows = [];
    this.powerup = undefined;
    this.canPowerup = true;
  }

  updateScreen() {
    this.allArrows = this.player1.arrows.concat(this.player2.arrows).concat(this.boss.arrows);

    if ((this.player1.isColliding(this.allArrows) 
      || this.player1.isColliding(this.enemies)) 
      && !this.player1.invincible) {
      this.filterCollidingArrows([this.player1])
      this.player1.hit();
      this.player1.upgradeSpeed = 0;
      this.player1.upgradeQuiver = 0;
      this.player1.quiver = 3;
    }
    if ((this.player2.isColliding(this.allArrows) 
      || this.player2.isColliding(this.enemies)) 
      && !this.player2.invincible) {
      this.filterCollidingArrows([this.player2])
      this.player2.hit();
      this.player2.upgradeSpeed = 0;
      this.player2.upgradeQuiver = 0;
      this.player2.quiver = 3;
    }
    this.player1.update(); 
    this.player2.update();

    this.drawPortal();
    this.updateEnemies();
  }

  versus() {
    this.generateMonsterChance = 0.001;
    // setTimeout(() => {
    //   this.spawnEyes();
    // }, 2000);
  }

  coop() {
    this.generateMonsterChance = 0.004;
    const bossTiming = 5000; //50 sec
    const eyeSpawnInterval = 9500 //7.5 sec
    
    let spawnEye = setInterval(() => {
      //limit eyes on boss appearance, otherwise increment
      if(this.generateMonsterChance === 0) {
        this.numberEyeSpawn = 2;
      } else {
        this.numberEyeSpawn++;
      }
      //call eye spawning
      this.spawnEyes();
    }, eyeSpawnInterval);

    setTimeout(() => {
      this.enemies.push(this.boss);
      this.numberEyeSpawn = 2;
      this.generateMonsterChance = 0;
    }, bossTiming)
  }

  spawnEyes() {
    this.randomX = Math.random() * 700 + 150;
    this.randomY = Math.random() * 700;
    this.canUsePortal = true;
    const delaySpawn = 2500;
    const closePortal = 4500;
    const spawnInterval = 300;
    let counter = 1;

    setTimeout(() => {
      let spawn = setInterval(() => {
        if (counter === this.numberEyeSpawn) {
          clearInterval(spawn);
        }
        this.enemies.push(new Eye(this.randomX, this.randomY, 
          this.ctx, this.player1, this.player2));
        counter++;
      }, spawnInterval);
    }, delaySpawn);

    setTimeout(() => {
      this.canUsePortal = false;
    }, closePortal)
  }

  drawPortal() {
    if (this.canUsePortal) {
      const width = 120;
      const height = 150;
     
      let img = new Image()
      img.src = "../assets/portal-sprite.png"
      this.ctx.globalAlpha = 0.7;
      this.ctx.drawImage(img, this.randomX - width/2 + 10, this.randomY - height/2 + 10, width, height);
      this.ctx.globalAlpha = 1;
    }
  }

  updateEnemies() {

    if (!this.generateEnemy) {
      setTimeout(() => {
        this.generateEnemy = true;
      }, this.enemyGenTiming)
    } else if (Math.random() < this.generateMonsterChance) {
      this.enemies.push(new Enemy(this.ctx, this.background.platforms))
      this.generateEnemy = false;
    }

    this.enemies.forEach((enemy) => {
      enemy.update()
      if (enemy.isColliding(this.allArrows) && enemy instanceof Boss && !enemy.dead) {
        enemy.hitBoss()
        this.filterCollidingArrows([enemy])

        setTimeout(() => {
          this.enemies = this.enemies.filter(enemy => !enemy.dead)
        }, 900);
      } else if (enemy.isColliding(this.allArrows) && !enemy.dead) {
        enemy.dead = true;
        this.filterCollidingArrows([enemy])

        setTimeout(() => {
          this.enemies = this.enemies.filter(enemy => !enemy.dead)
        }, 900);
      } 
    });
  }

  filterCollidingArrows(target) {
    this.player1.arrows = this.player1.arrows.filter(arrow => {
          return !arrow.isColliding(target)    
        })
    this.player2.arrows = this.player2.arrows.filter(arrow => {
          return !arrow.isColliding(target)    
        })
  }

  callPowerup() {
    setTimeout(() => {
      this.powerup = new Powerup(this.ctx);
      this.player1.powerup = this.powerup;
      this.player2.powerup = this.powerup;
    }, this.powerupInterval);
  }

  updatePowerup() {
    if (this.canPowerup) {
      this.callPowerup();
      this.canPowerup = false;
    }
    if (this.powerup !== undefined) {
      this.powerup.draw();
    }
    if (this.player1.collectPowerup || this.player2.collectPowerup) {
      this.powerup = undefined;
      this.player1.powerup = undefined;
      this.player2.powerup = undefined;
      this.player1.collectPowerup = false;
      this.player2.collectPowerup = false;
      this.powerupInterval = Math.random() * 10000 + 5000;
      this.canPowerup = true;
    }
  }

  gameOverScreen() {
    this.ctx.fillStyle = 'rgba(236, 236, 236, 0.7)';
    this.ctx.font = "bold 70pt Tahoma";
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Over', 500, 250);
    this.ctx.font = "italic bold 40pt Tahoma";
    if (this.player1.lives === 0) {
      this.ctx.fillText('Player 2 Wins!', 500, 420);
    } else {
      this.ctx.fillText('Player 1 Wins!', 500, 420);
    }
    this.ctx.font = 'italic 20pt Tahoma'
    this.ctx.fillText('Press [N] for new game', 500, 550);
  }

  displayControls() {
    this.ctx.globalAlpha = 0.025;
    this.ctx.fillStyle = 'rgba(100, 100, 100, .2)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'rgba(236, 236, 236, 0.7)';
    this.ctx.font = "bold 30pt Tahoma";
    this.ctx.textAlign = 'center';
    this.ctx.fillText('controls', 500, 50);
    this.ctx.fillText('Player 1', 250, 100);
    this.ctx.fillText('Left: A', 250, 200);
    this.ctx.fillText('Right: D', 250, 300);
    this.ctx.fillText('Jump: W', 250, 400);
    this.ctx.fillText('Shoot: Shift', 250, 500);
    this.ctx.fillText('Player 2', 750, 100);
    this.ctx.fillText('Left: [', 750, 200);
    this.ctx.fillText('Right: \\', 750, 300);
    this.ctx.fillText('Jump: =', 750, 400);
    this.ctx.fillText('Shoot: P', 750, 500);
    this.ctx.fillText('Press [spacebar] to play', 500, 600);
  }

}


module.exports = Game;
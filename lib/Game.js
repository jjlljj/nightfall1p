const Player = require('./Player.js');
const Enemy = require('./Enemy.js');
const Powerup = require('./Powerup.js');
const Background = require('./Background.js');
const Boss = require('./Boss.js');
const Ninja = require('./Ninja.js');
const Mage = require('./Mage.js');
const Eye = require('./Eye.js');
const Clock = require('./Clock.js');

class Game {
  constructor(mode, canvas, canvas2, canvas3, ctx, ctx2, ctx3, keyboarder, player1Character, player2Character) {
    this.mode = mode;
    this.canvas = canvas;
    this.canvas2 = canvas2;
    this.canvas3 = canvas3;
    this.ctx = ctx;
    this.ctx2 = ctx2;
    this.ctx3 = ctx3;
    
    this.keyboarder = keyboarder;
    this.clock = new Clock();
    this.background = new Background(this.ctx2, this.ctx3, 'level1');
    this.level;

    this.player1 = new player1Character(this.ctx, 175, 100, 
      this.background.platforms, this.keyboarder, 'player1');
    this.player2 = new player2Character(this.ctx, 785, 100, 
      this.background.platforms, this.keyboarder, 'player2');
    this.player1Character = player1Character;
    this.player2Character = player2Character;
    this.boss = new Boss(this.ctx, this.background.platforms, 
      this.player1, this.player2);

    this.canPowerup = true;
    this.powerupInterval = Math.random() * 7000 + 2000;
    this.powerup;
    this.generateEnemy = false;
    this.enemyGenTiming = 3500;
    this.enemies = [];
    this.allArrows = [];
    this.generateMonsterChance;
    this.canUsePortal = false;
    this.numberEyeSpawn = 2;
    this.randomX;
    this.randomY;
    this.paused = true;
    this.monsterKillCount = 0;
  }
  
  gameLoop() {
    const vsCondition = this.player1.lives > 0 
      && this.player2.lives > 0 
      && !this.keyboarder.isDown(32)
      && this.mode === 'versus'
    const coopCondition = (this.player1.lives > 0 
      || this.player2.lives > 0) 
      && !this.keyboarder.isDown(32)
      && this.mode === 'coop'
    const coopVictoryLevel1 = (this.monsterKillCount === 100
      && this.level === 'level1')
    const coopVictoryLevel2 = (this.boss.lives === 0 
      && this.level === 'level2')

    this.gameLoop = this.gameLoop.bind(this)

    if (vsCondition || coopCondition) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.paused = false
      this.ctx.globalAlpha = 1;
      this.updateScreen();
      this.updatePowerup();
      if(coopVictoryLevel2 || coopVictoryLevel1) {
        this.coopVictoryScreen();
        return;
      }
      requestAnimationFrame(this.gameLoop);

    } else if ((this.player1.lives === 0 || this.player2.lives === 0) && this.mode === 'versus') {
      this.paused = true
      this.gameOverScreen();
      this.keyboarder.keyState[32] = false;
      if (this.keyboarder.isDown(78)) {
        this.newGame();
      }
      requestAnimationFrame(this.gameLoop)

    } else if ((this.player1.lives === 0 && this.player2.lives === 0) && this.mode === 'coop') {
      this.paused = true
      this.coopOverScreen();
      this.keyboarder.keyState[32] = false;
      requestAnimationFrame(this.gameLoop)

    } else if (this.keyboarder.isDown(32)) {
      this.paused = true
      this.displayControls();
      requestAnimationFrame(this.gameLoop)
    }
  } 

  newGame() {
    this.background.platforms = []
    this.level === 'level1' ? 
      this.selectBackground('level2') : this.selectBackground('level1');
    this.level = this.level === 'level1' ? 'level2' : 'level1';
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
    this.instructions();
  }

  selectBackground(level) {
    this.ctx2.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx3.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.background.changeBackground(level)
    this.background.createBackground();
    setTimeout(() => this.background.drawBackground(), 200); 
  }

  versus() {
    const eyeSpawnInterval = 14500
    const randomLevel = ['level1', 'level2'][Math.floor(Math.random() * 2)];
    this.selectBackground(randomLevel);
    this.generateMonsterChance = 0.001;
    this.level = randomLevel === 'level1' ? 'level1' : 'level2';

    const spawnEye = setInterval(() => {
      if (!this.paused ) { this.spawnEyes() }
    }, eyeSpawnInterval);
  }

  coop() {
    const randomLevel = ['level1', 'level2'][Math.floor(Math.random() * 2)];
    this.selectBackground(randomLevel);
    this.level = randomLevel === 'level1' ? 'level1' : 'level2';
    this.generateMonsterChance = 0.003;
    this.numberEyeSpawn = 1;
    const bossTiming = 20000; //50 sec
    const eyeSpawnInterval = 9500 //9.5 sec
    
    let spawnEye = setInterval(() => {
      //limit eyes on boss appearance, otherwise increment
      if(this.generateMonsterChance === 0) {
        this.numberEyeSpawn = 1;
      } 
      //call eye spawning
      if (!this.paused ) {
        this.spawnEyes();
        this.numberEyeSpawn++;
      }
    }, eyeSpawnInterval);

    if (this.level === 'level2') {
      setTimeout(() => {
        this.enemies.push(this.boss);
        this.numberEyeSpawn = 2;
        this.generateMonsterChance = 0;
      }, bossTiming)
    }
  }

  spawnEyes() {
    this.randomX = Math.random() * 700 + 150;
    this.randomY = Math.random() * 500 + 100;
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
        this.monsterKillCount++;
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
    this.ctx.font = "70pt arcadeclassicregular";
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Over', 500, 250);
    this.ctx.font = "40pt arcadeclassicregular";
    if (this.player1.lives === 0) {
      this.ctx.fillText('Player 2 Wins!', 500, 420);
    } else {
      this.ctx.fillText('Player 1 Wins!', 500, 420);
    }
    this.ctx.font = '20pt arcadeclassicregular'
    this.ctx.fillText('Press [N] for new game', 500, 550);
  }

  coopOverScreen() {
    this.ctx.fillStyle = 'rgba(236, 236, 236, 0.7)';
    this.ctx.font = "70pt arcadeclassicregular";
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Over', 500, 250);
  }

  coopVictoryScreen() {
    this.ctx.fillStyle = 'rgba(236, 236, 236, 0.7)';
    this.ctx.font = "70pt arcadeclassicregular";
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Victory', 500, 250);
  }

  instructions() {
    this.ctx.fillStyle = 'rgba(103, 128, 159, 0.9)';
    this.ctx.font = "16pt arcadeclassicregular";
    this.ctx.textAlign = 'center';
    if(this.mode === 'coop' && this.level === 'level1') {
      this.ctx.fillText('Kill 100 monsters: ' + this.monsterKillCount, 500, 20);
    }
    if (this.mode === 'coop' && this.level === 'level2') {
      this.ctx.fillText('Defeat the Boss', 500, 20);
    }
    if(this.mode === 'versus') {
      this.ctx.fillText('Defeat the  other  Player', 500, 20)
    }
  }

  displayControls() {
    const controls1 = new Image(50, 40);
    const controls2 = new Image(50, 40);
    controls1.src = '../assets/p1-controls.png'
    controls2.src = '../assets/p2-controls.png'


    this.ctx.globalAlpha = 0.025;
    this.ctx.fillStyle = 'rgba(100, 100, 100, .2)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'rgba(236, 236, 236, 0.7)';
    this.ctx.font = "30pt arcadeclassicregular";
    this.ctx.textAlign = 'center';
    this.ctx.fillText('controls', 500, 50);
    this.ctx.fillText('Player 1', 250, 100);
    this.ctx.drawImage(controls1, 59, 180, 350, 260)
    this.ctx.fillText('Player 2', 750, 100);
    this.ctx.drawImage(controls2, 550, 250, 370, 180)
    this.ctx.fillText('Press [spacebar] to play', 500, 600);
  }
}


module.exports = Game;
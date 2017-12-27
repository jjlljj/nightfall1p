const Player = require('./Player.js');
const Enemy = require('./Enemy.js');
const Powerup = require('./Powerup.js');
const Secret = require('./Secret.js');
const Background = require('./Background.js');
const Boss = require('./Boss.js');
const Ninja = require('./Ninja.js');
const Mage = require('./Mage.js');
const Eye = require('./Eye.js');
const Joker = require('./Joker.js')
const Cerberus = require('./Cerberus.js')
//const Clock = require('./Clock.js');

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
    //this.clock = new Clock();
    this.background = new Background(this.ctx2, this.ctx3, 'level1');
    this.level = 'level3';

    this.player1 = new player1Character(this.ctx, 175, 100, 
      this.background.platforms, this.keyboarder, 'player1');
    this.player2 = new player2Character(this.ctx, 785, 100, 
      this.background.platforms, this.keyboarder, 'player2');
    this.player1Character = player1Character;
    this.player2Character = player2Character;
    this.boss = new Boss(this.ctx, this.background.platforms, 
      this.player1, this.player2);
    this.joker = new Joker(500, 350, this.ctx, this.player1, this.player2)
    this.canSpawnJoker = true;
    this.jokerRespawnTime = 2500;
    this.cerberus;

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
    this.secret;
    this.secretCollected = 0;
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
    const coopVictoryLevel1 = (this.monsterKillCount >= 50
      && this.level === 'level1')
    const coopVictoryLevel2 = (this.boss.lives === 0 
      && this.level === 'level2')
    const coopVictoryLevel3 = (this.secretCollected === 10 
      && this.level === 'level3')

    this.gameLoop = this.gameLoop.bind(this)

    if (vsCondition || coopCondition) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.globalAlpha = 1;
      this.updateScreen();
      this.paused = false;
      if(coopVictoryLevel1 || coopVictoryLevel2 || coopVictoryLevel3) {
        this.coopVictoryScreen();
        return;
      }
      requestAnimationFrame(this.gameLoop);

    } else if ((this.player1.lives === 0 || this.player2.lives === 0) && this.mode === 'versus') {
      this.gameOverScreen();
      this.keyboarder.keyState[32] = false;
      if (this.keyboarder.isDown(78)) {
        this.newGame();
      }
      requestAnimationFrame(this.gameLoop)

    } else if ((this.player1.lives === 0 && this.player2.lives === 0) && this.mode === 'coop') {
      this.coopOverScreen();
      this.keyboarder.keyState[32] = false;
      requestAnimationFrame(this.gameLoop)

    } else if (this.keyboarder.isDown(32)) {
      this.displayControls();
      this.paused = true;
      requestAnimationFrame(this.gameLoop)
    }
  } 

  updateScreen() {
    this.playerHit();
    this.player1.update(); 
    this.player2.update();
    this.transport();
    this.updatePowerup();
    this.drawPortal();
    this.updateEnemies();
    this.createEnemy();
    this.instructions();
    this.level3();
  }

  newGame() {
    this.background.platforms = []
    this.selectRandomLevel();
    this.player1 = new this.player1Character(this.ctx, 175, 100, 
      this.background.platforms, this.keyboarder, 'player1');
    this.player2 = new this.player2Character(this.ctx, 785, 100, 
      this.background.platforms, this.keyboarder, 'player2');
    this.enemies = [];
    this.allArrows = [];
    this.powerup = undefined;
    this.canPowerup = true;
  }

  selectBackground(level) {
    this.ctx2.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx3.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.background.changeBackground(level)
    this.background.createBackground();
    setTimeout(() => this.background.drawBackground(), 200); 
  }

  versus() {
    this.selectRandomLevel();
    this.generateMonsterChance = 0.001;
    const eyeSpawnInterval = 14500
    const spawnEye = setInterval(() => {
      if (!this.paused ) this.spawnEyes();
    }, eyeSpawnInterval);
  }

  coop() {
    this.selectBackground('level3')
    this.level = 'level3'
    //this.selectRandomLevel();
    this.generateMonsterChance = 0.005;
    const bossTiming = 20000
    const eyeSpawnInterval = 9500

    if (this.level === 'level1') {
      setInterval(() => {
        if (!this.paused) {
          this.spawnEyes(); 
          if (this.numberEyeSpawn < 6) this.numberEyeSpawn++;
        }
      }, eyeSpawnInterval);

    } else if (this.level === 'level2') {
      setInterval(() => {
        if (!this.paused) this.spawnEyes();
      }, eyeSpawnInterval);
      
      setTimeout(() => {
        this.enemies.push(this.boss);
        this.generateMonsterChance = 0;
      }, bossTiming)

    } else if (this.level === 'level3') {
      this.secret = new Secret(this.ctx)
      this.enemies.push(this.joker)
      //this.enemies.push(this.cerberus);
      this.generateMonsterChance = 0

      setInterval(() => {
        if (!this.paused && !this.secret) this.secret = new Secret(this.ctx);
      }, eyeSpawnInterval);
    }
  }

  selectRandomLevel() {
    const allLevels = ['level1', 'level2', 'level3']
    const randomLevel = allLevels[Math.floor(Math.random() * allLevels.length)];
    this.selectBackground(randomLevel);
    this.level = randomLevel
  }

  transport() {
    const allBodies = [
      this.player1, this.player2, this.boss, 
      ...this.allArrows,
      ...this.enemies
    ]

    if (this.level === 'level1' || this.level === 'level2') {
      allBodies.forEach(body => {
        if (body.x > 1000) body.x = 0;
        else if (body.x < 0) body.x = 1000;

        if (body.y > 750) body.y = 0;
      })

    } else if (this.level === 'level3') {
       allBodies.forEach(body => {
        if (body.x > 1000 && body.y > 300) {
          body.x = 0;
          body.y -= 340;
        } else if (body.x < 0 && body.y < 320) {
          body.x = 1000;
          body.y += 340;
        } 

        if (body.x > 1000 && body.y < 300) {
          body.x = 0;
          body.y += 350
        } else if (body.x < 0 && body.y > 320) {
          body.x = 1000;
          body.y -= 350;
        }

        if (body.y > 750) {
          body.y = 0;
          body.x += 650;
        }
      })
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
        if (counter >= this.numberEyeSpawn) {
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

  playerHit() {
    this.allArrows = [
      ...this.player1.arrows, 
      ...this.player2.arrows, 
      ...this.boss.arrows
      ]
    const player1HitCondition = (this.player1.isColliding(this.allArrows) 
      || this.player1.isColliding(this.enemies)) 
      && !this.player1.invincible
    const player2HitCondition = (this.player2.isColliding(this.allArrows) 
      || this.player2.isColliding(this.enemies)) 
      && !this.player2.invincible

    if (player1HitCondition) {
      this.filterCollidingArrows([this.player1])
      this.player1.hit();
      this.player1.upgradeSpeed = 0;
      this.player1.quiver = 3;
    }
    if (player2HitCondition) {
      this.filterCollidingArrows([this.player2])
      this.player2.hit();
      this.player2.upgradeSpeed = 0;
      this.player2.quiver = 3;
    }
  }

  updateEnemies() {
    this.enemies.forEach((enemy) => {
      enemy.update()
      if (enemy.isColliding(this.allArrows) && enemy instanceof Joker && !enemy.dead) {
        enemy.hitA();
        this.filterCollidingArrows([enemy])
        setTimeout(() => {
          this.enemies = this.enemies.filter(enemy => !enemy.dead)
        }, 900);
        if (this.joker.lives === 0) { /// ???
          this.joker = undefined
        } 

      } else if (enemy.isColliding(this.allArrows) && enemy instanceof Cerberus && !enemy.dead) {
        enemy.hitA()
        this.filterCollidingArrows([enemy])

        setTimeout(() => {
          this.enemies = this.enemies.filter(enemy => !enemy.dead)
        }, 900);

      } else if (enemy.isColliding(this.allArrows) && enemy instanceof Boss && !enemy.dead) {
        enemy.hitBoss()
        this.filterCollidingArrows([enemy])

        setTimeout(() => {
          this.enemies = this.enemies.filter(enemy => !enemy.dead)
        }, 900);

      } else if (enemy.isColliding(this.allArrows) && !enemy.dead && !enemy.invincible) {
        this.monsterKillCount++;
        enemy.dead = true;
        this.filterCollidingArrows([enemy])

        setTimeout(() => {
          this.enemies = this.enemies.filter(enemy => !enemy.dead)
        }, 900);
      } 
    });
  }

  createEnemy() {
    if (!this.generateEnemy) {
      setTimeout(() => {
        this.generateEnemy = true;
      }, this.enemyGenTiming)
    } else if (Math.random() < this.generateMonsterChance) {
      this.enemies.push(new Enemy(this.ctx, this.background.platforms))
      this.generateEnemy = false;
    }
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

  level3() {
        this.jokerRespawnTime -= (this.secretCollected * 150); 
    if (this.secret) {
      this.secret.draw();
      if (this.secret.isColliding([this.player1, this.player2])) {
        this.secretCollected ++;
        if (this.ceberus === undefined || this.cerberus.dead) { 
          this.cerberus = new Cerberus(this.ctx, 530, 600, this.player1, this.player2, this.background.platforms);
          setTimeout(() => {this.enemies.push(this.cerberus)}, 1000);
        }
        this.secret = undefined;
        if (this.joker) this.joker.speed += this.secretCollected * 0.13;
      }
    }

    if (this.joker === undefined) {
      if (this.canSpawnJoker) {
        this.canSpawnJoker = false;
        setTimeout(() => {
          this.joker = new Joker(500, 350, this.ctx, this.player1, this.player2)
          this.enemies.push(this.joker);
          this.joker.speed += this.secretCollected * 0.13;
          this.canSpawnJoker = true;
        }, this.jokerRespawnTime)
      }
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
      this.ctx.fillText(`Defeat ${50 - this.monsterKillCount} monsters`, 500, 20);
    } else if (this.mode === 'coop' && this.level === 'level2') {
      this.ctx.fillText('Defeat the Boss', 500, 20);
    } else if (this.mode === 'coop' && this.level === 'level3') {
      this.ctx.fillText(`Collect ${10 - this.secretCollected}   Secrets`, 500, 20)
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
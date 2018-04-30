/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const Keyboarder = __webpack_require__(23);
	const canvas = document.getElementById('screen');
	const canvas2 = document.getElementById('background');
	const canvas3 = document.getElementById('backdrop');
	const ctx = canvas.getContext('2d');
	const ctx2 = canvas2.getContext('2d');
	const ctx3 = canvas3.getContext('2d');
	const keyboarder = new Keyboarder();

	function startGame() {
	  const currentGame = new Game(mode, canvas, canvas2, canvas3, ctx, ctx2, ctx3, keyboarder, player1Character, Ninja, level);

	  //mode === 'versus' ? currentGame.versus() : currentGame.coop();
	  currentGame.singlePlayer();
	  setTimeout(() => currentGame.gameLoop(), 450);
	}

	//menu events and variables
	let mode = "singlePlayer";
	let level;
	const menu = document.querySelector('#menu');
	const coop = document.querySelector('.coop');

	coop.addEventListener('click', () => {
	  menu.style.zIndex = -1;
	  mode = 'coop';
	});

	//character selection events and variables
	let player1Character;
	const characterSelection = document.querySelector('#character-selection');
	const selectText = document.querySelector('.select-text');
	const archerSelect = document.querySelector('.archer');
	const assassinSelect = document.querySelector('.assassin');
	const mageSelect = document.querySelector('.mage');
	const Player = __webpack_require__(2);
	const Ninja = __webpack_require__(16);
	const Mage = __webpack_require__(18);

	archerSelect.addEventListener('click', () => {
	  if (!player1Character) {
	    player1Character = Player;
	    characterSelection.style.zIndex = -1;
	    startGame();
	  }
	});

	assassinSelect.addEventListener('click', () => {
	  if (!player1Character) {
	    player1Character = Ninja;
	    characterSelection.style.zIndex = -1;
	    startGame();
	  }
	});

	mageSelect.addEventListener('click', () => {
	  if (!player1Character) {
	    player1Character = Mage;
	    characterSelection.style.zIndex = -1;
	    startGame();
	  }
	});

	const selectLevel1 = document.querySelector('.select-level-1');
	const selectLevel2 = document.querySelector('.select-level-2');
	const selectLevel3 = document.querySelector('.select-level-3');

	selectLevel1.addEventListener('click', () => {
	  level = 'level1';
	});

	selectLevel2.addEventListener('click', () => {
	  level = 'level2';
	});

	selectLevel3.addEventListener('click', () => {
	  level = 'level3';
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(2);
	const Enemy = __webpack_require__(6);
	const Powerup = __webpack_require__(7);
	const Secret = __webpack_require__(8);
	const Background = __webpack_require__(9);
	const Boss = __webpack_require__(14);
	const Ninja = __webpack_require__(16);
	const Mage = __webpack_require__(18);
	const Eye = __webpack_require__(20);
	const Joker = __webpack_require__(21);
	const Cerberus = __webpack_require__(22);
	//const Clock = require('./Clock.js');

	class Game {
	  constructor(mode, canvas, canvas2, canvas3, ctx, ctx2, ctx3, keyboarder, player1Character, player2Character, level) {
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
	    this.level = level || 'level1';

	    this.player1 = new player1Character(this.ctx, 175, 100, this.background.platforms, this.keyboarder, 'player1');
	    this.player1Character = player1Character;
	    this.boss = new Boss(this.ctx, this.background.platforms, this.player1, this.player1);
	    this.joker = new Joker(500, 350, this.ctx, this.player1, this.player1);
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
	    const singlePlayerCondition = this.player1.lives > 0 && !this.keyboarder.isDown(80);

	    const victoryLevel1 = this.monsterKillCount >= 50 && this.level === 'level1';
	    const victoryLevel2 = this.boss.lives === 0 && this.level === 'level2';
	    const victoryLevel3 = this.secretCollected === 10 && this.level === 'level3';

	    const levelWin = victoryLevel1 || victoryLevel2 || victoryLevel2;

	    this.gameLoop = this.gameLoop.bind(this);

	    if (singlePlayerCondition && !levelWin) {
	      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	      this.ctx.globalAlpha = 1;
	      this.updateScreen();
	      this.paused = false;
	      requestAnimationFrame(this.gameLoop);
	    } else if (levelWin) {
	      this.coopVictoryScreen();
	      this.keyboarder.keyState[80] = false;
	      if (this.keyboarder.isDown(78)) {
	        this.levelUp();
	        this.newGame();
	        this.selectBackground(this.level);
	        this.singlePlayer();
	      }
	      requestAnimationFrame(this.gameLoop);
	    } else if (this.player1.lives === 0) {
	      this.coopOverScreen();
	      this.keyboarder.keyState[80] = false;
	      requestAnimationFrame(this.gameLoop);
	    } else if (this.keyboarder.isDown(80)) {
	      this.displayControls();
	      this.paused = true;
	      requestAnimationFrame(this.gameLoop);
	    }
	  }

	  updateScreen() {
	    this.playerHit();
	    this.player1.update();
	    this.transport();
	    this.updatePowerup();
	    this.drawPortal();
	    this.updateEnemies();
	    this.createEnemy();
	    this.instructions();
	    this.level3();
	  }

	  newGame() {
	    this.background.platforms = [];
	    //this.selectRandomLevel();
	    this.player1 = new this.player1Character(this.ctx, 175, 100, this.background.platforms, this.keyboarder, 'player1');
	    this.enemies = [];
	    this.allArrows = [];
	    this.powerup = undefined;
	    this.canPowerup = true;
	  }

	  selectBackground(level) {
	    this.ctx2.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    this.ctx3.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    this.background.changeBackground(level);
	    this.background.createBackground();
	    setTimeout(() => this.background.drawBackground(), 700);
	  }

	  levelUp() {
	    const levelArray = ['level1', 'level2', 'level3'];
	    let idx = levelArray.indexOf(this.level);
	    if (idx < 2) idx++;
	    this.level = levelArray[idx];
	  }

	  versus() {
	    //this.selectRandomLevel();
	    this.selectBackground(this.level);
	    this.generateMonsterChance = 0.001;
	    const eyeSpawnInterval = 14500;
	    const spawnEye = setInterval(() => {
	      if (!this.paused) this.spawnEyes();
	    }, eyeSpawnInterval);
	  }

	  //coop() {

	  singlePlayer() {
	    this.selectBackground(this.level);
	    this.generateMonsterChance = 0.005;
	    const bossTiming = 20000;
	    const eyeSpawnInterval = 9500;

	    if (this.level === 'level1') {
	      // need to clear these set intervals 
	      setInterval(() => {
	        if (!this.paused && this.level === 'level1') {
	          this.spawnEyes();
	          if (this.numberEyeSpawn < 6) this.numberEyeSpawn++;
	        }
	      }, eyeSpawnInterval);
	    } else if (this.level === 'level2') {
	      // and this too...
	      setInterval(() => {
	        if (!this.paused && this.level === 'level2') this.spawnEyes();
	      }, eyeSpawnInterval);

	      setTimeout(() => {
	        this.enemies.push(this.boss);
	        this.generateMonsterChance = 0;
	      }, bossTiming);
	    } else if (this.level === 'level3') {
	      this.secret = new Secret(this.ctx);
	      this.enemies.push(this.joker);
	      //this.enemies.push(this.cerberus);
	      this.generateMonsterChance = 0;

	      setInterval(() => {
	        // and clear this setInterval too
	        if (!this.paused && !this.secret) this.secret = new Secret(this.ctx);
	      }, eyeSpawnInterval);
	    }
	  }

	  selectRandomLevel() {
	    const allLevels = ['level1', 'level2', 'level3'];
	    const randomLevel = allLevels[Math.floor(Math.random() * allLevels.length)];
	    this.selectBackground(randomLevel);
	    this.level = randomLevel;
	  }

	  transport() {
	    const allBodies = [this.player1, this.boss, ...this.allArrows, ...this.enemies];

	    if (this.level === 'level1' || this.level === 'level2') {
	      allBodies.forEach(body => {
	        if (body.x > 1000) body.x = 0;else if (body.x < 0) body.x = 1000;

	        if (body.y > 750) body.y = 0;
	      });
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
	          body.y += 350;
	        } else if (body.x < 0 && body.y > 320) {
	          body.x = 1000;
	          body.y -= 350;
	        }

	        if (body.y > 750) {
	          body.y = 0;
	          body.x += 650;
	        }
	      });
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
	        this.enemies.push(new Eye(this.randomX, this.randomY, this.ctx, this.player1, this.player1));
	        counter++;
	      }, spawnInterval);
	    }, delaySpawn);

	    setTimeout(() => {
	      this.canUsePortal = false;
	    }, closePortal);
	  }

	  drawPortal() {
	    if (this.canUsePortal) {
	      const width = 120;
	      const height = 150;

	      let img = new Image();
	      img.src = "../assets/portal-sprite.png";
	      this.ctx.globalAlpha = 0.7;
	      this.ctx.drawImage(img, this.randomX - width / 2 + 10, this.randomY - height / 2 + 10, width, height);
	      this.ctx.globalAlpha = 1;
	    }
	  }

	  playerHit() {
	    this.allArrows = [...this.player1.arrows, ...this.boss.arrows];
	    const player1HitCondition = (this.player1.isColliding(this.allArrows) || this.player1.isColliding(this.enemies)) && !this.player1.invincible;

	    if (player1HitCondition) {
	      this.filterCollidingArrows([this.player1]);
	      this.player1.hit();
	      this.player1.upgradeSpeed = 0;
	      this.player1.quiver = 3;
	    }
	  }

	  updateEnemies() {
	    this.enemies.forEach(enemy => {
	      enemy.update();
	      if (enemy.isColliding(this.allArrows) && enemy instanceof Joker && !enemy.dead) {
	        enemy.hitA();
	        this.filterCollidingArrows([enemy]);
	        setTimeout(() => {
	          this.enemies = this.enemies.filter(enemy => !enemy.dead);
	        }, 900);
	        if (this.joker.lives === 0) {
	          this.joker = undefined;
	        }
	      } else if (enemy.isColliding(this.allArrows) && enemy instanceof Cerberus && !enemy.dead) {
	        enemy.hitA();
	        this.filterCollidingArrows([enemy]);

	        setTimeout(() => {
	          this.enemies = this.enemies.filter(enemy => !enemy.dead);
	        }, 900);
	      } else if (enemy.isColliding(this.allArrows) && enemy instanceof Boss && !enemy.dead) {
	        enemy.hitBoss();
	        this.filterCollidingArrows([enemy]);

	        setTimeout(() => {
	          this.enemies = this.enemies.filter(enemy => !enemy.dead);
	        }, 900);
	      } else if (enemy.isColliding(this.allArrows) && !enemy.dead && !enemy.invincible) {
	        this.monsterKillCount++;
	        enemy.dead = true;
	        this.filterCollidingArrows([enemy]);

	        setTimeout(() => {
	          this.enemies = this.enemies.filter(enemy => !enemy.dead);
	        }, 900);
	      }
	    });
	  }

	  createEnemy() {
	    if (!this.generateEnemy) {
	      setTimeout(() => {
	        this.generateEnemy = true;
	      }, this.enemyGenTiming);
	    } else if (Math.random() < this.generateMonsterChance) {
	      this.enemies.push(new Enemy(this.ctx, this.background.platforms));
	      this.generateEnemy = false;
	    }
	  }

	  filterCollidingArrows(target) {
	    this.player1.arrows = this.player1.arrows.filter(arrow => {
	      return !arrow.isColliding(target);
	    });
	  }

	  callPowerup() {
	    setTimeout(() => {
	      this.powerup = new Powerup(this.ctx);
	      this.player1.powerup = this.powerup;
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
	    if (this.player1.collectPowerup) {
	      this.powerup = undefined;
	      this.player1.powerup = undefined;
	      this.player1.collectPowerup = false;
	      this.powerupInterval = Math.random() * 10000 + 5000;
	      this.canPowerup = true;
	    }
	  }

	  level3() {
	    if (this.secret) {
	      this.secret.draw();
	      if (this.secret.isColliding([this.player1])) {
	        this.secret = undefined;
	        this.secretCollected++;
	        this.jokerRespawnTime -= 150;
	        if (this.ceberus === undefined) {
	          this.cerberus = new Cerberus(this.ctx, 530, 600, this.player1, this.player1, this.background.platforms);
	          setTimeout(() => {
	            this.enemies.push(this.cerberus);
	          }, 1000);
	        }
	        if (this.joker) this.joker.speed += this.secretCollected * 0.13;
	      }
	    }

	    if (this.joker === undefined) {
	      if (this.canSpawnJoker) {
	        this.canSpawnJoker = false;
	        setTimeout(() => {
	          this.joker = new Joker(500, 350, this.ctx, this.player1, this.player1);
	          this.enemies.push(this.joker);
	          this.joker.speed += this.secretCollected * 0.13;
	          this.canSpawnJoker = true;
	        }, this.jokerRespawnTime);
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
	    this.ctx.font = '20pt arcadeclassicregular';
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
	    this.ctx.font = '20pt arcadeclassicregular';
	    this.ctx.fillText('Press [N] for next level', 500, 550);
	  }

	  instructions() {
	    this.ctx.fillStyle = 'rgba(103, 128, 159, 0.9)';
	    this.ctx.font = "16pt arcadeclassicregular";
	    this.ctx.textAlign = 'center';

	    if (this.mode === 'coop' && this.level === 'level1') {
	      this.ctx.fillText(`Defeat ${50 - this.monsterKillCount} monsters`, 500, 20);
	    } else if (this.mode === 'coop' && this.level === 'level2') {
	      this.ctx.fillText('Defeat the Boss', 500, 20);
	    } else if (this.mode === 'coop' && this.level === 'level3') {
	      this.ctx.fillText(`Collect ${10 - this.secretCollected}   Secrets`, 500, 20);
	    }

	    if (this.mode === 'versus') {
	      this.ctx.fillText('Defeat the  other  Player', 500, 20);
	    }
	  }

	  displayControls() {
	    const controls1 = new Image(50, 40);
	    //const controls2 = new Image(50, 40);
	    controls1.src = '../assets/p1-controls.png';
	    //controls2.src = '../assets/p2-controls.png'

	    this.ctx.globalAlpha = 0.025;
	    this.ctx.fillStyle = 'rgba(100, 100, 100, .2)';
	    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	    this.ctx.fillStyle = 'rgba(236, 236, 236, 0.7)';
	    this.ctx.font = "30pt arcadeclassicregular";
	    this.ctx.textAlign = 'center';
	    this.ctx.fillText('controls', 500, 50);
	    this.ctx.fillText('Player 1', 500, 100);
	    this.ctx.fillText('arrows to move', 500, 260);
	    this.ctx.fillText('[spacebar] to shoot', 500, 360);
	    this.ctx.fillText('[p] to pause', 500, 460);
	    this.ctx.fillText('press [p] to play', 500, 560);
	    //this.ctx.drawImage(controls1, 59, 180, 350, 260)
	  }
	}

	module.exports = Game;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	const Bodies = __webpack_require__(3);
	const Arrow = __webpack_require__(4);
	const sounds = __webpack_require__(5);

	class Player extends Bodies {
	  constructor(ctx, x, y, platforms, keyboarder, player) {
	    super(x, y);
	    this.arrows = [];
	    this.canReload = true;
	    this.canShoot = true;
	    this.collectPowerup = false;
	    this.ctx = ctx;
	    this.dead = false;
	    this.reloadDelay = 1500;
	    this.direction = this.player === 'player1' ? 'right' : 'left';
	    this.dx = 0;
	    this.dy = 2;
	    this.headImpact = false;
	    this.height = 40;
	    this.invincible = false;
	    this.invincibleTimer = 0;
	    this.isOnPlatform = false;
	    this.jumping = false;
	    this.keyboarder = keyboarder;
	    this.lives = 3;
	    this.platforms = platforms;
	    this.player = player || 'player1';
	    this.powerup;
	    this.quiver = 3;
	    this.shooting = false;
	    this.spriteSrc;
	    this.toggleControls = true;
	    this.upgradeQuiver = 0;
	    this.upgradeSpeed = 0;
	    this.width = 30;
	    this.shotTiming = 200;
	    this.speed = 4;
	  }

	  arrow() {
	    if (this.quiver > 0) {
	      this.quiver--;
	      this.shooting = true;

	      const arrow = new Arrow(this);

	      sounds.archerBow();

	      this.arrows.push(arrow);
	      setTimeout(() => {
	        this.shooting = false;
	      }, 300);
	      //reload
	      (() => {
	        if (this.canReload) {
	          this.canReload = false;
	          setTimeout(() => {
	            this.quiver = 3 + this.upgradeQuiver;
	            this.canReload = true;
	          }, this.reloadDelay);
	        }
	      })();
	    }
	  }

	  update() {
	    this.isPoweredUp();
	    this.move();
	    this.draw();
	    this.renderAttributes();
	    //update arrows
	    this.arrows = this.arrows.filter(arrow => {
	      return !arrow.isColliding(this.platforms);
	    });
	    this.arrows.forEach(arrow => arrow.draw().update());
	    this.transport();
	  }

	  transport() {
	    this.onPlatform();
	    //jump update
	    if (this.jumping && this.dy < -.8 && !this.headCollision()) {
	      this.dy = this.dy * .92;
	    } else if (this.headCollision()) {
	      this.dy = 0.8;
	    } else {
	      this.dy = this.gravity();
	      this.jumping = false;
	    }

	    //standard x and y update
	    this.x += this.dx;
	    this.y += this.dy;
	  }

	  draw() {
	    this.setPlayerSprite();
	    let image = this.updateImage();
	    let img = new Image();

	    img.src = this.spriteSrc;

	    if (this.dead) {
	      image = { sx: 0, sy: 0, sWidth: 60, sHeight: 48 };
	    }

	    this.ctx.drawImage(img, image.sx, image.sy, image.sWidth, image.sHeight, this.x - 20, this.y - 10, this.width + 40, this.height + 10);
	  }

	  setPlayerSprite() {
	    if (this.dead) {
	      this.spriteSrc = '../assets/explosion.png';
	    } else if (this.player === 'player2') {
	      this.spriteSrc = '../assets/p2-sprites.png';
	    } else {
	      this.spriteSrc = '../assets/p1-sprites.png';
	    }
	  }

	  move() {
	    const key = this.keyboarder;

	    //left
	    if (this.dead) {
	      this.dx = 0;
	      return false;
	    } else if (this.isColliding(this.platforms)) {
	      this.dx = -this.dx;
	    } else if (key.isDown(key.playerKeys[this.player].left) && !this.isColliding(this.platforms)) {
	      this.dx = -this.speed - this.upgradeSpeed;
	      this.direction = "left";
	    } else if (key.isDown(key.playerKeys[this.player].right) && !this.isColliding(this.platforms)) {
	      this.dx = this.speed + this.upgradeSpeed;
	      this.direction = "right";
	    } else if (!this.jumping) {
	      this.dx = 0;
	    }
	    //jump
	    if (key.isDown(key.playerKeys[this.player].jump) && this.isOnPlatform && key.isDown(key.playerKeys[this.player].left)) {
	      this.jump('left');
	    } else if (key.isDown(key.playerKeys[this.player].jump) && this.isOnPlatform && key.isDown(key.playerKeys[this.player].right)) {
	      this.jump('right');
	    } else if (key.isDown(key.playerKeys[this.player].jump) && this.isOnPlatform) {
	      this.jump();
	    }
	    //shoot 
	    if (key.isDown(key.playerKeys[this.player].shoot)) {
	      if (this.canShoot) {
	        this.arrow();
	        this.canShoot = false;
	        setTimeout(() => {
	          this.canShoot = true;
	        }, this.shotTiming);
	      }
	    }
	  }

	  updateImage() {
	    let image = {};

	    image.sWidth = 60;
	    image.sHeight = 50;
	    image.sy = 5;

	    if (this.direction === 'left' && this.shooting) {
	      image.sx = 0;
	      image.sy = 65;
	    } else if (this.shooting) {
	      image.sx = 60;
	      image.sy = 65;
	    } else if (this.direction === 'left') {
	      image.sx = 0;
	    } else {
	      image.sx = 188;
	    }

	    return image;
	  }

	  renderAttributes() {
	    //render lives
	    for (let i = 0; i < this.lives; i++) {
	      let spriteY = 0;

	      if (this.invincible) {
	        spriteY = 30;
	      }
	      this.ctx.drawImage(this.powerUpDisplay(), 0, spriteY, 30, 30, this.attributeSpriteX(i), 10, 15, 15);
	    }
	    //arrow rendering
	    for (let i = 0; i < this.quiver; i++) {
	      this.ctx.drawImage(this.powerUpDisplay(), 87, 0, 30, 30, this.attributeSpriteX(i), 33, 15, 15);
	    }
	    //speed rendering
	    for (let i = 0; i < this.upgradeSpeed; i++) {
	      this.ctx.drawImage(this.powerUpDisplay(), 60, 0, 30, 30, this.attributeSpriteX(i), 55, 15, 15);
	    }
	    //shield above head rendering
	    if (this.invincible) {
	      this.ctx.globalAlpha = 0.5;
	      this.ctx.drawImage(this.powerUpDisplay(), 30, 31, 25, 31, this.x + 8, this.y - 42, 22, 25);
	      this.ctx.globalAlpha = 1;
	    }
	    if (this.invincibleTimer > 0) {
	      this.ctx.font = "Bold 14pt arcadeclassicregular";
	      this.ctx.fillstyle = 'rgba(236, 236, 236, 0.7)';
	      this.ctx.textAlign = 'center';
	      this.ctx.fillText(this.invincibleTimer, this.x + 18, this.y - 48);
	    }
	  }

	  attributeSpriteX(i) {
	    let spriteX;

	    if (this.player === 'player1') {
	      spriteX = 10 + i * 20;
	    } else {
	      spriteX = 1000 - 30 - i * 20;
	    }
	    return spriteX;
	  }

	  gravity() {
	    if (this.isOnPlatform) {
	      return 0;
	    } else if (this.dy > -1 && this.dy < 0.5) {
	      //dy approaching jump peak
	      return .5;
	    } else if (this.dy >= 5) {
	      //dy max on free fall
	      return 6;
	    } else {
	      //
	      return this.dy * 1.5; //sets increasing dy
	    }
	  }

	  jump(direction) {
	    if (this.isOnPlatform) {
	      this.jumping = true;
	      this.dy = -15;
	    }

	    if (direction === 'left' && !this.isColliding(this.platforms)) {
	      this.dx = -4;
	    } else if (direction === 'right' && !this.isColliding(this.platforms)) {
	      this.dx = 4;
	    }
	  }

	  onPlatform() {
	    if (this.platforms.some(platform => {
	      return this.y + this.height >= platform.y && this.y < platform.y && this.x >= platform.x - this.width && this.x + this.width <= platform.x + platform.width + this.width;
	    })) {
	      this.isOnPlatform = true;
	    } else {
	      this.isOnPlatform = false;
	    }
	  }

	  headCollision() {
	    let headLeft = this.x;
	    let headRight = this.x + this.width;
	    let headHeight = this.y;
	    let isColliding;

	    this.platforms.forEach(function (platform) {
	      if (platform.y + platform.height - 6 < headHeight && headHeight < platform.y + platform.height + 6 && headRight > platform.x && headLeft < platform.x + platform.width) {
	        isColliding = true;
	      }
	    });
	    return isColliding;
	  }

	  hit() {
	    if (!this.dead && !this.invincible) {
	      this.dead = true;
	      this.lives--;
	      this.canShoot = false;
	      if (this.lives === 0) {
	        this.arrows = [];
	      }
	      if (this.lives !== 0) {
	        setTimeout(() => {
	          this.dead = false;
	          this.canShoot = true;
	          this.invincible = true;
	          this.invincibleTimer = 4;
	          this.invincibleCountdown();
	          this.y = -100;
	          this.x = 750;
	          //this.x = Math.random() * 700 + 150;
	        }, 1200);
	        setTimeout(() => {
	          this.invincible = false;
	        }, 5200);
	      }
	    }
	  }

	  isPoweredUp() {
	    const powerups = ['lives', 'lives', 'upgradeSpeed', 'invincible'];

	    if (this.powerup !== undefined) {
	      if (this.isColliding([this.powerup])) {
	        let upgrade = powerups[Math.floor(Math.random() * powerups.length)];

	        // invincibility upgrade
	        if (upgrade === 'invincible') {
	          if (!this.invincible) {
	            this.invincible = true;
	            this.invincibleTimer = 10;
	            this.invincibleCountdown();
	            setTimeout(() => {
	              this.invincible = false;
	            }, 10000);
	          } else {
	            this.lives++;
	          }
	        } else {
	          // all other upgrades
	          this[upgrade]++;
	          if (upgrade === 'upgradeQuiver') {
	            this.quiver++;
	          }
	        }
	        this.collectPowerup = true;
	      }
	    }
	  }

	  powerUpDisplay() {
	    let powerUpDisplay = new Image();

	    powerUpDisplay.src = '../assets/powerup-sprites.png';
	    return powerUpDisplay;
	  }

	  invincibleCountdown() {
	    let timer = setInterval(() => {
	      if (this.invincibleTimer === 0) {
	        clearInterval(timer);
	      }
	      this.invincibleTimer--;
	    }, 1000);
	  }
	}

	module.exports = Player;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	class Bodies {
	  constructor(x, y, width, height) {
	    this.x = x;
	    this.y = y;
	    this.width = width;
	    this.height = height;
	  }
	  //17-21 simplfy into another function etc.
	  isColliding(array) {
	    let isColliding = false;
	    const topRight = this.x + this.width;
	    const footLevel = this.y + this.height;

	    array.forEach(({ x, y, width, height }) => {
	      const bodyFootLevel = y + height;
	      if (topRight > x && !(this.y >= bodyFootLevel || footLevel - 10 <= y) && this.x < x + width && !(this.y >= bodyFootLevel || footLevel - 10 <= y)) {
	        isColliding = true;
	      }
	    });
	    return isColliding;
	  }
	}

	module.exports = Bodies;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	const Bodies = __webpack_require__(3);

	class Arrow extends Bodies {
	  constructor(player) {
	    super(...arguments);
	    this.ctx = player.ctx;
	    this.direction = player.direction;
	    this.x = this.shootDirection(player);
	    this.y = player.y + 5;
	    this.width = 40;
	    this.height = 15;
	    this.dx = 12;
	    this.dy = -1.5;
	    this.gravity = 0.12;
	    this.drag = -0.06;
	    this.platforms = player.platforms;
	    this.player = player;
	  }

	  draw() {
	    let image = this.updateImage();

	    this.ctx.drawImage(this.arrowImage(), image.sx, image.sy, image.sWidth, image.sHeight, this.x, this.y, this.width, this.height);
	    return this;
	  }

	  shootDirection(player) {
	    if (this.direction === 'left') {
	      return player.x - 40;
	    } else {
	      return player.x + 40;
	    }
	  }

	  updateImage() {
	    let image = {};

	    if (this.direction === 'left') {
	      image.sx = 127;
	      image.sy = 65;
	      image.sWidth = 30;
	      image.sHeight = 15;
	    } else {
	      image.sx = 130;
	      image.sy = 80;
	      image.sWidth = 30;
	      image.sHeight = 15;
	    }

	    return image;
	  }

	  arrowImage() {
	    let img = new Image();

	    img.src = this.player.spriteSrc;
	    return img;
	  }

	  update() {
	    if (this.direction === 'right') {
	      this.x += this.dx;
	      this.dx += this.drag;
	      this.y += this.dy;
	      this.dy += this.gravity;
	    } else {
	      this.x -= this.dx;
	      this.dx += this.drag;
	      this.y += this.dy;
	      this.dy += this.gravity;
	    }
	  }
	}

	module.exports = Arrow;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	const sounds = {
	  archerBow: () => {
	    console.log('make noise please');
	    let bowSound = new Audio('../assets/audio-assets/bow.mp3');
	    bowSound.play();
	    console.log(bowSound);
	  }

	};

	module.exports = sounds;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(2);

	class Enemy extends Player {
	  constructor(ctx, platforms) {
	    super(...arguments);
	    this.ctx = ctx;
	    this.width = 20;
	    this.height = 45;
	    this.x = Math.random() * 700 + 150;
	    this.y = 50;
	    this.dx = .3;
	    this.dy = 0;
	    this.platforms = platforms;
	    this.direction = 'right';
	    this.canRandomReverse = true;
	  }

	  update() {
	    this.transport();
	    this.draw();
	  }

	  transport() {
	    this.onPlatform();
	    this.dy = this.gravity();
	    if (this.isColliding(this.platforms)) {
	      this.dx = -this.dx;
	    }
	    if (this.x > 1000 - this.width) {
	      this.x = 0;
	    } else if (this.y > 700) {
	      this.y = 0;
	      this.x = Math.random() * 700 + 150;
	    }

	    if (this.canRandomReverse) {
	      this.canRandomReverse = false;
	      let reverseTime = Math.random() * 8000 + 3000;

	      setTimeout(() => {
	        this.dx = -this.dx;
	        this.canRandomReverse = true;
	      }, reverseTime);
	    }

	    if (this.dx >= 0) {
	      this.direction = 'right';
	    } else {
	      this.direction = 'left';
	    }

	    if (this.dead) {
	      this.dx = 0;
	    }

	    this.x += this.dx;
	    this.y += this.dy;
	  }

	  draw() {
	    let image = this.enemySprite();
	    let imageXY = this.updateImage();

	    this.ctx.drawImage(image, imageXY.x, imageXY.y, 33, 48, this.x - 10, this.y - 15, 40, 60);
	  }

	  move() {
	    return false;
	  }

	  enemySprite() {
	    let img = new Image();

	    img.src = '../assets/enemy-sprite.png';
	    return img;
	  }

	  updateImage() {
	    let image = {};

	    image.x = 0;
	    image.y = 0;
	    if (this.direction === 'right') {
	      image.x = 35;
	    }
	    if (this.dead) {
	      image.x = 0;
	      image.y = 50;
	    }
	    return image;
	  }
	}

	module.exports = Enemy;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	class Powerup {
	  constructor(ctx) {
	    this.ctx = ctx;
	    this.height = 25;
	    this.img = new Image();
	    this.img.src = '../assets/powerup-sprites.png';
	    this.width = 20;
	    this.x = 490;
	    this.y = this.randomLocation();
	  }

	  draw() {
	    this.ctx.globalAlpha = 0.8;
	    this.ctx.drawImage(this.img, 30, 0, 20, 30, this.x, this.y, this.width, this.height);
	    this.ctx.globalAlpha = 1;
	  }

	  randomLocation() {
	    let location = [75, 180, 620];
	    let randomNumber = Math.floor(Math.random() * location.length);

	    return location[randomNumber];
	  }
	}

	module.exports = Powerup;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	const Bodies = __webpack_require__(3);

	class Secret extends Bodies {
	  constructor(ctx) {
	    super(...arguments);
	    this.x = 540;
	    this.y = 370;
	    this.img = new Image();
	    this.img.src = '../assets/scrolls.png';
	    this.width = 35;
	    this.height = 35;
	    this.ctx = ctx;
	  }

	  draw() {
	    this.ctx.globalAlpha = 0.8;
	    this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	    this.ctx.globalAlpha = 1;
	  }
	}

	module.exports = Secret;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	const Platform = __webpack_require__(10);
	const level1 = __webpack_require__(11);
	const level2 = __webpack_require__(12);
	const level3 = __webpack_require__(13);

	class Background {
	  constructor(ctx2, ctx3, level = 'level1') {
	    this.level = level;
	    this.platforms = [];
	    this.backdrop = new Image();
	    this.levelConfig = {
	      level1: {
	        platforms: level1,
	        src: '../assets/level1/moon-backdrop.jpg'
	      },
	      level2: {
	        platforms: level2,
	        src: '../assets/level2/lake-backdrop.jpg'
	      },
	      level3: {
	        platforms: level3,
	        src: '../assets/level3/fire-cavern.jpg'
	      }
	    };
	    this.backdrop.src = this.levelConfig[this.level].src;
	    this.ctx2 = ctx2;
	    this.ctx3 = ctx3;
	  }

	  createBackground() {
	    this.levelConfig[this.level].platforms.forEach(obj => {
	      this.platforms.push(new Platform(this.ctx2, obj.x, obj.y, obj.width, obj.height, obj.src, obj.dx, obj.dy, obj.dWidth, obj.dHeight, obj.visible, obj.detect));
	    });
	  }

	  drawBackground() {
	    this.ctx3.drawImage(this.backdrop, 0, 0, 1000, 700);
	    this.platforms.forEach(platform => {
	      if (platform.visible) platform.draw();
	    });
	  }

	  changeBackground(level) {
	    this.level = level;
	    this.backdrop.src = this.levelConfig[this.level].src;
	  }

	}

	module.exports = Background;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	class Platform {
	  constructor(ctx, x, y, width, height, src, dx, dy, dWidth, dHeight, visible, detect) {
	    this.image = new Image();
	    this.image.src = src;
	    this.x = x;
	    this.y = y;
	    this.width = width;
	    this.height = height;
	    this.dx = dx;
	    this.dy = dy;
	    this.dWidth = dWidth;
	    this.dHeight = dHeight;
	    this.ctx = ctx;
	    this.visible = visible || false;
	    this.detect = detect || false;
	  }

	  draw() {
	    this.ctx.drawImage(this.image, this.dx, this.dy, this.dWidth, this.dHeight);
	  }
	}

	module.exports = Platform;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	const level = [

	//left
	{
	  name: 'left-side',
	  src: '../assets/level1/l-side.png',
	  visible: true,
	  detect: true,
	  x: 0,
	  y: 200,
	  width: 60,
	  height: 400,
	  dx: 0,
	  dy: 193,
	  dWidth: 60,
	  dHeight: 415
	}, {
	  name: 'left-lower-level',
	  src: '../assets/level1/l-lower-level.png',
	  visible: true,
	  detect: true,
	  x: 0,
	  y: 600,
	  width: 300,
	  height: 50,
	  dx: 0,
	  dy: 585,
	  dWidth: 320,
	  dHeight: 65
	}, {
	  name: 'left-ground',
	  src: '../assets/level1/l-ground.png',
	  visible: true,
	  detect: true,
	  x: 0,
	  y: 650,
	  width: 450,
	  height: 50,
	  dx: 0,
	  dy: 635,
	  dWidth: 470,
	  dHeight: 70
	}, {
	  name: 'left-side-ledge',
	  src: '../assets/level1/l-side-ledge.png',
	  visible: true,
	  detect: true,
	  x: 30,
	  y: 430,
	  width: 30,
	  height: 30,
	  dx: 30,
	  dy: 430,
	  dWidth: 30,
	  dHeight: 30
	},

	//right
	{
	  name: 'right-side',
	  src: '../assets/level1/r-side.png',
	  visible: true,
	  detect: true,
	  x: 940,
	  y: 200,
	  width: 65,
	  height: 400,
	  dx: 940,
	  dy: 193,
	  dWidth: 60,
	  dHeight: 415
	}, {
	  name: 'right-lower-level',
	  src: '../assets/level1/r-lower-level.png',
	  visible: true,
	  detect: true,
	  x: 700,
	  y: 600,
	  width: 300,
	  height: 50,
	  dx: 685,
	  dy: 585,
	  dWidth: 320,
	  dHeight: 65
	}, {
	  name: 'right-ground',
	  src: '../assets/level1/r-ground.png',
	  visible: true,
	  detect: true,
	  x: 550,
	  y: 650,
	  width: 450,
	  height: 50,
	  dx: 535,
	  dy: 635,
	  dWidth: 470,
	  dHeight: 70
	}, {
	  name: 'right-side-ledge',
	  src: '../assets/level1/r-side-ledge.png',
	  visible: true,
	  detect: true,
	  x: 940,
	  y: 430,
	  width: 30,
	  height: 30,
	  dx: 940,
	  dy: 430,
	  dWidth: 30,
	  dHeight: 30
	},

	//platforms
	{
	  name: 'center-platform-tree',
	  src: '../assets/level1/center-platform-tree.png',
	  visible: true,
	  detect: true,
	  x: 500,
	  y: 400,
	  width: 10,
	  height: 50,
	  dx: 415,
	  dy: 265,
	  dWidth: 160,
	  dHeight: 180
	}, {
	  name: 'center-platform-low',
	  src: '../assets/level1/center-platform-low.png',
	  visible: true,
	  detect: true,
	  x: 375,
	  y: 442,
	  width: 250,
	  height: 30,
	  dx: 370,
	  dy: 440,
	  dWidth: 260,
	  dHeight: 33
	}, {
	  name: 'center-platform-high',
	  src: '../assets/level1/center-platform-high.png',
	  visible: true,
	  detect: true,
	  x: 310,
	  y: 120,
	  width: 370,
	  height: 30,
	  dx: 310,
	  dy: 117,
	  dWidth: 380,
	  dHeight: 33
	}, {
	  name: 'left-platform',
	  src: '../assets/level1/side-platform.png',
	  visible: true,
	  detect: true,
	  x: 140,
	  y: 280,
	  width: 120,
	  height: 10,
	  dx: 138,
	  dy: 280,
	  dWidth: 120,
	  dHeight: 95
	}, {
	  name: 'right-platform',
	  src: '../assets/level1/side-platform.png',
	  visible: true,
	  detect: true,
	  x: 740,
	  y: 280,
	  width: 120,
	  height: 10,
	  dx: 738,
	  dy: 280,
	  dWidth: 120,
	  dHeight: 95
	}];

	module.exports = level;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	const level2 = [

	//left
	{
	  name: 'left-ground',
	  src: '../assets/level2/left-ground.png',
	  visible: true,
	  detect: true,
	  x: 0,
	  y: 650,
	  width: 250,
	  height: 50,
	  dx: 0,
	  dy: 640,
	  dWidth: 270,
	  dHeight: 62
	}, {
	  name: 'right-ground',
	  src: '../assets/level2/right-ground.png',
	  visible: true,
	  detect: true,
	  x: 750,
	  y: 650,
	  width: 250,
	  height: 50,
	  dx: 730,
	  dy: 640,
	  dWidth: 270,
	  dHeight: 62
	}, {
	  name: 'center-ground',
	  src: '../assets/level2/center-ground.png',
	  visible: true,
	  detect: true,
	  x: 350,
	  y: 650,
	  width: 300,
	  height: 50,
	  dx: 345,
	  dy: 635,
	  dWidth: 310,
	  dHeight: 65
	}, {
	  name: 'center-platform',
	  src: '../assets/level2/center-platform.png',
	  visible: true,
	  detect: true,
	  x: 400,
	  y: 320,
	  width: 200,
	  height: 30,
	  dx: 400,
	  dy: 320,
	  dWidth: 205,
	  dHeight: 25
	}, {
	  name: 'left-transit',
	  src: '../assets/level2/level2fill.png',
	  visible: false,
	  detect: true,
	  x: 0,
	  y: 400,
	  width: 100,
	  height: 30,
	  dx: 0,
	  dy: 0,
	  dWidth: 0,
	  dHeight: 0
	}, {
	  name: 'right-transit',
	  src: '../assets/level2/level2fill.png',
	  visible: false,
	  detect: true,
	  x: 900,
	  y: 400,
	  width: 100,
	  height: 30,
	  dx: 0,
	  dy: 0,
	  dWidth: 0,
	  dHeight: 0
	}, {
	  name: 'left-low-platform',
	  src: '../assets/level2/small-platform.png',
	  visible: true,
	  detect: true,
	  x: 250,
	  y: 480,
	  width: 100,
	  height: 20,
	  dx: 250,
	  dy: 480,
	  dWidth: 100,
	  dHeight: 20
	}, {
	  name: 'right-low-platform',
	  src: '../assets/level2/small-platform.png',
	  visible: true,
	  detect: true,
	  x: 650,
	  y: 480,
	  width: 100,
	  height: 20,
	  dx: 650,
	  dy: 480,
	  dWidth: 100,
	  dHeight: 20
	}, {
	  name: 'left-upper-platform',
	  src: '../assets/level2/small-platform.png',
	  visible: true,
	  detect: true,
	  x: 250,
	  y: 150,
	  width: 100,
	  height: 20,
	  dx: 250,
	  dy: 150,
	  dWidth: 100,
	  dHeight: 20
	}, {
	  name: 'right-upper-platform',
	  src: '../assets/level2/small-platform.png',
	  visible: true,
	  detect: true,
	  x: 650,
	  y: 150,
	  width: 100,
	  height: 20,
	  dx: 650,
	  dy: 150,
	  dWidth: 100,
	  dHeight: 20
	}, {
	  name: 'left-upper-wall',
	  src: '../assets/level2/left-upper-wall.png',
	  visible: true,
	  detect: true,
	  x: 0,
	  y: 0,
	  width: 30,
	  height: 300,
	  dx: 0,
	  dy: 0,
	  dWidth: 30,
	  dHeight: 300
	}, {
	  name: 'right-upper-wall',
	  src: '../assets/level2/right-upper-wall.png',
	  visible: true,
	  detect: true,
	  x: 970,
	  y: 0,
	  width: 30,
	  height: 300,
	  dx: 970,
	  dy: 0,
	  dWidth: 30,
	  dHeight: 300
	}, {
	  name: 'left-tiny-ledge',
	  src: '../assets/level2/level2fill.png',
	  visible: true,
	  detect: true,
	  x: 0,
	  y: 200,
	  width: 40,
	  height: 30,
	  dx: 0,
	  dy: 0,
	  dWidth: 0,
	  dHeight: 0
	}, {
	  name: 'right-tiny-ledge',
	  src: '../assets/level2/level2fill.png',
	  visible: false,
	  detect: true,
	  x: 960,
	  y: 200,
	  width: 40,
	  height: 30,
	  dx: 0,
	  dy: 0,
	  dWidth: 0,
	  dHeight: 0
	}, {
	  name: 'left-lower-wall',
	  src: '../assets/level2/left-lower-wall.png',
	  visible: true,
	  detect: true,
	  x: 0,
	  y: 400,
	  width: 30,
	  height: 300,
	  dx: -20,
	  dy: 400,
	  dWidth: 130,
	  dHeight: 250
	}, {
	  name: 'right-lower-wall',
	  src: '../assets/level2/right-lower-wall.png',
	  visible: true,
	  detect: true,
	  x: 965,
	  y: 400,
	  width: 35,
	  height: 300,
	  dx: 890,
	  dy: 400,
	  dWidth: 130,
	  dHeight: 250
	}];

	module.exports = level2;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	const level3 = [{
	  name: 'main-ground',
	  src: '../assets/level3/main-ground.png',
	  visible: true,
	  detect: true,
	  x: 200,
	  y: 650,
	  width: 800,
	  height: 50,
	  dx: 200,
	  dy: 600,
	  dWidth: 800,
	  dHeight: 100
	}, {
	  name: 'fire',
	  src: '../assets/level3/level3fill.png',
	  visible: false,
	  detect: true,
	  x: 580,
	  y: 640,
	  width: 20,
	  height: 10,
	  dx: 0,
	  dy: 0,
	  dWidth: 0,
	  dHeight: 0
	}, {
	  name: 'left-lower-ledge',
	  src: '../assets/level3/left-lower-ledge.png',
	  visible: true,
	  detect: true,
	  x: 0,
	  y: 480,
	  width: 200,
	  height: 30,
	  dx: -1,
	  dy: 420,
	  dWidth: 214,
	  dHeight: 90
	}, {
	  name: 'left-upper-ledge',
	  src: '../assets/level3/left-upper-ledge.png',
	  visible: true,
	  detect: true,
	  x: 0,
	  y: 310,
	  width: 100,
	  height: 50,
	  dx: 0,
	  dy: 310,
	  dWidth: 100,
	  dHeight: 50
	}, {
	  name: 'left-lower-wall',
	  src: '../assets/level3/left-lower-wall.png',
	  visible: true,
	  detect: true,
	  x: 0,
	  y: 510,
	  width: 30,
	  height: 300, //extra to prevent unwanted location
	  dx: 0,
	  dy: 510,
	  dWidth: 32,
	  dHeight: 300
	}, {
	  name: 'left-upper-wall',
	  src: '../assets/level3/left-upper-wall.png',
	  visible: true,
	  detect: true,
	  x: 0,
	  y: 0,
	  width: 30,
	  height: 200,
	  dx: 0,
	  dy: 0,
	  dWidth: 32,
	  dHeight: 200
	}, {
	  name: 'right-main-wall',
	  src: '../assets/level3/right-main-wall.png',
	  visible: true,
	  detect: true,
	  x: 970,
	  y: 160,
	  width: 30,
	  height: 360,
	  dx: 940,
	  dy: 160,
	  dWidth: 60,
	  dHeight: 360
	}, {
	  name: 'right-upper-ledge',
	  src: '../assets/level3/right-upper-ledge.png',
	  visible: true,
	  detect: true,
	  x: 900,
	  y: 130,
	  width: 100,
	  height: 30,
	  dx: 893,
	  dy: 130,
	  dWidth: 108,
	  dHeight: 30
	}, {
	  name: 'right-lower-ledge',
	  src: '../assets/level3/right-lower-ledge.png',
	  visible: false,
	  detect: true,
	  x: 940,
	  y: 490,
	  width: 30,
	  height: 30,
	  dx: 940,
	  dy: 490,
	  dWidth: 0,
	  dHeight: 0
	}, {
	  name: 'right-float-platform',
	  src: '../assets/level3/right-float-platform.png',
	  visible: true,
	  detect: true,
	  x: 680,
	  y: 280,
	  width: 150,
	  height: 60,
	  dx: 672,
	  dy: 220,
	  dWidth: 166,
	  dHeight: 120
	}, {
	  name: 'left-lower-float-platform',
	  src: '../assets/level3/left-lower-float-platform.png',
	  visible: true,
	  detect: true,
	  x: 350,
	  y: 400,
	  width: 130,
	  height: 30,
	  dx: 348,
	  dy: 400,
	  dWidth: 138,
	  dHeight: 30
	}, {
	  name: 'left-upper-float-platform',
	  src: '../assets/level3/left-upper-float-platform.png',
	  visible: true,
	  detect: true,
	  x: 250,
	  y: 200,
	  width: 100,
	  height: 50,
	  dx: 244,
	  dy: 200,
	  dWidth: 112,
	  dHeight: 50
	}, {
	  name: 'top-wall-main',
	  src: '../assets/level3/top-wall-main.png',
	  visible: true,
	  detect: true,
	  x: 0,
	  y: 0,
	  width: 680,
	  height: 30,
	  dx: 30,
	  dy: 0,
	  dWidth: 680,
	  dHeight: 30
	}, {
	  name: 'top-wall-right',
	  src: '../assets/level3/top-wall-right.png',
	  visible: true,
	  detect: true,
	  x: 830,
	  y: 0,
	  width: 170,
	  height: 30,
	  dx: 830,
	  dy: 0,
	  dWidth: 170,
	  dHeight: 30
	}];

	module.exports = level3;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(2);
	const Fireball = __webpack_require__(15);

	class Boss extends Player {
	  constructor(ctx, platforms, player1, player2) {
	    super(...arguments);
	    this.ctx = ctx;
	    this.width = 40;
	    this.height = 80;
	    this.x = Math.random() * 600 + 200;
	    this.y = -100;
	    this.dx = 1.6;
	    this.dy = 0;
	    this.platforms = platforms;
	    this.direction = 'right';
	    this.quiver = 25;
	    this.lives = 20;
	    this.hit = false;
	    this.shotTiming = 70;
	    this.reloadDelay = 4500;
	    this.canChangeDirection = true;
	    this.canChangeTarget = true;
	    this.changeTargetDelay = 5000;
	    this.player1 = player1;
	    this.player2 = player2;
	    this.spriteSrc = '../assets/boss-sprites.png';
	    this.target = this.player1;
	  }

	  update() {
	    this.fireball();
	    this.transport();
	    this.draw();
	    this.renderAttributes();
	    this.arrows = this.arrows.filter(arrow => {
	      return !arrow.isColliding(this.platforms);
	    });
	    this.arrows.forEach(arrow => arrow.draw().update());
	    this.changeTarget();
	  }

	  renderAttributes() {
	    this.ctx.globalAlpha = 0.7;
	    this.ctx.fillStyle = 'red';
	    this.ctx.fillRect(this.x - 2, this.y - 43, this.lives * 2.5, 4);
	    this.ctx.fillStyle = 'rgba(236, 236, 236, 0.7)';
	    this.ctx.globalAlpha = 1;
	  }

	  changeTarget() {
	    if (this.canChangeTarget) {
	      console.log('target', this.target);
	      const randomDelay = Math.random() * 3000;
	      this.canChangeTarget = false;
	      setTimeout(() => {
	        this.target = this.target === this.player1 ? this.player2 : this.player1;
	        this.canChangeTarget = true;
	      }, this.changeTargetDelay + randomDelay);
	    }
	  }

	  transport() {
	    this.onPlatform();
	    this.dy = this.gravity();
	    if (this.isColliding(this.platforms)) {
	      this.dx = -this.dx;
	    }

	    //player tracking horizontal
	    if (this.target.x > this.x && this.canChangeDirection) {
	      this.canChangeDirection = false;
	      setTimeout(() => {
	        this.dx = 1.6;
	        this.canChangeDirection = true;
	      }, Math.random() * 1200 + 300);
	    } else if (this.canChangeDirection) {
	      this.canChangeDirection = false;
	      setTimeout(() => {
	        this.dx = -1.6;
	        this.canChangeDirection = true;
	      }, Math.random() * 1200 + 300);
	    }

	    if (this.dx > 0) {
	      this.direction = 'right';
	    } else {
	      this.direction = 'left';
	    }

	    if (this.dead) {
	      this.dx = 0;
	    }

	    this.x += this.dx;
	    this.y += this.dy;
	  }

	  draw() {
	    let image = this.bossSprites();
	    let imageXY = this.updateImage();

	    this.ctx.drawImage(image, imageXY.x, imageXY.y, 110, 126, this.x - 30, this.y - 30, 100, 110);
	  }

	  move() {
	    return false;
	  }

	  fireball() {
	    if (this.quiver > 0 && this.canShoot) {
	      this.quiver--;
	      this.shooting = true;
	      const fireball = new Fireball(this);
	      this.canShoot = false;
	      this.arrows.push(fireball);
	      setTimeout(() => {
	        this.canShoot = true;
	      }, this.shotTiming);
	      //reload
	      (() => {
	        if (this.canReload) {
	          this.canReload = false;
	          setTimeout(() => {
	            this.quiver = 25;
	            this.canReload = true;
	          }, this.reloadDelay);
	        }
	      })();
	    }
	  }

	  bossSprites() {
	    let img = new Image();

	    img.src = this.spriteSrc;
	    return img;
	  }

	  updateImage() {
	    let image = {};

	    image.x = 0;
	    image.y = 0;
	    if (this.direction === 'right' && !this.hit) {
	      image.x = 110;
	    }

	    if (this.hit && this.direction === 'left' || this.dead) {
	      image.x = 245;
	    } else if (this.hit && this.direction === 'right') {
	      image.x = 355;
	    }
	    // if (this.dead) {
	    //   image.x = 0;
	    //   image.y = 50;
	    // }
	    return image;
	  }

	  hitBoss() {
	    if (!this.hit) {
	      this.hit = true;
	      this.lives--;
	      this.canShoot = false;
	      console.log('boss lives: ', this.lives);
	      if (this.lives !== 0) {
	        setTimeout(() => {
	          this.canShoot = true;
	          this.hit = false;
	        }, 150);
	      }
	      if (this.lives === 0) {
	        this.dead = true;
	      }
	    }
	  }

	}

	module.exports = Boss;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	const Arrow = __webpack_require__(4);

	class Fireball extends Arrow {
	  constructor(player) {
	    super(...arguments);
	    this.width = 30;
	    this.height = 20;
	    this.dx = 5.8;
	    this.dy = -0.8;
	    this.gravity = 0.04;
	    this.drag = -0.02;
	  }

	  draw() {
	    // let image = this.updateImage()
	    this.ctx.fillstyle = 'red';
	    // this.ctx.fillRect(this.x, this.y, 10, 10)
	    let image = this.updateImage();
	    this.ctx.drawImage(this.fireBallImg(), image.sx, image.sy, image.sWidth, image.sHeight, this.x, this.y, this.width, this.height);
	    return this;
	  }

	  updateImage() {
	    let image = {};

	    if (this.direction === 'right') {
	      image.sx = 15;
	      image.sy = 145;
	      image.sWidth = 40;
	      image.sHeight = 35;
	    } else {
	      image.sx = 15;
	      image.sy = 188;
	      image.sWidth = 40;
	      image.sHeight = 35;
	    }

	    return image;
	  }

	  shootDirection(player) {
	    if (this.direction === 'left') {
	      return player.x - 40;
	    } else {
	      return player.x + 40;
	    }
	  }

	  fireBallImg() {
	    let img = new Image();

	    img.src = this.player.spriteSrc;
	    return img;
	  }

	}

	module.exports = Fireball;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(2);
	const Kunai = __webpack_require__(17);

	class Ninja extends Player {
	  constructor() {
	    super(...arguments);
	    this.jumping = false;
	    this.canDoubleJump = true;
	    this.speed = 4.4;
	    this.shotTiming = 0;
	    this.wepNumber = 1;
	    this.reloadDelay = 1000;
	  }

	  arrow() {
	    if (this.quiver > 0) {
	      this.quiver--;
	      if (this.wepNumber > this.quiver) {
	        this.wepNumber = 0;
	      } else {
	        this.wepNumber++;
	      }
	      this.shooting = true;
	      const arrow = new Kunai(this);

	      this.arrows.push(arrow);
	      setTimeout(() => {
	        this.shooting = false;
	      }, 1000);
	      //reload
	      (() => {
	        if (this.canReload) {
	          this.canReload = false;
	          setTimeout(() => {
	            this.quiver = 3 + this.upgradeQuiver;
	            this.canReload = true;
	          }, this.reloadDelay);
	        }
	      })();
	    }
	  }

	  setPlayerSprite() {
	    if (this.dead) {
	      this.spriteSrc = '../assets/explosion.png';
	    } else if (this.player === 'player2') {
	      this.spriteSrc = '../assets/ninja-sprites.png';
	    } else {
	      this.spriteSrc = '../assets/ninja-sprites.png';
	    }
	  }

	  gravity() {
	    if (this.isOnPlatform) {
	      return 0;
	    } else if (this.dy > -1 && this.dy < 0.5) {
	      //dy approaching jump peak
	      return .5;
	    } else if (this.dy >= 6) {
	      //dy max on free fall
	      return 6.5;
	    } else {
	      //
	      return this.dy * 1.7; //sets increasing dy
	    }
	  }

	  jump(direction) {
	    if (this.isOnPlatform) {
	      this.jumping = true;
	      this.dy = -17;
	    }

	    if (direction === 'left' && !this.isColliding(this.platforms)) {
	      this.dx = -4;
	    } else if (direction === 'right' && !this.isColliding(this.platforms)) {
	      this.dx = 4;
	    }
	  }

	}

	module.exports = Ninja;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	const Arrow = __webpack_require__(4);

	class Kunai extends Arrow {
	  constructor(player) {
	    super(...arguments);
	    this.dx = 7.6;
	    this.gravity = 0.05;
	    this.drag = -0.03;
	    this.width = 20;
	    this.dy = this.trajectory();
	  }

	  trajectory() {
	    if (this.player.wepNumber === 1) {
	      return -2.2;
	    } else if (this.player.wepNumber === 2) {
	      return -1;
	    } else {
	      return 0.2;
	    }
	  }
	}

	module.exports = Kunai;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(2);
	const Orb = __webpack_require__(19);

	class Mage extends Player {
	  constructor() {
	    super(...arguments);
	    this.speed = 3.8;
	    this.shotTiming = 270;
	    this.reloadDelay = 1050;
	    this.mageHover = 20;
	  }

	  draw() {
	    this.setPlayerSprite();
	    let image = this.updateImage();
	    let img = new Image();

	    img.src = this.spriteSrc;

	    if (this.dead) {
	      image = { sx: 0, sy: 0, sWidth: 60, sHeight: 48 };
	    }

	    this.ctx.drawImage(img, image.sx, image.sy, image.sWidth, image.sHeight, this.x - 20, this.y + 3, this.width + 40, this.height + 10);
	  }

	  arrow() {
	    if (this.quiver > 0) {
	      this.quiver--;
	      this.shooting = true;
	      const arrow = new Orb(this);

	      this.arrows.push(arrow);
	      setTimeout(() => {
	        this.shooting = false;
	      }, 1000);
	      //reload
	      (() => {
	        if (this.canReload) {
	          this.canReload = false;
	          setTimeout(() => {
	            this.quiver = 3 + this.upgradeQuiver;
	            this.canReload = true;
	          }, this.reloadDelay);
	        }
	      })();
	    }
	  }

	  setPlayerSprite() {
	    if (this.dead) {
	      this.spriteSrc = '../assets/explosion.png';
	    } else if (this.player === 'player2') {
	      this.spriteSrc = '../assets/mage-sprites.png';
	    } else {
	      this.spriteSrc = '../assets/mage-sprites.png';
	    }
	  }

	  gravity() {
	    if (this.isOnPlatform) {
	      return 0;
	    } else if (this.dy > -1 && this.dy < 0.5) {
	      //dy approaching jump peak
	      return .5;
	    } else if (this.dy >= 5) {
	      //dy max on free fall
	      return 4;
	    } else {
	      //
	      return this.dy * 1.4; //sets increasing dy
	    }
	  }

	  onPlatform() {
	    if (this.platforms.some(platform => {
	      return this.y + this.height + this.mageHover >= platform.y && this.y < platform.y && this.x >= platform.x - this.width && this.x + this.width <= platform.x + platform.width + this.width;
	    })) {
	      this.isOnPlatform = true;
	    } else {
	      this.isOnPlatform = false;
	    }
	  }
	}

	module.exports = Mage;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	const Arrow = __webpack_require__(4);

	class Orb extends Arrow {
	  constructor(player) {
	    super(...arguments);
	    this.dx = 8.3;
	    this.gravity = 0;
	    this.drag = 0;
	    this.height = 25;
	    this.width = 35;
	    this.dy = 0;
	    this.sinFrequency = 1.5;
	    this.sinSize = 2.1;
	  }

	  update() {
	    if (this.direction === 'right') {
	      this.x += this.dx;
	      this.y += Math.sin(this.x * this.sinFrequency) * this.sinSize;
	    } else {
	      this.x -= this.dx;
	      this.y += Math.sin(this.x * this.sinFrequency) * this.sinSize;
	    }
	  }

	  draw() {
	    let image = this.updateImage();

	    this.ctx.drawImage(this.arrowImage(), image.sx, image.sy, image.sWidth, image.sHeight, this.x, this.y, this.width, this.height);
	    return this;
	  }

	}

	module.exports = Orb;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	const Bodies = __webpack_require__(3);

	class Eye extends Bodies {
	  constructor(x, y, ctx, player1, player2) {
	    super(...arguments);
	    this.ctx = ctx;
	    this.x = x;
	    this.y = y;
	    this.speed = Math.random() * 1.6 + 0.4;
	    this.dx = 1;
	    this.dy = 1;
	    this.height = 40;
	    this.width = 40;
	    this.direction = 'right';
	    this.dead = false;
	    this.lives = 1;
	    this.player1 = player1;
	    this.player2 = player2;
	    this.target = this.chooseTarget();
	  }

	  chooseTarget() {
	    if (this.player1.dead) {
	      return this.player2;
	    } else if (this.player2.dead) {
	      return this.player1;
	    } else {
	      return [this.player1, this.player2][Math.floor(Math.random() * 2)];
	    }
	  }

	  update() {
	    this.draw();
	    this.track();

	    this.x += this.dx;
	    this.y += this.dy;
	  }

	  track() {
	    if (this.dead) {
	      this.dx = 0;
	      this.dy = 0;
	    }

	    if (this.target.dead) {
	      this.target = this.chooseTarget();
	    }
	    //horizontal tracking
	    if (!this.dead && this.target.x - this.x < 5 && this.target.x - this.x > -5) {
	      this.dx = 0;
	    } else if (!this.dead && this.target.x > this.x) {
	      this.dx = this.speed;
	      this.direction = 'right';
	    } else if (!this.dead) {
	      this.dx = -this.speed;
	      this.direction = 'left';
	    }
	    //vertical tracking
	    if (!this.dead && this.target.y > this.y) {
	      this.dy = this.speed;
	    } else if (!this.dead) {
	      this.dy = -this.speed;
	    }
	  }

	  draw() {
	    let image = this.enemySprite();
	    let imageXY = this.updateImage();

	    this.ctx.drawImage(image, imageXY.x, imageXY.y, 50, 30, this.x, this.y, 54, 40);
	  }

	  move() {
	    return false;
	  }

	  enemySprite() {
	    let img = new Image();

	    img.src = '../assets/eyeball-sprites.png';
	    return img;
	  }

	  updateImage() {
	    let image = {};

	    image.x = 0;
	    image.y = 0;
	    if (this.direction === 'right') {
	      image.x = 70;
	    }
	    if (this.dead) {
	      image.x = 0;
	      image.y = 40;
	    }
	    return image;
	  }

	}

	module.exports = Eye;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	const Eye = __webpack_require__(20);

	class Joker extends Eye {
	  constructor(x, y, ctx, player1, player2) {
	    super(...arguments);
	    this.width = 40;
	    this.height = 60;
	    this.speed = 0.6;
	    this.lives = 3;
	    this.centerLocation = { x: 520, y: 350 };
	    this.target = this.centerLocation;
	    this.boundary = 400;
	    this.dead = false;
	    this.leftPatrol = { x: 470, y: 350 };
	    this.rightPatrol = { x: 570, y: 350 };
	  }

	  update() {
	    this.draw();
	    this.jokerTarget();
	    this.track();

	    this.x += this.dx;
	    this.y += this.dy;
	  }

	  jokerTarget() {
	    const player1Distance = Math.hypot(this.player1.x - 520, this.player1.y - 350);
	    const player2Distance = Math.hypot(this.player2.x - 520, this.player2.y - 350);

	    const closestPlayer = player1Distance <= player2Distance ? this.player1 : this.player2;

	    if (player1Distance < this.boundary && !this.player1.dead || player2Distance < this.boundary && !this.player2.dead) {
	      this.target = closestPlayer;
	    } else if (this.player1.dead && player2Distance < this.boundary) {
	      this.target = this.player2;
	    } else if (this.player2.dead && player1Distance < this.boundary) {
	      this.target = this.player1;
	    } else {
	      this.patrol();
	    }
	  }

	  patrol() {
	    if (this.target !== this.leftPatrol && this.target !== this.rightPatrol && this.x > this.leftPatrol.x) {
	      this.target = this.leftPatrol;
	    } else if (this.target === this.leftPatrol && this.x - this.target.x < 10 && this.x - this.target.x > -10) {
	      this.target = this.rightPatrol;
	    } else if (this.target === this.rightPatrol && this.x - this.target.x < 10 && this.x - this.target.x > -10) {
	      this.target = this.leftPatrol;
	    }
	  }

	  hitA() {
	    if (!this.hit) {
	      this.hit = true;
	      this.lives--;
	      if (this.lives !== 0) {
	        setTimeout(() => {
	          this.canShoot = true;
	          this.hit = false;
	        }, 150);
	      }
	      if (this.lives === 0) {
	        this.dead = true;
	      }
	    }
	  }

	  draw() {
	    let image = this.enemySprite();
	    let imageXY = this.updateImage();

	    this.ctx.drawImage(image, imageXY.x, imageXY.y, 90, 100, this.x - 15, this.y - 20, 100, 100);
	  }

	  enemySprite() {
	    let img = new Image();

	    img.src = '../assets/joker-sprites.png';
	    return img;
	  }

	  updateImage() {
	    let image = {};

	    image.x = 0;
	    image.y = 0;
	    if (this.direction === 'right') {
	      image.x = 95;
	    }
	    if (this.hit) {
	      image.y = 102;
	    }
	    return image;
	  }

	}

	module.exports = Joker;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	const Bodies = __webpack_require__(3);

	class Cerberus extends Bodies {
	  constructor(ctx, x, y, player1, player2, platforms) {
	    super(...arguments);
	    this.x = x;
	    this.y = y;
	    this.dx = 0;
	    this.dy = 0;
	    this.height = 40;
	    this.width = 60;
	    this.lives = 3;
	    this.ctx = ctx;
	    this.platforms = platforms;
	    this.player1 = player1;
	    this.player2 = player2;
	    this.isLunging = false;
	    this.canLunge = true;
	    this.canChangeDirection = true;
	    this.lungeHeight = -5;
	    this.lungeSpeed = 6;
	    this.speed = 2.4;
	    this.hit = false;
	    this.direction = 'left';
	    this.dead = false;
	    this.gravity = .2;
	    this.invincible = false;
	    this.target = this.chooseTarget();
	  }

	  update() {
	    this.draw();
	    this.verticalForces();
	    this.horizontalForces();
	    this.shouldAttack();

	    this.x += this.dx;
	    this.y += this.dy;
	    this.dy += this.gravity;
	  }

	  verticalForces() {
	    if (this.onPlatform() && !this.isLunging) {
	      //if on platform and not exerting force, zero out
	      this.dy = 0;
	      this.gravity = 0;
	    } else if (this.onPlatform() && this.isLunging) {
	      //on platform, exerting force, force = exertion
	      this.dy = this.lungeHeight;
	    } else if (!this.onPlatform()) {
	      //if in midair, force = gravity
	      this.gravity = 0.2;
	    }
	  }

	  horizontalForces() {
	    const targetDistance = Math.hypot(this.target['x'] - this.x + 30, this.target['y'] - this.y);
	    const agility = targetDistance * 4;

	    if (this.dead) this.dx = 0;
	    //lunge right
	    else if (this.isLunging && this.target.x > this.x && this.direction === 'right') {
	        this.dx = this.lungeSpeed;
	        //lunge left
	      } else if (this.isLunging && this.target.x < this.x && this.direction === 'left') {
	        this.dx = -this.lungeSpeed;
	        //maintain lunge velocity in air
	      } else if (!this.onPlatform() && !this.canLunge && this.direction === 'right') {
	        this.dx = this.lungeSpeed;
	        //maintain lunge velocity in air
	      } else if (!this.onPlatform() && !this.canLunge && this.direction === 'left') {
	        this.dx = -this.lungeSpeed;
	        //ground tracking
	      } else if (this.onPlatform() && this.target.x > this.x && this.canChangeDirection) {
	        // ground 
	        this.direction = 'right';
	        this.canChangeDirection = false;
	        this.dx = this.speed;
	        setTimeout(() => {
	          this.canChangeDirection = true;
	        }, Math.random() * agility);
	        //ground tracking
	      } else if (this.onPlatform() && this.target.x < this.x && this.canChangeDirection) {
	        this.direction = 'left';
	        this.canChangeDirection = false;
	        this.dx = -this.speed;
	        setTimeout(() => {
	          this.canChangeDirection = true;
	        }, Math.random() * agility);
	        //reset to ground speed
	      } else if (this.dx > this.lungeSpeed - 1) this.dx = this.speed;else if (this.dx < -this.lungeSpeed + 1) this.dx = -this.speed;
	  }

	  shouldAttack() {
	    const targetDistance = Math.hypot(this.target['x'] - this.x + 30, this.target['y'] - this.y);
	    const attackDistance = 300;

	    if (targetDistance < attackDistance && !this.isLunging && this.canLunge) {
	      this.isLunging = true;
	      this.canLunge = false;
	      setTimeout(() => {
	        this.isLunging = false;
	      }, 700);

	      setTimeout(() => {
	        this.canLunge = true;
	        this.target = this.chooseTarget();
	      }, 2000);
	    }
	  }

	  chooseTarget() {
	    const player1Distance = Math.hypot(this.player1.x - this.x, this.player1.y - this.y);
	    const player2Distance = Math.hypot(this.player2.x - this.x, this.player2.y - this.y);
	    const closestPlayer = player1Distance <= player2Distance ? this.player1 : this.player2;

	    if (this.player1.dead) return this.player2;
	    if (this.player2.dead) return this.player1;

	    return closestPlayer;
	  }

	  draw() {
	    let image = this.enemySprite();
	    let imageXY = this.updateImage();

	    this.ctx.drawImage(image, imageXY.x, imageXY.y, 80, 55, this.x - 15, this.y - 37, 100, 80);
	  }

	  enemySprite() {
	    let img = new Image();

	    img.src = '../assets/cerberus-sprites.png';
	    return img;
	  }

	  updateImage() {
	    let image = {};

	    image.x = 0;
	    image.y = 0;
	    if (this.direction === 'right') {
	      image.x = 80;
	    }
	    if (this.hit) {
	      image.y = 60;
	    }

	    if (this.isLunging && !this.hit) {
	      image.x = 155;
	      if (this.direction === 'right') {
	        image.x = 240;
	      }
	    }
	    return image;
	  }

	  onPlatform() {
	    return this.platforms.some(platform => {
	      return this.y + this.height >= platform.y && this.y < platform.y && this.x >= platform.x - this.width && this.x + this.width <= platform.x + platform.width + this.width;
	    });
	  }

	  hitA() {
	    if (!this.hit) {
	      this.hit = true;
	      this.lives--;
	      if (this.lives !== 0) {
	        setTimeout(() => {
	          this.hit = false;
	        }, 250);
	      }
	      if (this.lives === 0) {
	        this.dead = true;
	      }
	    }
	  }
	}

	module.exports = Cerberus;

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	class Keyboarder {
	  constructor() {
	    this.keyState = { 80: true }; //32 = spacebar
	    this.playerKeys = {
	      player1: {
	        left: 37,
	        right: 39,
	        jump: 38,
	        shoot: 32
	      },
	      player2: {
	        left: 219,
	        right: 220,
	        jump: 187,
	        shoot: 80
	      }
	    };
	    window.onkeydown = e => {
	      if (e.keyCode === 80) {
	        e.preventDefault();
	        this.keyState[80] = !this.keyState[80];
	      } else {
	        this.keyState[e.keyCode] = true;
	      }
	    };
	    window.onkeyup = e => {
	      if (e.keyCode === 80) {
	        e.preventDefault();
	        return;
	      } else {
	        this.keyState[e.keyCode] = false;
	      }
	    };
	  }

	  isDown(keyCode) {
	    return this.keyState[keyCode] === true;
	  }
	}

	module.exports = Keyboarder;

/***/ })
/******/ ]);
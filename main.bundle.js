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
	const Keyboarder = __webpack_require__(19);
	const canvas = document.getElementById('screen');
	const canvas2 = document.getElementById('background');
	const canvas3 = document.getElementById('backdrop');
	const ctx = canvas.getContext('2d');
	const ctx2 = canvas2.getContext('2d');
	const ctx3 = canvas3.getContext('2d');
	const keyboarder = new Keyboarder();

	function startGame() {
	  const currentGame = new Game(mode, canvas, canvas2, canvas3, ctx, ctx2, ctx3, keyboarder, player1Character, player2Character);

	  mode === 'versus' ? currentGame.versus() : currentGame.coop();
	  setTimeout(() => currentGame.gameLoop(), 450);
	}

	//menu events and variables
	let mode;
	const menu = document.querySelector('#menu');
	const versus = document.querySelector('.versus');
	const coop = document.querySelector('.coop');

	versus.addEventListener('click', () => {
	  menu.style.zIndex = -1;
	  mode = 'versus';
	});

	coop.addEventListener('click', () => {
	  menu.style.zIndex = -1;
	  mode = 'coop';
	});

	//character selection events and variables
	let player1Character;
	let player2Character;
	const characterSelection = document.querySelector('#character-selection');
	const selectText = document.querySelector('.select-text');
	const archerSelect = document.querySelector('.archer');
	const assassinSelect = document.querySelector('.assassin');
	const mageSelect = document.querySelector('.mage');
	const Player = __webpack_require__(2);
	const Ninja = __webpack_require__(13);
	const Mage = __webpack_require__(15);

	archerSelect.addEventListener('click', () => {
	  if (!player1Character) {
	    player1Character = Player;
	    selectText.innerHTML = 'Player 2 (right side) choose your character:';
	  } else {
	    player2Character = Player;
	    characterSelection.style.zIndex = -1;
	    startGame();
	  }
	});

	assassinSelect.addEventListener('click', () => {
	  if (!player1Character) {
	    player1Character = Ninja;
	    selectText.innerHTML = 'Player 2 (right side) choose your character:';
	  } else {
	    player2Character = Ninja;
	    characterSelection.style.zIndex = -1;
	    startGame();
	  }
	});

	mageSelect.addEventListener('click', () => {
	  if (!player1Character) {
	    player1Character = Mage;
	    selectText.innerHTML = 'Player 2 (right side) choose your character:';
	  } else {
	    player2Character = Mage;
	    characterSelection.style.zIndex = -1;
	    startGame();
	  }
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(2);
	const Enemy = __webpack_require__(5);
	const Powerup = __webpack_require__(6);
	const Background = __webpack_require__(7);
	const Boss = __webpack_require__(11);
	const Ninja = __webpack_require__(13);
	const Mage = __webpack_require__(15);
	const Eye = __webpack_require__(17);
	const Clock = __webpack_require__(18);

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

	    this.player1 = new player1Character(this.ctx, 175, 100, this.background.platforms, this.keyboarder, 'player1');
	    this.player2 = new player2Character(this.ctx, 785, 100, this.background.platforms, this.keyboarder, 'player2');
	    this.player1Character = player1Character;
	    this.player2Character = player2Character;
	    this.boss = new Boss(this.ctx, this.background.platforms, this.player1, this.player2);

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
	    this.frame = 0;
	  }

	  gameLoop() {
	    console.log(this.enemies.length);

	    const vsCondition = this.player1.lives > 0 && this.player2.lives > 0 && !this.keyboarder.isDown(32) && this.mode === 'versus';
	    const coopCondition = (this.player1.lives > 0 || this.player2.lives > 0) && !this.keyboarder.isDown(32) && this.mode === 'coop';
	    const coopVictoryCondition = this.boss.lives === 0;

	    this.gameLoop = this.gameLoop.bind(this);

	    if (vsCondition || coopCondition) {
	      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	      this.paused = false;
	      this.ctx.globalAlpha = 1;
	      this.updateScreen();
	      this.updatePowerup();
	      if (coopVictoryCondition) {
	        this.coopVictoryScreen();
	        return;
	      }
	      requestAnimationFrame(this.gameLoop);
	    } else if ((this.player1.lives === 0 || this.player2.lives === 0) && this.mode === 'versus') {
	      this.paused = true;
	      this.gameOverScreen();
	      this.keyboarder.keyState[32] = false;
	      if (this.keyboarder.isDown(78)) {
	        this.newGame();
	      }
	      requestAnimationFrame(this.gameLoop);
	    } else if (this.player1.lives === 0 && this.player2.lives === 0 && this.mode === 'coop') {
	      this.paused = true;
	      this.coopOverScreen();
	      this.keyboarder.keyState[32] = false;
	      requestAnimationFrame(this.gameLoop);
	    } else if (this.keyboarder.isDown(32)) {
	      this.paused = true;
	      this.displayControls();
	      requestAnimationFrame(this.gameLoop);
	    }
	  }

	  newGame() {
	    this.background.platforms = [];
	    this.level === 'level1' ? this.selectBackground('level2') : this.selectBackground('level1');
	    this.level = this.level === 'level1' ? 'level2' : 'level1';
	    this.player1 = new this.player1Character(this.ctx, 175, 100, this.background.platforms, this.keyboarder, 'player1');
	    this.player2 = new this.player2Character(this.ctx, 785, 100, this.background.platforms, this.keyboarder, 'player2');
	    this.enemies = [];
	    this.allArrows = [];
	    this.powerup = undefined;
	    this.canPowerup = true;
	  }

	  updateScreen() {
	    this.allArrows = this.player1.arrows.concat(this.player2.arrows).concat(this.boss.arrows);

	    if ((this.player1.isColliding(this.allArrows) || this.player1.isColliding(this.enemies)) && !this.player1.invincible) {
	      this.filterCollidingArrows([this.player1]);
	      this.player1.hit();
	      this.player1.upgradeSpeed = 0;
	      this.player1.upgradeQuiver = 0;
	      this.player1.quiver = 3;
	    }
	    if ((this.player2.isColliding(this.allArrows) || this.player2.isColliding(this.enemies)) && !this.player2.invincible) {
	      this.filterCollidingArrows([this.player2]);
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
	    this.ctx2.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    this.ctx3.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    this.background.changeBackground(level);
	    this.background.createBackground();
	    setTimeout(() => this.background.drawBackground(), 200);
	  }

	  versus() {
	    const eyeSpawnInterval = 14500;
	    const randomLevel = ['level1', 'level2'][Math.floor(Math.random() * 2)];
	    this.selectBackground(randomLevel);
	    this.generateMonsterChance = 0.001;
	    this.level = randomLevel === 'level1' ? 'level1' : 'level2';

	    const spawnEye = setInterval(() => {
	      if (!this.paused) {
	        this.spawnEyes();
	      }
	    }, eyeSpawnInterval);
	  }

	  coop() {
	    const randomLevel = ['level1', 'level2'][Math.floor(Math.random() * 2)];
	    this.selectBackground(randomLevel);
	    this.level = randomLevel === 'level1' ? 'level1' : 'level2';
	    this.generateMonsterChance = 0.003;
	    this.numberEyeSpawn = 1;
	    const bossTiming = 50000; //50 sec
	    const eyeSpawnInterval = 9500; //9.5 sec

	    let spawnEye = setInterval(() => {
	      //limit eyes on boss appearance, otherwise increment
	      if (this.generateMonsterChance === 0) {
	        this.numberEyeSpawn = 2;
	      }
	      //call eye spawning
	      if (!this.paused) {
	        this.spawnEyes();
	        this.numberEyeSpawn++;
	      }
	    }, eyeSpawnInterval);

	    setTimeout(() => {
	      this.enemies.push(this.boss);
	      this.numberEyeSpawn = 2;
	      this.generateMonsterChance = 0;
	    }, bossTiming);
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
	        this.enemies.push(new Eye(this.randomX, this.randomY, this.ctx, this.player1, this.player2));
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

	  updateEnemies() {

	    if (!this.generateEnemy) {
	      setTimeout(() => {
	        this.generateEnemy = true;
	      }, this.enemyGenTiming);
	    } else if (Math.random() < this.generateMonsterChance) {
	      this.enemies.push(new Enemy(this.ctx, this.background.platforms));
	      this.generateEnemy = false;
	    }

	    this.enemies.forEach(enemy => {
	      enemy.update();
	      if (enemy.isColliding(this.allArrows) && enemy instanceof Boss && !enemy.dead) {
	        enemy.hitBoss();
	        this.filterCollidingArrows([enemy]);

	        setTimeout(() => {
	          this.enemies = this.enemies.filter(enemy => !enemy.dead);
	        }, 900);
	      } else if (enemy.isColliding(this.allArrows) && !enemy.dead) {
	        enemy.dead = true;
	        this.filterCollidingArrows([enemy]);

	        setTimeout(() => {
	          this.enemies = this.enemies.filter(enemy => !enemy.dead);
	        }, 900);
	      }
	    });
	  }

	  filterCollidingArrows(target) {
	    this.player1.arrows = this.player1.arrows.filter(arrow => {
	      return !arrow.isColliding(target);
	    });
	    this.player2.arrows = this.player2.arrows.filter(arrow => {
	      return !arrow.isColliding(target);
	    });
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
	    this.ctx.font = 'italic 20pt Tahoma';
	    this.ctx.fillText('Press [N] for new game', 500, 550);
	  }

	  coopOverScreen() {
	    this.ctx.fillStyle = 'rgba(236, 236, 236, 0.7)';
	    this.ctx.font = "bold 70pt Tahoma";
	    this.ctx.textAlign = 'center';
	    this.ctx.fillText('Game Over', 500, 250);
	  }

	  coopVictoryScreen() {
	    this.ctx.fillStyle = 'rgba(236, 236, 236, 0.7)';
	    this.ctx.font = "bold 70pt Tahoma";
	    this.ctx.textAlign = 'center';
	    this.ctx.fillText('Victory', 500, 250);
	  }

	  instructions() {
	    this.ctx.fillStyle = 'rgba(103, 128, 159, 0.9)';
	    this.ctx.font = "bold 16pt Tahoma";
	    this.ctx.textAlign = 'center';
	    if (this.mode === 'coop') {
	      this.ctx.fillText('Defeat the Boss', 500, 20);
	    }
	    if (this.mode === 'versus') {
	      this.ctx.fillText('Defeat the other Player', 500, 20);
	    }
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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	const Bodies = __webpack_require__(3);
	const Arrow = __webpack_require__(4);

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
	    //transport left and right
	    if (this.x > 1000) {
	      this.x = 0;
	    } else if (this.x < 0) {
	      this.x = 1000;
	    }
	    //transport from bottom to random top area
	    if (this.y > 800) {
	      this.y = 0;
	      //this.x = Math.random() * 1000;
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
	      this.ctx.font = "14pt Tahoma";
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
	    if (!this.dead) {
	      this.dead = true;
	      this.lives--;
	      this.canShoot = false;
	      if (this.lives !== 0) {
	        setTimeout(() => {
	          this.dead = false;
	          this.canShoot = true;
	          this.invincible = true;
	          this.invincibleTimer = 4;
	          this.invincibleCountdown();
	          this.y = -100;
	          this.x = Math.random() * 700 + 150;
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
	        if (upgrade === 'invincible' && !this.invincible) {
	          this.invincible = true;
	          this.invincibleTimer = 10;
	          this.invincibleCountdown();
	          setTimeout(() => {
	            this.invincible = false;
	          }, 10000);
	        } else if (upgrade === 'invincible' && this.invincible) {
	          this.lives++;
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
	    if (this.x > 1000) {
	      this.x = 0;
	    } else if (this.x < 0) {
	      this.x = 1000;
	    }

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
/***/ (function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(2);

	class Enemy extends Player {
	  constructor(ctx, platforms) {
	    super(...arguments);
	    this.ctx = ctx;
	    this.width = 20;
	    this.height = 45;
	    this.x = Math.random() * 700 + 150;
	    this.y = -100;
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
	    if (this.x > 1000) {
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
/* 6 */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	const Platform = __webpack_require__(8);
	const level1 = __webpack_require__(9);
	const level2 = __webpack_require__(10);

	class Background {
	  constructor(ctx2, ctx3, level = 'level1') {
	    this.level = level;
	    this.platforms = [];
	    this.backdrop = new Image();
	    this.levelConfig = {
	      level1: {
	        platforms: level1,
	        src: '../assets/level1/moon-backdrop.png'
	      },
	      level2: {
	        platforms: level2,
	        src: '../assets/level2/lake-backdrop.png' // '../assets/level2/nightsnow.jpg'
	      }
	    };
	    this.backdrop.src = this.levelConfig[this.level].src;
	    this.ctx2 = ctx2;
	    this.ctx3 = ctx3;
	  }

	  createBackground() {
	    this.levelConfig[this.level].platforms.forEach(obj => {
	      this.platforms.push(new Platform(this.ctx2, obj.x, obj.y, obj.width, obj.height, obj.src, obj.dx, obj.dy, obj.dWidth, obj.dHeight));
	    });
	  }

	  drawBackground() {
	    this.ctx3.drawImage(this.backdrop, 0, 0, 1000, 700);
	    this.platforms.forEach(platform => platform.draw());
	  }

	  changeBackground(level) {
	    this.level = level;
	    this.backdrop.src = this.levelConfig[this.level].src;
	  }

	}

	module.exports = Background;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	class Platform {
	  constructor(ctx, x, y, width, height, src, dx, dy, dWidth, dHeight) {
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
	  }

	  draw() {
	    this.ctx.drawImage(this.image, this.dx, this.dy, this.dWidth, this.dHeight);
	  }
	}

	module.exports = Platform;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	const level = [

	//left
	{
	  name: 'left-side',
	  src: '../assets/level1/l-side.png',
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
/* 10 */
/***/ (function(module, exports) {

	const level2 = [

	//left
	{
	  name: 'left-ground',
	  src: '../assets/level2/left-ground.png',
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(2);
	const Fireball = __webpack_require__(12);

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
	    this.target = [this.player1, this.player2][Math.floor(Math.random() * 2)];
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
	    if (this.x > 1000) {
	      this.x = 0;
	    } else if (this.y > 700) {
	      this.y = 0;
	      //this.x = Math.random() * 1000;
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
	      console.log(this.lives);
	      if (this.lives !== 0) {
	        setTimeout(() => {
	          this.canShoot = true;
	          this.hit = false;
	        }, 150);
	      }
	      if (this.lives === 0) {
	        this.dead = true;
	        console.log('boss defeated');
	      }
	    }
	  }

	}

	module.exports = Boss;

/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(2);
	const Kunai = __webpack_require__(14);

	class Ninja extends Player {
	  constructor() {
	    super(...arguments);
	    this.jumping = false;
	    this.canDoubleJump = true;
	    this.speed = 4.4;
	    this.shotTiming = 0;
	    this.wepNumber = 1;
	    this.reloadDelay = 1200;
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
/* 14 */
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(2);
	const Orb = __webpack_require__(16);

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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	const Arrow = __webpack_require__(4);

	class Orb extends Arrow {
	  constructor(player) {
	    super(...arguments);
	    this.dx = 8.3; //6.3
	    this.gravity = 0;
	    this.drag = 0; //accel
	    this.height = 25;
	    this.width = 35;
	    this.dy = 0;
	    this.sinFrequency = 1.5;
	    this.sinSize = 2.1;
	  }

	  update() {
	    if (this.x > 1000) {
	      this.x = 0;
	    } else if (this.x < 0) {
	      this.x = 1000;
	    }

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
	    // this.ctx.fillStyle = 'red';
	    // this.ctx.fillRect(this.x, this.y, 20, 20)
	    this.ctx.drawImage(this.arrowImage(), image.sx, image.sy, image.sWidth, image.sHeight, this.x, this.y, this.width, this.height);
	    return this;
	  }

	}

	module.exports = Orb;

/***/ }),
/* 17 */
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
	    if (this.player1.lives === 0) {
	      return this.player2;
	    } else if (this.player2.lives === 0) {
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
	    //horizontal tracking
	    if (!this.dead && this.target.x > this.x) {
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
/* 18 */
/***/ (function(module, exports) {

	//build a gameClock
	//requirements: start, pause, and reset
	//performance.now()
	//issues: work it into the loop, need events in Game.js to trigger off clock, need timer to pause when controls are displayed
	//solution: make new class??

	module.exports = class Clock {
	  constructor() {
	    this.running = false;
	  }

	  start() {
	    if (!this.time) this.time = performance.now();
	    if (!this.running) this.running = true;
	  }

	  pause() {
	    this.running = false;
	    this.time = null;
	  }

	  reset() {}
	};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	class Keyboarder {
	  constructor() {
	    this.keyState = { 32: true }; //32 = spacebar
	    this.playerKeys = {
	      player1: {
	        left: 65,
	        right: 68,
	        jump: 87,
	        shoot: 16
	      },
	      player2: {
	        left: 219,
	        right: 220,
	        jump: 187,
	        shoot: 80
	      }
	    };
	    window.onkeydown = e => {
	      if (e.keyCode === 32) {
	        e.preventDefault();
	        this.keyState[32] = !this.keyState[32];
	      } else {
	        this.keyState[e.keyCode] = true;
	      }
	    };
	    window.onkeyup = e => {
	      if (e.keyCode === 32) {
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
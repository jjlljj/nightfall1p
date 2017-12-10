const Bodies = require('./Bodies.js');
const Arrow = require('./Arrow.js'); 

class Player extends Bodies {
  constructor(ctx, x, y, platforms, keyboarder, player) {
    super(x, y)
    this.arrows = [];
    this.canDoubleJump = true;
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
  }

  arrow() {
    if (this.quiver > 0) {
      this.quiver--;
      this.shooting = true;
      const arrow = new Arrow(this);

      this.arrows.push(arrow);
      setTimeout(() => {
        this.shooting = false
      }, 300);
      //reload
      (() => {
        if (this.canReload) {
          this.canReload = false;
          setTimeout(() => {
            this.quiver = 3 + this.upgradeQuiver;
            this.canReload = true;
          }, this.reloadDelay)
        }
      })()
    }
  }

  update() {
    this.isPoweredUp();
    this.move();
    this.draw();
    this.renderAttributes();
    //update arrows
    this.arrows = this.arrows.filter((arrow) => {
      return !arrow.isColliding(this.platforms)
    });
    this.arrows.forEach(arrow => arrow.draw().update());
    this.transport()
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
      this.x = Math.random() * 1000;
    }

    //standard x and y update
    this.x += this.dx;
    this.y += this.dy;
  }

  draw() {
    this.setPlayerSprite()
    let image = this.updateImage()
    let img = new Image();

    img.src = this.spriteSrc;

    if (this.dead) {
      image = {sx: 0, sy: 0, sWidth: 60, sHeight: 48}
    } 

    this.ctx.drawImage(img, image.sx, image.sy, image.sWidth, image.sHeight, 
      this.x - 20, this.y - 10, this.width + 40, this.height + 10);
  }

  setPlayerSprite() {
    if (this.dead) {
      this.spriteSrc = '../assets/explosion.png'
    } else if (this.player === 'player2') {
      this.spriteSrc = '../assets/p2-sprites.png'
    } else {
      this.spriteSrc = '../assets/p1-sprites.png'
    }
  }

  move() {
    const key = this.keyboarder

    //left
    if (this.dead) {
      this.dx = 0;
      return false;
    } else if (this.isColliding(this.platforms)) {
      this.dx = -this.dx;
    } else if (key.isDown(key.playerKeys[this.player].left) 
      && !this.isColliding(this.platforms)) {
      this.dx = -4 - this.upgradeSpeed;
      this.direction = "left";
    } else if (key.isDown(key.playerKeys[this.player].right) 
      && !this.isColliding(this.platforms)) { 
      this.dx = 4 + this.upgradeSpeed;
      this.direction = "right";
    } else if (!this.jumping) {
      this.dx = 0;
    }
    //jump
    if (key.isDown(key.playerKeys[this.player].jump) 
      && this.isOnPlatform 
      && key.isDown(key.playerKeys[this.player].left)) {
      this.jump('left');
    } else if (key.isDown(key.playerKeys[this.player].jump) 
      && this.isOnPlatform 
      && key.isDown(key.playerKeys[this.player].right)) {
      this.jump('right');
    } else if (key.isDown(key.playerKeys[this.player].jump) 
      && this.isOnPlatform) { 
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
    let image = {} 

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

    return image
  }

  renderAttributes() {
    //render lives
    for (let i = 0; i < this.lives; i++) {
      let spriteY = 0;

      if (this.invincible) {
        spriteY = 30;
      }
      this.ctx.drawImage(this.powerUpDisplay(), 0, spriteY, 30, 30, 
        this.attributeSpriteX(i), 10, 15, 15);   
    }
    //arrow rendering
    for (let i = 0; i < this.quiver; i++) {
      this.ctx.drawImage(this.powerUpDisplay(), 87, 0, 30, 30, 
        this.attributeSpriteX(i), 33, 15, 15);
    }
    //speed rendering
    for (let i = 0; i < this.upgradeSpeed; i++) {
      this.ctx.drawImage(this.powerUpDisplay(), 60, 0, 30, 30, 
        this.attributeSpriteX(i), 55, 15, 15);
    }
    //shield above head rendering
    if (this.invincible) {
      this.ctx.globalAlpha = 0.5;
      this.ctx.drawImage(this.powerUpDisplay(), 30, 31, 25, 31, 
        this.x + 8, this.y - 42, 22, 25);
      this.ctx.globalAlpha = 1;
    }
    if (this.invincibleTimer > 0) {
      this.ctx.font = "14pt Tahoma";
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.invincibleTimer, this.x + 18, this.y - 48);
    }
  }

  attributeSpriteX(i) {
    let spriteX

    if (this.player === 'player1') {
      spriteX = 10 + (i * 20);
    } else {
      spriteX = 1000 - 30 - (i * 20);
    }
    return spriteX
  }

  gravity() {
    if (this.isOnPlatform) {
      return 0;
    } else if (this.dy > -1 && this.dy < 0.5) { //dy approaching jump peak
      return .5;
    } else if (this.dy >= 5) { //dy max on free fall
      return 6;
    } else { //
      return this.dy * 1.5 //sets increasing dy
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
      return this.y + this.height >= platform.y && 
      this.y < platform.y &&
      this.x >= platform.x - this.width &&  
      this.x + this.width <= platform.x + platform.width + this.width
    }) ) {
      this.isOnPlatform = true;
      this.canDoubleJump = true;
    } else {
      this.isOnPlatform = false;
    }
  }

  headCollision() {
    let headLeft = this.x;
    let headRight = this.x + this.width;
    let headHeight = this.y;
    let isColliding;

    this.platforms.forEach(function(platform) {
      if (platform.y + platform.height - 6 < headHeight
        && headHeight < platform.y + platform.height + 6 
        && headRight > platform.x 
        && headLeft < platform.x + platform.width) {
        isColliding = true;
      }
    })
    return isColliding;
  }

  hit() {
    if (!this.dead) {
      this.dead = true;
      this.lives --;
      this.canShoot = false;
      if (this.lives !== 0) {
        setTimeout(() => {
          this.dead = false;
          this.canShoot = true;
          this.invincible = true;
          this.invincibleTimer = 4;
          this.invincibleCountdown();
          this.y = -100;
          this.x = Math.random() * 1000;
        }, 1200); 
        setTimeout(() => {
          this.invincible = false;
        }, 5200); 
      }
    }
  }

  isPoweredUp() {
    const powerups = ['lives', 'upgradeQuiver', 'upgradeSpeed', 'invincible'];

    if (this.powerup !== undefined) {
      if (this.isColliding([this.powerup])) {
        let upgrade = powerups[Math.floor(Math.random() * powerups.length)];

        // invincibility upgrade
        if (upgrade === 'invincible') {
          this.invincible = true;
          this.invincibleTimer = 10;
          this.invincibleCountdown();
          setTimeout(() => {
            this.invincible = false;
          }, 10000);
        } else { // all other upgrades
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
    let powerUpDisplay = new Image;

    powerUpDisplay.src = '../assets/powerup-sprites.png';
    return powerUpDisplay
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
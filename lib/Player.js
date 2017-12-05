const Bodies = require('./Bodies.js');
const Arrow = require('./Arrow.js'); 

class Player extends Bodies {
  constructor(ctx, x, y, platforms, keyboarder) {
    super(x, y)
    this.ctx = ctx;
    this.width = 30;
    this.height = 40;
    this.player = 'player1';
    this.dx = 0;
    this.dy = 2;
    this.direction = "right";
    this.jumping = false;
    this.isOnPlatform = false;
    this.platforms = platforms;
    this.keyboarder = keyboarder;
    this.shooting = false;
    this.arrows = [];
    this.quiver = 3;
    this.upgradeQuiver = 0;
    this.upgradeSpeed = 0;
    this.canShoot = true;
    this.canReload = true;
    this.delay = 1500;
    this.lives = 3;
    this.dead = false;
    this.invincible = false;
    this.spriteSrc;
    this.powerup;
    this.collectPowerup = false;
    this.headImpact = false;
    this.toggleControls = true;
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
    const reload = () => {
      if (this.canReload) {
        this.canReload = false;
        setTimeout(() => {
          this.quiver = 3 + this.upgradeQuiver;
          this.canReload = true;
        }, this.delay)};
      }
      reload();
    }
  }

  update() {
    //this.headCollision();
    this.isPoweredUp();
    this.move();
    this.draw();
    this.renderAttributes();
    //update arrows
    this.arrows = this.arrows.filter(arrow => !arrow.isColliding(this.platforms));
    this.arrows.forEach(arrow => arrow.draw().update());

    this.transport()
  };

  transport() {
    this.onPlatform(this.platforms);
    //jump update
    if (this.jumping && this.dy < -.8 && !this.headCollision()){
      this.dy = this.dy*.92;
    } else if (this.headCollision()){
      console.log(this)
      this.dy = 10
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
      this.x = Math.random()*1000;
    }

    //standard x and y update
    this.x += this.dx;
    this.y += this.dy;
  }

  draw() {
    let image = this.updateImage()
    let img = new Image();
    img.src = this.spriteSrc;

    if (this.dead) {
      img.src = '../assets/explosion.png'
      image = {sx: 0, sy: 0, sWidth: 60, sHeight: 48}
    } 

    this.ctx.drawImage(img, image.sx, image.sy, image.sWidth, image.sHeight, this.x - 20, this.y - 10, this.width + 40, this.height + 10);
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
    for (let i=0; i < this.lives; i++) {
      let spriteY = 0;
      if (this.invincible) {
        spriteY = 30;
      }
      this.ctx.drawImage(this.powerUpDisplay(), 0, spriteY, 30, 30, this.attributeSpriteX(i), 10, 15, 15);   
    }
    //arrow rendering
    for (var i = 0; i < this.quiver; i++) {
      this.ctx.drawImage(this.powerUpDisplay(), 87, 0, 30, 30, this.attributeSpriteX(i), 33, 15, 15);
    }
      //speed rendering
    for (var i = 0; i < this.upgradeSpeed; i++) {
      this.ctx.drawImage(this.powerUpDisplay(), 60, 0, 30, 30, this.attributeSpriteX(i), 55, 15, 15);
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
    } else if (this.dy >-1 && this.dy < 0.5){ //dy approaching jump peak
      return .5;
    } else if (this.dy >= 5) { //dy max on free fall
      return 6;
    } else { //
      return this.dy * 1.5 //sets increasing dy
    }
  }

  jump(direction) {
    if (this.isOnPlatform){
      this.jumping = true;
      this.dy = -15;
    }

    if (direction === 'left' && !this.isColliding(this.platforms)) {
      this.dx = -4;
    } else if (direction === 'right' && !this.isColliding(this.platforms)) {
      this.dx = 4;
    }
  }

  onPlatform(platforms) {
    if (platforms.some(platform => {
      return this.y + this.height >= platform.y && 
      this.y < platform.y &&
      this.x >= platform.x - this.width &&  
      this.x + this.width <= platform.x + platform.width + this.width
    }) ) {
      this.isOnPlatform = true;
    } else {
      this.isOnPlatform = false;
    }
  }

  hit(){
    if (!this.dead) {
      this.dead = true;
      this.invincible = true;
      this.lives --;
      this.canShoot = false;
      if (this.lives !== 0) {
      setTimeout(() => {
          this.dead = false;
          this.canShoot = true;
          this.y = -100;
          this.x = Math.random() * 1000;
          }, 1200); 
      setTimeout(() => {
          this.invincible = false;
          }, 4000); 
      }
    }
  }

  isColliding(array) {
    let isColliding = false;

    for (let i=0; i < array.length; i++) {
      if (
          (this.x + this.width > array[i].x) && !(this.y >= array[i].y + array[i].height || this.y + this.height - 10 <= array[i].y)
          && ((this.x < array[i].x + array[i].width) && !(this.y >= array[i].y + array[i].height || this.y + this.height - 10 <= array[i].y))
          ) {
            isColliding = true;
        } 
    }
    return isColliding;
  }

  headCollision() {
    let headLeft = this.x;
    let headRight = this.x + this.width;
    let headHeight = this.y;
    let isColliding;
    this.platforms.forEach(function(platform) {
      if (platform.y + platform.height - 6 < headHeight && headHeight < platform.y + platform.height + 6 && headRight > platform.x && headLeft < platform.x + platform.width) {
        console.log('collision!');
        isColliding = true;
      }
    })
    return isColliding;
  }

  isPoweredUp() {
    const powerups = ['lives', 'upgradeQuiver', 'upgradeSpeed'];
    if (this.powerup !== undefined) {
      if (this.y < this.powerup.y + this.powerup.height && this.y > this.powerup.y && this.x > this.powerup.x - 30 && this.x < this.powerup.x + 25) {
        let upgrade = powerups[Math.floor(Math.random() * powerups.length)];
        this[upgrade]++;
        if (upgrade === 'upgradeQuiver') {
          this.quiver++;
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

}

module.exports = Player;
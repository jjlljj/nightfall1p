const Bodies = require('./Bodies.js');
const Arrow = require('./Arrow.js'); 

//pass in context and have player draw itself
class Player extends Bodies {
  constructor(ctx, x, y, platforms) {
    super(x, y)
    this.ctx = ctx
    this.width = 20;
    this.height = 40;
    this.dx = 0;
    this.dy = 2;
    this.direction = "right";
    this.jumping = false;
    this.isOnPlatform = false;
    this.platforms = platforms;
    this.arrows = [];
    this.quiver = 3;
    this.canShoot = true;
    this.canReload = true;
    this.delay = 1500;
    this.lives= 3;
  }

  arrow() { //player is parameter
    if (this.quiver > 0) {
    this.quiver--;
    const arrow = new Arrow(this);
    this.arrows.push(arrow);
    if (this.canReload) {
      this.canReload = false;
      setTimeout(() => {
        this.quiver = 3;
        this.canReload = true;
      }, this.delay)};
    }
  }

  update() {
    this.draw();
    this.onPlatform(this.platforms);
    this.arrows = this.arrows.filter(arrow => !arrow.isColliding());
    this.arrows.forEach(arrow => arrow.draw().update());

    if (this.jumping && this.dy < -.8){
      this.dy = this.dy*.92;
    } else {
      this.dy = this.gravity()
      this.jumping = false;
    }

    if (this.x > 1000) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = 1000;
    }
    if (this.y > 800) {
      this.y = 0;
      this.x = Math.random()*1000
    }

    this.x += this.dx;
    this.y += this.dy;
  };

  draw() {
    let img = new Image();
    img.src = '../assets/p1-char.png';
    this.ctx.drawImage(img, this.x, this.y, this.width, this.height)
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  gravity() {
    if (this.isOnPlatform) {
      return 0;
    } else if (this.dy >-1 && this.dy < 0.5){ //dy approaching jump peak
      return .5;
    } else if (this.dy >= 5) { //dy max on free fall
      return 5
    } else { //
      return this.dy * 1.5 //sets increasing dy
    }
  }

  jump(direction) {
    this.jumping = true;
    this.dy = -15;
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
      this.x >= platform.x - 20 &&  
      this.x + this.width <= platform.x + platform.width + 20
    }) ) {
      this.isOnPlatform = true;
    } else {
      this.isOnPlatform = false;
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
    return isColliding
  }
}

module.exports = Player;
const Bodies = require('./Bodies.js');
const Arrow = require('./Arrow.js'); 

//pass in context and have player draw itself
class Player extends Bodies {
  constructor(ctx, x, y, platforms) {
    super(x, y)
    this.ctx = ctx
    this.width = 30;
    this.height = 40;
    this.dx = 0;
    this.dy = 2;
    this.direction = "right";
    this.jumping = false;
    this.isOnPlatform = false;
    this.platforms = platforms;
    this.shooting = false;
    this.arrows = [];
    this.quiver = 3;
    this.canShoot = true;
    this.canReload = true;
    this.delay = 1500;
    this.lives= 3;
    this.dead = false;
    this.lastDeath 
  }

  arrow() { //player is parameter
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
          this.quiver = 3;
          this.canReload = true;
        }, this.delay)};
      }
      reload();
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
    let image = this.updateImage()
    let img = new Image();
    img.src = '../assets/p1-sprites.png';

    if (this.dead) {
      img.src = '../assets/explosion.png'
      image = {sx: 0, sy: 0, sWidth: 80, sHeight: 50}
    } 

    this.ctx.drawImage(img, image.sx, image.sy, image.sWidth, image.sHeight, this.x - 20, this.y - 10, this.width + 40, this.height + 10)
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
      image.sx = 180;
    } 

    return image
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
      setTimeout(() => {
          this.dead = false;
          this.lives --;
          this.y = -100;
          this.x = Math.random() * 1000
          }, 1200); 
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
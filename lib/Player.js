const Bodies = require('./Bodies.js');
const Arrow = require('./Arrow.js'); 

//pass in context and have player draw itself
class Player extends Bodies {
  constructor(x, y, platforms) {
    super(x, y)
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
    this.canReload = true;
    this.delay = 1500;
    this.lives= 3;
  }

  arrow(player) {
    if (this.quiver > 0) {
    this.quiver--;
    const arrow = new Arrow(this);
    this.arrows.push(arrow);
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

  move(key) {
    if (this.isColliding(this.platforms)) {
      this.dx = -this.dx;
    } else if (key.isDown(37) && !this.isColliding(this.platforms)) { //&& !this.jumping - prevents midair direction change
      this.dx = -4;
      this.direction = "left";
    } else if (key.isDown(39) && !this.isColliding(this.platforms)) { //as above
      this.dx = 4;
      this.direction = "right";
    }
    else if (!this.jumping) {
      this.dx = 0;
    }

    // if (key.isDown(188)) {  //188 is comma key
    //   this.arrow();
    // } 
    /// need to adjust for bottom of screen --> floor collision detection
    if (key.isDown(32) && this.isOnPlatform && key.isDown(37)) {
      this.jump('left');
    } else if (key.isDown(32) && this.isOnPlatform && key.isDown(39)) {
      this.jump('right');
    } else if (key.isDown(32) && this.isOnPlatform) { 
      this.jump();
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
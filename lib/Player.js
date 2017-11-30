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
  }

  arrow(player) {
    const arrow = new Arrow(this);
    this.arrows.push(arrow);
  }

  update() {
    this.onPlatform(this.platforms);
    this.arrows.forEach(arrow => arrow.draw().update());

    if (this.jumping && this.dy < -.8){
      this.dy = this.dy*.92;
    } else {
      this.dy = this.gravity()
      this.jumping = false;
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
      return this.dy*1.5 //sets increasing dy
    }
  }

  jump(direction) {
    this.jumping = true;
    this.dy = -10;
    if (direction === 'left') {
      this.dx = -4;
    } else if (direction === 'right') {
      this.dx = 4;
    }
  }

  move(key) {

    if (key.isDown(37)) { //&& !this.jumping - prevents midair direction change
      this.dx = -4;
      this.direction = "left";
    } else if (key.isDown(39)) { //as above
      this.dx = 4;
      this.direction = "right"
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
      this.dx = -4;
    } else if (key.isDown(32) && this.isOnPlatform && key.isDown(39)) {
      this.jump('right');
      this.dx = 4;
    } else if (key.isDown(32) && this.isOnPlatform) { 
      this.jump();
    }

  }

  onPlatform(platforms) {
    if (platforms.some(platform => {
      return this.y + this.height >= platform.y && 
      this.y < platform.y &&
      this.x >= platform.x &&  
      this.x + this.width <= platform.x + platform.width
    }) ) {
      this.isOnPlatform = true;
    } else {
      this.isOnPlatform = false;
    }
  }

}


module.exports = Player;
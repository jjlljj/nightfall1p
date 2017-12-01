const Player = require('./Player.js');

class Player2 extends Player {
  constructor() {
    super();
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
    //jump
    if (key.isDown(32) && this.isOnPlatform && key.isDown(37)) {
      this.jump('left');
    } else if (key.isDown(32) && this.isOnPlatform && key.isDown(39)) {
      this.jump('right');
    } else if (key.isDown(32) && this.isOnPlatform) { 
      this.jump();
    }
  }
}


module.exports = Player2;
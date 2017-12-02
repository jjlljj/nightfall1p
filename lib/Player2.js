const Player = require('./Player.js');

class Player2 extends Player {
  constructor() {
    super(...arguments);
    this.spriteSrc = '../assets/p2-sprites.png';
    this.direction="left";
  }

    move() {
    const key = this.keyboarder
    if (this.dead) {
      this.dx = 0;
      return false;
    } else if (this.isColliding(this.platforms)) {
      this.dx = -this.dx;
    } else if (key.isDown(219) && !this.isColliding(this.platforms)) { //219 = [
      this.dx = -4;
      this.direction = "left";
    } else if (key.isDown(220) && !this.isColliding(this.platforms)) { //220 = \
      this.dx = 4;
      this.direction = "right";
    }
    else if (!this.jumping) {
      this.dx = 0;
    }
    //jump
    if (key.isDown(187) && this.isOnPlatform && key.isDown(219)) { //187 = '='
      this.jump('left');
    } else if (key.isDown(187) && this.isOnPlatform && key.isDown(220)) {
      this.jump('right');
    } else if (key.isDown(187) && this.isOnPlatform) { 
      this.jump();
    }
    //shoot 
    if (key.isDown(80)) { //80 = P
      if (this.canShoot) {
        this.arrow();
        this.canShoot = false;
        setTimeout(() => {
          this.canShoot = true;
        }, 100);
      }
    }
  }
}

module.exports = Player2;
const Player = require('./Player.js');

class Player1 extends Player {
  constructor() {
    super(...arguments);
    this.spriteSrc = '../assets/p1-sprites.png'
  }

  move() {
    const key = this.keyboarder
    if (this.dead) {
      this.dx = 0;
      return false;
    } else if (this.isColliding(this.platforms)) {
      this.dx = -this.dx;
    } else if (key.isDown(65) && !this.isColliding(this.platforms)) { //65 = A
      this.dx = -4 - this.upgradeSpeed;
      this.direction = "left";
    } else if (key.isDown(68) && !this.isColliding(this.platforms)) { //68 = D
      this.dx = 4 + this.upgradeSpeed;
      this.direction = "right";
    }
    else if (!this.jumping) {
      this.dx = 0;
    }
    //jump
    if (key.isDown(87) && this.isOnPlatform && key.isDown(65)) { //87 = W
      this.jump('left');
    } else if (key.isDown(87) && this.isOnPlatform && key.isDown(68)) {
      this.jump('right');
    } else if (key.isDown(87) && this.isOnPlatform) { 
      this.jump();
    }
    //shoot 
    if (key.isDown(16)) { //16 = Shift
      if (this.canShoot) {
        this.arrow();
        this.canShoot = false;
        setTimeout(() => {
          this.canShoot = true;
        }, 200);
      }
    }
  }
}

module.exports = Player1;
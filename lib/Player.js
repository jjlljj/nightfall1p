const Bodies = require('./Bodies.js') 

class Player extends Bodies {
  constructor(x,y) {
    super(x, y)
    this.w = 20;
    this.h = 40;
    this.dx = 0;
    this.dy = 0;
    this.direction = "right";
    this.jumping = false;

  }

  update() {
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
    if (this.y > 600 - 40) {
      return 0;
    } else if (this.dy >-1 && this.dy < 0){
      return .5;
    } else if (this.dy >= 5) {
      return 5
    } else {
      return this.dy*1.5
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
    if (key.isDown(37) && !this.jumping) {
      this.dx = -4;
      this.direction = "right";
    } else if (key.isDown(39) && !this.jumping) {
      this.dx = 4;
      this.direction = "left"
    }
    else if (!this.jumping) {
      this.dx = 0;
    }

    if (key.isDown(32) && this.y > 558 && key.isDown(37)) {
      this.jump('left')
      this.dx = -4;
    } else if (key.isDown(32) && this.y > 558 && key.isDown(37)) {
      this.jump('right')
      this.dx = 4;
    } else if (key.isDown(32) && this.y > 558) {
      this.jump()
    }


  }

}


module.exports = Player;
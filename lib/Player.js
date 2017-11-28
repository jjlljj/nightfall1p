const Bodies = require('./Bodies.js') 

class Player extends Bodies {
  constructor(x,y) {
    super(x, y)
    this.w = 20;
    this.h = 40;
    this.dx = 0;
    this.dy = 0;

  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  };

  move(key) {
    if (key.isDown(37)) {
      this.dx = -2;
    } else if (key.isDown(39)) {
      this.dx = 2;
    }
    else {
      this.dx = 0;
    }
  }

}


module.exports = Player;
const Bodies = require('./Bodies.js');
const Player = require('./Player.js');
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

class Arrow extends Bodies {
  constructor(player) {
    super(ctx)
    this.direction = player.direction;
    this.x = this.shootDirection(player);
    this.y = player.y + 15;
    this.width = 24;
    this.height = 4;
    this.dx = 12;
    this.dy = -1.5;
    this.gravity = 0.12;
    this.drag = -0.06;
    this.platforms = player.platforms
  }

  draw() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
    return this;
  }

  shootDirection(player) {
    if (this.direction === 'left') {
      return player.x - 30;
    } else {
      return player.x + 30;
    }
  }



  update() {
    if (this.x > 1000) {
      this.x = 0
    } else if (this.x < 0 ) {
      this.x = 1000;
    }
    
    if (this.direction === 'right') {
      this.x += this.dx;
      this.dx += this.drag;
      this.y += this.dy;
      this.dy += this.gravity;
    } else {
      this.x -= this.dx;
      this.dx += this.drag;
      this.y += this.dy;
      this.dy += this.gravity;
    }
  }

  isColliding() {
    const platformBodies = this.platforms;
    let isColliding = false;

    for (let i=0; i < platformBodies.length; i++) {
      if (
          (this.x + this.width > this.platforms[i].x) && !(this.y >= this.platforms[i].y + this.platforms[i].height || this.y + this.height - 10 <= this.platforms[i].y)
          && ((this.x < this.platforms[i].x + this.platforms[i].width) && !(this.y >= this.platforms[i].y + this.platforms[i].height || this.y + this.height - 10 <= this.platforms[i].y))
          ) {
            isColliding = true;
        } 
    }
    return isColliding
  }

  
}

module.exports = Arrow;
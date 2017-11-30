const Bodies = require('./Bodies.js');
const Player = require('./Player.js');
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

class Arrow extends Bodies {
  constructor(player) {
    super(ctx)
    this.x = player.x;
    this.y = player.y;
    this.width = 24;
    this.height = 4;
    this.dx = 12;
    this.dy = -1.5;
    this.gravity = 0.12;
    this.drag = -0.06;
    this.direction = player.direction;
  }

  draw() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
    return this;
  }

  update() {
    if (this.direction === 'right') {
      this.x += this.dx;
      this.dx += this.drag;
      this.y += this.dy;
      this.dy += this.gravity;
    }
    else {
      this.x -= this.dx;
      this.dx += this.drag;
      this.y += this.dy;
      this.dy += this.gravity;
    }
  }
  
}

module.exports = Arrow;
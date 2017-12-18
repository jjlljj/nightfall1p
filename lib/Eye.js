const Bodies = require('./Bodies.js');

class Eye extends Bodies {
  constructor(ctx, player1, player2) {
    super(...arguments);
    this.ctx = ctx;
    this.x = 500;
    this.y = 300;
    this.speed = Math.random() * 1.6 + 0.4;
    this.dx = 1;
    this.dy = 1;
    this.height = 40;
    this.width = 40
    this.direction = 'right'
    this.dead = false;
    this.lives = 1;
    this.player1 = player1;
    this.player2 = player2;
    this.target = [this.player1, this.player2][Math.floor(Math.random() * 2)];
  }

  update() {
    this.draw();
    this.track();

    this.x += this.dx;
    this.y += this.dy;
  }

  track() {
    if (this.dead) {
      this.dx = 0;
      this.dy = 0;
    }
    //horizontal tracking
    if (!this.dead && this.target.x > this.x) {
      this.dx = this.speed;
    } else if (!this.dead) {
      this.dx = -this.speed;
    }
    //vertical tracking
    if (!this.dead && this.target.y > this.y) {
      this.dy = this.speed;
    } else if (!this.dead) {
      this.dy = -this.speed;
    }
  }

  draw() {
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

}


module.exports = Eye;

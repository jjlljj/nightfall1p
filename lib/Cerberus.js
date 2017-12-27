const Bodies = require('./Bodies.js')

class Cerberus extends Bodies {
  constructor(ctx, x, y, player1, player2, platforms) {
    super(...arguments)
    this.x = x
    this.y = y
    this.dx = 0.2;
    this.dy = 0;
    this.height = 40;
    this.width = 60;
    this.lives = 1;
    this.ctx = ctx
    this.platforms = platforms
    this.player1 = player1
    this.player2 = player2
    this.canLunge = true;
    this.dead = false;
    this.gravity = .5;
    this.invincible = false;
  }

  lunge() {

  }

  draw() {
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.gravityEffect();

    this.x += this.dx;
    this.y += this.dy;
    this.dy += this.gravity;
  }

  gravityEffect() {
    if (this.onPlatform()) this.dy = 0
    this.gravity = this.onPlatform() ? 0 : 0.5
  }

  onPlatform() {
    return this.platforms.some(platform => {
      return this.y + this.height >= platform.y && 
      this.y < platform.y &&
      this.x >= platform.x - this.width &&  
      this.x + this.width <= platform.x + platform.width + this.width
    })
  }

  hitA() {

  }
}

module.exports = Cerberus
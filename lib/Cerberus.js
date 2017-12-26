const Bodies = require('./Bodies.js')

class Cerberus extends Bodies {
  constructor(ctx, x, y, player1, player2, platforms) {
    super(...arguments)
    this.x = x
    this.y = y
    this.height = 40;
    this.width = 60;
    this.lives = 3;
    this.ctx = ctx
    this.platforms = platforms
    this.player1 = player1
    this.player2 = player2
    this.canLunge = true;
  }

  lunge() {

  }

  draw() {
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }

  onPlatform() {
    if (this.platforms.some(platform => {
      return this.y + this.height >= platform.y && 
      this.y < platform.y &&
      this.x >= platform.x - this.width &&  
      this.x + this.width <= platform.x + platform.width + this.width
    }) ) {
      this.isOnPlatform = true;
    } else {
      this.isOnPlatform = false;
    }
  }
}

module.exports = Cerberus
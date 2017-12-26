const Bodies = require('./Bodies.js')

class Secret extends Bodies {
  constructor(ctx) {
    super(...arguments)
    this.x = 520;
    this.y = 350;
    this.img = new Image()
    this.img.src = '../assets/scrolls.png'
    this.width = 35;
    this.height = 35;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.globalAlpha = 0.8;
    this.ctx.drawImage(this.img,
      this.x, this.y, this.width, this.height)
    this.ctx.globalAlpha = 1;
  }
}

module.exports = Secret
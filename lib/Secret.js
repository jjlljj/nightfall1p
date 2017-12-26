const Bodies = require('./Bodies.js')

class Secret extends Bodies {
  constructor(ctx) {
    super(...arguments)
    this.x = 520;
    this.y = 350;
    this.image = new Image()
    //this.img.src = '../assets/powerup-sprites.png'
    this.width = 30;
    this.height = 30;
    this.ctx = ctx;
  }

  draw() {
    // this.ctx.globalAlpha = 0.8;
    // this.ctx.drawImage(this.img, 30, 0, 20, 30, 
    //   this.x, this.y, this.width, this.height)
    // this.ctx.globalAlpha = 1;
    this.ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

module.exports = Secret
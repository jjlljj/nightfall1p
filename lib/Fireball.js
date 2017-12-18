const Arrow = require('./Arrow.js')

class Fireball extends Arrow {
  constructor(player) {
    super(...arguments)
    this.width = 20;
    this.height = 30;
    this.dx = 5.8;
    this.dy = -0.8;
    this.gravity = 0.04;
    this.drag = -0.02;
  }

  draw() {
    // let image = this.updateImage()
    this.ctx.fillstyle = 'red';
    this.ctx.fillRect(this.x, this.y, 10, 10)
    // this.ctx.drawImage(
    //   this.arrowImage(), image.sx, image.sy, image.sWidth, image.sHeight, 
    //   this.x, this.y, this.width, this.height
    // )
    return this;
  }

  shootDirection(player) {
    if (this.direction === 'left') {
      return player.x - 40;
    } else {
      return player.x + 40;
    }
  }

}

module.exports = Fireball;
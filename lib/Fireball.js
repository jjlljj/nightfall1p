const Arrow = require('./Arrow.js')

class Fireball extends Arrow {
  constructor(player) {
    super(...arguments)
    this.width = 30;
    this.height = 20;
    this.dx = 5.8;
    this.dy = -0.8;
    this.gravity = 0.04;
    this.drag = -0.02;
  }

  draw() {
    // let image = this.updateImage()
    this.ctx.fillstyle = 'red';
    // this.ctx.fillRect(this.x, this.y, 10, 10)
    let image = this.updateImage()
    this.ctx.drawImage(
      this.fireBallImg(), image.sx, image.sy, image.sWidth, image.sHeight, 
      this.x, this.y, this.width, this.height
    )
    return this;
  }

  updateImage() {
    let image = {}
    
    if (this.direction === 'right') {
      image.sx = 15;
      image.sy = 145;
      image.sWidth = 40;
      image.sHeight = 35;
    } else {
      image.sx = 15;
      image.sy = 188;
      image.sWidth = 40;
      image.sHeight = 35;
    }      

    return image
  }

  shootDirection(player) {
    if (this.direction === 'left') {
      return player.x - 40;
    } else {
      return player.x + 40;
    }
  }

  fireBallImg() {
    let img = new Image();

    img.src = this.player.spriteSrc;
    return img
  }

}

module.exports = Fireball;
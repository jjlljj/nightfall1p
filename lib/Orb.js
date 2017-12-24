const Arrow = require('./Arrow.js')

class Orb extends Arrow {
  constructor(player) {
    super(...arguments)
    this.dx = 8.3;
    this.gravity = 0;
    this.drag = 0;
    this.height = 25;
    this.width = 35;
    this.dy = 0;
    this.sinFrequency = 1.5;
    this.sinSize = 2.1;
  }

  update() {
    if (this.direction === 'right') {
      this.x += this.dx;
      this.y += (Math.sin((this.x) * this.sinFrequency) * this.sinSize);
    } else {
      this.x -= this.dx;
      this.y += (Math.sin((this.x) * this.sinFrequency) * this.sinSize);
    }
  }

  draw() {
    let image = this.updateImage()
    
    this.ctx.drawImage(
      this.arrowImage(), image.sx, image.sy, image.sWidth, image.sHeight, 
      this.x, this.y, this.width, this.height
    )
    return this;
  }


}

module.exports = Orb;
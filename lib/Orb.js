const Arrow = require('./Arrow.js')

class Orb extends Arrow {
  constructor(player) {
    super(...arguments)
    this.dx = 6.3;
    this.gravity = 0;
    this.drag = 0; //accel
    this.width = 20;
    this.dy = 0;
    this.sinFrequency = 8;
    this.sinSize = 4.1;
  }

    update() {
    if (this.x > 1000) {
      this.x = 0
    } else if (this.x < 0 ) {
      this.x = 1000;
    }
    
    if (this.direction === 'right') {
      this.x += this.dx;
      this.y += (Math.sin((this.x) * this.sinFrequency) * this.sinSize);
    } else {
      this.x -= this.dx;
      this.y += (Math.sin((this.x) * this.sinFrequency) * this.sinSize);
    }
  }

  draw() {
    // let image = this.updateImage()
    this.ctx.fillRect(this.x, this.y, 20, 20)
    // this.ctx.drawImage(
    //   this.arrowImage(), image.sx, image.sy, image.sWidth, image.sHeight, 
    //   this.x, this.y, this.width, this.height
    // )
    return this;
  }


}

module.exports = Orb;
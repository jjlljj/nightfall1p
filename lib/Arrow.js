const Bodies = require('./Bodies.js');

class Arrow extends Bodies {
  constructor(player) {
    super(...arguments)
    this.ctx = player.ctx;
    this.direction = player.direction;
    this.x = this.shootDirection(player);
    this.y = player.y + 5;
    this.width = 40;
    this.height = 15;
    this.dx = 12;
    this.dy = -1.5;
    this.gravity = 0.12;
    this.drag = -0.06;
    this.platforms = player.platforms;
    this.player = player;
  }

  draw() {
    let image = this.updateImage()

    this.ctx.drawImage(
      this.arrowImage(), image.sx, image.sy, image.sWidth, image.sHeight, 
      this.x, this.y, this.width, this.height
    )
    return this;
  }

  shootDirection(player) {
    if (this.direction === 'left') {
      return player.x - 40;
    } else {
      return player.x + 40;
    }
  }

  updateImage() {
    let image = {}
    
    if (this.direction === 'left') {
      image.sx = 127;
      image.sy = 65;
      image.sWidth = 30;
      image.sHeight = 15;
    } else {
      image.sx = 130;
      image.sy = 80;
      image.sWidth = 30;
      image.sHeight = 15;
    }      

    return image
  }

  arrowImage() {
    let img = new Image();

    img.src = this.player.spriteSrc;
    return img
  }

  update() {
    if (this.direction === 'right') {
      this.x += this.dx;
      this.dx += this.drag;
      this.y += this.dy;
      this.dy += this.gravity;
    } else {
      this.x -= this.dx;
      this.dx += this.drag;
      this.y += this.dy;
      this.dy += this.gravity;
    }
  }
}

module.exports = Arrow;
class Platform {
  constructor(ctx, x, y, width, height, src, dx, dy, dWidth, dHeight) {
    this.image = new Image();
    this.image.src = src;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = dx;
    this.dy = dy;
    this.dWidth = dWidth;
    this.dHeight = dHeight;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.drawImage(this.image,this.dx, this.dy, this.dWidth, this.dHeight);
  } 
}

module.exports = Platform;
const Platform = require('./Platform.js');
const level = require('./level.js')
const level2 = require('./level2.js');

class Background {
  constructor(ctx2, ctx3) {
    this.level = level
    this.level2 = level2;
    this.platforms = [];
    this.backdrop = new Image();
    this.backdrop.src = '../assets/level2/mountain-backdrop.png';
    this.ctx2 = ctx2;
    this.ctx3 = ctx3;
  }

  createBackground() {
    this.level2.forEach(obj => { 
      this.platforms.push(
        new Platform(this.ctx2, obj.x, obj.y, obj.width, obj.height,
          obj.src, obj.dx, obj.dy, obj.dWidth, obj.dHeight))
    })
  }

  drawBackground() {
    this.ctx3.drawImage(this.backdrop, 0, 0, 1000, 700);
    this.platforms.forEach(platform => platform.draw());
  }

}

module.exports = Background;
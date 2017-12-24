const Platform = require('./Platform.js');
const level1 = require('./level1.js')
const level2 = require('./level2.js');
const level3 = require('./level3.js')

class Background {
  constructor(ctx2, ctx3, level = 'level1') {
    this.level = level
    this.platforms = []
    this.backdrop = new Image()
    this.levelConfig = {
      level1: { 
        platforms: level1,
        src: '../assets/level1/moon-backdrop.png'
        }, 
      level2: {
        platforms: level2,
        src: '../assets/level2/lake-backdrop.png'
        },
      level3: {
        platforms: level3,
        src: '../assets/level3/red-moon-backdrop.jpg'
        }
      };
    this.backdrop.src = this.levelConfig[this.level].src
    this.ctx2 = ctx2;
    this.ctx3 = ctx3;
  }

  createBackground() {
    this.levelConfig[this.level].platforms.forEach(obj => { 
      this.platforms.push(
        new Platform(this.ctx2, obj.x, obj.y, obj.width, obj.height,
          obj.src, obj.dx, obj.dy, obj.dWidth, obj.dHeight))
    })
  }

  drawBackground() {
    this.ctx3.drawImage(this.backdrop, 0, 0, 1000, 700);
    this.platforms.forEach(platform => platform.draw());
  }

  changeBackground(level) {
    this.level = level
    this.backdrop.src = this.levelConfig[this.level].src
  }

}

module.exports = Background;
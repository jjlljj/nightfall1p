const Platform = require('./Platform.js');
const canvas2 = document.getElementById('background');
const ctx2 = canvas2.getContext('2d');
const level = require('./level.js')

class Background {
  constructor() {
    this.level = level
    this.platforms = [];
  }

  createBackground() {
    this.level.forEach(obj => { 
      this.platforms.push(new Platform(ctx2, obj.x, obj.y, obj.width, obj.height, obj.src, obj.dx, obj.dy, obj.dWidth, obj.dHeight))
    })
  }

  drawBackground() {
    this.platforms.forEach(platform => platform.draw());
  }
}

module.exports = Background;
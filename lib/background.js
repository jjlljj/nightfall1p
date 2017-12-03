const Platform = require('./Platform.js');
const canvas2 = document.getElementById('background');
const ctx2 = canvas2.getContext('2d');
const canvas3 = document.getElementById('backdrop');
const ctx3 = canvas3.getContext('2d');
const level = require('./level.js')

class Background {
  constructor() {
    this.level = level
    this.platforms = [];
    this.backdrop = new Image();
    this.backdrop.src = '../assets/level/moon-backdrop.png';
  }

  createBackground() {
    this.level.forEach(obj => { 
      this.platforms.push(new Platform(ctx2, obj.x, obj.y, obj.width, obj.height, obj.src, obj.dx, obj.dy, obj.dWidth, obj.dHeight))
    })
  }

  drawBackground() {
    ctx3.drawImage(this.backdrop, 0, 0, canvas3.width, canvas3.height);
    this.platforms.forEach(platform => platform.draw());
  }

}

module.exports = Background;
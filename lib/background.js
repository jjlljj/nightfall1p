const Platform = require('./Platform.js');
const canvas2 = document.getElementById('background');
const ctx2 = canvas2.getContext('2d');

class Background {
  constructor() {
    this.platforms = [];
  }

  createBackground() {
    const ground = new Platform(0, canvas2.height - 50, canvas2.width, 50, ctx2);
    const Lground = new Platform(0, canvas2.height - 100, 250, 50, ctx2);
    const Rground = new Platform(canvas2.width - 250, canvas2.height - 100, 250, 50, ctx2);
    const Cplatform = new Platform(canvas2.width/2 - 100, canvas2.height/2 + 100, 200, 50, ctx2);
    const Lplatform = new Platform(100, canvas2.height/2, 100, 50, ctx2);
    const Rplatform = new Platform(800, canvas2.height/2, 100, 50, ctx2);
    this.platforms.push(ground, Lground, Rground, Cplatform, Lplatform, Rplatform);
    this.platforms.forEach(platform => platform.draw());

  }
}

module.exports = Background;
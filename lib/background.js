const Platform = require('./Platform.js');
const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

class Background {
  constructor() {
    this.platforms = [];
  }

  createBackground() {
    const ground = new Platform(0, canvas.height - 50, canvas.width, 50, ctx);
    const Lground = new Platform(0, canvas.height - 100, 250, 50, ctx);
    const Rground = new Platform(canvas.width - 250, canvas.height - 100, 250, 50, ctx);
    const Cplatform = new Platform(canvas.width/2 - 100, canvas.height/2 + 100, 200, 50, ctx);
    const Lplatform = new Platform(100, canvas.height/2, 100, 50, ctx);
    const Rplatform = new Platform(800, canvas.height/2, 100, 50, ctx);
    this.platforms.push(ground, Lground, Rground, Cplatform, Lplatform, Rplatform);
    this.platforms.forEach(platform => platform.draw());

  }
}

module.exports = Background;
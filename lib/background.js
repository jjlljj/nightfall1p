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
  

    // const LgroundPlatform = new Platform(0, canvas2.height - 100, 300, 50, ctx2);
    // const Rground = new Platform(canvas2.width/2 + 50, canvas2.height - 50, canvas2.width/2 - 50, 50, ctx2);
    
    // const Lside = new Platform(0, 200, 120, 400, ctx2)
    // const RgroundPlatform = new Platform(canvas2.width - 300, canvas2.height - 100, 300, 50, ctx2);
    
    // const Cplatform = new Platform(canvas2.width/2 - 125, canvas2.height/2 + 75, 250, 20, ctx2);
    // const Lplatform = new Platform(100, canvas2.height/2, 120, 50, ctx2);
    // const Rplatform = new Platform(780, canvas2.height/2, 120, 50, ctx2);
    // const Lside = new Platform(0, 200, 120, 400, ctx2)
    // const Rside = new Platform(canvas2.width-120, 200, 120, 400, ctx2)
    // const TopCenter = new Platform(canvas2.width/2 - 150, 200, 300, 20, ctx2)
    // const CenterPillar = new Platform(canvas2.width/2-15, 100, 30, 100, ctx2)

    // this.platforms.push(Lground, Rground, LgroundPlatform, RgroundPlatform, Cplatform, Lplatform, Rplatform, Lside, Rside, TopCenter, CenterPillar);

    // this.platforms.forEach(platform => platform.draw());

  }

  drawBackground() {
    this.platforms.forEach(platform => platform.draw());
  }
}

module.exports = Background;
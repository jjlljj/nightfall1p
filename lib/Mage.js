const Player = require('./Player.js')
const Orb = require('./Orb.js')

class Mage extends Player {
  constructor() {
    super(...arguments)
    this.speed = 3.8;
    this.shotTiming = 270;
    this.reloadDelay = 1050;
    this.mageHover = 20;
  }

  draw() {
    this.setPlayerSprite()
    let image = this.updateImage()
    let img = new Image();

    img.src = this.spriteSrc;

    if (this.dead) {
      image = {sx: 0, sy: 0, sWidth: 60, sHeight: 48}
    } 

    this.ctx.drawImage(img, image.sx, image.sy, image.sWidth, image.sHeight, 
      this.x - 20, this.y + 3, this.width + 40, this.height + 10);
  }

  arrow() {
    if (this.quiver > 0) {
      this.quiver--;
      this.shooting = true;
      const arrow = new Orb(this);

      this.arrows.push(arrow);
      setTimeout(() => {
        this.shooting = false
      }, 1000);
      //reload
      (() => {
        if (this.canReload) {
          this.canReload = false;
          setTimeout(() => {
            this.quiver = 3 + this.upgradeQuiver;
            this.canReload = true;
          }, this.reloadDelay)
        }
      })()
    }
  }

  setPlayerSprite() {
    if (this.dead) {
      this.spriteSrc = '../assets/explosion.png'
    } else if (this.player === 'player2') {
      this.spriteSrc = '../assets/mage-sprites.png'
    } else {
      this.spriteSrc = '../assets/mage-sprites.png'
    }
  }

  gravity() {
    if (this.isOnPlatform) {
      return 0;
    } else if (this.dy > -1 && this.dy < 0.5) { //dy approaching jump peak
      return .5;
    } else if (this.dy >= 5) { //dy max on free fall
      return 4;
    } else { //
      return this.dy * 1.4 //sets increasing dy
    }
  }

  onPlatform() {
    if (this.platforms.some(platform => {
      return this.y + this.height + this.mageHover >= platform.y && 
      this.y < platform.y &&
      this.x >= platform.x - this.width &&  
      this.x + this.width <= platform.x + platform.width + this.width
    }) ) {
      this.isOnPlatform = true;
    } else {
      this.isOnPlatform = false;
    }
  }
}

module.exports = Mage
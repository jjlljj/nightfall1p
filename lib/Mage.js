const Player = require('./Player.js')
const Fireball = require('./Fireball.js')

class Mage extends Player {
  constructor() {
    super(...arguments)
    this.speed = 3.7;
    this.shotTiming = 250;
    this.reloadDelay = 1000;
  }

  arrow() {
    if (this.quiver > 0) {
      this.quiver--;
      this.shooting = true;
      const arrow = new Fireball(this);

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

  gravity() {
    if (this.isOnPlatform) {
      return 0;
    } else if (this.dy > -1 && this.dy < 0.5) { //dy approaching jump peak
      return .5;
    } else if (this.dy >= 5) { //dy max on free fall
      return 3;
    } else { //
      return this.dy * 1.1 //sets increasing dy
    }
  }
}

module.exports = Mage
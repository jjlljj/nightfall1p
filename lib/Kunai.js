const Arrow = require('./Arrow.js')

class Kunai extends Arrow {
  constructor(player) {
    super(...arguments)
    this.dx = 6.6;
    this.gravity = 0.05;
    this.drag = -0.03
    this.width = 20;
    this.dy = this.trajectory();
  }

  trajectory() {
    if(this.player.wepNumber === 1) {
      return -2.2;
    } else if (this.player.wepNumber === 2) {
      return -1;
    } else {
      return 0.2;
    }
  }
}

module.exports = Kunai;
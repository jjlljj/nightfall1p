const Arrow = require('./Arrow.js')

class Kunai extends Arrow {
  constructor(player) {
    super(...arguments)
    this.dx = 7;
    this.gravity = 0.05;
    this.drag = -0.03
    this.dy = this.trajectory();
  }

  trajectory() {
    console.log(this.player.wepNumber);
    if(this.player.wepNumber === 1) {
      return -2;
    } else if (this.player.wepNumber === 2) {
      return -1;
    } else {
      return 0;
    }
  }
}

module.exports = Kunai;
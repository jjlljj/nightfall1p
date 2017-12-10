const Arrow = require('./Arrow.js')

class Fireball extends Arrow {
  constructor(player) {
    super(...arguments)
    this.dx = 6.2;
    this.gravity = 0.02;
    this.drag = 0.2 // not drag, acceleration...
    this.width = 20;
    this.dy = -0.5;
  }

}

module.exports = Fireball;
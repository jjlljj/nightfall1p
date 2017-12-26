const Eye = require('./Eye.js')

class Joker extends Eye {
  constructor(x, y, ctx, player1, player2) {
    super(...arguments)
    this.speed = 0.6;
    this.invincible = true;
    this.centerLocation = {x: 520, y: 350}
    this.target = this.chooseTarget();
    this.boundary = 400
  }

  update() {
    this.draw();
    this.chooseTarget()
    this.track();

    this.x += this.dx;
    this.y += this.dy;
  }

  chooseTarget() {
    const player1Distance = 
      Math.hypot((this.player1.x - 520), (this.player1.y - 350))
    const player2Distance = 
      Math.hypot((this.player2.x - 520), (this.player2.y - 350))
    const closestPlayer = player1Distance <= player2Distance ? this.player1 : this.player2

    if (player1Distance > this.boundary && player2Distance > this.boundary) {
      this.target = this.centerLocation
    } else this.target = closestPlayer;
  }

}

module.exports = Joker;
class Powerup {
  constructor(ctx) {
    this.x = 490;
    this.y = this.randomLocation();
    this.width = 20;
    this.height = 20;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  randomLocation() {
    let location = [80, 170, 600];
    let randomNumber = Math.floor(Math.random() * location.length);
    return location[randomNumber];
  }
}

module.exports = Powerup;
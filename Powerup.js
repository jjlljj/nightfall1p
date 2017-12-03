const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

class Powerup {
  constructor() {
    this.x = 200;
    this.y = 400;
    this.width = 20;
    this.height = 20;
  }

  draw() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

module.exports = Powerup;
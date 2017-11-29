const Bodies = require('./Bodies.js');
const Player = require('./Player.js');
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

class Arrow extends Bodies {
  constructor(player) {
    super(ctx)
    this.x = player.x;
    this.y = player.y;
    this.width = 24;
    this.height = 4;
    this.dx = 7;
  }

  draw() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(this.x, this.y, this.width, this.height);
    return this;
  }

  update() {
    this.x += this.dx;
  }
  
}

module.exports = Arrow;
const Bodies = require('./Bodies.js');
const Player = require('./Player.js');
const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

ctx.fillRect(10, 10, 10, 10);

class Arrow extends Bodies {
  constructor(player) {
    super(ctx)
    this.x = player.x;
    this.y = player.y;
    this.width = 24;
    this.height = 4;
    this.dx = 3;
  }

  draw() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += this.dx;
  }
  
}

module.exports = Arrow;
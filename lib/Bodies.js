const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d'); 

class Bodies {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ctx = ctx;
  }
}

module.exports = Bodies;
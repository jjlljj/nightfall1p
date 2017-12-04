const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

class Powerup {
  constructor() {
    this.x = canvas.width/2;
    this.y = this.randomLocation();
    this.width = 20;
    this.height = 20;
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  randomLocation() {
    let location = [80, 170, 630];
    let randomNumber = Math.floor(Math.random() * location.length);
    return location[randomNumber];
  }
}

module.exports = Powerup;
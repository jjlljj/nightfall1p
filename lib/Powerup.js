class Powerup {
  constructor(ctx) {
    this.x = 490;
    this.y = this.randomLocation();
    this.width = 20;
    this.height = 25;
    this.ctx = ctx;
    this.img = new Image();
    this.img.src = '../assets/powerup-sprites.png'
  }

  draw() {
<<<<<<< HEAD
    this.ctx.fillStyle = '#C5EFF7';
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
=======
    this.ctx.drawImage(this.img, 30, 0, 20, 30, this.x, this.y, this.width, this.height)
>>>>>>> c9af4ba7a00d918a7105275ea8f26229f0de06c7
  }

  randomLocation() {
    let location = [75, 180, 620];
    let randomNumber = Math.floor(Math.random() * location.length);
    return location[randomNumber];
  }
}

module.exports = Powerup;
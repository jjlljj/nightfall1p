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
    this.ctx.globalAlpha = 0.8;
    this.ctx.drawImage(this.img, 30, 0, 20, 30, 
      this.x, this.y, this.width, this.height)
    this.ctx.globalAlpha = 1;
  }

  randomLocation() {
    let location = [75, 180, 620];
    let randomNumber = Math.floor(Math.random() * location.length);
    
    return location[randomNumber];
  }
}

module.exports = Powerup;
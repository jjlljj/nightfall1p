const Eye = require('./Eye.js')

class Joker extends Eye {
  constructor(x, y, ctx, player1, player2) {
    super(...arguments)
    this.width = 40
    this.height = 60
    this.speed = 0.6;
    this.lives = 3;
    this.centerLocation = {x: 520, y: 350}
    this.target = this.chooseTarget()
    this.boundary = 400
    this.dead = false;
    this.leftPatrol = {x: 470, y: 350}
    this.rightPatrol = {x: 570, y: 350}
  }

  update() {

    this.draw();
    this.chooseTarget()
    this.track();

    this.x += this.dx;
    this.y += this.dy;
  }

  chooseTarget() {
    if (!this.target) return this.centerLocation

    const player1Distance = 
      Math.hypot((this.player1.x - 520), (this.player1.y - 350))
    const player2Distance = 
      Math.hypot((this.player2.x - 520), (this.player2.y - 350))

    const closestPlayer = player1Distance <= player2Distance ? this.player1 : this.player2


    if ((player1Distance < this.boundary && !this.player1.dead) || (player2Distance < this.boundary && !this.player2.dead)) {
      this.target = closestPlayer
    } else if ( this.player1.dead && player2Distance < this.boundary) {
      this.target = this.player2
    } else if ( this.player2.dead && player1Distance < this.boundary) {
      this.target = this.player1
    } else { 
      this.patrol()
    }
  }

  patrol() {
    if ( this.target !== this.leftPatrol && this.target !== this.rightPatrol && this.x > this.leftPatrol.x) {
      this.target = this.leftPatrol
    } else if ( this.target === this.leftPatrol && (this.x - this.target.x < 10 && this.x - this.target.x > -10)) {
      this.target = this.rightPatrol
    } else if ( this.target === this.rightPatrol && (this.x - this.target.x < 10 && this.x - this.target.x > -10)) {
      this.target = this.leftPatrol
    }
  }

  hitJoker() {
    if (!this.hit) {
      this.hit = true;
      this.lives --;
      if (this.lives !== 0) {
        setTimeout(() => {
          this.canShoot = true;
          this.hit = false;
        }, 150);
      } 
      if (this.lives === 0) {
        this.dead = true;
      }
    }
  }

  draw() {
    let image = this.enemySprite();
    let imageXY = this.updateImage();

    this.ctx.drawImage(image, imageXY.x, imageXY.y, 90, 100, 
      this.x - 15, this.y - 20, 100, 100);
  }

  enemySprite() {
    let img = new Image;
    
    img.src = '../assets/joker-sprites.png';
    return img
  }

  updateImage() {
    let image = {}

    image.x = 0;
    image.y = 0;
    if (this.direction === 'right') {
      image.x = 95;
    } 
    if (this.hit) {
      image.y = 102;
    }
    return image
  }

}

module.exports = Joker;
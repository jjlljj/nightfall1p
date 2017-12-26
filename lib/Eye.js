const Bodies = require('./Bodies.js');

class Eye extends Bodies {
  constructor(x, y, ctx, player1, player2) {
    super(...arguments);
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.speed = Math.random() * 1.6 + 0.4;
    this.dx = 1;
    this.dy = 1;
    this.height = 40;
    this.width = 40
    this.direction = 'right'
    this.dead = false;
    this.lives = 1;
    this.player1 = player1;
    this.player2 = player2;
    this.target = this.chooseTarget()
  }

  chooseTarget() {
    if (this.player1.lives === 0) {
      return this.player2
    } else if (this.player2.lives === 0) {
      return this.player1
    } else {
      return [this.player1, this.player2][Math.floor(Math.random() * 2)];
    }
  }

  update() {
    this.draw();
    this.track();

    this.x += this.dx;
    this.y += this.dy;
  }

  track() {
    if (this.dead) {
      this.dx = 0;
      this.dy = 0;
    }
    //horizontal tracking
    if (!this.dead && (this.target.x - this.x < 5 && this.target.x - this.x > -5 ) ) {
      this.dx = 0;
    } else if (!this.dead && this.target.x > this.x) {
      this.dx = this.speed;
      this.direction = 'right'
    } else if (!this.dead) {
      this.dx = -this.speed;
      this.direction = 'left'
    }
    //vertical tracking
    if (!this.dead && this.target.y > this.y) {
      this.dy = this.speed;
    } else if (!this.dead) {
      this.dy = -this.speed;
    }
  }

  draw() {
    let image = this.enemySprite();
    let imageXY = this.updateImage();

    this.ctx.drawImage(image, imageXY.x, imageXY.y, 50, 30, 
      this.x, this.y, 54, 40);
  }

  move() {
    return false
  }

  enemySprite() {
    let img = new Image;
    
    img.src = '../assets/eyeball-sprites.png';
    return img
  }

  updateImage() {
    let image = {}

    image.x = 0;
    image.y = 0;
    if (this.direction === 'right') {
      image.x = 70;
    } 
    if (this.dead) {
      image.x = 0;
      image.y = 40;
    }
    return image
  }


}


module.exports = Eye;

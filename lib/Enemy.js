const Player = require('./Player.js');

class Enemy extends Player {
  constructor(ctx, platforms) {
    super(...arguments)
    this.ctx = ctx;
    this.width = 20;
    this.height = 45;
    this.x = Math.random() * 700 + 150;
    this.y = -100;
    this.dx = .3;
    this.dy = 0;
    this.platforms = platforms;
    this.direction = 'right'
    this.canRandomReverse = true;
  }

  update() {
    this.transport();
    this.draw();
  }

  transport() {
    this.onPlatform();
    this.dy = this.gravity();
    if (this.isColliding(this.platforms)) {
      this.dx = -this.dx
    }
    if (this.x > 1000) {
      this.x = 0
    } else if (this.y > 700) {
      this.y = 0;
      this.x = Math.random() * 700 + 150;
    }

    if (this.canRandomReverse) {
      this.canRandomReverse = false;
      let reverseTime = Math.random() * 8000 + 3000;

      setTimeout(() => {
        this.dx = -this.dx;
        this.canRandomReverse = true
      }, reverseTime); 
    }

    if (this.dx > 0) {
      this.direction = 'right';
    } else {
      this.direction = 'left'
    }

    if (this.dead) {
      this.dx = 0;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  draw() {
    let image = this.enemySprite();
    let imageXY = this.updateImage();

    this.ctx.drawImage(image, imageXY.x, imageXY.y, 33, 48, 
      this.x - 10, this.y - 15, 40, 60);
  }

  move() {
    return false
  }

  enemySprite() {
    let img = new Image;
    
    img.src = '../assets/enemy-sprite.png';
    return img
  }

  updateImage() {
    let image = {}

    image.x = 0;
    image.y = 0;
    if (this.direction === 'right') {
      image.x = 35;
    } 
    if (this.dead) {
      image.x = 0;
      image.y = 50;
    }
    return image
  }
}


module.exports = Enemy;
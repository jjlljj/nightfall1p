const Player = require('./Player.js')
const Fireball = require('./Fireball.js')

class Boss extends Player {
  constructor(ctx, platforms, player1, player2) {
    super(...arguments)
    this.ctx = ctx;
    this.width = 40;
    this.height = 80;
    this.x = Math.random() * 600 + 200;
    this.y = -100;
    this.dx = 1.6;
    this.dy = 0;
    this.platforms = platforms;
    this.direction = 'right'
    this.quiver = 25;
    this.lives = 20;
    this.hit = false;
    this.shotTiming = 70;
    this.reloadDelay = 4500;
    this.canChangeDirection = true;
    this.canChangeTarget = true;
    this.changeTargetDelay = 5000;
    this.player1 = player1;
    this.player2 = player2;
    this.spriteSrc = '../assets/boss-sprites.png'
    this.target = this.player1;
  }

  update() {
    this.fireball();
    this.transport();
    this.draw();
    this.renderAttributes()
    this.arrows = this.arrows.filter((arrow) => {
      return !arrow.isColliding(this.platforms)
    });
    this.arrows.forEach(arrow => arrow.draw().update());
    //this.changeTarget();

  }

  renderAttributes() {
    this.ctx.globalAlpha = 0.7;
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect( this.x - 2, this.y - 43, this.lives * 2.5, 4);
    this.ctx.fillStyle = 'rgba(236, 236, 236, 0.7)';
    this.ctx.globalAlpha = 1;
  }

  changeTarget() {
    if(this.canChangeTarget) {
      const randomDelay = Math.random() * 3000;
      this.canChangeTarget = false;
      setTimeout(() => {
        this.target = this.target === this.player1 ? this.player2 : this.player1;
        this.canChangeTarget = true;
      }, this.changeTargetDelay + randomDelay)
    }
  }

  transport() {
    this.onPlatform();
    this.dy = this.gravity();
    if (this.isColliding(this.platforms)) {
      this.dx = -this.dx
    }

    //player tracking horizontal
    if (this.target.x > this.x && this.canChangeDirection) {
      this.canChangeDirection = false;
      setTimeout(() => {
        this.dx = 1.6;
        this.canChangeDirection = true;
      }, Math.random() * 1200 + 300);
    } else if (this.canChangeDirection) {
      this.canChangeDirection = false;
      setTimeout(() => {
        this.dx = -1.6;
        this.canChangeDirection = true;
      }, Math.random() * 1200 + 300);
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
    let image = this.bossSprites();
    let imageXY = this.updateImage();

    this.ctx.drawImage(image, imageXY.x, imageXY.y, 110, 126, 
      this.x - 30, this.y - 30, 100, 110);
  }

  move() {
    return false
  }

  fireball() {
    if (this.quiver > 0 && this.canShoot) {
      this.quiver--;
      this.shooting = true;
      const fireball = new Fireball(this);
      this.canShoot = false;
      this.arrows.push(fireball);
      setTimeout(() => {
        this.canShoot = true
      }, this.shotTiming);
      //reload
      (() => {
        if (this.canReload) {
          this.canReload = false;
          setTimeout(() => {
            this.quiver = 25;
            this.canReload = true;
          }, this.reloadDelay)
        }
      })()
    }
  }

  bossSprites() {
    let img = new Image;
    
    img.src = this.spriteSrc;
    return img
  }

  updateImage() {
    let image = {}

    image.x = 0;
    image.y = 0;
    if (this.direction === 'right' && !this.hit) {
      image.x = 110;
    } 

    if (this.hit && this.direction === 'left' || this.dead) {
      image.x = 245
    }  else if (this.hit && this.direction === 'right') {
      image.x = 355
    }
    // if (this.dead) {
    //   image.x = 0;
    //   image.y = 50;
    // }
    return image
  }

  hitBoss() {
    if (!this.hit) {
      this.hit = true;
      this.lives --;
      this.canShoot = false;
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

}


module.exports = Boss;

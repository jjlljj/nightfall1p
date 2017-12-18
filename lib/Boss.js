const Player = require('./Player.js');
const Fireball = require('./Fireball.js')

class Boss extends Player {
  constructor(ctx, platforms, player1, player2) {
    super(...arguments)
    this.ctx = ctx;
    this.width = 40;
    this.height = 80;
    this.x = Math.random() * 1000;
    this.y = -100;
    this.dx = 1.6;
    this.dy = 0;
    this.platforms = platforms;
    this.direction = 'right'
    this.canRandomReverse = true;
    this.quiver = 40;
    this.lives = 20;
    this.hit = false;
    this.shotTiming = 30;
    this.reloadDelay = 4500;
    this.canChangeDirection = true;
    this.canChangeTarget = true;
    this.changeTargetDelay = 5000;
    this.player1 = player1;
    this.player2 = player2;
    this.target = [this.player1, this.player2][Math.floor(Math.random() * 2)];
  }

  update() {
    this.transport();
    this.draw();
    this.arrows = this.arrows.filter((arrow) => {
      return !arrow.isColliding(this.platforms)
    });
    this.arrows.forEach(arrow => arrow.draw().update());
    this.changeTarget();
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
    if (this.x > 1000) {
      this.x = 0
    } else if (this.y > 700) {
      this.y = 0;
      //this.x = Math.random() * 1000;
    }

    // if (this.canRandomReverse) {
    //   this.canRandomReverse = false;
    //   let reverseTime = Math.random() * 8000 + 3000;

    //   setTimeout(() => {
    //     this.dx = -this.dx;
    //     this.canRandomReverse = true
    //     this.canShoot = true;
    //   }, reverseTime); 
    // }

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

    this.fireball()

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
            this.quiver = 45;
            this.canReload = true;
          }, this.reloadDelay)
        }
      })()
    }
  }

  bossSprites() {
    let img = new Image;
    
    img.src = '../assets/boss-sprites.png';
    return img
  }

  updateImage() {
    let image = {}

    image.x = 0;
    image.y = 0;
    if (this.direction === 'right') {
      image.x = 110;
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
      console.log(this.lives)
      if (this.lives !== 0) {
        setTimeout(() => {
          this.canShoot = true;
          this.hit = false;
        }, 150); 
      }
      if (this.lives === 0) {
        this.dead = true;
        console.log('boss defeated')
      }
    }
  }

}


module.exports = Boss;
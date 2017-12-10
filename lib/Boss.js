const Player = require('./Player.js');
const Fireball = require('./Fireball.js')

class Boss extends Player {
  constructor(ctx, platforms) {
    super(...arguments)
    this.ctx = ctx;
    this.width = 40;
    this.height = 80;
    this.x = Math.random() * 1000;
    this.y = -100;
    this.dx = .3;
    this.dy = 0;
    this.platforms = platforms;
    this.direction = 'right'
    this.canRandomReverse = true;
    this.hit = false;
  }

  update() {
    this.transport();
    this.draw();
    this.arrows = this.arrows.filter((arrow) => {
      return !arrow.isColliding(this.platforms)
    });
    this.arrows.forEach(arrow => arrow.draw().update());
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
      this.x = Math.random() * 1000;
    }

    if (this.canRandomReverse) {
      this.canRandomReverse = false;
      let reverseTime = Math.random() * 8000 + 3000;

      setTimeout(() => {
        this.dx = -this.dx;
        this.canRandomReverse = true
        this.canShoot = true;
      }, reverseTime); 
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
    if (this.quiver > 0) {
      this.quiver--;
      this.shooting = true;
      const fireball = new Fireball(this);

      this.arrows.push(fireball);
      setTimeout(() => {
        this.shooting = false
      }, 300);
      //reload
      (() => {
        if (this.canReload) {
          this.canReload = false;
          setTimeout(() => {
            this.quiver = 3 + this.upgradeQuiver;
            this.canReload = true;
          }, this.delay)
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
    console.log('pow')
    if (!this.hit) {
      this.hit = true;
      this.lives --;
      this.canShoot = false;
      console.log(this.lives)
      if (this.lives !== 0) {
        setTimeout(() => {
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
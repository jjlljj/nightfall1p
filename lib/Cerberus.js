const Bodies = require('./Bodies.js')

class Cerberus extends Bodies {
  constructor(ctx, x, y, player1, player2, platforms) {
    super(...arguments)
    this.x = x
    this.y = y
    this.dx = 0;
    this.dy = 0;
    this.height = 40;
    this.width = 60;
    this.lives = 3;
    this.ctx = ctx
    this.platforms = platforms
    this.player1 = player1
    this.player2 = player2
    this.isLunging = false;
    this.canLunge = true
    this.canChangeDirection = true;
    this.lungeHeight = -5
    this.lungeSpeed = 6
    this.speed = 2.4;
    this.hit = false
    this.direction = 'left'
    this.dead = false;
    this.gravity = .2;
    this.invincible = false;
    this.target = this.chooseTarget();
  }

  update() {
    // console.log(this.target)
    this.draw();
    this.verticalForces();
    this.horizontalForces();
    this.shouldAttack();

    this.x += this.dx;
    this.y += this.dy;
    this.dy += this.gravity;
  }

  verticalForces() {
    if (this.onPlatform() && !this.isLunging) { //if on platform and not exerting force, zero out
      this.dy = 0
      this.gravity = 0
    } else if (this.onPlatform() && this.isLunging) {  //on platform, exerting force, force = exertion
      this.dy = this.lungeHeight
    } else if (!this.onPlatform()) { //if in midair, force = gravity
      this.gravity = 0.2
    }
  }

  horizontalForces() {
    const targetDistance = Math.hypot((this.target['x'] - this.x + 30), (this.target['y'] - this.y))
    const turnTiming = Math.random() * 2000 + 500
    //lunge right
    if (this.isLunging && this.target.x > this.x && this.direction === 'right') { 
      this.dx = this.lungeSpeed
    //lunge left
    } else if (this.isLunging && this.target.x < this.x && this.direction === 'left') {
      this.dx = -this.lungeSpeed
    //maintain lunge velocity in air
    } else if (!this.onPlatform() && !this.canLunge && this.direction === 'right') { 
      console.log('looooooog')
      this.dx = this.lungeSpeed
    //maintain lunge velocity in air
    } else if (!this.onPlatform() && !this.canLunge && this.direction === 'left') { 
      this.dx = -this.lungeSpeed
      console.log('-looggg')
    //ground tracking
    } else if (this.onPlatform() && this.target.x > this.x && this.canChangeDirection) { // ground 
      this.direction = 'right'
      this.canChangeDirection = false
      this.dx = this.speed
      setTimeout(() => {this.canChangeDirection = true}, turnTiming)
    //ground tracking
    } else if (this.onPlatform() && this.target.x < this.x && this.canChangeDirection) {
      this.direction = 'left'
      this.canChangeDirection = false
      this.dx = -this.speed
      setTimeout(() => {this.canChangeDirection = true}, turnTiming)
    } else if (this.dx > this.lungeSpeed - 1) this.dx = this.speed
      else if (this.dx < -this.lungeSpeed + 1) this.dx = -this.speed
  }

  shouldAttack() {
    const targetDistance = Math.hypot((this.target['x'] - this.x + 30), (this.target['y'] - this.y))
    const attackDistance = 300

    if (targetDistance < attackDistance && !this.isLunging && this.canLunge) {
      this.isLunging = true
      this.canLunge = false
      setTimeout(() => {
        this.isLunging = false;
      }, 700)

      setTimeout(() => {
        this.canLunge = true;
        this.target = this.chooseTarget();
      }, 3000)
    }
  }

  chooseTarget() {
    const player1Distance = 
      Math.hypot((this.player1.x - this.x), (this.player1.y - this.y))
    const player2Distance = 
      Math.hypot((this.player2.x - this.x), (this.player2.y - this.y))
    const closestPlayer = player1Distance <= player2Distance ? this.player1 : this.player2

    return closestPlayer
  }

  draw() {
    let image = this.enemySprite();
    let imageXY = this.updateImage();

    this.ctx.drawImage(image, imageXY.x, imageXY.y, 80, 55, 
      this.x - 15, this.y - 40, 100, 80);
  }

  enemySprite() {
    let img = new Image;
    
    img.src = '../assets/cerberus-sprites.png';
    return img
  }

  updateImage() {
    let image = {}

    image.x = 0;
    image.y = 0;
    if (this.direction === 'right') {
      image.x = 80;
    } 
    if (this.hit) {
      image.y = 60;
    }

    if (this.isLunging && !this.hit) {
      image.x = 155
      if (this.direction === 'right') {
      image.x = 240;
      }  
    }
    return image
  }

  onPlatform() {
    return this.platforms.some(platform => {
      return this.y + this.height >= platform.y && 
      this.y < platform.y &&
      this.x >= platform.x - this.width &&  
      this.x + this.width <= platform.x + platform.width + this.width
    })
  }

  hitA() {
    if (!this.hit) {
      this.hit = true;
      this.lives --;
      if (this.lives !== 0) {
        setTimeout(() => {
          this.hit = false;
        }, 250);
      } 
      if (this.lives === 0) {
        this.dead = true;
      }
    }
  } 
}

module.exports = Cerberus
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
    this.canLunge = true;
    this.lungeHeight = -5
    this.lungeSpeed = 6
    this.dead = false;
    this.gravity = .2;
    this.invincible = false;
    this.target = this.chooseTarget();
  }

  update() {
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

    if (this.isLunging) { // set force = exertion
      this.dx = this.lungeSpeed
    } else if (!this.onPlatform() && !this.canLunge) {  //in air, set force = prior motion
      this.dx = this.lungeSpeed
    } else { // ground 
      this.dx = 0
    }
  }

  shouldAttack() {
    const targetDistance = Math.hypot((this.target['x'] - this.x + 30), (this.target['y'] - this.y))

    if (targetDistance < 200 && !this.isLunging && this.canLunge) {
      this.isLunging = true
      this.canLunge = false
      setTimeout(() => {
        this.isLunging = false;
      }, 700)

      setTimeout(() => {
        this.canLunge = true;
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
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
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

  }
}

module.exports = Cerberus
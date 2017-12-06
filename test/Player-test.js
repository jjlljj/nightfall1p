const { expect } = require('chai')
const Player = require('../lib/Player.js')
const Arrow = require('../lib/Arrow.js')
const Powerup = require('../lib/Powerup.js')

describe('Player', () => {
  let platforms
  let keyboarder
  let player

  beforeEach(function() {
    keyboarder = {
      keyState: {87: false, 65: false, 68:false, 16:false},
      playerKeys: {player1: {left: 65, right:68, jump: 87, shoot:16}, player2: {left: 219, right:220, jump: 187, shoot:80}},
      isDown: function isDown(keyCode) {
        return this.keyState[keyCode] === true;
      }
    } 
    platforms =[{x: 0, y: 150, width: 400, height: 100}, {x:0, y:0, width:150, height: 150}, {x:250, y:0, width:150, height: 150}]
    player = new Player('ctx', 175, 100, platforms, keyboarder);
  });



  let forOneSecond = action => {
    for (let i=0; i < 60; i++) {
      action
    }
  }

  it('should not be dead at the start of game', () => {
    expect(player.dead).to.equal(false)
  })

  it('should have a direction', () => {
    expect(player.direction === 'left' || player.direction === 'right').to.equal(true)
  })

  it('should have a positive y velocity when subject to gravity', () => {
    forOneSecond(player.dy = player.gravity())
    expect(player.dy > 2).to.equal(true);
  });

  it('should change position based on its velocity', () => {
    let startingPositionY = player.y;
    let startingPositionX = player.x;
    player.dx = 4;

    forOneSecond(player.transport())
    expect(player.y > startingPositionY).to.equal(true)
    expect(player.x > startingPositionX).to.equal(true)
  });

  it('should not have downward velocity when on a platform', () => {
    player.y = 140;
    expect(player.isOnPlatform).to.equal(false)
    expect(player.dy > 0).to.equal(true)
    
    forOneSecond(player.transport())
    forOneSecond(player.transport())
    forOneSecond(player.transport())

    expect(player.isOnPlatform).to.equal(true)
    expect(player.dy === 0).to.equal(true)
  })

  it('should be able to jump, but only when on a platform', () => {
    player.y = 140;
    expect(player.isOnPlatform).to.equal(false);
    expect(player.jumping).to.equal(false);
    player.jump()
    expect(player.jumping).to.equal(false)

    forOneSecond(player.transport())
    forOneSecond(player.transport())
    forOneSecond(player.transport())

    expect(player.isOnPlatform).to.equal(true);
    expect(player.jumping).to.equal(false);
    player.jump()
    expect(player.jumping).to.equal(true)
  })

  it('should move upwards when jumping', () => {
    player.y = 140;
    forOneSecond(player.transport())
    forOneSecond(player.transport())
    forOneSecond(player.transport())

    let beforeJumpY = player.y;

    player.jump()
    expect(player.jumping).to.equal(true)
    expect(player.dy < 0).to.equal(true)
    forOneSecond(player.transport())
    expect(player.y < beforeJumpY).to.equal(true)
  })

  it('should be able to jump Left and Right', () =>{
    player.y = 112;
    let beforeJumpX = player.x;

    player.jump('left')
    forOneSecond(player.transport())
    expect(player.x < beforeJumpX).to.equal(true)

    player.x = beforeJumpX
    player.jump('right')
    forOneSecond(player.transport())
    expect(player.x > beforeJumpX).to.equal(true)
  })

  it('should jump based on keyboard input',() => { 
    player.y = 110;
    forOneSecond(player.transport())
    expect(player.isOnPlatform).to.equal(true);
    expect(player.jumping).to.equal(false)

    player.keyboarder.keyState['87'] = true;
    player.move();
    expect(player.jumping).to.equal(true)
  })

  it('should be able to move left based on keyboard input', () => {
    player.y = 110;
    forOneSecond(player.transport())
    expect(player.dx === 0).to.equal(true);
    let startingX = player.x

    player.keyboarder.keyState['65'] = true;
    player.move()
    forOneSecond(player.transport())
    expect(player.dx < 0).to.equal(true)
    expect(player.x < startingX).to.equal(true)
  })

  it('should be able to move right based on keyboard input', () => {
    player.y = 110;
    forOneSecond(player.transport())
    expect(player.dx === 0).to.equal(true);
    let startingX = player.x

    player.keyboarder.keyState['68'] = true;
    player.move()
    forOneSecond(player.transport())
    expect(player.dx > 0).to.equal(true)
    expect(player.x > startingX).to.equal(true)
  })

  it('should detect collisions with walls', () => {
    expect(player.isColliding(player.platforms)).to.equal(false);
    player.x = 140;
    expect(player.isColliding(player.platforms)).to.equal(true);

    player.x = 260;
    expect(player.isColliding(player.platforms)).to.equal(true);
  })

  it('should reverse direction upon collision', () => {
    expect(player.isColliding(player.platforms)).to.equal(false);
    player.keyboarder.keyState['65'] = true;
    player.x = 152;
    player.move()
    let beforeCollisionDx = player.dx;

    forOneSecond(player.transport())
    player.move()
    expect(player.isColliding(player.platforms)).to.equal(true);
    expect(player.dx === -beforeCollisionDx).to.equal(true);
  })

  it('should be able to shoot an arrow', () => {
    expect(player.arrows.length === 0).to.equal(true)
    player.arrow();
    expect(player.arrows.length > 0).to.equal(true)
  })

  it('should have less arrows in its quiver after it shoots', () => {
    expect(player.arrows.length === 0).to.equal(true)
    let fullQuiver = player.quiver;
    player.arrow();
    expect(player.arrows.length > 0).to.equal(true)
    expect(player.quiver < fullQuiver).to.equal(true)
  })

  it('should not be able to shoot when the its quiver is empty', () => {
    expect(player.quiver > 0).to.equal(true);
    expect(player.canShoot).to.equal(true);
    player.arrow();
    player.arrow();
    player.arrow();
    expect(player.quiver === 0).to.equal(true);
    expect(player.canShoot).to.equal(true);
    expect(player.arrows.length === 3).to.equal(true);
    player.arrow()
    expect(player.arrows.length === 3).to.equal(true);
  })

  it('should be able to reload its quiver after a delay', () => {
    let fullQuiver = player.quiver;
    expect(player.canReload).to.equal(true)
    player.arrow();
    expect(player.arrows.length > 0).to.equal(true)
    expect(player.quiver < fullQuiver).to.equal(true)
    expect(player.canReload).to.equal(false)

    const checkReload = () => {
      setTimeout(() => {
      expect(player.canReload).to.equal(true)
      expect(player.canShoot).to.equal(true)
      }, 3000)
    };

    checkReload()
  })

  it('should be able to shoot based on keyboard input', () => {
    expect(player.arrows.length === 0).to.equal(true);
    expect(player.keyboarder.keyState['16']).to.equal(false)
    expect(player.canShoot).to.equal(true)
    player.move();
    expect(player.arrows.length === 0).to.equal(true);

    player.keyboarder.keyState['16'] = true;
    player.move();

    expect(player.shooting).to.equal(true)
    expect(player.arrows.length > 0).to.equal(true);
  })

  it('should be dead if it is hit', () => {
    expect(player.dead).to.equal(false);
    player.hit()
    expect(player.dead).to.equal(true);
  })

  it('should lose a life when it is dead', () => {
    let beforeHitLives = player.lives;
    expect(player.dead).to.equal(false);
    player.hit()
    expect(player.dead).to.equal(true);
    expect(player.lives < beforeHitLives)
  })

  it('should be alive again after a time if it has lives left, otherwise dead', () => {
    expect(player.dead).to.equal(false);
    player.hit()
    expect(player.dead).to.equal(true);
    expect(player.lives > 0)

    const checkRespawn = () => {
      setTimeout(() => {
      expect(player.dead).to.equal(false)
      player.hit()
      }, 2000)
    };
    checkRespawn()
   
    const checkAfterThreeHits = () => {
      setTimeout(() => {
        player.hit()
        expect(player.lives === 0).to.equal(true)
        player.hit()
        expect(player.lives === 0).to.equal(true)
        expect(player.dead).to.equal(true)
      }, 2000)
    };
    checkAfterThreeHits()
  })

  it('should be able to collect power up', () => {
    expect(player.powerup == undefined).to.equal(true);

    const powerup = new Powerup()
    player.powerup = powerup;
    player.powerup.x = 100;
    player.powerup.y = 100;

    player.isPoweredUp();
    expect(player.isColliding([player.powerup])).to.equal(false)

    player.powerup.x = 160;
    player.powerup.y = 100;

    expect(player.isColliding([player.powerup])).to.equal(true)
    player.isPoweredUp()
    expect(player.collectPowerup).to.equal(true);
    expect(player.invincible || player.quiver > 3 || player.upgradeSpeed > 0).to.equal(true)

  })

});

//const { expect } = require('chai')
const Player = require('../lib/Player.js')
const Player1 = require('../lib/Player1.js')
const Keyboarder = require('../lib/Keyboarder.js')
const Arrow = require('../lib/Arrow.js')

describe('Player', () => {
  let platforms
  let keyboarder
  let player1

  beforeEach(function() {
    keyboarder = {keyState: {87: false, 65: false, 68:false, 16:false}, isDown: function isDown(keyCode) {
    return this.keyState[keyCode] === true;
  }}
    platforms =[{x: 0, y: 150, width: 400, height: 100}, {x:0, y:0, width:150, height: 150}, {x:250, y:0, width:150, height: 150}]
    player1 = new Player1('ctx', 175, 100, platforms, keyboarder);
  });



  let forOneSecond = action => {
    for (let i=0; i < 60; i++) {
      action
    }
  }

  it('should not be dead at the start of game', () => {
    expect(player1.dead).to.equal(false)
  })

  it('should have a direction', () => {
    expect(player1.direction === 'left' || player1.direction === 'right').to.equal(true)
  })

  it('should have a positive y velocity when subject to gravity', () => {
    forOneSecond(player1.dy = player1.gravity())
    expect(player1.dy > 2).to.equal(true);
  });

  it('should change position based on its velocity', () => {
    let startingPositionY = player1.y;
    let startingPositionX = player1.x;
    player1.dx = 4;

    forOneSecond(player1.transport())
    expect(player1.y > startingPositionY).to.equal(true)
    expect(player1.x > startingPositionX).to.equal(true)
  });

  it('should not have downward velocity when on a platform', () => {
    expect(player1.isOnPlatform).to.equal(false)
    expect(player1.dy > 0).to.equal(true)

    forOneSecond(player1.transport())
    forOneSecond(player1.transport())
    forOneSecond(player1.transport())

    expect(player1.isOnPlatform).to.equal(true)
    expect(player1.dy === 0).to.equal(true)
  })

  it('should be able to jump, but only when on a platform', () => {
    expect(player1.isOnPlatform).to.equal(false);
    expect(player1.jumping).to.equal(false);
    player1.jump()
    expect(player1.jumping).to.equal(false)

    forOneSecond(player1.transport())
    forOneSecond(player1.transport())
    forOneSecond(player1.transport())

    expect(player1.isOnPlatform).to.equal(true);
    expect(player1.jumping).to.equal(false);
    player1.jump()
    expect(player1.jumping).to.equal(true)
  })

  it('should move upwards when jumping', () => {
    forOneSecond(player1.transport())
    forOneSecond(player1.transport())
    forOneSecond(player1.transport())

    let beforeJumpY = player1.y;

    player1.jump()
    expect(player1.jumping).to.equal(true)
    expect(player1.dy < 0).to.equal(true)
    forOneSecond(player1.transport())
    expect(player1.y < beforeJumpY).to.equal(true)
  })

  it('should be able to jump Left and Right', () =>{
    player1.y = 112;
    let beforeJumpX = player1.x;

    player1.jump('left')
    forOneSecond(player1.transport())
    expect(player1.x < beforeJumpX).to.equal(true)

    player1.x = beforeJumpX
    player1.jump('right')
    forOneSecond(player1.transport())
    expect(player1.x > beforeJumpX).to.equal(true)
  })

  it('should jump based on keyboard input',() => { 
    player1.y = 110;
    forOneSecond(player1.transport())
    expect(player1.isOnPlatform).to.equal(true);
    expect(player1.jumping).to.equal(false)

    player1.keyboarder.keyState['87'] = true;
    player1.move();
    expect(player1.jumping).to.equal(true)
  })

  it('should be able to move left based on keyboard input', () => {
    player1.y = 110;
    forOneSecond(player1.transport())
    expect(player1.dx === 0).to.equal(true);
    let startingX = player1.x

    player1.keyboarder.keyState['65'] = true;
    player1.move()
    forOneSecond(player1.transport())
    expect(player1.dx < 0).to.equal(true)
    expect(player1.x < startingX).to.equal(true)
  })

  it('should be able to move right based on keyboard input', () => {
    player1.y = 110;
    forOneSecond(player1.transport())
    expect(player1.dx === 0).to.equal(true);
    let startingX = player1.x

    player1.keyboarder.keyState['68'] = true;
    player1.move()
    forOneSecond(player1.transport())
    expect(player1.dx > 0).to.equal(true)
    expect(player1.x > startingX).to.equal(true)
  })

  it('should detect collisions with walls', () => {
    expect(player1.isColliding(player1.platforms)).to.equal(false);
    player1.x = 140;
    expect(player1.isColliding(player1.platforms)).to.equal(true);

    player1.x = 260;
    expect(player1.isColliding(player1.platforms)).to.equal(true);
  })

  it('should reverse direction upon collision', () => {
    expect(player1.isColliding(player1.platforms)).to.equal(false);
    player1.keyboarder.keyState['65'] = true;
    player1.x = 152;
    player1.move()
    let beforeCollisionDx = player1.dx;

    forOneSecond(player1.transport())
    player1.move()
    expect(player1.isColliding(player1.platforms)).to.equal(true);
    expect(player1.dx === -beforeCollisionDx).to.equal(true);
  })

  it('should be able to shoot an arrow', () => {
    expect(player1.arrows.length === 0).to.equal(true)
    player1.arrow();
    expect(player1.arrows.length > 0).to.equal(true)
  })

  it('should have less arrows in its quiver after it shoots', () => {
    expect(player1.arrows.length === 0).to.equal(true)
    let fullQuiver = player1.quiver;
    player1.arrow();
    expect(player1.arrows.length > 0).to.equal(true)
    expect(player1.quiver < fullQuiver).to.equal(true)
  })

  it('should not be able to shoot when the its quiver is empty', () => {
    expect(player1.quiver > 0).to.equal(true);
    expect(player1.canShoot).to.equal(true);
    player1.arrow();
    player1.arrow();
    player1.arrow();
    expect(player1.quiver === 0).to.equal(true);
    expect(player1.canShoot).to.equal(true);
    expect(player1.arrows.length === 3).to.equal(true);
    player1.arrow()
    expect(player1.arrows.length === 3).to.equal(true);
  })

  it('should be able to reload its quiver after a delay', () => {
    let fullQuiver = player1.quiver;
    expect(player1.canReload).to.equal(true)
    player1.arrow();
    expect(player1.arrows.length > 0).to.equal(true)
    expect(player1.quiver < fullQuiver).to.equal(true)
    expect(player1.canReload).to.equal(false)

    const checkReload = () => {
      setTimeout(() => {
      expect(player1.canReload).to.equal(true)
      expect(player1.canShoot).to.equal(true)
      }, 3000)
    };

    checkReload()
  })

  it('should be able to shoot based on keyboard input', () => {
    expect(player1.arrows.length === 0).to.equal(true);
    expect(player1.keyboarder.keyState['16']).to.equal(false)
    expect(player1.canShoot).to.equal(true)
    player1.move();
    expect(player1.arrows.length === 0).to.equal(true);

    player1.keyboarder.keyState['16'] = true;
    player1.move();

    expect(player1.shooting).to.equal(true)
    expect(player1.arrows.length > 0).to.equal(true);
  })

  it('should be dead if it is hit', () => {
    expect(player1.dead).to.equal(false);
    player1.hit()
    expect(player1.dead).to.equal(true);
  })

  it('should lose a life when it is dead', () => {
    let beforeHitLives = player1.lives;
    expect(player1.dead).to.equal(false);
    player1.hit()
    expect(player1.dead).to.equal(true);
    expect(player1.lives < beforeHitLives)
  })

  it('should be alive again after a time if it has lives left, otherwise dead', () => {
    expect(player1.dead).to.equal(false);
    player1.hit()
    expect(player1.dead).to.equal(true);
    expect(player1.lives > 0)

    const checkRespawn = () => {
      setTimeout(() => {
      expect(player1.dead).to.equal(false)
      player1.hit()
      }, 2000)
    };
    checkRespawn()
   
    const checkAfterThreeHits = () => {
      setTimeout(() => {
        player1.hit()
        expect(player1.lives === 0).to.equal(true)
        player1.hit()
        expect(player1.lives === 0).to.equal(true)
        expect(player1.dead).to.equal(true)
      }, 2000)
    };
    checkAfterThreeHits()
  })



});

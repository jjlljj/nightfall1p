const { expect } = require('chai')
const Player = require('../lib/Player.js')
const Player1 = require('../lib/Player1.js')
const Enemy = require('../lib/Enemy.js')
const Arrow = require('../lib/Arrow.js')

describe ('Enemy', () => {
  let platforms
  let player1
  let enemy

  beforeEach(function() {
    keyboarder = {keyState: {87: false, 65: false, 68:false, 16:false}, isDown: function isDown(keyCode) {
    return this.keyState[keyCode] === true;
  }}
    platforms = [{x: 0, y: 150, width: 400, height: 100}, {x:0, y:0, width:150, height: 150}, {x:250, y:0, width:150, height: 150}]
    player1 = new Player1('ctx', 175, 100, platforms, keyboarder);
    enemy = new Enemy('ctx', platforms)
  });

  let forOneSecond = action => {
    for (let i=0; i < 60; i++) {
      action
    }
  }

  it('should have a direction and a random x coordinate by default', () => {
    let enemy2 = new Enemy('ctx', platforms)
    expect(enemy2.direction === 'right').to.equal(true);
    expect(enemy2.x !== enemy.x).to.equal(true);
  })

  it('should be subject to gravity', () => {
    let beforeFallY = enemy.y;
    expect(enemy.dy === 0).to.equal(true)
    forOneSecond(enemy.transport());
    expect(enemy.dy > 0).to.equal(true);
    expect(beforeFallY < enemy.y).to.equal(true);
  })

  it('should not be subject to gravity when on a platform', () => {
    enemy.y = 100;
    enemy.x = 175;
    enemy.transport()
    expect(enemy.isOnPlatform).to.equal(false)
    expect(enemy.dy > 0).to.equal(true)
    
    forOneSecond(enemy.transport())
    forOneSecond(enemy.transport())
    forOneSecond(enemy.transport())
    forOneSecond(enemy.transport())
    forOneSecond(enemy.transport())
    forOneSecond(enemy.transport())

    expect(enemy.isOnPlatform).to.equal(true)
    expect(enemy.dy === 0).to.equal(true)
  })

  it('should be ambling right when created', () => {
    expect(enemy.dx > 0).to.equal(true)
  })

  it('should know when it collides with a wall and reverse direction', () => { 
    enemy.x = 152;
    enemy.y = 106;
    expect(enemy.isColliding(enemy.platforms)).to.equal(false)
    enemy.dx = -5;
    let beforeCollisionDx = enemy.dx;

    forOneSecond(enemy.transport())
    expect(enemy.isColliding(enemy.platforms)).to.equal(true);
    enemy.transport()
    expect(enemy.dx === -beforeCollisionDx).to.equal(true);
  })

  it('should know when it has been hit by arrows', () => {
    let arrows = [new Arrow(player1), new Arrow(player1)]
    enemy.x = 152;
    enemy.y = 106;
    arrows[1].x = 155;

    expect(enemy.isColliding(arrows)).to.equal(true)
  })


})
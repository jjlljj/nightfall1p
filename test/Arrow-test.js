const { expect } = require('chai')
const Player = require('../lib/Player.js')
const Keyboarder = require('../lib/Keyboarder.js')
const Arrow = require('../lib/Arrow.js')
const Enemy = require('../lib/Enemy.js')

describe('Arrow', () => {
  let platforms
  let keyboarder
  let player
  let arrow

  beforeEach(function() {
    platforms =[{x: 0, y: 150, width: 400, height: 100}, {x:0, y:0, width:150, height: 150}, {x:250, y:0, width:150, height: 150}]
    player = new Player('ctx', 175, 100, platforms, keyboarder);
    arrow = new Arrow(player);
  });

  let forOneSecond = action => {
    for (let i=0; i < 60; i++) {
      action
    }
  }

  it('should fire the same direction of the player', () => {
    player.direction = 'right';
    expect(arrow.x > player.x).to.equal(true);
    expect(arrow.dx > 0).to.equal(true);
  })

  it('should know when it hits a player or enemy', () => {
    let enemy = new Enemy('ctx', platforms)
    enemy.x = 250;
    enemy.y = 100;
    arrow.x = 175;
    arrow.y = 100;
    expect(arrow.isColliding([player, enemy])).to.equal(true);
    arrow.x = 250;
    expect(arrow.isColliding([player, enemy])).to.equal(true);
  })

  it('should be able to take a life off a player when hit', () => {
    expect(player.lives === 3).to.equal(true);
    player.hit();
    expect(player.lives === 2).to.equal(true);
  })

  it('should detect collisions with walls', () => {
    arrow.x = 100;
    arrow.y = 200;
    arrow.platforms = platforms;
    expect(arrow.isColliding(arrow.platforms)).to.equal(true);
  })

  it('should be subject to gravity', () => {
    expect(arrow.dy === -1.5).to.equal(true);
    forOneSecond(arrow.update());
    expect(arrow.dy > -1.5).to.equal(true);
  })

  it('should be subject to drag', () => {
    expect(arrow.dx === 12).to.equal(true);
    forOneSecond(arrow.update());
    expect(arrow.dx < 12).to.equal(true);
  })



})


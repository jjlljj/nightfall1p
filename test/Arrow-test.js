const { expect } = require('chai')
const Player = require('../lib/Player.js')
const Player1 = require('../lib/Player1.js')
const Keyboarder = require('../lib/Keyboarder.js')
const Arrow = require('../lib/Arrow.js')

describe('Arrow', () => {
  let platforms
  let keyboarder
  let player1
  let arrow

  beforeEach(function() {
    platforms =[{x: 0, y: 150, width: 400, height: 100}, {x:0, y:0, width:150, height: 150}, {x:250, y:0, width:150, height: 150}]
    player1 = new Player1('ctx', 175, 100, platforms, keyboarder);
    arrow = new Arrow(player1);
  });

  let forOneSecond = action => {
    for (let i=0; i < 60; i++) {
      action
    }
  }

  it('should fire the same direction of the player', () => {
    player1.direction = 'right';
    expect(arrow.x > player1.x).to.equal(true);
    expect(arrow.dx > 0).to.equal(true);
  })

  it('should be able to take a life off a player when hit', () => {
    expect(player1.lives === 3).to.equal(true);
    player1.hit();
    expect(player1.lives === 2).to.equal(true);
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


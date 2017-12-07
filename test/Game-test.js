const { expect } = require('chai')
const Game = require('../lib/Game.js')
const Player = require('../lib/Player.js')
const Arrow = require('../lib/Arrow.js')
const Enemy = require('../lib/Enemy.js')
global.Image = class {};

describe('Game', () => {  
  const game = new Game('canvas', 'canvas2', 'canvas2', 'ctx', 'ctx2', 'ctx3', 'keyboarder')
  let forOneSecond = action => {
    for (let i=0; i < 60; i++) {
      action
    }
  }

  it('should have two players, and track  enemies & arrows', () => {
    expect(game.player1).to.be.an('object');
    expect(game.player2).to.be.an('object');
    expect(game.enemies).to.be.an('array');
    expect(game.allArrows).to.be.an('array')
  })

  it('should be able to reset the game ', () => {
    game.player1 = new Player('ctx', 100, 100, 'platforms', 'keyboarder');
    const originalPlayer = game.player1;

    game.player1.arrow()
    game.allArrows.push(game.player1.arrows[0])
    expect(game.allArrows.length > 0).to.equal(true);

    game.newGame();

    expect(game.allArrows.length === 0).to.equal(true);
    expect(originalPlayer === game.player1).to.equal(false)
  })

  it('should generate enemies', () => {
    expect(game.enemies.length === 0).to.equal(true)
    this.generateEnemy = true;
    game.enemies.push(new Enemy('ctx', 'platforms'))

    expect(game.enemies.length > 0).to.equal(true)
  })
  
})
const { expect } = require('chai');
const Powerup = require('../lib/Powerup.js');
global.Image = class{};

describe('Powerup', () => {
  

  it('should generate randomly in a spot on the y axis', () => {
    const powerup1 = new Powerup();

    expect(powerup1.y === 175 || powerup1.y === 180 || powerup1.y === 620).to.equal(true);
  });
});
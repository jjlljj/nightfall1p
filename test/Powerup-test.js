const { expect } = require('chai');
const Powerup = require('../lib/Powerup.js');
global.Image = class{};

describe('Powerup', () => {
  

  it('should generate randomly in a spot on the y axis', () => {
    const powerup1 = new Powerup();
    const powerup2 = new Powerup();
    const powerup3 = new Powerup();

    expect(powerup1.y !== powerup2.y || powerup1.y !== powerup3.y || powerup3.y !== powerup2.y).to.equal(true);
  });
});